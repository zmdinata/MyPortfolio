/**
 * chatMemory.js
 * Simple sliding-window conversation memory menggunakan sessionStorage.
 *
 * Fitur:
 * - Menyimpan max N pesan terakhir (sliding window) → konteks AI tetap relevan
 * - TTL (Time-To-Live): otomatis hapus setelah idle 30 menit
 * - sessionStorage: auto-hapus ketika tab/browser ditutup (zero DB cost)
 * - Tidak menyimpan pesan pembuka (greeting) dari AI agar tidak mengisi kuota
 */

const MEMORY_KEY = 'agentz_memory';
const MAX_MESSAGES = 10;       // Simpan maks 10 pesan terakhir (5 user + 5 AI)
const TTL_MS = 30 * 60 * 1000; // 30 menit dalam milidetik

/**
 * Struktur data yang disimpan di sessionStorage:
 * {
 *   messages: [ { sender, text }, ... ],  // Riwayat percakapan (tanpa id)
 *   lastActivity: <timestamp>,             // Waktu interaksi terakhir
 * }
 */

/**
 * Membaca memory dari sessionStorage.
 * Jika sudah kedaluwarsa (TTL habis), otomatis dihapus dan return null.
 *
 * @returns {{ messages: Array, lastActivity: number } | null}
 */
export function loadMemory() {
  try {
    const raw = sessionStorage.getItem(MEMORY_KEY);
    if (!raw) return null;

    const data = JSON.parse(raw);
    const now = Date.now();

    // Cek apakah memory sudah expired (idle > 30 menit)
    if (now - data.lastActivity > TTL_MS) {
      console.log('[Agent-Z Memory] ⏰ Memory expired. Auto-clearing...');
      clearMemory();
      return null;
    }

    return data;
  } catch {
    clearMemory();
    return null;
  }
}

/**
 * Menyimpan daftar pesan ke memory dengan sliding window.
 * Hanya menyimpan MAX_MESSAGES pesan terakhir.
 * Update timestamp lastActivity setiap kali dipanggil.
 *
 * @param {Array} messages - Full messages array dari React state
 */
export function saveMemory(messages) {
  try {
    // Filter: hanya simpan pesan user & AI yang nyata (bukan greeting awal)
    // Ambil N pesan terakhir (sliding window)
    const toStore = messages
      .filter(m => m.sender === 'user' || m.sender === 'ai')
      .slice(-MAX_MESSAGES)
      .map(({ sender, text }) => ({ sender, text })); // Buang 'id', hanya simpan yang perlu

    const data = {
      messages: toStore,
      lastActivity: Date.now(),
    };

    sessionStorage.setItem(MEMORY_KEY, JSON.stringify(data));
  } catch (e) {
    // sessionStorage mungkin penuh atau disabled → abaikan saja
    console.warn('[Agent-Z Memory] Could not save memory:', e.message);
  }
}

/**
 * Menghapus seluruh memory secara manual.
 */
export function clearMemory() {
  sessionStorage.removeItem(MEMORY_KEY);
}

/**
 * Memperbarui timestamp lastActivity tanpa mengubah pesan.
 * Dipanggil setiap kali user membuka chatbot untuk reset TTL.
 */
export function refreshMemoryTTL() {
  try {
    const data = loadMemory();
    if (data) {
      data.lastActivity = Date.now();
      sessionStorage.setItem(MEMORY_KEY, JSON.stringify(data));
    }
  } catch {
    // abaikan
  }
}

/**
 * Mengambil riwayat pesan yang tersimpan (untuk dikirim ke AI sebagai konteks).
 * Hanya ambil pesan yang relevan (bukan greeting awal).
 *
 * @returns {Array} Array pesan dengan format { sender, text }
 */
export function getMemoryMessages() {
  const data = loadMemory();
  return data?.messages ?? [];
}
