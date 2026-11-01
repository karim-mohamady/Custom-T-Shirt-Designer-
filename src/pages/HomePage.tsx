import React from 'react';
import { PRODUCTS } from '../data/products';
import { ProductItem } from '../types';
import { ProductMockup } from '../components/product/ProductMockup';
import { Sparkles, ArrowRight, ShieldCheck, Scissors } from 'lucide-react';

interface HomePageProps {
  onSelectProduct: (product: ProductItem) => void;
  onCustomizeProduct: (product: ProductItem) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onSelectProduct,
  onCustomizeProduct,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in">
      {/* Editorial Hero Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#EAE8E2] rounded-full text-xs font-mono uppercase tracking-widest text-[#181818] mb-4">
          <Sparkles className="w-3.5 h-3.5 text-[#B99B73]" />
          <span>Atelier Made-to-Order Studio</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-medium text-[#181818] tracking-tight leading-tight">
          Heavyweight Streetwear, <br />
          Customized by You.
        </h1>
        <p className="mt-4 text-xs sm:text-sm text-[#666666] leading-relaxed max-w-xl mx-auto">
          Select our luxury oversized silhouettes, upload your custom artwork or typography, and send your direct print order to our atelier via WhatsApp.
        </p>
      </div>

      {/* Products Section — Exactly Two Products */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-8 pb-3 border-b border-[#E8E6E1]">
          <div>
            <h2 className="text-xs uppercase tracking-widest font-semibold text-[#181818]">
              Signature Silhouettes (2)
            </h2>
            <p className="text-[11px] text-[#777777] mt-0.5">
              Select a piece to view specifications or begin interactive design
            </p>
          </div>
          <span className="text-xs font-mono text-[#888888]">Edition 2026</span>
        </div>

        {/* 2-Column Responsive Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {PRODUCTS.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-[#E8E6E1] hover:border-[#D6D3CA] rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-md group"
            >
              <div>
                {/* Product Card Top Badges & Price */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  {product.badge && (
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#B99B73] font-semibold bg-[#B99B73]/10 px-2.5 py-0.5 rounded-full">
                      {product.badge}
                    </span>
                  )}
                  <span className="text-xl font-bold text-[#181818] font-sans ml-auto">
                    ${product.price} <span className="text-xs font-normal text-[#888888]">USD</span>
                  </span>
                </div>

                {/* Garment Mockup Showcase */}
                <div
                  onClick={() => onSelectProduct(product)}
                  className="relative aspect-[540/500] w-full max-w-[420px] mx-auto bg-[#FAF9F5] rounded-2xl overflow-hidden cursor-pointer flex items-center justify-center p-4 border border-[#F0EFEA] group-hover:scale-102 transition-transform duration-300"
                >
                  <ProductMockup
                    product={product}
                    selectedColorId={product.colors[0].id}
                    showPrintAreaGuide={false}
                  />
                </div>

                {/* Info Block */}
                <div className="mt-6 space-y-2.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#888888]">
                    {product.subtitle}
                  </span>
                  <h3
                    onClick={() => onSelectProduct(product)}
                    className="text-xl font-semibold text-[#181818] hover:text-[#B99B73] transition-colors cursor-pointer tracking-tight"
                  >
                    {product.name}
                  </h3>
                  <p className="text-xs text-[#666666] leading-relaxed">
                    {product.shortDescription}
                  </p>

                  {/* Available Color Swatches */}
                  <div className="pt-2 flex items-center gap-2">
                    <span className="text-[11px] text-[#888888] mr-1">Colors:</span>
                    {product.colors.map((c) => (
                      <span
                        key={c.id}
                        className="w-4 h-4 rounded-full border border-black/15 inline-block shadow-2xs"
                        style={{ backgroundColor: c.hex }}
                        title={`${c.name} (${c.id})`}
                      />
                    ))}
                    <span className="text-[11px] text-[#777777] ml-1">
                      ({product.colors.length} shades)
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: View Details & Customize */}
              <div className="pt-6 mt-6 border-t border-[#F0EFEA] grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => onSelectProduct(product)}
                  className="py-3 px-4 bg-[#FAF9F5] hover:bg-[#F2EFE9] border border-[#E8E6E1] text-[#181818] rounded-xl text-xs font-semibold tracking-wider uppercase transition-colors text-center"
                >
                  View Details
                </button>

                <button
                  type="button"
                  onClick={() => onCustomizeProduct(product)}
                  className="py-3 px-4 bg-[#181818] hover:bg-black text-white rounded-xl text-xs font-semibold tracking-wider uppercase transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <span>Customize</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Brand Value Pillars */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-[#E8E6E1] text-xs text-[#666666]">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-[#B99B73] shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-[#181818] text-sm mb-1">Heavyweight Combed Yarn</h4>
            <p className="leading-relaxed">Silicon pre-washed 240–460 GSM organic textiles with structural oversized drape.</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Scissors className="w-5 h-5 text-[#B99B73] shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-[#181818] text-sm mb-1">Direct-to-Garment Calibration</h4>
            <p className="leading-relaxed">Every artwork submission is manually color-calibrated and inspected before printing.</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-[#B99B73] shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-[#181818] text-sm mb-1">Direct WhatsApp Concierge</h4>
            <p className="leading-relaxed">Instant order dispatch to our Egyptian production atelier with image attachments.</p>
          </div>
        </div>
      </section>
    </div>
  );
};
