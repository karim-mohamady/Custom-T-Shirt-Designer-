import React, { useState } from 'react';
import {
  Trash2,
  Copy,
  AlignCenter,
  AlignVerticalSpaceAround,
  ChevronsUp,
  ChevronsDown,
  ChevronUp,
  ChevronDown,
  Layers,
  Palette,
  Scissors,
  RotateCcw,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { FabricObject, FabricImage } from 'fabric';
import { PALETTE_COLORS, FONT_OPTIONS } from '../../utils/constants';
import { removeSolidBackgroundColor } from '../../services/imageService';

interface LayersPanelProps {
  selectedObject: FabricObject | null;
  elementCount: number;
  onDeleteSelected: () => void;
  onDuplicateSelected: () => void;
  onAlignHorizontal: () => void;
  onAlignVertical: () => void;
  onBringForward: () => void;
  onSendBackward: () => void;
  onBringToFront: () => void;
  onSendToBack: () => void;
  onUpdateProps: (props: Record<string, unknown>) => void;
  onReplaceImageSource?: (newUrl: string) => Promise<boolean>;
  getActiveImageDataUrl?: () => string | null;
}

export const LayersPanel: React.FC<LayersPanelProps> = ({
  selectedObject,
  elementCount,
  onDeleteSelected,
  onDuplicateSelected,
  onAlignHorizontal,
  onAlignVertical,
  onBringForward,
  onSendBackward,
  onBringToFront,
  onSendToBack,
  onUpdateProps,
  onReplaceImageSource,
  getActiveImageDataUrl,
}) => {
  // Background removal tool state
  const [showBgKnockout, setShowBgKnockout] = useState(false);
  const [knockoutColor, setKnockoutColor] = useState('#FFFFFF');
  const [tolerance, setTolerance] = useState(25);
  const [isProcessingBg, setIsProcessingBg] = useState(false);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);

  if (!selectedObject) {
    return (
      <div className="p-4 bg-white/50 border border-[#E8E6E1] rounded-xl text-center">
        <Layers className="w-6 h-6 mx-auto mb-2 text-[#999999]" />
        <p className="text-xs font-medium text-[#555555]">No Element Selected</p>
        <p className="text-[11px] text-[#888888] mt-0.5">
          {elementCount > 0
            ? 'Click any design element or photo on the T-shirt to edit, scale, or reorder.'
            : 'Upload artwork or add text/shapes to begin customizing.'}
        </p>
      </div>
    );
  }

  // Determine element type safely
  const objType = selectedObject.type || 'element';
  const isText = objType === 'i-text' || objType === 'text' || objType === 'textbox';
  const isImage = objType === 'image';
  const currentFill = (selectedObject.get('fill') as string) || '#181818';
  const currentOpacity = (selectedObject.get('opacity') as number) ?? 1;
  const currentFontSize = isText ? (selectedObject.get('fontSize') as number) || 24 : null;
  const currentFontFamily = isText ? (selectedObject.get('fontFamily') as string) || 'DM Sans' : null;

  const handleApplyKnockout = async () => {
    if (!onReplaceImageSource || !getActiveImageDataUrl) return;
    const currentUrl = getActiveImageDataUrl();
    if (!currentUrl) return;

    if (!originalImageUrl) {
      setOriginalImageUrl(currentUrl);
    }

    setIsProcessingBg(true);
    try {
      const transparentDataUrl = await removeSolidBackgroundColor(
        currentUrl,
        knockoutColor,
        tolerance
      );
      await onReplaceImageSource(transparentDataUrl);
    } catch (err) {
      console.error('Failed to remove background', err);
    } finally {
      setIsProcessingBg(false);
    }
  };

  const handleRestoreOriginal = async () => {
    if (!originalImageUrl || !onReplaceImageSource) return;
    setIsProcessingBg(true);
    try {
      await onReplaceImageSource(originalImageUrl);
      setOriginalImageUrl(null);
    } catch (err) {
      console.error('Failed restoring original image', err);
    } finally {
      setIsProcessingBg(false);
    }
  };

  return (
    <div className="p-3.5 bg-white border border-[#E8E6E1] rounded-xl space-y-3.5 shadow-2xs animate-in fade-in">
      {/* Header with Type & Quick Actions */}
      <div className="flex items-center justify-between border-b border-[#F0EFEA] pb-2.5">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#B99B73]" />
          <span className="text-xs font-semibold text-[#181818] uppercase tracking-wider">
            {isText ? 'Typography Layer' : isImage ? 'Photo / Image Layer' : 'Shape Layer'}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onDuplicateSelected}
            className="p-1.5 text-neutral-500 hover:text-black hover:bg-neutral-100 rounded-md transition-colors"
            title="Duplicate Layer"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onDeleteSelected}
            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
            title="Delete Layer (Del/Backspace)"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Image-Specific Tools: Optional Solid Background Knockout */}
      {isImage && (
        <div className="p-2.5 bg-[#FAF9F5] border border-[#E8E6E1] rounded-lg space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#181818] flex items-center gap-1.5">
              <Scissors className="w-3.5 h-3.5 text-[#B99B73]" />
              Remove Solid Background (Optional)
            </span>
            <button
              type="button"
              onClick={() => setShowBgKnockout(!showBgKnockout)}
              className="text-[10px] text-[#B99B73] hover:underline font-medium"
            >
              {showBgKnockout ? 'Hide' : 'Configure'}
            </button>
          </div>

          <p className="text-[10px] text-[#777777] leading-tight">
            Standard photos keep their original backgrounds by default. Use this tool only if you want to make a solid color (e.g. white border or studio backdrop) transparent.
          </p>

          {showBgKnockout && (
            <div className="pt-2 border-t border-[#E8E6E1] space-y-2.5 animate-in fade-in">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-[#666666]">Color to remove:</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setKnockoutColor('#FFFFFF')}
                    className={`px-2 py-0.5 rounded border text-[10px] ${
                      knockoutColor === '#FFFFFF'
                        ? 'bg-black text-white border-black font-semibold'
                        : 'bg-white text-neutral-700 border-neutral-300'
                    }`}
                  >
                    White
                  </button>
                  <button
                    type="button"
                    onClick={() => setKnockoutColor('#000000')}
                    className={`px-2 py-0.5 rounded border text-[10px] ${
                      knockoutColor === '#000000'
                        ? 'bg-black text-white border-black font-semibold'
                        : 'bg-white text-neutral-700 border-neutral-300'
                    }`}
                  >
                    Black
                  </button>
                  <input
                    type="color"
                    value={knockoutColor}
                    onChange={(e) => setKnockoutColor(e.target.value)}
                    className="w-5 h-5 rounded cursor-pointer border border-neutral-300"
                    title="Pick custom color"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-[10px] text-[#666666] mb-1">
                  <span>Tolerance:</span>
                  <span className="font-mono">{tolerance}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="65"
                  value={tolerance}
                  onChange={(e) => setTolerance(Number(e.target.value))}
                  className="w-full accent-[#B99B73] cursor-pointer"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  disabled={isProcessingBg}
                  onClick={handleApplyKnockout}
                  className="flex-1 py-1.5 px-3 bg-[#181818] hover:bg-black text-white rounded-md text-[11px] font-semibold transition-colors flex items-center justify-center gap-1.5 disabled:opacity-60"
                >
                  {isProcessingBg ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5 text-[#B99B73]" />
                  )}
                  <span>Apply Knockout</span>
                </button>

                {originalImageUrl && (
                  <button
                    type="button"
                    disabled={isProcessingBg}
                    onClick={handleRestoreOriginal}
                    className="py-1.5 px-2 bg-white hover:bg-neutral-100 text-[#181818] border border-[#E8E6E1] rounded-md text-[11px] font-medium transition-colors flex items-center gap-1"
                    title="Restore original photo background"
                  >
                    <RotateCcw className="w-3 h-3 text-[#777777]" />
                    <span>Reset</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Text specific direct modification */}
      {isText && (
        <div className="space-y-2.5">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="block text-[10px] uppercase tracking-wider text-[#777777] mb-1">
                Font Family
              </span>
              <select
                value={currentFontFamily || ''}
                onChange={(e) => onUpdateProps({ fontFamily: e.target.value })}
                className="w-full text-xs px-2 py-1.5 bg-[#FAF9F5] border border-[#E8E6E1] rounded-md outline-hidden cursor-pointer"
              >
                {FONT_OPTIONS.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <span className="block text-[10px] uppercase tracking-wider text-[#777777] mb-1">
                Size ({currentFontSize}px)
              </span>
              <input
                type="range"
                min="12"
                max="60"
                value={currentFontSize || 24}
                onChange={(e) => onUpdateProps({ fontSize: Number(e.target.value) })}
                className="w-full accent-[#B99B73] mt-1 cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Color Swatches (for text & shapes) */}
      {!isImage && (
        <div>
          <span className="text-[10px] uppercase tracking-wider text-[#777777] mb-1.5 flex items-center gap-1">
            <Palette className="w-3 h-3 text-[#B99B73]" />
            Color
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {PALETTE_COLORS.slice(0, 8).map((hex) => (
              <button
                key={hex}
                type="button"
                onClick={() => onUpdateProps({ fill: hex })}
                className={`w-5 h-5 rounded-full border transition-all ${
                  typeof currentFill === 'string' &&
                  currentFill.toLowerCase() === hex.toLowerCase()
                    ? 'scale-120 ring-2 ring-[#B99B73] border-white'
                    : 'border-neutral-300 hover:scale-105'
                }`}
                style={{ backgroundColor: hex }}
                title={hex}
              />
            ))}
          </div>
        </div>
      )}

      {/* Opacity Control */}
      <div>
        <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-[#777777] mb-1">
          <span>Opacity</span>
          <span className="font-mono">{Math.round(currentOpacity * 100)}%</span>
        </div>
        <input
          type="range"
          min="0.1"
          max="1"
          step="0.05"
          value={currentOpacity}
          onChange={(e) => onUpdateProps({ opacity: Number(e.target.value) })}
          className="w-full accent-[#B99B73] cursor-pointer"
        />
      </div>

      {/* Alignment & Layer Ordering Tools */}
      <div className="pt-1 border-t border-[#F0EFEA] flex items-center justify-between">
        {/* Alignment */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onAlignHorizontal}
            className="p-1.5 bg-[#FAF9F5] hover:bg-neutral-200 border border-[#E8E6E1] rounded text-[#444444] transition-colors"
            title="Center Horizontally"
          >
            <AlignCenter className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onAlignVertical}
            className="p-1.5 bg-[#FAF9F5] hover:bg-neutral-200 border border-[#E8E6E1] rounded text-[#444444] transition-colors"
            title="Center Vertically"
          >
            <AlignVerticalSpaceAround className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Stacking / Layers */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onSendToBack}
            className="p-1.5 bg-[#FAF9F5] hover:bg-neutral-200 border border-[#E8E6E1] rounded text-[#444444] transition-colors"
            title="Send to Bottom"
          >
            <ChevronsDown className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onSendBackward}
            className="p-1.5 bg-[#FAF9F5] hover:bg-neutral-200 border border-[#E8E6E1] rounded text-[#444444] transition-colors"
            title="Send Backward"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onBringForward}
            className="p-1.5 bg-[#FAF9F5] hover:bg-neutral-200 border border-[#E8E6E1] rounded text-[#444444] transition-colors"
            title="Bring Forward"
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onBringToFront}
            className="p-1.5 bg-[#FAF9F5] hover:bg-neutral-200 border border-[#E8E6E1] rounded text-[#444444] transition-colors"
            title="Bring to Top"
          >
            <ChevronsUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
