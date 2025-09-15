import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import useStore from '../store/useStore';

interface NavItem {
  id: string;
  label: string;
  icon: string;
  color: string;
  orbitRadius: number;
  orbitSpeed: number;
  size: number;
}

const navItems: NavItem[] = [
  { id: 'hero', label: 'Home', icon: '🏠', color: '#00D4FF', orbitRadius: 2, orbitSpeed: 0.5, size: 0.3 },
  { id: 'skills', label: 'Skills', icon: '💡', color: '#FF6B35', orbitRadius: 2.5, orbitSpeed: 0.4, size: 0.35 },
  { id: 'projects', label: 'Projects', icon: '🚀', color: '#FF006E', orbitRadius: 3, orbitSpeed: 0.3, size: 0.4 },
  { id: 'experience', label: 'Experience', icon: '📋', color: '#06FFA5', orbitRadius: 3.5, orbitSpeed: 0.25, size: 0.35 },
  { id: 'contact', label: 'Contact', icon: '📬', color: '#FFB700', orbitRadius: 4, orbitSpeed: 0.2, size: 0.3 },
];

const Planet = ({ item, onClick, isActive }: { item: NavItem; onClick: () => void; isActive: boolean }) => {
  const meshRef = React.useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      const angle = time * item.orbitSpeed;
      
      meshRef.current.position.x = Math.cos(angle) * item.orbitRadius;
      meshRef.current.position.z = Math.sin(angle) * item.orbitRadius;
      meshRef.current.rotation.y += 0.01;
      
      const scale = (hovered ? 1.2 : 1) * (isActive ? 1.3 : 1);
      meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
    }
  });

  return (
    <mesh
      ref={meshRef}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry args={[item.size, 32, 32]} />
      <meshStandardMaterial
        color={item.color}
        emissive={item.color}
        emissiveIntensity={isActive ? 0.5 : hovered ? 0.3 : 0.1}
        roughness={0.3}
        metalness={0.7}
      />
    </mesh>
  );
};

const Sun = () => {
  const meshRef = React.useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color="#FFF700"
          emissive="#FFF700"
          emissiveIntensity={0.8}
          roughness={0.2}
          metalness={0.5}
        />
      </mesh>
      <pointLight position={[0, 0, 0]} intensity={2} color="#FFF700" />
    </>
  );
};

const OrbitPath = ({ radius }: { radius: number }) => {
  const points = [];
  for (let i = 0; i <= 64; i++) {
    const angle = (i / 64) * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
  }
  
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
  
  return (
    <line>
      <bufferGeometry attach="geometry" {...lineGeometry} />
      <lineBasicMaterial attach="material" color="#ffffff" opacity={0.1} transparent />
    </line>
  );
};

const OrbitalNav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const { currentSection, setCurrentSection } = useStore();

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => item.id);
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setCurrentSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [setCurrentSection]);

  const handleNavClick = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    setCurrentSection(sectionId);
  };

  return (
    <>
      <motion.button
        className="fixed top-8 right-8 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-electric-blue to-purple-accent p-0.5"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <div className="w-full h-full rounded-full bg-bg-dark flex items-center justify-center">
          <motion.div
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.3 }}
            className="text-2xl"
          >
            {isOpen ? '✕' : '☰'}
          </motion.div>
        </div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="fixed top-24 right-8 z-40 w-96 h-96 pointer-events-none"
          >
            <div className="relative w-full h-full pointer-events-auto">
              <Canvas 
                camera={{ position: [0, 5, 5], fov: 60 }}
                dpr={[1, 1]}
                gl={{ 
                  antialias: false,
                  powerPreference: "high-performance"
                }}
              >
                <ambientLight intensity={0.3} />
                <Sun />
                {navItems.map(item => (
                  <React.Fragment key={item.id}>
                    <OrbitPath radius={item.orbitRadius} />
                    <Planet
                      item={item}
                      onClick={() => handleNavClick(item.id)}
                      isActive={currentSection === item.id}
                    />
                  </React.Fragment>
                ))}
              </Canvas>
              
              {hoveredItem && (
                <div className="absolute inset-0 pointer-events-none">
                  {navItems.filter(item => item.id === hoveredItem).map(item => {
                    const time = Date.now() / 1000;
                    const angle = time * item.orbitSpeed;
                    const x = Math.cos(angle) * item.orbitRadius * 40 + 192;
                    const y = -Math.sin(angle) * item.orbitRadius * 20 + 192;
                    
                    return (
                      <motion.div
                        key={item.id}
                        className="absolute"
                        style={{ left: x, top: y }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <div className="glass-morphism px-3 py-1 rounded-full whitespace-nowrap">
                          <span className="text-sm text-white">{item.label}</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed left-8 top-1/2 -translate-y-1/2 z-30">
        <div className="relative h-64 w-1">
          <div className="absolute inset-0 bg-gradient-to-b from-electric-blue to-purple-accent opacity-20 rounded-full" />
          <motion.div
            className="absolute w-full bg-gradient-to-b from-electric-blue to-purple-accent rounded-full"
            style={{
              height: `${((navItems.findIndex(item => item.id === currentSection) + 1) / navItems.length) * 100}%`,
            }}
            layoutId="progress-indicator"
          />
          
          <div className="absolute -left-2 w-5 h-full flex flex-col justify-between py-2">
            {navItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-5 h-5 rounded-full border-2 transition-all ${
                  currentSection === item.id
                    ? 'bg-electric-blue border-electric-blue scale-125'
                    : 'bg-transparent border-gray-600 hover:border-electric-blue'
                }`}
                title={item.label}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default OrbitalNav;