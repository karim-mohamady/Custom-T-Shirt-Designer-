import { Canvas as FabricCanvas } from 'fabric';
import { ProductItem } from '../types';

/**
 * Generates transparent print PNG (customer artwork only, high DPI)
 */
export function exportTransparentPrintPng(fabricCanvas: FabricCanvas): string {
  // Deselect any active bounding box so selection handles don't appear in export
  fabricCanvas.discardActiveObject();
  fabricCanvas.renderAll();

  // Export at high 3x resolution for crisp DTG print production
  return fabricCanvas.toDataURL({
    format: 'png',
    multiplier: 3,
    enableRetinaScaling: true,
  });
}

/**
 * Color map for realistic offscreen canvas apparel rendering
 */
const COLOR_CONFIG: Record<
  string,
  { base: string; collar: string; shadow: string; name: string }
> = {
  Black: { base: '#1b1b1e', collar: '#141416', shadow: '#0d0d0f', name: 'Washed Onyx' },
  White: { base: '#f6f6f3', collar: '#eae9e4', shadow: '#dcd9d2', name: 'Raw Chalk' },
  Beige: { base: '#d7cbb8', collar: '#c6b9a4', shadow: '#b8a991', name: 'Desert Oat' },
  Gray: { base: '#a0a4a9', collar: '#8d9197', shadow: '#7e8288', name: 'Heather Slate' },
};

/**
 * Generates the full product preview (T-Shirt or Hoodie with the customized design placed on it)
 */
export async function exportProductPreviewPng(
  fabricCanvas: FabricCanvas,
  product: ProductItem,
  colorId: string
): Promise<string> {
  const transparentArtwork = exportTransparentPrintPng(fabricCanvas);

  return new Promise((resolve) => {
    const width = 600;
    const height = 700;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      resolve(transparentArtwork);
      return;
    }

    const colorMeta =
      product.colors.find((c) => c.id === colorId) || product.colors[0];
    const theme =
      COLOR_CONFIG[colorId] || {
        base: colorMeta.hex,
        collar: colorMeta.hex,
        shadow: '#111111',
        name: colorMeta.name,
      };

    // 1. Soft neutral luxury background
    ctx.fillStyle = '#F7F6F2';
    ctx.fillRect(0, 0, width, height);

    // 2. Drop shadow under garment
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(300, 660, 180, 14, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
    ctx.filter = 'blur(10px)';
    ctx.fill();
    ctx.restore();

    // 3. Build SVG Mockup string based on garmentType
    let svgString = '';
    let artworkX = 165;
    let artworkY = 175;
    let artworkW = 270;
    let artworkH = 350;

    if (product.garmentType === 'hoodie') {
      artworkX = 165;
      artworkY = 154;
      artworkW = 270;
      artworkH = 294;

      svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 600 700">
        <defs>
          <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.2"/>
            <stop offset="100%" stop-color="#000000" stop-opacity="0.25"/>
          </linearGradient>
        </defs>
        <!-- Hood Inner -->
        <path d="M 235 110 C 235 40 365 40 365 110 C 345 130 255 130 235 110 Z" fill="#111113" opacity="0.9"/>
        <!-- Body & Sleeves -->
        <path d="M 230 115 C 175 132 110 155 42 190 C 34 194 30 204 35 212 L 86 312 C 90 318 99 320 106 315 L 148 278 C 148 310 146 470 145 615 C 145 625 152 632 162 632 L 438 632 C 448 632 455 625 455 615 C 454 470 452 310 452 278 L 494 315 C 501 320 510 318 514 312 L 565 212 C 570 204 566 194 558 190 C 490 155 425 132 370 115 C 350 148 250 148 230 115 Z" fill="${theme.base}" stroke="${theme.shadow}" stroke-width="2"/>
        <path d="M 230 115 C 175 132 110 155 42 190 C 34 194 30 204 35 212 L 86 312 C 90 318 99 320 106 315 L 148 278 C 148 310 146 470 145 615 C 145 625 152 632 162 632 L 438 632 C 448 632 455 625 455 615 C 454 470 452 310 452 278 L 494 315 C 501 320 510 318 514 312 L 565 212 C 570 204 566 194 558 190 C 490 155 425 132 370 115 C 350 148 250 148 230 115 Z" fill="url(#g1)"/>
        <!-- Hood Exterior -->
        <path d="M 215 125 C 210 50 250 25 300 25 C 350 25 390 50 385 125 C 370 150 345 155 300 155 C 255 155 230 150 215 125 Z" fill="${theme.base}" stroke="${theme.shadow}" stroke-width="2"/>
        <path d="M 285 140 L 300 155 L 315 140" stroke="${theme.shadow}" stroke-width="1.5" fill="none"/>
        <!-- Kangaroo Pocket -->
        <path d="M 195 480 L 225 440 L 375 440 L 405 480 L 405 605 L 195 605 Z" fill="${theme.base}" stroke="${theme.shadow}" stroke-width="1.5"/>
        <path d="M 195 480 L 225 440 L 375 440 L 405 480 L 405 605 L 195 605 Z" fill="url(#g1)"/>
        <line x1="198" y1="482" x2="226" y2="444" stroke="${theme.shadow}" stroke-width="1.5" stroke-dasharray="2 1.5"/>
        <line x1="402" y1="482" x2="374" y2="444" stroke="${theme.shadow}" stroke-width="1.5" stroke-dasharray="2 1.5"/>
      </svg>`;
    } else {
      // T-Shirt
      artworkX = 165;
      artworkY = 175;
      artworkW = 270;
      artworkH = 350;

      svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 600 700">
        <defs>
          <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.15"/>
            <stop offset="100%" stop-color="#000000" stop-opacity="0.2"/>
          </linearGradient>
        </defs>
        <!-- Collar Back -->
        <path d="M245 88 C270 102 330 102 355 88 C345 74 255 74 245 88 Z" fill="${theme.collar}"/>
        <!-- Body & Sleeves -->
        <path d="M 230 92 C 180 110 115 138 46 172 C 38 176 34 186 38 194 L 86 288 C 90 295 100 297 107 292 L 152 258 C 152 280 151 450 150 635 C 150 644 157 650 166 650 L 434 650 C 443 650 450 644 450 635 C 449 450 448 280 448 258 L 493 292 C 500 297 510 295 514 288 L 562 194 C 566 186 562 176 554 172 C 485 138 420 110 370 92 C 348 135 252 135 230 92 Z" fill="${theme.base}" stroke="${theme.shadow}" stroke-width="2"/>
        <path d="M 230 92 C 180 110 115 138 46 172 C 38 176 34 186 38 194 L 86 288 C 90 295 100 297 107 292 L 152 258 C 152 280 151 450 150 635 C 150 644 157 650 166 650 L 434 650 C 443 650 450 644 450 635 C 449 450 448 280 448 258 L 493 292 C 500 297 510 295 514 288 L 562 194 C 566 186 562 176 554 172 C 485 138 420 110 370 92 C 348 135 252 135 230 92 Z" fill="url(#g1)"/>
        <!-- Dropped Shoulder Seams -->
        <path d="M 175 125 L 140 230" stroke="${theme.shadow}" stroke-width="1.5" stroke-dasharray="3 2" opacity="0.6"/>
        <path d="M 425 125 L 460 230" stroke="${theme.shadow}" stroke-width="1.5" stroke-dasharray="3 2" opacity="0.6"/>
        <!-- Collar Front Rib -->
        <path d="M 230 92 C 255 138 345 138 370 92 C 352 118 248 118 230 92 Z" fill="${theme.collar}" stroke="${theme.shadow}" stroke-width="1.5"/>
      </svg>`;
    }

    const garmentImg = new Image();
    garmentImg.crossOrigin = 'anonymous';
    garmentImg.onload = () => {
      ctx.drawImage(garmentImg, 0, 0, width, height);

      // 4. Draw the artwork at exact print area coordinates
      const artworkImg = new Image();
      artworkImg.crossOrigin = 'anonymous';
      artworkImg.onload = () => {
        ctx.drawImage(artworkImg, artworkX, artworkY, artworkW, artworkH);

        // 5. Add small brand signature watermark on bottom
        ctx.fillStyle = '#888888';
        ctx.font = '500 11px Space Grotesk, monospace';
        ctx.fillText(`ATELIER / ${product.name.toUpperCase()} / PREVIEW`, 24, height - 24);

        const finalPreview = canvas.toDataURL('image/png');
        resolve(finalPreview);
      };
      artworkImg.onerror = () => {
        resolve(canvas.toDataURL('image/png'));
      };
      artworkImg.src = transparentArtwork;
    };
    garmentImg.onerror = () => {
      resolve(transparentArtwork);
    };
    garmentImg.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);
  });
}
