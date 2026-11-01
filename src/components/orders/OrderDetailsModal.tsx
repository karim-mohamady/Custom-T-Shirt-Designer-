import React, { useState } from 'react';
import { OrderItem, OrderStatus, ORDER_STATUS_LIST } from '../../types';
import { OrderStatusBadge } from './OrderStatusBadge';
import { openWhatsAppWebDirectly, downloadDataUrl } from '../../services/whatsappService';
import { COLOR_OPTIONS } from '../../utils/constants';
import {
  X,
  Download,
  Trash2,
  Layers,
  Sparkles,
  Calendar,
  FileCheck,
  User,
  Phone,
  MapPin,
  Building,
  MessageCircle,
} from 'lucide-react';

interface OrderDetailsModalProps {
  order: OrderItem;
  onClose: () => void;
  onDelete: (orderId: string) => void;
  onUpdateStatus?: (orderId: string, newStatus: OrderStatus) => void;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  order,
  onClose,
  onDelete,
  onUpdateStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'print'>('preview');

  const colorMeta = COLOR_OPTIONS.find((c) => c.id === order.color);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-[#FAF9F5] border border-[#E8E6E1] rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl my-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#E8E6E1] bg-white">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="font-mono text-xs font-bold text-[#181818]">
                {order.id}
              </span>
              <OrderStatusBadge status={order.status} />

              {onUpdateStatus && (
                <div className="inline-flex items-center gap-1.5 ml-2">
                  <span className="text-[10px] uppercase font-bold text-[#888888]">Update Status:</span>
                  <select
                    value={order.status}
                    onChange={(e) => onUpdateStatus(order.id, e.target.value as OrderStatus)}
                    className="text-xs py-0.5 px-2 bg-[#FAF9F5] hover:bg-neutral-100 border border-[#D6D3CA] rounded-md font-semibold text-[#181818] outline-hidden cursor-pointer"
                  >
                    {ORDER_STATUS_LIST.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            <h2 className="text-base font-semibold text-[#181818]">
              {order.productName}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[#777777] hover:text-[#181818] hover:bg-neutral-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[80vh] overflow-y-auto">
          {/* Visual Showcase (Switch between Product Preview & Transparent Print Artwork) */}
          <div className="space-y-3">
            <div className="flex items-center gap-1 p-1 bg-[#EAE8E2] rounded-lg">
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                  activeTab === 'preview'
                    ? 'bg-white text-[#181818] shadow-2xs font-semibold'
                    : 'text-[#666666] hover:text-[#181818]'
                }`}
              >
                Product Preview
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('print')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                  activeTab === 'print'
                    ? 'bg-white text-[#181818] shadow-2xs font-semibold'
                    : 'text-[#666666] hover:text-[#181818]'
                }`}
              >
                Print Artwork (PNG)
              </button>
            </div>

            <div className="relative aspect-[5/6] bg-white border border-[#E8E6E1] rounded-xl overflow-hidden flex items-center justify-center p-4">
              {activeTab === 'preview' ? (
                order.previewDataUrl ? (
                  <img
                    src={order.previewDataUrl}
                    alt="Customized Preview"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-xs text-neutral-400">Preview loading...</div>
                )
              ) : (
                /* Print File Display with checkerboard transparency grid */
                <div
                  className="w-full h-full flex items-center justify-center relative p-4 rounded-lg"
                  style={{
                    backgroundImage: `linear-gradient(45deg, #eee 25%, transparent 25%), linear-gradient(-45deg, #eee 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #eee 75%), linear-gradient(-45deg, transparent 75%, #eee 75%)`,
                    backgroundSize: '16px 16px',
                    backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
                  }}
                >
                  {order.printArtworkDataUrl ? (
                    <img
                      src={order.printArtworkDataUrl}
                      alt="Transparent Print Artwork"
                      className="max-w-full max-h-full object-contain drop-shadow-md"
                    />
                  ) : (
                    <div className="text-xs text-neutral-400">Artwork loading...</div>
                  )}
                </div>
              )}
            </div>

            {/* Quick Export Downloads & WhatsApp Action */}
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    order.previewDataUrl &&
                    downloadDataUrl(
                      order.previewDataUrl,
                      `preview-${order.id.toLowerCase()}.png`
                    )
                  }
                  className="py-2 px-3 bg-white border border-[#E8E6E1] hover:border-black rounded-lg text-xs font-medium text-[#181818] flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Save Preview</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    order.printArtworkDataUrl &&
                    downloadDataUrl(
                      order.printArtworkDataUrl,
                      `print-artwork-${order.id.toLowerCase()}.png`
                    )
                  }
                  className="py-2 px-3 bg-white border border-[#E8E6E1] hover:border-black rounded-lg text-xs font-medium text-[#181818] flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Print File (PNG)</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => openWhatsAppWebDirectly(order)}
                className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Open in WhatsApp Web (+201017238942)</span>
              </button>
            </div>
          </div>

          {/* Details & Specs */}
          <div className="space-y-4">
            {/* Customer Delivery Details */}
            {order.customer && (
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-[#888888] block mb-2">
                  Customer & Delivery
                </span>
                <div className="bg-white border border-[#E8E6E1] rounded-xl p-3.5 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-[#181818] font-medium">
                    <User className="w-3.5 h-3.5 text-[#B99B73] shrink-0" />
                    <span>{order.customer.fullName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#555555]">
                    <Phone className="w-3.5 h-3.5 text-[#B99B73] shrink-0" />
                    <span className="font-mono">{order.customer.phoneNumber}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#555555]">
                    <Building className="w-3.5 h-3.5 text-[#B99B73] shrink-0" />
                    <span>{order.customer.governorate} (المحافظة)</span>
                  </div>
                  <div className="flex items-start gap-2 text-[#555555]">
                    <MapPin className="w-3.5 h-3.5 text-[#B99B73] shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{order.customer.address}</span>
                  </div>
                </div>
              </div>
            )}

            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-[#888888] block mb-2">
                Order Specifications
              </span>
              <div className="bg-white border border-[#E8E6E1] rounded-xl p-4 space-y-2.5 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-[#F0EFEA]">
                  <span className="text-[#777777]">Selected Color:</span>
                  <div className="flex items-center gap-1.5 font-medium text-[#181818]">
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/15 inline-block"
                      style={{ backgroundColor: colorMeta?.hex || '#000' }}
                    />
                    <span>{order.color} ({colorMeta?.name || order.color})</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-[#F0EFEA]">
                  <span className="text-[#777777]">Selected Size:</span>
                  <span className="font-bold text-[#181818]">{order.size} (Boxy Fit)</span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-[#F0EFEA]">
                  <span className="text-[#777777]">Quantity:</span>
                  <span className="font-semibold text-[#181818]">{order.quantity} pcs</span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-[#F0EFEA]">
                  <span className="text-[#777777]">Unit Price:</span>
                  <span className="text-[#181818]">${order.price} USD</span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="font-bold text-[#181818] uppercase tracking-wider">Total:</span>
                  <span className="text-base font-bold text-[#181818]">
                    ${order.price * order.quantity} USD
                  </span>
                </div>
              </div>
            </div>

            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-[#888888] block mb-2">
                Production Metadata
              </span>
              <div className="bg-white border border-[#E8E6E1] rounded-xl p-3.5 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-[#555555]">
                  <Calendar className="w-3.5 h-3.5 text-[#B99B73]" />
                  <span>Submitted: {new Date(order.createdAt).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2 text-[#555555]">
                  <Layers className="w-3.5 h-3.5 text-[#B99B73]" />
                  <span>
                    Design Layers: {order.elementCount}{' '}
                    {order.hasCustomDesign ? '(Customized)' : '(Blank)'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[#555555]">
                  <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Print Resolution: High-DPI transparent vector/PNG</span>
                </div>
              </div>
            </div>

            {/* Delete Order Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Delete test order ${order.id}? This will remove it from local storage.`)) {
                    onDelete(order.id);
                    onClose();
                  }
                }}
                className="w-full py-2.5 px-4 bg-white hover:bg-red-50 text-red-600 border border-red-200 hover:border-red-300 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Test Order</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
