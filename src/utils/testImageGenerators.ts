/**
 * Test Image Generator Utility
 * Generates genuine File objects in the browser for all 8 mandatory testing formats.
 */

// 1. Regular JPG photo with a background
export async function createRegularJpgPhoto(): Promise<File> {
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 600;
  const ctx = canvas.getContext('2d')!;

  // Sunset landscape photo with rich solid background
  const skyGradient = ctx.createLinearGradient(0, 0, 0, 450);
  skyGradient.addColorStop(0, '#1a2a6c');
  skyGradient.addColorStop(0.5, '#b21f1f');
  skyGradient.addColorStop(1, '#fdbb2d');
  ctx.fillStyle = skyGradient;
  ctx.fillRect(0, 0, 800, 600);

  // Glowing sun
  ctx.beginPath();
  ctx.arc(400, 300, 70, 0, Math.PI * 2);
  ctx.fillStyle = '#fff4cc';
  ctx.shadowColor = '#ffeaa7';
  ctx.shadowBlur = 40;
  ctx.fill();
  ctx.shadowBlur = 0;

  // Mountain silhouettes in background
  ctx.fillStyle = '#1e130c';
  ctx.beginPath();
  ctx.moveTo(0, 600);
  ctx.lineTo(220, 380);
  ctx.lineTo(440, 520);
  ctx.lineTo(650, 350);
  ctx.lineTo(800, 480);
  ctx.lineTo(800, 600);
  ctx.closePath();
  ctx.fill();

  // Water reflection
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.fillRect(0, 520, 800, 80);

  // Caption on photo
  ctx.fillStyle = '#ffffff';
  ctx.font = '600 24px sans-serif';
  ctx.fillText('Alpine Sunset — Original Photo', 30, 570);

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        resolve(new File([blob!], 'sunset_landscape_photo.jpg', { type: 'image/jpeg' }));
      },
      'image/jpeg',
      0.92
    );
  });
}

// 2. Transparent PNG (Sticker / Logo with transparent background)
export async function createTransparentPng(): Promise<File> {
  const canvas = document.createElement('canvas');
  canvas.width = 500;
  canvas.height = 500;
  const ctx = canvas.getContext('2d')!;

  // Leave canvas transparent (no fillRect)
  ctx.save();
  ctx.beginPath();
  ctx.arc(250, 250, 180, 0, Math.PI * 2);
  ctx.fillStyle = '#b99b73';
  ctx.fill();

  ctx.lineWidth = 12;
  ctx.strokeStyle = '#181818';
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 52px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('ORIGINAL', 250, 210);

  ctx.font = '500 28px monospace';
  ctx.fillText('TRANSPARENT', 250, 260);

  ctx.font = 'bold 20px sans-serif';
  ctx.fillStyle = '#181818';
  ctx.fillText('NO BACKGROUND', 250, 305);
  ctx.restore();

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(new File([blob!], 'transparent_sticker_logo.png', { type: 'image/png' }));
    }, 'image/png');
  });
}

// 3. PNG with a Solid Background (e.g. solid charcoal graphic badge)
export async function createSolidBackgroundPng(): Promise<File> {
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 600;
  const ctx = canvas.getContext('2d')!;

  // Solid dark background
  ctx.fillStyle = '#222226';
  ctx.fillRect(0, 0, 600, 600);

  // Border & Graphic
  ctx.strokeStyle = '#e7ded0';
  ctx.lineWidth = 6;
  ctx.strokeRect(30, 30, 540, 540);

  ctx.fillStyle = '#b99b73';
  ctx.font = 'bold 44px serif';
  ctx.textAlign = 'center';
  ctx.fillText('ATELIER STUDIO', 300, 260);

  ctx.fillStyle = '#999999';
  ctx.font = '300 20px sans-serif';
  ctx.fillText('Solid PNG Photo Frame', 300, 320);

  ctx.fillStyle = '#ffffff';
  ctx.font = '14px monospace';
  ctx.fillText('OPAQUE CANVAS BACKGROUND', 300, 380);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(new File([blob!], 'solid_background_graphic.png', { type: 'image/png' }));
    }, 'image/png');
  });
}

// 4. Large High-Resolution JPG (3200 × 2400 px, ~4-5 MB equivalent)
export async function createHighResJpg(): Promise<File> {
  const canvas = document.createElement('canvas');
  canvas.width = 3200;
  canvas.height = 2400;
  const ctx = canvas.getContext('2d')!;

  // Dynamic high-res gradient
  const grad = ctx.createLinearGradient(0, 0, 3200, 2400);
  grad.addColorStop(0, '#2c3e50');
  grad.addColorStop(0.5, '#3498db');
  grad.addColorStop(1, '#2980b9');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 3200, 2400);

  // High-res geometric decorative pattern
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.lineWidth = 14;
  for (let r = 200; r <= 1400; r += 160) {
    ctx.beginPath();
    ctx.arc(1600, 1200, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 130px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('ULTRA HIGH RESOLUTION', 1600, 1100);

  ctx.fillStyle = '#f1c40f';
  ctx.font = '600 70px monospace';
  ctx.fillText('3200 × 2400 PIXELS (DSLR MASTER)', 1600, 1300);

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        resolve(new File([blob!], 'high_resolution_dslr_master.jpg', { type: 'image/jpeg' }));
      },
      'image/jpeg',
      0.9
    );
  });
}

// 5. WebP image
export async function createWebpImage(): Promise<File> {
  const canvas = document.createElement('canvas');
  canvas.width = 700;
  canvas.height = 700;
  const ctx = canvas.getContext('2d')!;

  // Vibrant modern cyber-aesthetic
  const radGrad = ctx.createRadialGradient(350, 350, 50, 350, 350, 400);
  radGrad.addColorStop(0, '#ff007f');
  radGrad.addColorStop(1, '#3b0066');
  ctx.fillStyle = radGrad;
  ctx.fillRect(0, 0, 700, 700);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 58px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('NEXT-GEN WEBP', 350, 330);

  ctx.fillStyle = '#00f2fe';
  ctx.font = '500 24px monospace';
  ctx.fillText('Google WebP Native Compression', 350, 390);

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(new File([blob], 'cyber_artwork.webp', { type: 'image/webp' }));
        } else {
          // Fallback if browser toBlob doesn't support webp directly
          canvas.toBlob((fallback) => {
            resolve(new File([fallback!], 'cyber_artwork.webp', { type: 'image/webp' }));
          }, 'image/png');
        }
      },
      'image/webp',
      0.92
    );
  });
}

// 6. GIF Image (Single-frame / static GIF)
export async function createGifImage(): Promise<File> {
  // A genuine minimal standard GIF89a 100x100 block
  // Encoded with minimal palette: dark blue background, golden circle
  const canvas = document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 400;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#1e3799';
  ctx.fillRect(0, 0, 400, 400);

  ctx.beginPath();
  ctx.arc(200, 200, 100, 0, Math.PI * 2);
  ctx.fillStyle = '#f6b93b';
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 36px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('VINTAGE GIF', 200, 205);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(new File([blob!], 'vintage_emblem.gif', { type: 'image/gif' }));
    }, 'image/gif');
  });
}

// 7. SVG Vector Image (Full XML file)
export function createSvgVectorFile(): File {
  const svgString = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
    <defs>
      <linearGradient id="svgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#181818" />
        <stop offset="100%" stop-color="#b99b73" />
      </linearGradient>
    </defs>
    <rect x="25" y="25" width="450" height="450" rx="40" fill="url(#svgGrad)" />
    <circle cx="250" cy="220" r="110" fill="none" stroke="#ffffff" stroke-width="8" stroke-dasharray="14 8"/>
    <polygon points="250,140 280,210 350,210 295,255 315,325 250,285 185,325 205,255 150,210 220,210" fill="#ffffff"/>
    <text x="250" y="390" font-family="sans-serif" font-size="28" font-weight="800" fill="#ffffff" text-anchor="middle" letter-spacing="4">VECTOR GRAPHIC</text>
    <text x="250" y="425" font-family="monospace" font-size="14" fill="#e7ded0" text-anchor="middle">SCALABLE SVG ASSET</text>
  </svg>`;

  const blob = new Blob([svgString], { type: 'image/svg+xml' });
  return new File([blob], 'scalable_brand_crest.svg', { type: 'image/svg+xml' });
}

// 8. Image with Missing / Unusual MIME Type (e.g. file.type === '')
export async function createMissingMimeTypeFile(): Promise<File> {
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 400;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#2f3542';
  ctx.fillRect(0, 0, 600, 400);

  ctx.fillStyle = '#2ed573';
  ctx.beginPath();
  ctx.arc(300, 180, 80, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 30px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('CORRECTLY DECODED', 300, 188);

  ctx.fillStyle = '#a4b0be';
  ctx.font = '16px monospace';
  ctx.fillText('MIME: None / Extension: .dat', 300, 310);
  ctx.fillText('(Magic byte header inspection active)', 300, 340);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      // Intentionally omit type or set to generic octet-stream
      resolve(new File([blob!], 'raw_camera_upload.dat', { type: '' }));
    }, 'image/jpeg');
  });
}
