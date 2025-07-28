import React, { useState, useEffect } from 'react';
import Canvas from './components/Canvas';
import Notes from './components/Notes';
import ColorPalette from './components/ColorPalette';
import Timer from './components/Timer';
import IdeaGenerator from './components/IdeaGenerator';
import { 
  Palette, 
  FileText, 
  Clock, 
  Lightbulb, 
  Brush,
  Save,
  Download
} from 'lucide-react';

interface AppData {
  notes: string;
  canvasData: string;
  timerSettings: {
    workTime: number;
    breakTime: number;
  };
}

const TABS = [
  { id: 'canvas', label: 'Canvas', icon: Brush },
  { id: 'notes', label: 'Notes', icon: FileText },
  { id: 'colors', label: 'Colors', icon: Palette },
  { id: 'timer', label: 'Timer', icon: Clock },
  { id: 'ideas', label: 'Ideas', icon: Lightbulb },
];

function App() {
  const [activeTab, setActiveTab] = useState('canvas');
  const [appData, setAppData] = useState<AppData>({
    notes: '',
    canvasData: '',
    timerSettings: { workTime: 25, breakTime: 5 }
  });

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('creativeworkspace-data');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setAppData(parsedData);
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever appData changes
  useEffect(() => {
    localStorage.setItem('creativeworkspace-data', JSON.stringify(appData));
  }, [appData]);

  const updateAppData = (key: keyof AppData, value: any) => {
    setAppData(prev => ({ ...prev, [key]: value }));
  };

  const exportData = () => {
    const dataStr = JSON.stringify(appData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `creative-workspace-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'canvas':
        return (
          <Canvas 
            data={appData.canvasData}
            onSave={(data) => updateAppData('canvasData', data)}
          />
        );
      case 'notes':
        return (
          <Notes 
            content={appData.notes}
            onChange={(content) => updateAppData('notes', content)}
          />
        );
      case 'colors':
        return <ColorPalette />;
      case 'timer':
        return (
          <Timer 
            settings={appData.timerSettings}
            onSettingsChange={(settings) => updateAppData('timerSettings', settings)}
          />
        );
      case 'ideas':
        return <IdeaGenerator />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Creative Workspace
              </h1>
              <p className="text-slate-400">
                Your all-in-one toolkit for creativity and productivity
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => localStorage.setItem('creativeworkspace-data', JSON.stringify(appData))}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                <Save size={18} />
                Save
              </button>
              <button
                onClick={exportData}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Download size={18} />
                Export
              </button>
            </div>
          </div>
        </header>

        {/* Navigation Tabs */}
        <nav className="mb-6">
          <div className="flex gap-2 p-2 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeTab === id
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Main Content */}
        <main className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700 p-6 min-h-[600px]">
          {renderActiveComponent()}
        </main>
      </div>
    </div>
  );
}

export default App;