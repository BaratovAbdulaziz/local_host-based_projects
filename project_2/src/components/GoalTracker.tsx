import React, { useState, useEffect } from 'react';
import { Target, Plus, Check, Trash2 } from 'lucide-react';

interface Goal {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
  createdAt: Date;
}

export default function GoalTracker() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [target, setTarget] = useState('');
  const [unit, setUnit] = useState('');

  useEffect(() => {
    const savedGoals = localStorage.getItem('productivityApp_goals');
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals).map((goal: any) => ({
        ...goal,
        createdAt: new Date(goal.createdAt)
      })));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('productivityApp_goals', JSON.stringify(goals));
  }, [goals]);

  const addGoal = () => {
    if (title && target && unit) {
      const goal: Goal = {
        id: Date.now().toString(),
        title,
        target: parseInt(target),
        current: 0,
        unit,
        createdAt: new Date()
      };
      setGoals([goal, ...goals]);
      setTitle('');
      setTarget('');
      setUnit('');
      setShowForm(false);
    }
  };

  const updateProgress = (id: string, increment: number) => {
    setGoals(goals.map(goal => 
      goal.id === id 
        ? { ...goal, current: Math.max(0, Math.min(goal.target, goal.current + increment)) }
        : goal
    ));
  };

  const deleteGoal = (id: string) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Daily Goals</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
        >
          <Plus size={18} />
          New Goal
        </button>
      </div>

      {showForm && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Goal title..."
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-800 dark:text-white"
            />
            <input
              type="number"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="Target number..."
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-800 dark:text-white"
            />
            <input
              type="text"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              placeholder="Unit (e.g., cups, pages)..."
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div className="flex gap-4">
            <button
              onClick={addGoal}
              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Add Goal
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4 max-h-80 overflow-y-auto">
        {goals.map((goal) => {
          const progress = (goal.current / goal.target) * 100;
          const isCompleted = goal.current >= goal.target;
          
          return (
            <div
              key={goal.id}
              className={`p-4 rounded-lg border transition-all ${
                isCompleted 
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700' 
                  : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {isCompleted ? (
                    <Check className="text-green-500" size={20} />
                  ) : (
                    <Target className="text-orange-500" size={20} />
                  )}
                  <h3 className="font-medium text-gray-800 dark:text-white">
                    {goal.title}
                  </h3>
                </div>
                <button
                  onClick={() => deleteGoal(goal.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="mb-3">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-1">
                  <span>{goal.current} / {goal.target} {goal.unit}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      isCompleted ? 'bg-green-500' : 'bg-orange-500'
                    }`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
              </div>

              {!isCompleted && (
                <div className="flex gap-2">
                  <button
                    onClick={() => updateProgress(goal.id, -1)}
                    className="px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    disabled={goal.current === 0}
                  >
                    -1
                  </button>
                  <button
                    onClick={() => updateProgress(goal.id, 1)}
                    className="px-3 py-1 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    +1
                  </button>
                  <button
                    onClick={() => updateProgress(goal.id, 5)}
                    className="px-3 py-1 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    +5
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {goals.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No goals set yet. Create one to start tracking your progress!
        </div>
      )}
    </div>
  );
}