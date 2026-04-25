// api/chat.js
// Vercel Serverless Function - Backend Proxy untuk Agent-Z
// Menyembunyikan API Keys dari browser pengunjung.

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-04-17:generateContent";
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

function isQuotaError(status, message = '') {
  if (status === 429 || status === 413 || status === 503) return true;
  const msg = message.toLowerCase();
  return msg.includes('rate limit') || msg.includes('quota') || msg.includes('too large') || msg.includes('tpm') || msg.includes('tokens per minute');
}

function quotaMessage(lang) {
  return lang === 'en'
    ? "TOKEN_LIMIT_REACHED|I'm sorry, my AI service has reached its usage limit for now. Please try again in a few minutes — I'll be back soon! 🙏"
    : "TOKEN_LIMIT_REACHED|Mohon maaf, layanan AI saya sedang mencapai batas penggunaan saat ini. Silakan coba kembali beberapa menit lagi — saya akan segera kembali! 🙏";
}

function buildSystemPrompt(portfolioContext, lang) {
  let contextText = "";
  
  // Deteksi jika semua field berisi string yang sama (akibat duplikasi dari frontend)
  const values = Object.values(portfolioContext).filter(v => typeof v === 'string' && v.trim() !== "");
  const uniqueValues = [...new Set(values)];
  
  if (uniqueValues.length === 1 && uniqueValues[0] !== "Not available") {
    // Jika semua field sama, cetak 1x saja dan batasi ke 4000 karakter (~1000 token)
    contextText = `--- Z. M. DINATA PORTFOLIO DATA ---
${uniqueValues[0].substring(0, 4000)}
-----------------------------------`;
  } else {
    // Jika datanya rapi per kategori, batasi max 1000 karakter per bagian
    contextText = `--- Z. M. DINATA PORTFOLIO DATA ---
Profile: ${(portfolioContext.profile || "Not available").substring(0, 1000)}
Contact: ${(portfolioContext.contact || "Not available").substring(0, 1000)}
Education: ${(portfolioContext.education || "Not available").substring(0, 1000)}
Skills: ${(portfolioContext.skills || "Not available").substring(0, 1000)}
Experience: ${(portfolioContext.experience || "Not available").substring(0, 1000)}
Projects: ${(portfolioContext.projects || "Not available").substring(0, 1000)}
Certifications: ${(portfolioContext.certifications || "Not available").substring(0, 1000)}
Awards: ${(portfolioContext.awards || "Not available").substring(0, 1000)}
-----------------------------------`;
  }

  return `You are "Agent-Z", an exclusive virtual AI assistant for Z. M. Dinata's portfolio. Your MAIN task is to answer visitor questions ONLY based on the portfolio information provided below.

STRICT RULES:
1. NEVER answer questions outside the context of Z. M. Dinata (e.g., general knowledge, weather, politics, recipes, etc.). If asked off-topic, politely decline and redirect back to Z. M. Dinata's portfolio.
2. Reply in a formal, professional, yet engaging tone (max 2-3 short paragraphs).
3. LANGUAGE RULE (IMPORTANT): Always detect the language of the user's LATEST message and respond in THAT SAME language. If the user writes in English → respond in English. If the user writes in Indonesian (Bahasa Indonesia) → respond in Indonesian. Do NOT mix languages.
4. You have real-time access to the following portfolio data.

${contextText}

Remember: Focus exclusively on promoting and explaining Z. M. Dinata professionally. Respond in the SAME language as the user's last message.`;
}

async function callGemini(messages, portfolioContext, lang) {
  const apiKey = process.env.VITE_GEMINI_API_KEY;
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

async function callGroq(messages, portfolioContext, lang, keyIndex = 1) {
  const envKeyName = keyIndex === 1 ? 'VITE_GROQ_API_KEY' : 'VITE_GROQ_API_KEY_2';
  const apiKey = process.env[envKeyName];
  if (!apiKey || apiKey === 'your_groq_api_key_here') throw new Error(`GROQ_KEY_${keyIndex}_MISSING`);

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
    if (isQuotaError(response.status, errMsg)) {
      throw new Error(`GROQ_QUOTA_EXCEEDED_KEY_${keyIndex}`);
    }
    throw new Error(`Groq Key #${keyIndex} Error: ${response.status} - ${errMsg}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

async function callOpenRouter(messages, portfolioContext, lang) {
  const apiKey = process.env.VITE_OPENROUTER_API_KEY;
  if (!apiKey || apiKey === 'your_openrouter_api_key_here') throw new Error("OPENROUTER_KEY_MISSING");

  const systemPrompt = buildSystemPrompt(portfolioContext, lang);

  const apiMessages = [
    { role: "system", content: systemPrompt },
    ...messages.map(m => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.text,
    })),
  ];

  // Tambahkan Timeout 30 Detik menggunakan AbortController
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://zmdinata.com",
        "X-Title": "Agent-Z Portfolio Chatbot",
      },
      body: JSON.stringify({
        model: "openrouter/free",
        messages: apiMessages,
        temperature: 0.3,
        max_tokens: 400,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

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
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error("OPENROUTER_TIMEOUT");
    }
    throw err;
  }
}

// Handler utama Serverless Vercel
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { messages, portfolioContext, lang } = req.body;

  // ── 1. Coba Gemini ──────────────────────────────────────────
  try {
    const result = await callGemini(messages, portfolioContext, lang);
    return res.status(200).json({ reply: result });
  } catch (geminiError) {
    console.warn("[Agent-Z Server] ⚠️ Gemini gagal, beralih ke Groq Key #1...");
  }

  // ── 2. Coba Groq Key #1 ─────────────────────────────────────
  try {
    const result = await callGroq(messages, portfolioContext, lang, 1);
    return res.status(200).json({ reply: result });
  } catch (groqError1) {
    console.warn(`[Agent-Z Server] ⚠️ Groq Key #1 gagal (${groqError1.message}), beralih ke Groq Key #2...`);
  }

  // ── 3. Coba Groq Key #2 ─────────────────────────────────────
  try {
    const result = await callGroq(messages, portfolioContext, lang, 2);
    return res.status(200).json({ reply: result });
  } catch (groqError2) {
    console.warn(`[Agent-Z Server] ⚠️ Groq Key #2 gagal (${groqError2.message}), beralih ke OpenRouter...`);
  }

  // ── 4. Coba OpenRouter (Dengan Timeout 30s) ─────────────────
  try {
    const result = await callOpenRouter(messages, portfolioContext, lang);
    return res.status(200).json({ reply: result });
  } catch (openRouterError) {
    if (openRouterError.message === "OPENROUTER_TIMEOUT") {
      console.error("[Agent-Z Server] ❌ OpenRouter Timeout setelah 30 detik.");
    } else {
      console.error("[Agent-Z Server] ❌ Semua provider gagal:", openRouterError.message);
    }
    
    // Kembalikan pesan ramah jika timeout/limit
    return res.status(200).json({ reply: quotaMessage(lang) });
  }
}
