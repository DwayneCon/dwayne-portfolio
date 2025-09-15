import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CustomCursor: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    let animationFrame: number;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (animationFrame) return;
      
      animationFrame = requestAnimationFrame(() => {
        setMousePosition({ x: e.clientX, y: e.clientY });
        animationFrame = 0;
      });
    };

    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.matches('a, button, .interactive')) {
        setIsHovering(true);
      }
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseover', handleMouseEnter, { passive: true });
    window.addEventListener('mouseout', handleMouseLeave, { passive: true });

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseEnter);
      window.removeEventListener('mouseout', handleMouseLeave);
    };
  }, []);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-6 h-6 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: mousePosition.x - 12,
          y: mousePosition.y - 12,
        }}
      >
        <div className={`w-full h-full rounded-full bg-electric-blue transition-transform ${isHovering ? 'scale-150' : 'scale-100'}`} style={{ opacity: 0.8 }} />
      </motion.div>
      
      <div
        className="fixed top-0 left-0 w-10 h-10 pointer-events-none z-[9998] mix-blend-difference"
        style={{
          transform: `translate(${mousePosition.x - 20}px, ${mousePosition.y - 20}px)`,
        }}
      >
        <div className="w-full h-full rounded-full border border-electric-blue" style={{ opacity: 0.3 }} />
      </div>
    </>
  );
};

export default CustomCursor;