import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, Search, Package, Star, AlertCircle } from 'lucide-react';

interface BeanieItem {
  id: string;
  name: string;
  year: string;
  rarity: string;
  estimatedValue: string;
  description: string;
  tags: string[];
  image?: string;
}

interface CollectionItem extends BeanieItem {
  quantity: number;
  condition: string;
  notes: string;
  dateAdded: string;
}

const BeanieBabyApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'scan' | 'collection' | 'search'>('scan');
  const [collection, setCollection] = useState<CollectionItem[]>([]);
  const [scanResult, setScanResult] = useState<BeanieItem | null>(null);
  const [scanning, setScanning] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sample database matching your actual project structure
  const beanieDatabase: Record<string, BeanieItem> = {
    '008421403721': {
      id: '008421403721',
      name: 'Peace the Bear',
      year: '1996',
      rarity: 'Rare',
      estimatedValue: '$300-500',
      description: 'Tie-dyed bear with peace symbol. Original release with errors in tush tag.',
      tags: ['bear', 'tie-dye', 'peace', 'symbol', 'errors'],
    },
    '008421404056': {
      id: '008421404056',
      name: 'Princess the Bear',
      year: '1997',
      rarity: 'Ultra Rare',
      estimatedValue: '$3,000-15,000',
      description: 'Purple bear made in memory of Princess Diana. First edition with PE pellets.',
      tags: ['bear', 'purple', 'princess', 'diana', 'memorial'],
    },
    '008421404032': {
      id: '008421404032',
      name: 'Mystic the Unicorn',
      year: '1994',
      rarity: 'Common',
      estimatedValue: '$15-25',
      description: 'White unicorn with iridescent horn and yarn mane.',
      tags: ['unicorn', 'white', 'iridescent', 'horn', 'yarn'],
    },
    '008421404063': {
      id: '008421404063',
      name: 'Garcia the Bear',
      year: '1995',
      rarity: 'Rare',
      estimatedValue: '$200-400',
      description: 'Tie-dyed bear named after Jerry Garcia. Limited production.',
      tags: ['bear', 'tie-dye', 'garcia', 'grateful', 'dead'],
    },
    '008421404018': {
      id: '008421404018',
      name: 'Valentino the Bear',
      year: '1993',
      rarity: 'Rare',
      estimatedValue: '$150-300',
      description: 'White bear with red heart on chest. Valentine\'s Day theme.',
      tags: ['bear', 'white', 'heart', 'valentine', 'love'],
    },
  };

  const handleScan = () => {
    setScanning(true);
    setScanResult(null);
    
    // Simulate camera scanning
    setTimeout(() => {
      const barcodes = Object.keys(beanieDatabase);
      const randomBarcode = barcodes[Math.floor(Math.random() * barcodes.length)];
      const result = beanieDatabase[randomBarcode];
      setScanResult(result);
      setScanning(false);
    }, 2000);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setScanning(true);
      // Simulate image processing
      setTimeout(() => {
        const barcodes = Object.keys(beanieDatabase);
        const randomBarcode = barcodes[Math.floor(Math.random() * barcodes.length)];
        const result = beanieDatabase[randomBarcode];
        setScanResult(result);
        setScanning(false);
      }, 1500);
    }
  };

  const handleManualSearch = (barcode: string) => {
    const result = beanieDatabase[barcode];
    if (result) {
      setScanResult(result);
    } else {
      setScanResult({
        id: barcode,
        name: 'Unknown Item',
        year: 'Unknown',
        rarity: 'Not Found',
        estimatedValue: 'N/A',
        description: 'This barcode was not found in our database.',
        tags: [],
      });
    }
  };

  const addToCollection = (item: BeanieItem) => {
    const collectionItem: CollectionItem = {
      ...item,
      quantity: 1,
      condition: 'Good',
      notes: '',
      dateAdded: new Date().toLocaleDateString(),
    };
    setCollection(prev => [...prev, collectionItem]);
  };

  const filteredCollection = collection.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getTotalValue = () => {
    return collection.reduce((total, item) => {
      const value = item.estimatedValue.match(/\$(\d+(?:,\d+)?)/);
      return total + (value ? parseInt(value[1].replace(',', '')) : 0);
    }, 0);
  };

  return (
    <div className="h-full bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800 text-white">
      {/* Header */}
      <div className="p-4 border-b border-purple-700">
        <h1 className="text-2xl font-bold mb-2">Beanie Baby Inventory Scanner</h1>
        <p className="text-purple-200 text-sm">Professional collection management system</p>
      </div>

      {/* Navigation */}
      <div className="flex border-b border-purple-700">
        {[
          { id: 'scan', label: 'Scanner', icon: Camera },
          { id: 'collection', label: 'My Collection', icon: Package },
          { id: 'search', label: 'Database Search', icon: Search },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as any)}
            className={`flex-1 flex items-center justify-center gap-2 p-3 text-sm font-medium transition-all ${
              activeTab === id
                ? 'bg-purple-700 text-white'
                : 'text-purple-300 hover:text-white hover:bg-purple-800'
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      <div className="p-4 h-[calc(100%-8rem)] overflow-auto">
        {/* Scanner Tab */}
        {activeTab === 'scan' && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-48 h-48 mx-auto bg-purple-800 rounded-lg border-2 border-dashed border-purple-600 flex items-center justify-center mb-4">
                {scanning ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="text-4xl"
                  >
                    📷
                  </motion.div>
                ) : (
                  <Camera size={48} className="text-purple-400" />
                )}
              </div>
              
              <div className="flex gap-3 justify-center mb-4">
                <button
                  onClick={handleScan}
                  disabled={scanning}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 rounded-lg text-sm font-medium transition-all"
                >
                  {scanning ? 'Scanning...' : 'Start Camera'}
                </button>
                
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={scanning}
                  className="px-4 py-2 bg-pink-600 hover:bg-pink-700 disabled:opacity-50 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
                >
                  <Upload size={16} />
                  Upload Image
                </button>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              
              <div className="text-xs text-purple-300">
                Support for live camera scanning and image upload
              </div>
            </div>

            {/* Manual Barcode Input */}
            <div className="space-y-2">
              <label className="text-sm text-purple-300">Manual Barcode Entry:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter barcode (e.g., 008421403721)"
                  className="flex-1 px-3 py-2 bg-purple-800 border border-purple-600 rounded text-white placeholder-purple-400 text-sm"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleManualSearch((e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }}
                />
                <button
                  onClick={() => {
                    const input = document.querySelector('input[type="text"]') as HTMLInputElement;
                    if (input.value) {
                      handleManualSearch(input.value);
                      input.value = '';
                    }
                  }}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-sm"
                >
                  Lookup
                </button>
              </div>
            </div>

            {/* Scan Result */}
            <AnimatePresence>
              {scanResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-purple-800 rounded-lg p-4 border border-purple-600"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-bold">{scanResult.name}</h3>
                      <p className="text-purple-300 text-sm">Year: {scanResult.year}</p>
                    </div>
                    <div className="text-right">
                      <div className={`px-2 py-1 rounded text-xs font-medium ${
                        scanResult.rarity === 'Ultra Rare' ? 'bg-yellow-600' :
                        scanResult.rarity === 'Rare' ? 'bg-orange-600' :
                        scanResult.rarity === 'Not Found' ? 'bg-red-600' :
                        'bg-gray-600'
                      }`}>
                        {scanResult.rarity}
                      </div>
                      <div className="text-green-400 font-bold mt-1">{scanResult.estimatedValue}</div>
                    </div>
                  </div>
                  
                  <p className="text-purple-200 text-sm mb-3">{scanResult.description}</p>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {scanResult.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-purple-700 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  {scanResult.rarity !== 'Not Found' && (
                    <button
                      onClick={() => addToCollection(scanResult)}
                      className="w-full py-2 bg-green-600 hover:bg-green-700 rounded text-sm font-medium transition-all"
                    >
                      Add to Collection
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Collection Tab */}
        {activeTab === 'collection' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">My Collection ({collection.length} items)</h2>
              <div className="text-green-400 font-bold">
                Est. Value: ${getTotalValue().toLocaleString()}
              </div>
            </div>
            
            <div className="grid gap-3">
              {collection.map((item, index) => (
                <div key={index} className="bg-purple-800 rounded-lg p-3 border border-purple-600">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-purple-300 text-sm">{item.year} • {item.condition}</p>
                      <p className="text-green-400 text-sm font-medium">{item.estimatedValue}</p>
                    </div>
                    <div className="text-right text-sm">
                      <div className="text-purple-300">Qty: {item.quantity}</div>
                      <div className="text-purple-400 text-xs">{item.dateAdded}</div>
                    </div>
                  </div>
                </div>
              ))}
              
              {collection.length === 0 && (
                <div className="text-center py-8 text-purple-400">
                  <Package size={48} className="mx-auto mb-2 opacity-50" />
                  <p>No items in collection yet</p>
                  <p className="text-sm">Start scanning to add items!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Search Tab */}
        {activeTab === 'search' && (
          <div className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Search database by name or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 bg-purple-800 border border-purple-600 rounded text-white placeholder-purple-400"
              />
            </div>
            
            <div className="grid gap-3">
              {Object.values(beanieDatabase)
                .filter(item =>
                  item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
                )
                .map((item) => (
                  <div key={item.id} className="bg-purple-800 rounded-lg p-3 border border-purple-600">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-purple-300 text-sm">ID: {item.id}</p>
                      </div>
                      <div className="text-right">
                        <div className={`px-2 py-1 rounded text-xs font-medium ${
                          item.rarity === 'Ultra Rare' ? 'bg-yellow-600' :
                          item.rarity === 'Rare' ? 'bg-orange-600' :
                          'bg-gray-600'
                        }`}>
                          {item.rarity}
                        </div>
                        <div className="text-green-400 font-bold mt-1 text-sm">{item.estimatedValue}</div>
                      </div>
                    </div>
                    
                    <p className="text-purple-200 text-sm mb-2">{item.description}</p>
                    
                    <div className="flex flex-wrap gap-1">
                      {item.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-purple-700 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BeanieBabyApp;