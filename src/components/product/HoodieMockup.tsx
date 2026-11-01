import React from 'react';

interface HoodieMockupProps {
  colorHex: string;
  colorName: string;
  showPrintAreaGuide?: boolean;
  children?: React.ReactNode;
}

export const HoodieMockup: React.FC<HoodieMockupProps> = ({
  colorHex,
  showPrintAreaGuide = true,
  children,
}) => {
  // Derive tonal highlight and shadow based on hex
  const isDark = colorHex === '#19191b' || colorHex === '#1b1b1e';
  const isWhite = colorHex === '#f5f5f2' || colorHex === '#f6f6f3';
  const shadowColor = isDark ? '#0b0b0d' : isWhite ? '#d8d5cb' : 'rgba(0,0,0,0.22)';
  const highlightColor = isDark ? '#333339' : '#ffffff';
  const ribColor = isDark ? '#141416' : isWhite ? '#e8e6de' : 'rgba(0,0,0,0.1)';

  return (
    <div className="relative w-full max-w-[540px] aspect-[540/630] mx-auto select-none flex items-center justify-center">
      {/* Floor Shadow */}
      <div className="absolute bottom-4 w-[75%] h-8 bg-black/10 blur-xl rounded-full pointer-events-none" />

      {/* SVG Vector Mockup of Heavyweight Boxy Hoodie */}
      <svg
        viewBox="0 0 600 700"
        className="w-full h-full drop-shadow-md transition-colors duration-300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="hoodie-lighting" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={highlightColor} stopOpacity="0.35" />
            <stop offset="45%" stopColor={colorHex} stopOpacity="0" />
            <stop offset="90%" stopColor={shadowColor} stopOpacity="0.3" />
          </linearGradient>

          <linearGradient id="hood-inner-shadow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#000000" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.1" />
          </linearGradient>

          {/* Subtle fleece texture pattern */}
          <pattern id="fleece-texture" width="5" height="5" patternUnits="userSpaceOnUse">
            <rect width="5" height="5" fill="none" />
            <circle cx="2.5" cy="2.5" r="0.8" fill="rgba(0,0,0,0.02)" />
          </pattern>
        </defs>

        {/* 1. Hood Inner Depth */}
        <path
          d="M 235 110 C 235 40 365 40 365 110 C 345 130 255 130 235 110 Z"
          fill="#111113"
          opacity="0.85"
        />
        <path
          d="M 235 110 C 235 40 365 40 365 110 C 345 130 255 130 235 110 Z"
          fill="url(#hood-inner-shadow)"
        />

        {/* Woven Atelier Label inside neck */}
        <rect x="286" y="90" width="28" height="15" rx="1.5" fill="#181818" opacity="0.8" />
        <text
          x="300"
          y="100"
          fontSize="4.5"
          fontFamily="Space Grotesk, monospace"
          fill="#e0e0e0"
          textAnchor="middle"
          letterSpacing="0.8"
        >
          ATELIER
        </text>

        {/* 2. Main Hoodie Body & Sleeves (Heavyweight Boxy Silhouette) */}
        <path
          d="M 230 115
             C 175 132 110 155 42 190
             C 34 194 30 204 35 212
             L 86 312
             C 90 318 99 320 106 315
             L 148 278
             C 148 310 146 470 145 615
             C 145 625 152 632 162 632
             L 438 632
             C 448 632 455 625 455 615
             C 454 470 452 310 452 278
             L 494 315
             C 501 320 510 318 514 312
             L 565 212
             C 570 204 566 194 558 190
             C 490 155 425 132 370 115
             C 350 148 250 148 230 115 Z"
          fill={colorHex}
          stroke={shadowColor}
          strokeWidth="1.5"
        />

        {/* Surface lighting overlay */}
        <path
          d="M 230 115
             C 175 132 110 155 42 190
             C 34 194 30 204 35 212
             L 86 312
             C 90 318 99 320 106 315
             L 148 278
             C 148 310 146 470 145 615
             C 145 625 152 632 162 632
             L 438 632
             C 448 632 455 625 455 615
             C 454 470 452 310 452 278
             L 494 315
             C 501 320 510 318 514 312
             L 565 212
             C 570 204 566 194 558 190
             C 490 155 425 132 370 115
             C 350 148 250 148 230 115 Z"
          fill="url(#hoodie-lighting)"
        />

        <path
          d="M 230 115
             C 175 132 110 155 42 190
             C 34 194 30 204 35 212
             L 86 312
             C 90 318 99 320 106 315
             L 148 278
             C 148 310 146 470 145 615
             C 145 625 152 632 162 632
             L 438 632
             C 448 632 455 625 455 615
             C 454 470 452 310 452 278
             L 494 315
             C 501 320 510 318 514 312
             L 565 212
             C 570 204 566 194 558 190
             C 490 155 425 132 370 115
             C 350 148 250 148 230 115 Z"
          fill="url(#fleece-texture)"
        />

        {/* 3. Double-Layered Structured Hood (Crossover) */}
        <path
          d="M 215 125
             C 210 50 250 25 300 25
             C 350 25 390 50 385 125
             C 370 150 345 155 300 155
             C 255 155 230 150 215 125 Z"
          fill={colorHex}
          stroke={shadowColor}
          strokeWidth="1.5"
        />
        <path
          d="M 215 125
             C 210 50 250 25 300 25
             C 350 25 390 50 385 125
             C 370 150 345 155 300 155
             C 255 155 230 150 215 125 Z"
          fill="url(#hoodie-lighting)"
        />

        {/* Hood crossover center stitch */}
        <path
          d="M 285 140 L 300 155 L 315 140"
          stroke={shadowColor}
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M 255 70 C 275 45 325 45 345 70"
          stroke={highlightColor}
          strokeWidth="1"
          strokeDasharray="3 2"
          opacity="0.4"
          fill="none"
        />

        {/* 4. Kangaroo Pouch Front Pocket */}
        <path
          d="M 195 480
             L 225 440
             L 375 440
             L 405 480
             L 405 605
             L 195 605 Z"
          fill={colorHex}
          stroke={shadowColor}
          strokeWidth="1.5"
        />
        <path
          d="M 195 480
             L 225 440
             L 375 440
             L 405 480
             L 405 605
             L 195 605 Z"
          fill="url(#hoodie-lighting)"
        />
        {/* Kangaroo pocket entry slant top stitches */}
        <line
          x1="198"
          y1="482"
          x2="226"
          y2="444"
          stroke={shadowColor}
          strokeWidth="1.5"
          strokeDasharray="2.5 1.5"
          opacity="0.65"
        />
        <line
          x1="402"
          y1="482"
          x2="374"
          y2="444"
          stroke={shadowColor}
          strokeWidth="1.5"
          strokeDasharray="2.5 1.5"
          opacity="0.65"
        />
        <line
          x1="228"
          y1="442"
          x2="372"
          y2="442"
          stroke={shadowColor}
          strokeWidth="1.2"
          strokeDasharray="3 1.5"
          opacity="0.65"
        />

        {/* 5. Heavy Ribbed Hem & Wrist Cuffs */}
        {/* Bottom Waistband Rib */}
        <rect
          x="148"
          y="608"
          width="304"
          height="24"
          rx="2"
          fill={colorHex}
          stroke={shadowColor}
          strokeWidth="1"
        />
        <line
          x1="148"
          y1="616"
          x2="452"
          y2="616"
          stroke={ribColor}
          strokeWidth="1"
          strokeDasharray="2 2"
        />

        {/* Sleeve Cuffs */}
        <path
          d="M 75 295 L 138 265"
          stroke={shadowColor}
          strokeWidth="1.2"
          strokeDasharray="3 1.5"
          opacity="0.6"
        />
        <path
          d="M 525 295 L 462 265"
          stroke={shadowColor}
          strokeWidth="1.2"
          strokeDasharray="3 1.5"
          opacity="0.6"
        />

        {/* Dropped Shoulder Seams */}
        <path
          d="M 180 140 L 140 250"
          stroke={shadowColor}
          strokeWidth="1.2"
          strokeDasharray="3 1.5"
          opacity="0.5"
        />
        <path
          d="M 420 140 L 460 250"
          stroke={shadowColor}
          strokeWidth="1.2"
          strokeDasharray="3 1.5"
          opacity="0.5"
        />
      </svg>

      {/* Interactive Chest Print Area Overlay (Above Kangaroo Pocket) */}
      <div
        className="absolute z-10 flex items-center justify-center pointer-events-auto"
        style={{
          width: '45%', // ~270 / 600
          height: '42%', // ~294 / 700
          top: '22%', // ~154 / 700
          left: '27.5%', // ~165 / 600
        }}
      >
        {showPrintAreaGuide && (
          <div className="absolute inset-0 border border-dashed border-neutral-400/50 rounded-sm pointer-events-none transition-opacity">
            <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] uppercase tracking-wider font-mono text-neutral-500 bg-white/80 px-1.5 py-0.5 rounded shadow-xs backdrop-blur-xs select-none">
              Chest Print Area (28 × 30 cm)
            </span>
          </div>
        )}

        <div className="w-full h-full relative overflow-visible flex items-center justify-center">
          {children}
        </div>
      </div>
    </div>
  );
};
