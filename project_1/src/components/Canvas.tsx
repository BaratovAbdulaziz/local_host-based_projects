import React, { useRef, useEffect, useState } from 'react';
import { 
  Brush, 
  Eraser, 
  Palette, 
  RotateCcw, 
  Download,
  Minus,
  Plus
} from 'lucide-react';

interface CanvasProps {
  data: string;
  onSave: (data: string) => void;
}

const Canvas: React.FC<CanvasProps> = ({ data, onSave }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<'brush' | 'eraser'>('brush');
  const [brushSize, setBrushSize] = useState(5);
  const [color, setColor] = useState('#8B5CF6');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 800;
    canvas.height = 500;

    // Load saved data
    if (data) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
      };
      img.src = data;
    } else {
      // Set white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, [data]);

  const startDrawing = (e: React.MouseEvent) => {
    setIsDrawing(true);
    draw(e);
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';

    if (tool === 'brush') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = color;
    } else {
      ctx.globalCompositeOperation = 'destination-out';
    }

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.beginPath();
        // Save canvas data
        onSave(canvas.toDataURL());
      }
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    onSave(canvas.toDataURL());
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `canvas-${new Date().toISOString().split('T')[0]}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-xl">
        <div className="flex items-center gap-4">
          {/* Tools */}
          <div className="flex gap-2">
            <button
              onClick={() => setTool('brush')}
              className={`p-3 rounded-lg transition-colors ${
                tool === 'brush'
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-600 text-slate-300 hover:bg-slate-500'
              }`}
            >
              <Brush size={20} />
            </button>
            <button
              onClick={() => setTool('eraser')}
              className={`p-3 rounded-lg transition-colors ${
                tool === 'eraser'
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-600 text-slate-300 hover:bg-slate-500'
              }`}
            >
              <Eraser size={20} />
            </button>
          </div>

          {/* Color picker */}
          <div className="flex items-center gap-2">
            <Palette size={20} className="text-slate-300" />
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-12 h-12 rounded-lg border-2 border-slate-600 cursor-pointer"
            />
          </div>

          {/* Brush size */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setBrushSize(Math.max(1, brushSize - 1))}
              className="p-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors"
            >
              <Minus size={16} />
            </button>
            <span className="text-white font-medium w-8 text-center">{brushSize}</span>
            <button
              onClick={() => setBrushSize(Math.min(50, brushSize + 1))}
              className="p-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={clearCanvas}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            <RotateCcw size={18} />
            Clear
          </button>
          <button
            onClick={downloadCanvas}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Download size={18} />
            Download
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex justify-center">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="border-2 border-slate-600 rounded-lg cursor-crosshair bg-white shadow-lg"
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      </div>
    </div>
  );
};

export default Canvas;