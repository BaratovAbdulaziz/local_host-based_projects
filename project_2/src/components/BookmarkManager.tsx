import React, { useState, useEffect } from 'react';
import { Plus, ExternalLink, Trash2, Globe } from 'lucide-react';

interface Bookmark {
  id: string;
  title: string;
  url: string;
  category: string;
  createdAt: Date;
}

export default function BookmarkManager() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('General');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const savedBookmarks = localStorage.getItem('productivityApp_bookmarks');
    if (savedBookmarks) {
      setBookmarks(JSON.parse(savedBookmarks).map((bookmark: any) => ({
        ...bookmark,
        createdAt: new Date(bookmark.createdAt)
      })));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('productivityApp_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  const addBookmark = () => {
    if (title && url) {
      const bookmark: Bookmark = {
        id: Date.now().toString(),
        title,
        url: url.startsWith('http') ? url : `https://${url}`,
        category,
        createdAt: new Date()
      };
      setBookmarks([bookmark, ...bookmarks]);
      setTitle('');
      setUrl('');
      setCategory('General');
      setShowForm(false);
    }
  };

  const deleteBookmark = (id: string) => {
    setBookmarks(bookmarks.filter(bookmark => bookmark.id !== id));
  };

  const categories = ['All', ...Array.from(new Set(bookmarks.map(b => b.category)))];
  const filteredBookmarks = selectedCategory === 'All' 
    ? bookmarks 
    : bookmarks.filter(b => b.category === selectedCategory);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Quick Links</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2"
        >
          <Plus size={18} />
          Add Link
        </button>
      </div>

      {showForm && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Link title..."
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:text-white"
            />
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="URL (e.g., google.com)"
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div className="flex gap-4">
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Category..."
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:text-white"
            />
            <button
              onClick={addBookmark}
              className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              Add
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

      <div className="flex gap-2 mb-4 overflow-x-auto">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-lg whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-purple-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-80 overflow-y-auto">
        {filteredBookmarks.map((bookmark) => (
          <div
            key={bookmark.id}
            className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors group"
          >
            <div className="flex items-start justify-between mb-2">
              <Globe className="text-purple-500 flex-shrink-0 mt-1" size={20} />
              <button
                onClick={() => deleteBookmark(bookmark.id)}
                className="text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={16} />
              </button>
            </div>
            
            <h3 className="font-medium text-gray-800 dark:text-white mb-1 truncate">
              {bookmark.title}
            </h3>
            
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 truncate">
              {bookmark.url}
            </p>
            
            <div className="flex items-center justify-between">
              <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded">
                {bookmark.category}
              </span>
              <a
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-500 hover:text-purple-600 transition-colors"
              >
                <ExternalLink size={16} />
              </a>
            </div>
          </div>
        ))}
      </div>

      {filteredBookmarks.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          {selectedCategory === 'All' ? 'No bookmarks yet. Add one above!' : `No bookmarks in ${selectedCategory} category.`}
        </div>
      )}
    </div>
  );
}