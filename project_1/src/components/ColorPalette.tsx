import React, { useState } from 'react';
import { 
  RefreshCw, 
  Copy, 
  Download, 
  Palette,
  Check
} from 'lucide-react';

const ColorPalette: React.FC = () => {
  const [colors, setColors] = useState<string[]>([]);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [paletteType, setPaletteType] = useState<'random' | 'monochromatic' | 'complementary' | 'triadic'>('random');

  const generateRandomColor = (): string => {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
  };

  const hexToHsl = (hex: string): [number, number, number] => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return [h * 360, s * 100, l * 100];
  };

  const hslToHex = (h: number, s: number, l: number): string => {
    h = h / 360;
    s = s / 100;
    l = l / 100;

    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    const toHex = (c: number) => Math.round(c * 255).toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  const generatePalette = () => {
    let newColors: string[] = [];

    switch (paletteType) {
      case 'random':
        newColors = Array.from({ length: 6 }, () => generateRandomColor());
        break;
      
      case 'monochromatic':
        const baseColor = generateRandomColor();
        const [h, s] = hexToHsl(baseColor);
        newColors = [
          hslToHex(h, s, 20),
          hslToHex(h, s, 35),
          hslToHex(h, s, 50),
          hslToHex(h, s, 65),
          hslToHex(h, s, 80),
          hslToHex(h, s, 95)
        ];
        break;
      
      case 'complementary':
        const base = generateRandomColor();
        const [baseH, baseS, baseL] = hexToHsl(base);
        newColors = [
          base,
          hslToHex((baseH + 180) % 360, baseS, baseL),
          hslToHex(baseH, baseS * 0.7, baseL * 0.8),
          hslToHex((baseH + 180) % 360, baseS * 0.7, baseL * 0.8),
          hslToHex(baseH, baseS * 0.4, baseL * 1.2),
          hslToHex((baseH + 180) % 360, baseS * 0.4, baseL * 1.2)
        ];
        break;
      
      case 'triadic':
        const triadicBase = generateRandomColor();
        const [triadicH, triadicS, triadicL] = hexToHsl(triadicBase);
        newColors = [
          triadicBase,
          hslToHex((triadicH + 120) % 360, triadicS, triadicL),
          hslToHex((triadicH + 240) % 360, triadicS, triadicL),
          hslToHex(triadicH, triadicS * 0.6, triadicL * 0.8),
          hslToHex((triadicH + 120) % 360, triadicS * 0.6, triadicL * 0.8),
          hslToHex((triadicH + 240) % 360, triadicS * 0.6, triadicL * 0.8)
        ];
        break;
    }

    setColors(newColors);
  };

  const copyToClipboard = (color: string) => {
    navigator.clipboard.writeText(color);
    setCopiedColor(color);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const exportPalette = () => {
    const paletteData = {
      type: paletteType,
      colors: colors,
      createdAt: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(paletteData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `color-palette-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  React.useEffect(() => {
    generatePalette();
  }, []);

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-xl">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Palette size={20} className="text-slate-300" />
            <select
              value={paletteType}
              onChange={(e) => setPaletteType(e.target.value as any)}
              className="bg-slate-600 text-white rounded-lg px-3 py-2"
            >
              <option value="random">Random</option>
              <option value="monochromatic">Monochromatic</option>
              <option value="complementary">Complementary</option>
              <option value="triadic">Triadic</option>
            </select>
          </div>
          
          <button
            onClick={generatePalette}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            <RefreshCw size={18} />
            Generate
          </button>
        </div>

        <button
          onClick={exportPalette}
          disabled={colors.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
        >
          <Download size={18} />
          Export
        </button>
      </div>

      {/* Color Grid */}
      {colors.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {colors.map((color, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div
                className="h-32 w-full cursor-pointer relative"
                style={{ backgroundColor: color }}
                onClick={() => copyToClipboard(color)}
              >
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <button className="opacity-0 group-hover:opacity-100 bg-white/90 text-slate-800 px-3 py-1 rounded-lg flex items-center gap-2 transition-opacity">
                    {copiedColor === color ? (
                      <>
                        <Check size={16} />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={16} />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>
              <div className="p-3">
                <div className="text-center">
                  <p className="font-mono text-lg font-semibold text-slate-800">{color}</p>
                  <p className="text-sm text-slate-500 mt-1">
                    RGB({parseInt(color.slice(1, 3), 16)}, {parseInt(color.slice(3, 5), 16)}, {parseInt(color.slice(5, 7), 16)})
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tips */}
      <div className="bg-slate-700/30 rounded-xl p-4">
        <h3 className="text-white font-semibold mb-2">Color Harmony Tips:</h3>
        <ul className="text-slate-300 text-sm space-y-1">
          <li><strong>Monochromatic:</strong> Uses different shades of the same hue</li>
          <li><strong>Complementary:</strong> Uses colors opposite on the color wheel</li>
          <li><strong>Triadic:</strong> Uses three evenly spaced colors on the color wheel</li>
          <li><strong>Random:</strong> Completely random colors for creative inspiration</li>
        </ul>
      </div>
    </div>
  );
};

export default ColorPalette;