/**
 * Universal Image Processing Service
 * Provides robust decoding for images from any device (PNG, JPG, WebP, GIF, BMP, SVG, HEIC/HEIF)
 * Handles files with missing/unusual MIME types, sanitizes SVGs, and prevents memory leaks.
 */

// Maximum file size in bytes: 50 MB (accommodates high-res DSLR and mobile camera photos)
export const MAX_UPLOAD_SIZE_BYTES = 50 * 1024 * 1024;
// Maximum dimension to safeguard browser GPU/canvas memory
export const MAX_CANVAS_DIMENSION = 3800;

export interface ProcessedImageResult {
  dataUrl: string;
  width: number;
  height: number;
  format: string;
  fileSizeBytes: number;
  hasTransparency: boolean;
  name: string;
}

/**
 * Inspect magic bytes of a file to reliably identify format even if MIME type is missing or incorrect
 */
export async function detectImageFormat(file: File): Promise<string> {
  // If file extension is clear, use it as initial hint
  const ext = file.name.split('.').pop()?.toLowerCase() || '';

  // Read first 32 bytes for magic signatures
  try {
    const slice = file.slice(0, 32);
    const buffer = await slice.arrayBuffer();
    const bytes = new Uint8Array(buffer);

    // JPEG: FF D8 FF
    if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
      return 'jpeg';
    }
    // PNG: 89 50 4E 47 0D 0A 1A 0A
    if (
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4e &&
      bytes[3] === 0x47
    ) {
      return 'png';
    }
    // GIF: 47 49 46 38 ('GIF8')
    if (
      bytes[0] === 0x47 &&
      bytes[1] === 0x49 &&
      bytes[2] === 0x46 &&
      bytes[3] === 0x38
    ) {
      return 'gif';
    }
    // WebP: RIFF .... WEBP
    if (
      bytes[0] === 0x52 &&
      bytes[1] === 0x49 &&
      bytes[2] === 0x46 &&
      bytes[3] === 0x46 &&
      bytes[8] === 0x57 &&
      bytes[9] === 0x45 &&
      bytes[10] === 0x42 &&
      bytes[11] === 0x50
    ) {
      return 'webp';
    }
    // BMP: 42 4D ('BM')
    if (bytes[0] === 0x42 && bytes[1] === 0x4d) {
      return 'bmp';
    }
    // HEIC/HEIF: 4 bytes length, then 'ftypheic', 'ftypmif1', 'ftypmsf1', 'ftypheix'
    const brand = String.fromCharCode(...bytes.slice(4, 12));
    if (
      brand.includes('heic') ||
      brand.includes('mif1') ||
      brand.includes('heix') ||
      brand.includes('msf1') ||
      ext === 'heic' ||
      ext === 'heif'
    ) {
      return 'heic';
    }

    // SVG: Look for '<svg' or '<?xml'
    const headerStr = new TextDecoder('utf-8', { fatal: false }).decode(bytes).toLowerCase();
    if (headerStr.includes('<svg') || headerStr.includes('<?xml') || ext === 'svg') {
      return 'svg';
    }
  } catch (err) {
    console.warn('Magic byte inspection failed, falling back to extension/mime', err);
  }

  // Fallback to extension or file.type
  if (ext === 'svg' || file.type.includes('svg')) return 'svg';
  if (ext === 'png' || file.type.includes('png')) return 'png';
  if (ext === 'jpg' || ext === 'jpeg' || file.type.includes('jpeg')) return 'jpeg';
  if (ext === 'webp' || file.type.includes('webp')) return 'webp';
  if (ext === 'gif' || file.type.includes('gif')) return 'gif';
  if (ext === 'bmp' || file.type.includes('bmp')) return 'bmp';
  if (ext === 'heic' || ext === 'heif' || file.type.includes('heic') || file.type.includes('heif')) return 'heic';

  return 'generic';
}

/**
 * Sanitize SVG content: remove scripts, event handlers, and external resource exploits
 */
export function sanitizeSvgContent(rawSvg: string): string {
  // Strip <script> tags
  let clean = rawSvg.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  // Strip inline event attributes like onload, onclick, onerror, etc.
  clean = clean.replace(/\son[a-z]+\s*=\s*(['"]).*?\1/gi, '');
  // Strip javascript: pseudo protocol in href/xlink:href
  clean = clean.replace(/href\s*=\s*(['"])javascript:.*?\1/gi, 'href=""');
  return clean;
}

/**
 * Convert HEIC/HEIF blob to standard JPEG/PNG in browser
 */
async function convertHeicToJpeg(blob: Blob): Promise<Blob> {
  try {
    const heic2any = (await import('heic2any')).default;
    const result = await heic2any({
      blob,
      toType: 'image/jpeg',
      quality: 0.92,
    });
    return Array.isArray(result) ? result[0] : result;
  } catch (err) {
    console.error('HEIC conversion failed', err);
    throw new Error('Could not convert HEIC/HEIF photo. Please export as JPG or PNG.');
  }
}

/**
 * Robust image decoder that converts any image file into a clean dataUrl and metadata
 */
export async function decodeAndPrepareImage(
  file: File,
  onProgress?: (status: string) => void
): Promise<ProcessedImageResult> {
  onProgress?.('Inspecting image file...');

  if (file.size > MAX_UPLOAD_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    throw new Error(`File is too large (${sizeMb} MB). Maximum allowed size is 50 MB.`);
  }

  const format = await detectImageFormat(file);

  // 1. Special Handling for SVG
  if (format === 'svg') {
    onProgress?.('Validating vector SVG...');
    const text = await file.text();
    const sanitized = sanitizeSvgContent(text);
    if (!sanitized.includes('<svg')) {
      throw new Error('Invalid SVG file structure.');
    }

    // Parse viewBox or width/height to get dimensions
    const parser = new DOMParser();
    const doc = parser.parseFromString(sanitized, 'image/svg+xml');
    const svgEl = doc.querySelector('svg');
    let width = 600;
    let height = 600;
    if (svgEl) {
      const viewBox = svgEl.getAttribute('viewBox');
      if (viewBox) {
        const parts = viewBox.split(/\s+|,/).map(Number);
        if (parts.length === 4 && parts[2] > 0 && parts[3] > 0) {
          width = parts[2];
          height = parts[3];
        }
      } else {
        width = parseFloat(svgEl.getAttribute('width') || '600') || 600;
        height = parseFloat(svgEl.getAttribute('height') || '600') || 600;
      }
    }

    const dataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(sanitized);

    return {
      dataUrl,
      width,
      height,
      format: 'SVG Vector',
      fileSizeBytes: file.size,
      hasTransparency: true,
      name: file.name,
    };
  }

  // 2. Special Handling for HEIC/HEIF (iOS Photos)
  let processBlob: Blob = file;
  if (format === 'heic') {
    onProgress?.('Converting Apple HEIC photo to high-res JPEG...');
    processBlob = await convertHeicToJpeg(file);
  }

  // 3. Decoding Raster Images (JPG, PNG, WebP, BMP, GIF)
  onProgress?.('Decoding image pixels...');
  let decodedWidth = 0;
  let decodedHeight = 0;
  let hasTransparency = false;
  let finalDataUrl = '';

  // Attempt decoding via createImageBitmap if supported
  let imageBitmap: ImageBitmap | null = null;
  if (typeof createImageBitmap !== 'undefined') {
    try {
      imageBitmap = await createImageBitmap(processBlob);
      decodedWidth = imageBitmap.width;
      decodedHeight = imageBitmap.height;
    } catch {
      // Fall through to HTMLImageElement fallback
      imageBitmap = null;
    }
  }

  // Fallback to HTMLImageElement + FileReader if createImageBitmap was unavailable or threw
  if (!imageBitmap) {
    await new Promise<void>((resolve, reject) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(processBlob);

      img.onload = () => {
        decodedWidth = img.naturalWidth || img.width;
        decodedHeight = img.naturalHeight || img.height;
        URL.revokeObjectURL(objectUrl);
        resolve();
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(
          new Error(
            'Unable to decode image. The file may be corrupted or in an unsupported format.'
          )
        );
      };

      img.src = objectUrl;
    });
  }

  if (decodedWidth <= 0 || decodedHeight <= 0) {
    throw new Error('Image dimensions could not be read.');
  }

  // 4. Scaling / Optimization if image exceeds max GPU texture size
  const maxDim = Math.max(decodedWidth, decodedHeight);
  const needsDownscale = maxDim > MAX_CANVAS_DIMENSION;
  const scale = needsDownscale ? MAX_CANVAS_DIMENSION / maxDim : 1;
  const targetWidth = Math.round(decodedWidth * scale);
  const targetHeight = Math.round(decodedHeight * scale);

  onProgress?.(needsDownscale ? 'Optimizing high-res resolution...' : 'Rendering artwork...');

  // Draw onto canvas to verify and produce a clean, universally compatible dataUrl
  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  if (!ctx) {
    throw new Error('Canvas 2D context creation failed.');
  }

  if (imageBitmap) {
    ctx.drawImage(imageBitmap, 0, 0, targetWidth, targetHeight);
    imageBitmap.close();
  } else {
    // Re-draw from object URL
    await new Promise<void>((resolve, reject) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(processBlob);
      img.onload = () => {
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
        URL.revokeObjectURL(objectUrl);
        resolve();
      };
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Failed drawing image on canvas.'));
      };
      img.src = objectUrl;
    });
  }

  // 5. Check if image actually has any transparent pixels (e.g. transparent PNG / WebP)
  try {
    const sampleData = ctx.getImageData(0, 0, Math.min(100, targetWidth), Math.min(100, targetHeight)).data;
    for (let i = 3; i < sampleData.length; i += 4) {
      if (sampleData[i] < 250) {
        hasTransparency = true;
        break;
      }
    }
  } catch {
    hasTransparency = false;
  }

  // 6. Generate Data URL
  // If the image has transparency, preserve it as PNG.
  // Otherwise, if it's a solid photo, output high quality JPEG or PNG without altering the background.
  if (hasTransparency || format === 'png' || format === 'webp') {
    finalDataUrl = canvas.toDataURL('image/png');
  } else {
    finalDataUrl = canvas.toDataURL('image/jpeg', 0.94);
  }

  onProgress?.('Artwork ready!');

  return {
    dataUrl: finalDataUrl,
    width: targetWidth,
    height: targetHeight,
    format: format.toUpperCase(),
    fileSizeBytes: file.size,
    hasTransparency,
    name: file.name,
  };
}

/**
 * Optional solid background color knockout tool
 * Removes a solid background (e.g. white #ffffff or black #000000 or custom) with a tolerance slider.
 * Completely offline, client-side, and non-destructive.
 */
export async function removeSolidBackgroundColor(
  dataUrl: string,
  targetColorHex: string,
  tolerancePercent: number = 25
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(dataUrl);
        return;
      }

      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      // Parse target RGB
      const hex = targetColorHex.replace('#', '');
      const rTarget = parseInt(hex.substring(0, 2), 16) || 255;
      const gTarget = parseInt(hex.substring(2, 4), 16) || 255;
      const bTarget = parseInt(hex.substring(4, 6), 16) || 255;

      // Tolerance distance in Euclidean RGB space (max dist ~441.67)
      const maxDist = 442 * (tolerancePercent / 100);

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const dist = Math.sqrt(
          (r - rTarget) ** 2 + (g - gTarget) ** 2 + (b - bTarget) ** 2
        );

        if (dist <= maxDist) {
          // Soft feathering near the threshold boundary
          const featherRange = maxDist * 0.35;
          if (dist > maxDist - featherRange) {
            const alphaRatio = (dist - (maxDist - featherRange)) / featherRange;
            data[i + 3] = Math.round(data[i + 3] * alphaRatio);
          } else {
            data[i + 3] = 0; // Fully transparent
          }
        }
      }

      ctx.putImageData(imgData, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };

    img.onerror = () => reject(new Error('Failed to load image for background removal.'));
    img.src = dataUrl;
  });
}
