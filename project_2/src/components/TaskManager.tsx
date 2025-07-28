import React, { useState, useEffect } from 'react';
import { Plus, Check, Trash2, Flag, Circle } from 'lucide-react';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
}

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  useEffect(() => {
    const savedTasks = localStorage.getItem('productivityApp_tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks).map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt)
      })));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('productivityApp_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (newTask.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        text: newTask,
        completed: false,
        priority,
        createdAt: new Date()
      };
      setTasks([task, ...tasks]);
      setNewTask('');
    }
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Tasks</h2>
        <div className="text-sm text-gray-600 dark:text-gray-300">
          {completedTasks}/{totalTasks} completed
        </div>
      </div>

      <div className="mb-4">
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
            placeholder="Add a new task..."
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <button
            onClick={addTask}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      <div className="space-y-2 max-h-80 overflow-y-auto">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
              task.completed 
                ? 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600' 
                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:shadow-md'
            }`}
          >
            <button
              onClick={() => toggleTask(task.id)}
              className={`flex-shrink-0 transition-colors ${
                task.completed ? 'text-green-500' : 'text-gray-400 hover:text-green-500'
              }`}
            >
              {task.completed ? <Check size={20} /> : <Circle size={20} />}
            </button>
            
            <Flag className={`flex-shrink-0 ${getPriorityColor(task.priority)}`} size={16} />
            
            <span className={`flex-1 ${
              task.completed 
                ? 'line-through text-gray-500 dark:text-gray-400' 
                : 'text-gray-800 dark:text-white'
            }`}>
              {task.text}
            </span>
            
            <button
              onClick={() => deleteTask(task.id)}
              className="flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      {tasks.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No tasks yet. Add one above to get started!
        </div>
      )}
    </div>
  );
}