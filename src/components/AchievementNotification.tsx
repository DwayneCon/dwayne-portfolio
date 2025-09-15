import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  achievement: string;
}

const achievements: Record<string, { title: string; description: string; icon: string }> = {
  first_impression: {
    title: 'First Impression',
    description: 'Welcome to my portfolio!',
    icon: '🎆',
  },
  skill_explorer: {
    title: 'Skill Explorer',
    description: 'Discovered my technical arsenal',
    icon: '📡',
  },
  konami_master: {
    title: 'Konami Master',
    description: 'You found the secret code!',
    icon: '🎮',
  },
  project_viewer: {
    title: 'Project Viewer',
    description: 'Explored my work',
    icon: '🚀',
  },
  terminal_hacker: {
    title: 'Terminal Hacker',
    description: 'Accessed the command line',
    icon: '💻',
  },
};

const AchievementNotification: React.FC<Props> = ({ achievement }) => {
  const [show, setShow] = useState(true);
  const data = achievements[achievement];

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!data) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          className="fixed top-20 right-4 z-50 glass-morphism p-4 rounded-lg min-w-[300px]"
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">{data.icon}</span>
            <div>
              <h4 className="font-bold text-electric-blue">{data.title}</h4>
              <p className="text-sm text-gray-400">{data.description}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AchievementNotification;