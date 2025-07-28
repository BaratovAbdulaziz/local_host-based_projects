import React, { useState, useEffect } from 'react';
import { Plus, FileText, Trash2, Save } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: Date;
}

export default function NoteTaker() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNote, setActiveNote] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const savedNotes = localStorage.getItem('productivityApp_notes');
    if (savedNotes) {
      const parsedNotes = JSON.parse(savedNotes).map((note: any) => ({
        ...note,
        updatedAt: new Date(note.updatedAt)
      }));
      setNotes(parsedNotes);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('productivityApp_notes', JSON.stringify(notes));
  }, [notes]);

  const createNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'New Note',
      content: '',
      updatedAt: new Date()
    };
    setNotes([newNote, ...notes]);
    setActiveNote(newNote.id);
    setTitle(newNote.title);
    setContent(newNote.content);
    setIsEditing(true);
  };

  const selectNote = (note: Note) => {
    setActiveNote(note.id);
    setTitle(note.title);
    setContent(note.content);
    setIsEditing(false);
  };

  const saveNote = () => {
    if (activeNote) {
      setNotes(notes.map(note => 
        note.id === activeNote 
          ? { ...note, title: title || 'Untitled', content, updatedAt: new Date() }
          : note
      ));
      setIsEditing(false);
    }
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
    if (activeNote === id) {
      setActiveNote(null);
      setTitle('');
      setContent('');
      setIsEditing(false);
    }
  };

  const currentNote = notes.find(note => note.id === activeNote);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Notes</h2>
        <button
          onClick={createNote}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
        >
          <Plus size={18} />
          New Note
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {notes.map((note) => (
              <div
                key={note.id}
                onClick={() => selectNote(note)}
                className={`p-3 rounded-lg cursor-pointer transition-all border ${
                  activeNote === note.id
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700'
                    : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-800 dark:text-white truncate">
                      {note.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {note.content || 'No content'}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {note.updatedAt.toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNote(note.id);
                    }}
                    className="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {notes.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No notes yet. Create one to get started!
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          {activeNote ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    setIsEditing(true);
                  }}
                  className="flex-1 text-xl font-bold bg-transparent border-none focus:outline-none text-gray-800 dark:text-white"
                  placeholder="Note title..."
                />
                {isEditing && (
                  <button
                    onClick={saveNote}
                    className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-1"
                  >
                    <Save size={16} />
                    Save
                  </button>
                )}
              </div>
              
              <textarea
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  setIsEditing(true);
                }}
                placeholder="Start writing..."
                className="w-full h-80 p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none dark:bg-gray-700 dark:text-white"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-80 text-gray-500 dark:text-gray-400">
              <FileText size={48} className="mb-4" />
              <p>Select a note to view or create a new one</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}