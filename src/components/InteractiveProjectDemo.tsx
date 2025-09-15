import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box, Sphere, Cone } from '@react-three/drei';
import * as THREE from 'three';
import { ExternalLink } from 'lucide-react';
import ProjectModal from './ProjectModal';
import BeanieBabyApp from './apps/BeanieBabyApp';
import DollhouseApp from './apps/DollhouseApp';
import GroceryPlannerApp from './apps/GroceryPlannerApp';
import CatTrapMonitorApp from './apps/CatTrapMonitorApp';
// import { BrowserMultiFormatReader } from '@zxing/browser';

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
}

interface InteractiveProjectDemoProps {
  project: Project;
  isActive: boolean;
}

// Interactive 3D Dollhouse Component
const EditableWall = ({ position, args, color, onSelect, isSelected }: any) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  return (
    <Box 
      ref={meshRef}
      position={position} 
      args={args}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      <meshStandardMaterial 
        color={isSelected ? '#FF6B35' : color} 
        transparent
        opacity={isSelected ? 0.8 : 1}
      />
    </Box>
  );
};

const DollhouseDemo = () => {
  const groupRef = useRef<THREE.Group>(null);
  const [selectedWall, setSelectedWall] = useState<string | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  
  useFrame((state) => {
    if (groupRef.current && autoRotate) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
    }
  });

  const handleWallSelect = (wallId: string) => {
    setSelectedWall(wallId === selectedWall ? null : wallId);
    setAutoRotate(false);
  };

  return (
    <>
      <group ref={groupRef}>
        {/* House base */}
        <Box position={[0, -0.5, 0]} args={[2, 0.1, 2]} >
          <meshStandardMaterial color="#8B7355" />
        </Box>
        
        {/* Editable Walls */}
        <EditableWall
          position={[-1, 0.5, 0]}
          args={[0.1, 1, 2]}
          color="#E6D7C5"
          onSelect={() => handleWallSelect('left')}
          isSelected={selectedWall === 'left'}
        />
        <EditableWall
          position={[1, 0.5, 0]}
          args={[0.1, 1, 2]}
          color="#E6D7C5"
          onSelect={() => handleWallSelect('right')}
          isSelected={selectedWall === 'right'}
        />
        <EditableWall
          position={[0, 0.5, -1]}
          args={[2, 1, 0.1]}
          color="#E6D7C5"
          onSelect={() => handleWallSelect('back')}
          isSelected={selectedWall === 'back'}
        />
        <EditableWall
          position={[0, 0.5, 1]}
          args={[2, 1, 0.1]}
          color="#E6D7C5"
          onSelect={() => handleWallSelect('front')}
          isSelected={selectedWall === 'front'}
        />
        
        {/* Roof */}
        <Box position={[0, 1.2, 0]} args={[2.2, 0.1, 2.2]} rotation={[0, 0, 0]}>
          <meshStandardMaterial color="#8B4513" />
        </Box>
        
        {/* Windows */}
        <Box position={[-0.99, 0.7, -0.5]} args={[0.12, 0.3, 0.3]} >
          <meshStandardMaterial color="#87CEEB" />
        </Box>
        <Box position={[-0.99, 0.7, 0.5]} args={[0.12, 0.3, 0.3]} >
          <meshStandardMaterial color="#87CEEB" />
        </Box>
        
        {/* Door */}
        <Box position={[0.99, 0.4, 0]} args={[0.12, 0.8, 0.4]} >
          <meshStandardMaterial color="#654321" />
        </Box>
      </group>
    </>
  );
};

// AI Grocery Demo Component  
const GroceryAIDemo = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [preferences, setPreferences] = useState({
    dietary: 'none',
    budget: 50,
    people: 2,
    days: 7
  });
  const [mealPlan, setMealPlan] = useState<any[]>([]);
  const [generating, setGenerating] = useState(false);

  const dietaryOptions = ['none', 'vegetarian', 'vegan', 'keto', 'gluten-free'];
  
  const sampleMeals = {
    none: ['🍗 Chicken Teriyaki', '🥩 Beef Stir Fry', '🐟 Salmon Pasta', '🍝 Spaghetti Bolognese'],
    vegetarian: ['🥗 Caesar Salad', '🍝 Pasta Primavera', '🥘 Vegetable Curry', '🌯 Veggie Wrap'],
    vegan: ['🥘 Lentil Curry', '🥗 Quinoa Salad', '🌮 Black Bean Tacos', '🍜 Vegetable Ramen'],
    keto: ['🥑 Avocado Chicken', '🥩 Steak & Broccoli', '🐟 Salmon Salad', '🥓 Bacon & Eggs'],
    'gluten-free': ['🐟 Grilled Fish', '🥗 Garden Salad', '🍗 Herb Chicken', '🥘 Rice Bowl']
  };

  const generateMealPlan = () => {
    setGenerating(true);
    setTimeout(() => {
      const meals = sampleMeals[preferences.dietary as keyof typeof sampleMeals];
      const plan = Array.from({ length: preferences.days }, (_, i) => ({
        day: i + 1,
        meal: meals[i % meals.length],
        cost: (Math.random() * 8 + 5).toFixed(2)
      }));
      setMealPlan(plan);
      setGenerating(false);
      setCurrentStep(2);
    }, 2000);
  };

  const resetDemo = () => {
    setCurrentStep(0);
    setMealPlan([]);
    setPreferences({ dietary: 'none', budget: 50, people: 2, days: 7 });
  };

  if (currentStep === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-3">
        <div className="mb-4">
          <div className="text-4xl mb-4">🥗</div>
          <h3 className="text-lg font-semibold text-white">AI Meal Planner</h3>
        </div>
        
        <div className="space-y-2 w-full max-w-xs">
          <div>
            <label className="text-xs text-gray-400 block mb-1">Dietary Preference</label>
            <select 
              value={preferences.dietary}
              onChange={(e) => setPreferences(prev => ({ ...prev, dietary: e.target.value }))}
              className="w-full px-2 py-1 text-xs bg-gray-800 text-white rounded border border-gray-600"
            >
              {dietaryOptions.map(option => (
                <option key={option} value={option}>
                  {option === 'none' ? 'No restrictions' : option}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="text-xs text-gray-400 block mb-1">Budget: ${preferences.budget}</label>
            <input
              type="range"
              min="20"
              max="100"
              value={preferences.budget}
              onChange={(e) => setPreferences(prev => ({ ...prev, budget: parseInt(e.target.value) }))}
              className="w-full"
            />
          </div>
          
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-xs text-gray-400 block mb-1">People</label>
              <input
                type="number"
                min="1"
                max="8"
                value={preferences.people}
                onChange={(e) => setPreferences(prev => ({ ...prev, people: parseInt(e.target.value) }))}
                className="w-full px-2 py-1 text-xs bg-gray-800 text-white rounded border border-gray-600"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-400 block mb-1">Days</label>
              <input
                type="number"
                min="1"
                max="14"
                value={preferences.days}
                onChange={(e) => setPreferences(prev => ({ ...prev, days: parseInt(e.target.value) }))}
                className="w-full px-2 py-1 text-xs bg-gray-800 text-white rounded border border-gray-600"
              />
            </div>
          </div>
        </div>
        
        <button
          onClick={() => setCurrentStep(1)}
          className="mt-3 px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-opacity-80 transition-all text-xs"
        >
          Generate Plan
        </button>
      </div>
    );
  }

  if (currentStep === 1) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-3">
        <div className="mb-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-2xl mb-2"
          >
            🧠
          </motion.div>
          <h3 className="text-lg font-semibold text-white">AI is planning...</h3>
        </div>
        
        <div className="text-sm text-gray-400 space-y-1">
          <div>✓ Analyzing dietary preferences</div>
          <div>✓ Checking budget constraints</div>
          <div>✓ Optimizing nutrition balance</div>
          <div>✓ Generating shopping list</div>
        </div>
        
        <button
          onClick={generateMealPlan}
          disabled={generating}
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-opacity-80 transition-all text-sm disabled:opacity-50"
        >
          {generating ? 'Generating...' : 'Continue'}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-start h-full p-3 overflow-y-auto">
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-white text-center">Your Meal Plan</h3>
        <div className="text-xs text-gray-400 text-center">
          {preferences.people} people • ${preferences.budget} budget • {preferences.dietary !== 'none' ? preferences.dietary : 'no restrictions'}
        </div>
      </div>
      
      <div className="space-y-2 w-full max-w-xs mb-3">
        {mealPlan.map((meal, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex justify-between items-center bg-gray-800 p-2 rounded text-sm"
          >
            <div>
              <div className="text-white">Day {meal.day}</div>
              <div className="text-green-400 text-xs">{meal.meal}</div>
            </div>
            <div className="text-electric-blue font-semibold">${meal.cost}</div>
          </motion.div>
        ))}
      </div>
      
      <div className="text-center mb-3">
        <div className="text-sm text-gray-400">Total: ${mealPlan.reduce((sum, meal) => sum + parseFloat(meal.cost), 0).toFixed(2)}</div>
      </div>
      
      <button
        onClick={resetDemo}
        className="px-3 py-1 bg-electric-blue text-white rounded text-sm hover:bg-opacity-80 transition-all"
      >
        New Plan
      </button>
    </div>
  );
};

// Beanie Baby Scanner Demo
const BeanieScannerDemo = () => {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [hasCamera, setHasCamera] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [barcodeInput, setBarcodeInput] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Check camera availability
    navigator.mediaDevices?.getUserMedia({ video: true })
      .then(() => setHasCamera(true))
      .catch(() => setHasCamera(false));
  }, []);

  const beanieDatabase = {
    '008421403721': { name: 'Peace the Bear', year: '1996', rarity: 'Rare' },
    '008421404056': { name: 'Princess the Bear', year: '1997', rarity: 'Ultra Rare' },
    '008421404032': { name: 'Mystic the Unicorn', year: '1994', rarity: 'Common' },
    '008421404063': { name: 'Garcia the Bear', year: '1995', rarity: 'Rare' },
    '008421404018': { name: 'Valentino the Bear', year: '1993', rarity: 'Rare' }
  };

  const lookupBarcode = (barcode: string) => {
    const beanieInfo = beanieDatabase[barcode as keyof typeof beanieDatabase];
    if (beanieInfo) {
      setResult(`${beanieInfo.name} - ${beanieInfo.year} ${beanieInfo.rarity}`);
    } else {
      setResult(`Unknown barcode: ${barcode}`);
    }
  };

  const startScan = async () => {
    if (!hasCamera || !videoRef.current) {
      setError('Camera not available - using demo mode');
      testScan();
      return;
    }

    setScanning(true);
    setResult(null);
    setError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
      
      // Simulate barcode detection after 3 seconds
      setTimeout(() => {
        const sampleBarcodes = Object.keys(beanieDatabase);
        const randomBarcode = sampleBarcodes[Math.floor(Math.random() * sampleBarcodes.length)];
        lookupBarcode(randomBarcode);
        stopScan();
      }, 3000);
      
    } catch (err) {
      console.error('Camera error:', err);
      setError('Camera access denied');
      setScanning(false);
    }
  };

  const stopScan = () => {
    setScanning(false);
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const testScan = () => {
    setScanning(true);
    setResult(null);
    setTimeout(() => {
      setScanning(false);
      setResult('Peace the Bear - 1996 Rare');
    }, 2000);
  };

  const handleManualLookup = () => {
    if (barcodeInput.trim()) {
      lookupBarcode(barcodeInput.trim());
      setBarcodeInput('');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-3">
      <div className="relative w-40 h-32 mb-4">
        {scanning && hasCamera ? (
          <video
            ref={videoRef}
            className="w-full h-full rounded-lg object-cover"
            autoPlay
            playsInline
            muted
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
            {scanning ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="text-white text-2xl"
              >
                📷
              </motion.div>
            ) : (
              <span className="text-white text-2xl">🧸</span>
            )}
          </div>
        )}
        
        {scanning && (
          <motion.div
            className="absolute inset-0 border-2 border-electric-blue rounded-lg"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
        )}
      </div>

      <div className="flex gap-2 mb-2">
        <button
          onClick={startScan}
          disabled={scanning}
          className="px-3 py-2 bg-electric-blue text-white rounded-lg hover:bg-opacity-80 transition-all disabled:opacity-50 text-sm"
        >
          {scanning ? 'Scanning...' : hasCamera ? 'Camera Scan' : 'Demo Scan'}
        </button>
        {scanning && (
          <button
            onClick={stopScan}
            className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-opacity-80 transition-all text-sm"
          >
            Stop
          </button>
        )}
      </div>

      <div className="w-full max-w-xs mb-2">
        <div className="flex gap-1">
          <input
            type="text"
            placeholder="Enter barcode manually"
            value={barcodeInput}
            onChange={(e) => setBarcodeInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleManualLookup()}
            className="flex-1 px-2 py-1 text-xs bg-gray-800 text-white rounded border border-gray-600"
          />
          <button
            onClick={handleManualLookup}
            className="px-2 py-1 bg-purple-accent text-white rounded text-xs hover:bg-opacity-80"
          >
            Look Up
          </button>
        </div>
      </div>

      <div className="text-xs text-gray-400 text-center mb-2">
        Try: 008421403721, 008421404056, 008421404032
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-2 text-center"
          >
            <div className="text-yellow-400 text-xs">{error}</div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-center"
          >
            <div className="text-purple-accent font-semibold">{result}</div>
            <div className="text-sm text-gray-400">Added to collection</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Cat Trap Monitor Demo
const CatTrapDemo = () => {
  const [detecting, setDetecting] = useState(false);
  const [catDetected, setCatDetected] = useState(false);
  const [motionLevel, setMotionLevel] = useState(0);
  const [confidence, setConfidence] = useState(0);
  const [detectionHistory, setDetectionHistory] = useState<string[]>([]);
  const [hasCamera, setHasCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    navigator.mediaDevices?.getUserMedia({ video: true })
      .then(() => setHasCamera(true))
      .catch(() => setHasCamera(false));
  }, []);

  const simulateMotionDetection = () => {
    if (intervalRef.current) return;
    
    intervalRef.current = setInterval(() => {
      const motion = Math.random() * 100;
      setMotionLevel(motion);
      
      if (motion > 60) {
        const conf = Math.random() * 100;
        setConfidence(conf);
        
        if (conf > 75) {
          setCatDetected(true);
          setDetectionHistory(prev => [
            `${new Date().toLocaleTimeString()}: Cat detected (${conf.toFixed(1)}%)`,
            ...prev.slice(0, 2)
          ]);
          
          setTimeout(() => {
            setCatDetected(false);
            setConfidence(0);
          }, 2000);
        }
      }
    }, 500);
  };

  const startDetection = async () => {
    setDetecting(true);
    setCatDetected(false);
    setDetectionHistory([]);
    
    if (hasCamera && videoRef.current) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      } catch (err) {
        console.error('Camera access denied:', err);
      }
    }
    
    simulateMotionDetection();
  };

  const stopDetection = () => {
    setDetecting(false);
    setCatDetected(false);
    setMotionLevel(0);
    setConfidence(0);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  return (
    <div className="flex flex-col items-center justify-start h-full p-3 overflow-y-auto">
      <div className="relative w-40 h-28 mb-3">
        {detecting && hasCamera ? (
          <video
            ref={videoRef}
            className="w-full h-full rounded-lg object-cover border-2 border-green-500"
            autoPlay
            playsInline
            muted
          />
        ) : (
          <div className="w-full h-full bg-gray-800 rounded-lg border-2 border-gray-600 flex items-center justify-center">
            {detecting ? (
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="text-2xl"
              >
                📹
              </motion.div>
            ) : catDetected ? (
              <div className="text-2xl">🐱</div>
            ) : (
              <div className="text-gray-500 text-xl">📷</div>
            )}
          </div>
        )}
        
        {detecting && (
          <div className="absolute top-2 right-2">
            <motion.div
              className="w-3 h-3 bg-red-500 rounded-full"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
          </div>
        )}
        
        {catDetected && (
          <div className="absolute inset-0 border-2 border-red-500 rounded-lg">
            <div className="absolute -top-6 left-0 text-xs text-red-500 bg-black px-1 rounded">
              CAT {confidence.toFixed(1)}%
            </div>
          </div>
        )}
      </div>

      {detecting && (
        <div className="w-full max-w-xs mb-3 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">Motion:</span>
            <span className={motionLevel > 60 ? 'text-red-400' : 'text-green-400'}>
              {motionLevel.toFixed(0)}%
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-1">
            <motion.div
              className={`h-1 rounded-full ${
                motionLevel > 60 ? 'bg-red-500' : 'bg-green-500'
              }`}
              style={{ width: `${motionLevel}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          
          {confidence > 0 && (
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">AI Confidence:</span>
              <span className={confidence > 75 ? 'text-green-400' : 'text-yellow-400'}>
                {confidence.toFixed(1)}%
              </span>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-2 mb-3">
        <button
          onClick={startDetection}
          disabled={detecting}
          className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-opacity-80 transition-all disabled:opacity-50 text-sm"
        >
          {detecting ? 'Monitoring...' : hasCamera ? 'Live Monitor' : 'Demo Monitor'}
        </button>
        
        {detecting && (
          <button
            onClick={stopDetection}
            className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-opacity-80 transition-all text-sm"
          >
            Stop
          </button>
        )}
      </div>

      {!hasCamera && (
        <div className="text-xs text-gray-500 mb-2 text-center">
          Camera not available - using simulation
        </div>
      )}

      <AnimatePresence>
        {catDetected && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-3 text-center"
          >
            <div className="text-green-400 font-semibold">🚨 Cat Detected!</div>
            <div className="text-sm text-gray-400">Alert sent • Screenshot saved</div>
          </motion.div>
        )}
      </AnimatePresence>

      {detectionHistory.length > 0 && (
        <div className="w-full max-w-xs">
          <div className="text-xs text-gray-400 mb-1">Detection Log:</div>
          <div className="space-y-1 max-h-20 overflow-y-auto">
            {detectionHistory.map((log, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-xs text-green-400 bg-gray-800 p-1 rounded"
              >
                {log}
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const InteractiveProjectDemo: React.FC<InteractiveProjectDemoProps> = ({ project, isActive }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [featuresExpanded, setFeaturesExpanded] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);
  const renderDemo = () => {
    switch (project.id) {
      case 'aritrova':
        return (
          <div className="relative w-full h-full">
            <Canvas camera={{ position: [3, 3, 3], fov: 60 }}>
              <ambientLight intensity={0.6} />
              <pointLight position={[10, 10, 10]} intensity={0.8} />
              <DollhouseDemo />
            </Canvas>
            <div className="absolute bottom-2 left-2 text-xs text-white bg-black bg-opacity-50 p-2 rounded">
              Click walls to select • Interactive 3D editor
            </div>
          </div>
        );
      case 'grocery-ai':
        return (
          <div className="relative w-full h-full">
            <GroceryAIDemo />
          </div>
        );
      case 'beanie-scanner':
        return <BeanieScannerDemo />;
      case 'cat-trap':
        return (
          <div className="relative w-full h-full">
            <CatTrapDemo />
          </div>
        );
      case 'bookexchange':
        return (
          <div className="flex flex-col items-center justify-center h-full p-3 bg-gradient-to-br from-blue-900 to-purple-900 rounded-lg">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-lg font-semibold text-white mb-2">iOS Textbook Exchange</h3>
            <div className="space-y-2 text-sm text-center">
              <div className="flex items-center gap-2 bg-black bg-opacity-30 p-2 rounded">
                <span className="text-green-400">✓</span>
                <span className="text-white">Swift + Firebase Backend</span>
              </div>
              <div className="flex items-center gap-2 bg-black bg-opacity-30 p-2 rounded">
                <span className="text-green-400">✓</span>
                <span className="text-white">Real-time Chat System</span>
              </div>
              <div className="flex items-center gap-2 bg-black bg-opacity-30 p-2 rounded">
                <span className="text-green-400">✓</span>
                <span className="text-white">Location-based Matching</span>
              </div>
            </div>
            <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm">
              View on GitHub
            </button>
          </div>
        );
      case 'traceforge':
        return (
          <div className="flex flex-col items-center justify-center h-full p-3">
            <div className="grid grid-cols-2 gap-2 w-full max-w-xs mb-4">
              <div className="bg-gray-800 p-2 rounded text-center">
                <div className="text-green-400 font-bold">98%</div>
                <div className="text-xs text-gray-400">CPU</div>
              </div>
              <div className="bg-gray-800 p-2 rounded text-center">
                <div className="text-blue-400 font-bold">2.1GB</div>
                <div className="text-xs text-gray-400">RAM</div>
              </div>
              <div className="bg-gray-800 p-2 rounded text-center">
                <div className="text-purple-400 font-bold">45°C</div>
                <div className="text-xs text-gray-400">TEMP</div>
              </div>
              <div className="bg-gray-800 p-2 rounded text-center">
                <div className="text-yellow-400 font-bold">12ms</div>
                <div className="text-xs text-gray-400">PING</div>
              </div>
            </div>
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-2xl mb-2"
            >
              📈
            </motion.div>
            <h3 className="text-white font-semibold">System Monitor</h3>
            <p className="text-xs text-gray-400 text-center">Real-time analytics & alerts</p>
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-6xl opacity-50">{project.type === '3d' ? '🎲' : project.type === 'ai' ? '🧠' : '💻'}</div>
          </div>
        );
    }
  };

  return (
    <motion.div
      layout
      data-project-id={project.id}
      className={`relative overflow-hidden rounded-lg transition-all duration-300 group ${
        isActive ? 'scale-105 shadow-2xl' : 'hover:scale-102 hover:shadow-xl'
      }`}
      style={{ backgroundColor: project.color + '20' }}
    >
      <div className="h-80 relative">
        {renderDemo()}
        

        {/* Overlay info */}
        <div className="absolute top-4 left-4 right-4">
          <div className="flex items-center justify-between">
            <span className="px-2 py-1 bg-black bg-opacity-50 rounded text-xs text-white">
              {project.type.toUpperCase()}
            </span>
            <div className="flex gap-2">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-1 bg-black bg-opacity-50 rounded hover:bg-opacity-70 transition-all"
                >
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-3">
          <h3 className="text-lg font-bold mb-1 text-white">{project.title}</h3>
          <p className="text-gray-300 text-xs leading-relaxed line-clamp-2">{project.description}</p>
        </div>
        
        <div className="mb-3">
          <div className="flex flex-wrap gap-1 mb-2">
            {project.techStack.slice(0, 5).map((tech, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs rounded-full bg-opacity-20 text-white"
                style={{ backgroundColor: project.color }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-1">
          {(featuresExpanded ? project.features : project.features.slice(0, 2)).map((feature, index) => (
            <div key={index} className="flex items-start text-xs text-gray-400">
              <span className="text-electric-blue mr-2 text-xs mt-0.5 shrink-0">▶</span>
              <span className={featuresExpanded ? "" : "line-clamp-1"}>{feature}</span>
            </div>
          ))}
          {project.features.length > 2 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setFeaturesExpanded(!featuresExpanded);
              }}
              className="text-xs text-electric-blue hover:text-white transition-all mt-1"
            >
              {featuresExpanded ? '▲ Show less' : `▼ Show ${project.features.length - 2} more features`}
            </button>
          )}
        </div>
        
        <button 
          onClick={openModal}
          className="mt-3 pt-3 border-t border-gray-700 w-full flex items-center justify-center gap-2 text-xs text-electric-blue hover:text-white transition-all hover:bg-gray-800 hover:bg-opacity-50 py-2 rounded-b-lg"
        >
          <ExternalLink size={12} />
          <span>Open Full Interactive Demo</span>
        </button>
      </div>

      {/* Modal */}
      <ProjectModal
        isOpen={modalOpen}
        onClose={closeModal}
        title={project.title}
      >
        {project.id === 'beanie-scanner' && <BeanieBabyApp />}
        {project.id === 'aritrova' && <DollhouseApp />}
        {project.id === 'grocery-ai' && <GroceryPlannerApp />}
        {project.id === 'cat-trap' && <CatTrapMonitorApp />}
        {!['beanie-scanner', 'aritrova', 'grocery-ai', 'cat-trap'].includes(project.id) && (
          <div className="h-full flex items-center justify-center text-white">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">{project.title}</h3>
              <p className="text-gray-400 mb-4">Full application demo coming soon...</p>
              <p className="text-sm text-gray-500">{project.description}</p>
            </div>
          </div>
        )}
      </ProjectModal>
    </motion.div>
  );
};

export default InteractiveProjectDemo;