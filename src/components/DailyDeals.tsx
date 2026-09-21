import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { PRODUCTS } from '../data/products';
import { Product } from '../types';
import { 
  Flame, 
  Clock, 
  Gift, 
  Zap, 
  Sparkles, 
  ShoppingBag, 
  Eye, 
  Check, 
  ArrowRight,
  TrendingUp,
  Tag,
  Timer
} from 'lucide-react';
import { formatUSD } from '../utils/formatters';

export const DailyDeals: React.FC = () => {
  const { addToCart, setSelectedProduct, isInWishlist, toggleWishlist } = useStore();
  const [activeTab, setActiveTab] = useState<'all' | 'flash' | 'bogo' | 'limited'>('all');

  // Live countdown timer calculation (14 hours, 32 mins, 45 seconds from now ticking down)
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 14,
    minutes: 32,
    seconds: 45,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          // Reset cycle
          return { hours: 23, minutes: 59, seconds: 59 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Filter deal products
  const dealProducts = PRODUCTS.filter((p) => {
    if (!p.dealType) return false;
    if (activeTab === 'flash') return p.dealType === 'flash_sale';
    if (activeTab === 'bogo') return p.dealType === 'bogo';
    if (activeTab === 'limited') return p.dealType === 'limited_drop';
    return true;
  });

  return (
    <section id="daily-deals" className="py-12 border-b border-slate-800/80 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        {/* Section Header with Countdown Card */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/20 border border-amber-500/30 shadow-xl shadow-amber-500/5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-rose-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>Limited-Time Daily Promotions & BOGO</span>
            </div>
            <h2 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight">
              HyperDeals & Flash Drops
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
              Hand-picked esports gear, flagship GPUs, and high-refresh OLED displays at unbeatable prices with manufacturer warranties.
            </p>
          </div>

          {/* Live Countdown Timer Block */}
          <div className="flex items-center gap-4 bg-slate-950/90 border border-amber-500/30 px-5 py-4 rounded-xl shrink-0 shadow-inner">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
              <Clock className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
              <span className="hidden sm:inline">Deals Refresh In:</span>
            </div>

            <div className="flex items-center gap-1.5 font-mono">
              <div className="flex flex-col items-center">
                <span className="px-2.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 font-black text-lg sm:text-xl min-w-[40px] text-center">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-[9px] text-slate-500 font-sans uppercase font-bold mt-1">Hours</span>
              </div>
              <span className="text-amber-400 font-black text-xl mb-3">:</span>

              <div className="flex flex-col items-center">
                <span className="px-2.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 font-black text-lg sm:text-xl min-w-[40px] text-center">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-[9px] text-slate-500 font-sans uppercase font-bold mt-1">Mins</span>
              </div>
              <span className="text-amber-400 font-black text-xl mb-3">:</span>

              <div className="flex flex-col items-center">
                <span className="px-2.5 py-1.5 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-400 font-black text-lg sm:text-xl min-w-[40px] text-center animate-pulse">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="text-[9px] text-slate-500 font-sans uppercase font-bold mt-1">Secs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Deals Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'all'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>All Daily Offers ({PRODUCTS.filter((p) => p.dealType).length})</span>
          </button>

          <button
            onClick={() => setActiveTab('flash')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'flash'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>⚡ Flash Sales</span>
          </button>

          <button
            onClick={() => setActiveTab('bogo')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'bogo'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Gift className="w-3.5 h-3.5" />
            <span>🎁 BOGO Offers (Buy 1 Get 1)</span>
          </button>

          <button
            onClick={() => setActiveTab('limited')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'limited'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>🔥 Limited Tech Drops</span>
          </button>
        </div>

        {/* Deals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dealProducts.map((product) => {
            const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
            const soldPct = product.unitsSoldPercentage || 75;

            return (
              <div
                key={product.id}
                className="group relative rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 shadow-lg hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 flex flex-col overflow-hidden"
              >
                {/* Top Deal Badge */}
                <div className="relative h-56 bg-slate-950/60 overflow-hidden flex items-center justify-center p-4">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Promo Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    {product.dealType === 'flash_sale' && (
                      <span className="px-2.5 py-1 rounded-md bg-gradient-to-r from-amber-500 to-rose-600 text-slate-950 font-heading font-black text-[11px] uppercase tracking-wider flex items-center gap-1 shadow-md">
                        <Zap className="w-3.5 h-3.5 fill-current" />
                        Flash Sale -{discount}%
                      </span>
                    )}

                    {product.dealType === 'bogo' && (
                      <span className="px-2.5 py-1 rounded-md bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-heading font-black text-[11px] uppercase tracking-wider flex items-center gap-1 shadow-md">
                        <Gift className="w-3.5 h-3.5" />
                        BOGO Deal
                      </span>
                    )}

                    {product.dealType === 'limited_drop' && (
                      <span className="px-2.5 py-1 rounded-md bg-rose-600 text-white font-heading font-black text-[11px] uppercase tracking-wider flex items-center gap-1 shadow-md">
                        <Flame className="w-3.5 h-3.5 fill-current" />
                        Limited Drop
                      </span>
                    )}
                  </div>

                  {/* Quick Action Overlay */}
                  <button
                    onClick={() => setSelectedProduct(product)}
                    className="absolute bottom-3 right-3 p-2 rounded-xl bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Quick Specs View"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>

                {/* Deal Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    {/* Brand & Stock count */}
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
                      <span className="font-semibold text-cyan-400">{product.brand}</span>
                      <span className="text-rose-400 font-bold">Only {product.stockCount} left in stock</span>
                    </div>

                    <h3 
                      onClick={() => setSelectedProduct(product)}
                      className="font-heading font-bold text-white text-sm line-clamp-2 cursor-pointer hover:text-amber-400 transition-colors"
                    >
                      {product.name}
                    </h3>

                    {/* BOGO offer callout if present */}
                    {product.bogoOffer && (
                      <div className="mt-2 p-2 rounded-lg bg-violet-950/40 border border-violet-500/30 text-[11px] text-violet-300 flex items-center gap-1.5">
                        <Gift className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                        <span className="font-bold">{product.bogoOffer}</span>
                      </div>
                    )}
                  </div>

                  {/* Progress Bar of Units Claimed */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-amber-400" />
                        Claimed
                      </span>
                      <span className="text-amber-400 font-bold font-mono">{soldPct}% reserved</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-500 to-rose-500 rounded-full transition-all duration-500"
                        style={{ width: `${soldPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Price & Add to Cart */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-end justify-between gap-3">
                    <div>
                      <span className="text-xs text-slate-500 line-through block">
                        {formatUSD(product.originalPrice)}
                      </span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-mono font-black text-xl text-emerald-400">
                          {formatUSD(product.price)}
                        </span>
                        <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded">
                          Save {formatUSD(product.originalPrice - product.price)}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => addToCart(product, 1)}
                      className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-heading font-black text-xs shadow-lg shadow-amber-500/20 flex items-center gap-1.5 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Claim Deal</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
