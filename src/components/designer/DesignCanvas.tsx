import React, { useEffect, useRef, useState, useCallback, useImperativeHandle, forwardRef } from 'react';
import {
  Canvas,
  FabricObject,
  FabricImage,
  IText,
  Rect,
  Circle,
  Triangle,
  Polygon,
} from 'fabric';
import { PRINT_AREA_CONFIG } from '../../utils/constants';

export interface CanvasHandle {
  addImageFromUrl: (url: string) => Promise<boolean>;
  replaceActiveImageSource: (newUrl: string) => Promise<boolean>;
  getActiveImageDataUrl: () => string | null;
  addText: (text: string, options?: { fontFamily?: string; fontSize?: number; fill?: string; bold?: boolean; italic?: boolean }) => void;
  addShape: (type: 'rect' | 'circle' | 'triangle' | 'star' | 'badge', fill?: string) => void;
  deleteSelected: () => void;
  duplicateSelected: () => Promise<void>;
  alignSelected: (alignment: 'center-h' | 'center-v') => void;
  bringForward: () => void;
  sendBackward: () => void;
  bringToFront: () => void;
  sendToBack: () => void;
  undo: () => void;
  redo: () => void;
  clearAll: () => void;
  canUndo: boolean;
  canRedo: boolean;
  elementCount: number;
  selectedObject: FabricObject | null;
  updateSelectedProps: (props: Record<string, unknown>) => void;
  getCanvasInstance: () => Canvas | null;
}

interface DesignCanvasProps {
  onCanvasChange?: (hasElements: boolean, count: number, json: string) => void;
  initialJson?: string | null;
}

export const DesignCanvas = forwardRef<CanvasHandle, DesignCanvasProps>(({
  onCanvasChange,
  initialJson,
}, ref) => {
  const canvasElRef = useRef<HTMLCanvasElement | null>(null);
  const fabricRef = useRef<Canvas | null>(null);

  const [selectedObject, setSelectedObject] = useState<FabricObject | null>(null);
  const [elementCount, setElementCount] = useState<number>(0);

  // Undo/Redo state management
  const historyRef = useRef<string[]>([]);
  const historyIndexRef = useRef<number>(-1);
  const isHistoryActionRef = useRef<boolean>(false);
  const [canUndo, setCanUndo] = useState<boolean>(false);
  const [canRedo, setCanRedo] = useState<boolean>(false);

  const notifyChange = useCallback(() => {
    if (!fabricRef.current) return;
    const canvas = fabricRef.current;
    const objects = canvas.getObjects();
    const count = objects.length;
    setElementCount(count);
    const jsonStr = JSON.stringify(canvas.toJSON());
    onCanvasChange?.(count > 0, count, jsonStr);
  }, [onCanvasChange]);

  const saveHistoryState = useCallback(() => {
    if (isHistoryActionRef.current || !fabricRef.current) return;
    const canvas = fabricRef.current;
    const jsonStr = JSON.stringify(canvas.toJSON());

    // Truncate future states if we were in the middle of history
    const newHistory = historyRef.current.slice(0, historyIndexRef.current + 1);
    newHistory.push(jsonStr);

    // Limit stack size to 30 to avoid memory growth
    if (newHistory.length > 30) {
      newHistory.shift();
    }

    historyRef.current = newHistory;
    historyIndexRef.current = newHistory.length - 1;

    setCanUndo(historyIndexRef.current > 0);
    setCanRedo(false);
    notifyChange();
  }, [notifyChange]);

  // Keep elements clamped strictly inside printable area bounds
  const enforceBounds = useCallback((obj: FabricObject) => {
    if (!fabricRef.current || !obj || typeof obj.getBoundingRect !== 'function') return;
    const canvas = fabricRef.current;
    try {
      const bound = obj.getBoundingRect();
      if (!bound || typeof bound.left !== 'number') return;

      // Horizontal boundaries
      if (bound.left < 0) {
        obj.left = (obj.left || 0) - bound.left;
      }
      if (bound.left + bound.width > canvas.width) {
        obj.left = (obj.left || 0) - (bound.left + bound.width - canvas.width);
      }

      // Vertical boundaries
      if (bound.top < 0) {
        obj.top = (obj.top || 0) - bound.top;
      }
      if (bound.top + bound.height > canvas.height) {
        obj.top = (obj.top || 0) - (bound.top + bound.height - canvas.height);
      }

      if (typeof obj.setCoords === 'function') {
        obj.setCoords();
      }
    } catch (err) {
      console.warn('Bounds enforcement warning:', err);
    }
  }, []);

  // Initialize Fabric Canvas
  useEffect(() => {
    if (!canvasElRef.current) return;

    const canvas = new Canvas(canvasElRef.current, {
      width: PRINT_AREA_CONFIG.width,
      height: PRINT_AREA_CONFIG.height,
      backgroundColor: 'transparent',
      selection: true,
      preserveObjectStacking: true,
    });

    fabricRef.current = canvas;

    // Selection styling
    FabricObject.prototype.transparentCorners = false;
    FabricObject.prototype.cornerColor = '#B99B73';
    FabricObject.prototype.cornerStyle = 'circle';
    FabricObject.prototype.borderColor = '#B99B73';
    FabricObject.prototype.cornerSize = 8;
    FabricObject.prototype.borderScaleFactor = 1.5;

    // Event listeners
    const handleSelection = () => {
      const active = canvas.getActiveObject();
      setSelectedObject(active || null);
    };

    const handleObjectMoving = (e: { target?: FabricObject }) => {
      if (e?.target) {
        enforceBounds(e.target);
      }
    };

    const handleObjectScaling = (e: { target?: FabricObject }) => {
      if (e?.target) {
        enforceBounds(e.target);
      }
    };

    const handleObjectRotating = (e: { target?: FabricObject }) => {
      if (e?.target) {
        enforceBounds(e.target);
      }
    };

    const handleObjectModified = () => {
      saveHistoryState();
      handleSelection();
    };

    canvas.on('selection:created', handleSelection);
    canvas.on('selection:updated', handleSelection);
    canvas.on('selection:cleared', () => setSelectedObject(null));
    canvas.on('object:moving', handleObjectMoving);
    canvas.on('object:scaling', handleObjectScaling);
    canvas.on('object:rotating', handleObjectRotating);
    canvas.on('object:modified', handleObjectModified);

    // Initial restore if JSON provided
    if (initialJson) {
      try {
        const parsed = JSON.parse(initialJson);
        canvas.loadFromJSON(parsed).then(() => {
          canvas.renderAll();
          notifyChange();
          // Initial history point
          const jsonStr = JSON.stringify(canvas.toJSON());
          historyRef.current = [jsonStr];
          historyIndexRef.current = 0;
          setCanUndo(false);
          setCanRedo(false);
        });
      } catch (e) {
        console.error('Failed to restore initial canvas json', e);
        historyRef.current = [JSON.stringify(canvas.toJSON())];
        historyIndexRef.current = 0;
      }
    } else {
      historyRef.current = [JSON.stringify(canvas.toJSON())];
      historyIndexRef.current = 0;
    }

    // Keyboard shortcuts (Delete / Backspace)
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      // Do not trigger if user is typing in an input or textarea
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
        return;
      }

      if (e.key === 'Delete' || e.key === 'Backspace') {
        const active = canvas.getActiveObject();
        if (active) {
          e.preventDefault();
          canvas.remove(active);
          canvas.discardActiveObject();
          canvas.renderAll();
          setSelectedObject(null);
          saveHistoryState();
        }
      } else if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          // Redo
          executeRedo();
        } else {
          // Undo
          executeUndo();
        }
      } else if ((e.metaKey || e.ctrlKey) && e.key === 'y') {
        e.preventDefault();
        executeRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      canvas.dispose();
      fabricRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const executeUndo = useCallback(() => {
    if (!fabricRef.current || historyIndexRef.current <= 0) return;
    const canvas = fabricRef.current;
    isHistoryActionRef.current = true;
    historyIndexRef.current -= 1;
    const state = historyRef.current[historyIndexRef.current];

    canvas.loadFromJSON(JSON.parse(state)).then(() => {
      canvas.renderAll();
      isHistoryActionRef.current = false;
      setCanUndo(historyIndexRef.current > 0);
      setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
      setSelectedObject(null);
      notifyChange();
    });
  }, [notifyChange]);

  const executeRedo = useCallback(() => {
    if (!fabricRef.current || historyIndexRef.current >= historyRef.current.length - 1) return;
    const canvas = fabricRef.current;
    isHistoryActionRef.current = true;
    historyIndexRef.current += 1;
    const state = historyRef.current[historyIndexRef.current];

    canvas.loadFromJSON(JSON.parse(state)).then(() => {
      canvas.renderAll();
      isHistoryActionRef.current = false;
      setCanUndo(historyIndexRef.current > 0);
      setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
      setSelectedObject(null);
      notifyChange();
    });
  }, [notifyChange]);

  // Imperative Canvas API Handle
  useImperativeHandle(
    ref,
    () => ({
      addImageFromUrl: async (url: string) => {
        if (!fabricRef.current) return false;
        const canvas = fabricRef.current;
        try {
          const img = await FabricImage.fromURL(url, { crossOrigin: 'anonymous' });
          if (!img.width || !img.height) return false;

          // Scale down to fit neatly within 75% of printable area while preserving aspect ratio
          const targetW = canvas.width * 0.75;
          const targetH = canvas.height * 0.75;
          const scale = Math.min(targetW / img.width, targetH / img.height, 1);

          img.scale(scale);

          // Apply slight stagger if multiple elements already exist so new items are visible
          const existingCount = canvas.getObjects().length;
          const staggerOffset = (existingCount % 4) * 12;

          const centeredLeft = (canvas.width - img.getScaledWidth()) / 2 + staggerOffset;
          const centeredTop = (canvas.height - img.getScaledHeight()) / 2 + staggerOffset;

          img.set({
            left: Math.max(0, Math.min(canvas.width - img.getScaledWidth(), centeredLeft)),
            top: Math.max(0, Math.min(canvas.height - img.getScaledHeight(), centeredTop)),
          });

          enforceBounds(img);
          canvas.add(img);
          canvas.setActiveObject(img);
          canvas.renderAll();
          setSelectedObject(img);
          saveHistoryState();
          return true;
        } catch (err) {
          console.error('Failed to load image onto fabric canvas', err);
          return false;
        }
      },

      replaceActiveImageSource: async (newUrl: string) => {
        if (!fabricRef.current) return false;
        const canvas = fabricRef.current;
        const active = canvas.getActiveObject();
        if (!active || active.type !== 'image') return false;

        try {
          const prevLeft = active.left;
          const prevTop = active.top;
          const prevScaleX = active.scaleX;
          const prevScaleY = active.scaleY;
          const prevAngle = active.angle;
          const prevOriginX = active.originX;
          const prevOriginY = active.originY;

          const newImg = await FabricImage.fromURL(newUrl, { crossOrigin: 'anonymous' });
          newImg.set({
            left: prevLeft,
            top: prevTop,
            scaleX: prevScaleX,
            scaleY: prevScaleY,
            angle: prevAngle,
            originX: prevOriginX,
            originY: prevOriginY,
          });

          const index = canvas.getObjects().indexOf(active);
          canvas.remove(active);
          if (index >= 0) {
            canvas.insertAt(index, newImg);
          } else {
            canvas.add(newImg);
          }
          canvas.setActiveObject(newImg);
          canvas.renderAll();
          setSelectedObject(newImg);
          saveHistoryState();
          return true;
        } catch (err) {
          console.error('Failed replacing active image', err);
          return false;
        }
      },

      getActiveImageDataUrl: () => {
        if (!fabricRef.current) return null;
        const active = fabricRef.current.getActiveObject();
        if (!active || active.type !== 'image') return null;
        // In Fabric 7, toDataURL exports the element
        return (active as FabricImage).toDataURL();
      },

      addText: (text: string, options = {}) => {
        if (!fabricRef.current) return;
        const canvas = fabricRef.current;
        const textObj = new IText(text || 'YOUR TEXT', {
          left: canvas.width / 2,
          top: canvas.height / 2,
          originX: 'center',
          originY: 'center',
          fontFamily: options.fontFamily || 'DM Sans',
          fontSize: options.fontSize || 24,
          fill: options.fill || '#181818',
          fontWeight: options.bold ? 'bold' : 'normal',
          fontStyle: options.italic ? 'italic' : 'normal',
          charSpacing: 20,
        });

        enforceBounds(textObj);
        canvas.add(textObj);
        canvas.setActiveObject(textObj);
        canvas.renderAll();
        setSelectedObject(textObj);
        saveHistoryState();
      },

      addShape: (type, fill = '#181818') => {
        if (!fabricRef.current) return;
        const canvas = fabricRef.current;
        let shape: FabricObject;

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        if (type === 'rect') {
          shape = new Rect({
            left: centerX,
            top: centerY,
            originX: 'center',
            originY: 'center',
            width: 120,
            height: 120,
            rx: 8,
            ry: 8,
            fill,
          });
        } else if (type === 'circle') {
          shape = new Circle({
            left: centerX,
            top: centerY,
            originX: 'center',
            originY: 'center',
            radius: 55,
            fill,
          });
        } else if (type === 'triangle') {
          shape = new Triangle({
            left: centerX,
            top: centerY,
            originX: 'center',
            originY: 'center',
            width: 110,
            height: 100,
            fill,
          });
        } else if (type === 'star') {
          // 5-point star points
          const points = [
            { x: 50, y: 0 },
            { x: 65, y: 35 },
            { x: 100, y: 35 },
            { x: 72, y: 57 },
            { x: 82, y: 92 },
            { x: 50, y: 70 },
            { x: 18, y: 92 },
            { x: 28, y: 57 },
            { x: 0, y: 35 },
            { x: 35, y: 35 },
          ];
          shape = new Polygon(points, {
            left: centerX,
            top: centerY,
            originX: 'center',
            originY: 'center',
            scaleX: 1.1,
            scaleY: 1.1,
            fill,
          });
        } else {
          // 'badge' / diamond
          shape = new Rect({
            left: centerX,
            top: centerY,
            originX: 'center',
            originY: 'center',
            width: 90,
            height: 90,
            angle: 45,
            fill,
          });
        }

        enforceBounds(shape);
        canvas.add(shape);
        canvas.setActiveObject(shape);
        canvas.renderAll();
        setSelectedObject(shape);
        saveHistoryState();
      },

      deleteSelected: () => {
        if (!fabricRef.current) return;
        const canvas = fabricRef.current;
        const active = canvas.getActiveObject();
        if (active) {
          canvas.remove(active);
          canvas.discardActiveObject();
          canvas.renderAll();
          setSelectedObject(null);
          saveHistoryState();
        }
      },

      duplicateSelected: async () => {
        if (!fabricRef.current) return;
        const canvas = fabricRef.current;
        const active = canvas.getActiveObject();
        if (active) {
          const clone = await active.clone();
          clone.set({
            left: Math.min((active.left || 0) + 15, canvas.width - 40),
            top: Math.min((active.top || 0) + 15, canvas.height - 40),
          });
          enforceBounds(clone);
          canvas.add(clone);
          canvas.setActiveObject(clone);
          canvas.renderAll();
          setSelectedObject(clone);
          saveHistoryState();
        }
      },

      alignSelected: (alignment) => {
        if (!fabricRef.current) return;
        const canvas = fabricRef.current;
        const active = canvas.getActiveObject();
        if (!active) return;

        if (alignment === 'center-h') {
          active.set({
            left: (canvas.width - active.getScaledWidth()) / 2,
          });
        } else if (alignment === 'center-v') {
          active.set({
            top: (canvas.height - active.getScaledHeight()) / 2,
          });
        }
        enforceBounds(active);
        canvas.renderAll();
        saveHistoryState();
      },

      bringForward: () => {
        if (!fabricRef.current) return;
        const canvas = fabricRef.current;
        const active = canvas.getActiveObject();
        if (active) {
          canvas.bringObjectForward(active);
          canvas.renderAll();
          saveHistoryState();
        }
      },

      sendBackward: () => {
        if (!fabricRef.current) return;
        const canvas = fabricRef.current;
        const active = canvas.getActiveObject();
        if (active) {
          canvas.sendObjectBackwards(active);
          canvas.renderAll();
          saveHistoryState();
        }
      },

      bringToFront: () => {
        if (!fabricRef.current) return;
        const canvas = fabricRef.current;
        const active = canvas.getActiveObject();
        if (active) {
          canvas.bringObjectToFront(active);
          canvas.renderAll();
          saveHistoryState();
        }
      },

      sendToBack: () => {
        if (!fabricRef.current) return;
        const canvas = fabricRef.current;
        const active = canvas.getActiveObject();
        if (active) {
          canvas.sendObjectToBack(active);
          canvas.renderAll();
          saveHistoryState();
        }
      },

      undo: executeUndo,
      redo: executeRedo,

      clearAll: () => {
        if (!fabricRef.current) return;
        const canvas = fabricRef.current;
        canvas.clear();
        canvas.backgroundColor = 'transparent';
        canvas.renderAll();
        setSelectedObject(null);
        saveHistoryState();
      },

      canUndo,
      canRedo,
      elementCount,
      selectedObject,

      updateSelectedProps: (props: Record<string, unknown>) => {
        if (!fabricRef.current) return;
        const canvas = fabricRef.current;
        const active = canvas.getActiveObject();
        if (!active) return;

        active.set(props);
        canvas.renderAll();
        saveHistoryState();
        // Trigger React state refresh for selected object inspector
        setSelectedObject(active);
      },

      getCanvasInstance: () => fabricRef.current,
    }),
    [
      canUndo,
      canRedo,
      elementCount,
      selectedObject,
      enforceBounds,
      executeUndo,
      executeRedo,
      saveHistoryState,
    ]
  );

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <canvas
        ref={canvasElRef}
        width={PRINT_AREA_CONFIG.width}
        height={PRINT_AREA_CONFIG.height}
        className="touch-none select-none"
      />
    </div>
  );
});

DesignCanvas.displayName = 'DesignCanvas';
