import React, { useState, useRef, useEffect } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  Download,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight
} from 'lucide-react';

interface NotesProps {
  content: string;
  onChange: (content: string) => void;
}

const Notes: React.FC<NotesProps> = ({ content, onChange }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    if (editorRef.current && content !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = content;
    }
    updateWordCount();
  }, [content]);

  const updateWordCount = () => {
    if (editorRef.current) {
      const text = editorRef.current.innerText;
      const words = text.trim().split(/\s+/).filter(word => word.length > 0);
      setWordCount(words.length);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
      updateWordCount();
    }
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  };

  const downloadNotes = () => {
    const element = document.createElement('a');
    const file = new Blob([editorRef.current?.innerText || ''], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `notes-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-xl">
        <div className="flex items-center gap-4">
          {/* Text formatting */}
          <div className="flex gap-2">
            <button
              onClick={() => execCommand('bold')}
              className="p-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors"
              title="Bold"
            >
              <Bold size={18} />
            </button>
            <button
              onClick={() => execCommand('italic')}
              className="p-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors"
              title="Italic"
            >
              <Italic size={18} />
            </button>
            <button
              onClick={() => execCommand('underline')}
              className="p-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors"
              title="Underline"
            >
              <Underline size={18} />
            </button>
          </div>

          {/* Alignment */}
          <div className="flex gap-2 border-l border-slate-600 pl-4">
            <button
              onClick={() => execCommand('justifyLeft')}
              className="p-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors"
              title="Align Left"
            >
              <AlignLeft size={18} />
            </button>
            <button
              onClick={() => execCommand('justifyCenter')}
              className="p-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors"
              title="Align Center"
            >
              <AlignCenter size={18} />
            </button>
            <button
              onClick={() => execCommand('justifyRight')}
              className="p-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors"
              title="Align Right"
            >
              <AlignRight size={18} />
            </button>
          </div>

          {/* Lists */}
          <div className="flex gap-2 border-l border-slate-600 pl-4">
            <button
              onClick={() => execCommand('insertUnorderedList')}
              className="p-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors"
              title="Bullet List"
            >
              <List size={18} />
            </button>
          </div>

          {/* Font size */}
          <div className="flex items-center gap-2 border-l border-slate-600 pl-4">
            <Type size={18} className="text-slate-300" />
            <select
              onChange={(e) => execCommand('fontSize', e.target.value)}
              className="bg-slate-600 text-white rounded-lg px-2 py-1 text-sm"
            >
              <option value="1">Small</option>
              <option value="3" selected>Normal</option>
              <option value="5">Large</option>
              <option value="7">Extra Large</option>
            </select>
          </div>
        </div>

        {/* Actions and Stats */}
        <div className="flex items-center gap-4">
          <span className="text-slate-300 text-sm">
            Words: {wordCount}
          </span>
          <button
            onClick={downloadNotes}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Download size={18} />
            Download
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="bg-white rounded-xl shadow-lg min-h-[500px]">
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          className="w-full h-full min-h-[500px] p-6 text-slate-800 text-lg leading-relaxed focus:outline-none rounded-xl"
          style={{ wordWrap: 'break-word' }}
          placeholder="Start writing your notes..."
        />
      </div>
    </div>
  );
};

export default Notes;