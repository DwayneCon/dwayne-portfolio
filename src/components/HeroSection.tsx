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
          args={[positions, 3]}
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

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 max-w-4xl mx-auto">
        <div className="hero-blurb text-center space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-5xl font-bold gradient-text mb-4"
          >
            <TypewriterText text="Dwayne Concepcion" />
          </motion.h1>

          <AnimatePresence>
            {showTagline && (
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="text-xl md:text-3xl text-electric-blue font-semibold mb-6"
              >
                Developer Who Prevents Technology Failures
              </motion.h2>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showCTA && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1 }}
                className="space-y-6"
              >
                <div className="value-statement text-gray-300 leading-relaxed space-y-4 max-w-3xl mx-auto">
                  <p className="text-lg">
                    <strong>8 years of field research your competitors don't have.</strong> I've supported 
                    500+ people with disabilities through state healthcare systems, witnessing exactly 
                    how technology fails when lives depend on it.
                  </p>
                  
                  <p className="text-lg">
                    <strong>I prevent the failures that make headlines.</strong> While your senior developers 
                    debug code, I've debugged human crises caused by inaccessible technology. I know what 
                    happens when a screen reader can't parse your form—someone loses their benefits.
                  </p>
                  
                  <p className="text-lg">
                    <strong>CS degree + Crisis-tested perspective = ROI you can't Google.</strong> I leverage 
                    modern development tools and AI-augmented workflows to build inclusive technology from 
                    day one. No costly retrofitting. No accessibility lawsuits. No abandoned users.
                  </p>
                </div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2 }}
                  className="tagline text-lg md:text-xl text-white font-bold max-w-2xl mx-auto"
                >
                  I bring the user insights your team is missing. 
                  Ready to prevent your next accessibility crisis?
                </motion.p>

                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 2.5 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={scrollToProjects}
                  className="interactive group relative overflow-hidden rounded-full px-8 py-4 font-semibold text-white mt-8"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-electric-blue to-purple-accent opacity-80 transition-opacity group-hover:opacity-100" />
                  <span className="relative z-10 flex items-center gap-2">
                    See My Work
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>

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