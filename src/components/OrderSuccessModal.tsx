import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  CheckCircle2, 
  Package, 
  Truck, 
  Copy, 
  Check, 
  Sparkles, 
  MapPin, 
  Calendar, 
  CreditCard,
  ArrowRight,
  X
} from 'lucide-react';
import { formatUSD } from '../utils/formatters';

export const OrderSuccessModal: React.FC = () => {
  const { lastCompletedOrder, setLastCompletedOrder, setIsOrdersOpen, addToast } = useStore();
  const [copiedTracking, setCopiedTracking] = useState(false);

  if (!lastCompletedOrder) return null;

  const handleCopyTracking = () => {
    navigator.clipboard?.writeText(lastCompletedOrder.trackingCode);
    setCopiedTracking(true);
    addToast({
      title: 'Tracking Code Copied!',
      message: `${lastCompletedOrder.trackingCode} copied to clipboard.`,
      type: 'info',
    });
    setTimeout(() => setCopiedTracking(false), 3000);
  };

  const handleOpenOrders = () => {
    setLastCompletedOrder(null);
    setIsOrdersOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/90 backdrop-blur-md p-3 sm:p-6 flex items-center justify-center">
      <div 
        className="relative w-full max-w-2xl bg-slate-900 border border-emerald-500/40 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 px-6 py-6 text-center text-slate-950 relative">
          <button
            onClick={() => setLastCompletedOrder(null)}
            className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-950/20 text-slate-950 hover:bg-slate-950/40 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 rounded-full bg-slate-950 text-emerald-400 flex items-center justify-center mx-auto mb-3 shadow-xl">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h2 className="font-heading font-black text-2xl text-slate-950">
            Order Placed Successfully!
          </h2>
          <p className="text-xs font-semibold text-emerald-950 mt-1">
            Payment authorized in USD. Your gear is being prepared at our fulfillment hub.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Order Details Banner */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-slate-400">Order ID:</p>
              <p className="text-base font-heading font-black text-white">{lastCompletedOrder.id}</p>
            </div>

            <div>
              <p className="text-slate-400">Tracking Number:</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-mono font-bold text-cyan-400">{lastCompletedOrder.trackingCode}</span>
                <button
                  onClick={handleCopyTracking}
                  className="p-1 rounded text-slate-400 hover:text-white"
                  title="Copy tracking code"
                >
                  {copiedTracking ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <p className="text-slate-400">Estimated Delivery:</p>
              <p className="font-bold text-white">
                {lastCompletedOrder.shipping.deadlineDays} business days
              </p>
            </div>
          </div>

          {/* Delivery Tracker Stepper */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
            <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-emerald-400" />
              <span>Live Delivery Progression</span>
            </h3>

            <div className="grid grid-cols-4 gap-2 pt-2 text-center text-[10px]">
              <div className="space-y-1">
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 font-black flex items-center justify-center mx-auto">
                  ✓
                </div>
                <p className="font-bold text-emerald-400">Paid & Verified</p>
                <p className="text-slate-500 text-[9px]">Confirmed</p>
              </div>

              <div className="space-y-1">
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 font-black flex items-center justify-center mx-auto animate-pulse">
                  2
                </div>
                <p className="font-bold text-white">Packaging</p>
                <p className="text-slate-500 text-[9px]">Warehouse Hub</p>
              </div>

              <div className="space-y-1">
                <div className="w-6 h-6 rounded-full bg-slate-800 text-slate-400 font-bold flex items-center justify-center mx-auto">
                  3
                </div>
                <p className="text-slate-400">Courier Transit</p>
                <p className="text-slate-500 text-[9px]">FedEx / UPS</p>
              </div>

              <div className="space-y-1">
                <div className="w-6 h-6 rounded-full bg-slate-800 text-slate-400 font-bold flex items-center justify-center mx-auto">
                  4
                </div>
                <p className="text-slate-400">Delivered</p>
                <p className="text-slate-500 text-[9px]">At Your Door</p>
              </div>
            </div>
          </div>

          {/* Items Purchased List */}
          <div className="space-y-2">
            <h3 className="font-heading font-bold text-xs text-white uppercase tracking-wider">
              Items Purchased
            </h3>
            <div className="space-y-2">
              {lastCompletedOrder.items.map(({ product, quantity }) => (
                <div key={product.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
                  <img
                    src={product.images[0]}
                    alt=""
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-lg object-contain bg-slate-900 border border-slate-800 shrink-0 p-1"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white truncate">{product.name}</p>
                    <p className="text-[11px] text-cyan-400">{product.brand} • Qty: {quantity}x</p>
                  </div>
                  <span className="font-mono font-bold text-emerald-400 text-sm">
                    {formatUSD(product.price * quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Address & Payment Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-300 font-bold mb-1">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span>Shipping Address</span>
              </div>
              <p className="text-white font-medium">{lastCompletedOrder.address.fullName}</p>
              <p className="text-slate-400">{lastCompletedOrder.address.street}</p>
              <p className="text-slate-400">{lastCompletedOrder.address.city}, {lastCompletedOrder.address.state} {lastCompletedOrder.address.cep}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-300 font-bold mb-1">
                <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                <span>Payment & Total</span>
              </div>
              <p className="text-white font-medium capitalize">
                Method: {lastCompletedOrder.paymentType.replace('_', ' ')}
              </p>
              <p className="text-slate-400">Total Paid: <strong className="text-emerald-400 font-mono text-sm">{formatUSD(lastCompletedOrder.total)}</strong></p>
              <p className="text-slate-400">Carrier: {lastCompletedOrder.shipping.name}</p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-800 bg-slate-950 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <button
            onClick={handleOpenOrders}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            View All Orders
          </button>

          <button
            onClick={() => setLastCompletedOrder(null)}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-heading font-black text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-1.5"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
