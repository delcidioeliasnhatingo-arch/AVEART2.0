import React, { useState, useMemo, useRef } from 'react';
import { StoreProvider } from './context/StoreContext';
import { PRODUCTS } from './data/products';
import { FilterState, ProductCategory } from './types';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { DailyDeals } from './components/DailyDeals';
import { ProductFilters } from './components/ProductFilters';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { OrdersModal } from './components/OrdersModal';
import { WishlistModal } from './components/WishlistModal';
import { ToastContainer } from './components/ToastContainer';
import { Footer } from './components/Footer';
import { SlidersHorizontal, X, AlertCircle } from 'lucide-react';

const INITIAL_FILTERS: FilterState = {
  search: '',
  category: 'todos',
  brand: 'Todas',
  minPrice: 0,
  maxPrice: 1500,
  inStockOnly: false,
  freeShippingOnly: false,
  minRating: 0,
  sortBy: 'relevance',
  onlyDeals: false,
};

const MainStoreContent: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const catalogRef = useRef<HTMLDivElement>(null);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // Search term
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase().trim();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesBrand = product.brand.toLowerCase().includes(query);
        const matchesDesc = product.shortDescription.toLowerCase().includes(query);
        const matchesSku = product.sku.toLowerCase().includes(query);
        const matchesTag = product.tags.some((t) => t.toLowerCase().includes(query));
        if (!matchesName && !matchesBrand && !matchesDesc && !matchesSku && !matchesTag) {
          return false;
        }
      }

      // Deals only filter
      if (filters.onlyDeals && !product.dealType) {
        return false;
      }

      // Category
      if (filters.category !== 'todos' && product.category !== filters.category) {
        return false;
      }

      // Brand
      if (filters.brand !== 'Todas' && product.brand !== filters.brand) {
        return false;
      }

      // Price (USD)
      if (product.price < filters.minPrice || product.price > filters.maxPrice) {
        return false;
      }

      // In stock
      if (filters.inStockOnly && !product.inStock) {
        return false;
      }

      // Free shipping
      if (filters.freeShippingOnly && !product.tags.includes('Free Shipping') && !product.tags.includes('Frete Grátis')) {
        return false;
      }

      // Rating
      if (product.rating < filters.minRating) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      switch (filters.sortBy) {
        case 'price_asc':
          return a.price - b.price;
        case 'price_desc':
          return b.price - a.price;
        case 'rating_desc':
          return b.rating - a.rating;
        case 'discount_desc': {
          const discountA = (a.originalPrice - a.price) / a.originalPrice;
          const discountB = (b.originalPrice - b.price) / b.originalPrice;
          return discountB - discountA;
        }
        case 'relevance':
        default:
          return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      }
    });
  }, [filters]);

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  const scrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToDeals = () => {
    const el = document.getElementById('daily-deals');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Navigation Header */}
      <Header
        searchTerm={filters.search}
        onSearchChange={(search) => setFilters((prev) => ({ ...prev, search }))}
        selectedCategory={filters.category}
        onSelectCategory={(category) => {
          setFilters((prev) => ({ ...prev, category }));
          scrollToCatalog();
        }}
        onScrollToDeals={scrollToDeals}
      />

      {/* Hero Presentation */}
      <HeroBanner onExploreClick={scrollToCatalog} />

      {/* Dedicated Daily Deals & Promotions Section */}
      <DailyDeals />

      {/* Main Catalog Area */}
      <main ref={catalogRef} className="max-w-7xl mx-auto px-4 sm:px-6 py-10 flex-1 w-full">
        {/* Active Filter Chips & Mobile Trigger */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2">
            <h2 className="font-heading font-black text-xl sm:text-2xl text-white">
              {filters.category === 'todos' ? 'All Gaming Hardware & Tech' : `Category: ${filters.category.toUpperCase()}`}
            </h2>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-emerald-400">
              {filteredProducts.length} items
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-200 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
              <span>Filters ({filteredProducts.length})</span>
            </button>
          </div>
        </div>

        {/* Active Chips Strip */}
        {(filters.brand !== 'Todas' || filters.category !== 'todos' || filters.inStockOnly || filters.freeShippingOnly || filters.search || filters.onlyDeals) && (
          <div className="flex flex-wrap items-center gap-2 mb-6 p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 text-xs">
            <span className="text-slate-400 font-semibold">Active filters:</span>

            {filters.search && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 text-white border border-slate-700">
                Search: "{filters.search}"
                <X
                  className="w-3 h-3 cursor-pointer hover:text-rose-400"
                  onClick={() => setFilters((p) => ({ ...p, search: '' }))}
                />
              </span>
            )}

            {filters.onlyDeals && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                Deals & BOGO Only
                <X
                  className="w-3 h-3 cursor-pointer hover:text-rose-400"
                  onClick={() => setFilters((p) => ({ ...p, onlyDeals: false }))}
                />
              </span>
            )}

            {filters.category !== 'todos' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                {filters.category}
                <X
                  className="w-3 h-3 cursor-pointer hover:text-rose-400"
                  onClick={() => setFilters((p) => ({ ...p, category: 'todos' }))}
                />
              </span>
            )}

            {filters.brand !== 'Todas' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-semibold">
                Brand: {filters.brand}
                <X
                  className="w-3 h-3 cursor-pointer hover:text-rose-400"
                  onClick={() => setFilters((p) => ({ ...p, brand: 'Todas' }))}
                />
              </span>
            )}

            {filters.inStockOnly && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 border border-slate-700">
                In Stock Only
                <X
                  className="w-3 h-3 cursor-pointer hover:text-rose-400"
                  onClick={() => setFilters((p) => ({ ...p, inStockOnly: false }))}
                />
              </span>
            )}

            {filters.freeShippingOnly && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 border border-slate-700">
                Free Shipping
                <X
                  className="w-3 h-3 cursor-pointer hover:text-rose-400"
                  onClick={() => setFilters((p) => ({ ...p, freeShippingOnly: false }))}
                />
              </span>
            )}

            <button
              onClick={handleResetFilters}
              className="text-xs text-slate-400 hover:text-rose-400 underline ml-auto transition-colors"
            >
              Reset All
            </button>
          </div>
        )}

        {/* Layout Grid: Sidebar Filters + Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block lg:col-span-3 sticky top-36">
            <ProductFilters
              filters={filters}
              onChange={setFilters}
              onReset={handleResetFilters}
              totalResults={filteredProducts.length}
            />
          </div>

          {/* Products Grid Column */}
          <div className="lg:col-span-9">
            {filteredProducts.length === 0 ? (
              <div className="p-12 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-heading font-bold text-white">
                  No products found matching your filters
                </h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Try widening your price range, selecting another brand, or clearing search keywords.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mobile Filters Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden overflow-hidden">
          <div
            onClick={() => setIsMobileFilterOpen(false)}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
          />
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-slate-900 border-l border-slate-800 shadow-2xl p-4 overflow-y-auto flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <span className="font-heading font-bold text-sm text-white">Filters</span>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <ProductFilters
              filters={filters}
              onChange={setFilters}
              onReset={handleResetFilters}
              totalResults={filteredProducts.length}
            />
            <div className="mt-4 pt-4 border-t border-slate-800">
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs text-center"
              >
                Show {filteredProducts.length} Results
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Modals & Notifications */}
      <ProductDetailModal />
      <CartDrawer />
      <CheckoutModal />
      <OrderSuccessModal />
      <OrdersModal />
      <WishlistModal />
      <ToastContainer />

      {/* Institutional Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainStoreContent />
    </StoreProvider>
  );
}
