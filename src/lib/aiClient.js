// aiClient.js
// Logika Fallback: Gemini (Utama) → Groq (Cadangan)
// Setiap request SELALU mencoba Gemini terlebih dahulu.
// Jika Gemini quota habis (429), otomatis fallback ke Groq.

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";

/**
 * Membangun system prompt yang sama untuk semua provider AI
 */
function buildSystemPrompt(portfolioContext, lang) {
  return `Kamu adalah "Agent-Z", sebuah AI asisten virtual eksklusif untuk portfolio Z. M. Dinata. Tugas UTAMAMU adalah menjawab pertanyaan pengunjung HANYA berdasarkan informasi portfolio yang diberikan di bawah ini.

ATURAN KETAT:
1. JANGAN PERNAH menjawab pertanyaan di luar konteks Z. M. Dinata (misalnya pertanyaan umum, cuaca, politik, resep, dll). Jika ditanya di luar konteks, tolak dengan sopan dan kembalikan topik ke portfolio Z. M. Dinata.
2. Jawablah dengan nada formal, profesional, namun tetap engaging dan menarik (maksimal 2-3 paragraf singkat).
3. Pengunjung saat ini menggunakan bahasa: ${lang === 'en' ? 'Inggris (English)' : 'Indonesia'}. Kamu HARUS membalas dalam bahasa tersebut.
4. Kamu memiliki akses realtime ke data portfolio berikut.

--- DATA PORTFOLIO Z. M. DINATA ---
Profil: ${portfolioContext.profile || "Tidak tersedia"}
Kontak: ${portfolioContext.contact || "Tidak tersedia"}
Pendidikan: ${portfolioContext.education || "Tidak tersedia"}
Keahlian (Skills): ${portfolioContext.skills || "Tidak tersedia"}
Pengalaman: ${portfolioContext.experience || "Tidak tersedia"}
Proyek: ${portfolioContext.projects || "Tidak tersedia"}
Sertifikasi: ${portfolioContext.certifications || "Tidak tersedia"}
Penghargaan: ${portfolioContext.awards || "Tidak tersedia"}
-----------------------------------

Ingat: Fokus hanya mempromosikan dan menjelaskan Z. M. Dinata secara profesional.`;
}

/**
 * Coba panggil Gemini API sebagai provider UTAMA.
 * Melempar error jika kuota habis (HTTP 429 / 503).
 */
async function callGemini(messages, portfolioContext, lang) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_KEY_MISSING");

  const systemPrompt = buildSystemPrompt(portfolioContext, lang);

  // Format riwayat pesan ke format Gemini (role: user / model)
  const historyMessages = messages.map(m => ({
    role: m.sender === 'user' ? 'user' : 'model',
    parts: [{ text: m.text }],
  }));

  // Sisipkan system prompt sebagai pesan pertama dari 'user' lalu 'model' ack
  const contents = [
    { role: 'user', parts: [{ text: systemPrompt }] },
    { role: 'model', parts: [{ text: 'Mengerti. Saya siap membantu sebagai Agent-Z.' }] },
    ...historyMessages,
  ];

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents,
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 500,
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const status = response.status;
    // 429 = quota habis, 503 = overloaded — trigger fallback
    if (status === 429 || status === 503) {
      throw new Error(`GEMINI_QUOTA_EXCEEDED:${status}`);
    }
    throw new Error(`Gemini API Error: ${status} - ${errorData?.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "Tidak ada respons dari Gemini.";
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
      max_tokens: 500,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const status = response.status;
    const isTokenLimit =
      status === 429 ||
      (errorData?.error?.message || '').toLowerCase().includes('rate limit') ||
      (errorData?.error?.message || '').toLowerCase().includes('quota');

    if (isTokenLimit) {
      throw new Error("GROQ_QUOTA_EXCEEDED");
    }
    throw new Error(`Groq API Error: ${status} - ${errorData?.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

/**
 * Fungsi utama dengan logika fallback otomatis:
 * 1. Coba Gemini terlebih dahulu (setiap request)
 * 2. Jika Gemini quota habis → fallback ke Groq
 * 3. Jika Groq juga habis → tampilkan pesan offline
 *
 * @param {Array} messages - Daftar pesan historis
 * @param {Object} portfolioContext - Data portofolio
 * @param {string} lang - Bahasa ('id' atau 'en')
 * @returns {Promise<string>} Balasan dari AI
 */
export async function generateChatResponse(messages, portfolioContext, lang = 'id') {
  // ── LANGKAH 1: Coba Gemini (Primary) ──────────────────────────────────
  try {
    const result = await callGemini(messages, portfolioContext, lang);
    console.log("[Agent-Z] ✅ Menggunakan: Gemini");
    return result;
  } catch (geminiError) {
    const isQuotaError = geminiError.message.startsWith("GEMINI_QUOTA_EXCEEDED");
    const isMissingKey = geminiError.message === "GEMINI_KEY_MISSING";

    if (!isQuotaError && !isMissingKey) {
      // Error lain (network, dsb) — log tapi tetap coba Groq
      console.warn("[Agent-Z] ⚠️ Gemini error (non-quota):", geminiError.message);
    } else {
      console.warn("[Agent-Z] ⚠️ Gemini quota habis atau key tidak ada. Beralih ke Groq...");
    }
  }

  // ── LANGKAH 2: Fallback ke Groq (Cadangan) ────────────────────────────
  try {
    const result = await callGroq(messages, portfolioContext, lang);
    console.log("[Agent-Z] ✅ Menggunakan: Groq (fallback)");
    return result;
  } catch (groqError) {
    const isGroqQuota = groqError.message === "GROQ_QUOTA_EXCEEDED";
    console.error("[Agent-Z] ❌ Groq juga error:", groqError.message);

    // ── LANGKAH 3: Keduanya gagal → Pesan Offline ─────────────────────
    if (isGroqQuota) {
      return `TOKEN_LIMIT_REACHED|${
        lang === 'en'
          ? "Sorry, both AI services have reached their daily limits. Please try again later."
          : "Maaf, kedua layanan AI sudah mencapai batas harian. Silakan coba lagi nanti."
      }`;
    }

    return lang === 'en'
      ? `A technical error occurred. Please try again later. (${groqError.message})`
      : `Terjadi kendala teknis. Silakan coba lagi nanti. (${groqError.message})`;
  }
}
