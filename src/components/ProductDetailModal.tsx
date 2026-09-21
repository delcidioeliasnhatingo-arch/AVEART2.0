import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  X, 
  Star, 
  ShieldCheck, 
  Truck, 
  ShoppingBag, 
  Heart, 
  ArrowRight, 
  Check, 
  Info, 
  Sparkles,
  Zap,
  CreditCard,
  Gift,
  Flame,
  Share2
} from 'lucide-react';
import { formatUSD, formatZipCode, getInstallmentsOptions } from '../utils/formatters';

export const ProductDetailModal: React.FC = () => {
  const { 
    selectedProduct, 
    setSelectedProduct, 
    addToCart, 
    setIsCartOpen, 
    setIsCheckoutOpen,
    toggleWishlist,
    isInWishlist,
    addToast 
  } = useStore();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [zipInput, setZipInput] = useState('');
  const [shippingResult, setShippingResult] = useState<{
    calculated: boolean;
    standard: { price: number; days: number };
    priority: { price: number; days: number };
  } | null>(null);
  const [showInstallments, setShowInstallments] = useState(false);

  if (!selectedProduct) return null;

  const isFavorited = isInWishlist(selectedProduct.id);
  const installments = getInstallmentsOptions(selectedProduct.price, 12);
  const payInFour = selectedProduct.price / 4;

  const handleSimulateShipping = (e: React.FormEvent) => {
    e.preventDefault();
    if (zipInput.trim().length < 5) return;

    setShippingResult({
      calculated: true,
      standard: { price: selectedProduct.price >= 99 ? 0 : 7.99, days: 3 },
      priority: { price: 14.99, days: 1 },
    });
  };

  const handleBuyNow = () => {
    addToCart(selectedProduct, quantity);
    setSelectedProduct(null);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleAddToCart = () => {
    addToCart(selectedProduct, quantity);
  };

  const handleCopyProductLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    addToast({
      title: 'Product Link Copied!',
      message: `${selectedProduct.name} link copied to clipboard.`,
      type: 'info',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded border border-cyan-500/20">
              {selectedProduct.brand}
            </span>
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">
              SKU: {selectedProduct.sku}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyProductLink}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Share product link"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSelectedProduct(null)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="overflow-y-auto p-6 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Gallery Column */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center p-4">
                <img
                  src={selectedProduct.images[activeImageIndex]}
                  alt={selectedProduct.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                />

                {selectedProduct.dealType === 'bogo' && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-violet-600 text-white font-heading font-black text-xs uppercase tracking-wider flex items-center gap-1 shadow-md">
                    <Gift className="w-3.5 h-3.5" />
                    BOGO Special
                  </span>
                )}

                {selectedProduct.dealType === 'flash_sale' && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-amber-500 text-slate-950 font-heading font-black text-xs uppercase tracking-wider flex items-center gap-1 shadow-md">
                    <Flame className="w-3.5 h-3.5 fill-current" />
                    Flash Deal
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {selectedProduct.images.length > 1 && (
                <div className="flex gap-2">
                  {selectedProduct.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-16 h-16 rounded-xl border p-1 bg-slate-950 overflow-hidden transition-all ${
                        activeImageIndex === idx
                          ? 'border-emerald-500 shadow-md shadow-emerald-500/20'
                          : 'border-slate-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" referrerPolicy="no-referrer" className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}

              {/* BOGO Offer Banner */}
              {selectedProduct.bogoOffer && (
                <div className="p-3.5 rounded-xl bg-violet-950/40 border border-violet-500/30 text-xs text-violet-300 flex items-center gap-2">
                  <Gift className="w-4 h-4 text-violet-400 shrink-0" />
                  <div>
                    <strong className="block text-white">Promotional Offer:</strong>
                    <span>{selectedProduct.bogoOffer}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Product Info Column */}
            <div className="space-y-5">
              <div>
                <div className="flex items-center gap-2 text-xs mb-2">
                  <div className="flex items-center gap-1 text-amber-400 font-bold">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span>{selectedProduct.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400 font-medium">
                    {selectedProduct.reviewsCount} customer reviews
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="text-emerald-400 font-semibold">
                    In Stock ({selectedProduct.stockCount} available)
                  </span>
                </div>

                <h1 className="font-heading font-black text-xl sm:text-2xl text-white leading-tight">
                  {selectedProduct.name}
                </h1>
              </div>

              {/* Price Box */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                {selectedProduct.originalPrice > selectedProduct.price && (
                  <span className="text-xs text-slate-500 line-through block">
                    {formatUSD(selectedProduct.originalPrice)}
                  </span>
                )}

                <div className="flex items-baseline gap-2">
                  <span className="font-heading font-black text-2xl sm:text-3xl text-white">
                    {formatUSD(selectedProduct.price)}
                  </span>
                  {selectedProduct.originalPrice > selectedProduct.price && (
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">
                      Save {formatUSD(selectedProduct.originalPrice - selectedProduct.price)}
                    </span>
                  )}
                </div>

                <div className="text-xs text-slate-400">
                  or 4 interest-free payments of <strong className="text-slate-200 font-mono">{formatUSD(payInFour)}</strong> with Klarna or Card
                </div>
              </div>

              {/* Short Description */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {selectedProduct.description}
              </p>

              {/* Specs Table */}
              <div className="space-y-2">
                <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-400">
                  Technical Specifications
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {selectedProduct.specs.map((spec, i) => (
                    <div key={i} className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                      <span className="text-slate-400 block text-[11px]">{spec.label}</span>
                      <strong className="text-white font-medium">{spec.value}</strong>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Estimator */}
              <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
                  <Truck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Estimate US Delivery</span>
                </div>

                <form onSubmit={handleSimulateShipping} className="flex gap-2">
                  <input
                    type="text"
                    value={zipInput}
                    onChange={(e) => setZipInput(formatZipCode(e.target.value))}
                    placeholder="Enter 5-digit ZIP"
                    maxLength={10}
                    className="w-36 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors"
                  >
                    Calculate
                  </button>
                </form>

                {shippingResult && (
                  <div className="pt-2 text-xs space-y-1 text-slate-300 border-t border-slate-800/80">
                    <div className="flex justify-between">
                      <span>Standard Ground ({shippingResult.standard.days} days):</span>
                      <strong className="font-mono text-emerald-400">
                        {shippingResult.standard.price === 0 ? 'FREE' : formatUSD(shippingResult.standard.price)}
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Express Priority (1-2 days):</span>
                      <strong className="font-mono text-white">
                        {formatUSD(shippingResult.priority.price)}
                      </strong>
                    </div>
                  </div>
                )}
              </div>

              {/* Purchase Actions */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-slate-700 bg-slate-950 rounded-xl px-2 py-1.5">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-white"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-sm font-bold text-white font-mono">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(selectedProduct.stockCount, quantity + 1))}
                      className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-white"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-colors shadow-md"
                  >
                    <ShoppingBag className="w-4 h-4 text-emerald-400" />
                    <span>Add to Cart</span>
                  </button>

                  <button
                    onClick={() => toggleWishlist(selectedProduct.id)}
                    className={`p-3 rounded-xl border transition-all ${
                      isFavorited
                        ? 'bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-500/20'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                    title={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
                  </button>
                </div>

                <button
                  onClick={handleBuyNow}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-heading font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
                >
                  <span>Buy Now with 1-Click</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
