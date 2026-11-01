import React, { useState, useEffect, useMemo } from 'react';
import { OrderItem, OrderStatus, ORDER_STATUS_LIST } from '../types';
import { OrderCard } from '../components/orders/OrderCard';
import { OrderDetailsModal } from '../components/orders/OrderDetailsModal';
import {
  loadOrdersWithHydratedImages,
  deleteOrder,
  updateOrderStatus,
} from '../services/storageService';
import { PRODUCTS } from '../data/products';
import {
  ShoppingBag,
  ArrowLeft,
  RefreshCw,
  Sparkles,
  MessageCircle,
  Search,
  Filter,
  X,
  SlidersHorizontal,
} from 'lucide-react';
import { WHATSAPP_DESTINATION_NUMBER } from '../services/whatsappService';

interface OrdersPageProps {
  onNavigateToHome: () => void;
  onNavigateToCustomize: () => void;
}

export const OrdersPage: React.FC<OrdersPageProps> = ({
  onNavigateToHome,
  onNavigateToCustomize,
}) => {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [productFilter, setProductFilter] = useState<string>('ALL');

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const hydrated = await loadOrdersWithHydratedImages();
      // Ensure newest orders first
      hydrated.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setOrders(hydrated);
    } catch (e) {
      console.error('Failed to load hydrated orders', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDelete = async (orderId: string) => {
    try {
      await deleteOrder(orderId);
      const hydrated = await loadOrdersWithHydratedImages();
      hydrated.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setOrders(hydrated);
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(null);
      }
    } catch (e) {
      console.error('Failed to delete order', e);
    }
  };

  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
    try {
      updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
      );
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } catch (e) {
      console.error('Failed to update order status', e);
    }
  };

  // Filtered & Sorted Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // 1. Search Query (Order ID, Customer Name, Phone, Governorate)
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const matchesId = order.id.toLowerCase().includes(query);
        const matchesCustomerName = order.customer?.fullName?.toLowerCase().includes(query);
        const matchesPhone = order.customer?.phoneNumber?.toLowerCase().includes(query);
        const matchesGov = order.customer?.governorate?.toLowerCase().includes(query);
        const matchesProduct = order.productName.toLowerCase().includes(query);

        if (!matchesId && !matchesCustomerName && !matchesPhone && !matchesGov && !matchesProduct) {
          return false;
        }
      }

      // 2. Status Filter
      if (statusFilter !== 'ALL' && order.status !== statusFilter) {
        return false;
      }

      // 3. Product Filter
      if (productFilter !== 'ALL' && order.productId !== productFilter) {
        return false;
      }

      return true;
    });
  }, [orders, searchQuery, statusFilter, productFilter]);

  const hasActiveFilters = searchQuery.trim() !== '' || statusFilter !== 'ALL' || productFilter !== 'ALL';

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setProductFilter('ALL');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#E8E6E1] mb-6">
        <div>
          <button
            type="button"
            onClick={onNavigateToHome}
            className="inline-flex items-center gap-1.5 text-xs text-[#777777] hover:text-[#181818] mb-2 transition-colors font-medium group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Storefront</span>
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-display font-medium text-[#181818] tracking-tight">
              My Orders
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-mono font-semibold bg-[#E8E6E1] text-[#181818] rounded-full">
              {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
            </span>
          </div>
          <p className="text-xs text-[#777777] mt-1 flex items-center gap-1.5">
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Orders are dispatched directly via WhatsApp (+{WHATSAPP_DESTINATION_NUMBER})</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchOrders}
            className="p-2.5 bg-white hover:bg-neutral-100 border border-[#E8E6E1] rounded-xl text-xs text-[#555555] transition-colors"
            title="Refresh Orders"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            type="button"
            onClick={onNavigateToHome}
            className="py-2.5 px-4 bg-[#181818] hover:bg-black text-white rounded-xl text-xs font-semibold tracking-wide uppercase transition-colors shadow-xs flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#B99B73]" />
            <span>Explore Silhouettes</span>
          </button>
        </div>
      </div>

      {/* Search and Filters Bar (displayed if orders exist or if currently filtering) */}
      {(orders.length > 0 || hasActiveFilters) && (
        <div className="bg-white border border-[#E8E6E1] rounded-2xl p-4 mb-6 shadow-2xs space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Search Input */}
            <div className="md:col-span-6 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Order ID, Customer Name, or Phone..."
                className="w-full pl-9 pr-8 py-2 bg-[#FAF9F5] border border-[#E8E6E1] focus:border-[#B99B73] rounded-xl text-xs text-[#181818] outline-hidden placeholder:text-[#999999]"
              />
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5 pointer-events-none" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-neutral-400 hover:text-black"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Status Filter */}
            <div className="md:col-span-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full py-2 px-3 bg-[#FAF9F5] border border-[#E8E6E1] focus:border-[#B99B73] rounded-xl text-xs text-[#181818] outline-hidden cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                {ORDER_STATUS_LIST.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* Product Filter */}
            <div className="md:col-span-3">
              <select
                value={productFilter}
                onChange={(e) => setProductFilter(e.target.value)}
                className="w-full py-2 px-3 bg-[#FAF9F5] border border-[#E8E6E1] focus:border-[#B99B73] rounded-xl text-xs text-[#181818] outline-hidden cursor-pointer truncate"
              >
                <option value="ALL">All Products</option>
                {PRODUCTS.map((prod) => (
                  <option key={prod.id} value={prod.id}>
                    {prod.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filter Indicators & Result Count */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#F0EFEA] text-[11px] text-[#777777]">
            <div>
              <span>
                Showing <strong>{filteredOrders.length}</strong> of{' '}
                <strong>{orders.length}</strong> {orders.length === 1 ? 'order' : 'orders'} (newest first)
              </span>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="font-medium text-[#B99B73] hover:text-[#937b5c] flex items-center gap-1 transition-colors"
              >
                <X className="w-3 h-3" />
                <span>Reset all filters</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Orders List / Empty State */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center text-center">
          <div className="w-8 h-8 border-2 border-neutral-300 border-t-[#B99B73] rounded-full animate-spin mb-4" />
          <p className="text-xs text-[#777777]">Loading saved customer orders...</p>
        </div>
      ) : orders.length === 0 ? (
        /* Empty State */
        <div className="py-20 px-6 bg-white border border-[#E8E6E1] rounded-3xl text-center max-w-md mx-auto shadow-2xs">
          <div className="w-16 h-16 rounded-2xl bg-[#FAF9F5] border border-[#E8E6E1] flex items-center justify-center mx-auto mb-4 text-[#B99B73]">
            <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
          </div>
          <h2 className="text-lg font-semibold text-[#181818] mb-1">
            No Orders Placed Yet
          </h2>
          <p className="text-xs text-[#777777] mb-6 leading-relaxed">
            You haven't submitted any custom orders yet. Select a signature silhouette to upload your artwork and customize your piece.
          </p>
          <button
            type="button"
            onClick={onNavigateToHome}
            className="w-full py-3 px-6 bg-[#181818] hover:bg-black text-white rounded-xl text-xs font-semibold tracking-wider uppercase transition-colors shadow-xs"
          >
            Browse Products Now
          </button>
        </div>
      ) : filteredOrders.length === 0 ? (
        /* No Matching Search Results */
        <div className="py-14 px-6 bg-white border border-[#E8E6E1] rounded-3xl text-center max-w-md mx-auto shadow-2xs">
          <div className="w-12 h-12 rounded-2xl bg-[#FAF9F5] border border-[#E8E6E1] flex items-center justify-center mx-auto mb-3 text-neutral-400">
            <Search className="w-6 h-6 stroke-[1.5]" />
          </div>
          <h3 className="text-base font-semibold text-[#181818] mb-1">
            No Orders Matched Your Filters
          </h3>
          <p className="text-xs text-[#777777] mb-4">
            Try adjusting your search query, status filter, or product selection.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="py-2 px-4 bg-[#FAF9F5] hover:bg-neutral-100 border border-[#E8E6E1] text-[#181818] rounded-xl text-xs font-semibold transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        /* Orders List */
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onViewDetails={(ord) => setSelectedOrder(ord)}
              onDeleteOrder={handleDelete}
              onUpdateStatus={handleUpdateStatus}
            />
          ))}
        </div>
      )}

      {/* Order Details & Artwork Inspection Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onDelete={handleDelete}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </div>
  );
};
