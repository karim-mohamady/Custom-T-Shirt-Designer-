import React, { useState } from 'react';
import { OrderItem } from '../../types';
import {
  WHATSAPP_DESTINATION_NUMBER,
  buildWhatsAppWebUrl,
  downloadProductPreviewImage,
  downloadPrintArtworkImage,
} from '../../services/whatsappService';
import {
  CheckCircle2,
  Download,
  ExternalLink,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Info,
  Image as ImageIcon,
  Check,
  AlertTriangle,
} from 'lucide-react';

interface WhatsAppSuccessModalProps {
  order: OrderItem;
  isOpen: boolean;
  onClose: () => void;
  onNavigateToOrders: () => void;
}

export const WhatsAppSuccessModal: React.FC<WhatsAppSuccessModalProps> = ({
  order,
  isOpen,
  onClose,
  onNavigateToOrders,
}) => {
  const [hasDownloadedImage, setHasDownloadedImage] = useState(false);
  const [hasClickedWhatsApp, setHasClickedWhatsApp] = useState(false);
  const [popupBlocked, setPopupBlocked] = useState(false);

  if (!isOpen) return null;

  const orderTotal = `$${order.price * order.quantity} USD`;
  const whatsappWebUrl = buildWhatsAppWebUrl(order);

  const handleDownloadPreview = () => {
    downloadProductPreviewImage(order);
    setHasDownloadedImage(true);
  };

  const handleDownloadPrint = () => {
    downloadPrintArtworkImage(order);
  };

  const handleOpenWhatsAppWeb = () => {
    setHasClickedWhatsApp(true);
    setPopupBlocked(false);

    // Open WhatsApp Web directly in new window/tab
    const newWindow = window.open(whatsappWebUrl, '_blank', 'noopener,noreferrer');
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      // Browser blocked popup
      setPopupBlocked(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-[#FAF9F5] border border-[#E8E6E1] rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl my-auto animate-in zoom-in-95 duration-200">
        {/* Top Success Header */}
        <div className="p-6 sm:p-7 bg-white border-b border-[#E8E6E1] text-center relative">
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-2xs">
            <CheckCircle2 className="w-8 h-8 stroke-[2.25]" />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-emerald-100/70 text-emerald-800 text-[11px] font-mono font-bold mb-1.5">
            <span>Order Saved Successfully · #{order.id}</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-display font-medium text-[#181818]">
            Order Confirmed & Ready to Send
          </h2>
          <p className="text-xs text-[#666666] mt-1 max-w-md mx-auto">
            Your customized order has been stored locally with status <strong>Pending Review</strong>. Complete the order by opening WhatsApp Web and attaching your customized preview.
          </p>
        </div>

        {/* Order Summary Card with Customized Preview */}
        <div className="p-6 space-y-5">
          <div className="bg-white border border-[#E8E6E1] rounded-2xl p-4 flex gap-4 items-center">
            {/* Customized Product Preview Thumbnail */}
            <div className="w-24 h-28 bg-[#FAF9F5] border border-[#E8E6E1] rounded-xl overflow-hidden shrink-0 flex items-center justify-center p-1.5 shadow-2xs">
              {order.previewDataUrl ? (
                <img
                  src={order.previewDataUrl}
                  alt={order.productName}
                  className="w-full h-full object-contain"
                />
              ) : (
                <ImageIcon className="w-8 h-8 text-neutral-300" />
              )}
            </div>

            {/* Specifications */}
            <div className="flex-1 min-w-0 space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] font-bold text-[#B99B73]">
                  {order.id}
                </span>
                <span className="px-2 py-0.5 text-[10px] rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-medium">
                  {order.status}
                </span>
              </div>

              <h3 className="font-semibold text-sm text-[#181818] truncate">
                {order.productName}
              </h3>

              <div className="text-[11px] text-[#555555]">
                <span>Color: <strong>{order.color}</strong></span> ·{' '}
                <span>Size: <strong>{order.size}</strong></span> ·{' '}
                <span>Qty: <strong>{order.quantity} pcs</strong></span>
              </div>

              {order.customer && (
                <div className="text-[11px] text-[#777777] truncate">
                  Customer: <strong className="text-[#181818]">{order.customer.fullName}</strong> ({order.customer.governorate})
                </div>
              )}

              <div className="pt-1 text-sm font-bold text-[#181818]">
                Total: {orderTotal}
              </div>
            </div>
          </div>

          {/* Step-by-Step WhatsApp Instructions Callout */}
          <div className="p-4 bg-[#F2F7F2] border border-[#CDE5CD] rounded-2xl text-xs space-y-2 text-[#245228]">
            <div className="flex items-center gap-2 font-bold text-sm">
              <MessageSquare className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>WhatsApp Web Destination: +{WHATSAPP_DESTINATION_NUMBER}</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              <strong>تعليمات إرسال الطلب:</strong> تم تجهيز نص الطلب باللغة العربية بالكامل. اتبع الخطوتين التاليتين:
            </p>
            <ol className="list-decimal pl-4 space-y-1 text-[11px]">
              <li>اضغط <strong>&quot;تنزيل صورة المنتج&quot;</strong> لحفظ التصميم على جهازك.</li>
              <li>اضغط <strong>&quot;إرسال الطلب عبر واتساب ويب&quot;</strong> لفتح المحادثة، ثم أرفق الصورة واضغط إرسال يدويًا.</li>
            </ol>
            <p className="text-[10px] text-[#3e6a42] italic pt-1">
              * في حال لم تكن مسجلاً في واتساب ويب، قم بمسح رمز الاستجابة السريعة (QR Code) بهاتفك لتسجيل الدخول بشكل طبيعي.
            </p>
          </div>

          {/* Two Primary Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Button 1: Download Product Image */}
            <button
              type="button"
              onClick={handleDownloadPreview}
              className={`py-3.5 px-4 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 border shadow-xs ${
                hasDownloadedImage
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-white hover:bg-[#FAF9F5] text-[#181818] border-[#E8E6E1] hover:border-black'
              }`}
            >
              {hasDownloadedImage ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Image Downloaded ✓</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-[#B99B73]" />
                  <span>1. Download Product Image</span>
                </>
              )}
            </button>

            {/* Button 2: Send Order via WhatsApp Web */}
            <button
              type="button"
              onClick={handleOpenWhatsAppWeb}
              className="py-3.5 px-4 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl text-xs font-semibold tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              <span>2. Send Order via WhatsApp</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Popup Blocked Fallback */}
          {popupBlocked && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2 animate-in fade-in">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Browser Blocked New Tab</p>
                <p className="text-[11px] mt-0.5">
                  Click the direct link below to open WhatsApp Web:
                </p>
                <a
                  href={whatsappWebUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center gap-1 font-bold text-emerald-800 underline hover:text-emerald-950"
                >
                  Click Here to Open WhatsApp Web
                </a>
              </div>
            </div>
          )}

          {/* Notification after clicking WhatsApp */}
          {hasClickedWhatsApp && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-start gap-2 animate-in fade-in">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed">
                تم فتح محادثة واتساب وتجهيز تفاصيل الطلب. قم بإرفاق صورة المنتج التي تم تنزيلها، ثم اضغط إرسال.
              </p>
            </div>
          )}

          {/* Secondary Actions: Print Artwork Download & My Orders */}
          <div className="pt-2 border-t border-[#F0EFEA] flex flex-wrap items-center justify-between gap-3 text-xs">
            <button
              type="button"
              onClick={handleDownloadPrint}
              className="text-[#777777] hover:text-[#181818] flex items-center gap-1.5 transition-colors text-[11px]"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Transparent Print Artwork (PNG)</span>
            </button>

            <button
              type="button"
              onClick={onNavigateToOrders}
              className="font-semibold text-[#181818] hover:text-[#B99B73] flex items-center gap-1 transition-colors"
            >
              <span>View in My Orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
