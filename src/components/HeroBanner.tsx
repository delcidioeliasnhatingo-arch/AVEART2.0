import React from 'react';
import { ShieldCheck, Truck, CreditCard, Sparkles, Flame, ArrowRight, Gift } from 'lucide-react';
import { formatUSD } from '../utils/formatters';
import { useStore } from '../context/StoreContext';
import { PRODUCTS } from '../data/products';

interface HeroBannerProps {
  onExploreClick: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onExploreClick }) => {
  const { setSelectedProduct, addToCart } = useStore();
  const featuredProduct = PRODUCTS.find((p) => p.id === 'prod-1') || PRODUCTS[0];

  const scrollToDeals = () => {
    const el = document.getElementById('daily-deals');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden pt-4 pb-8 sm:py-8 border-b border-slate-800 bg-gradient-to-b from-slate-900/60 to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Main Grid Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Column: Headline & Value Proposition */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>FLAGSHIP 2026 DROPS • USD PRICING • US WARRANTY</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black tracking-tight text-white leading-tight">
              Next-Gen Electronics & Pro Gaming Hardware
            </h1>

            <p className="text-slate-400 text-sm sm:text-base max-w-xl leading-relaxed">
              Curated enthusiast gear engineered for esports champions and tech creators. High-refresh QD-OLED monitors, magnetic Hall Effect keyboards, RTX graphics, and limited-time BOGO flash deals.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onExploreClick}
                className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:translate-y-[-1px] active:translate-y-[1px]"
              >
                <span>Browse Full Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={scrollToDeals}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500/10 to-rose-500/10 hover:from-amber-500/20 hover:to-rose-500/20 text-amber-300 border border-amber-500/30 font-semibold text-sm transition-all flex items-center gap-2"
              >
                <Flame className="w-4 h-4 text-amber-400" />
                <span>View Daily Deals & BOGO</span>
              </button>
            </div>

            {/* Quick Micro Perks */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-300 border-t border-slate-800/80">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-emerald-400 shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-white">2-Year Warranty</p>
                  <p className="text-[11px] text-slate-400">Official coverage</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400 shrink-0">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-white">Free US Shipping</p>
                  <p className="text-[11px] text-slate-400">Orders over $99</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-amber-400 shrink-0">
                  <Gift className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-white">BOGO Offers</p>
                  <p className="text-[11px] text-slate-400">Bundle bonuses</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-violet-400 shrink-0">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-white">Pay in 4 (0% APR)</p>
                  <p className="text-[11px] text-slate-400">Klarna & Cards</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Featured Hardware Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 p-5 shadow-2xl hover:border-slate-700 transition-all">
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wide">
                    Featured Flagship
                  </span>
                  <span className="text-xs text-slate-400 font-mono">SKU: {featuredProduct.sku}</span>
                </div>
                <div className="text-xs font-semibold text-amber-400 flex items-center gap-1">
                  ★ {featuredProduct.rating.toFixed(1)} ({featuredProduct.reviewsCount})
                </div>
              </div>

              {/* Product Picture */}
              <div 
                className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 cursor-pointer group mb-4 border border-slate-800/80 flex items-center justify-center p-3"
                onClick={() => setSelectedProduct(featuredProduct)}
              >
                <img
                  src={featuredProduct.images[0]}
                  alt={featuredProduct.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                <span className="absolute bottom-2 left-2 px-2 py-1 rounded bg-slate-900/90 backdrop-blur text-[11px] text-cyan-300 font-medium border border-slate-700">
                  {featuredProduct.brand} • RTX 4080 Super 16GB
                </span>
              </div>

              {/* Title & Price in USD */}
              <h2 
                className="font-heading font-bold text-base text-white hover:text-emerald-400 cursor-pointer transition-colors line-clamp-2"
                onClick={() => setSelectedProduct(featuredProduct)}
              >
                {featuredProduct.name}
              </h2>

              <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 line-through">
                    {formatUSD(featuredProduct.originalPrice)}
                  </div>
                  <div className="text-xl font-heading font-extrabold text-emerald-400 font-mono">
                    {formatUSD(featuredProduct.price)}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    or 4 payments of {formatUSD(featuredProduct.price / 4)}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedProduct(featuredProduct)}
                    className="px-3 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => addToCart(featuredProduct, 1)}
                    className="px-4 py-2 text-xs font-bold rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors shadow-md shadow-emerald-500/20"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
