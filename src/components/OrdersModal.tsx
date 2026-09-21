import React from 'react';
import { useStore } from '../context/StoreContext';
import { 
  X, 
  Package, 
  Truck, 
  Clock, 
  MapPin, 
  CheckCircle2
} from 'lucide-react';
import { formatUSD } from '../utils/formatters';

export const OrdersModal: React.FC = () => {
  const { isOrdersOpen, setIsOrdersOpen, orders } = useStore();

  if (!isOrdersOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm p-3 sm:p-6 flex items-center justify-center">
      <div 
        className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-cyan-400" />
            <h2 className="font-heading font-bold text-base text-white">
              Order History & Tracking
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-bold">
              {orders.length}
            </span>
          </div>

          <button
            onClick={() => setIsOrdersOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {orders.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
                <Package className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-white">No orders yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                When you place an order on HyperGear, it will appear here with live tracking in USD.
              </p>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3 text-xs">
                  <div>
                    <span className="text-slate-400">Order ID: </span>
                    <strong className="text-white font-mono">{order.id}</strong>
                    <span className="text-slate-500 ml-2">
                      ({new Date(order.date).toLocaleDateString()})
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold capitalize">
                      {order.status}
                    </span>
                    <span className="font-mono font-bold text-white">
                      {formatUSD(order.total)}
                    </span>
                  </div>
                </div>

                {/* Items in this order */}
                <div className="space-y-2">
                  {order.items.map(({ product, quantity }) => (
                    <div key={product.id} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <img
                          src={product.images[0]}
                          alt=""
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 rounded bg-slate-900 border border-slate-800 shrink-0 p-0.5 object-contain"
                        />
                        <span className="text-slate-200 truncate">{product.name}</span>
                        <span className="text-slate-500 shrink-0">x{quantity}</span>
                      </div>
                      <span className="text-slate-400 font-mono shrink-0 ml-2">
                        {formatUSD(product.price * quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Tracking info */}
                <div className="pt-2 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Tracking: <strong className="font-mono text-cyan-400">{order.trackingCode}</strong></span>
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Est. Delivery: {order.shipping.deadlineDays} business days</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
