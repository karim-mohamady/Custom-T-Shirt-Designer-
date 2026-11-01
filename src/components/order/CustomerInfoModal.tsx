import React, { useState } from 'react';
import { CustomerInfo, EGYPTIAN_GOVERNORATES, EgyptianGovernorate, ProductItem } from '../../types';
import { User, Phone, MapPin, Building, ShieldCheck, X, AlertCircle } from 'lucide-react';

interface CustomerInfoModalProps {
  product: ProductItem;
  quantity: number;
  totalPrice: number;
  colorName: string;
  size: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (info: CustomerInfo) => void;
  isSubmitting: boolean;
}

export const CustomerInfoModal: React.FC<CustomerInfoModalProps> = ({
  product,
  quantity,
  totalPrice,
  colorName,
  size,
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}) => {
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [governorate, setGovernorate] = useState<EgyptianGovernorate | ''>('Cairo');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Validation 1: Full name
    if (!fullName.trim() || fullName.trim().length < 3) {
      setValidationError('Please enter your full name (at least 3 characters).');
      return;
    }

    // Validation 2: Phone number
    const cleanPhone = phoneNumber.replace(/[\s\-\+]/g, '');
    if (!cleanPhone || cleanPhone.length < 9) {
      setValidationError('Please enter a valid phone number (e.g., 01017238942).');
      return;
    }

    // Validation 3: Address
    if (!address.trim() || address.trim().length < 5) {
      setValidationError('Please provide a complete delivery street address.');
      return;
    }

    // Validation 4: Governorate
    if (!governorate) {
      setValidationError('Please select your Egyptian governorate (المحافظة).');
      return;
    }

    onSubmit({
      fullName: fullName.trim(),
      phoneNumber: cleanPhone,
      address: address.trim(),
      governorate,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-[#FAF9F5] border border-[#E8E6E1] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl my-auto">
        {/* Header */}
        <div className="p-5 border-b border-[#E8E6E1] bg-white flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#B99B73] font-semibold">
              Step 2 of 2 · Delivery & Contact
            </span>
            <h2 className="text-lg font-semibold text-[#181818] mt-0.5">
              Customer Information
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1.5 text-neutral-400 hover:text-black rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Summary Recap Strip */}
        <div className="p-3.5 bg-[#F2EFE9] border-b border-[#E8E6E1] text-xs text-[#555555] flex items-center justify-between">
          <div>
            <span className="font-semibold text-[#181818]">{product.name}</span>
            <span className="block text-[11px] text-[#777777]">
              {colorName} · Size {size} · {quantity} pcs
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase tracking-wider text-[#888888] block">Total</span>
            <span className="font-bold text-sm text-[#181818]">${totalPrice} USD</span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Error Banner */}
          {validationError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#444444] mb-1.5">
              Full Name (الاسم بالكامل) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Karim Mohamadi"
                className="w-full px-3.5 py-2.5 bg-white border border-[#E8E6E1] focus:border-[#B99B73] rounded-lg text-sm text-[#181818] outline-hidden shadow-2xs"
              />
              <User className="absolute right-3 top-3 w-4 h-4 text-neutral-400 pointer-events-none" />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#444444] mb-1.5">
              Phone Number (رقم الهاتف / واتساب) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="tel"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="e.g. 01017238942"
                className="w-full px-3.5 py-2.5 bg-white border border-[#E8E6E1] focus:border-[#B99B73] rounded-lg text-sm text-[#181818] outline-hidden shadow-2xs font-mono"
              />
              <Phone className="absolute right-3 top-3 w-4 h-4 text-neutral-400 pointer-events-none" />
            </div>
            <p className="text-[10px] text-[#777777] mt-1">
              Used for courier delivery updates and WhatsApp order verification.
            </p>
          </div>

          {/* Governorate Dropdown */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#444444] mb-1.5">
              Governorate (المحافظة) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                required
                value={governorate}
                onChange={(e) => setGovernorate(e.target.value as EgyptianGovernorate)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#E8E6E1] focus:border-[#B99B73] rounded-lg text-sm text-[#181818] outline-hidden shadow-2xs cursor-pointer appearance-none"
              >
                <option value="">Select Governorate (اختر المحافظة)...</option>
                {EGYPTIAN_GOVERNORATES.map((gov) => (
                  <option key={gov} value={gov}>
                    {gov}
                  </option>
                ))}
              </select>
              <Building className="absolute right-3 top-3 w-4 h-4 text-neutral-400 pointer-events-none" />
            </div>
          </div>

          {/* Detailed Street Address */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#444444] mb-1.5">
              Full Street Address (العنوان بالتفصيل) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <textarea
                required
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Building number, Street name, District, Floor / Apartment"
                className="w-full px-3.5 py-2.5 bg-white border border-[#E8E6E1] focus:border-[#B99B73] rounded-lg text-sm text-[#181818] outline-hidden shadow-2xs resize-none"
              />
              <MapPin className="absolute right-3 top-3 w-4 h-4 text-neutral-400 pointer-events-none" />
            </div>
          </div>

          {/* Privacy Note */}
          <div className="flex items-center gap-2 p-2.5 bg-white border border-[#E8E6E1] rounded-lg text-[11px] text-[#666666]">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Your information is stored locally and formatted directly into the atelier WhatsApp message.
            </span>
          </div>

          {/* Submit Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 bg-[#181818] hover:bg-black text-white rounded-xl text-xs font-semibold tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Processing & Saving Order...</span>
                </>
              ) : (
                <span>Confirm Delivery Details & Continue</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
