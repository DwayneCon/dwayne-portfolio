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
      role: 'Information Services Specialist II',
      company: 'State of Illinois - DoIT @ DCFS',
      period: 'Nov 2021 – Mar 2025',
      description: 'Delivered comprehensive technical and analytical support for DCFS information systems & operations. Maintained critical documentation and specifications for state databases and legacy/web systems. Provided expert Help Desk support while ensuring strict security compliance and resolving complex technical issues.',
      hidden: 'Collaborated across multiple state agencies to implement IT solutions supporting child welfare services',
      achievements: ['Maintained 99.9% uptime for critical state systems', 'Documented legacy systems reducing troubleshooting time by 40%', 'Led cross-agency IT initiatives']
    },
    {
      role: 'Foster Care Caseworker',
      company: 'Kemmerer Village',
      period: 'Mar 2019 – Mar 2021',
      description: 'Coordinated comprehensive DCFS (SACWIS) documentation and prepared detailed juvenile court reports. Facilitated supervised parent/child visits and provided strategic support for family reunification efforts. Managed complex case loads while ensuring compliance with state regulations.',
      hidden: 'Successfully facilitated 85% family reunification rate through strategic intervention planning',
      achievements: ['Managed 25+ active cases simultaneously', 'Achieved 85% successful reunification rate', 'Streamlined documentation processes']
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
      role: 'Direct Support Specialist',
      company: 'Transitional Services Inc.',
      period: '2012 – 2015',
      description: 'Developed and implemented individualized training programs for clients with developmental disabilities. Taught essential life skills including financial management, personal hygiene, and independent living strategies. Created custom curriculum and assessment tools for diverse learning needs.',
      hidden: 'Designed training programs that improved client independence scores by 60%',
      achievements: ['Created 15+ individualized training programs', 'Improved client independence by 60%', 'Developed innovative teaching methodologies']
    },
  ];

  return (
    <section id="experience" ref={ref} className="min-h-screen py-20 section-padding">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-5xl font-bold text-center mb-12 gradient-text">
          Experience Timeline
        </h2>
        
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