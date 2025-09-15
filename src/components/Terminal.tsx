import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import useStore from '../store/useStore';

const Terminal: React.FC = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>(['Welcome to Dwayne\'s Terminal! Type "help" for commands.']);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toggleTerminal } = useStore();

  const commands: Record<string, () => string> = {
    help: () => 'Available commands: ls, cd, cat, about, skills, projects, clear, exit',
    ls: () => 'projects/  skills/  experience/  contact.txt  README.md',
    'cd projects': () => 'Entering projects directory...',
    'cd skills': () => 'Entering skills directory...',
    'cat contact.txt': () => 'Email: dwayne@example.com\nGitHub: github.com/dwayne\nLinkedIn: linkedin.com/in/dwayne',
    about: () => 'Dwayne Concepcion - Full-Stack Developer & AI Enthusiast',
    skills: () => 'React, TypeScript, Three.js, Python, AI/ML, MongoDB, Node.js',
    projects: () => '1. Aritrova - AI 3D Generation\n2. Grocery Planner AI\n3. This Portfolio',
    clear: () => {
      setHistory(['']);
      return '';
    },
    exit: () => {
      toggleTerminal();
      return 'Goodbye!';
    },
  };

  const handleCommand = () => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    const output = commands[trimmedInput] ? commands[trimmedInput]() : `Command not found: ${trimmedInput}`;
    setHistory([...history, `$ ${trimmedInput}`, output].filter(Boolean));
    setInput('');
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      className="fixed bottom-0 left-0 right-0 z-50 h-96 bg-black bg-opacity-95 border-t-2 border-green-500 p-4 font-jetbrains"
    >
      <div className="flex justify-between items-center mb-4">
        <span className="text-green-400">dwayne@portfolio:~$</span>
        <button
          onClick={toggleTerminal}
          className="text-red-500 hover:text-red-400"
        >
          ✕
        </button>
      </div>
      
      <div className="h-72 overflow-y-auto mb-2 text-green-400 text-sm">
        {history.map((line, i) => (
          <div key={i} className="mb-1">{line}</div>
        ))}
      </div>
      
      <div className="flex items-center text-green-400">
        <span className="mr-2">$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCommand()}
          className="flex-1 bg-transparent outline-none"
        />
      </div>
    </motion.div>
  );
};

export default Terminal;