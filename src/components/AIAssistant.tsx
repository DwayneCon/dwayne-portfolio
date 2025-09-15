import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I\'m Dwayne\'s AI assistant. Ask me about his skills, projects, or experience!' }
  ]);
  const [input, setInput] = useState('');

  const responses: Record<string, string> = {
    skills: 'Dwayne specializes in React, TypeScript, Three.js, Python, AI/ML, and full-stack development. He\'s particularly skilled in creating 3D web experiences and AI-powered applications.',
    projects: 'Check out Aritrova (AI 3D dollhouse generation) and Grocery Planner AI (smart meal planning). Both showcase his ability to combine AI with practical applications.',
    experience: 'While working in foster care, Dwayne built automation tools that reduced manual work by 60%. He\'s been self-teaching development since 2018 and has created 20+ applications.',
    contact: 'You can reach Dwayne at dwayne@example.com or connect on LinkedIn and GitHub. He\'s always open to discussing new opportunities!',
    cool: 'Here\'s something cool: This entire portfolio is built with advanced WebGL shaders, Three.js 3D graphics, and includes hidden easter eggs like the Konami code! 🎆',
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    const key = Object.keys(responses).find(k => input.toLowerCase().includes(k));
    const response = key ? responses[key] : 'I can help you learn about Dwayne\'s skills, projects, experience, or contact info. What would you like to know?';
    
    setMessages([...messages, userMessage, { role: 'assistant', content: response }]);
    setInput('');
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
                <div
                  key={i}
                  className={`p-3 rounded-lg ${
                    msg.role === 'assistant'
                      ? 'bg-electric-blue bg-opacity-20 self-start'
                      : 'bg-purple-accent bg-opacity-20 self-end ml-8'
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                </div>
              ))}
            </div>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about skills, projects, experience..."
                className="flex-1 px-3 py-2 bg-white bg-opacity-10 rounded-lg outline-none text-sm"
              />
              <button
                onClick={handleSend}
                className="px-4 py-2 bg-electric-blue rounded-lg text-sm font-medium"
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