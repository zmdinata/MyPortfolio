import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolioContext } from '../../hooks/usePortfolioContext';
import { generateChatResponse } from '../../lib/aiClient';
import { loadMemory, saveMemory, clearMemory, refreshMemoryTTL } from '../../lib/chatMemory';
import { useLang } from '../../context/LangContext';
import { FiMessageSquare, FiSend, FiX, FiTrash2 } from 'react-icons/fi';
import './Chatbot.css';

// Maks riwayat pesan yang dikirim ke AI sebagai konteks (sliding window)
// Dikecilkan ke 6 agar tidak melebihi batas token Groq (6000 TPM)
const CONTEXT_WINDOW = 6;

export default function Chatbot() {
  const { lang } = useLang();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const messagesEndRef = useRef(null);
  const { contextString, isLoading } = usePortfolioContext();

  // Teks bilingual untuk speech bubble maskot
  const speechText = {
    en: "Hi, I'm Agent-Z! Ask me anything about Zacky's work, skills, and experience.",
    id: "Halo, saya Agent-Z! Tanyakan apa saja seputar portofolio, keahlian, dan pengalaman Zacky."
  };

  // ── INISIALISASI: Muat memory dari sessionStorage ──────────────────────
  useEffect(() => {
    const greeting = lang === 'en'
      ? "Hello! I am Agent-Z, the AI assistant for Z. M. Dinata's portfolio. Is there anything you'd like to know about his experience, projects, or skills?"
      : "Halo! Saya adalah Agent-Z, AI asisten untuk portfolio Z. M. Dinata. Ada yang ingin Anda ketahui tentang pengalaman, proyek, atau keahlian beliau?";

    const greetingMsg = { id: 'greeting', text: greeting, sender: 'ai' };

    // Cek apakah ada riwayat percakapan sebelumnya yang belum expired
    const saved = loadMemory();
    if (saved && saved.messages.length > 0) {
      // Restore riwayat + tambahkan greeting di depan
      const restored = saved.messages.map((m, i) => ({ ...m, id: `restored_${i}` }));
      setMessages([greetingMsg, ...restored]);
    } else {
      setMessages([greetingMsg]);
    }
  }, [lang]);

  // ── Refresh TTL setiap kali chatbot dibuka ──────────────────────────────
  useEffect(() => {
    if (isOpen) refreshMemoryTTL();
  }, [isOpen]);

  // ── Auto-scroll ke pesan terbaru ────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // ── Kirim Pesan ─────────────────────────────────────────────────────────
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isOffline) return;

    const userMessage = { id: Date.now(), text: input, sender: 'user' };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');

    // Tampilkan typing indicator segera
    setIsTyping(true);

    // Delay 2 detik agar terasa natural seperti Agent-Z sedang mengetik
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Ambil N pesan terakhir sebagai konteks (sliding window, skip greeting)
    const contextMessages = updatedMessages
      .filter(m => m.id !== 'greeting')
      .slice(-CONTEXT_WINDOW);

    let aiResponseText = await generateChatResponse(contextMessages, {
      profile: contextString,
      contact: contextString,
      education: contextString,
      skills: contextString,
      experience: contextString,
      projects: contextString,
      certifications: contextString,
      awards: contextString,
    }, lang);

    if (aiResponseText.startsWith('TOKEN_LIMIT_REACHED|')) {
      aiResponseText = aiResponseText.replace('TOKEN_LIMIT_REACHED|', '');
      setIsOffline(true);
    }

    const aiMessage = { id: Date.now() + 1, text: aiResponseText, sender: 'ai' };
    const finalMessages = [...updatedMessages, aiMessage];
    setMessages(finalMessages);
    setIsTyping(false);

    // Simpan riwayat ke memory (hanya pesan nyata, bukan greeting)
    const toSave = finalMessages.filter(m => m.id !== 'greeting');
    saveMemory(toSave);
  };

  // ── Hapus Memory ────────────────────────────────────────────────────────
  const handleClearMemory = () => {
    clearMemory();
    const greeting = lang === 'en'
      ? "Hello! I am Agent-Z, the AI assistant for Z. M. Dinata's portfolio. Is there anything you'd like to know about his experience, projects, or skills?"
      : "Halo! Saya adalah Agent-Z, AI asisten untuk portfolio Z. M. Dinata. Ada yang ingin Anda ketahui tentang pengalaman, proyek, atau keahlian beliau?";
    setMessages([{ id: 'greeting', text: greeting, sender: 'ai' }]);
    setIsOffline(false);
  };

  return (
    <div className="chatbot-wrapper">
      {/* ========== CHAT WINDOW ========== */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="chatbot-window"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <button className="chatbot-close-btn" onClick={() => setIsOpen(false)}>
              <FiX size={24} />
            </button>
            <div className="chatbot-header">
              <div className="chatbot-header-title">
                <div className="chatbot-avatar">
                  <img src="/assets/images/agent-z-maskot.png" alt="Agent-Z" />
                </div>
                <div className="chatbot-header-text">
                  <h3>Agent-Z</h3>
                  <span className={`chatbot-status ${isOffline ? 'offline' : 'online'}`}>
                    {isOffline ? 'Offline' : 'Online'}
                  </span>
                </div>
              </div>
              {/* Tombol hapus memory */}
              <button
                className="chatbot-clear-btn"
                onClick={handleClearMemory}
                title={lang === 'en' ? 'Clear conversation' : 'Hapus percakapan'}
              >
                <FiTrash2 size={16} />
              </button>
            </div>
            <div className="chatbot-messages">
              {messages.map((msg) => (
                <div key={msg.id} className={`chatbot-message ${msg.sender}`}>
                  <div className="chatbot-message-content">{msg.text}</div>
                </div>
              ))}
              {isTyping && (
                <div className="chatbot-message ai">
                  <div className="chatbot-message-content typing-indicator">
                    <span /><span /><span />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <form className="chatbot-input-area" onSubmit={handleSend}>
              <input
                type="text"
                placeholder={
                  isOffline
                    ? (lang === 'en' ? 'Agent-Z is offline.' : 'Agent-Z sedang offline.')
                    : isLoading
                    ? (lang === 'en' ? 'Loading data...' : 'Sedang memuat data...')
                    : (lang === 'en' ? 'Type your message...' : 'Ketik pesan Anda...')
                }
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading || isOffline}
              />
              <button type="submit" disabled={isLoading || isOffline || !input.trim()}>
                <FiSend size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========== MASKOT + TOMBOL AREA ========== */}
      <div
        className="agentz-container"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Balon Teks (Kiri Atas Maskot) */}
        <AnimatePresence>
          {isHovered && !isOpen && (
            <motion.div
              className="speech-bubble"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ duration: 0.4, ease: [0.68, -0.55, 0.265, 1.55] }}
            >
              <p>{speechText[lang]}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Wrapper Maskot & Tombol */}
        <div className="mascot-wrapper">

          {/* ===== KONTAINER MELAYANG (body + lengan SAJA, tombol TIDAK) ===== */}
          {!isOpen && (
            <div className="mascot-float-container">
              {/* Layer 1: Tubuh Utama */}
              <img
                src="/assets/images/agent-z-body.png"
                alt="Agent-Z Body"
                className="mascot-body"
              />

              {/* Layer 2: Sistem Kerangka Lengan (Skeletal) */}
              <div className="arm-system">
                {/* Engsel 1: Bahu → Lengan Atas */}
                <div className="upper-arm-joint">
                  <img src="/assets/images/agent-z-upperarm.png" alt="Upper Arm" className="arm-part upper-arm-img" />

                  {/* Engsel 2: Siku → Lengan Bawah */}
                  <div className="forearm-joint">
                    <img src="/assets/images/agent-z-forearm.png" alt="Forearm" className="arm-part forearm-img" />

                    {/* Engsel 3: Pergelangan → Telapak Tangan */}
                    <div className="hand-joint">
                      <img src="/assets/images/agent-z-hand.png" alt="Hand" className="arm-part hand-img" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===== TOMBOL CHAT (STATIS, tidak ikut melayang) ===== */}
          <motion.button
            className={`chatbot-toggle-btn ${isOpen ? 'open' : ''}`}
            onClick={() => setIsOpen(!isOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isOpen ? <FiX size={28} /> : <FiMessageSquare size={24} />}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
