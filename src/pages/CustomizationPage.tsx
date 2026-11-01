import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ProductItem,
  TShirtSize,
  OrderItem,
  StoredCurrentDesign,
  CustomerInfo,
} from '../types';
import { ProductMockup } from '../components/product/ProductMockup';
import { DesignCanvas, CanvasHandle } from '../components/designer/DesignCanvas';
import { DesignToolbar } from '../components/designer/DesignToolbar';
import { ProductDetails } from '../components/product/ProductDetails';
import { CustomerInfoModal } from '../components/order/CustomerInfoModal';
import { WhatsAppSuccessModal } from '../components/order/WhatsAppSuccessModal';
import { exportTransparentPrintPng, exportProductPreviewPng } from '../services/exportService';
import {
  saveCurrentDesign,
  loadCurrentDesign,
  saveImageToIndexedDB,
  loadOrders,
  saveOrders,
} from '../services/storageService';
import { Eye, EyeOff, Sparkles, ArrowLeft, MessageCircle } from 'lucide-react';

interface CustomizationPageProps {
  product: ProductItem;
  initialColorId?: string;
  onBackToDetails: () => void;
  onNavigateToOrders: () => void;
}

export const CustomizationPage: React.FC<CustomizationPageProps> = ({
  product,
  initialColorId,
  onBackToDetails,
  onNavigateToOrders,
}) => {
  const canvasRef = useRef<CanvasHandle | null>(null);

  // Garment Selection States (scoped strictly to selected product)
  const [selectedColorId, setSelectedColorId] = useState<string>(
    initialColorId || product.colors[0].id
  );
  const [selectedSize, setSelectedSize] = useState<TShirtSize>(product.sizes[2] || 'M');
  const [quantity, setQuantity] = useState<number>(1);
  const [showPrintGuide, setShowPrintGuide] = useState<boolean>(true);

  // Customization Canvas States
  const [hasCustomDesign, setHasCustomDesign] = useState<boolean>(false);
  const [elementCount, setElementCount] = useState<number>(0);
  const [currentCanvasJson, setCurrentCanvasJson] = useState<string>('');
  const [initialJson, setInitialJson] = useState<string | null>(null);

  // Modals & Order Flow
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState<boolean>(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);
  const [completedOrder, setCompletedOrder] = useState<OrderItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Update initial color if prop changes
  useEffect(() => {
    if (initialColorId) {
      setSelectedColorId(initialColorId);
    }
  }, [initialColorId]);

  // Restore saved current design for this specific product if available
  useEffect(() => {
    const saved = loadCurrentDesign();
    if (saved && saved.productId === product.id) {
      if (saved.color) setSelectedColorId(saved.color);
      if (saved.size) setSelectedSize(saved.size);
      if (saved.canvasJson) {
        setInitialJson(saved.canvasJson);
        setCurrentCanvasJson(saved.canvasJson);
      }
    }
  }, [product.id]);

  // Sync design state whenever canvas changes
  const handleCanvasChange = useCallback(
    (hasElements: boolean, count: number, json: string) => {
      setHasCustomDesign(hasElements);
      setElementCount(count);
      setCurrentCanvasJson(json);
      setValidationError(null);

      // Persist in localStorage
      const designToStore: StoredCurrentDesign = {
        productId: product.id,
        color: selectedColorId,
        size: selectedSize,
        canvasJson: json,
        updatedAt: new Date().toISOString(),
        hasCustomDesign: hasElements,
      };
      saveCurrentDesign(designToStore);
    },
    [product.id, selectedColorId, selectedSize]
  );

  // Handle color change (does NOT clear artwork!)
  const handleColorChange = (newColorId: string) => {
    setSelectedColorId(newColorId);
    saveCurrentDesign({
      productId: product.id,
      color: newColorId,
      size: selectedSize,
      canvasJson: currentCanvasJson,
      updatedAt: new Date().toISOString(),
      hasCustomDesign,
    });
  };

  // Handle size change
  const handleSizeChange = (newSize: TShirtSize) => {
    setSelectedSize(newSize);
    saveCurrentDesign({
      productId: product.id,
      color: selectedColorId,
      size: newSize,
      canvasJson: currentCanvasJson,
      updatedAt: new Date().toISOString(),
      hasCustomDesign,
    });
  };

  // Trigger Customer Delivery Information Modal
  const handleInitiateOrder = () => {
    setValidationError(null);

    if (!selectedColorId) {
      setValidationError('Please select a garment color.');
      return;
    }

    if (!selectedSize) {
      setValidationError('Please select a garment size.');
      return;
    }

    if (!hasCustomDesign || elementCount === 0) {
      setValidationError(
        'Please upload artwork, add photos, or type your custom text before adding to order.'
      );
      return;
    }

    setIsCustomerModalOpen(true);
  };

  // Complete Order Creation, Save locally, and Dispatch to WhatsApp
  const handleCustomerSubmit = async (customer: CustomerInfo) => {
    // Prevent duplicate submissions caused by multiple clicks
    if (isSubmitting) return;

    const canvasInstance = canvasRef.current?.getCanvasInstance();
    if (!canvasInstance) {
      setValidationError('Designer canvas is not ready. Please try again.');
      return;
    }

    try {
      setIsSubmitting(true);

      // 1. Generate Collision-Proof Unique Order ID
      const existingOrders = loadOrders();
      let orderId = `ORD-${Date.now().toString().slice(-4)}${Math.floor(100 + Math.random() * 900)}`;
      while (existingOrders.some((o) => o.id === orderId)) {
        orderId = `ORD-${Date.now().toString().slice(-4)}${Math.floor(100 + Math.random() * 900)}`;
      }

      // 2. Export High-DPI Transparent Print Artwork PNG
      const printArtworkPng = exportTransparentPrintPng(canvasInstance);
      const printArtworkId = `print_${orderId}`;
      await saveImageToIndexedDB(printArtworkId, printArtworkPng);

      // 3. Export Realistic Product Preview (Garment + Artwork)
      const productPreviewPng = await exportProductPreviewPng(
        canvasInstance,
        product,
        selectedColorId
      );
      const previewImageId = `preview_${orderId}`;
      await saveImageToIndexedDB(previewImageId, productPreviewPng);

      // 4. Create Order Item
      const newOrder: OrderItem = {
        id: orderId,
        productId: product.id,
        productName: product.name,
        color: selectedColorId,
        size: selectedSize,
        quantity,
        price: product.price,
        createdAt: new Date().toISOString(),
        status: 'Pending Review',
        hasCustomDesign: true,
        elementCount,
        customer,
        previewImageId,
        printArtworkId,
        previewDataUrl: productPreviewPng,
        printArtworkDataUrl: printArtworkPng,
        canvasJson: currentCanvasJson,
      };

      // 5. Save order locally in localStorage & IndexedDB
      saveOrders([newOrder, ...existingOrders]);

      // 6. Open Order Confirmation & WhatsApp Screen
      setCompletedOrder(newOrder);
      setIsCustomerModalOpen(false);
      setIsSuccessModalOpen(true);
      setIsSubmitting(false);
    } catch (err) {
      console.error('Failed to process and save order', err);
      setIsSubmitting(false);
      setValidationError('Failed to generate order images. Please try again.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-in fade-in">
      {/* Top Breadcrumb & Controls Banner */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E8E6E1]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToDetails}
            className="inline-flex items-center gap-1.5 text-xs text-[#777777] hover:text-[#181818] transition-colors font-medium group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>Product Details</span>
          </button>
          <span className="text-[#CCCCCC]">/</span>
          <span className="text-xs font-semibold text-[#181818] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#B99B73]" />
            Customizing {product.name}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setShowPrintGuide(!showPrintGuide)}
          className="text-xs text-[#666666] hover:text-[#181818] flex items-center gap-1.5 py-1 px-2.5 bg-white border border-[#E8E6E1] rounded-lg transition-colors"
        >
          {showPrintGuide ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-[#B99B73]" />}
          <span>{showPrintGuide ? 'Hide Print Boundary' : 'Show Print Boundary'}</span>
        </button>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Realistic Mockup & Interactive Fabric Canvas */}
        <div className="lg:col-span-7 bg-white/70 border border-[#E8E6E1] rounded-3xl p-4 sm:p-8 flex flex-col items-center justify-center relative shadow-xs">
          <div className="w-full">
            <ProductMockup
              product={product}
              selectedColorId={selectedColorId}
              showPrintAreaGuide={showPrintGuide}
            >
              <DesignCanvas
                ref={canvasRef}
                onCanvasChange={handleCanvasChange}
                initialJson={initialJson}
              />
            </ProductMockup>
          </div>

          {/* Guidance note */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs text-[#777777]">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#B99B73]" />
              Photos with backgrounds are fully supported
            </span>
            <span>·</span>
            <span>Drag, resize, rotate</span>
            <span>·</span>
            <span>WhatsApp dispatch</span>
          </div>
        </div>

        {/* Right Column: Studio Toolbar & Order Panel */}
        <div className="lg:col-span-5 space-y-6">
          {/* Design Toolbar (Upload, Text, Shapes, Layers) */}
          <DesignToolbar canvasHandle={canvasRef.current} />

          {/* Product Specifications & Order Trigger */}
          <div className="bg-white border border-[#E8E6E1] rounded-3xl p-6 shadow-xs">
            <ProductDetails
              product={product}
              selectedColorId={selectedColorId}
              onSelectColorId={handleColorChange}
              selectedSize={selectedSize}
              onSelectSize={handleSizeChange}
              quantity={quantity}
              onQuantityChange={setQuantity}
              hasCustomDesign={hasCustomDesign}
              elementCount={elementCount}
              onAddToOrder={handleInitiateOrder}
              isSubmitting={isSubmitting}
              validationError={validationError}
            />
          </div>
        </div>
      </div>

      {/* Delivery Details Modal */}
      <CustomerInfoModal
        product={product}
        quantity={quantity}
        totalPrice={product.price * quantity}
        colorName={selectedColorId}
        size={selectedSize}
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        onSubmit={handleCustomerSubmit}
        isSubmitting={isSubmitting}
      />

      {/* WhatsApp Dispatch Success Modal */}
      {completedOrder && (
        <WhatsAppSuccessModal
          order={completedOrder}
          isOpen={isSuccessModalOpen}
          onClose={() => setIsSuccessModalOpen(false)}
          onNavigateToOrders={onNavigateToOrders}
        />
      )}
    </div>
  );
};
