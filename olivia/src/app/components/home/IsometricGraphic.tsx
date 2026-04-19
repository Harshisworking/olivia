"use client";

import React from 'react';

const techIcons = [
    { name: 'MongoDB', top: '15%', left: '5%', color: '#47A248' },
    { name: 'Express', top: '5%', left: '55%', color: '#eeeeee' },
    { name: 'React', top: '25%', left: '80%', color: '#61DAFB' },
    { name: 'Node.js', top: '50%', left: '75%', color: '#339933' },
];

export const IsometricGraphic: React.FC = () => {
    return (
        <div className="graphic-container">
            {/* Purity Check: This SVG replaces the missing PNG. 
         It creates an isometric server rack shape using SVG paths.
      */}
            <div className="main-illustration">
                <svg viewBox="0 0 200 200" className="server-svg">
                    {/* Base Shadow */}
                    <ellipse cx="100" cy="160" rx="60" ry="30" fill="rgba(56, 189, 248, 0.15)" filter="blur(10px)" />

                    {/* Isometric Box (Server Rack) */}
                    <path d="M100 50 L160 80 L160 150 L100 180 L40 150 L40 80 Z" fill="#1e293b" stroke="#334155" strokeWidth="2" />
                    <path d="M100 50 L160 80 L100 110 L40 80 Z" fill="#334155" /> {/* Top Lid */}
                    <path d="M100 110 L160 80 L160 150 L100 180 Z" fill="#0f172a" opacity="0.5" /> {/* Right Side */}

                    {/* Glowing Front Panel Detail */}
                    <rect x="60" y="95" width="5" height="40" fill="#0ea5e9" rx="2">
                        <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
                    </rect>
                    <path d="M75 100 L90 100" stroke="#334155" strokeWidth="2" />
                    <path d="M75 110 L90 110" stroke="#334155" strokeWidth="2" />
                    <path d="M75 120 L90 120" stroke="#334155" strokeWidth="2" />
                </svg>

                <div className="server-label">
                    <strong>DRAGOULTRA</strong>
                    <span>BARE-METAL NODE</span>
                </div>
            </div>

            {/* Floating Tech Badges */}
            {techIcons.map((tech) => (
                <div
                    key={tech.name}
                    className="tech-badge"
                    style={{ top: tech.top, left: tech.left }}
                >
                    <div className="icon-glow" style={{ backgroundColor: tech.color }} />
                    {tech.name}
                </div>
            ))}

            {/* Activity Orbs (Glow effects) */}
            <div className="orb orange" />
            <div className="orb cyan" />

            <style jsx>{`
        .graphic-container {
          position: relative;
          width: 100%;
          max-width: 500px;
          height: 400px;
          margin: 0 auto;
        }

        .main-illustration {
          position: relative;
          z-index: 10;
          width: 300px;
          margin: 0 auto;
        }

        .server-svg {
          width: 100%;
          height: auto;
          filter: drop-shadow(0 0 20px rgba(14, 165, 233, 0.2));
        }

        .server-label {
          position: absolute;
          bottom: 10px;
          width: 100%;
          text-align: center;
          font-family: sans-serif;
        }

        .server-label strong {
          display: block;
          color: #fff;
          font-size: 0.9rem;
          letter-spacing: 0.1rem;
        }

        .server-label span {
          color: #64748b;
          font-size: 0.7rem;
        }

        .tech-badge {
          position: absolute;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(51, 65, 85, 0.5);
          border-radius: 6px;
          color: #f1f5f9;
          font-size: 0.75rem;
          font-weight: 500;
          backdrop-filter: blur(8px);
          animation: float 5s ease-in-out infinite;
          z-index: 20;
        }

        .icon-glow {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          box-shadow: 0 0 8px currentColor;
        }

        .orb {
          position: absolute;
          width: 150px;
          height: 150px;
          border-radius: 50%;
          filter: blur(60px);
          opacity: 0.15;
          z-index: 1;
        }
        .orange { background: #f97316; bottom: 10%; right: 10%; }
        .cyan { background: #0ea5e9; top: 10%; left: 10%; }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
        </div>
    );
};