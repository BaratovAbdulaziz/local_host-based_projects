import React from 'react';
import { Zap } from 'lucide-react';
import TaskManager from './components/TaskManager';
import NoteTaker from './components/NoteTaker';
import PomodoroTimer from './components/PomodoroTimer';
import Calculator from './components/Calculator';
import BookmarkManager from './components/BookmarkManager';
import GoalTracker from './components/GoalTracker';
import ThemeToggle from './components/ThemeToggle';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <Zap className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  ProductivityHub
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Your all-in-one workspace
                </p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Task Manager */}
          <div className="lg:col-span-1">
            <TaskManager />
          </div>

          {/* Pomodoro Timer */}
          <div className="lg:col-span-1">
            <PomodoroTimer />
          </div>

          {/* Goal Tracker */}
          <div className="lg:col-span-1">
            <GoalTracker />
          </div>

          {/* Note Taker */}
          <div className="lg:col-span-2 xl:col-span-2">
            <NoteTaker />
          </div>

          {/* Calculator */}
          <div className="lg:col-span-1">
            <Calculator />
          </div>

          {/* Bookmark Manager */}
          <div className="lg:col-span-2 xl:col-span-3">
            <BookmarkManager />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-500 dark:text-gray-400">
          <p className="text-sm">
            Built for productivity enthusiasts who value simplicity and efficiency
          </p>
        </footer>
      </main>
    </div>
  );
}

export default App;