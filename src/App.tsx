import React, { useEffect, lazy, Suspense } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ShaderBackground from './components/ShaderBackground';
import CustomCursor from './components/CustomCursor';
import HeroSection from './components/HeroSection';
import LoadingScreen from './components/LoadingScreen';
import useStore from './store/useStore';
import useKonamiCode from './hooks/useKonamiCode';

// Lazy load heavy components
const OrbitalNav = lazy(() => import('./components/OrbitalNav'));
const SkillsSection = lazy(() => import('./components/SkillsSection'));
const ProjectsSection = lazy(() => import('./components/EnhancedProjectsSection'));
const ExperienceSection = lazy(() => import('./components/ExperienceSection'));
const ContactSection = lazy(() => import('./components/ContactSection'));
const CommandPalette = lazy(() => import('./components/CommandPalette'));
const Terminal = lazy(() => import('./components/Terminal'));
const AchievementNotification = lazy(() => import('./components/AchievementNotification'));
const AIAssistant = lazy(() => import('./components/AIAssistant'));

function App() {
  const { 
    isLoading, 
    setLoading, 
    commandPaletteOpen, 
    terminalOpen,
    konamiActivated,
    achievements 
  } = useStore();

  useKonamiCode();

  useEffect(() => {
    console.log('%c👋 Hey there, curious developer!', 'font-size: 24px; color: #00D4FF;');
    console.log('%c🎉 You found the console! Here\'s a secret: Type "terminal" anywhere on the page for a surprise!', 'font-size: 16px; color: #FF6B35;');
    console.log('%c💼 Want to work together? Email me at dwaynecon@me.com', 'font-size: 14px; color: #06FFA5;');
    
    console.log(`
    ██████╗ ██╗    ██╗ █████╗ ██╗   ██╗███╗   ██╗███████╗
    ██╔══██╗██║    ██║██╔══██╗╚██╗ ██╔╝████╗  ██║██╔════╝
    ██║  ██║██║ █╗ ██║███████║ ╚████╔╝ ██╔██╗ ██║█████╗  
    ██║  ██║██║███╗██║██╔══██║  ╚██╔╝  ██║╚██╗██║██╔══╝  
    ██████╔╝╚███╔███╔╝██║  ██║   ██║   ██║ ╚████║███████╗
    ╚═════╝  ╚══╝╚══╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═══╝╚══════╝
    `, 'color: #00D4FF;');

    setTimeout(() => setLoading(false), 3000);

    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        useStore.getState().toggleCommandPalette();
      }
    };

    let terminalBuffer = '';
    const handleTerminalType = (e: KeyboardEvent) => {
      terminalBuffer += e.key;
      if (terminalBuffer.includes('terminal')) {
        useStore.getState().toggleTerminal();
        terminalBuffer = '';
      }
      setTimeout(() => { terminalBuffer = ''; }, 2000);
    };

    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('keypress', handleTerminalType);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('keypress', handleTerminalType);
    };
  }, [setLoading]);

  return (
    <div className={`min-h-screen ${konamiActivated ? 'retro-mode' : ''}`}>
      <AnimatePresence>
        {isLoading && <LoadingScreen />}
      </AnimatePresence>

      <CustomCursor />
      <ShaderBackground />
      
      <Suspense fallback={<div className="fixed top-8 right-8 z-50 w-14 h-14 rounded-full bg-gray-800 animate-pulse" />}>
        <OrbitalNav />
      </Suspense>

      <main className="relative z-10">
        <HeroSection />
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-white">Loading...</div></div>}>
          <SkillsSection />
          <ProjectsSection />
          <ExperienceSection />
          <ContactSection />
        </Suspense>
      </main>

      <Suspense fallback={null}>
        <AIAssistant />
      </Suspense>

      <AnimatePresence>
        {commandPaletteOpen && (
          <Suspense fallback={null}>
            <CommandPalette />
          </Suspense>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {terminalOpen && (
          <Suspense fallback={null}>
            <Terminal />
          </Suspense>
        )}
      </AnimatePresence>

      <Suspense fallback={null}>
        {achievements.map((achievement) => (
          <AchievementNotification key={achievement} achievement={achievement} />
        ))}
      </Suspense>

      {konamiActivated && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed top-4 left-4 z-50 glass-morphism px-4 py-2 rounded-lg"
        >
          <p className="text-green-400 font-jetbrains">RETRO MODE ACTIVATED! 🎮</p>
        </motion.div>
      )}
    </div>
  );
}

export default App
