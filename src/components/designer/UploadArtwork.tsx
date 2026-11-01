import React, { useRef, useState } from 'react';
import {
  UploadCloud,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  Image as ImageIcon,
  Loader2,
  FileImage,
  Info,
} from 'lucide-react';
import { decodeAndPrepareImage, ProcessedImageResult } from '../../services/imageService';
import { SAMPLE_PRESET_ARTWORKS } from '../../utils/constants';

interface UploadArtworkProps {
  onImageLoaded: (dataUrl: string) => Promise<boolean>;
}

export const UploadArtwork: React.FC<UploadArtworkProps> = ({ onImageLoaded }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<string>('');
  const [lastUploaded, setLastUploaded] = useState<ProcessedImageResult | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const processFile = async (file: File) => {
    setErrorMessage(null);
    setIsProcessing(true);
    setProcessingStatus('Starting image ingestion...');

    try {
      const result = await decodeAndPrepareImage(file, (status) => {
        setProcessingStatus(status);
      });

      setProcessingStatus('Placing artwork onto T-shirt...');
      const success = await onImageLoaded(result.dataUrl);

      if (success) {
        setLastUploaded(result);
        setProcessingStatus('');
      } else {
        throw new Error('Could not render image onto the customization canvas.');
      }
    } catch (err) {
      console.error('Image processing failure:', err);
      const msg = err instanceof Error ? err.message : 'Unknown image processing error.';
      setErrorMessage(msg);
      setProcessingStatus('');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
      e.target.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handlePresetSelect = async (svgString: string, name: string) => {
    setErrorMessage(null);
    setIsProcessing(true);
    setProcessingStatus(`Adding "${name}" preset...`);
    try {
      const dataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);
      const ok = await onImageLoaded(dataUrl);
      if (ok) {
        setLastUploaded({
          dataUrl,
          width: 200,
          height: 200,
          format: 'SVG PRESET',
          fileSizeBytes: svgString.length,
          hasTransparency: true,
          name,
        });
      }
    } catch (err) {
      setErrorMessage('Could not load preset graphic.');
    } finally {
      setIsProcessing(false);
      setProcessingStatus('');
    }
  };

  return (
    <div className="space-y-4">
      {/* Universal Hidden Native Input supporting photos, graphics, SVGs, HEIC */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*, .png, .jpg, .jpeg, .webp, .gif, .bmp, .svg, .heic, .heif"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Drag & Drop Upload Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => {
          if (!isProcessing) {
            fileInputRef.current?.click();
          }
        }}
        className={`group relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 text-center ${
          isDragOver
            ? 'border-[#B99B73] bg-[#F5F2EB]'
            : 'border-[#E8E6E1] hover:border-[#B99B73] bg-white/70 hover:bg-[#FAF9F5]'
        }`}
      >
        <div className="w-12 h-12 rounded-full bg-[#F5F2EB] flex items-center justify-center text-[#B99B73] group-hover:scale-110 transition-transform mb-3">
          {isProcessing ? (
            <Loader2 className="w-6 h-6 animate-spin text-[#B99B73]" />
          ) : (
            <UploadCloud className="w-6 h-6 stroke-[1.75]" />
          )}
        </div>

        <p className="text-sm font-semibold text-[#181818] mb-1">
          {isProcessing ? 'Processing image...' : 'Upload any photo or artwork'}
        </p>

        {isProcessing ? (
          <p className="text-xs text-[#B99B73] font-medium animate-pulse mt-0.5">
            {processingStatus}
          </p>
        ) : (
          <div className="space-y-1">
            <p className="text-xs text-[#555555]">
              Click to browse from your computer or drag & drop here
            </p>
            <p className="text-[11px] text-[#888888]">
              Supports standard photos (with backgrounds), PNG, JPG, WebP, GIF, BMP, SVG, and iPhone HEIC (up to 50 MB)
            </p>
          </div>
        )}
      </div>

      {/* Reassurance Callout for Normal Photos with Backgrounds */}
      <div className="flex items-start gap-2 p-2.5 bg-[#FAF9F5] border border-[#E8E6E1] rounded-lg text-[11px] text-[#666666]">
        <Info className="w-4 h-4 shrink-0 text-[#B99B73] mt-0.5" />
        <span>
          <strong>All photos supported:</strong> You can upload regular pictures with natural backgrounds or transparent stickers. The image prints exactly as framed on the garment.
        </span>
      </div>

      {/* Error Notice */}
      {errorMessage && (
        <div className="flex items-start gap-2 p-3 bg-red-50/95 border border-red-200 rounded-lg text-xs text-red-700 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">Upload issue</p>
            <p className="mt-0.5 text-[11px]">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Last Uploaded Artwork Metadata Banner */}
      {lastUploaded && !isProcessing && (
        <div className="p-3 bg-emerald-50/90 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-3 animate-in fade-in">
          <div className="w-10 h-10 rounded-lg border border-emerald-200 bg-white overflow-hidden shrink-0 flex items-center justify-center p-0.5">
            <img
              src={lastUploaded.dataUrl}
              alt="Artwork preview"
              className="max-w-full max-h-full object-contain"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 font-semibold text-emerald-900">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">{lastUploaded.name}</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-emerald-700 mt-0.5">
              <span>{lastUploaded.width} × {lastUploaded.height} px</span>
              <span>·</span>
              <span>{(lastUploaded.fileSizeBytes / (1024 * 1024)).toFixed(2)} MB</span>
              <span>·</span>
              <span className="uppercase font-mono">{lastUploaded.format}</span>
              <span>·</span>
              <span>{lastUploaded.hasTransparency ? 'Transparent' : 'Photo with Background'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Quick Test Presets */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-[#888888] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#B99B73]" />
            Curated Graphic Presets
          </span>
          <span className="text-[10px] text-[#999999]">Click to place on T-shirt</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {SAMPLE_PRESET_ARTWORKS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isProcessing}
              onClick={() => handlePresetSelect(preset.svg, preset.name)}
              className="flex flex-col items-center justify-center p-2.5 bg-white border border-[#E8E6E1] hover:border-[#B99B73] rounded-lg transition-all hover:shadow-xs group text-left disabled:opacity-50"
            >
              <div
                className="w-12 h-12 flex items-center justify-center p-1 group-hover:scale-105 transition-transform"
                dangerouslySetInnerHTML={{ __html: preset.svg }}
              />
              <span className="mt-1 text-[10px] font-medium text-[#181818] truncate w-full text-center">
                {preset.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Mandatory Format Testing Panel (8 Formats) */}
      <div className="pt-3 border-t border-[#E8E6E1]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-[#888888] flex items-center gap-1.5">
            <FileImage className="w-3.5 h-3.5 text-[#B99B73]" />
            Test Image Formats (8 Types)
          </span>
          <span className="text-[10px] text-[#999999]">1-Click Generation</span>
        </div>

        <p className="text-[10px] text-[#777777] mb-2">
          Generate real test image files on the fly to test format handling, dimensions, and background preservation:
        </p>

        <div className="grid grid-cols-2 gap-1.5">
          <button
            type="button"
            disabled={isProcessing}
            onClick={async () => {
              const { createRegularJpgPhoto } = await import('../../utils/testImageGenerators');
              const file = await createRegularJpgPhoto();
              processFile(file);
            }}
            className="p-2 text-left bg-white hover:bg-[#FAF9F5] border border-[#E8E6E1] hover:border-[#B99B73] rounded-lg transition-colors text-[11px] font-medium text-[#181818] flex items-center justify-between group disabled:opacity-50"
          >
            <span>1. JPG Photo (Background)</span>
            <span className="text-[9px] font-mono text-[#888888] group-hover:text-[#B99B73]">.JPG</span>
          </button>

          <button
            type="button"
            disabled={isProcessing}
            onClick={async () => {
              const { createTransparentPng } = await import('../../utils/testImageGenerators');
              const file = await createTransparentPng();
              processFile(file);
            }}
            className="p-2 text-left bg-white hover:bg-[#FAF9F5] border border-[#E8E6E1] hover:border-[#B99B73] rounded-lg transition-colors text-[11px] font-medium text-[#181818] flex items-center justify-between group disabled:opacity-50"
          >
            <span>2. Transparent PNG</span>
            <span className="text-[9px] font-mono text-[#888888] group-hover:text-[#B99B73]">.PNG</span>
          </button>

          <button
            type="button"
            disabled={isProcessing}
            onClick={async () => {
              const { createSolidBackgroundPng } = await import('../../utils/testImageGenerators');
              const file = await createSolidBackgroundPng();
              processFile(file);
            }}
            className="p-2 text-left bg-white hover:bg-[#FAF9F5] border border-[#E8E6E1] hover:border-[#B99B73] rounded-lg transition-colors text-[11px] font-medium text-[#181818] flex items-center justify-between group disabled:opacity-50"
          >
            <span>3. Solid PNG Frame</span>
            <span className="text-[9px] font-mono text-[#888888] group-hover:text-[#B99B73]">.PNG</span>
          </button>

          <button
            type="button"
            disabled={isProcessing}
            onClick={async () => {
              const { createHighResJpg } = await import('../../utils/testImageGenerators');
              const file = await createHighResJpg();
              processFile(file);
            }}
            className="p-2 text-left bg-white hover:bg-[#FAF9F5] border border-[#E8E6E1] hover:border-[#B99B73] rounded-lg transition-colors text-[11px] font-medium text-[#181818] flex items-center justify-between group disabled:opacity-50"
          >
            <span>4. High-Res 3200px</span>
            <span className="text-[9px] font-mono text-[#888888] group-hover:text-[#B99B73]">.JPG</span>
          </button>

          <button
            type="button"
            disabled={isProcessing}
            onClick={async () => {
              const { createWebpImage } = await import('../../utils/testImageGenerators');
              const file = await createWebpImage();
              processFile(file);
            }}
            className="p-2 text-left bg-white hover:bg-[#FAF9F5] border border-[#E8E6E1] hover:border-[#B99B73] rounded-lg transition-colors text-[11px] font-medium text-[#181818] flex items-center justify-between group disabled:opacity-50"
          >
            <span>5. WebP Cyber Graphic</span>
            <span className="text-[9px] font-mono text-[#888888] group-hover:text-[#B99B73]">.WEBP</span>
          </button>

          <button
            type="button"
            disabled={isProcessing}
            onClick={async () => {
              const { createGifImage } = await import('../../utils/testImageGenerators');
              const file = await createGifImage();
              processFile(file);
            }}
            className="p-2 text-left bg-white hover:bg-[#FAF9F5] border border-[#E8E6E1] hover:border-[#B99B73] rounded-lg transition-colors text-[11px] font-medium text-[#181818] flex items-center justify-between group disabled:opacity-50"
          >
            <span>6. Vintage GIF Asset</span>
            <span className="text-[9px] font-mono text-[#888888] group-hover:text-[#B99B73]">.GIF</span>
          </button>

          <button
            type="button"
            disabled={isProcessing}
            onClick={async () => {
              const { createSvgVectorFile } = await import('../../utils/testImageGenerators');
              const file = createSvgVectorFile();
              processFile(file);
            }}
            className="p-2 text-left bg-white hover:bg-[#FAF9F5] border border-[#E8E6E1] hover:border-[#B99B73] rounded-lg transition-colors text-[11px] font-medium text-[#181818] flex items-center justify-between group disabled:opacity-50"
          >
            <span>7. SVG Vector Crest</span>
            <span className="text-[9px] font-mono text-[#888888] group-hover:text-[#B99B73]">.SVG</span>
          </button>

          <button
            type="button"
            disabled={isProcessing}
            onClick={async () => {
              const { createMissingMimeTypeFile } = await import('../../utils/testImageGenerators');
              const file = await createMissingMimeTypeFile();
              processFile(file);
            }}
            className="p-2 text-left bg-white hover:bg-[#FAF9F5] border border-[#E8E6E1] hover:border-[#B99B73] rounded-lg transition-colors text-[11px] font-medium text-[#181818] flex items-center justify-between group disabled:opacity-50"
          >
            <span>8. No MIME Type (.dat)</span>
            <span className="text-[9px] font-mono text-[#888888] group-hover:text-[#B99B73]">RAW</span>
          </button>
        </div>
      </div>
    </div>
  );
};
