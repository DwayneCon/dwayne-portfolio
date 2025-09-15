import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Canvas } from '@react-three/fiber';
import { Box, OrbitControls } from '@react-three/drei';

const ProjectsSection: React.FC = () => {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section id="projects" ref={ref} className="min-h-screen py-20 section-padding">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-5xl font-bold text-center mb-12 gradient-text">
          Featured Projects
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="glass-morphism rounded-2xl p-6"
          >
            <div className="h-64 rounded-lg overflow-hidden mb-4">
              <Canvas camera={{ position: [3, 3, 3] }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <Box args={[1, 1, 1]}>
                  <meshStandardMaterial color="#00D4FF" />
                </Box>
                <OrbitControls enableZoom={false} />
              </Canvas>
            </div>
            <h3 className="text-2xl font-bold mb-2">Aritrova</h3>
            <p className="text-gray-400 mb-4">
              AI-powered 3D→2D laser cutting platform with automated dollhouse generation and precision dovetail joints
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-electric-blue bg-opacity-20 rounded-full text-sm">
                Three.js
              </span>
              <span className="px-3 py-1 bg-purple-accent bg-opacity-20 rounded-full text-sm">
                TensorFlow.js
              </span>
              <span className="px-3 py-1 bg-electric-blue bg-opacity-20 rounded-full text-sm">
                Electron
              </span>
              <span className="px-3 py-1 bg-purple-accent bg-opacity-20 rounded-full text-sm">
                SVG
              </span>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="glass-morphism rounded-2xl p-6"
          >
            <div className="h-64 bg-gradient-to-br from-electric-blue to-purple-accent rounded-lg mb-4 flex items-center justify-center">
              <span className="text-6xl">🛒</span>
            </div>
            <h3 className="text-2xl font-bold mb-2">Grocery Planner AI</h3>
            <p className="text-gray-400 mb-4">
              Constraint-based meal planning with real-time Aldi price scraping and dietary restriction support
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-electric-blue bg-opacity-20 rounded-full text-sm">
                React
              </span>
              <span className="px-3 py-1 bg-purple-accent bg-opacity-20 rounded-full text-sm">
                Node.js
              </span>
              <span className="px-3 py-1 bg-electric-blue bg-opacity-20 rounded-full text-sm">
                MongoDB
              </span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default ProjectsSection;