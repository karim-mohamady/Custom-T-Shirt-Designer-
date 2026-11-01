import React from 'react';
import { ProductItem, TShirtColor } from '../../types';
import { TShirtMockup } from './TShirtMockup';
import { HoodieMockup } from './HoodieMockup';

interface ProductMockupProps {
  product: ProductItem;
  selectedColorId: string;
  showPrintAreaGuide?: boolean;
  children?: React.ReactNode;
}

export const ProductMockup: React.FC<ProductMockupProps> = ({
  product,
  selectedColorId,
  showPrintAreaGuide = true,
  children,
}) => {
  const activeColor = product.colors.find((c) => c.id === selectedColorId) || product.colors[0];

  if (product.garmentType === 'hoodie') {
    return (
      <HoodieMockup
        colorHex={activeColor.hex}
        colorName={activeColor.name}
        showPrintAreaGuide={showPrintAreaGuide}
      >
        {children}
      </HoodieMockup>
    );
  }

  // Fallback / default to TShirtMockup
  return (
    <TShirtMockup
      color={activeColor.id as TShirtColor}
      showPrintAreaGuide={showPrintAreaGuide}
    >
      {children}
    </TShirtMockup>
  );
};
