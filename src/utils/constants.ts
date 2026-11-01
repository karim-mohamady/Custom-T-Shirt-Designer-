import { ProductColorOption, TShirtColor, TShirtSize, ProductSpecification } from '../types';

export const PRODUCT_INFO = {
  name: 'Essential Premium Oversized T-Shirt',
  price: 35,
  currency: 'USD',
  description:
    'Designed for everyday comfort, our Essential Premium Oversized T-Shirt is crafted from high-quality cotton with a relaxed silhouette and a soft, durable finish. Make it uniquely yours by uploading your own artwork and creating a personalized design.',
  specifications: [
    { label: 'Material', value: '100% Premium Cotton' },
    { label: 'Fit', value: 'Oversized / Unisex' },
    { label: 'Neckline', value: 'Classic Crew Neck' },
    { label: 'Fabric Weight', value: '240 GSM Heavyweight' },
    { label: 'Print Area', value: 'Front Center (30 × 38 cm max)' },
    { label: 'Customization', value: 'Customer-uploaded artwork & typography' },
  ] as ProductSpecification[],
  fabricDetails:
    'Sourced from 100% ring-spun combed cotton. Pre-shrunk and silicon-washed for zero shrinkage and ultra-smooth tactile handfeel. 240 GSM heavy drape keeps structural integrity all day.',
  fitDetails:
    'Dropped shoulders with wide, boxy sleeves and an elongated relaxed torso. Designed to fit generously true-to-oversized. For a standard fit, order one size smaller.',
  careInstructions: [
    'Machine wash cold inside-out with like colors',
    'Do not bleach or use heavy industrial softeners',
    'Tumble dry low or line dry in the shade to preserve custom print integrity',
    'Warm iron inside-out; do not iron directly over printed artwork',
    'Do not dry clean',
  ],
};

export const COLOR_OPTIONS: ProductColorOption[] = [
  {
    id: 'Black',
    name: 'Washed Onyx',
    hex: '#19191b',
    textColor: '#ffffff',
    bgRgb: '25, 25, 27',
  },
  {
    id: 'White',
    name: 'Raw Chalk',
    hex: '#f5f5f2',
    textColor: '#181818',
    bgRgb: '245, 245, 242',
  },
  {
    id: 'Beige',
    name: 'Desert Oat',
    hex: '#d6caba',
    textColor: '#181818',
    bgRgb: '214, 202, 186',
  },
  {
    id: 'Gray',
    name: 'Heather Slate',
    hex: '#9ea2a7',
    textColor: '#181818',
    bgRgb: '158, 162, 167',
  },
];

export const SIZE_OPTIONS: TShirtSize[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

// Dimensions of the interactive printable chest area on the canvas
export const PRINT_AREA_CONFIG = {
  width: 270,
  height: 350,
  maxUploadSizeBytes: 50 * 1024 * 1024, // 50 MB (accommodates high-res DSLR and mobile camera photos)
  allowedExtensions: ['png', 'jpg', 'jpeg', 'webp', 'gif', 'bmp', 'svg', 'heic', 'heif'],
  allowedMimeTypes: [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp',
    'image/gif',
    'image/bmp',
    'image/svg+xml',
    'image/heic',
    'image/heif',
    'image/x-png',
    'image/pjpeg',
    'image/x-ms-bmp',
  ],
};

// Preset sample graphics for quick client testing
export const SAMPLE_PRESET_ARTWORKS = [
  {
    name: 'Tokyo Atelier Icon',
    category: 'Minimalist',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
      <circle cx="100" cy="100" r="75" fill="none" stroke="#b99b73" stroke-width="4" stroke-dasharray="8 4"/>
      <circle cx="100" cy="100" r="45" fill="#b99b73"/>
      <text x="100" y="107" font-family="sans-serif" font-size="20" font-weight="900" fill="#ffffff" text-anchor="middle">ATELIER</text>
      <text x="100" y="185" font-family="monospace" font-size="9" fill="#888888" letter-spacing="4" text-anchor="middle">EDITION 2026</text>
    </svg>`,
  },
  {
    name: 'Streetwear Botanical',
    category: 'Graphic',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 220" width="220" height="220">
      <rect x="25" y="25" width="170" height="170" rx="16" fill="#181818"/>
      <path d="M110 50 C90 80 70 120 110 160 C150 120 130 80 110 50 Z" fill="#b99b73"/>
      <circle cx="110" cy="105" r="14" fill="#ffffff"/>
      <text x="110" y="180" font-family="sans-serif" font-size="10" font-weight="700" fill="#ffffff" letter-spacing="3" text-anchor="middle">ORIGINAL FLORA</text>
    </svg>`,
  },
  {
    name: 'Typography Emblem',
    category: 'Typography',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 180" width="220" height="180">
      <text x="110" y="70" font-family="sans-serif" font-size="34" font-weight="900" fill="#111111" letter-spacing="6" text-anchor="middle">PURSUIT</text>
      <line x1="40" y1="88" x2="180" y2="88" stroke="#b99b73" stroke-width="3"/>
      <text x="110" y="112" font-family="serif" font-style="italic" font-size="14" fill="#555555" text-anchor="middle">Authentic Heavyweight Goods</text>
      <text x="110" y="140" font-family="monospace" font-size="10" font-weight="600" fill="#888888" letter-spacing="4" text-anchor="middle">EST. MMXXVI</text>
    </svg>`,
  },
];

export const FONT_OPTIONS = [
  { label: 'DM Sans (Clean)', value: 'DM Sans' },
  { label: 'Playfair (Editorial)', value: 'Playfair Display' },
  { label: 'Space Grotesk (Tech)', value: 'Space Grotesk' },
  { label: 'Impact (Bold)', value: 'Impact' },
  { label: 'Courier (Vintage)', value: 'Courier New' },
  { label: 'Georgia (Classic)', value: 'Georgia' },
];

export const PALETTE_COLORS = [
  '#FFFFFF',
  '#181818',
  '#B99B73',
  '#E63946',
  '#2A9D8F',
  '#457B9D',
  '#E76F51',
  '#D4A373',
  '#7F4F24',
  '#588157',
  '#3A0CA3',
  '#F4A261',
];
