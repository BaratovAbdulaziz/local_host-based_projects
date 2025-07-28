import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Settings,
  Coffee,
  Briefcase,
  Volume2,
  VolumeX
} from 'lucide-react';

interface TimerSettings {
  workTime: number;
  breakTime: number;
}

interface TimerProps {
  settings: TimerSettings;
  onSettingsChange: (settings: TimerSettings) => void;
}

const Timer: React.FC<TimerProps> = ({ settings, onSettingsChange }) => {
  const [timeLeft, setTimeLeft] = useState(settings.workTime * 60);
  const [isActive, setIsActive] = useState(false);
  const [isWorkSession, setIsWorkSession] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [sessions, setSessions] = useState(0);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleSessionComplete();
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeLeft]);

  const handleSessionComplete = () => {
    setIsActive(false);
    
    if (soundEnabled) {
      // Create a simple beep sound
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    }

    if (isWorkSession) {
      setSessions(prev => prev + 1);
      setIsWorkSession(false);
      setTimeLeft(settings.breakTime * 60);
    } else {
      setIsWorkSession(true);
      setTimeLeft(settings.workTime * 60);
    }
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsWorkSession(true);
    setTimeLeft(settings.workTime * 60);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const updateSettings = (newSettings: TimerSettings) => {
    onSettingsChange(newSettings);
    if (!isActive) {
      setTimeLeft(isWorkSession ? newSettings.workTime * 60 : newSettings.breakTime * 60);
    }
  };

  const progress = isWorkSession 
    ? 1 - (timeLeft / (settings.workTime * 60))
    : 1 - (timeLeft / (settings.breakTime * 60));

  return (
    <div className="space-y-6">
      {/* Timer Display */}
      <div className="text-center">
        <div className="relative inline-block">
          {/* Progress Circle */}
          <svg className="w-64 h-64 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="rgb(71 85 105)"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke={isWorkSession ? "#8B5CF6" : "#14B8A6"}
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress)}`}
              className="transition-all duration-1000 ease-in-out"
            />
          </svg>
          
          {/* Timer Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className={`flex items-center gap-2 mb-2 text-lg font-semibold ${
              isWorkSession ? 'text-purple-400' : 'text-teal-400'
            }`}>
              {isWorkSession ? <Briefcase size={24} /> : <Coffee size={24} />}
              {isWorkSession ? 'Work' : 'Break'}
            </div>
            <div className="text-4xl font-mono font-bold text-white">
              {formatTime(timeLeft)}
            </div>
            <div className="text-slate-400 mt-2">
              Session {sessions + 1}
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={toggleTimer}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold transition-colors ${
            isActive 
              ? 'bg-red-600 hover:bg-red-700' 
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {isActive ? <Pause size={20} /> : <Play size={20} />}
          {isActive ? 'Pause' : 'Start'}
        </button>
        
        <button
          onClick={resetTimer}
          className="flex items-center gap-2 px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-xl transition-colors"
        >
          <RotateCcw size={20} />
          Reset
        </button>
        
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors"
        >
          <Settings size={20} />
          Settings
        </button>

        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`p-3 rounded-xl transition-colors ${
            soundEnabled 
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : 'bg-slate-600 hover:bg-slate-700 text-slate-300'
          }`}
        >
          {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-slate-700/50 rounded-xl p-6 space-y-4">
          <h3 className="text-white font-semibold text-lg">Timer Settings</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Work Time (minutes)
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={settings.workTime}
                onChange={(e) => updateSettings({
                  ...settings,
                  workTime: parseInt(e.target.value) || 25
                })}
                className="w-full px-4 py-2 bg-slate-600 text-white rounded-lg border border-slate-500 focus:border-purple-500 focus:outline-none"
              />
            </div>
            
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Break Time (minutes)
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={settings.breakTime}
                onChange={(e) => updateSettings({
                  ...settings,
                  breakTime: parseInt(e.target.value) || 5
                })}
                className="w-full px-4 py-2 bg-slate-600 text-white rounded-lg border border-slate-500 focus:border-purple-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Statistics */}
      <div className="bg-slate-700/30 rounded-xl p-4">
        <h3 className="text-white font-semibold mb-2">Today's Progress</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-purple-400">{sessions}</div>
            <div className="text-slate-400 text-sm">Completed Sessions</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-teal-400">
              {Math.floor((sessions * settings.workTime) / 60)}h {(sessions * settings.workTime) % 60}m
            </div>
            <div className="text-slate-400 text-sm">Focus Time</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-400">
              {Math.floor((sessions * settings.breakTime) / 60)}h {(sessions * settings.breakTime) % 60}m
            </div>
            <div className="text-slate-400 text-sm">Break Time</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timer;