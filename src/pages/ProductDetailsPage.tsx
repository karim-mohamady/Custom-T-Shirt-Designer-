import React, { useState } from 'react';
import { ProductItem } from '../types';
import { ProductMockup } from '../components/product/ProductMockup';
import {
  ArrowLeft,
  Sparkles,
  Check,
  ShieldCheck,
  ChevronDown,
  Layers,
  Truck,
  ArrowRight,
} from 'lucide-react';

interface ProductDetailsPageProps {
  product: ProductItem;
  onBackToHome: () => void;
  onCustomize: (product: ProductItem, preselectedColorId?: string) => void;
}

export const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({
  product,
  onBackToHome,
  onCustomize,
}) => {
  const [selectedColorId, setSelectedColorId] = useState<string>(product.colors[0].id);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[2] || 'M');
  const [activeTab, setActiveTab] = useState<'specs' | 'fabric' | 'fit' | 'care'>('specs');

  const currentColor = product.colors.find((c) => c.id === selectedColorId) || product.colors[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in">
      {/* Back button */}
      <button
        type="button"
        onClick={onBackToHome}
        className="inline-flex items-center gap-1.5 text-xs text-[#777777] hover:text-[#181818] mb-6 transition-colors font-medium group"
      >
        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
        <span>Back to Storefront</span>
      </button>

      {/* Main 2-Column Product Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Large Product Mockup Gallery */}
        <div className="lg:col-span-7 bg-white border border-[#E8E6E1] rounded-3xl p-6 sm:p-10 shadow-xs flex flex-col items-center justify-center">
          <div className="w-full max-w-[500px]">
            <ProductMockup
              product={product}
              selectedColorId={selectedColorId}
              showPrintAreaGuide={false}
            />
          </div>

          {/* Color Switcher Bar below large mockup */}
          <div className="mt-8 pt-6 border-t border-[#F0EFEA] w-full flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#888888] block">
                Selected Shade
              </span>
              <span className="font-semibold text-xs text-[#181818]">
                {currentColor.name} ({currentColor.id})
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              {product.colors.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedColorId(c.id)}
                  className={`w-8 h-8 rounded-full border transition-all flex items-center justify-center ${
                    selectedColorId === c.id
                      ? 'ring-2 ring-offset-2 ring-[#181818] scale-110'
                      : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={`${c.name} (${c.id})`}
                >
                  {selectedColorId === c.id && (
                    <Check
                      className={`w-3.5 h-3.5 stroke-[2.5] ${
                        c.id === 'White' || c.id === 'Beige' ? 'text-black' : 'text-white'
                      }`}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Information, Specifications, Features, and Customize Button */}
        <div className="lg:col-span-5 space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#B99B73] font-semibold bg-[#B99B73]/10 px-2 py-0.5 rounded">
                {product.category}
              </span>
              {product.badge && (
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#181818] bg-[#E8E6E1] px-2 py-0.5 rounded font-semibold">
                  {product.badge}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-display font-medium text-[#181818] tracking-tight">
              {product.name}
            </h1>

            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-bold text-[#181818] font-sans">
                ${product.price}
              </span>
              <span className="text-xs text-[#777777]">USD (Custom printing included)</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-[#555555] leading-relaxed">
            {product.description}
          </p>

          {/* Sizing Pills */}
          <div className="pt-2 border-t border-[#E8E6E1]">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-[#181818] uppercase tracking-wider">
                Available Sizes
              </span>
              <span className="text-[#888888] text-[11px]">Unisex Boxy Fit</span>
            </div>
            <div className="grid grid-cols-6 gap-2">
              {product.sizes.map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setSelectedSize(sz)}
                  className={`py-2 text-xs font-semibold rounded-lg border transition-all text-center ${
                    selectedSize === sz
                      ? 'bg-[#181818] text-white border-[#181818] shadow-xs'
                      : 'bg-white text-[#181818] border-[#E8E6E1] hover:border-black'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Prominent Customize Product CTA */}
          <div className="pt-3 border-t border-[#E8E6E1] space-y-2">
            <button
              type="button"
              onClick={() => onCustomize(product, selectedColorId)}
              className="w-full py-4 px-6 bg-[#181818] hover:bg-black text-white rounded-2xl text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg group"
            >
              <Sparkles className="w-4 h-4 text-[#B99B73]" />
              <span>Customize This {product.garmentType === 'hoodie' ? 'Hoodie' : 'T-Shirt'} Now</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-[11px] text-center text-[#777777] flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#B99B73]" />
              Upload photos, add text slogans, and position your artwork on this silhouette.
            </p>
          </div>

          {/* Product Key Features */}
          <div className="pt-4 border-t border-[#E8E6E1]">
            <h3 className="text-xs uppercase tracking-wider font-semibold text-[#181818] mb-3">
              Craftsmanship & Features
            </h3>
            <div className="space-y-2.5">
              {product.features.map((feat, idx) => (
                <div key={idx} className="p-3 bg-white border border-[#E8E6E1] rounded-xl text-xs">
                  <h4 className="font-semibold text-[#181818] mb-0.5">{feat.title}</h4>
                  <p className="text-[#666666] leading-relaxed text-[11px]">{feat.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Specifications Accordion */}
          <div className="pt-4 border-t border-[#E8E6E1]">
            <h3 className="text-xs uppercase tracking-wider font-semibold text-[#181818] mb-3">
              Garment Specifications
            </h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
              {product.specifications.map((spec, idx) => (
                <div key={idx} className="pb-1.5 border-b border-[#F0EFEA]">
                  <span className="text-[#888888] block text-[11px]">{spec.label}</span>
                  <span className="font-medium text-[#181818]">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Fabric, Fit, Care Info */}
          <div className="pt-3 border-t border-[#E8E6E1] space-y-2 text-xs text-[#666666]">
            <div className="p-3 bg-[#FAF9F5] border border-[#E8E6E1] rounded-xl space-y-1">
              <span className="font-semibold text-[#181818] block uppercase text-[10px] tracking-wider">
                Fabric Details
              </span>
              <p className="leading-relaxed text-[11px]">{product.fabricDetails}</p>
            </div>
            <div className="p-3 bg-[#FAF9F5] border border-[#E8E6E1] rounded-xl space-y-1">
              <span className="font-semibold text-[#181818] block uppercase text-[10px] tracking-wider">
                Fit Guide
              </span>
              <p className="leading-relaxed text-[11px]">{product.fitDetails}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
