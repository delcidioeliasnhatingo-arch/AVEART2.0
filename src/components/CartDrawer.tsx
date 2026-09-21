import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  ShieldCheck, 
  Tag, 
  Truck, 
  CheckCircle2,
  Lock
} from 'lucide-react';
import { formatUSD } from '../utils/formatters';
import { SHIPPING_OPTIONS } from '../data/products';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    cartSubtotal,
    cartDiscount,
    cartShippingCost,
    cartTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    selectedShipping,
    setSelectedShipping,
    setIsCheckoutOpen,
  } = useStore();

  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponCode.trim()) return;

    const res = applyCoupon(couponCode);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponCode('');
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dark overlay backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-400" />
              <h2 className="font-heading font-bold text-base text-white">
                Your Shopping Cart
              </h2>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                {cart.reduce((acc, i) => acc + i.quantity, 0)} items
              </span>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Close Cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                <div className="w-16 h-16 rounded-2xl bg-slate-800/80 flex items-center justify-center text-slate-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Your cart is empty</h3>
                  <p className="text-xs text-slate-400 max-w-xs mt-1">
                    Explore our top GPUs, rapid-trigger keyboards, QD-OLED monitors, and daily deals.
                  </p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all"
                >
                  Explore Products
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex gap-3 items-center justify-between"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-lg object-contain bg-slate-900 shrink-0 border border-slate-800 p-1"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs text-white truncate">
                        {product.name}
                      </h4>
                      <p className="text-[11px] text-cyan-400 font-medium">
                        {product.brand}
                      </p>
                      <div className="text-xs font-bold text-emerald-400 mt-1 font-mono">
                        {formatUSD(product.price * quantity)}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                        title="Remove product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex items-center border border-slate-700 bg-slate-900 rounded-lg">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-white"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-white">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Shipping Selection */}
                <div className="pt-4 border-t border-slate-800 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 uppercase tracking-wider">
                    <Truck className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Shipping Method</span>
                  </div>

                  <div className="space-y-1.5">
                    {SHIPPING_OPTIONS.map((opt) => {
                      const isSelected = selectedShipping.id === opt.id;
                      const isFree = cartSubtotal >= 99 && opt.id === 'ship-2';
                      return (
                        <div
                          key={opt.id}
                          onClick={() => setSelectedShipping(opt)}
                          className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between text-xs ${
                            isSelected
                              ? 'bg-cyan-500/10 border-cyan-500/40 text-white'
                              : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <div>
                            <p className="font-semibold text-white">{opt.name}</p>
                            <p className="text-[11px] text-slate-400">{opt.company} • {opt.deadlineDays} business days</p>
                          </div>
                          <span className={`font-mono font-bold ${isFree ? 'text-emerald-400' : 'text-white'}`}>
                            {isFree ? 'FREE' : formatUSD(opt.price)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Coupon Box */}
                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 uppercase tracking-wider">
                    <Tag className="w-3.5 h-3.5 text-amber-400" />
                    <span>Promo Coupon</span>
                  </div>

                  {appliedCoupon ? (
                    <div className="p-2.5 rounded-xl bg-emerald-950/50 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-300">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <div>
                          <strong className="font-mono">{appliedCoupon.code}</strong>
                          <span className="text-[11px] block text-emerald-400/80">{appliedCoupon.description}</span>
                        </div>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-xs text-rose-400 hover:text-rose-300 font-semibold underline"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="space-y-1">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          placeholder="Try GAMER10, HYPER20, or FREESHIP"
                          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono uppercase"
                        />
                        <button
                          type="submit"
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors"
                        >
                          Apply
                        </button>
                      </div>
                      {couponError && (
                        <p className="text-[11px] text-rose-400">{couponError}</p>
                      )}
                    </form>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Drawer Footer & Checkout Button */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-slate-800 bg-slate-950 space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal:</span>
                  <span className="font-mono text-slate-200">{formatUSD(cartSubtotal)}</span>
                </div>

                {cartDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-medium">
                    <span>Discount ({appliedCoupon?.code}):</span>
                    <span className="font-mono">-{formatUSD(cartDiscount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-400">
                  <span>Shipping ({selectedShipping.name.split(' ')[0]}):</span>
                  <span className="font-mono text-slate-200">
                    {cartShippingCost === 0 ? (
                      <span className="text-emerald-400 font-bold">FREE</span>
                    ) : (
                      formatUSD(cartShippingCost)
                    )}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-800 flex justify-between items-baseline text-white">
                  <span className="font-bold text-sm">Order Total:</span>
                  <div className="text-right">
                    <span className="text-xl font-heading font-black text-emerald-400 font-mono">
                      {formatUSD(cartTotal)}
                    </span>
                    <p className="text-[10px] text-slate-400">or 4 interest-free payments</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-heading font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                <Lock className="w-4 h-4 text-slate-950" />
                <span>Proceed to Secure Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>256-Bit SSL Encrypted • 30-Day Money-Back Guarantee</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
