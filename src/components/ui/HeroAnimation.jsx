import React from 'react';

const HeroAnimation = () => {
  return (
    <div className="hero-animation-container">
      <svg 
        viewBox="0 0 1440 800" 
        width="100%" 
        height="100%" 
        xmlns="http://www.w3.org/2000/svg" 
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Efek Glow yang lebih halus agar cocok di Light & Dark Mode */}
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          
          {/* DESAIN BARU: AI Core Drone (Menggantikan Robot Lama) */}
          <g id="flying-ai-core">
            {/* Cincin Orbit / Data Rings */}
            <ellipse cx="0" cy="0" rx="22" ry="8" fill="none" stroke="var(--accent-secondary)" strokeWidth="1.5" transform="rotate(15)" opacity="0.6"/>
            <ellipse cx="0" cy="0" rx="16" ry="26" fill="none" stroke="var(--accent-primary)" strokeWidth="1.5" transform="rotate(-45)" opacity="0.4"/>
            
            {/* Inti Robot (Core) */}
            <circle cx="0" cy="0" r="10" fill="var(--bg-primary)" stroke="var(--accent-primary)" strokeWidth="2.5" />
            
            {/* Mata/Sinyal AI */}
            <circle cx="0" cy="0" r="3.5" fill="var(--accent-secondary)" filter="url(#glow)" />
            
            {/* Node Saraf Melayang di sekitar Drone */}
            <circle cx="-25" cy="-10" r="1.5" fill="var(--text-primary)" opacity="0.8" />
            <circle cx="20" cy="15" r="1.5" fill="var(--text-primary)" opacity="0.8" />
            
            {/* Ekor Cahaya / Thruster */}
            <path d="M -5 12 L 0 22 L 5 12 Z" fill="var(--accent-primary)" opacity="0.5" filter="url(#glow)"/>
          </g>

          <style>
            {`
              .hero-animation-container {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 0;
                overflow: hidden;
                /* Opacity disesuaikan agar tidak menabrak teks */
                opacity: 0.6; 
              }
              
              /* Animasi aliran data di akar */
              .circuit-pulse {
                  stroke-dasharray: 12 24;
                  animation: flowPulse 2.5s linear infinite;
              }
              @keyframes flowPulse {
                  to { stroke-dashoffset: -36; }
              }

              /* Animasi melayang yang lebih smooth */
              .robot-1 { animation: float1 22s ease-in-out infinite alternate; }
              .robot-2 { animation: float2 28s ease-in-out infinite alternate; }
              .robot-3 { animation: float3 20s ease-in-out infinite alternate; }

              @keyframes float1 {
                  0% { transform: translate(150px, 600px) scale(0.8); }
                  33% { transform: translate(600px, 250px) scale(1); }
                  66% { transform: translate(1000px, 450px) scale(0.9); }
                  100% { transform: translate(1250px, 150px) scale(1.1); }
              }
              @keyframes float2 {
                  0% { transform: translate(1300px, 650px) scale(1.2); }
                  50% { transform: translate(750px, 350px) scale(0.8); }
                  100% { transform: translate(100px, 200px) scale(1); }
              }
              @keyframes float3 {
                  0% { transform: translate(400px, 750px) scale(0.7); }
                  50% { transform: translate(850px, 150px) scale(0.9); }
                  100% { transform: translate(1150px, 650px) scale(0.8); }
              }
              
              /* Responsivitas Mobile */
              @media (max-width: 768px) {
                .circuit-root-left {
                  /* Membawa akar ke tengah karena di HP sisi pinggir layar terpotong */
                  transform: translateX(380px) scale(0.75);
                  opacity: 0.3;
                }
                .circuit-root-right {
                  /* Membawa akar ke tengah karena di HP sisi pinggir layar terpotong */
                  transform: translateX(-380px) scale(0.75);
                  opacity: 0.3;
                }
                .hero-animation-container {
                  opacity: 0.45;
                }
                /* Mengurangi jumlah robot di mobile agar tidak berat */
                .robot-3 {
                  display: none;
                }
              }
            `}
          </style>
        </defs>

        {/* ================= AKAR & OTAK KIRI ================= */}
        <g className="circuit-root-left">
          {/* Garis Akar Saraf */}
          <g stroke="var(--accent-primary)" fill="none" strokeWidth="1.5" opacity="0.4">
            <path d="M 120 150 L 120 250 L 200 330 L 200 500 L 150 550 L 150 700" />
            <path d="M 120 150 L 50 220 L 50 400 L 100 450 L 100 650" />
            <path d="M 120 150 L 180 200 L 250 200 L 300 250 L 300 400" />
            
            {/* Titik-titik persimpangan (Nodes) */}
            <circle cx="120" cy="250" r="3" fill="var(--bg-primary)" strokeWidth="2"/>
            <circle cx="200" cy="330" r="3" fill="var(--bg-primary)" strokeWidth="2"/>
            <circle cx="50" cy="400" r="3" fill="var(--bg-primary)" strokeWidth="2"/>
          </g>

          {/* Garis Animasi Aliran Data */}
          <path className="circuit-pulse" stroke="var(--accent-secondary)" strokeWidth="2.5" fill="none" filter="url(#glow)" d="M 120 150 L 120 250 L 200 330 L 200 500 L 150 550 L 150 700" />
          
          {/* DESAIN BARU: Neural Brain Kiri */}
          <g transform="translate(60, 60) scale(1.6)" fill="none" stroke="var(--accent-primary)" strokeWidth="1.5" filter="url(#glow)">
            {/* Pola luar otak */}
            <path d="M25,45 C12,42 5,28 12,16 C18,5 32,5 38,16 C45,28 38,42 25,45 Z" fill="var(--bg-secondary)" opacity="0.5"/>
            {/* Jaringan saraf di dalam otak */}
            <path d="M25,45 L25,30 L15,20 M25,30 L35,20 L25,12 M15,20 L25,12" stroke="var(--accent-secondary)" strokeWidth="1"/>
            <circle cx="25" cy="30" r="2" fill="var(--accent-primary)"/>
            <circle cx="15" cy="20" r="1.5" fill="var(--text-primary)"/>
            <circle cx="35" cy="20" r="1.5" fill="var(--text-primary)"/>
            <circle cx="25" cy="12" r="2" fill="var(--accent-secondary)"/>
          </g>
        </g>

        {/* ================= AKAR & OTAK KANAN ================= */}
        <g className="circuit-root-right">
          {/* Garis Akar Saraf */}
          <g stroke="var(--accent-secondary)" fill="none" strokeWidth="1.5" opacity="0.4">
            <path d="M 1320 150 L 1320 250 L 1240 330 L 1240 500 L 1290 550 L 1290 700" />
            <path d="M 1320 150 L 1390 220 L 1390 400 L 1340 450 L 1340 650" />
            <path d="M 1320 150 L 1260 200 L 1190 200 L 1140 250 L 1140 400" />
            
            {/* Titik-titik persimpangan (Nodes) */}
            <circle cx="1320" cy="250" r="3" fill="var(--bg-primary)" strokeWidth="2"/>
            <circle cx="1240" cy="330" r="3" fill="var(--bg-primary)" strokeWidth="2"/>
            <circle cx="1390" cy="400" r="3" fill="var(--bg-primary)" strokeWidth="2"/>
          </g>

          {/* Garis Animasi Aliran Data */}
          <path className="circuit-pulse" stroke="var(--accent-primary)" strokeWidth="2.5" fill="none" filter="url(#glow)" d="M 1320 150 L 1320 250 L 1240 330 L 1240 500 L 1290 550 L 1290 700" />
          
          {/* DESAIN BARU: Neural Brain Kanan */}
          <g transform="translate(1270, 60) scale(1.6)" fill="none" stroke="var(--accent-secondary)" strokeWidth="1.5" filter="url(#glow)">
            {/* Pola luar otak */}
            <path d="M25,45 C12,42 5,28 12,16 C18,5 32,5 38,16 C45,28 38,42 25,45 Z" fill="var(--bg-secondary)" opacity="0.5"/>
            {/* Jaringan saraf di dalam otak */}
            <path d="M25,45 L25,30 L15,20 M25,30 L35,20 L25,12 M15,20 L25,12" stroke="var(--accent-primary)" strokeWidth="1"/>
            <circle cx="25" cy="30" r="2" fill="var(--accent-secondary)"/>
            <circle cx="15" cy="20" r="1.5" fill="var(--text-primary)"/>
            <circle cx="35" cy="20" r="1.5" fill="var(--text-primary)"/>
            <circle cx="25" cy="12" r="2" fill="var(--accent-primary)"/>
          </g>
        </g>

        {/* ================= AI DRONES TERBANG ================= */}
        <use href="#flying-ai-core" className="robot-1" />
        <use href="#flying-ai-core" className="robot-2" />
        <use href="#flying-ai-core" className="robot-3" />
        
      </svg>
    </div>
  );
};

export default HeroAnimation;
