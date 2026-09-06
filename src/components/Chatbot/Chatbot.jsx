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

  // ── Listener Event Kustom 'open-chatbot' (dari Profile Deck / Hero Actions) ──
  useEffect(() => {
    const handleOpenChatbot = (event) => {
      setIsOpen(true);
      if (event?.detail?.message) {
        setInput(event.detail.message);
      }
    };
    window.addEventListener('open-chatbot', handleOpenChatbot);
    return () => window.removeEventListener('open-chatbot', handleOpenChatbot);
  }, []);

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
      ? "Chat history cleared. How can I help you next?"
      : "Riwayat percakapan telah dibersihkan. Ada yang bisa saya bantu selanjutnya?";
    setMessages([{ id: 'greeting', text: greeting, sender: 'ai' }]);
  };

  return (
    <div className="chatbot-wrapper">
      {/* Tombol Floating / Trigger */}
      {!isOpen && (
        <div 
          className="chatbot-trigger-container"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <AnimatePresence>
            {isHovered && (
              <motion.div
                className="chatbot-speech-bubble"
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                {speechText[lang] || speechText.en}
              </motion.div>
            )}
          </AnimatePresence>

          <button
            className="chatbot-toggle-button"
            onClick={() => setIsOpen(true)}
            aria-label="Open Agent-Z AI Chat"
          >
            <span className="chatbot-pulse-ring" />
            <img 
              src="/assets/images/preview.png" 
              alt="Agent-Z Mascot" 
              className="chatbot-mascot-img"
              onError={(e) => {
                e.target.style.display = 'none';
              }} 
            />
            <FiMessageSquare className="chatbot-icon-fallback" />
          </button>
        </div>
      )}

      {/* Jendela Chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="chatbot-window"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {/* Header */}
            <div className="chatbot-header">
              <div className="chatbot-header-left">
                <div className="chatbot-status-dot" />
                <div>
                  <h3 className="chatbot-title">Agent-Z</h3>
                  <p className="chatbot-subtitle">
                    {lang === 'en' ? 'AI Portfolio Assistant' : 'Asisten AI Portofolio'}
                  </p>
                </div>
              </div>
              <div className="chatbot-header-actions">
                <button
                  className="chatbot-action-btn"
                  onClick={handleClearMemory}
                  title={lang === 'en' ? 'Clear history' : 'Bersihkan riwayat'}
                >
                  <FiTrash2 />
                </button>
                <button
                  className="chatbot-action-btn"
                  onClick={() => setIsOpen(false)}
                  title={lang === 'en' ? 'Close chat' : 'Tutup chat'}
                >
                  <FiX />
                </button>
              </div>
            </div>

            {/* Area Pesan */}
            <div className="chatbot-messages">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`chat-bubble-row ${msg.sender === 'user' ? 'user-row' : 'ai-row'}`}
                >
                  {msg.sender === 'ai' && (
                    <div className="chat-avatar">
                      <span>Z</span>
                    </div>
                  )}
                  <div className={`chat-bubble ${msg.sender === 'user' ? 'user-bubble' : 'ai-bubble'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="chat-bubble-row ai-row">
                  <div className="chat-avatar">
                    <span>Z</span>
                  </div>
                  <div className="chat-bubble ai-bubble typing-bubble">
                    <span className="dot" />
                    <span className="dot" />
                    <span className="dot" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form className="chatbot-input-form" onSubmit={handleSend}>
              <input
                type="text"
                className="chatbot-input"
                placeholder={
                  isOffline
                    ? (lang === 'en' ? 'AI is offline (token limit reached)...' : 'AI sedang offline (limit token)...')
                    : (lang === 'en' ? 'Ask Agent-Z anything...' : 'Tanyakan apa saja pada Agent-Z...')
                }
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isOffline || isLoading}
              />
              <button
                type="submit"
                className="chatbot-send-btn"
                disabled={!input.trim() || isOffline || isLoading}
                aria-label="Send message"
              >
                <FiSend />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
