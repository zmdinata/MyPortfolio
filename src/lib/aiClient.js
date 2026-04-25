// aiClient.js
// Frontend client yang memanggil Vercel Serverless Function (Backend Proxy)
// API Keys aman tersimpan di Server.

/**
 * Memanggil endpoint backend proxy untuk mendapatkan balasan AI
 * 
 * @param {Array} messages - Daftar pesan historis
 * @param {Object} portfolioContext - Data portofolio
 * @param {string} lang - Bahasa ('id' atau 'en')
 * @returns {Promise<string>} Balasan dari AI
 */
export async function generateChatResponse(messages, portfolioContext, lang = 'id') {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        portfolioContext,
        lang,
      }),
    });

    if (!response.ok) {
      throw new Error(`Server Error: ${response.status}`);
    }

    const data = await response.json();
    return data.reply;
  } catch (error) {
    console.error('[Agent-Z Frontend] Error calling backend proxy:', error);
    
    return lang === 'en'
      ? "TOKEN_LIMIT_REACHED|I'm sorry, my AI service is temporarily unavailable. Please try again in a few minutes!"
      : "TOKEN_LIMIT_REACHED|Mohon maaf, layanan AI saya sedang tidak tersedia sementara. Silakan coba kembali beberapa menit lagi!";
  }
}
