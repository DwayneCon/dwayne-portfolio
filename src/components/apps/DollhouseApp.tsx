import React, { useState, useRef, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box, OrbitControls } from '@react-three/drei';
import { Layers, Download, Upload, Settings, Undo, Redo, Save } from 'lucide-react';
import * as THREE from 'three';

interface WallComponent {
  id: string;
  type: 'wall' | 'door' | 'window';
  position: [number, number, number];
  dimensions: [number, number, number];
  color: string;
  selected: boolean;
}

const EditableComponent: React.FC<{
  component: WallComponent;
  onSelect: (id: string) => void;
  onUpdate: (id: string, updates: Partial<WallComponent>) => void;
}> = ({ component, onSelect, onUpdate }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  return (
    <Box
      ref={meshRef}
      position={component.position}
      args={component.dimensions}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(component.id);
      }}
    >
      <meshStandardMaterial
        color={component.selected ? '#FF6B35' : component.color}
        transparent
        opacity={component.selected ? 0.8 : 1}
      />
    </Box>
  );
};

const DollhouseScene: React.FC<{
  components: WallComponent[];
  onSelectComponent: (id: string) => void;
  onUpdateComponent: (id: string, updates: Partial<WallComponent>) => void;
}> = ({ components, onSelectComponent, onUpdateComponent }) => {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 10]} intensity={0.8} />
      <pointLight position={[-10, -10, -10]} intensity={0.3} />
      
      {/* Ground plane */}
      <Box position={[0, -0.55, 0]} args={[10, 0.1, 10]}>
        <meshStandardMaterial color="#8B7355" />
      </Box>
      
      {/* Grid helper */}
      <gridHelper args={[10, 10, '#666', '#333']} position={[0, -0.5, 0]} />
      
      {/* Editable components */}
      {components.map((component) => (
        <EditableComponent
          key={component.id}
          component={component}
          onSelect={onSelectComponent}
          onUpdate={onUpdateComponent}
        />
      ))}
      
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2}
      />
    </>
  );
};

const DollhouseApp: React.FC = () => {
  const [components, setComponents] = useState<WallComponent[]>([
    {
      id: '1',
      type: 'wall',
      position: [-2, 0.5, 0],
      dimensions: [0.1, 1, 4],
      color: '#E6D7C5',
      selected: false,
    },
    {
      id: '2',
      type: 'wall',
      position: [2, 0.5, 0],
      dimensions: [0.1, 1, 4],
      color: '#E6D7C5',
      selected: false,
    },
    {
      id: '3',
      type: 'wall',
      position: [0, 0.5, -2],
      dimensions: [4, 1, 0.1],
      color: '#E6D7C5',
      selected: false,
    },
    {
      id: '4',
      type: 'wall',
      position: [0, 0.5, 2],
      dimensions: [4, 1, 0.1],
      color: '#E6D7C5',
      selected: false,
    },
    {
      id: '5',
      type: 'window',
      position: [-1.95, 0.7, -1],
      dimensions: [0.2, 0.3, 0.3],
      color: '#87CEEB',
      selected: false,
    },
    {
      id: '6',
      type: 'door',
      position: [1.95, 0.4, 0],
      dimensions: [0.2, 0.8, 0.4],
      color: '#654321',
      selected: false,
    },
  ]);

  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'design' | 'export' | 'settings'>('design');

  const handleSelectComponent = (id: string) => {
    const newComponents = components.map(comp => ({
      ...comp,
      selected: comp.id === id
    }));
    setComponents(newComponents);
    setSelectedComponent(id);
  };

  const handleUpdateComponent = (id: string, updates: Partial<WallComponent>) => {
    const newComponents = components.map(comp =>
      comp.id === id ? { ...comp, ...updates } : comp
    );
    setComponents(newComponents);
  };

  const addComponent = (type: 'wall' | 'door' | 'window') => {
    const newId = Date.now().toString();
    const newComponent: WallComponent = {
      id: newId,
      type,
      position: [0, 0.5, 0],
      dimensions: type === 'wall' ? [0.1, 1, 2] : type === 'door' ? [0.2, 0.8, 0.4] : [0.2, 0.3, 0.3],
      color: type === 'wall' ? '#E6D7C5' : type === 'door' ? '#654321' : '#87CEEB',
      selected: false,
    };
    
    const newComponents = [...components, newComponent];
    setComponents(newComponents);
  };

  const deleteSelected = () => {
    if (selectedComponent) {
      const newComponents = components.filter(comp => comp.id !== selectedComponent);
      setComponents(newComponents);
      setSelectedComponent(null);
    }
  };

  const exportToSVG = () => {
    const svgData = components.map(comp => ({
      type: comp.type,
      position: comp.position,
      dimensions: comp.dimensions,
    }));
    
    console.log('Exporting to SVG:', svgData);
    alert('SVG export functionality simulated! Check console for data.');
  };

  const selectedComp = components.find(comp => comp.id === selectedComponent);

  return (
    <div className="h-full bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-800 text-white flex">
      {/* Sidebar */}
      <div className="w-80 bg-gray-900 border-r border-gray-700 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold mb-1">Aritrova Designer</h1>
          <p className="text-gray-400 text-sm">3D Dollhouse Editor</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700">
          {[
            { id: 'design', label: 'Design', icon: Layers },
            { id: 'export', label: 'Export', icon: Download },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex-1 flex items-center justify-center gap-2 p-3 text-sm ${
                activeTab === id
                  ? 'bg-blue-700 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 p-4 overflow-auto">
          {activeTab === 'design' && (
            <div className="space-y-4">
              {/* Tools */}
              <div>
                <h3 className="text-sm font-semibold mb-2 text-gray-300">Add Components</h3>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => addComponent('wall')}
                    className="p-2 bg-gray-800 hover:bg-gray-700 rounded text-xs"
                  >
                    Wall
                  </button>
                  <button
                    onClick={() => addComponent('door')}
                    className="p-2 bg-gray-800 hover:bg-gray-700 rounded text-xs"
                  >
                    Door
                  </button>
                  <button
                    onClick={() => addComponent('window')}
                    className="p-2 bg-gray-800 hover:bg-gray-700 rounded text-xs"
                  >
                    Window
                  </button>
                </div>
              </div>

              {/* Selection Properties */}
              {selectedComp && (
                <div>
                  <h3 className="text-sm font-semibold mb-2 text-gray-300">Properties</h3>
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Type</label>
                      <div className="text-sm capitalize">{selectedComp.type}</div>
                    </div>
                    
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Position</label>
                      <div className="grid grid-cols-3 gap-1">
                        {['X', 'Y', 'Z'].map((axis, index) => (
                          <input
                            key={axis}
                            type="number"
                            value={selectedComp.position[index]}
                            onChange={(e) => {
                              const newPosition = [...selectedComp.position] as [number, number, number];
                              newPosition[index] = parseFloat(e.target.value) || 0;
                              handleUpdateComponent(selectedComp.id, { position: newPosition });
                            }}
                            className="px-2 py-1 bg-gray-800 border border-gray-600 rounded text-xs"
                            step="0.1"
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Dimensions</label>
                      <div className="grid grid-cols-3 gap-1">
                        {['W', 'H', 'D'].map((dim, index) => (
                          <input
                            key={dim}
                            type="number"
                            value={selectedComp.dimensions[index]}
                            onChange={(e) => {
                              const newDimensions = [...selectedComp.dimensions] as [number, number, number];
                              newDimensions[index] = parseFloat(e.target.value) || 0.1;
                              handleUpdateComponent(selectedComp.id, { dimensions: newDimensions });
                            }}
                            className="px-2 py-1 bg-gray-800 border border-gray-600 rounded text-xs"
                            step="0.1"
                            min="0.1"
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Color</label>
                      <input
                        type="color"
                        value={selectedComp.color}
                        onChange={(e) => handleUpdateComponent(selectedComp.id, { color: e.target.value })}
                        className="w-full h-8 bg-gray-800 border border-gray-600 rounded"
                      />
                    </div>

                    <button
                      onClick={deleteSelected}
                      className="w-full p-2 bg-red-700 hover:bg-red-600 rounded text-xs"
                    >
                      Delete Component
                    </button>
                  </div>
                </div>
              )}

              {/* Component List */}
              <div>
                <h3 className="text-sm font-semibold mb-2 text-gray-300">Components ({components.length})</h3>
                <div className="space-y-1 max-h-32 overflow-auto">
                  {components.map((comp) => (
                    <button
                      key={comp.id}
                      onClick={() => handleSelectComponent(comp.id)}
                      className={`w-full p-2 text-left rounded text-xs ${
                        comp.selected ? 'bg-blue-700' : 'bg-gray-800 hover:bg-gray-700'
                      }`}
                    >
                      <div className="capitalize font-medium">{comp.type} #{comp.id}</div>
                      <div className="text-gray-400 text-xs">
                        {comp.position.map(v => v.toFixed(1)).join(', ')}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'export' && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold mb-2 text-gray-300">Export Options</h3>
              
              <div className="space-y-3">
                <button
                  onClick={exportToSVG}
                  className="w-full p-3 bg-green-700 hover:bg-green-600 rounded text-sm flex items-center justify-center gap-2"
                >
                  <Download size={16} />
                  Export to SVG (Laser Cutting)
                </button>
                
                <button className="w-full p-3 bg-blue-700 hover:bg-blue-600 rounded text-sm flex items-center justify-center gap-2">
                  <Download size={16} />
                  Export 3D Model (GLTF)
                </button>
                
                <button className="w-full p-3 bg-purple-700 hover:bg-purple-600 rounded text-sm flex items-center justify-center gap-2">
                  <Save size={16} />
                  Save Project
                </button>
              </div>

              <div className="text-xs text-gray-400 space-y-1">
                <p>• SVG: 2D panels for laser cutting</p>
                <p>• GLTF: 3D model for visualization</p>
                <p>• Project: Save current design</p>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold mb-2 text-gray-300">Settings</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Grid Size</label>
                  <input
                    type="range"
                    min="5"
                    max="20"
                    defaultValue="10"
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Snap to Grid</label>
                  <input type="checkbox" defaultChecked className="mr-2" />
                  <span className="text-sm">Enable snapping</span>
                </div>
                
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Material Thickness</label>
                  <input
                    type="number"
                    defaultValue="3"
                    step="0.5"
                    min="1"
                    max="10"
                    className="w-full px-2 py-1 bg-gray-800 border border-gray-600 rounded text-sm"
                  />
                  <span className="text-xs text-gray-500">mm</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3D Viewport */}
      <div className="flex-1 relative">
        <Suspense fallback={<div className="flex items-center justify-center h-full text-gray-400">Loading 3D Scene...</div>}>
          <Canvas
            camera={{ position: [5, 5, 5], fov: 60 }}
            className="w-full h-full"
          >
            <DollhouseScene
              components={components}
              onSelectComponent={handleSelectComponent}
              onUpdateComponent={handleUpdateComponent}
            />
          </Canvas>
        </Suspense>
        
        {/* Viewport Controls */}
        <div className="absolute top-4 right-4 bg-gray-900 bg-opacity-90 rounded-lg p-2">
          <div className="text-xs text-gray-400 space-y-1">
            <div>• Click to select</div>
            <div>• Drag to orbit</div>
            <div>• Scroll to zoom</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DollhouseApp;