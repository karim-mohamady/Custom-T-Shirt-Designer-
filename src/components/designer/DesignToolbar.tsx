import React, { useState, useEffect } from 'react';
import {
  Upload,
  Type,
  Shapes,
  Undo2,
  Redo2,
  RotateCcw,
  Sliders,
} from 'lucide-react';
import { CanvasHandle } from './DesignCanvas';
import { UploadArtwork } from './UploadArtwork';
import { TextEditor } from './TextEditor';
import { ShapeTools } from './ShapeTools';
import { LayersPanel } from './LayersPanel';

interface DesignToolbarProps {
  canvasHandle: CanvasHandle | null;
}

type TabType = 'upload' | 'text' | 'shapes' | 'layers';

export const DesignToolbar: React.FC<DesignToolbarProps> = ({ canvasHandle }) => {
  const [activeTab, setActiveTab] = useState<TabType>('upload');

  // Auto-switch to layers tab when user selects an object on canvas
  useEffect(() => {
    if (canvasHandle?.selectedObject) {
      setActiveTab('layers');
    }
  }, [canvasHandle?.selectedObject]);

  const canUndo = canvasHandle?.canUndo ?? false;
  const canRedo = canvasHandle?.canRedo ?? false;
  const elementCount = canvasHandle?.elementCount ?? 0;

  return (
    <div className="bg-[#FAF9F6] border border-[#E8E6E1] rounded-2xl p-4 shadow-xs">
      {/* Top Header: Controls & Undo/Redo */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E8E6E1] mb-3.5">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wider font-semibold text-[#181818]">
            Design Studio
          </span>
          {elementCount > 0 && (
            <span className="px-1.5 py-0.5 text-[10px] font-mono bg-[#E8E6E1] text-[#181818] rounded-full">
              {elementCount} {elementCount === 1 ? 'element' : 'elements'}
            </span>
          )}
        </div>

        {/* Global Canvas Actions: Undo, Redo, Clear */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => canvasHandle?.undo()}
            disabled={!canUndo}
            className={`p-1.5 rounded-md border transition-colors ${
              canUndo
                ? 'bg-white border-[#E8E6E1] text-[#181818] hover:bg-neutral-100'
                : 'bg-transparent border-transparent text-neutral-300 cursor-not-allowed'
            }`}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => canvasHandle?.redo()}
            disabled={!canRedo}
            className={`p-1.5 rounded-md border transition-colors ${
              canRedo
                ? 'bg-white border-[#E8E6E1] text-[#181818] hover:bg-neutral-100'
                : 'bg-transparent border-transparent text-neutral-300 cursor-not-allowed'
            }`}
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => {
              if (elementCount > 0 && confirm('Clear all custom artwork and start over?')) {
                canvasHandle?.clearAll();
              }
            }}
            disabled={elementCount === 0}
            className={`p-1.5 rounded-md border transition-colors ${
              elementCount > 0
                ? 'bg-white border-[#E8E6E1] text-red-500 hover:bg-red-50'
                : 'bg-transparent border-transparent text-neutral-300 cursor-not-allowed'
            }`}
            title="Clear Canvas"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-[#EAE8E2] rounded-xl mb-4">
        <button
          type="button"
          onClick={() => setActiveTab('upload')}
          className={`flex-1 py-1.5 px-2 flex items-center justify-center gap-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'upload'
              ? 'bg-white text-[#181818] shadow-2xs font-semibold'
              : 'text-[#666666] hover:text-[#181818]'
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('text')}
          className={`flex-1 py-1.5 px-2 flex items-center justify-center gap-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'text'
              ? 'bg-white text-[#181818] shadow-2xs font-semibold'
              : 'text-[#666666] hover:text-[#181818]'
          }`}
        >
          <Type className="w-3.5 h-3.5" />
          <span>Text</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('shapes')}
          className={`flex-1 py-1.5 px-2 flex items-center justify-center gap-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'shapes'
              ? 'bg-white text-[#181818] shadow-2xs font-semibold'
              : 'text-[#666666] hover:text-[#181818]'
          }`}
        >
          <Shapes className="w-3.5 h-3.5" />
          <span>Shapes</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('layers')}
          className={`flex-1 py-1.5 px-2 flex items-center justify-center gap-1.5 rounded-lg text-xs font-medium transition-all relative ${
            activeTab === 'layers'
              ? 'bg-white text-[#181818] shadow-2xs font-semibold'
              : 'text-[#666666] hover:text-[#181818]'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Layer</span>
          {canvasHandle?.selectedObject && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#B99B73] absolute top-1.5 right-1.5" />
          )}
        </button>
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === 'upload' && (
          <UploadArtwork
            onImageLoaded={async (dataUrl) => {
              if (!canvasHandle) return false;
              return canvasHandle.addImageFromUrl(dataUrl);
            }}
          />
        )}

        {activeTab === 'text' && (
          <TextEditor
            onAddText={(txt, opts) => {
              canvasHandle?.addText(txt, opts);
            }}
          />
        )}

        {activeTab === 'shapes' && (
          <ShapeTools
            onAddShape={(shape, color) => {
              canvasHandle?.addShape(shape, color);
            }}
          />
        )}

        {activeTab === 'layers' && (
          <LayersPanel
            selectedObject={canvasHandle?.selectedObject || null}
            elementCount={elementCount}
            onDeleteSelected={() => canvasHandle?.deleteSelected()}
            onDuplicateSelected={() => canvasHandle?.duplicateSelected()}
            onAlignHorizontal={() => canvasHandle?.alignSelected('center-h')}
            onAlignVertical={() => canvasHandle?.alignSelected('center-v')}
            onBringForward={() => canvasHandle?.bringForward()}
            onSendBackward={() => canvasHandle?.sendBackward()}
            onBringToFront={() => canvasHandle?.bringToFront()}
            onSendToBack={() => canvasHandle?.sendToBack()}
            onUpdateProps={(props) => canvasHandle?.updateSelectedProps(props)}
            onReplaceImageSource={
              canvasHandle
                ? (newUrl) => canvasHandle.replaceActiveImageSource(newUrl)
                : undefined
            }
            getActiveImageDataUrl={
              canvasHandle ? () => canvasHandle.getActiveImageDataUrl() : undefined
            }
          />
        )}
      </div>
    </div>
  );
};
