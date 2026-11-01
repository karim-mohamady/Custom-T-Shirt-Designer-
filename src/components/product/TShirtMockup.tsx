import React from 'react';
import { TShirtColor } from '../../types';

interface TShirtMockupProps {
  color: TShirtColor;
  showPrintAreaGuide?: boolean;
  children?: React.ReactNode;
}

export const TShirtMockup: React.FC<TShirtMockupProps> = ({
  color,
  showPrintAreaGuide = true,
  children,
}) => {
  // Realistic color palette shades for fabric layers and folds
  const colorMap: Record<
    string,
    {
      base: string;
      collar: string;
      shadow: string;
      highlight: string;
      stitch: string;
      name: string;
    }
  > = {
    Black: {
      base: '#1b1b1e',
      collar: '#141416',
      shadow: '#0d0d0f',
      highlight: '#2f2f35',
      stitch: '#333338',
      name: 'Washed Onyx',
    },
    'Washed Black': {
      base: '#1b1b1e',
      collar: '#141416',
      shadow: '#0d0d0f',
      highlight: '#2f2f35',
      stitch: '#333338',
      name: 'Washed Onyx',
    },
    White: {
      base: '#f6f6f3',
      collar: '#eae9e4',
      shadow: '#dcd9d2',
      highlight: '#ffffff',
      stitch: '#dcdad3',
      name: 'Raw Chalk',
    },
    Beige: {
      base: '#d7cbb8',
      collar: '#c6b9a4',
      shadow: '#b8a991',
      highlight: '#e7ded0',
      stitch: '#ab9b83',
      name: 'Desert Oat',
    },
    'Warm Sand': {
      base: '#d7cbb8',
      collar: '#c6b9a4',
      shadow: '#b8a991',
      highlight: '#e7ded0',
      stitch: '#ab9b83',
      name: 'Desert Oat',
    },
    Gray: {
      base: '#a0a4a9',
      collar: '#8d9197',
      shadow: '#7e8288',
      highlight: '#b7bac0',
      stitch: '#72767d',
      name: 'Heather Slate',
    },
    'Heather Grey': {
      base: '#a0a4a9',
      collar: '#8d9197',
      shadow: '#7e8288',
      highlight: '#b7bac0',
      stitch: '#72767d',
      name: 'Heather Slate',
    },
    'Forest Olive': {
      base: '#3a443a',
      collar: '#2d352d',
      shadow: '#222822',
      highlight: '#526052',
      stitch: '#2a322a',
      name: 'Forest Olive',
    },
  };

  const currentTheme = colorMap[color] || colorMap['Black'];

  return (
    <div className="relative w-full max-w-[540px] aspect-[540/630] mx-auto select-none flex items-center justify-center">
      {/* Premium backdrop floor shadow */}
      <div className="absolute bottom-6 w-[70%] h-8 bg-black/10 blur-xl rounded-full pointer-events-none" />

      {/* SVG Vector Mockup of Boxy Oversized Crewneck */}
      <svg
        viewBox="0 0 600 700"
        className="w-full h-full drop-shadow-md transition-colors duration-300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Subtle cotton texture pattern */}
          <pattern id="cotton-texture" width="6" height="6" patternUnits="userSpaceOnUse">
            <path d="M0 3 L3 0 L6 3 L3 6 Z" fill="rgba(0,0,0,0.015)" />
            <circle cx="3" cy="3" r="0.75" fill="rgba(255,255,255,0.02)" />
          </pattern>

          {/* Body gradient for realistic 3D volumetric apparel draping */}
          <linearGradient id="body-lighting" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={currentTheme.highlight} stopOpacity="0.4" />
            <stop offset="45%" stopColor={currentTheme.base} stopOpacity="0" />
            <stop offset="85%" stopColor={currentTheme.shadow} stopOpacity="0.3" />
          </linearGradient>

          {/* Sleeve drop shadow onto torso */}
          <linearGradient id="sleeve-shadow-left" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#000000" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="sleeve-shadow-right" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#000000" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </linearGradient>

          {/* Collar inner shadow */}
          <linearGradient id="collar-inner" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#000000" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Inner Back Neckline Fabric & Brand Label */}
        <path
          d="M245 88 C270 102 330 102 355 88 C345 74 255 74 245 88 Z"
          fill={currentTheme.collar}
        />
        <path
          d="M245 88 C270 102 330 102 355 88 C345 74 255 74 245 88 Z"
          fill="url(#collar-inner)"
        />
        {/* Subtle inner woven woven label */}
        <rect x="286" y="80" width="28" height="15" rx="1.5" fill="#181818" opacity="0.65" />
        <text
          x="300"
          y="90"
          fontSize="4.5"
          fontFamily="Space Grotesk, monospace"
          fill="#dcdcdc"
          textAnchor="middle"
          letterSpacing="0.8"
        >
          ATELIER
        </text>

        {/* T-Shirt Main Body & Sleeves Silhouette (Oversized Boxy Cut) */}
        <path
          d="M 230 92
             C 180 110 115 138 46 172
             C 38 176 34 186 38 194
             L 86 288
             C 90 295 100 297 107 292
             L 152 258
             C 152 280 151 450 150 635
             C 150 644 157 650 166 650
             L 434 650
             C 443 650 450 644 450 635
             C 449 450 448 280 448 258
             L 493 292
             C 500 297 510 295 514 288
             L 562 194
             C 566 186 562 176 554 172
             C 485 138 420 110 370 92
             C 348 135 252 135 230 92 Z"
          fill={currentTheme.base}
          stroke={currentTheme.shadow}
          strokeWidth="1.5"
        />

        {/* Fabric surface lighting & texture */}
        <path
          d="M 230 92
             C 180 110 115 138 46 172
             C 38 176 34 186 38 194
             L 86 288
             C 90 295 100 297 107 292
             L 152 258
             C 152 280 151 450 150 635
             C 150 644 157 650 166 650
             L 434 650
             C 443 650 450 644 450 635
             C 449 450 448 280 448 258
             L 493 292
             C 500 297 510 295 514 288
             L 562 194
             C 566 186 562 176 554 172
             C 485 138 420 110 370 92
             C 348 135 252 135 230 92 Z"
          fill="url(#body-lighting)"
        />
        <path
          d="M 230 92
             C 180 110 115 138 46 172
             C 38 176 34 186 38 194
             L 86 288
             C 90 295 100 297 107 292
             L 152 258
             C 152 280 151 450 150 635
             C 150 644 157 650 166 650
             L 434 650
             C 443 650 450 644 450 635
             C 449 450 448 280 448 258
             L 493 292
             C 500 297 510 295 514 288
             L 562 194
             C 566 186 562 176 554 172
             C 485 138 420 110 370 92
             C 348 135 252 135 230 92 Z"
          fill="url(#cotton-texture)"
        />

        {/* Dropped Shoulder Seams (Hallmark of Oversized Silhouettes) */}
        <path
          d="M 175 125 L 140 230"
          stroke={currentTheme.stitch}
          strokeWidth="1.2"
          strokeDasharray="2 1.5"
          opacity="0.7"
        />
        <path
          d="M 425 125 L 460 230"
          stroke={currentTheme.stitch}
          strokeWidth="1.2"
          strokeDasharray="2 1.5"
          opacity="0.7"
        />

        {/* Armpit Underarm Seams & Depth Shadows */}
        <path
          d="M 152 258 C 158 275 162 315 160 340"
          stroke={currentTheme.shadow}
          strokeWidth="1.5"
          opacity="0.45"
        />
        <path
          d="M 448 258 C 442 275 438 315 440 340"
          stroke={currentTheme.shadow}
          strokeWidth="1.5"
          opacity="0.45"
        />

        {/* Natural Fabric Creases and Flow Drapes */}
        <path
          d="M 160 290 Q 185 360 178 440"
          stroke={currentTheme.shadow}
          strokeWidth="1.5"
          opacity="0.25"
          fill="none"
        />
        <path
          d="M 440 290 Q 415 360 422 440"
          stroke={currentTheme.shadow}
          strokeWidth="1.5"
          opacity="0.25"
          fill="none"
        />
        <path
          d="M 170 540 Q 210 580 250 560"
          stroke={currentTheme.shadow}
          strokeWidth="1"
          opacity="0.2"
          fill="none"
        />
        <path
          d="M 430 540 Q 390 580 350 560"
          stroke={currentTheme.shadow}
          strokeWidth="1"
          opacity="0.2"
          fill="none"
        />

        {/* Bottom Hemline Double Stitching */}
        <line
          x1="156"
          y1="634"
          x2="444"
          y2="634"
          stroke={currentTheme.stitch}
          strokeWidth="1"
          strokeDasharray="3 1.5"
          opacity="0.6"
        />
        <line
          x1="156"
          y1="638"
          x2="444"
          y2="638"
          stroke={currentTheme.stitch}
          strokeWidth="1"
          strokeDasharray="3 1.5"
          opacity="0.6"
        />

        {/* Sleeve Hems Double Stitching */}
        <path
          d="M 75 272 L 140 242"
          stroke={currentTheme.stitch}
          strokeWidth="1"
          strokeDasharray="2.5 1.5"
          opacity="0.6"
        />
        <path
          d="M 525 272 L 460 242"
          stroke={currentTheme.stitch}
          strokeWidth="1"
          strokeDasharray="2.5 1.5"
          opacity="0.6"
        />

        {/* Ribbed Crewneck Collar Front Band */}
        <path
          d="M 230 92 C 255 138 345 138 370 92 C 352 118 248 118 230 92 Z"
          fill={currentTheme.collar}
          stroke={currentTheme.shadow}
          strokeWidth="1"
        />
        {/* Collar ribbing lines */}
        <path
          d="M 236 96 C 258 132 342 132 364 96"
          stroke={currentTheme.stitch}
          strokeWidth="0.8"
          strokeDasharray="1.5 1"
          opacity="0.75"
          fill="none"
        />
        <path
          d="M 242 102 C 262 128 338 128 358 102"
          stroke={currentTheme.stitch}
          strokeWidth="0.8"
          strokeDasharray="1.5 1"
          opacity="0.5"
          fill="none"
        />
      </svg>

      {/* Interactive Printable Area Overlay Container */}
      {/* Positioned exactly in the chest center: 600x700 svg, chest center is at x: 165..435 (width 270), y: 175..525 (height 350) */}
      <div
        className="absolute z-10 flex items-center justify-center pointer-events-auto"
        style={{
          width: '45%', // ~270 / 600
          height: '50%', // ~350 / 700
          top: '25%', // ~175 / 700
          left: '27.5%', // ~165 / 600
        }}
      >
        {/* Subtle Printable Area Boundary Guide */}
        {showPrintAreaGuide && (
          <div className="absolute inset-0 border border-dashed border-neutral-400/50 rounded-sm pointer-events-none transition-opacity">
            <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] uppercase tracking-wider font-mono text-neutral-500 bg-white/80 px-1.5 py-0.5 rounded shadow-xs backdrop-blur-xs select-none">
              Print Area (30 × 38 cm)
            </span>
          </div>
        )}

        {/* Children: The Fabric.js Canvas Mount */}
        <div className="w-full h-full relative overflow-visible flex items-center justify-center">
          {children}
        </div>
      </div>
    </div>
  );
};
