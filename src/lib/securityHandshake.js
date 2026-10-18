// src/lib/securityHandshake.js
// Client-side & Server-shared handshake utility untuk memverifikasi
// bahwa request chat hanya berasal dari aplikasi portofolio resmi (zmdinata.web.id)
// dan menolak pemanggilan langsung dari Postman, cURL, atau script bot.

export const HANDSHAKE_SECRET = 'zmdinata_agentz_v2_armored_token_2026';

/**
 * Menghasilkan tanda tangan digital deterministik (64-bit Murmur-style hash).
 * Berjalan identik di lingkungan Browser dan Node.js (Vercel Serverless).
 */
export function computeHandshakeSignature(timestamp, messageCount, secret = HANDSHAKE_SECRET) {
  const seedStr = `${timestamp}:${messageCount}:${secret}`;
  let h1 = 0xdeadbeef;
  let h2 = 0x41c64e6d;
  for (let i = 0; i < seedStr.length; i++) {
    const ch = seedStr.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16);
}

/**
 * Membuat paket header keamanan yang wajib disertakan oleh browser
 * saat memanggil POST /api/chat.
 */
export function createHandshakeHeaders(messages = []) {
  const timestamp = Date.now();
  const count = Array.isArray(messages) ? messages.length : 0;
  const signature = computeHandshakeSignature(timestamp, count);

  return {
    'X-Client-Timestamp': String(timestamp),
    'X-Agent-Signature': signature,
    'X-Requested-With': 'PortfolioClient/1.0',
  };
}
