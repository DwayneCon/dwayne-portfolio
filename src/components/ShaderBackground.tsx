import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const SimpleBackground = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.1;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[2, 2, 2]} />
      <meshBasicMaterial 
        color="#00D4FF" 
        wireframe 
        transparent 
        opacity={0.1}
      />
    </mesh>
  );
};

const ParticleField = () => {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 200; // Reduced from 1000
  
  const positions = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    
    return positions;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#FF6B35"
        transparent
        opacity={0.4}
        sizeAttenuation={false}
      />
    </points>
  );
};

const ShaderBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        dpr={[1, 1]} // Reduced DPR for performance
        style={{ background: '#0a0a0a' }}
        gl={{ 
          antialias: false,
          alpha: false,
          powerPreference: "high-performance"
        }}
      >
        <Suspense fallback={null}>
          <SimpleBackground />
          <ParticleField />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default ShaderBackground;