import React, { useState } from 'react';
import { Square, Circle as CircleIcon, Triangle as TriangleIcon, Star, Shield, Plus } from 'lucide-react';
import { PALETTE_COLORS } from '../../utils/constants';

interface ShapeToolsProps {
  onAddShape: (type: 'rect' | 'circle' | 'triangle' | 'star' | 'badge', fill: string) => void;
}

export const ShapeTools: React.FC<ShapeToolsProps> = ({ onAddShape }) => {
  const [selectedShape, setSelectedShape] = useState<'rect' | 'circle' | 'triangle' | 'star' | 'badge'>('circle');
  const [fill, setFill] = useState('#181818');

  const shapes = [
    { id: 'rect', label: 'Rounded Box', icon: Square },
    { id: 'circle', label: 'Circle', icon: CircleIcon },
    { id: 'triangle', label: 'Triangle', icon: TriangleIcon },
    { id: 'star', label: 'Star', icon: Star },
    { id: 'badge', label: 'Diamond Badge', icon: Shield },
  ] as const;

  const handleAdd = () => {
    onAddShape(selectedShape, fill);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-[#555555] mb-2">Select Geometry</label>
        <div className="grid grid-cols-5 gap-2">
          {shapes.map((s) => {
            const Icon = s.icon;
            const isSelected = selectedShape === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setSelectedShape(s.id)}
                className={`flex flex-col items-center justify-center p-2.5 rounded-lg border transition-all ${
                  isSelected
                    ? 'border-[#181818] bg-[#181818] text-white shadow-xs'
                    : 'border-[#E8E6E1] bg-white text-[#555555] hover:border-neutral-400'
                }`}
                title={s.label}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-[9px] uppercase tracking-wider truncate w-full text-center">
                  {s.id}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Shape Color */}
      <div>
        <label className="block text-xs font-medium text-[#555555] mb-1.5">Shape Fill Color</label>
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
        type="button"
        onClick={handleAdd}
        className="w-full py-2.5 px-4 bg-[#181818] hover:bg-black text-white rounded-lg text-xs font-semibold tracking-wide uppercase flex items-center justify-center gap-2 transition-colors shadow-xs"
      >
        <Plus className="w-4 h-4" />
        Add Shape to Shirt
      </button>
    </div>
  );
};
