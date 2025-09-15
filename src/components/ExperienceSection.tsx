import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface Experience {
  role: string;
  company: string;
  period: string;
  description: string;
  hidden: string;
  achievements?: string[];
}

const ExperienceSection: React.FC = () => {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  const experiences: Experience[] = [
    {
      role: 'Technology Operations Specialist (Current Role)',
      company: 'State of Illinois - Healthcare & Family Services',
      period: 'Nov 2021 – Present',
      description: 'Bridge between vulnerable users and critical state technology. Support systems serving 50,000+ families while identifying and preventing accessibility failures before they impact services. Maintain 99.9% uptime for systems where downtime means missed medications, lost benefits, or family separations.',
      hidden: 'Prevented 3 major accessibility crises that would have affected 10,000+ users',
      achievements: ['99.9% uptime for systems serving 50,000+ vulnerable users', 'Reduced accessibility complaints by 85% through proactive reviews', 'Saved state $2M+ in potential ADA compliance violations']
    },
    {
      role: 'Crisis Intervention & Documentation Specialist',
      company: 'Kemmerer Village',
      period: 'Mar 2019 – Mar 2021',
      description: 'Mastered complex state documentation systems while supporting families in crisis. Witnessed firsthand how poor UX design in critical systems delays reunifications and hurts families. Developed workarounds for system failures that became standard practice across 3 counties.',
      hidden: 'My documentation methods reduced case processing time by 30% statewide',
      achievements: ['85% family reunification rate (25% above state average)', 'Created documentation templates adopted by 50+ caseworkers', 'Identified 15 critical UX failures in state systems']
    },
    {
      role: 'Professional Caregiver',
      company: 'Private Contract',
      period: 'Sept 2015 – Jul 2017',
      description: 'Provided comprehensive in-home support and care coordination for retired Indiana University professor. Developed and implemented personalized care plans, managed medical appointments, and ensured quality of life maintenance through adaptive daily living assistance.',
      hidden: 'Created innovative care solutions that extended independent living by 3+ years',
      achievements: ['Developed custom care protocols', 'Coordinated complex medical schedules', 'Maintained client independence for 3+ years']
    },
    {
      role: 'Accessibility Research Specialist',
      company: 'Transitional Services Inc.',
      period: '2012 – 2015',
      description: 'Supported 200+ individuals with cognitive and physical disabilities navigate technology designed without them in mind. Every banking app that crashed, every government form that timed out, every "simple" interface that wasn\'t—I documented it all. This is the user research your team is missing.',
      hidden: 'Built a database of 500+ accessibility failures in common applications',
      achievements: ['Supported 200+ individuals with diverse disabilities', 'Documented 500+ technology accessibility failures', 'Increased client digital literacy by 60% despite system barriers']
    },
  ];

  return (
    <section id="experience" ref={ref} className="min-h-screen py-20 section-padding">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-5xl font-bold text-center mb-4 gradient-text">
          8 Years of Field Research Your Competitors Don't Have
        </h2>
        <p className="text-center text-gray-400 mb-12 text-lg max-w-3xl mx-auto">
          While others were learning theory, I was debugging human crises caused by technology failures.
          500+ individuals supported. 1000+ technology barriers documented. Zero tolerance for "edge cases."
        </p>
        
        <div className="max-w-4xl mx-auto">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: index * 0.2 }}
              className="mb-8 glass-morphism p-6 rounded-lg group hover:scale-105 transition-transform"
            >
              <h3 className="text-2xl font-bold mb-2">{exp.role}</h3>
              <p className="text-electric-blue mb-3">{exp.company} • {exp.period}</p>
              <p className="text-gray-300 mb-4 leading-relaxed">{exp.description}</p>
              
              <div className="mb-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-purple-accent mb-2">💡 {exp.hidden}</p>
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-gray-400 mb-2">Key Achievements:</h4>
                  {exp.achievements && exp.achievements.map((achievement, i) => (
                    <div key={i} className="flex items-start">
                      <span className="text-electric-blue mr-2 text-xs mt-1">▶</span>
                      <span className="text-gray-400 text-sm">{achievement}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default ExperienceSection;