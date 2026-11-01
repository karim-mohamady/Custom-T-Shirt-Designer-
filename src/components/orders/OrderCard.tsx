import React from 'react';
import { OrderItem, OrderStatus, ORDER_STATUS_LIST } from '../../types';
import { OrderStatusBadge } from './OrderStatusBadge';
import { COLOR_OPTIONS } from '../../utils/constants';
import { Eye, Trash2, Calendar, User, Phone, MessageCircle, Download, Image as ImageIcon } from 'lucide-react';
import { openWhatsAppWebDirectly, downloadDataUrl } from '../../services/whatsappService';

interface OrderCardProps {
  order: OrderItem;
  onViewDetails: (order: OrderItem) => void;
  onDeleteOrder: (orderId: string) => void;
  onUpdateStatus?: (orderId: string, newStatus: OrderStatus) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onViewDetails,
  onDeleteOrder,
  onUpdateStatus,
}) => {
  const colorMeta = COLOR_OPTIONS.find((c) => c.id === order.color);
  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="bg-white border border-[#E8E6E1] hover:border-[#D6D3CA] rounded-2xl p-4 lg:p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col md:flex-row gap-5 items-stretch">
      {/* Product Preview Image Thumbnail */}
      <div
        onClick={() => onViewDetails(order)}
        className="relative w-full md:w-44 aspect-[5/6] bg-[#FAF9F5] border border-[#E8E6E1] rounded-xl overflow-hidden shrink-0 flex items-center justify-center p-2 cursor-pointer group"
      >
        {order.previewDataUrl ? (
          <img
            src={order.previewDataUrl}
            alt={order.productName}
            onError={(e) => {
              // Hide broken image link if corrupted and fall back to icon
              (e.currentTarget as HTMLElement).style.display = 'none';
            }}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-3 text-neutral-400">
            <ImageIcon className="w-8 h-8 stroke-[1.25] mb-1.5" />
            <span className="text-[11px] font-medium text-neutral-500">Preview Stored</span>
            <span className="text-[9px] text-neutral-400">Click to view</span>
          </div>
        )}

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <span className="px-2.5 py-1 bg-white/90 backdrop-blur-xs text-[11px] font-semibold text-[#181818] rounded-full shadow-xs flex items-center gap-1">
            <Eye className="w-3 h-3" /> Inspect
          </span>
        </div>
      </div>

      {/* Order Info & Customer Delivery Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Top row: Order ID, Status Badge & Quick Status Selector */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold text-[#181818] tracking-wider">
                {order.id}
              </span>
              <OrderStatusBadge status={order.status} />
            </div>

            {onUpdateStatus && (
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] uppercase font-bold text-[#888888]">Status:</span>
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

          <h3 className="text-base font-semibold text-[#181818] tracking-tight">
            {order.productName}
          </h3>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#777777] mt-1 mb-3">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#B99B73]" />
              {formattedDate}
            </span>

            {order.customer && (
              <>
                <span className="flex items-center gap-1 text-[#181818] font-medium">
                  <User className="w-3.5 h-3.5 text-[#777777]" />
                  {order.customer.fullName}
                </span>
                <span className="flex items-center gap-1 font-mono text-[#555555]">
                  <Phone className="w-3.5 h-3.5 text-[#777777]" />
                  {order.customer.phoneNumber} ({order.customer.governorate})
                </span>
              </>
            )}
          </div>

          {/* Configuration Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-y border-[#F0EFEA] text-xs">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#888888] block">
                Color
              </span>
              <div className="flex items-center gap-1.5 font-medium text-[#181818] mt-0.5">
                <span
                  className="w-3 h-3 rounded-full border border-black/15 inline-block shrink-0"
                  style={{ backgroundColor: colorMeta?.hex || '#181818' }}
                />
                <span className="truncate">{order.color}</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#888888] block">
                Size
              </span>
              <span className="font-bold text-[#181818] mt-0.5 block">
                {order.size} (Boxy)
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#888888] block">
                Quantity
              </span>
              <span className="font-medium text-[#181818] mt-0.5 block">
                {order.quantity} pcs
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#888888] block">
                Total Price
              </span>
              <span className="font-bold text-[#181818] mt-0.5 block text-sm">
                ${order.price * order.quantity} USD
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 mt-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onViewDetails(order)}
              className="py-2 px-3.5 bg-[#FAF9F5] hover:bg-[#F2EFE9] border border-[#E8E6E1] text-[#181818] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Details & Print Artwork</span>
            </button>

            <button
              type="button"
              onClick={() => openWhatsAppWebDirectly(order)}
              className="py-2 px-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors"
              title="Open WhatsApp Web (+201017238942)"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">WhatsApp Web</span>
            </button>

            {order.previewDataUrl && (
              <button
                type="button"
                onClick={() =>
                  downloadDataUrl(order.previewDataUrl!, `atelier-custom-${order.id.toLowerCase()}-preview.png`)
                }
                className="p-2 bg-[#FAF9F5] hover:bg-neutral-200/60 border border-[#E8E6E1] text-[#666666] hover:text-black rounded-xl text-xs transition-colors"
                title="Download Customized Product Preview (PNG)"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              if (confirm(`Delete order ${order.id}?`)) {
                onDeleteOrder(order.id);
              }
            }}
            className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete Order"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
