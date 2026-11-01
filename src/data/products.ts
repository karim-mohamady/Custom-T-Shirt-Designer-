import { ProductItem } from '../types';

export const PRODUCTS: ProductItem[] = [
  {
    id: 'tshirt-oversized-01',
    name: 'Essential Premium Oversized T-Shirt',
    subtitle: '240 GSM Luxury Ring-Spun Cotton',
    price: 35,
    currency: 'USD',
    category: 'T-Shirts & Tops',
    garmentType: 'tshirt',
    badge: 'Best Seller',
    shortDescription:
      'A relaxed, boxy cut tee crafted from 240 GSM heavyweight combed cotton with reinforced crew neckline and dropped shoulders.',
    description:
      'Designed for everyday comfort, our Essential Premium Oversized T-Shirt is crafted from high-quality cotton with a relaxed silhouette and a soft, durable finish. Make it uniquely yours by uploading your own artwork and creating a personalized design.',
    printAreaLabel: 'Front Chest (30 × 38 cm)',
    colors: [
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
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    specifications: [
      { label: 'Material', value: '100% Premium Cotton' },
      { label: 'Fit', value: 'Oversized / Unisex' },
      { label: 'Neckline', value: 'Classic Crew Neck' },
      { label: 'Fabric Weight', value: '240 GSM Heavyweight' },
      { label: 'Print Area', value: 'Front Center (30 × 38 cm max)' },
      { label: 'Customization', value: 'Customer-uploaded artwork & typography' },
    ],
    features: [
      {
        title: 'Pre-Shrunk 240 GSM Weave',
        description: 'Tightly woven ring-spun yarn ensures zero shrink and enduring structural drape.',
      },
      {
        title: 'Dropped Boxy Shoulders',
        description: 'Engineered silhouette with wider chest and sleeve circumference for contemporary street fit.',
      },
      {
        title: 'Silk-Touch Ribbed Collar',
        description: 'Double-needle lockstitch neckline maintains its crisp circular form wash after wash.',
      },
    ],
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
  },
  {
    id: 'hoodie-boxy-02',
    name: 'Signature Heavyweight Boxy Hoodie',
    subtitle: '460 GSM Double-Faced Cotton Fleece',
    price: 55,
    currency: 'USD',
    category: 'Hoodies & Fleece',
    garmentType: 'hoodie',
    badge: 'New Silhouette',
    shortDescription:
      'Ultra-dense 460 GSM brushed fleece hoodie with a double-layered crossover hood, dropped shoulders, and seamless kangaroo pocket.',
    description:
      'Crafted for premium streetwear drape, our Signature Heavyweight Boxy Hoodie combines substantial 460 GSM brushed fleece with a structured hood and clean kangaroo pocket. Make it uniquely yours with personalized chest artwork.',
    printAreaLabel: 'Chest Center (28 × 30 cm)',
    colors: [
      {
        id: 'Black',
        name: 'Washed Onyx',
        hex: '#19191b',
        textColor: '#ffffff',
        bgRgb: '25, 25, 27',
      },
      {
        id: 'Gray',
        name: 'Heather Slate',
        hex: '#9ea2a7',
        textColor: '#181818',
        bgRgb: '158, 162, 167',
      },
      {
        id: 'Beige',
        name: 'Desert Oat',
        hex: '#d6caba',
        textColor: '#181818',
        bgRgb: '214, 202, 186',
      },
      {
        id: 'White',
        name: 'Raw Chalk',
        hex: '#f5f5f2',
        textColor: '#181818',
        bgRgb: '245, 245, 242',
      },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    specifications: [
      { label: 'Material', value: '100% Combed Cotton Fleece' },
      { label: 'Fit', value: 'Boxy / Heavy Oversized' },
      { label: 'Hood', value: 'Double-Layered Structured Hood' },
      { label: 'Fabric Weight', value: '460 GSM Ultra Heavyweight' },
      { label: 'Print Area', value: 'Front Chest Center (28 × 30 cm)' },
      { label: 'Pockets', value: 'Seamless Kangaroo Front Pouch' },
    ],
    features: [
      {
        title: '460 GSM Brushed French Fleece',
        description: 'Dense heavyweight thermal cotton with super-soft interior brushing for unmatched warmth and substance.',
      },
      {
        title: 'Double-Layered Self Hood',
        description: 'Structured crossover hood that stands proudly without drawstrings for clean minimalist styling.',
      },
      {
        title: 'Heavyweight Ribbed Trim',
        description: 'Durable 2x2 elastane-reinforced ribbing at wrists and hem for locked-in shape retention.',
      },
    ],
    fabricDetails:
      'Engineered from 100% combed cotton fleece (460 GSM). Features loop-back knitting for maximum breathability while retaining high thermal insulation and heavyweight volume.',
    fitDetails:
      'Boxy torso cut with exaggerated dropped armholes and ribbed hem. Sits just below the belt line for contemporary streetwear proportions. Fits true to boxy oversized.',
    careInstructions: [
      'Machine wash cold gentle cycle inside-out',
      'Wash with similar heavy textiles',
      'Reshape while damp and dry flat in the shade',
      'Do not iron directly over printed graphic area',
      'Do not tumble dry on high heat',
    ],
  },
];

export function getProductById(id: string): ProductItem | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function getDefaultProduct(): ProductItem {
  return PRODUCTS[0];
}
