import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import useStore from '../store/useStore';

const CommandPalette: React.FC = () => {
  const [search, setSearch] = useState('');
  const { toggleCommandPalette, toggleSound, toggleTerminal, toggleDarkMode, toggleGame, isDarkMode, gameActive } = useStore();

  // Generate and download resume
  const downloadResume = () => {
    const resumeContent = `
DWAYNE CONCEPCION
Aspiring Developer with Irreplaceable Perspective
Email: dwaynecon@me.com | Location: Decatur, IL

SUMMARY
I'm not your typical entry-level developer. I bring a CS degree, 8 years of hands-on 
experience supporting people with disabilities, and a deep understanding of how technology 
fails its most vulnerable users. I'm learning to code not just to build things, but to 
solve problems I've personally witnessed.

TECHNICAL SKILLS
• Frontend: JavaScript (ES6+), React, Three.js, HTML/CSS, Swift
• Backend: Node.js, Python, MongoDB, SQL, Express
• AI/3D: TensorFlow.js, Electron, SVG Generation, Firebase
• DevOps: Git, Linux, Docker, Bash

FEATURED PROJECTS
• Aritrova - AI-powered 3D dollhouse design platform with automated laser cutting
• Grocery Planner AI - Intelligent meal planning with constraint-based optimization
• iOS Textbook Exchange - Student marketplace with Firebase backend

EXPERIENCE
Information Services Specialist II | State of Illinois - DoIT @ DCFS | Nov 2021 – Mar 2025
Foster Care Caseworker | Kemmerer Village | Mar 2019 – Mar 2021
Professional Caregiver | Private Contract | Sept 2015 – Jul 2017
Direct Support Specialist | Transitional Services Inc. | 2012 – 2015

Hire me for the insights. Train me on the code. 
Together, we'll build technology that works for everyone.
    `;
    
    const blob = new Blob([resumeContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Dwayne_Concepcion_Resume.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const commands = [
    { id: 'download', label: 'Download Resume (TXT)', icon: '📄', action: downloadResume },
    { id: 'resume-pdf', label: 'View Resume (PDF)', icon: '📋', action: () => window.open('/resume.pdf', '_blank') },
    { id: 'source', label: 'View Source', icon: '👨‍💻', action: () => window.open('https://github.com/dwaynecon/dwayne-portfolio', '_blank') },
    { id: 'theme', label: isDarkMode ? 'Light Mode' : 'Dark Mode', icon: isDarkMode ? '☀️' : '🌙', action: toggleDarkMode },
    { id: 'sound', label: 'Toggle Sound', icon: '🔊', action: toggleSound },
    { id: 'terminal', label: 'Open Terminal', icon: '💻', action: toggleTerminal },
    { id: 'game', label: gameActive ? 'Stop Game' : 'Start Game', icon: '🎮', action: toggleGame },
  ];

  const filteredCommands = commands.filter(cmd => 
    cmd.label.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') toggleCommandPalette();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [toggleCommandPalette]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center pt-32 bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={toggleCommandPalette}
    >
      <motion.div
        initial={{ scale: 0.9, y: -20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: -20 }}
        className="glass-morphism rounded-2xl p-2 w-full max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Type a command or search..."
          className="w-full px-4 py-3 bg-transparent border-b border-gray-700 outline-none text-lg"
          autoFocus
        />
        
        <div className="mt-2 max-h-96 overflow-y-auto">
          {filteredCommands.map((cmd) => (
            <button
              key={cmd.id}
              onClick={() => {
                cmd.action();
                toggleCommandPalette();
              }}
              className="w-full px-4 py-3 text-left hover:bg-white hover:bg-opacity-10 rounded-lg flex items-center gap-3 transition-colors"
            >
              <span className="text-2xl">{cmd.icon}</span>
              <span>{cmd.label}</span>
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CommandPalette;