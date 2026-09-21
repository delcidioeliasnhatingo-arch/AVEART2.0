import React from 'react';
import { 
  Gamepad2, 
  Search, 
  ShoppingBag, 
  Heart, 
  Package, 
  ShieldCheck, 
  Zap, 
  X,
  Truck,
  Sparkles,
  Cpu,
  Keyboard,
  Monitor,
  Flame,
  Tag
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatUSD } from '../utils/formatters';
import { ProductCategory } from '../types';
import { CATEGORIES_LIST } from '../data/products';

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: ProductCategory;
  onSelectCategory: (cat: ProductCategory) => void;
  onScrollToDeals?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  onScrollToDeals,
}) => {
  const { 
    cartCount, 
    cartTotal, 
    setIsCartOpen, 
    wishlist, 
    setIsWishlistOpen, 
    orders, 
    setIsOrdersOpen 
  } = useStore();

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu': return <Cpu className="w-4 h-4" />;
      case 'Keyboard': return <Keyboard className="w-4 h-4" />;
      case 'Monitor': return <Monitor className="w-4 h-4" />;
      case 'Zap': return <Zap className="w-4 h-4" />;
      case 'Gamepad2': return <Gamepad2 className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  const handleDealsClick = () => {
    if (onScrollToDeals) {
      onScrollToDeals();
    } else {
      const el = document.getElementById('daily-deals');
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/95 backdrop-blur-md border-b border-slate-800 shadow-xl">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-amber-950/60 border-b border-emerald-500/20 text-xs py-1.5 px-4 text-slate-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span className="font-semibold text-amber-400">DAILY PROMOS:</span>
            <span className="text-slate-300 hidden sm:inline">Up to 40% OFF Flash Drops • Coupon <strong className="text-white font-mono bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">GAMER10</strong></span>
            <span className="text-slate-400 hidden md:inline">• All prices in USD ($)</span>
          </div>

          <div className="flex items-center gap-4 shrink-0 text-slate-400 text-xs">
            <button
              onClick={handleDealsClick}
              className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-bold transition-colors cursor-pointer"
            >
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>Daily Deals & BOGO</span>
            </button>
            <span className="hidden lg:flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" /> 256-Bit SSL Checkout
            </span>
            <span className="hidden sm:flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-cyan-400" /> Free Shipping over $99
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Logo */}
        <div 
          onClick={() => {
            onSelectCategory('todos');
            onSearchChange('');
          }}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Gamepad2 className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-black text-2xl tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                HYPER<span className="text-cyan-400">GEAR</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded">
                USD
              </span>
            </div>
            <p className="text-[11px] text-slate-400 tracking-wide font-medium -mt-1 hidden sm:block">
              Flagship Electronics & Gaming Tech
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl mx-2 sm:mx-6">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search RTX 4080 Super, OLED 240Hz, Rapid Trigger, microphones..."
              className="w-full pl-10 pr-9 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Daily Deals Quick Button */}
          <button
            onClick={handleDealsClick}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold transition-all hover:scale-105"
            title="View Daily Deals with Countdown Timer"
          >
            <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>Deals</span>
          </button>

          {/* Orders Tracking */}
          <button
            onClick={() => setIsOrdersOpen(true)}
            className="relative p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all flex items-center gap-2 group"
            title="My Orders & Tracking"
          >
            <Package className="w-5 h-5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
            <span className="text-xs font-semibold hidden md:inline">Orders</span>
            {orders.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-cyan-500 text-slate-950 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {orders.length}
              </span>
            )}
          </button>

          {/* Wishlist Button with Share Badge */}
          <button
            onClick={() => setIsWishlistOpen(true)}
            className="relative p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all flex items-center gap-2 group"
            title="View and Share Wishlist"
          >
            <Heart className={`w-5 h-5 transition-colors ${wishlist.length > 0 ? 'text-rose-500 fill-rose-500' : 'text-slate-400 group-hover:text-rose-400'}`} />
            <span className="text-xs font-semibold hidden md:inline">Wishlist</span>
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2.5 py-2 px-3 sm:px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl shadow-lg shadow-emerald-950 font-medium transition-all group active:scale-95"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 group-hover:rotate-6 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-slate-950 text-emerald-400 border border-emerald-500 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-[10px] uppercase font-bold text-emerald-200 leading-none">Cart</div>
              <div className="text-xs font-bold leading-tight mt-0.5">{formatUSD(cartTotal)}</div>
            </div>
          </button>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="bg-slate-900/60 border-t border-slate-800/80 px-4 py-2 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 sm:gap-2">
            {CATEGORIES_LIST.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id as ProductCategory)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/80'
                  }`}
                >
                  {getCategoryIcon(cat.icon)}
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={handleDealsClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 transition-all shrink-0"
          >
            <Flame className="w-3.5 h-3.5 animate-pulse" />
            <span>Daily Flash Deals & BOGO</span>
          </button>
        </div>
      </div>
    </header>
  );
};
