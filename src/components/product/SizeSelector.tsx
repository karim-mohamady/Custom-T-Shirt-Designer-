import React from 'react';
import { TShirtSize } from '../../types';
import { SIZE_OPTIONS } from '../../utils/constants';

interface SizeSelectorProps {
  sizes?: TShirtSize[];
  selectedSize: TShirtSize;
  onSelectSize: (size: TShirtSize) => void;
}

export const SizeSelector: React.FC<SizeSelectorProps> = ({
  sizes = SIZE_OPTIONS,
  selectedSize,
  onSelectSize,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-[#181818] uppercase tracking-wider">
          Size :
        </span>
        <span className="text-[#777777] text-[11px]">
          Relaxed Boxy Fit (Unisex)
        </span>
      </div>

      <div className="grid grid-cols-6 gap-2">
        {sizes.map((size) => {
          const isSelected = selectedSize === size;
          return (
            <button
              key={size}
              type="button"
              onClick={() => onSelectSize(size)}
              className={`py-2 px-1 text-xs font-semibold rounded-lg border transition-all text-center ${
                isSelected
                  ? 'bg-[#181818] text-white border-[#181818] shadow-xs scale-102'
                  : 'bg-white text-[#181818] border-[#E8E6E1] hover:border-[#181818]'
              }`}
            >
              {size}
            </button>
          );
        })}
      </div>
    </div>
  );
};
