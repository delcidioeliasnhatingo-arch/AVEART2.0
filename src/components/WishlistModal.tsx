import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { PRODUCTS } from '../data/products';
import { 
  X, 
  Heart, 
  ShoppingBag, 
  Trash2, 
  Share2, 
  Copy, 
  Check, 
  ExternalLink,
  Sparkles,
  Send
} from 'lucide-react';
import { formatUSD } from '../utils/formatters';

export const WishlistModal: React.FC = () => {
  const { 
    isWishlistOpen, 
    setIsWishlistOpen, 
    wishlist, 
    toggleWishlist, 
    clearWishlist,
    addToCart, 
    addAllToCart,
    getShareableWishlistUrl,
    shareWishlist,
    addToast 
  } = useStore();

  const [copiedLink, setCopiedLink] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);

  if (!isWishlistOpen) return null;

  const favoritedProducts = PRODUCTS.filter((p) => wishlist.includes(p.id));
  const totalValue = favoritedProducts.reduce((acc, p) => acc + p.price, 0);

  const handleCopyLink = async () => {
    const url = getShareableWishlistUrl();
    await navigator.clipboard.writeText(url);
    setCopiedLink(true);
    addToast({
      title: 'Wishlist Link Copied!',
      message: 'Anyone with this link can view and import your chosen gear.',
      type: 'success',
    });
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleShareWhatsApp = () => {
    const url = encodeURIComponent(getShareableWishlistUrl());
    const text = encodeURIComponent(`Check out my HyperGear gaming setup wishlist (${wishlist.length} items): `);
    window.open(`https://api.whatsapp.com/send?text=${text}${url}`, '_blank');
  };

  const handleShareTwitter = () => {
    const url = encodeURIComponent(getShareableWishlistUrl());
    const text = encodeURIComponent(`Here's my dream gaming gear wishlist on @HyperGear! 🎮✨ `);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm p-3 sm:p-6 flex items-center justify-center">
      <div 
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <h2 className="font-heading font-bold text-base text-white">
              Personal Gaming Wishlist
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-bold">
              {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {wishlist.length > 0 && (
              <button
                onClick={() => setShowShareOptions(!showShareOptions)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  showShareOptions 
                    ? 'bg-cyan-500 text-slate-950' 
                    : 'bg-slate-800 hover:bg-slate-700 text-cyan-400'
                }`}
                title="Share Wishlist with Friends"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Wishlist</span>
              </button>
            )}

            <button
              onClick={() => setIsWishlistOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Share Options Panel */}
        {showShareOptions && wishlist.length > 0 && (
          <div className="p-4 bg-gradient-to-r from-cyan-950/40 via-slate-900 to-slate-950 border-b border-cyan-500/30 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Share your curated wishlist with friends & teammates
              </span>
              <span className="text-slate-400 text-[11px]">Instant live sync link</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex-1 min-w-[220px] relative">
                <input
                  type="text"
                  readOnly
                  value={getShareableWishlistUrl()}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-300 font-mono pr-20 select-all"
                />
                <button
                  onClick={handleCopyLink}
                  className="absolute right-1 top-1 bottom-1 px-2.5 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-[11px] flex items-center gap-1 transition-colors"
                >
                  {copiedLink ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <button
                onClick={handleShareWhatsApp}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Send className="w-3 h-3" />
                <span>WhatsApp</span>
              </button>

              <button
                onClick={handleShareTwitter}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                <span>X / Twitter</span>
              </button>
            </div>
          </div>
        )}

        {/* List of Products */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {favoritedProducts.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
                <Heart className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-white">Your wishlist is currently empty</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Click the heart icon on any gear or gadget to save it to your personal wishlist and share with friends.
              </p>
            </div>
          ) : (
            favoritedProducts.map((product) => (
              <div
                key={product.id}
                className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 flex items-center justify-between gap-4 text-xs transition-colors"
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 rounded-lg object-contain bg-slate-900 border border-slate-800 shrink-0 p-1"
                />

                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-white truncate text-xs">{product.name}</h4>
                  <p className="text-[11px] text-cyan-400">{product.brand}</p>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-xs font-bold text-emerald-400 font-mono">
                      {formatUSD(product.price)}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-[10px] text-slate-500 line-through">
                        {formatUSD(product.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => addToCart(product, 1)}
                    className="py-2 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md shadow-emerald-500/10"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        {favoritedProducts.length > 0 && (
          <div className="p-4 sm:p-6 border-t border-slate-800 bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <span className="text-slate-400 text-xs">Total Wishlist Value:</span>
              <p className="font-mono font-black text-lg text-emerald-400">
                {formatUSD(totalValue)}
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={clearWishlist}
                className="px-3 py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-rose-400 text-xs font-semibold transition-colors"
              >
                Clear All
              </button>

              <button
                onClick={() => {
                  addAllToCart(favoritedProducts);
                  setIsWishlistOpen(false);
                }}
                className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-heading font-black text-xs shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-1.5 transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add All to Cart</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
