// aiClient.js
// Logika Fallback: Gemini 2.5 Flash (Utama) → Groq (Cadangan) → OpenRouter (Terakhir)
// Setiap request SELALU mencoba Gemini terlebih dahulu.
// Jika Gemini quota habis (429/503), otomatis fallback ke Groq.
// Jika Groq juga habis, fallback terakhir ke OpenRouter.

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-04-17:generateContent";
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

/**
 * Cek apakah error HTTP termasuk kategori "limit/quota habis"
 * Mencakup: 429 (rate limit), 413 (request too large), 503 (overloaded)
 */
function isQuotaError(status, message = '') {
  if (status === 429 || status === 413 || status === 503) return true;
  const msg = message.toLowerCase();
  return msg.includes('rate limit') || msg.includes('quota') || msg.includes('too large') || msg.includes('tpm') || msg.includes('tokens per minute');
}

/**
 * Pesan ramah ketika semua kuota habis — bilingual otomatis
 */
function quotaMessage(lang) {
  return lang === 'en'
    ? "TOKEN_LIMIT_REACHED|I'm sorry, my AI service has reached its usage limit for now. Please try again in a few minutes — I'll be back soon! 🙏"
    : "TOKEN_LIMIT_REACHED|Mohon maaf, layanan AI saya sedang mencapai batas penggunaan saat ini. Silakan coba kembali beberapa menit lagi — saya akan segera kembali! 🙏";
}

/**
 * Membangun system prompt — bahasa dideteksi OTOMATIS dari pesan user
 */
function buildSystemPrompt(portfolioContext, lang) {
  return `You are "Agent-Z", an exclusive virtual AI assistant for Z. M. Dinata's portfolio. Your MAIN task is to answer visitor questions ONLY based on the portfolio information provided below.

STRICT RULES:
1. NEVER answer questions outside the context of Z. M. Dinata (e.g., general knowledge, weather, politics, recipes, etc.). If asked off-topic, politely decline and redirect back to Z. M. Dinata's portfolio.
2. Reply in a formal, professional, yet engaging tone (max 2-3 short paragraphs).
3. LANGUAGE RULE (IMPORTANT): Always detect the language of the user's LATEST message and respond in THAT SAME language. If the user writes in English → respond in English. If the user writes in Indonesian (Bahasa Indonesia) → respond in Indonesian. Do NOT mix languages.
4. You have real-time access to the following portfolio data.

--- Z. M. DINATA PORTFOLIO DATA ---
Profile: ${portfolioContext.profile || "Not available"}
Contact: ${portfolioContext.contact || "Not available"}
Education: ${portfolioContext.education || "Not available"}
Skills: ${portfolioContext.skills || "Not available"}
Experience: ${portfolioContext.experience || "Not available"}
Projects: ${portfolioContext.projects || "Not available"}
Certifications: ${portfolioContext.certifications || "Not available"}
Awards: ${portfolioContext.awards || "Not available"}
-----------------------------------

Remember: Focus exclusively on promoting and explaining Z. M. Dinata professionally. Respond in the SAME language as the user's last message.`;
}

/**
 * Coba panggil Gemini 2.5 Flash API sebagai provider UTAMA.
 */
async function callGemini(messages, portfolioContext, lang) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') throw new Error("GEMINI_KEY_MISSING");

  const systemPrompt = buildSystemPrompt(portfolioContext, lang);

  const historyMessages = messages.map(m => ({
    role: m.sender === 'user' ? 'user' : 'model',
    parts: [{ text: m.text }],
  }));

  const contents = [
    { role: 'user', parts: [{ text: systemPrompt }] },
    { role: 'model', parts: [{ text: 'Understood. I am ready to assist as Agent-Z.' }] },
    ...historyMessages,
  ];

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents,
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 400,
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errMsg = errorData?.error?.message || response.statusText;
    if (isQuotaError(response.status, errMsg)) {
      throw new Error(`GEMINI_QUOTA_EXCEEDED:${response.status}`);
    }
    throw new Error(`Gemini Error: ${response.status} - ${errMsg}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response from Gemini.";
}

/**
 * Coba panggil Groq API sebagai provider CADANGAN.
 */
async function callGroq(messages, portfolioContext, lang) {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_KEY_MISSING");

  const systemPrompt = buildSystemPrompt(portfolioContext, lang);

  const apiMessages = [
    { role: "system", content: systemPrompt },
    ...messages.map(m => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.text,
    })),
  ];

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: apiMessages,
      temperature: 0.3,
      max_tokens: 400,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errMsg = errorData?.error?.message || response.statusText;
    // Tangkap 413 (too large) dan 429 (rate limit) sebagai quota error
    if (isQuotaError(response.status, errMsg)) {
      throw new Error("GROQ_QUOTA_EXCEEDED");
    }
    throw new Error(`Groq Error: ${response.status} - ${errMsg}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

/**
 * Coba panggil OpenRouter API sebagai provider TERAKHIR.
 * Menggunakan model gratis: meta-llama/llama-3.1-8b-instruct:free
 */
async function callOpenRouter(messages, portfolioContext, lang) {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  if (!apiKey || apiKey === 'your_openrouter_api_key_here') throw new Error("OPENROUTER_KEY_MISSING");

  const systemPrompt = buildSystemPrompt(portfolioContext, lang);

  const apiMessages = [
    { role: "system", content: systemPrompt },
    ...messages.map(m => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.text,
    })),
  ];

  const response = await fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://zmdinata.com",  // Wajib untuk OpenRouter
      "X-Title": "Agent-Z Portfolio Chatbot",
    },
    body: JSON.stringify({
      model: "meta-llama/llama-3.1-8b-instruct:free",
      messages: apiMessages,
      temperature: 0.3,
      max_tokens: 400,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errMsg = errorData?.error?.message || response.statusText;
    if (isQuotaError(response.status, errMsg)) {
      throw new Error("OPENROUTER_QUOTA_EXCEEDED");
    }
    throw new Error(`OpenRouter Error: ${response.status} - ${errMsg}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

/**
 * Fungsi utama dengan logika fallback otomatis:
 * 1. Coba Gemini 2.5 Flash terlebih dahulu (setiap request)
 * 2. Jika Gemini quota/limit habis → fallback ke Groq
 * 3. Jika Groq juga habis → fallback ke OpenRouter
 * 4. Jika semua habis → tampilkan pesan offline yang ramah
 */
export async function generateChatResponse(messages, portfolioContext, lang = 'id') {
  // ── LANGKAH 1: Coba Gemini (Primary) ──────────────────────────────────
  try {
    const result = await callGemini(messages, portfolioContext, lang);
    console.log("[Agent-Z] ✅ Provider: Gemini 2.5 Flash");
    return result;
  } catch (geminiError) {
    const isQuota = geminiError.message.startsWith("GEMINI_QUOTA_EXCEEDED");
    const isMissing = geminiError.message === "GEMINI_KEY_MISSING";
    if (isQuota || isMissing) {
      console.warn(`[Agent-Z] ⚠️ Gemini ${isMissing ? 'key missing' : 'quota habis'} → beralih ke Groq...`);
    } else {
      console.warn("[Agent-Z] ⚠️ Gemini error:", geminiError.message, "→ beralih ke Groq...");
    }
  }

  // ── LANGKAH 2: Fallback ke Groq (Cadangan) ────────────────────────────
  try {
    const result = await callGroq(messages, portfolioContext, lang);
    console.log("[Agent-Z] ✅ Provider: Groq (fallback #1)");
    return result;
  } catch (groqError) {
    console.warn("[Agent-Z] ⚠️ Groq error:", groqError.message, "→ beralih ke OpenRouter...");
  }

  // ── LANGKAH 3: Fallback ke OpenRouter (Terakhir) ──────────────────────
  try {
    const result = await callOpenRouter(messages, portfolioContext, lang);
    console.log("[Agent-Z] ✅ Provider: OpenRouter (fallback #2)");
    return result;
  } catch (openRouterError) {
    console.error("[Agent-Z] ❌ OpenRouter juga error:", openRouterError.message);

    // ── LANGKAH 4: Semua gagal → Pesan Offline Ramah ─────────────────
    return quotaMessage(lang);
  }
}
