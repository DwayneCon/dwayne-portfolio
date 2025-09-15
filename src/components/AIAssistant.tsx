import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, ArrowDown, Code, Mail, User, Lightbulb } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  actions?: Action[];
}

interface Action {
  label: string;
  type: 'navigate' | 'external' | 'demo' | 'contact';
  target: string;
  icon?: React.ReactNode;
}

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: 'Hi! I\'m Dwayne\'s AI assistant. I can help you navigate his portfolio, learn about his work, or get in touch!',
      actions: [
        { label: 'View Projects', type: 'navigate', target: 'projects', icon: <Code size={12} /> },
        { label: 'See Skills', type: 'navigate', target: 'skills', icon: <Lightbulb size={12} /> },
        { label: 'Contact Info', type: 'contact', target: 'contact', icon: <Mail size={12} /> }
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Enhanced intent recognition with navigation capabilities
  const processMessage = async (userInput: string): Promise<Message> => {
    const input = userInput.toLowerCase();
    
    // Navigation intents
    if (input.includes('project') || input.includes('work') || input.includes('portfolio')) {
      return {
        role: 'assistant',
        content: 'Here are Dwayne\'s featured projects! Click below to explore them or I can take you to the projects section.',
        actions: [
          { label: 'Go to Projects', type: 'navigate', target: 'projects', icon: <ArrowDown size={12} /> },
          { label: 'Open Aritrova Demo', type: 'demo', target: 'aritrova', icon: <ExternalLink size={12} /> },
          { label: 'Try Grocery Planner', type: 'demo', target: 'grocery-ai', icon: <ExternalLink size={12} /> },
          { label: 'Beanie Scanner', type: 'demo', target: 'beanie-scanner', icon: <ExternalLink size={12} /> }
        ]
      };
    }
    
    if (input.includes('skill') || input.includes('tech') || input.includes('language') || input.includes('framework')) {
      return {
        role: 'assistant',
        content: 'Dwayne\'s technical expertise spans frontend (React, Three.js), backend (Node.js, Python), AI/ML, and mobile development. Want to see the interactive skill tree?',
        actions: [
          { label: 'View Skills Section', type: 'navigate', target: 'skills', icon: <ArrowDown size={12} /> },
          { label: 'Frontend Skills', type: 'navigate', target: 'skills?filter=Frontend', icon: <Code size={12} /> },
          { label: 'AI/3D Skills', type: 'navigate', target: 'skills?filter=AI/3D', icon: <Lightbulb size={12} /> }
        ]
      };
    }
    
    if (input.includes('experience') || input.includes('background') || input.includes('career') || input.includes('job')) {
      return {
        role: 'assistant',
        content: 'Dwayne has a unique background in foster care services where he built automation tools that reduced manual work by 60%. Self-taught developer since 2018 with 20+ applications built.',
        actions: [
          { label: 'View Experience', type: 'navigate', target: 'experience', icon: <User size={12} /> },
          { label: 'See Resume', type: 'external', target: '/resume.pdf', icon: <ExternalLink size={12} /> }
        ]
      };
    }
    
    if (input.includes('contact') || input.includes('hire') || input.includes('email') || input.includes('reach')) {
      return {
        role: 'assistant',
        content: 'Ready to connect with Dwayne? He\'s available for freelance projects, full-time opportunities, or just to chat about tech!',
        actions: [
          { label: 'Email Dwayne', type: 'external', target: 'mailto:dwaynecon@me.com', icon: <Mail size={12} /> },
          { label: 'View Contact Section', type: 'navigate', target: 'contact', icon: <ArrowDown size={12} /> },
          { label: 'GitHub Profile', type: 'external', target: 'https://github.com/yourusername', icon: <ExternalLink size={12} /> }
        ]
      };
    }
    
    if (input.includes('cool') || input.includes('easter') || input.includes('hidden') || input.includes('secret')) {
      return {
        role: 'assistant',
        content: 'This portfolio has lots of hidden features! Try the Konami code (↑↑↓↓←→←→BA), type "terminal" anywhere, or press Cmd/Ctrl+K for the command palette! 🎆',
        actions: [
          { label: 'Open Command Palette', type: 'navigate', target: 'command-palette', icon: <Code size={12} /> }
        ]
      };
    }
    
    // Specific project queries
    if (input.includes('aritrova') || input.includes('dollhouse') || input.includes('3d')) {
      return {
        role: 'assistant',
        content: 'Aritrova is an AI-powered 3D dollhouse design platform with automated SVG generation for laser cutting. It combines Three.js, AI, and manufacturing automation.',
        actions: [
          { label: 'Try Aritrova Demo', type: 'demo', target: 'aritrova', icon: <ExternalLink size={12} /> },
          { label: 'View Project Details', type: 'navigate', target: 'projects', icon: <ArrowDown size={12} /> }
        ]
      };
    }
    
    if (input.includes('grocery') || input.includes('meal') || input.includes('food')) {
      return {
        role: 'assistant',
        content: 'The AI Grocery Planner uses intelligent meal planning with constraint-based optimization, real-time price scraping, and dietary restriction support.',
        actions: [
          { label: 'Try Grocery Planner', type: 'demo', target: 'grocery-ai', icon: <ExternalLink size={12} /> },
          { label: 'See All Projects', type: 'navigate', target: 'projects', icon: <Code size={12} /> }
        ]
      };
    }
    
    // Default response with helpful suggestions
    return {
      role: 'assistant',
      content: 'I can help you explore Dwayne\'s portfolio! Ask me about his projects, skills, experience, or use the quick actions below.',
      actions: [
        { label: 'Show Projects', type: 'navigate', target: 'projects', icon: <Code size={12} /> },
        { label: 'View Skills', type: 'navigate', target: 'skills', icon: <Lightbulb size={12} /> },
        { label: 'Contact Info', type: 'contact', target: 'contact', icon: <Mail size={12} /> },
        { label: 'About Dwayne', type: 'navigate', target: 'about', icon: <User size={12} /> }
      ]
    };
  };

  const handleAction = (action: Action) => {
    switch (action.type) {
      case 'navigate':
        // Smooth scroll to section
        if (action.target === 'command-palette') {
          // Trigger command palette
          const event = new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, metaKey: true });
          document.dispatchEvent(event);
        } else {
          const element = document.getElementById(action.target.split('?')[0]);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }
        break;
      case 'external':
        window.open(action.target, '_blank');
        break;
      case 'demo':
        // Find and click the demo button for the specified project
        const projectCard = document.querySelector('[data-project-id="' + action.target + '"]');
        if (projectCard) {
          const demoButton = projectCard.querySelector('button[class*="Open Full Interactive Demo"], button:last-of-type') as HTMLButtonElement;
          if (demoButton) {
            demoButton.click();
            // Add visual feedback
            setMessages(prev => [...prev, {
              role: 'assistant',
              content: `Opening ${action.target} demo! 🚀`
            }]);
          }
        }
        break;
      case 'contact':
        const contactElement = document.getElementById('contact');
        if (contactElement) {
          contactElement.scrollIntoView({ behavior: 'smooth' });
        }
        break;
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    
    // Simulate processing delay
    setTimeout(async () => {
      const assistantMessage = await processMessage(input);
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 z-40 w-16 h-16 bg-gradient-to-r from-electric-blue to-purple-accent rounded-full flex items-center justify-center shadow-lg"
      >
        <span className="text-2xl">🤖</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 100 }}
            className="fixed bottom-28 right-8 z-40 w-96 h-96 glass-morphism rounded-2xl p-4 flex flex-col"
          >
            <div className="flex-1 overflow-y-auto mb-4 space-y-3">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`${
                    msg.role === 'assistant' ? 'flex flex-col' : 'flex flex-col items-end'
                  }`}
                >
                  <div
                    className={`p-3 rounded-lg max-w-[85%] ${
                      msg.role === 'assistant'
                        ? 'bg-electric-blue bg-opacity-20 self-start'
                        : 'bg-purple-accent bg-opacity-20 self-end'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                  </div>
                  
                  {/* Action buttons for assistant messages */}
                  {msg.role === 'assistant' && msg.actions && (
                    <div className="flex flex-wrap gap-1 mt-2 max-w-[85%]">
                      {msg.actions.map((action, actionIndex) => (
                        <button
                          key={actionIndex}
                          onClick={() => handleAction(action)}
                          className="flex items-center gap-1 px-2 py-1 bg-white bg-opacity-10 hover:bg-opacity-20 rounded text-xs transition-all"
                        >
                          {action.icon}
                          {action.label}
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
              
              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center space-x-2 p-3 bg-electric-blue bg-opacity-20 rounded-lg self-start max-w-[85%]"
                >
                  <div className="flex space-x-1">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: 0 }}
                      className="w-2 h-2 bg-electric-blue rounded-full"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
                      className="w-2 h-2 bg-electric-blue rounded-full"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
                      className="w-2 h-2 bg-electric-blue rounded-full"
                    />
                  </div>
                  <span className="text-xs text-gray-400">AI is thinking...</span>
                </motion.div>
              )}
            </div>
            
            {/* Quick suggestions */}
            {messages.length === 1 && (
              <div className="mb-3">
                <p className="text-xs text-gray-400 mb-2">Try asking:</p>
                <div className="flex flex-wrap gap-1">
                  {[
                    "Show me your projects",
                    "What skills do you have?", 
                    "How can I contact you?",
                    "Tell me about Aritrova"
                  ].map((suggestion, i) => (
                    <button
                      key={i}
                      onClick={() => setInput(suggestion)}
                      className="text-xs px-2 py-1 bg-white bg-opacity-5 hover:bg-opacity-10 rounded transition-all"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about skills, projects, experience..."
                className="flex-1 px-3 py-2 bg-white bg-opacity-10 rounded-lg outline-none text-sm"
                disabled={isTyping}
              />
              <button
                onClick={handleSend}
                disabled={isTyping || !input.trim()}
                className="px-4 py-2 bg-electric-blue rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIAssistant;