import React from 'react';
import { useLang } from '../../context/LangContext';
import { FiCpu, FiActivity, FiMessageSquare, FiArrowUpRight, FiTerminal, FiServer } from 'react-icons/fi';
import { SiPython, SiSupabase, SiDocker } from 'react-icons/si';
import { FaBrain, FaRobot } from 'react-icons/fa';

export default function AiTelemetryCard() {
  const { lang } = useLang();

  const handlePromptClick = (promptText) => {
    const chatbotToggle = document.querySelector('.chatbot-toggle-button, .chatbot-trigger, [aria-label*="chat" i]');
    if (chatbotToggle) {
      chatbotToggle.click();
    }
    setTimeout(() => {
      const input = document.querySelector('.chatbot-input input, .chatbot-input textarea, input[placeholder*="tanya" i], input[placeholder*="ask" i]');
      if (input) {
        input.value = promptText;
        input.focus();
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }, 300);
  };

  const stackItems = [
    { name: 'Hermes & OpenClaw', icon: <FaRobot />, color: '#7c6fff' },
    { name: 'Gemini API', icon: <FaBrain />, color: '#00ddb3' },
    { name: 'n8n Automation', icon: <FiTerminal />, color: '#FF6D5A' },
    { name: 'Python (ML / EDA)', icon: <SiPython />, color: '#3776AB' },
    { name: 'Linux Homelab T440', icon: <FiServer />, color: '#E95420' },
    { name: 'Supabase & Cloud Run', icon: <SiSupabase />, color: '#3ECF8E' },
  ];

  const suggestedPrompts = [
    {
      text_id: 'Ceritakan proyek Agent-Z Homelab di ThinkPad T440',
      text_en: 'Tell me about Agent-Z Homelab on ThinkPad T440',
    },
    {
      text_id: 'Bagaimana riset prediksi harga tiket di SISFOTEK?',
      text_en: 'How was the flight price prediction research done at SISFOTEK?',
    },
    {
      text_id: 'Apa itu proyek LestariRimba & RimbaPulse AI?',
      text_en: 'What is LestariRimba & RimbaPulse AI prototype?',
    },
  ];

  return (
    <div className="ai-telemetry-container">
      {/* Header bar */}
      <div className="telemetry-header">
        <div className="telemetry-badge">
          <span className="telemetry-beacon" />
          <span className="telemetry-status-text">
            {lang === 'en' ? 'AI Homelab Online' : 'AI Homelab Online'}
          </span>
        </div>
        <div className="telemetry-latency">
          <FiActivity className="latency-icon" />
          <span>ThinkPad T440 • 18ms</span>
        </div>
      </div>

      {/* Core AI Tech Stack Grid */}
      <div className="telemetry-section">
        <div className="telemetry-section-title">
          <FiCpu /> {lang === 'en' ? 'Active AI Stack & Tooling' : 'Stack & Tooling Aktif AI'}
        </div>
        <div className="telemetry-stack-tags">
          {stackItems.map((item, idx) => (
            <span key={idx} className="telemetry-tag">
              <span className="tag-icon" style={{ color: item.color }}>
                {item.icon}
              </span>
              <span className="tag-name">{item.name}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Agent-Z Integration Hub */}
      <div className="telemetry-section prompts-section">
        <div className="telemetry-section-title">
          <FiMessageSquare /> {lang === 'en' ? 'Ask Agent-Z About Zacky' : 'Tanya Agent-Z Seputar Zacky'}
        </div>
        <div className="telemetry-prompts-list">
          {suggestedPrompts.map((p, idx) => {
            const promptText = lang === 'en' ? p.text_en : p.text_id;
            return (
              <button
                key={idx}
                type="button"
                className="telemetry-prompt-item"
                onClick={() => handlePromptClick(promptText)}
              >
                <span className="prompt-text">{promptText}</span>
                <FiArrowUpRight className="prompt-arrow" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
