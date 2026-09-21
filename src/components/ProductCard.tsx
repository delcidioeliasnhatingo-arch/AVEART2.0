import React from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { formatUSD } from '../utils/formatters';
import { Heart, ShoppingBag, Eye, Star, Zap, Check, Gift, Flame } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    setSelectedProduct,
    cart 
  } = useStore();

  const isFavorited = isInWishlist(product.id);
  const cartItem = cart.find((i) => i.product.id === product.id);
  const isInCart = Boolean(cartItem);

  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  const payInFour = product.price / 4;

  return (
    <div className="group rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all duration-300 flex flex-col justify-between overflow-hidden hover:shadow-xl hover:shadow-emerald-950/20">
      <div>
        {/* Thumbnail Area */}
        <div className="relative aspect-square w-full bg-slate-950 overflow-hidden flex items-center justify-center p-4">
          <img
            src={product.images[0]}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
          />

          {/* Top Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
            {discountPercent > 0 && (
              <span className="px-2 py-0.5 rounded-md bg-emerald-500 text-slate-950 font-heading font-black text-xs shadow-md">
                -{discountPercent}% OFF
              </span>
            )}

            {product.dealType === 'bogo' && (
              <span className="px-2 py-0.5 rounded-md bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-heading font-black text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-md">
                <Gift className="w-3 h-3" />
                BOGO
              </span>
            )}

            {product.dealType === 'flash_sale' && (
              <span className="px-2 py-0.5 rounded-md bg-gradient-to-r from-amber-500 to-rose-600 text-slate-950 font-heading font-black text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-md">
                <Flame className="w-3 h-3 fill-current" />
                Flash Deal
              </span>
            )}

            {product.tags.filter(t => !['Daily Deal', 'BOGO Offer'].includes(t)).slice(0, 1).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-md bg-slate-900/90 backdrop-blur border border-slate-700 text-cyan-300 text-[10px] font-bold uppercase tracking-wider"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Quick Action Top Right */}
          <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleWishlist(product.id);
              }}
              className={`p-2 rounded-full backdrop-blur-md transition-all ${
                isFavorited
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title={isFavorited ? 'Remove from wishlist' : 'Save to wishlist'}
            >
              <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={() => setSelectedProduct(product)}
              className="p-2 rounded-full bg-slate-900/80 backdrop-blur-md text-slate-400 hover:text-white hover:bg-slate-800 transition-all opacity-0 group-hover:opacity-100 hidden sm:flex items-center justify-center"
              title="Quick Specs Preview"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>

          {/* Stock Indicator */}
          {product.stockCount <= 5 && product.stockCount > 0 && (
            <div className="absolute bottom-2 left-2 right-2 bg-amber-950/90 border border-amber-500/30 px-2 py-1 rounded text-[11px] text-amber-300 font-medium flex items-center gap-1.5 backdrop-blur-sm">
              <Zap className="w-3 h-3 text-amber-400 shrink-0" />
              <span>Only {product.stockCount} units left in stock!</span>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="p-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-cyan-400 tracking-wide uppercase text-[11px]">
              {product.brand}
            </span>
            <div className="flex items-center gap-1 text-amber-400 font-bold text-xs">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{product.rating.toFixed(1)}</span>
              <span className="text-slate-500 font-normal">({product.reviewsCount})</span>
            </div>
          </div>

          <h3 
            onClick={() => setSelectedProduct(product)}
            className="font-heading font-bold text-sm text-white line-clamp-2 hover:text-emerald-400 cursor-pointer transition-colors leading-snug"
          >
            {product.name}
          </h3>

          <p className="text-xs text-slate-400 line-clamp-1">
            {product.shortDescription}
          </p>

          {/* Pricing Section */}
          <div className="pt-2">
            {product.originalPrice > product.price && (
              <span className="text-xs text-slate-500 line-through block">
                {formatUSD(product.originalPrice)}
              </span>
            )}
            
            <div className="flex items-baseline gap-2">
              <span className="font-heading font-black text-xl text-white">
                {formatUSD(product.price)}
              </span>
              {discountPercent > 0 && (
                <span className="text-[11px] font-bold text-emerald-400">
                  Save {formatUSD(product.originalPrice - product.price)}
                </span>
              )}
            </div>

            <div className="text-[11px] text-slate-400 mt-0.5">
              or 4 interest-free payments of <strong className="text-slate-300 font-mono">{formatUSD(payInFour)}</strong>
            </div>

            {/* BOGO Offer Banner if applicable */}
            {product.bogoOffer && (
              <div className="mt-1.5 p-1.5 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-300 flex items-center gap-1.5 text-xs">
                <Gift className="w-3 h-3 text-violet-400 shrink-0" />
                <span className="font-bold text-[10px] truncate">{product.bogoOffer}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="p-4 pt-0">
        <div className="grid grid-cols-5 gap-2">
          <button
            onClick={() => setSelectedProduct(product)}
            className="col-span-2 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center justify-center"
          >
            Details
          </button>

          <button
            onClick={() => addToCart(product, 1)}
            className={`col-span-3 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 ${
              isInCart
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
            }`}
          >
            {isInCart ? (
              <>
                <Check className="w-4 h-4" />
                <span>In Cart ({cartItem?.quantity})</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
