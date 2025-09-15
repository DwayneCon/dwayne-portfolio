import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  Monitor, 
  Settings, 
  AlertTriangle, 
  CheckCircle, 
  Activity,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Save,
  Download,
  Calendar,
  Clock,
  MapPin,
  Battery,
  Wifi,
  Eye,
  Target
} from 'lucide-react';

interface Detection {
  id: string;
  timestamp: string;
  confidence: number;
  imageUrl: string;
  status: 'cat_detected' | 'motion_only' | 'false_positive';
  location: string;
}

interface CameraFeed {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline' | 'recording';
  battery: number;
  signal: number;
  lastMotion: string;
}

const CatTrapMonitorApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'live' | 'detections' | 'analytics' | 'settings'>('live');
  const [isRecording, setIsRecording] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedCamera, setSelectedCamera] = useState('trap_01');
  const [detections, setDetections] = useState<Detection[]>([
    {
      id: '1',
      timestamp: '2024-09-14 08:23:15',
      confidence: 94.5,
      imageUrl: '/api/placeholder/320/240',
      status: 'cat_detected',
      location: 'Backyard Trap A'
    },
    {
      id: '2', 
      timestamp: '2024-09-14 06:17:42',
      confidence: 87.2,
      imageUrl: '/api/placeholder/320/240',
      status: 'cat_detected',
      location: 'Side Yard Trap B'
    },
    {
      id: '3',
      timestamp: '2024-09-14 04:33:28',
      confidence: 62.1,
      imageUrl: '/api/placeholder/320/240',
      status: 'motion_only',
      location: 'Backyard Trap A'
    }
  ]);

  const [cameras] = useState<CameraFeed[]>([
    {
      id: 'trap_01',
      name: 'Backyard Trap A',
      location: 'Rear Garden',
      status: 'online',
      battery: 87,
      signal: 92,
      lastMotion: '2 minutes ago'
    },
    {
      id: 'trap_02', 
      name: 'Side Yard Trap B',
      location: 'East Side',
      status: 'recording',
      battery: 45,
      signal: 78,
      lastMotion: '1 hour ago'
    },
    {
      id: 'trap_03',
      name: 'Front Porch Setup',
      location: 'Main Entry',
      status: 'offline',
      battery: 12,
      signal: 0,
      lastMotion: '3 hours ago'
    }
  ]);

  const [aiSettings, setAiSettings] = useState({
    sensitivity: 75,
    confidence_threshold: 70,
    motion_detection: true,
    night_vision: true,
    auto_recording: true,
    notification_sounds: true,
    species_filter: 'cats_only'
  });

  // Simulate live detection
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.85) {
        const newDetection: Detection = {
          id: Date.now().toString(),
          timestamp: new Date().toLocaleString(),
          confidence: Math.floor(Math.random() * 40) + 60,
          imageUrl: '/api/placeholder/320/240',
          status: Math.random() > 0.3 ? 'cat_detected' : 'motion_only',
          location: cameras[Math.floor(Math.random() * cameras.length)].name
        };
        setDetections(prev => [newDetection, ...prev.slice(0, 19)]);
        
        if (soundEnabled && newDetection.status === 'cat_detected') {
          // Simulate notification sound
          console.log('🔔 Cat detected!', newDetection);
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [soundEnabled, cameras]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'cat_detected': return 'text-red-400';
      case 'motion_only': return 'text-yellow-400';
      case 'false_positive': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <CheckCircle size={12} className="text-green-400" />;
      case 'recording': return <Activity size={12} className="text-red-400" />;
      case 'offline': return <AlertTriangle size={12} className="text-gray-400" />;
      default: return null;
    }
  };

  const selectedCameraData = cameras.find(cam => cam.id === selectedCamera);

  return (
    <div className="h-full bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 bg-gray-800">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold mb-1">AI Cat Trap Monitor</h1>
            <p className="text-gray-400 text-sm">Computer vision surveillance system</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                System Active
              </div>
            </div>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
            >
              {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex border-b border-gray-700">
        {[
          { id: 'live', label: 'Live Feed', icon: Monitor },
          { id: 'detections', label: 'Detections', icon: Eye },
          { id: 'analytics', label: 'Analytics', icon: Activity },
          { id: 'settings', label: 'Settings', icon: Settings },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as any)}
            className={`flex-1 flex items-center justify-center gap-2 p-3 text-sm font-medium transition-all ${
              activeTab === id
                ? 'bg-blue-700 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      <div className="p-4 h-[calc(100%-8rem)] overflow-auto">
        {/* Live Feed Tab */}
        {activeTab === 'live' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
            {/* Main Feed */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold">{selectedCameraData?.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">{selectedCameraData?.location}</span>
                    {getStatusIcon(selectedCameraData?.status || 'offline')}
                  </div>
                </div>
                
                {/* Video Feed Simulation */}
                <div className="relative aspect-video bg-black rounded border border-gray-600 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <div className="text-center">
                      <Camera size={48} className="mx-auto mb-2 text-gray-600" />
                      <p className="text-gray-500 text-sm">Live Camera Feed</p>
                      <p className="text-xs text-gray-600 mt-1">
                        {selectedCameraData?.status === 'online' ? 'Monitoring...' : 'Camera Offline'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Recording indicator */}
                  {isRecording && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 bg-red-600 px-2 py-1 rounded text-xs">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      REC
                    </div>
                  )}
                  
                  {/* Crosshair overlay */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <Target size={24} className="text-red-400 opacity-50" />
                    </div>
                  </div>
                  
                  {/* AI Detection Overlay */}
                  {selectedCameraData?.status === 'recording' && (
                    <div className="absolute bottom-2 left-2 bg-red-600 bg-opacity-90 px-2 py-1 rounded text-xs">
                      🐱 Cat Detected • 89% Confidence
                    </div>
                  )}
                </div>
                
                {/* Controls */}
                <div className="flex justify-between items-center mt-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsRecording(!isRecording)}
                      className={`p-2 rounded ${isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 hover:bg-gray-700'}`}
                    >
                      {isRecording ? <Pause size={16} /> : <Play size={16} />}
                    </button>
                    <button className="p-2 bg-gray-600 hover:bg-gray-700 rounded">
                      <Save size={16} />
                    </button>
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date().toLocaleTimeString()}
                  </div>
                </div>
              </div>

              {/* Recent Detections */}
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <h3 className="font-semibold mb-3">Recent Detections</h3>
                <div className="space-y-2 max-h-40 overflow-auto">
                  {detections.slice(0, 5).map((detection) => (
                    <div key={detection.id} className="flex items-center gap-3 p-2 bg-gray-700 rounded">
                      <div className="w-12 h-8 bg-gray-600 rounded flex items-center justify-center">
                        <Camera size={12} />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-medium">{detection.location}</div>
                        <div className="text-xs text-gray-400">{detection.timestamp}</div>
                      </div>
                      <div className={`text-xs font-medium ${getStatusColor(detection.status)}`}>
                        {detection.confidence}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Camera List */}
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <h3 className="font-semibold mb-3">Cameras</h3>
                <div className="space-y-2">
                  {cameras.map((camera) => (
                    <button
                      key={camera.id}
                      onClick={() => setSelectedCamera(camera.id)}
                      className={`w-full p-3 rounded text-left transition-all ${
                        selectedCamera === camera.id ? 'bg-blue-700' : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">{camera.name}</span>
                        {getStatusIcon(camera.status)}
                      </div>
                      <div className="text-xs text-gray-400 mb-2">{camera.location}</div>
                      <div className="flex justify-between text-xs">
                        <div className="flex items-center gap-1">
                          <Battery size={10} />
                          {camera.battery}%
                        </div>
                        <div className="flex items-center gap-1">
                          <Wifi size={10} />
                          {camera.signal}%
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* System Stats */}
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <h3 className="font-semibold mb-3">System Status</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Active Cameras</span>
                    <span>{cameras.filter(c => c.status !== 'offline').length}/{cameras.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Today's Detections</span>
                    <span className="text-red-400">{detections.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">AI Confidence Avg</span>
                    <span>84.2%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Storage Used</span>
                    <span>12.4 GB</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Detections Tab */}
        {activeTab === 'detections' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Detection History</h2>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm">
                  <Download size={14} className="inline mr-1" />
                  Export
                </button>
                <select className="px-3 py-1 bg-gray-700 border border-gray-600 rounded text-sm">
                  <option>All Cameras</option>
                  <option>Backyard Trap A</option>
                  <option>Side Yard Trap B</option>
                </select>
              </div>
            </div>

            <div className="grid gap-3">
              {detections.map((detection) => (
                <div key={detection.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <div className="flex gap-4">
                    <div className="w-24 h-16 bg-gray-700 rounded flex items-center justify-center">
                      <Camera size={20} className="text-gray-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium">{detection.location}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Clock size={12} />
                            {detection.timestamp}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-sm font-medium ${getStatusColor(detection.status)}`}>
                            {detection.status.replace('_', ' ').toUpperCase()}
                          </div>
                          <div className="text-xs text-gray-400">
                            Confidence: {detection.confidence}%
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs">
                          View Full Image
                        </button>
                        <button className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs">
                          Mark as False Positive
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Detection Analytics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <h3 className="text-sm text-gray-400 mb-1">Total Detections</h3>
                <div className="text-2xl font-bold text-red-400">247</div>
                <div className="text-xs text-gray-500">+12 this week</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <h3 className="text-sm text-gray-400 mb-1">Avg Confidence</h3>
                <div className="text-2xl font-bold text-green-400">84.2%</div>
                <div className="text-xs text-gray-500">+2.1% improvement</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <h3 className="text-sm text-gray-400 mb-1">Active Traps</h3>
                <div className="text-2xl font-bold text-blue-400">2/3</div>
                <div className="text-xs text-gray-500">1 offline</div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <h3 className="font-semibold mb-3">Detection Timeline</h3>
              <div className="h-32 bg-gray-700 rounded flex items-center justify-center">
                <div className="text-gray-500 text-sm">
                  📊 Detection frequency chart would be rendered here
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <h3 className="font-semibold mb-3">Most Active Locations</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Backyard Trap A</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-gray-600 rounded">
                      <div className="w-3/4 h-full bg-red-400 rounded"></div>
                    </div>
                    <span className="text-sm">156</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Side Yard Trap B</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-gray-600 rounded">
                      <div className="w-1/2 h-full bg-yellow-400 rounded"></div>
                    </div>
                    <span className="text-sm">91</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Front Porch Setup</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-gray-600 rounded">
                      <div className="w-1/4 h-full bg-gray-400 rounded"></div>
                    </div>
                    <span className="text-sm">0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">System Settings</h2>
            
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <h3 className="font-semibold mb-4">AI Detection Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Detection Sensitivity: {aiSettings.sensitivity}%
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={aiSettings.sensitivity}
                    onChange={(e) => setAiSettings(prev => ({ ...prev, sensitivity: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Confidence Threshold: {aiSettings.confidence_threshold}%
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="95"
                    value={aiSettings.confidence_threshold}
                    onChange={(e) => setAiSettings(prev => ({ ...prev, confidence_threshold: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={aiSettings.motion_detection}
                      onChange={(e) => setAiSettings(prev => ({ ...prev, motion_detection: e.target.checked }))}
                    />
                    <span className="text-sm">Motion Detection</span>
                  </label>
                  
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={aiSettings.night_vision}
                      onChange={(e) => setAiSettings(prev => ({ ...prev, night_vision: e.target.checked }))}
                    />
                    <span className="text-sm">Night Vision</span>
                  </label>
                  
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={aiSettings.auto_recording}
                      onChange={(e) => setAiSettings(prev => ({ ...prev, auto_recording: e.target.checked }))}
                    />
                    <span className="text-sm">Auto Recording</span>
                  </label>
                  
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={aiSettings.notification_sounds}
                      onChange={(e) => setAiSettings(prev => ({ ...prev, notification_sounds: e.target.checked }))}
                    />
                    <span className="text-sm">Sound Alerts</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <h3 className="font-semibold mb-4">Camera Configuration</h3>
              <div className="space-y-3">
                {cameras.map((camera) => (
                  <div key={camera.id} className="flex justify-between items-center p-3 bg-gray-700 rounded">
                    <div>
                      <div className="font-medium">{camera.name}</div>
                      <div className="text-sm text-gray-400">{camera.location}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(camera.status)}
                      <button className="px-2 py-1 bg-gray-600 hover:bg-gray-500 rounded text-xs">
                        Configure
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <h3 className="font-semibold mb-4">Storage & Data</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Video Storage</span>
                  <span className="text-sm">12.4 GB / 50 GB</span>
                </div>
                <div className="w-full h-2 bg-gray-600 rounded">
                  <div className="w-1/4 h-full bg-blue-400 rounded"></div>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-xs">
                    Clear Old Data
                  </button>
                  <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs">
                    Export Archive
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CatTrapMonitorApp;