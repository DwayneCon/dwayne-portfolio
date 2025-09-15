import { useEffect, useRef } from 'react';
import useStore from '../store/useStore';

const KONAMI_CODE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

const useKonamiCode = () => {
  const inputRef = useRef<string[]>([]);
  const { activateKonami, unlockAchievement } = useStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      inputRef.current.push(e.key);
      
      if (inputRef.current.length > KONAMI_CODE.length) {
        inputRef.current.shift();
      }
      
      if (inputRef.current.join('') === KONAMI_CODE.join('')) {
        activateKonami();
        unlockAchievement('konami_master');
        inputRef.current = [];
        
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSyBzvLYiTcIG2i77OWfTQ0NUafj8LZjHAY4kdbbyscsCSlry+3riTEEI0mdzvXNhSYEL4HH8NacTwcaXLvs559NEA1UqOPwtmMcBjiR1/LMeSwFK3/I8NaJNwgZaLvt559NEAxPqOPwtmMcBjiR1/LMeSwFK3/I8NaJNwgZaLvt559NEAxPqOPwtmMZBjiS1/LGcykFI0mdzvXNhSYEL4HH8NacTwcaXLvs559NEA1UqOPwtmMcBjiR1/LMeSwFK3/I8NaJNwgZaLvt559NEAxPqOPwtmMcBjiR1/LMeywGK3/I8NaJNwgZaLvt559NEAxPqOPwtmMZBjiS1/LGcykFI0mdzvXNhSYEL4HH8NacTwcaXLvs559NEA1UqOPwtmMcBjiR1/LMeSwFK3/I8NaJNwgZaLvt559NEAxPqOPwtmMcBjiR1/LMeSwFK3/I8NaJNwgZaLvt559NEAxPqOPwtmMZBjiS1/LGcykFI0mdzvXNhSYEL4HH8NacTwcaXLvs559NEA1UqOPwtmMcBjiR1/LMeSwFK3/I8NaJNwgZaLvt559NEA1QqOPwtmMcBjiR1/LMeSwFK3/I8NaJNwgZaLvt559NEA1QqOPwtmMZBjiS1/LGcykFI0mdzvXNhSYEL4HH8NacTwcaXLvs559NEA1UqOPwtmMcBjiR1/LMeSwFK3/I8NaJNwgZaLvt559NEA1QqOPwtmMcBjiR1/LMeSwFK3/I8NaJNwgZaLvt559NEA1QqOPwtmMZBjiS1/LGcykFI0mdzvXNhSYEL4HH8NacTwcaXLvs559NEA1UqOPwtmMcBjiR1/LMeSwFK3/I8NaJNwgZaLvt559NEA1QqOPwtmMcBjiR1/LMeSwFK3/I8NaJNwgZaLvt559NEA1QqOPwtmMZBjiS1/LGcykFI0mdzvXNhSYEL4HH8NacTwcaXLvs559NEA1UqOPwtmMcBjiR1/LMeSwFK3/I8NaJNwgZaLvt559NEA1QqOPwtmMcBjiR1/LMeSwFK3/I8NaJNwgZaLvt559NEA1QqOPwtmMZBjiS1/LGcykFI0mdzvXNhSYEL4HH8NacTwcaXLvs559NEA1UqOPwtmMcBjiR1/LMeSwFK3/I8NaJNwgZaLvt559NEA1QqOPwtmMcBjiR1/LMeSwFK3/I8NaJNwgZaLvt559NEA1QqOPwtmMcBjiS1/LGcykFI0mdzvXNhSYEL4HH8NacTwcaXLvs559NEA1UqOPwtmMcBjiR1/LMeywGK3/I8NaJOAgZZ7vs559NEA1QqOPwtmMcBjiR1/LMeywGK3/I8NaJOAgZZ7vs559NEA1QqOPwtmMcBjiS1/LGcykFI0mdzvXNhSYEMIHH8NacTwcaXLvs559NEA1UqOPwtmMcBjiR1/LMeywGK3/I8NaJOAgZZ7vs559NEA1QqOPwtmMcBjiR1/LMeywGK3/I8NaJOAgZZ7vs559NEA1QqOPwtmMcBjiS1/LGcykFI0mdzvXNhSYEMIHH8NacTwcaXLvs559NEA1UqOPwtmMcBjiR1/LMeywGK3/I8NaJOAgZZ7vs55==');
        audio.play();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activateKonami, unlockAchievement]);
};

export default useKonamiCode;