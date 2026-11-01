import { OrderItem } from '../types';

export const WHATSAPP_DESTINATION_NUMBER = '201017238942';

/**
 * Format the Arabic order message for WhatsApp Web
 */
export function formatWhatsAppOrderMessage(order: OrderItem): string {
  const customerName = order.customer?.fullName || 'غير محدد';
  const customerPhone = order.customer?.phoneNumber || 'غير محدد';
  const customerAddress = order.customer?.address || 'غير محدد';
  const customerGov = order.customer?.governorate || 'غير محدد';
  const unitPrice = `$${order.price} USD`;
  const totalPrice = `$${order.price * order.quantity} USD`;

  return `مرحباً، يوجد طلب جديد من متجر Atelier.

رقم الطلب: ${order.id}

بيانات العميل:
الاسم: ${customerName}
رقم الهاتف: ${customerPhone}
العنوان: ${customerAddress}
المحافظة: ${customerGov}

تفاصيل الطلب:
المنتج: ${order.productName}
اللون: ${order.color}
المقاس: ${order.size}
الكمية: ${order.quantity}
سعر القطعة: ${unitPrice}
الإجمالي: ${totalPrice}

حالة الطلب: ${order.status}

صورة المنتج المخصص سيتم إرفاقها مع الرسالة.

شكراً لك.`;
}

/**
 * Build the exact WhatsApp Web direct URL
 * Format: https://web.whatsapp.com/send?phone=201017238942&text=ENCODED_MESSAGE
 */
export function buildWhatsAppWebUrl(order: OrderItem): string {
  const message = formatWhatsAppOrderMessage(order);
  return `https://web.whatsapp.com/send?phone=${WHATSAPP_DESTINATION_NUMBER}&text=${encodeURIComponent(message)}`;
}

/**
 * Trigger download of a base64 data URL
 */
export function downloadDataUrl(dataUrl: string, filename: string): void {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/**
 * Download the customized Product Preview PNG with the Order ID in filename
 */
export function downloadProductPreviewImage(order: OrderItem, customDataUrl?: string): boolean {
  const dataUrl = customDataUrl || order.previewDataUrl;
  if (!dataUrl) return false;
  downloadDataUrl(dataUrl, `atelier-custom-${order.id.toLowerCase()}-preview.png`);
  return true;
}

/**
 * Download the transparent Print Artwork PNG
 */
export function downloadPrintArtworkImage(order: OrderItem, customDataUrl?: string): boolean {
  const dataUrl = customDataUrl || order.printArtworkDataUrl;
  if (!dataUrl) return false;
  downloadDataUrl(dataUrl, `atelier-print-artwork-${order.id.toLowerCase()}.png`);
  return true;
}

/**
 * Open WhatsApp Web directly in a new browser tab
 */
export function openWhatsAppWebDirectly(order: OrderItem): boolean {
  const url = buildWhatsAppWebUrl(order);
  const win = window.open(url, '_blank', 'noopener,noreferrer');
  return !!win;
}
