import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import useStore from '../store/useStore';

const Terminal: React.FC = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>(['Welcome to Dwayne\'s Terminal! Type "help" for commands.']);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toggleTerminal } = useStore();

  const commands: Record<string, () => string> = {
    help: () => 'Available commands: ls, cd, cat, about, skills, projects, experience, contact, whoami, pwd, date, uptime, clear, exit\nEaster eggs: Try "konami", "matrix", or "sudo rm -rf /"',
    ls: () => 'projects/  skills/  experience/  contact.txt  README.md  portfolio.json',
    pwd: () => '/home/dwayne/portfolio',
    whoami: () => 'dwayne',
    cd: () => 'Usage: cd [directory]\nAvailable: projects, skills, experience, home',
    'cd projects': () => 'Changed to projects directory. Use "ls" to see available projects.',
    'cd skills': () => 'Changed to skills directory. Use "ls" to see technical skills.',
    'cd experience': () => 'Changed to experience directory. Use "ls" to see work history.',
    'cd home': () => 'Changed to home directory.',
    'cd ~': () => 'Changed to home directory.',
    'cd ..': () => 'Moved up one directory.',
    'cat contact.txt': () => 'Email: dwaynecon@me.com\nLocation: Decatur, IL\nGitHub: github.com/yourusername\nPortfolio: https://dwayne-portfolio.vercel.app',
    'cat README.md': () => '# Dwayne Concepcion Portfolio\n\nAspiring Developer with Irreplaceable Perspective\n\nInteractive portfolio showcasing projects, skills, and experience.\nBuilt with React, Three.js, and modern web technologies.',
    'cat portfolio.json': () => '{\n  "name": "Dwayne Concepcion",\n  "role": "Aspiring Developer",\n  "specialization": "Accessibility & Human-Centered Design",\n  "experience": "8+ years supporting people with disabilities",\n  "skills": ["JavaScript", "React", "Three.js", "Python", "Node.js"]\n}',
    about: () => 'Dwayne Concepcion\nAspiring Developer with Irreplaceable Perspective\n\nCS degree + 8 years supporting people with disabilities.\nBuilding technology that works for everyone, not just ideal users.',
    contact: () => 'Email: dwaynecon@me.com\nLocation: Decatur, IL\nPortfolio: Interactive portfolio with 3D elements\nSpecialty: Accessibility-focused development',
    skills: () => 'Frontend: JavaScript (ES6+), React, Three.js, HTML/CSS, Swift\nBackend: Node.js, Python, MongoDB, SQL, Express\nAI/3D: TensorFlow.js, Electron, SVG Generation\nDevOps: Git, Linux, Docker, Bash',
    projects: () => '1. Aritrova - AI-powered 3D dollhouse platform with laser cutting\n2. Grocery Planner AI - Constraint-based meal planning optimization\n3. Interactive Portfolio - This 3D portfolio with games and easter eggs\n4. iOS Textbook Exchange - Student marketplace with Firebase',
    experience: () => 'Information Services Specialist II | State of Illinois (2021-2025)\nFoster Care Caseworker | Kemmerer Village (2019-2021)\nProfessional Caregiver | Private Contract (2015-2017)\nDirect Support Specialist | Transitional Services (2012-2015)',
    clear: () => {
      setHistory(['Welcome to Dwayne\'s Terminal! Type "help" for commands.']);
      return '';
    },
    exit: () => {
      toggleTerminal();
      return 'Goodbye!';
    },
  };

  const handleCommand = () => {
    const trimmedInput = input.trim().toLowerCase();
    if (!trimmedInput) return;

    let output = '';

    // Handle exact matches first
    if (commands[trimmedInput]) {
      output = commands[trimmedInput]();
    }
    // Handle partial commands and arguments
    else if (trimmedInput.startsWith('cd ')) {
      const target = trimmedInput.slice(3).trim();
      const cdCommand = `cd ${target}`;
      if (commands[cdCommand]) {
        output = commands[cdCommand]();
      } else {
        output = `cd: ${target}: No such directory\nAvailable: projects, skills, experience, home`;
      }
    }
    else if (trimmedInput.startsWith('cat ')) {
      const file = trimmedInput.slice(4).trim();
      const catCommand = `cat ${file}`;
      if (commands[catCommand]) {
        output = commands[catCommand]();
      } else {
        output = `cat: ${file}: No such file\nAvailable files: contact.txt, README.md, portfolio.json`;
      }
    }
    // Easter eggs and special commands
    else if (trimmedInput === 'sudo rm -rf /') {
      output = 'Nice try! 😄 This is a portfolio, not a real terminal.';
    }
    else if (trimmedInput.includes('hack') || trimmedInput.includes('exploit')) {
      output = 'I see you have a sense of humor! Try "konami" instead.';
    }
    else if (trimmedInput === 'konami') {
      output = 'Try the Konami code: ↑↑↓↓←→←→BA (on the main page)';
    }
    else if (trimmedInput === 'matrix') {
      output = 'Wake up, Neo... Try Ctrl+K for the command palette!';
    }
    else if (trimmedInput === 'hello' || trimmedInput === 'hi') {
      output = 'Hello! Welcome to my terminal. Type "help" for available commands.';
    }
    else if (trimmedInput === 'date') {
      output = new Date().toString();
    }
    else if (trimmedInput === 'uptime') {
      output = 'Portfolio has been running since you loaded the page!';
    }
    else {
      output = `Command not found: ${input.trim()}\nType "help" for available commands.`;
    }

    setHistory([...history, `$ ${input.trim()}`, output].filter(Boolean));
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