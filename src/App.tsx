import React, { useState, useEffect } from 'react';
import { HomePage } from './pages/HomePage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { CustomizationPage } from './pages/CustomizationPage';
import { OrdersPage } from './pages/OrdersPage';
import { PRODUCTS, getProductById } from './data/products';
import { ProductItem } from './types';
import { loadOrders } from './services/storageService';
import { Sparkles, ShoppingBag, Store, Scissors } from 'lucide-react';

type PageRoute = 'home' | 'product-details' | 'customize' | 'orders';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageRoute>('home');
  const [selectedProduct, setSelectedProduct] = useState<ProductItem>(PRODUCTS[0]);
  const [preselectedColorId, setPreselectedColorId] = useState<string | undefined>(undefined);
  const [orderCount, setOrderCount] = useState<number>(0);

  // Update order count for header badge
  const updateOrderCount = () => {
    const list = loadOrders();
    setOrderCount(list.length);
  };

  useEffect(() => {
    updateOrderCount();
  }, [currentPage]);

  // Navigate to Product Details
  const handleSelectProduct = (product: ProductItem) => {
    setSelectedProduct(product);
    setPreselectedColorId(undefined);
    setCurrentPage('product-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navigate to Customization Page
  const handleStartCustomizing = (product: ProductItem, colorId?: string) => {
    setSelectedProduct(product);
    setPreselectedColorId(colorId);
    setCurrentPage('customize');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#181818] flex flex-col font-sans selection:bg-[#B99B73]/20 selection:text-[#181818]">
      {/* Minimal Top Brand Bar & Simple Navigation Switcher */}
      <header className="w-full bg-[#FAF9F5] border-b border-[#E8E6E1] sticky top-0 z-40 backdrop-blur-md bg-opacity-95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Mark */}
          <div
            onClick={() => {
              setCurrentPage('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 bg-[#181818] text-white flex items-center justify-center font-bold text-xs rounded-lg group-hover:bg-[#B99B73] transition-colors">
              A
            </div>
            <div>
              <span className="font-display font-bold text-lg tracking-widest text-[#181818]">
                ATELIER
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#888888] ml-2 hidden sm:inline-block">
                Studio
              </span>
            </div>
          </div>

          {/* Simple Navigation Links */}
          <div className="flex items-center gap-1.5 p-1 bg-[#EAE8E2] rounded-xl">
            {/* Storefront Home */}
            <button
              type="button"
              onClick={() => {
                setCurrentPage('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                currentPage === 'home'
                  ? 'bg-white text-[#181818] shadow-xs'
                  : 'text-[#666666] hover:text-[#181818]'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Store</span>
            </button>

            {/* Customizer Studio */}
            <button
              type="button"
              onClick={() => {
                setCurrentPage('customize');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                currentPage === 'customize'
                  ? 'bg-white text-[#181818] shadow-xs'
                  : 'text-[#666666] hover:text-[#181818]'
              }`}
            >
              <Scissors className="w-3.5 h-3.5 text-[#B99B73]" />
              <span>Studio</span>
            </button>

            {/* Orders */}
            <button
              type="button"
              onClick={() => {
                setCurrentPage('orders');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                currentPage === 'orders'
                  ? 'bg-white text-[#181818] shadow-xs'
                  : 'text-[#666666] hover:text-[#181818]'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Orders</span>
              {orderCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-[#181818] text-white text-[10px] font-mono rounded-full">
                  {orderCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Router */}
      <main className="flex-1 w-full pb-16">
        {currentPage === 'home' && (
          <HomePage
            onSelectProduct={handleSelectProduct}
            onCustomizeProduct={(product) => handleStartCustomizing(product)}
          />
        )}

        {currentPage === 'product-details' && (
          <ProductDetailsPage
            product={selectedProduct}
            onBackToHome={() => setCurrentPage('home')}
            onCustomize={(product, colorId) => handleStartCustomizing(product, colorId)}
          />
        )}

        {currentPage === 'customize' && (
          <CustomizationPage
            product={selectedProduct}
            initialColorId={preselectedColorId}
            onBackToDetails={() => setCurrentPage('product-details')}
            onNavigateToOrders={() => {
              setCurrentPage('orders');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentPage === 'orders' && (
          <OrdersPage
            onNavigateToHome={() => {
              setCurrentPage('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateToCustomize={() => {
              setCurrentPage('customize');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>
    </div>
  );
}
