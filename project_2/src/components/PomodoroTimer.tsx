import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Timer } from 'lucide-react';

export default function PomodoroTimer() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const [completedSessions, setCompletedSessions] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const savedSessions = localStorage.getItem('productivityApp_pomodoroSessions');
    if (savedSessions) {
      setCompletedSessions(parseInt(savedSessions));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('productivityApp_pomodoroSessions', completedSessions.toString());
  }, [completedSessions]);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          // Timer finished
          setIsActive(false);
          if (mode === 'work') {
            setCompletedSessions(prev => prev + 1);
            setMode('break');
            setMinutes(5);
          } else {
            setMode('work');
            setMinutes(25);
          }
          setSeconds(0);
          
          // Notification
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(`${mode === 'work' ? 'Work' : 'Break'} session completed!`);
          }
        }
      }, 1000);
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
  }, [isActive, minutes, seconds, mode]);

  const toggle = () => {
    setIsActive(!isActive);
  };

  const reset = () => {
    setIsActive(false);
    setMinutes(mode === 'work' ? 25 : 5);
    setSeconds(0);
  };

  const switchMode = (newMode: 'work' | 'break') => {
    setIsActive(false);
    setMode(newMode);
    setMinutes(newMode === 'work' ? 25 : 5);
    setSeconds(0);
  };

  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  const totalSeconds = minutes * 60 + seconds;
  const totalDuration = mode === 'work' ? 25 * 60 : 5 * 60;
  const progress = ((totalDuration - totalSeconds) / totalDuration) * 100;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Pomodoro Timer</h2>
        <div className="text-sm text-gray-600 dark:text-gray-300">
          Sessions: {completedSessions}
        </div>
      </div>

      <div className="text-center mb-6">
        <div className="relative w-48 h-48 mx-auto mb-6">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-gray-200 dark:text-gray-700"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
              className={mode === 'work' ? 'text-blue-500' : 'text-green-500'}
              style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-4xl font-mono font-bold text-gray-800 dark:text-white">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
            <div className={`text-sm font-medium ${
              mode === 'work' ? 'text-blue-500' : 'text-green-500'
            }`}>
              {mode === 'work' ? 'Work Time' : 'Break Time'}
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={toggle}
            className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              isActive
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {isActive ? <Pause size={20} /> : <Play size={20} />}
            {isActive ? 'Pause' : 'Start'}
          </button>
          
          <button
            onClick={reset}
            className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <RotateCcw size={20} />
            Reset
          </button>
        </div>

        <div className="flex justify-center gap-2">
          <button
            onClick={() => switchMode('work')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              mode === 'work'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Work (25m)
          </button>
          <button
            onClick={() => switchMode('break')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              mode === 'break'
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Break (5m)
          </button>
        </div>
      </div>
    </div>
  );
}