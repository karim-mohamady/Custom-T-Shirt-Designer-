import React, { useState } from 'react';
import { Type, Bold, Italic, Plus } from 'lucide-react';
import { FONT_OPTIONS, PALETTE_COLORS } from '../../utils/constants';

interface TextEditorProps {
  onAddText: (text: string, options: {
    fontFamily: string;
    fontSize: number;
    fill: string;
    bold: boolean;
    italic: boolean;
  }) => void;
}

export const TextEditor: React.FC<TextEditorProps> = ({ onAddText }) => {
  const [text, setText] = useState('ATELIER');
  const [fontFamily, setFontFamily] = useState(FONT_OPTIONS[0].value);
  const [fontSize, setFontSize] = useState(26);
  const [fill, setFill] = useState('#181818');
  const [isBold, setIsBold] = useState(true);
  const [isItalic, setIsItalic] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAddText(text.trim(), {
      fontFamily,
      fontSize,
      fill,
      bold: isBold,
      italic: isItalic,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Text Input */}
      <div>
        <label className="block text-xs font-medium text-[#555555] mb-1.5">
          Custom Typography / Slogan
        </label>
        <div className="relative">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your slogan or brand..."
            maxLength={40}
            className="w-full px-3.5 py-2.5 bg-white border border-[#E8E6E1] focus:border-[#B99B73] rounded-lg text-sm text-[#181818] outline-hidden shadow-2xs"
          />
          <Type className="absolute right-3 top-3 w-4 h-4 text-neutral-400 pointer-events-none" />
        </div>
      </div>

      {/* Font Family & Styles */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-[#555555] mb-1.5">Font Style</label>
          <select
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-[#E8E6E1] focus:border-[#B99B73] rounded-lg text-xs text-[#181818] outline-hidden cursor-pointer"
          >
            {FONT_OPTIONS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-[#555555] mb-1.5">Weight & Posture</label>
          <div className="flex items-center gap-1.5 h-[38px]">
            <button
              type="button"
              onClick={() => setIsBold(!isBold)}
              className={`flex-1 h-full flex items-center justify-center rounded-lg border text-xs font-medium transition-colors ${
                isBold
                  ? 'bg-[#181818] text-white border-[#181818]'
                  : 'bg-white text-[#555555] border-[#E8E6E1] hover:bg-neutral-50'
              }`}
              title="Toggle Bold"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setIsItalic(!isItalic)}
              className={`flex-1 h-full flex items-center justify-center rounded-lg border text-xs font-medium transition-colors ${
                isItalic
                  ? 'bg-[#181818] text-white border-[#181818]'
                  : 'bg-white text-[#555555] border-[#E8E6E1] hover:bg-neutral-50'
              }`}
              title="Toggle Italic"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Font Size Slider */}
      <div>
        <div className="flex items-center justify-between text-xs font-medium text-[#555555] mb-1">
          <span>Scale Size</span>
          <span className="font-mono text-neutral-600">{fontSize}px</span>
        </div>
        <input
          type="range"
          min="14"
          max="54"
          value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
          className="w-full accent-[#B99B73] cursor-pointer"
        />
      </div>

      {/* Palette Colors */}
      <div>
        <label className="block text-xs font-medium text-[#555555] mb-1.5">Text Color</label>
        <div className="flex items-center gap-2 flex-wrap">
          {PALETTE_COLORS.map((hex) => (
            <button
              key={hex}
              type="button"
              onClick={() => setFill(hex)}
              className={`w-6 h-6 rounded-full border transition-all ${
                fill.toLowerCase() === hex.toLowerCase()
                  ? 'scale-115 ring-2 ring-[#B99B73] border-white shadow-xs'
                  : 'border-neutral-300 hover:scale-105'
              }`}
              style={{ backgroundColor: hex }}
              title={hex}
            />
          ))}
          {/* Custom color picker */}
          <label className="w-6 h-6 rounded-full border border-neutral-300 relative cursor-pointer overflow-hidden flex items-center justify-center text-[10px] bg-white">
            <input
              type="color"
              value={fill}
              onChange={(e) => setFill(e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <span>+</span>
          </label>
        </div>
      </div>

      {/* Add Button */}
      <button
        type="submit"
        className="w-full py-2.5 px-4 bg-[#181818] hover:bg-black text-white rounded-lg text-xs font-semibold tracking-wide uppercase flex items-center justify-center gap-2 transition-colors shadow-xs"
      >
        <Plus className="w-4 h-4" />
        Add Text to Shirt
      </button>
    </form>
  );
};
