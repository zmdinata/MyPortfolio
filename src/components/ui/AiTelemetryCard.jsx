import React, { useState, useEffect } from 'react';
import { useLang } from '../../context/LangContext';
import { FiCpu, FiActivity, FiMessageSquare, FiArrowUpRight, FiTerminal, FiServer } from 'react-icons/fi';
import { SiPython, SiSupabase, SiDocker } from 'react-icons/si';
import { FaBrain, FaRobot } from 'react-icons/fa';
import { getLocalProfileConfig, DEFAULT_PROFILE_CONFIG } from '../../lib/profileConfig';

export default function AiTelemetryCard() {
  const { lang } = useLang();
  const [prompts, setPrompts] = useState(() => {
    const config = getLocalProfileConfig();
    return Array.isArray(config.agentz_prompts) && config.agentz_prompts.length > 0
      ? config.agentz_prompts
      : DEFAULT_PROFILE_CONFIG.agentz_prompts;
  });

  useEffect(() => {
    const handleProfileUpdate = (e) => {
      if (e.detail?.agentz_prompts && Array.isArray(e.detail.agentz_prompts)) {
        setPrompts(e.detail.agentz_prompts);
      }
    };
    window.addEventListener('profile-updated', handleProfileUpdate);
    return () => window.removeEventListener('profile-updated', handleProfileUpdate);
  }, []);

  const handlePromptClick = (promptText) => {
    // 1. Dispatch custom event for Chatbot.jsx to open and populate input
    window.dispatchEvent(
      new CustomEvent('open-chatbot', {
        detail: { message: promptText },
      })
    );

    // 2. Safe DOM fallback in case chatbot trigger button exists
    const chatbotToggle = document.querySelector('.chatbot-toggle-button, .chatbot-trigger, [aria-label*="chat" i]');
    if (chatbotToggle) {
      chatbotToggle.click();
    }
  };

  const stackItems = [
    { name: 'Hermes & OpenClaw', icon: <FaRobot />, color: '#7c6fff' },
    { name: 'Gemini API', icon: <FaBrain />, color: '#00ddb3' },
    { name: 'n8n Automation', icon: <FiTerminal />, color: '#FF6D5A' },
    { name: 'Python (ML / EDA)', icon: <SiPython />, color: '#3776AB' },
    { name: 'Linux Homelab T440', icon: <FiServer />, color: '#E95420' },
    { name: 'Supabase & Cloud Run', icon: <SiSupabase />, color: '#3ECF8E' },
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
          {prompts.map((p, idx) => {
            const promptText = lang === 'en' ? (p.text_en || p.text_id) : (p.text_id || p.text_en);
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
