import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import useStore from '../store/useStore';

interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  projects?: string[];
  color: string;
}

const skills: Skill[] = [
  // Frontend
  { id: 'javascript', name: 'JavaScript (ES6+)', category: 'Frontend', proficiency: 95, projects: ['Aritrova', 'Grocery Planner'], color: '#F7DF1E' },
  { id: 'react', name: 'React', category: 'Frontend', proficiency: 92, projects: ['Grocery Planner', 'Portfolio'], color: '#61DAFB' },
  { id: 'threejs', name: 'Three.js', category: 'Frontend', proficiency: 88, projects: ['Aritrova', '3D Models'], color: '#000000' },
  { id: 'html', name: 'HTML/CSS', category: 'Frontend', proficiency: 90, projects: ['All Web Projects'], color: '#E34F26' },
  { id: 'swift', name: 'Swift', category: 'Frontend', proficiency: 82, projects: ['iOS Textbook Exchange'], color: '#FA7343' },
  
  // Backend
  { id: 'nodejs', name: 'Node.js', category: 'Backend', proficiency: 88, projects: ['Grocery Planner API'], color: '#339933' },
  { id: 'python', name: 'Python', category: 'Backend', proficiency: 85, projects: ['AI Scripts', 'Automation'], color: '#3776AB' },
  { id: 'mongodb', name: 'MongoDB', category: 'Backend', proficiency: 85, projects: ['Grocery Planner'], color: '#47A248' },
  { id: 'sql', name: 'SQL', category: 'Backend', proficiency: 80, projects: ['State Systems', 'Data Analysis'], color: '#4479A1' },
  { id: 'express', name: 'Express', category: 'Backend', proficiency: 87, projects: ['API Development'], color: '#000000' },
  
  // AI/3D & Tools
  { id: 'tensorflow', name: 'TensorFlow.js', category: 'AI/3D', proficiency: 85, projects: ['Aritrova AI'], color: '#FF6F00' },
  { id: 'electron', name: 'Electron', category: 'AI/3D', proficiency: 90, projects: ['Aritrova Desktop'], color: '#47848F' },
  { id: 'svg', name: 'SVG Generation', category: 'AI/3D', proficiency: 88, projects: ['Laser Cutting Pipeline'], color: '#FFB13B' },
  { id: 'firebase', name: 'Firebase', category: 'AI/3D', proficiency: 82, projects: ['iOS App Backend'], color: '#FFCA28' },
  
  // DevOps & Systems
  { id: 'git', name: 'Git', category: 'DevOps', proficiency: 95, projects: ['All Projects'], color: '#F05032' },
  { id: 'linux', name: 'Linux', category: 'DevOps', proficiency: 85, projects: ['Raspberry Pi', 'Servers'], color: '#FCC624' },
  { id: 'docker', name: 'Docker', category: 'DevOps', proficiency: 78, projects: ['Deployment'], color: '#2496ED' },
  { id: 'bash', name: 'Bash', category: 'DevOps', proficiency: 82, projects: ['Automation Scripts'], color: '#4EAA25' },
];

const SkillTree: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const { selectedSkillCategory, setSelectedSkillCategory } = useStore();

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 800;
    const height = 600;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`);

    const filteredSkills = selectedSkillCategory
      ? skills.filter(s => s.category === selectedSkillCategory)
      : skills;

    // Simple grid layout instead of force simulation for better performance
    const cols = Math.ceil(Math.sqrt(filteredSkills.length));
    const rows = Math.ceil(filteredSkills.length / cols);
    const cellWidth = width / cols;
    const cellHeight = height / rows;

    const nodeGroup = svg.append('g')
      .selectAll('g')
      .data(filteredSkills)
      .enter()
      .append('g')
      .attr('cursor', 'pointer')
      .attr('transform', (d: any, i: number) => {
        const row = Math.floor(i / cols);
        const col = i % cols;
        const x = col * cellWidth + cellWidth / 2;
        const y = row * cellHeight + cellHeight / 2;
        return `translate(${x},${y})`;
      })
      .on('click', (event, d) => setSelectedSkill(d as Skill));

    nodeGroup.append('circle')
      .attr('r', (d: any) => Math.min(d.proficiency * 0.4, 40))
      .attr('fill', (d: any) => d.color)
      .attr('fill-opacity', 0.8)
      .attr('stroke', (d: any) => d.color)
      .attr('stroke-width', 2)
      .attr('stroke-opacity', 0.3)
      .on('mouseenter', function(event, d) {
        d3.select(this)
          .transition()
          .duration(150)
          .attr('r', Math.min((d as any).proficiency * 0.5, 50));
      })
      .on('mouseleave', function(event, d) {
        d3.select(this)
          .transition()
          .duration(150)
          .attr('r', Math.min((d as any).proficiency * 0.4, 40));
      });

    nodeGroup.append('text')
      .text((d: any) => d.name)
      .attr('text-anchor', 'middle')
      .attr('dy', '.35em')
      .attr('fill', 'white')
      .attr('font-size', '10px')
      .attr('font-weight', 'bold')
      .attr('pointer-events', 'none');

    // No cleanup needed since we're not using simulation
  }, [selectedSkillCategory]);

  return (
    <>
      <svg ref={svgRef} className="w-full h-full" />
      
      <AnimatePresence>
        {selectedSkill && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute top-4 right-4 glass-morphism p-6 rounded-lg max-w-xs"
          >
            <h3 className="text-xl font-bold mb-2" style={{ color: selectedSkill.color }}>
              {selectedSkill.name}
            </h3>
            <p className="text-gray-300 mb-2">Category: {selectedSkill.category}</p>
            <div className="mb-3">
              <div className="flex justify-between mb-1">
                <span className="text-sm">Proficiency</span>
                <span className="text-sm">{selectedSkill.proficiency}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all"
                  style={{
                    width: `${selectedSkill.proficiency}%`,
                    backgroundColor: selectedSkill.color,
                  }}
                />
              </div>
            </div>
            {selectedSkill.projects && (
              <div>
                <p className="text-sm text-gray-400 mb-1">Used in:</p>
                <div className="flex flex-wrap gap-1">
                  {selectedSkill.projects.map((project) => (
                    <span
                      key={project}
                      className="text-xs px-2 py-1 rounded-full bg-gray-800 text-gray-300"
                    >
                      {project}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <button
              onClick={() => setSelectedSkill(null)}
              className="mt-4 text-sm text-gray-400 hover:text-white"
            >
              Close
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const SkillsSection: React.FC = () => {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });
  const { setSelectedSkillCategory, unlockAchievement } = useStore();
  const categories = ['All', 'Frontend', 'Backend', 'AI/3D', 'DevOps'];

  useEffect(() => {
    if (inView) {
      unlockAchievement('skill_explorer');
    }
  }, [inView, unlockAchievement]);

  return (
    <section id="skills" ref={ref} className="min-h-screen py-20 section-padding">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-5xl font-bold text-center mb-4 gradient-text">
          Technical Arsenal
        </h2>
        <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
          Interactive skill visualization - Click nodes to explore proficiency and project applications
        </p>

        <div className="flex justify-center gap-4 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedSkillCategory(category === 'All' ? null : category)}
              className="px-4 py-2 rounded-full glass-morphism hover:bg-white hover:bg-opacity-10 transition-all"
            >
              {category}
            </button>
          ))}
        </div>

        <div className="relative bg-bg-dark-secondary rounded-2xl p-8 overflow-hidden">
          <SkillTree />
        </div>
      </motion.div>
    </section>
  );
};

export default SkillsSection;