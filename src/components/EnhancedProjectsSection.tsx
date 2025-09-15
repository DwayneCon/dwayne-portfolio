import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import InteractiveProjectDemo from './InteractiveProjectDemo';

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
  category: string;
}

const projects: Project[] = [
  {
    id: 'aritrova',
    title: 'Aritrova - 3D Dollhouse Platform',
    description: 'Professional-grade 3D dollhouse editor with AI-powered generation and automated SVG export for laser cutting. Complete 3D→2D manufacturing pipeline.',
    techStack: ['Three.js', 'TensorFlow.js', 'Electron', 'SVG', 'Node.js', 'React'],
    features: [
      'Interactive 3D dollhouse editor with real-time visualization',
      'AI-powered generation of customizable 3D models',
      'Automated 3D→2D pipeline creating laser-ready SVG panels',
      'Cross-platform Electron desktop app with GLTF/OBJ/STL export',
      'Offline AI inference on Raspberry Pi 5',
      'Precision dovetail joints and manufacturing constraints'
    ],
    type: '3d',
    github: 'https://github.com/DwayneCon/aritrova',
    color: '#00D4FF',
    category: 'AI/3D Innovation'
  },
  {
    id: 'grocery-ai',
    title: 'AI Grocery Planner',
    description: 'Intelligent meal planning system with constraint-based optimization, real-time price scraping, and dietary restriction support.',
    techStack: ['Python', 'OpenAI API', 'React', 'Node.js', 'MongoDB', 'TkInter'],
    features: [
      'AI-powered meal planning based on preferences and dietary needs',
      'Real-time Aldi price scraping for cost optimization',
      'Constraint-based meal planning with dietary restrictions',
      'Smart shopping lists automatically categorized by store section',
      'User accounts with saved meal plans and preferences',
      'Interactive meal review and customization interface'
    ],
    type: 'ai',
    github: 'https://github.com/DwayneCon/grocery-planner-ai',
    color: '#FF6B35',
    category: 'AI/ML Applications'
  },
  {
    id: 'beanie-scanner',
    title: 'Beanie Baby Inventory Scanner',
    description: 'Modern web application for cataloging Beanie Baby collections using advanced barcode scanning technology and computer vision.',
    techStack: ['JavaScript', 'QuaggaJS', 'HTML5', 'CSS3', 'Camera API', 'LocalStorage'],
    features: [
      'Real-time barcode scanning using device camera',
      'Image upload scanning for existing photos',
      'Automatic product lookup and information retrieval',
      'Local inventory management with search and filtering',
      'Responsive design for desktop, tablet, and mobile',
      'Offline-capable with browser localStorage persistence'
    ],
    type: 'web',
    github: 'https://github.com/DwayneCon/beanie-baby-scanner',
    color: '#8B5CF6',
    category: 'Web Applications'
  },
  {
    id: 'cat-trap',
    title: 'Cat Trap Monitor System',
    description: 'AI-powered computer vision system for monitoring live animal traps using YOLOv8 object detection and real-time notifications.',
    techStack: ['Python', 'YOLOv8', 'OpenCV', 'Computer Vision', 'macOS APIs', 'USB Camera'],
    features: [
      'Real-time USB camera monitoring with motion detection',
      'YOLOv8 AI model for specific cat identification',
      'Smart desktop notifications with sound alerts',
      'Automatic screenshot capture when cats are detected',
      'Headless mode for server/background operation',
      'Configurable detection sensitivity and cooldown periods'
    ],
    type: 'cv',
    github: 'https://github.com/DwayneCon/cat-trap-monitor',
    color: '#06FFA5',
    category: 'Computer Vision'
  },
  {
    id: 'bookexchange',
    title: 'iOS Textbook Exchange',
    description: 'Native iOS application for student textbook trading with real-time synchronization and user account management.',
    techStack: ['Swift', 'Xcode', 'Firebase', 'iOS SDK', 'Real-time Database'],
    features: [
      'Native iOS app built with Swift and Xcode',
      'Firebase backend with real-time synchronization',
      'Student account management and authentication',
      'Textbook listing and search functionality',
      'In-app messaging for book negotiations',
      'Location-based filtering for local exchanges'
    ],
    type: 'mobile',
    github: 'https://github.com/DwayneCon/ios-textbook-exchange',
    color: '#FF006E',
    category: 'Mobile Development'
  },
  {
    id: 'traceforge',
    title: 'TraceForge - Advanced Monitoring',
    description: 'Sophisticated system monitoring and analytics platform with real-time data visualization and alerting capabilities.',
    techStack: ['JavaScript', 'Node.js', 'Express', 'Socket.IO', 'Charts.js', 'System APIs'],
    features: [
      'Real-time system performance monitoring',
      'Advanced data visualization with interactive charts',
      'Customizable alerting and notification system',
      'Multi-platform compatibility and deployment',
      'WebSocket-based live data streaming',
      'Configurable monitoring dashboards'
    ],
    type: 'web',
    github: 'https://github.com/DwayneCon/traceforge',
    color: '#FFB700',
    category: 'System Monitoring'
  }
];

const categories = ['All', 'AI/3D Innovation', 'AI/ML Applications', 'Web Applications', 'Computer Vision', 'Mobile Development', 'System Monitoring'];

const EnhancedProjectsSection: React.FC = () => {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeProject, setActiveProject] = useState<string | null>(null);

  const filteredProjects = selectedCategory === 'All' 
    ? projects 
    : projects.filter(project => project.category === selectedCategory);

  useEffect(() => {
    // Auto-cycle through projects every 5 seconds if none is actively selected
    if (!activeProject) {
      const interval = setInterval(() => {
        const randomProject = filteredProjects[Math.floor(Math.random() * filteredProjects.length)];
        setActiveProject(randomProject.id);
        setTimeout(() => setActiveProject(null), 3000);
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [activeProject, filteredProjects]);

  return (
    <section id="projects" ref={ref} className="min-h-screen py-20 section-padding">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold mb-4 gradient-text">
            Interactive Project Showcase
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Real working applications demonstrating full-stack development, AI integration, and cutting-edge technology implementation
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-electric-blue text-white shadow-lg'
                  : 'glass-morphism hover:bg-white hover:bg-opacity-10'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5 }}
                onHoverStart={() => setActiveProject(project.id)}
                onHoverEnd={() => setActiveProject(null)}
                className="cursor-pointer"
              >
                <InteractiveProjectDemo 
                  project={project} 
                  isActive={activeProject === project.id}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Project Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          <div className="text-center glass-morphism p-6 rounded-lg">
            <div className="text-3xl font-bold text-electric-blue mb-2">{projects.length}</div>
            <div className="text-gray-400 text-sm">Featured Projects</div>
          </div>
          <div className="text-center glass-morphism p-6 rounded-lg">
            <div className="text-3xl font-bold text-purple-accent mb-2">6+</div>
            <div className="text-gray-400 text-sm">Technologies</div>
          </div>
          <div className="text-center glass-morphism p-6 rounded-lg">
            <div className="text-3xl font-bold text-electric-blue mb-2">100%</div>
            <div className="text-gray-400 text-sm">Interactive Demos</div>
          </div>
          <div className="text-center glass-morphism p-6 rounded-lg">
            <div className="text-3xl font-bold text-purple-accent mb-2">5+</div>
            <div className="text-gray-400 text-sm">Categories</div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-400 mb-6">
            Want to see the code behind these projects?
          </p>
          <a
            href="https://github.com/DwayneCon"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-electric-blue to-purple-accent rounded-full font-semibold hover:scale-105 transition-transform"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            View All Projects on GitHub
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default EnhancedProjectsSection;