export type TShirtColor = 'Black' | 'White' | 'Beige' | 'Gray' | 'Washed Black' | 'Heather Grey' | 'Warm Sand' | 'Forest Olive';

export type TShirtSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';

export type OrderStatus =
  | 'Pending Review'
  | 'Approved'
  | 'Rejected'
  | 'Printing'
  | 'Completed';

export const ORDER_STATUS_LIST: OrderStatus[] = [
  'Pending Review',
  'Approved',
  'Rejected',
  'Printing',
  'Completed',
];

export const EGYPTIAN_GOVERNORATES = [
  'Cairo',
  'Giza',
  'Alexandria',
  'Qalyubia',
  'Sharqia',
  'Dakahlia',
  'Gharbia',
  'Monufia',
  'Beheira',
  'Kafr El Sheikh',
  'Damietta',
  'Port Said',
  'Ismailia',
  'Suez',
  'North Sinai',
  'South Sinai',
  'Beni Suef',
  'Fayoum',
  'Minya',
  'Assiut',
  'Sohag',
  'Qena',
  'Luxor',
  'Aswan',
  'Red Sea',
  'New Valley',
  'Matrouh',
] as const;

export type EgyptianGovernorate = (typeof EGYPTIAN_GOVERNORATES)[number];

export interface CustomerInfo {
  fullName: string;
  address: string;
  governorate: EgyptianGovernorate | '';
  phoneNumber: string;
}

export interface ProductColorOption {
  id: string;
  name: string;
  hex: string;
  textColor: string;
  bgRgb: string;
}

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface ProductFeature {
  title: string;
  description: string;
}

export interface ProductItem {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  currency: string;
  shortDescription: string;
  description: string;
  category: string;
  garmentType: 'tshirt' | 'hoodie';
  badge?: string;
  colors: ProductColorOption[];
  sizes: TShirtSize[];
  specifications: ProductSpecification[];
  features: ProductFeature[];
  fabricDetails: string;
  fitDetails: string;
  careInstructions: string[];
  printAreaLabel: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  color: string;
  size: TShirtSize;
  quantity: number;
  price: number;
  createdAt: string;
  status: OrderStatus;
  hasCustomDesign: boolean;
  elementCount: number;
  customer?: CustomerInfo;
  // Local storage references and image URLs
  previewImageId: string;
  printArtworkId: string;
  // In-memory or restored data URLs for fast rendering
  previewDataUrl?: string;
  printArtworkDataUrl?: string;
  canvasJson?: string;
}

export interface StoredCurrentDesign {
  productId: string;
  color: string;
  size: TShirtSize;
  canvasJson: string;
  updatedAt: string;
  hasCustomDesign: boolean;
}
