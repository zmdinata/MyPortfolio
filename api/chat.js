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

async function callGroq(messages, portfolioContext, lang) {
  const apiKey = process.env.VITE_GROQ_API_KEY;
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
    if (isQuotaError(response.status, errMsg)) {
      throw new Error("GROQ_QUOTA_EXCEEDED");
    }
    throw new Error(`Groq Error: ${response.status} - ${errMsg}`);
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

  const response = await fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://zmdinata.com",
      "X-Title": "Agent-Z Portfolio Chatbot",
    },
    body: JSON.stringify({
      model: "meta-llama/llama-3.2-3b-instruct:free",
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

// Handler utama Serverless Vercel
export default async function handler(req, res) {
  // Hanya terima POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { messages, portfolioContext, lang } = req.body;

  try {
    const result = await callGemini(messages, portfolioContext, lang);
    console.log("[Agent-Z Server] ✅ Provider: Gemini 2.5 Flash");
    return res.status(200).json({ reply: result });
  } catch (geminiError) {
    console.warn("[Agent-Z Server] ⚠️ Gemini error:", geminiError.message, "➔ beralih ke Groq...");
  }

  try {
    const result = await callGroq(messages, portfolioContext, lang);
    console.log("[Agent-Z Server] ✅ Provider: Groq");
    return res.status(200).json({ reply: result });
  } catch (groqError) {
    console.warn("[Agent-Z Server] ⚠️ Groq error:", groqError.message, "➔ beralih ke OpenRouter...");
  }

  try {
    const result = await callOpenRouter(messages, portfolioContext, lang);
    console.log("[Agent-Z Server] ✅ Provider: OpenRouter");
    return res.status(200).json({ reply: result });
  } catch (openRouterError) {
    console.error("[Agent-Z Server] ❌ Semua provider gagal:", openRouterError.message);
    return res.status(200).json({ reply: quotaMessage(lang) });
  }
}
