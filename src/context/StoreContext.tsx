import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, ShippingOption, Order, CustomerAddress, PaymentType } from '../types';
import { SHIPPING_OPTIONS, PRODUCTS } from '../data/products';
import confetti from 'canvas-confetti';

export interface Coupon {
  code: string;
  type: 'percent' | 'fixed' | 'free_shipping';
  value: number;
  minSubtotal?: number;
  description: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface StoreContextType {
  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  cartDiscount: number;
  cartShippingCost: number;
  cartTotal: number;
  addToCart: (product: Product, quantity?: number) => void;
  addAllToCart: (products: Product[]) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  
  // Coupon
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  // Shipping
  selectedShipping: ShippingOption;
  setSelectedShipping: (option: ShippingOption) => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  getShareableWishlistUrl: () => string;
  shareWishlist: () => Promise<boolean>;

  // Orders
  orders: Order[];
  createOrder: (data: {
    address: CustomerAddress;
    paymentType: PaymentType;
    paymentDetails?: Order['paymentDetails'];
  }) => Order;
  lastCompletedOrder: Order | null;
  setLastCompletedOrder: (order: Order | null) => void;

  // UI States
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isOrdersOpen: boolean;
  setIsOrdersOpen: (open: boolean) => void;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;

  // Toasts
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const AVAILABLE_COUPONS: Coupon[] = [
  { code: 'GAMER10', type: 'percent', value: 10, description: '10% OFF entire order' },
  { code: 'HYPER20', type: 'percent', value: 20, minSubtotal: 400, description: '20% OFF orders over $400' },
  { code: 'FREESHIP', type: 'free_shipping', value: 0, description: '100% Free Shipping anywhere' },
  { code: 'NEXUS50', type: 'fixed', value: 50, minSubtotal: 250, description: '$50 immediate discount on $250+' },
];

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Cart state with localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('hypergear_cart_usd');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist state with localStorage
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('hypergear_wishlist_usd');
      return saved ? JSON.parse(saved) : ['prod-1', 'prod-3']; // Default couple of favorites
    } catch {
      return ['prod-1', 'prod-3'];
    }
  });

  // Orders state with localStorage
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('hypergear_orders_usd');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption>(SHIPPING_OPTIONS[0]);

  // Modals state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [lastCompletedOrder, setLastCompletedOrder] = useState<Order | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Check URL query for shared wishlist on initial load
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const shared = params.get('shared_wishlist');
      if (shared) {
        const productIds = shared.split(',').filter((id) => PRODUCTS.some((p) => p.id === id));
        if (productIds.length > 0) {
          setWishlist((prev) => {
            const merged = Array.from(new Set([...prev, ...productIds]));
            return merged;
          });
          setIsWishlistOpen(true);
          addToast({
            title: 'Shared Wishlist Loaded!',
            message: `${productIds.length} item(s) from the shared link have been added to your wishlist.`,
            type: 'success',
          });
          // Clean the query parameter without reload
          const url = new URL(window.location.href);
          url.searchParams.delete('shared_wishlist');
          window.history.replaceState({}, '', url.toString());
        }
      }
    } catch (e) {
      console.warn('Could not read shared wishlist params', e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('hypergear_cart_usd', JSON.stringify(cart));
    } catch (err) {
      console.warn('Failed to save cart to localStorage', err);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('hypergear_wishlist_usd', JSON.stringify(wishlist));
    } catch (err) {
      console.warn('Failed to save wishlist to localStorage', err);
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem('hypergear_orders_usd', JSON.stringify(orders));
    } catch (err) {
      console.warn('Failed to save orders to localStorage', err);
    }
  }, [orders]);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, product.stockCount);
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: newQty } : item
        );
      }
      return [...prev, { product, quantity: Math.min(quantity, product.stockCount) }];
    });

    addToast({
      title: 'Added to Cart!',
      message: `${product.name} is now in your cart.`,
      type: 'success',
    });
  };

  const addAllToCart = (productsToAdd: Product[]) => {
    productsToAdd.forEach((p) => {
      addToCart(p, 1);
    });
    addToast({
      title: 'All Items Added to Cart!',
      message: `${productsToAdd.length} products added. Ready for checkout.`,
      type: 'success',
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          return { ...item, quantity: Math.min(quantity, item.product.stockCount) };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    addToast({
      title: 'Item Removed',
      message: 'Product removed from your cart.',
      type: 'info',
    });
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (code: string): { success: boolean; message: string } => {
    const trimmed = code.trim().toUpperCase();
    const found = AVAILABLE_COUPONS.find((c) => c.code === trimmed);

    if (!found) {
      return { success: false, message: 'Invalid or expired promo code. Try GAMER10, HYPER20, or FREESHIP.' };
    }

    if (found.minSubtotal && cartSubtotal < found.minSubtotal) {
      return {
        success: false,
        message: `Coupon valid on orders above $${found.minSubtotal.toFixed(2)}.`,
      };
    }

    setAppliedCoupon(found);
    addToast({
      title: 'Coupon Applied!',
      message: `${found.description}`,
      type: 'success',
    });
    return { success: true, message: 'Coupon applied successfully!' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    addToast({
      title: 'Coupon Removed',
      message: 'Promo discount removed.',
      type: 'info',
    });
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        addToast({
          title: 'Removed from Wishlist',
          message: 'Item removed from your personal favorites.',
          type: 'info',
        });
        return prev.filter((id) => id !== productId);
      } else {
        addToast({
          title: 'Saved to Wishlist!',
          message: 'Item saved. You can view or share your wishlist anytime.',
          type: 'success',
        });
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const clearWishlist = () => {
    setWishlist([]);
    addToast({
      title: 'Wishlist Cleared',
      message: 'All items removed from wishlist.',
      type: 'info',
    });
  };

  const getShareableWishlistUrl = () => {
    const baseUrl = window.location.origin + window.location.pathname;
    const url = new URL(baseUrl);
    url.searchParams.set('shared_wishlist', wishlist.join(','));
    return url.toString();
  };

  const shareWishlist = async (): Promise<boolean> => {
    const shareUrl = getShareableWishlistUrl();
    const shareData = {
      title: 'My HyperGear Gamer Wishlist',
      text: `Check out my top gaming gear and gadgets wishlist on HyperGear! (${wishlist.length} items)`,
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        addToast({
          title: 'Wishlist Shared!',
          message: 'Your wishlist was shared successfully.',
          type: 'success',
        });
        return true;
      } catch (e: any) {
        if (e.name !== 'AbortError') {
          // Fallback to clipboard
          await navigator.clipboard.writeText(shareUrl);
          addToast({
            title: 'Link Copied to Clipboard!',
            message: 'Share this link with friends so they can view your wishlist.',
            type: 'success',
          });
          return true;
        }
        return false;
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      addToast({
        title: 'Link Copied to Clipboard!',
        message: 'Share this link with friends so they can view your wishlist.',
        type: 'success',
      });
      return true;
    }
  };

  // Calculations in USD
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  let cartDiscount = 0;
  let cartShippingCost = selectedShipping.price;

  if (appliedCoupon) {
    if (appliedCoupon.type === 'percent') {
      cartDiscount = (cartSubtotal * appliedCoupon.value) / 100;
    } else if (appliedCoupon.type === 'fixed') {
      cartDiscount = Math.min(appliedCoupon.value, cartSubtotal);
    } else if (appliedCoupon.type === 'free_shipping') {
      cartShippingCost = 0;
    }
  }

  // Free standard ground shipping on orders >= $99
  if (cartSubtotal >= 99 && appliedCoupon?.type !== 'free_shipping') {
    if (selectedShipping.id === 'ship-2') {
      cartShippingCost = 0;
    }
  }

  const cartTotal = Math.max(0, cartSubtotal - cartDiscount + cartShippingCost);

  const createOrder = (data: {
    address: CustomerAddress;
    paymentType: PaymentType;
    paymentDetails?: Order['paymentDetails'];
  }): Order => {
    const orderNumber = Math.floor(100000 + Math.random() * 900000);
    const trackingCode = `HG-${orderNumber}-US`;
    
    const newOrder: Order = {
      id: `#HG-${orderNumber}`,
      date: new Date().toISOString(),
      items: [...cart],
      subtotal: cartSubtotal,
      discount: cartDiscount,
      shipping: selectedShipping,
      total: cartTotal,
      paymentType: data.paymentType,
      paymentDetails: data.paymentDetails,
      address: data.address,
      status: 'aprovado',
      trackingCode,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setLastCompletedOrder(newOrder);
    clearCart();

    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#10b981', '#06b6d4', '#8b5cf6', '#3b82f6', '#f59e0b'],
      });
    } catch {
      // Non-blocking
    }

    return newOrder;
  };

  return (
    <StoreContext.Provider
      value={{
        cart,
        cartCount,
        cartSubtotal,
        cartDiscount,
        cartShippingCost,
        cartTotal,
        addToCart,
        addAllToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        selectedShipping,
        setSelectedShipping,
        wishlist,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
        getShareableWishlistUrl,
        shareWishlist,
        orders,
        createOrder,
        lastCompletedOrder,
        setLastCompletedOrder,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isOrdersOpen,
        setIsOrdersOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        selectedProduct,
        setSelectedProduct,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
