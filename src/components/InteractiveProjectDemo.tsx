import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box, Sphere, Cone } from '@react-three/drei';
import * as THREE from 'three';

interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  features: string[];
  type: 'ai' | '3d' | 'web' | 'mobile' | 'cv';
  github?: string;
  demo?: string;
  color: string;
}

interface InteractiveProjectDemoProps {
  project: Project;
  isActive: boolean;
}

// 3D Dollhouse Demo Component
const DollhouseDemo = () => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      {/* House base */}
      <Box position={[0, -0.5, 0]} args={[2, 0.1, 2]} >
        <meshStandardMaterial color="#8B7355" />
      </Box>
      
      {/* Walls */}
      <Box position={[-1, 0.5, 0]} args={[0.1, 1, 2]} >
        <meshStandardMaterial color="#E6D7C5" />
      </Box>
      <Box position={[1, 0.5, 0]} args={[0.1, 1, 2]} >
        <meshStandardMaterial color="#E6D7C5" />
      </Box>
      <Box position={[0, 0.5, -1]} args={[2, 1, 0.1]} >
        <meshStandardMaterial color="#E6D7C5" />
      </Box>
      <Box position={[0, 0.5, 1]} args={[2, 1, 0.1]} >
        <meshStandardMaterial color="#E6D7C5" />
      </Box>
      
      {/* Roof */}
      <Cone position={[0, 1.5, 0]} args={[1.5, 0.8, 4]} rotation={[0, Math.PI/4, 0]}>
        <meshStandardMaterial color="#8B4513" />
      </Cone>
      
      {/* Windows */}
      <Box position={[-0.99, 0.7, -0.5]} args={[0.12, 0.3, 0.3]} >
        <meshStandardMaterial color="#87CEEB" />
      </Box>
      <Box position={[-0.99, 0.7, 0.5]} args={[0.12, 0.3, 0.3]} >
        <meshStandardMaterial color="#87CEEB" />
      </Box>
    </group>
  );
};

// AI Grocery Demo Component  
const GroceryAIDemo = () => {
  const [mealIndex, setMealIndex] = useState(0);
  const meals = ['🥗 Caesar Salad', '🍝 Pasta Primavera', '🍗 Chicken Teriyaki', '🥘 Vegetable Curry'];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setMealIndex((prev) => (prev + 1) % meals.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
      <div className="mb-4">
        <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-2xl mb-2">
          🧠
        </div>
        <h3 className="text-lg font-semibold text-white">AI Planning...</h3>
      </div>
      
      <motion.div
        key={mealIndex}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="text-2xl font-bold text-electric-blue"
      >
        {meals[mealIndex]}
      </motion.div>
      
      <div className="mt-4 text-sm text-gray-400">
        + Smart grocery list generation
      </div>
    </div>
  );
};

// Beanie Baby Scanner Demo
const BeanieScannerDemo = () => {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const startScan = () => {
    setScanning(true);
    setResult(null);
    setTimeout(() => {
      setScanning(false);
      setResult('Peace the Bear - 1996 Rare');
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <div className="relative w-32 h-32 mb-4">
        <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
          {scanning ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="text-white text-2xl"
            >
              📷
            </motion.div>
          ) : (
            <span className="text-white text-2xl">🧸</span>
          )}
        </div>
        
        {scanning && (
          <motion.div
            className="absolute inset-0 border-2 border-electric-blue rounded-lg"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
        )}
      </div>

      <button
        onClick={startScan}
        disabled={scanning}
        className="px-4 py-2 bg-electric-blue text-white rounded-lg hover:bg-opacity-80 transition-all disabled:opacity-50"
      >
        {scanning ? 'Scanning...' : 'Scan Barcode'}
      </button>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-center"
          >
            <div className="text-purple-accent font-semibold">{result}</div>
            <div className="text-sm text-gray-400">Added to collection</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Cat Trap Monitor Demo
const CatTrapDemo = () => {
  const [detecting, setDetecting] = useState(false);
  const [catDetected, setCatDetected] = useState(false);

  const startDetection = () => {
    setDetecting(true);
    setCatDetected(false);
    setTimeout(() => {
      setCatDetected(true);
      setDetecting(false);
    }, 3000);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <div className="relative w-40 h-32 mb-4">
        <div className="w-full h-full bg-gray-800 rounded-lg border-2 border-gray-600 flex items-center justify-center">
          {detecting ? (
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="text-2xl"
            >
              📹
            </motion.div>
          ) : catDetected ? (
            <div className="text-2xl">🐱</div>
          ) : (
            <div className="text-gray-500 text-xl">📷</div>
          )}
        </div>
        
        {detecting && (
          <div className="absolute top-2 right-2">
            <motion.div
              className="w-3 h-3 bg-red-500 rounded-full"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
          </div>
        )}
      </div>

      <button
        onClick={startDetection}
        disabled={detecting}
        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-opacity-80 transition-all disabled:opacity-50"
      >
        {detecting ? 'Monitoring...' : 'Start Monitor'}
      </button>

      <AnimatePresence>
        {catDetected && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 text-center"
          >
            <div className="text-green-400 font-semibold">🚨 Cat Detected!</div>
            <div className="text-sm text-gray-400">Alert sent • Screenshot saved</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const InteractiveProjectDemo: React.FC<InteractiveProjectDemoProps> = ({ project, isActive }) => {
  const renderDemo = () => {
    switch (project.id) {
      case 'aritrova':
        return (
          <Canvas camera={{ position: [3, 3, 3], fov: 60 }}>
            <ambientLight intensity={0.6} />
            <pointLight position={[10, 10, 10]} intensity={0.8} />
            <DollhouseDemo />
          </Canvas>
        );
      case 'grocery-ai':
        return <GroceryAIDemo />;
      case 'beanie-scanner':
        return <BeanieScannerDemo />;
      case 'cat-trap':
        return <CatTrapDemo />;
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-6xl opacity-50">{project.type === '3d' ? '🎲' : project.type === 'ai' ? '🧠' : '💻'}</div>
          </div>
        );
    }
  };

  return (
    <motion.div
      layout
      className={`relative overflow-hidden rounded-lg transition-all duration-300 ${
        isActive ? 'scale-105 shadow-2xl' : 'hover:scale-102'
      }`}
      style={{ backgroundColor: project.color + '20' }}
    >
      <div className="h-64 relative">
        {renderDemo()}
        
        {/* Overlay info */}
        <div className="absolute top-4 left-4 right-4">
          <div className="flex items-center justify-between">
            <span className="px-2 py-1 bg-black bg-opacity-50 rounded text-xs text-white">
              {project.type.toUpperCase()}
            </span>
            <div className="flex gap-2">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 bg-black bg-opacity-50 rounded hover:bg-opacity-70 transition-all"
                >
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 text-white">{project.title}</h3>
        <p className="text-gray-300 text-sm mb-4 leading-relaxed">{project.description}</p>
        
        <div className="mb-4">
          <h4 className="text-xs font-semibold text-gray-400 mb-2">Key Features:</h4>
          <ul className="text-xs text-gray-400 space-y-1">
            {project.features.slice(0, 3).map((feature, index) => (
              <li key={index} className="flex items-start">
                <span className="text-electric-blue mr-2 text-xs mt-0.5">▶</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap gap-2">
          {project.techStack.slice(0, 4).map((tech, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs rounded-full bg-opacity-20"
              style={{ backgroundColor: project.color }}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default InteractiveProjectDemo;