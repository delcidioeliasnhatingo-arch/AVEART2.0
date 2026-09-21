import React from 'react';
import { FilterState, ProductCategory, SortOption } from '../types';
import { BRANDS_LIST, CATEGORIES_LIST } from '../data/products';
import { SlidersHorizontal, RotateCcw, Check, Star, Flame, Gift } from 'lucide-react';
import { formatUSD } from '../utils/formatters';

interface ProductFiltersProps {
  filters: FilterState;
  onChange: (updater: (prev: FilterState) => FilterState) => void;
  onReset: () => void;
  totalResults: number;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  onChange,
  onReset,
  totalResults,
}) => {
  const activeFiltersCount = [
    filters.category !== 'todos',
    filters.brand !== 'Todas',
    filters.minPrice > 0,
    filters.maxPrice < 1500,
    filters.inStockOnly,
    filters.freeShippingOnly,
    filters.minRating > 0,
    filters.onlyDeals,
  ].filter(Boolean).length;

  return (
    <aside aria-label="Product filters" className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
          <h2 className="font-heading font-bold text-sm text-white uppercase tracking-wider">
            Filters
          </h2>
          {activeFiltersCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 font-bold text-[10px] flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </div>

        {activeFiltersCount > 0 && (
          <button
            onClick={onReset}
            className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1 transition-colors"
            title="Reset all filters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Quick Count */}
      <div className="text-xs text-slate-400 font-medium">
        Showing <span className="text-white font-bold">{totalResults}</span> tech items
      </div>

      {/* Special Deals Quick Toggle */}
      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={Boolean(filters.onlyDeals)}
            onChange={(e) =>
              onChange((prev) => ({
                ...prev,
                onlyDeals: e.target.checked,
              }))
            }
            className="w-4 h-4 rounded bg-slate-800 border-amber-500/40 text-amber-500 focus:ring-amber-500/20 focus:ring-offset-0 cursor-pointer"
          />
          <div className="flex items-center gap-1.5 text-xs text-amber-300 font-bold">
            <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Daily Deals & BOGO Only</span>
          </div>
        </label>
      </div>

      {/* Category Selection */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
          Category
        </label>
        <div className="space-y-1">
          {CATEGORIES_LIST.map((cat) => {
            const isSelected = filters.category === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() =>
                  onChange((prev) => ({
                    ...prev,
                    category: cat.id as ProductCategory,
                  }))
                }
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                  isSelected
                    ? 'bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <span>{cat.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Brand Selection */}
      <div className="space-y-2 pt-2 border-t border-slate-800">
        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
          Brand
        </label>
        <div className="grid grid-cols-2 gap-1 max-h-48 overflow-y-auto pr-1">
          {BRANDS_LIST.map((brand) => {
            const isSelected = filters.brand === brand;
            return (
              <button
                key={brand}
                onClick={() =>
                  onChange((prev) => ({
                    ...prev,
                    brand: brand,
                  }))
                }
                className={`px-2 py-1.5 rounded-lg text-xs text-left truncate transition-colors ${
                  isSelected
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {brand}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Slider in USD */}
      <div className="space-y-3 pt-2 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Price Range (USD)
          </label>
          <span className="text-xs font-bold text-emerald-400 font-mono">
            Up to {formatUSD(filters.maxPrice)}
          </span>
        </div>

        <input
          type="range"
          min="50"
          max="1500"
          step="25"
          value={filters.maxPrice}
          onChange={(e) =>
            onChange((prev) => ({
              ...prev,
              maxPrice: Number(e.target.value),
            }))
          }
          className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
        />

        <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>$50</span>
          <span>$1,500+</span>
        </div>
      </div>

      {/* Minimum Rating */}
      <div className="space-y-2 pt-2 border-t border-slate-800">
        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
          Minimum Rating
        </label>
        <div className="grid grid-cols-3 gap-1">
          {[
            { value: 0, label: 'All' },
            { value: 4.5, label: '4.5+ ★' },
            { value: 4.9, label: '4.9+ ★' },
          ].map((item) => {
            const isSelected = filters.minRating === item.value;
            return (
              <button
                key={item.value}
                onClick={() =>
                  onChange((prev) => ({
                    ...prev,
                    minRating: item.value,
                  }))
                }
                className={`py-1.5 px-2 rounded-lg text-xs font-medium text-center transition-colors ${
                  isSelected
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                    : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Checkboxes / Toggles */}
      <div className="space-y-2.5 pt-2 border-t border-slate-800">
        <label className="flex items-center gap-2.5 cursor-pointer select-none group">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) =>
              onChange((prev) => ({
                ...prev,
                inStockOnly: e.target.checked,
              }))
            }
            className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-emerald-500 focus:ring-emerald-500/20 focus:ring-offset-0 cursor-pointer"
          />
          <span className="text-xs text-slate-300 group-hover:text-white font-medium">
            In Stock Only (Immediate dispatch)
          </span>
        </label>

        <label className="flex items-center gap-2.5 cursor-pointer select-none group">
          <input
            type="checkbox"
            checked={filters.freeShippingOnly}
            onChange={(e) =>
              onChange((prev) => ({
                ...prev,
                freeShippingOnly: e.target.checked,
              }))
            }
            className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-emerald-500 focus:ring-emerald-500/20 focus:ring-offset-0 cursor-pointer"
          />
          <span className="text-xs text-slate-300 group-hover:text-white font-medium">
            Free Shipping Eligible
          </span>
        </label>
      </div>

      {/* Sorting Control */}
      <div className="space-y-2 pt-2 border-t border-slate-800">
        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
          Sort By
        </label>
        <select
          value={filters.sortBy}
          onChange={(e) =>
            onChange((prev) => ({
              ...prev,
              sortBy: e.target.value as SortOption,
            }))
          }
          className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
        >
          <option value="relevance">Featured & Relevant</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating_desc">Highest Rated</option>
          <option value="discount_desc">Biggest Discount (%)</option>
        </select>
      </div>
    </aside>
  );
};
