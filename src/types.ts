export type ProductCategory = 
  | 'todos'
  | 'hardware'
  | 'perifericos'
  | 'monitores'
  | 'gadgets'
  | 'consoles';

export interface ProductSpec {
  label: string;
  value: string;
}

export type DealType = 'flash_sale' | 'bogo' | 'limited_drop';

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  price: number; // in USD
  originalPrice: number; // in USD
  rating: number;
  reviewsCount: number;
  images: string[];
  description: string;
  shortDescription: string;
  specs: ProductSpec[];
  tags: string[];
  inStock: boolean;
  stockCount: number;
  isFeatured?: boolean;
  warranty: string;
  sku: string;
  // Daily Deals & Promotions fields
  dealType?: DealType;
  dealEndsAt?: string;
  bogoOffer?: string;
  discountPercentage?: number;
  unitsSoldPercentage?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ShippingOption {
  id: string;
  name: string;
  company: string;
  price: number; // in USD
  deadlineDays: number;
  highlight?: string;
}

export interface CustomerAddress {
  fullName: string;
  email: string;
  phone: string;
  cpf: string;
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
}

export type PaymentType = 'credit_card' | 'paypal' | 'apple_pay' | 'google_pay' | 'pix' | 'wallet';

export interface CreditCardData {
  number: string;
  holderName: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  installments: number;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: ShippingOption;
  total: number;
  paymentType: PaymentType;
  paymentDetails?: {
    pixCode?: string;
    pixQrUrl?: string;
    boletoBarcode?: string;
    boletoDueDate?: string;
    cardLast4?: string;
    cardBrand?: string;
    installments?: number;
    paypalEmail?: string;
  };
  address: CustomerAddress;
  status: 'aprovado' | 'separacao' | 'enviado' | 'entregue';
  trackingCode: string;
}

export type SortOption = 
  | 'relevance'
  | 'price_asc'
  | 'price_desc'
  | 'rating_desc'
  | 'discount_desc';

export interface FilterState {
  search: string;
  category: ProductCategory;
  brand: string;
  minPrice: number;
  maxPrice: number;
  inStockOnly: boolean;
  freeShippingOnly: boolean;
  minRating: number;
  sortBy: SortOption;
  onlyDeals?: boolean;
}
