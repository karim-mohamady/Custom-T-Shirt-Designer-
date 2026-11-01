import React from 'react';
import { ProductColorOption } from '../../types';
import { Check } from 'lucide-react';

interface ColorSelectorProps {
  colors: ProductColorOption[];
  selectedColorId: string;
  onSelectColor: (colorId: string) => void;
}

export const ColorSelector: React.FC<ColorSelectorProps> = ({
  colors,
  selectedColorId,
  onSelectColor,
}) => {
  const activeColorMeta = colors.find((c) => c.id === selectedColorId) || colors[0];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-[#181818] uppercase tracking-wider">
          Color :
        </span>
        <span className="font-semibold text-[#181818]">
          {activeColorMeta?.name} ({activeColorMeta?.id})
        </span>
      </div>

      <div className="flex items-center gap-3">
        {colors.map((c) => {
          const isSelected = selectedColorId === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => onSelectColor(c.id)}
              className={`group relative flex items-center justify-center w-9 h-9 rounded-full transition-all ${
                isSelected
                  ? 'ring-2 ring-offset-2 ring-[#181818] scale-105'
                  : 'hover:scale-105'
              }`}
              style={{ backgroundColor: c.hex }}
              title={`${c.name} (${c.id})`}
            >
              {/* Checkmark inside if selected */}
              {isSelected && (
                <Check
                  className={`w-4 h-4 stroke-[2.5] ${
                    c.id === 'White' || c.id === 'Beige' ? 'text-[#181818]' : 'text-white'
                  }`}
                />
              )}
              {/* Subtle border for light swatches */}
              <span className="absolute inset-0 rounded-full border border-black/10 pointer-events-none" />
            </button>
          );
        })}
      </div>
    </div>
  );
};
