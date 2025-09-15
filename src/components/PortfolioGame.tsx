import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../store/useStore';

interface Position {
  x: number;
  y: number;
}

const PortfolioGame: React.FC = () => {
  const { toggleGame, unlockAchievement } = useStore();
  const [playerPos, setPlayerPos] = useState<Position>({ x: 50, y: 50 });
  const [collectibles, setCollectibles] = useState<Position[]>([]);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  // Initialize collectibles (skills to collect)
  useEffect(() => {
    const skills = [
      { x: 20, y: 30 },
      { x: 80, y: 20 },
      { x: 10, y: 70 },
      { x: 90, y: 80 },
      { x: 60, y: 40 },
      { x: 30, y: 90 },
      { x: 70, y: 60 },
    ];
    setCollectibles(skills);
  }, []);

  // Handle keyboard movement
  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (!gameStarted) return;

    const moveSpeed = 5;
    setPlayerPos(prev => {
      let newX = prev.x;
      let newY = prev.y;

      switch (e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          newY = Math.max(0, prev.y - moveSpeed);
          break;
        case 's':
        case 'arrowdown':
          newY = Math.min(100, prev.y + moveSpeed);
          break;
        case 'a':
        case 'arrowleft':
          newX = Math.max(0, prev.x - moveSpeed);
          break;
        case 'd':
        case 'arrowright':
          newX = Math.min(100, prev.x + moveSpeed);
          break;
      }

      return { x: newX, y: newY };
    });
  }, [gameStarted]);

  // Check for collisions
  useEffect(() => {
    collectibles.forEach((collectible, index) => {
      const distance = Math.sqrt(
        Math.pow(playerPos.x - collectible.x, 2) + 
        Math.pow(playerPos.y - collectible.y, 2)
      );

      if (distance < 8) {
        setCollectibles(prev => prev.filter((_, i) => i !== index));
        setScore(prev => prev + 10);
        
        if (collectibles.length === 1) {
          unlockAchievement('game_master');
        }
      }
    });
  }, [playerPos, collectibles, unlockAchievement]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setPlayerPos({ x: 50, y: 50 });
    const skills = [
      { x: 20, y: 30 },
      { x: 80, y: 20 },
      { x: 10, y: 70 },
      { x: 90, y: 80 },
      { x: 60, y: 40 },
      { x: 30, y: 90 },
      { x: 70, y: 60 },
    ];
    setCollectibles(skills);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm"
      onClick={toggleGame}
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
        className="glass-morphism rounded-2xl p-8 w-full max-w-4xl h-96 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold gradient-text">Portfolio Adventure</h2>
          <div className="flex items-center gap-4">
            <span className="text-electric-blue">Score: {score}</span>
            <button
              onClick={toggleGame}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>

        {!gameStarted ? (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-lg text-center mb-4">
              Navigate Dwayne through his portfolio to collect all the skills!
            </p>
            <p className="text-sm text-gray-400 mb-6">
              Use WASD or Arrow Keys to move
            </p>
            <button
              onClick={startGame}
              className="px-6 py-3 bg-gradient-to-r from-electric-blue to-purple-accent rounded-lg font-semibold hover:scale-105 transition-transform"
            >
              Start Game
            </button>
          </div>
        ) : (
          <div className="relative w-full h-full bg-gray-900 rounded-lg overflow-hidden">
            {/* Game Area */}
            <div className="absolute inset-2 bg-gradient-to-br from-gray-800 to-gray-900 rounded">
              
              {/* Player */}
              <motion.div
                animate={{ 
                  left: `${playerPos.x}%`, 
                  top: `${playerPos.y}%` 
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="absolute w-6 h-6 bg-gradient-to-r from-electric-blue to-purple-accent rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-lg"
                style={{ 
                  boxShadow: '0 0 20px rgba(0, 212, 255, 0.6)' 
                }}
              >
                <div className="absolute inset-1 bg-white rounded-full opacity-40" />
              </motion.div>

              {/* Collectibles (Skills) */}
              {collectibles.map((collectible, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute w-4 h-4 bg-yellow-400 rounded-full transform -translate-x-1/2 -translate-y-1/2"
                  style={{ 
                    left: `${collectible.x}%`, 
                    top: `${collectible.y}%`,
                    boxShadow: '0 0 15px rgba(255, 215, 0, 0.8)' 
                  }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-full h-full rounded-full bg-gradient-to-r from-yellow-300 to-yellow-500"
                  />
                </motion.div>
              ))}

              {/* Game UI */}
              <div className="absolute bottom-4 left-4 text-white text-sm">
                Skills remaining: {collectibles.length}
              </div>

              {collectibles.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50"
                >
                  <div className="text-center">
                    <h3 className="text-3xl font-bold gradient-text mb-2">🎉 Congratulations!</h3>
                    <p className="text-lg">You collected all skills!</p>
                    <p className="text-electric-blue">Final Score: {score}</p>
                    <button
                      onClick={startGame}
                      className="mt-4 px-4 py-2 bg-gradient-to-r from-electric-blue to-purple-accent rounded-lg"
                    >
                      Play Again
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default PortfolioGame;