import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import useStore from '../store/useStore';

const Dodecahedron = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
      
      const scale = hovered ? 1.2 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <dodecahedronGeometry args={[1.5, 0]} />
        <MeshDistortMaterial
          color="#00D4FF"
          emissive="#FF6B35"
          emissiveIntensity={0.2}
          roughness={0.2}
          metalness={0.8}
          distort={0.3}
          speed={2}
          wireframe={hovered}
        />
      </mesh>
    </Float>
  );
};

const NetworkEffect = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = 10; // Further reduced for performance

  const positions = React.useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 3;
    }
    
    return positions;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.05; // Slower rotation
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#00D4FF"
        transparent
        opacity={0.3}
        sizeAttenuation={false}
      />
    </points>
  );
};

const TypewriterText = ({ text }: { text: string }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 100);
      
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text]);

  return (
    <span className="font-jetbrains">
      {displayText}
      {currentIndex < text.length && (
        <span className="animate-pulse">|</span>
      )}
    </span>
  );
};

const HeroSection: React.FC = () => {
  const [showTagline, setShowTagline] = useState(false);
  const [showCTA, setShowCTA] = useState(false);
  const { unlockAchievement } = useStore();

  useEffect(() => {
    setTimeout(() => setShowTagline(true), 3000);
    setTimeout(() => setShowCTA(true), 4500);
    setTimeout(() => unlockAchievement('first_impression'), 5000);
  }, []);

  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <Dodecahedron />
          <NetworkEffect />
        </Canvas>
      </div>

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="mb-6 text-5xl md:text-7xl font-bold text-white"
        >
          <TypewriterText text="Dwayne Concepcion" />
        </motion.h1>

        <AnimatePresence>
          {showTagline && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8 text-xl md:text-2xl text-gray-300"
            >
              Full-Stack Developer • AI/3D Innovation Specialist
            </motion.p>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showCTA && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToProjects}
              className="interactive group relative overflow-hidden rounded-full px-8 py-4 font-semibold text-white"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-electric-blue to-purple-accent opacity-80 transition-opacity group-hover:opacity-100" />
              <span className="relative z-10 flex items-center gap-2">
                Explore My Universe
                <svg
                  className="w-5 h-5 animate-bounce"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </span>
            </motion.button>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="animate-float">
            <svg
              className="w-6 h-6 text-electric-blue"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;