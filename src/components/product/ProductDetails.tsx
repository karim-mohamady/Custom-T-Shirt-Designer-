import React, { useState } from 'react';
import { ProductItem, TShirtSize } from '../../types';
import { ColorSelector } from './ColorSelector';
import { SizeSelector } from './SizeSelector';
import {
  ShoppingBag,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Truck,
  MessageCircle,
} from 'lucide-react';

interface ProductDetailsProps {
  product: ProductItem;
  selectedColorId: string;
  onSelectColorId: (colorId: string) => void;
  selectedSize: TShirtSize;
  onSelectSize: (size: TShirtSize) => void;
  quantity: number;
  onQuantityChange: (qty: number) => void;
  hasCustomDesign: boolean;
  elementCount: number;
  onAddToOrder: () => void;
  isSubmitting: boolean;
  validationError: string | null;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({
  product,
  selectedColorId,
  onSelectColorId,
  selectedSize,
  onSelectSize,
  quantity,
  onQuantityChange,
  hasCustomDesign,
  elementCount,
  onAddToOrder,
  isSubmitting,
  validationError,
}) => {
  const [activeAccordion, setActiveAccordion] = useState<'fabric' | 'fit' | 'care' | null>('fabric');

  const toggleAccordion = (tab: 'fabric' | 'fit' | 'care') => {
    setActiveAccordion(activeAccordion === tab ? null : tab);
  };

  const totalPrice = product.price * quantity;

  return (
    <div className="space-y-6">
      {/* Title & Price Header */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#B99B73] font-semibold bg-[#B99B73]/10 px-2 py-0.5 rounded">
            {product.category}
          </span>
          {hasCustomDesign && (
            <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-emerald-600" />
              {elementCount} Custom {elementCount === 1 ? 'Layer' : 'Layers'}
            </span>
          )}
        </div>

        <h1 className="text-2xl lg:text-3xl font-display font-medium text-[#181818] tracking-tight">
          {product.name}
        </h1>

        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-2xl font-semibold text-[#181818]">
            ${product.price}
          </span>
          <span className="text-xs text-[#777777]">USD / piece (Custom printing included)</span>
        </div>
      </div>

      {/* Product Description */}
      <p className="text-xs lg:text-sm text-[#555555] leading-relaxed">
        {product.description}
      </p>

      {/* Color Selection */}
      <div className="pt-2 border-t border-[#E8E6E1]">
        <ColorSelector
          colors={product.colors}
          selectedColorId={selectedColorId}
          onSelectColor={onSelectColorId}
        />
      </div>

      {/* Size Selection */}
      <div className="pt-2 border-t border-[#E8E6E1]">
        <SizeSelector
          sizes={product.sizes}
          selectedSize={selectedSize}
          onSelectSize={onSelectSize}
        />
      </div>

      {/* Quantity & Order Total Bar */}
      <div className="pt-2 border-t border-[#E8E6E1] flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-xs font-medium text-[#181818] uppercase tracking-wider block">
            Quantity
          </span>
          <div className="flex items-center border border-[#E8E6E1] bg-white rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="w-8 h-8 flex items-center justify-center text-[#555555] hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-mono"
            >
              -
            </button>
            <span className="w-9 text-center text-xs font-semibold text-[#181818] font-mono">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => onQuantityChange(quantity + 1)}
              className="w-8 h-8 flex items-center justify-center text-[#555555] hover:bg-neutral-100 transition-colors font-mono"
            >
              +
            </button>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[11px] text-[#777777] uppercase tracking-wider block">
            Order Total
          </span>
          <span className="text-xl font-bold text-[#181818]">
            ${totalPrice} USD
          </span>
        </div>
      </div>

      {/* Validation Error Message */}
      {validationError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Primary Action Button: Add to Order & WhatsApp Flow */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={onAddToOrder}
          disabled={isSubmitting}
          className="w-full py-4 px-6 bg-[#181818] hover:bg-black text-white rounded-xl text-xs sm:text-sm font-semibold tracking-wide uppercase transition-all duration-200 flex items-center justify-center gap-3 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-wait"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Generating Print Files & WhatsApp Data...</span>
            </>
          ) : (
            <>
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Add to Order & Send via WhatsApp · ${totalPrice}</span>
            </>
          )}
        </button>

        <p className="text-[11px] text-center text-[#777777] flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#B99B73]" />
          Direct dispatch to WhatsApp (+201017238942) with full delivery details.
        </p>
      </div>

      {/* Specifications Grid */}
      <div className="pt-4 border-t border-[#E8E6E1]">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#181818] mb-3">
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

      {/* Accordions for Fabric, Fit, Care */}
      <div className="border-t border-[#E8E6E1] divide-y divide-[#E8E6E1]">
        {/* Fabric */}
        <div>
          <button
            type="button"
            onClick={() => toggleAccordion('fabric')}
            className="w-full py-3 flex items-center justify-between text-xs font-semibold text-[#181818] uppercase tracking-wider text-left"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#B99B73]" />
              Fabric & Composition
            </span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                activeAccordion === 'fabric' ? 'rotate-180 text-[#B99B73]' : 'text-neutral-400'
              }`}
            />
          </button>
          {activeAccordion === 'fabric' && (
            <div className="pb-3 text-xs text-[#666666] leading-relaxed animate-in fade-in">
              {product.fabricDetails}
            </div>
          )}
        </div>

        {/* Fit */}
        <div>
          <button
            type="button"
            onClick={() => toggleAccordion('fit')}
            className="w-full py-3 flex items-center justify-between text-xs font-semibold text-[#181818] uppercase tracking-wider text-left"
          >
            <span className="flex items-center gap-2">
              <Truck className="w-3.5 h-3.5 text-[#B99B73]" />
              Fit & Sizing Guide
            </span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                activeAccordion === 'fit' ? 'rotate-180 text-[#B99B73]' : 'text-neutral-400'
              }`}
            />
          </button>
          {activeAccordion === 'fit' && (
            <div className="pb-3 text-xs text-[#666666] leading-relaxed animate-in fade-in">
              {product.fitDetails}
            </div>
          )}
        </div>

        {/* Care */}
        <div>
          <button
            type="button"
            onClick={() => toggleAccordion('care')}
            className="w-full py-3 flex items-center justify-between text-xs font-semibold text-[#181818] uppercase tracking-wider text-left"
          >
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#B99B73]" />
              Garment Care Instructions
            </span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                activeAccordion === 'care' ? 'rotate-180 text-[#B99B73]' : 'text-neutral-400'
              }`}
            />
          </button>
          {activeAccordion === 'care' && (
            <div className="pb-3 text-xs text-[#666666] leading-relaxed animate-in fade-in">
              <ul className="list-disc pl-4 space-y-1">
                {product.careInstructions.map((inst, i) => (
                  <li key={i}>{inst}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
