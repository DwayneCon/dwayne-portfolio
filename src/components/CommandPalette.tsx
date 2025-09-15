import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import useStore from '../store/useStore';

const CommandPalette: React.FC = () => {
  const [search, setSearch] = useState('');
  const { toggleCommandPalette, toggleSound, toggleTerminal } = useStore();

  const commands = [
    { id: 'download', label: 'Download Resume', icon: '📄', action: () => console.log('Download') },
    { id: 'source', label: 'View Source', icon: '👨‍💻', action: () => window.open('https://github.com') },
    { id: 'theme', label: 'Toggle Theme', icon: '🎨', action: () => console.log('Theme') },
    { id: 'sound', label: 'Toggle Sound', icon: '🔊', action: toggleSound },
    { id: 'terminal', label: 'Open Terminal', icon: '💻', action: toggleTerminal },
    { id: 'game', label: 'Start Game', icon: '🎮', action: () => console.log('Game') },
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