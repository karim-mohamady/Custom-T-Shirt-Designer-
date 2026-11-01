import React from 'react';
import { CustomizationPage } from './CustomizationPage';
import { PRODUCTS } from '../data/products';

interface ProductPageProps {
  onNavigateToOrders: () => void;
}

export const ProductPage: React.FC<ProductPageProps> = ({ onNavigateToOrders }) => {
  return (
    <CustomizationPage
      product={PRODUCTS[0]}
      onBackToDetails={() => onNavigateToOrders()}
      onNavigateToOrders={onNavigateToOrders}
    />
  );
};
