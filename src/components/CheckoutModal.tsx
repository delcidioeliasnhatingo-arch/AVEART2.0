import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  CreditCard as CreditCardIcon, 
  Smartphone, 
  Check, 
  Copy, 
  AlertCircle, 
  ArrowRight,
  Truck,
  User,
  Sparkles,
  Zap,
  Clock,
  ExternalLink,
  Wallet
} from 'lucide-react';
import { 
  formatUSD, 
  formatZipCode, 
  formatCardNumber, 
  formatExpiryDate, 
  formatPhone, 
  detectCardBrand, 
  getInstallmentsOptions 
} from '../utils/formatters';
import { CustomerAddress, PaymentType, CreditCardData } from '../types';
import { SHIPPING_OPTIONS } from '../data/products';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotal,
    cartDiscount,
    cartShippingCost,
    selectedShipping,
    setSelectedShipping,
    appliedCoupon,
    createOrder,
    addToast,
  } = useStore();

  // Current checkout tab: 'details' -> 'payment'
  const [activeStep, setActiveStep] = useState<'details' | 'payment'>('details');

  // Customer & Address State in USD
  const [address, setAddress] = useState<CustomerAddress>({
    fullName: '',
    email: '',
    phone: '',
    cpf: '123-45-6789', // SSN/Tax ID placeholder for compatibility
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: 'CA',
  });

  // Payment Selection
  const [paymentType, setPaymentType] = useState<PaymentType>('credit_card');

  // Credit Card Form State
  const [cardData, setCardData] = useState<CreditCardData>({
    number: '',
    holderName: '',
    expiryMonth: '12',
    expiryYear: '28',
    cvv: '',
    installments: 1,
  });
  const [cardFocusedField, setCardFocusedField] = useState<'number' | 'holder' | 'expiry' | 'cvv' | null>(null);

  // Processing loader state
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Auto-fill example data for instant testing
  const handleAutoFillTest = () => {
    setAddress({
      fullName: 'Alex Mercer',
      email: 'alex.mercer@hypergear.com',
      phone: '(415) 892-4102',
      cpf: '984-21-5082',
      cep: '94107',
      street: '450 Townsend Street',
      number: 'Suite 200',
      complement: 'Floor 2',
      neighborhood: 'SoMa',
      city: 'San Francisco',
      state: 'CA',
    });
    setCardData({
      number: '4242 4242 4242 4242',
      holderName: 'ALEX MERCER',
      expiryMonth: '08',
      expiryYear: '28',
      cvv: '884',
      installments: 1,
    });
    setValidationError('');
    addToast({
      title: 'Demo Data Injected',
      message: 'Checkout fields filled with realistic US test shipping and billing data.',
      type: 'info',
    });
  };

  if (!isCheckoutOpen) return null;

  // Subtotal calculations
  const totalAmount = Math.max(0, cartSubtotal - cartDiscount + cartShippingCost);
  const cardBrand = detectCardBrand(cardData.number);
  const installmentOptions = getInstallmentsOptions(totalAmount);

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!address.fullName.trim()) {
      setValidationError('Please enter your full name.');
      return;
    }
    if (!address.email.includes('@')) {
      setValidationError('Please enter a valid email address.');
      return;
    }
    if (!address.street.trim() || !address.city.trim() || !address.cep.trim()) {
      setValidationError('Please provide a complete shipping address and ZIP code.');
      return;
    }

    setActiveStep('payment');
  };

  const handleFinalizeOrder = () => {
    setValidationError('');

    if (paymentType === 'credit_card') {
      const cleanCard = cardData.number.replace(/\s/g, '');
      if (cleanCard.length < 15) {
        setValidationError('Please enter a valid 15 or 16-digit credit card number.');
        return;
      }
      if (!cardData.holderName.trim()) {
        setValidationError('Please enter the cardholder name as printed on the card.');
        return;
      }
      if (cardData.cvv.length < 3) {
        setValidationError('Please enter a 3 or 4-digit security code (CVV).');
        return;
      }
    }

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsCheckoutOpen(false);

      const paymentDetails = 
        paymentType === 'credit_card'
          ? {
              cardLast4: cardData.number.slice(-4) || '4242',
              cardBrand,
              installments: cardData.installments,
            }
          : paymentType === 'paypal'
          ? {
              paypalEmail: address.email,
            }
          : undefined;

      createOrder({
        address,
        paymentType,
        paymentDetails,
      });
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md p-3 sm:p-6 flex items-center justify-center">
      <div 
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-heading font-black text-base text-white flex items-center gap-2">
                <span>HyperGear Secure Checkout</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  256-BIT SSL
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">All transactions processed in US Dollars (USD)</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAutoFillTest}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Auto-fill sample US test address and card"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Fill Demo Info</span>
            </button>

            <button
              onClick={() => setIsCheckoutOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Step Progression Bar */}
        <div className="bg-slate-950 px-6 py-3 border-b border-slate-800/80 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-3 w-full max-w-md mx-auto">
            <div 
              onClick={() => setActiveStep('details')}
              className={`flex items-center gap-2 cursor-pointer font-bold ${
                activeStep === 'details' ? 'text-emerald-400' : 'text-slate-400'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                activeStep === 'details' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
              }`}>
                1
              </span>
              <span>1. Shipping & Customer</span>
            </div>

            <div className="flex-1 h-0.5 bg-slate-800" />

            <div 
              onClick={() => {
                if (address.fullName && address.email) setActiveStep('payment');
              }}
              className={`flex items-center gap-2 cursor-pointer font-bold ${
                activeStep === 'payment' ? 'text-emerald-400' : 'text-slate-400'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                activeStep === 'payment' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
              }`}>
                2
              </span>
              <span>2. Payment & Confirmation</span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {validationError && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Form Steps */}
            <div className="lg:col-span-7">
              {activeStep === 'details' ? (
                /* Step 1: Shipping Address Form */
                <form onSubmit={handleDetailsSubmit} className="space-y-4">
                  <h3 className="font-heading font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
                    <User className="w-4 h-4 text-emerald-400" />
                    <span>Customer & Delivery Destination</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-slate-400 font-medium">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={address.fullName}
                        onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                        placeholder="Alex Mercer"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-400 font-medium">Email Address (for order tracking) *</label>
                      <input
                        type="email"
                        required
                        value={address.email}
                        onChange={(e) => setAddress({ ...address, email: e.target.value })}
                        placeholder="alex@example.com"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-400 font-medium">Phone Number (SMS updates) *</label>
                      <input
                        type="tel"
                        required
                        value={address.phone}
                        onChange={(e) => setAddress({ ...address, phone: formatPhone(e.target.value) })}
                        placeholder="(415) 555-0199"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-slate-400 font-medium">Street Address *</label>
                      <input
                        type="text"
                        required
                        value={address.street}
                        onChange={(e) => setAddress({ ...address, street: e.target.value })}
                        placeholder="450 Townsend Street, Suite 200"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-400 font-medium">City *</label>
                      <input
                        type="text"
                        required
                        value={address.city}
                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                        placeholder="San Francisco"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-slate-400 font-medium">State *</label>
                        <input
                          type="text"
                          required
                          maxLength={2}
                          value={address.state}
                          onChange={(e) => setAddress({ ...address, state: e.target.value.toUpperCase() })}
                          placeholder="CA"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white uppercase text-center focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-400 font-medium">ZIP Code *</label>
                        <input
                          type="text"
                          required
                          value={address.cep}
                          onChange={(e) => setAddress({ ...address, cep: formatZipCode(e.target.value) })}
                          placeholder="94107"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Shipping Options Selection */}
                  <div className="pt-4 border-t border-slate-800 space-y-2">
                    <label className="text-slate-400 font-medium text-xs block">
                      Select Preferred Shipping Method
                    </label>
                    <div className="space-y-2">
                      {SHIPPING_OPTIONS.map((opt) => {
                        const isSelected = selectedShipping.id === opt.id;
                        const isFree = cartSubtotal >= 99 && opt.id === 'ship-2';
                        return (
                          <div
                            key={opt.id}
                            onClick={() => setSelectedShipping(opt)}
                            className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between text-xs ${
                              isSelected
                                ? 'bg-cyan-500/10 border-cyan-500/40 text-white'
                                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                isSelected ? 'border-cyan-400 bg-cyan-400' : 'border-slate-600'
                              }`}>
                                {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                              </div>
                              <div>
                                <p className="font-semibold text-white">{opt.name}</p>
                                <p className="text-[11px] text-slate-400">{opt.company} • {opt.deadlineDays} business days</p>
                              </div>
                            </div>
                            <span className={`font-mono font-bold ${isFree ? 'text-emerald-400' : 'text-white'}`}>
                              {isFree ? 'FREE' : formatUSD(opt.price)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-heading font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
                    >
                      <span>Continue to Payment</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              ) : (
                /* Step 2: Payment Method Choice & Interactive Card */
                <div className="space-y-6">
                  <div>
                    <h3 className="font-heading font-bold text-sm text-white uppercase tracking-wider mb-3">
                      Select Payment Method
                    </h3>

                    {/* Method Tabs */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentType('credit_card')}
                        className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                          paymentType === 'credit_card'
                            ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <CreditCardIcon className="w-5 h-5" />
                        <span className="text-[11px] font-bold">Credit Card</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentType('paypal')}
                        className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                          paymentType === 'paypal'
                            ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <Wallet className="w-5 h-5" />
                        <span className="text-[11px] font-bold">PayPal</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentType('apple_pay')}
                        className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                          paymentType === 'apple_pay'
                            ? 'bg-slate-800 border-white text-white'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <Smartphone className="w-5 h-5" />
                        <span className="text-[11px] font-bold">Apple / Google</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentType('wallet')}
                        className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                          paymentType === 'wallet'
                            ? 'bg-amber-500/10 border-amber-500 text-amber-400'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <Zap className="w-5 h-5" />
                        <span className="text-[11px] font-bold">Crypto / Wire</span>
                      </button>
                    </div>
                  </div>

                  {/* Credit Card Detailed Form & 3D Virtual Card */}
                  {paymentType === 'credit_card' && (
                    <div className="space-y-4">
                      {/* Virtual Card Rendering */}
                      <div className="p-5 rounded-2xl bg-gradient-to-tr from-slate-950 via-slate-900 to-emerald-950/60 border border-emerald-500/30 text-white shadow-xl relative overflow-hidden">
                        <div className="flex justify-between items-center mb-6">
                          <span className="font-heading font-black tracking-widest text-xs text-emerald-400 uppercase">
                            HYPERGEAR TITANIUM
                          </span>
                          <span className="font-mono font-bold text-xs uppercase px-2 py-0.5 rounded bg-white/10">
                            {cardBrand}
                          </span>
                        </div>

                        <div className="space-y-4 font-mono">
                          <div className="text-lg tracking-widest text-emerald-200">
                            {cardData.number || '•••• •••• •••• ••••'}
                          </div>

                          <div className="flex justify-between items-end text-xs">
                            <div>
                              <p className="text-[9px] uppercase tracking-wider text-slate-400 font-sans">Cardholder</p>
                              <p className="font-bold uppercase tracking-wide truncate max-w-[200px]">
                                {cardData.holderName || 'YOUR FULL NAME'}
                              </p>
                            </div>

                            <div>
                              <p className="text-[9px] uppercase tracking-wider text-slate-400 font-sans">Expires</p>
                              <p className="font-bold">
                                {cardData.expiryMonth}/{cardData.expiryYear}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Card Input Fields */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="space-y-1 sm:col-span-2">
                          <label className="text-slate-400 font-medium">Card Number *</label>
                          <input
                            type="text"
                            maxLength={19}
                            value={cardData.number}
                            onChange={(e) => setCardData({ ...cardData, number: formatCardNumber(e.target.value) })}
                            placeholder="4242 4242 4242 4242"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                          />
                        </div>

                        <div className="space-y-1 sm:col-span-2">
                          <label className="text-slate-400 font-medium">Cardholder Name (as printed) *</label>
                          <input
                            type="text"
                            value={cardData.holderName}
                            onChange={(e) => setCardData({ ...cardData, holderName: e.target.value.toUpperCase() })}
                            placeholder="ALEX MERCER"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white uppercase focus:outline-none focus:border-emerald-500"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-slate-400 font-medium">Expiration (MM/YY) *</label>
                          <div className="flex gap-2">
                            <select
                              value={cardData.expiryMonth}
                              onChange={(e) => setCardData({ ...cardData, expiryMonth: e.target.value })}
                              className="w-1/2 bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-white focus:outline-none focus:border-emerald-500"
                            >
                              {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')).map((m) => (
                                <option key={m} value={m}>{m}</option>
                              ))}
                            </select>
                            <select
                              value={cardData.expiryYear}
                              onChange={(e) => setCardData({ ...cardData, expiryYear: e.target.value })}
                              className="w-1/2 bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-white focus:outline-none focus:border-emerald-500"
                            >
                              {['25', '26', '27', '28', '29', '30', '31'].map((y) => (
                                <option key={y} value={y}>20{y}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-slate-400 font-medium">CVV / CVC *</label>
                          <input
                            type="password"
                            maxLength={4}
                            value={cardData.cvv}
                            onChange={(e) => setCardData({ ...cardData, cvv: e.target.value.replace(/\D/g, '') })}
                            placeholder="123"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                          />
                        </div>

                        <div className="space-y-1 sm:col-span-2">
                          <label className="text-slate-400 font-medium">Payment Options / Financing</label>
                          <select
                            value={cardData.installments}
                            onChange={(e) => setCardData({ ...cardData, installments: Number(e.target.value) })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
                          >
                            <option value={1}>1x Pay in full ({formatUSD(totalAmount)})</option>
                            <option value={4}>4x of {formatUSD(totalAmount / 4)} (0% APR Interest-Free)</option>
                            <option value={12}>12x of {formatUSD((totalAmount * 1.05) / 12)} (with financing)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* PayPal Option */}
                  {paymentType === 'paypal' && (
                    <div className="p-6 rounded-2xl bg-slate-950 border border-cyan-500/30 text-center space-y-4">
                      <div className="w-12 h-12 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto">
                        <Wallet className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm">Instant 1-Click PayPal Checkout</h4>
                        <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                          Connect your PayPal account for instant purchase protection and access to Pay in 4.
                        </p>
                      </div>
                      <div className="p-3 bg-slate-900 rounded-xl text-xs text-slate-300 font-mono">
                        Account: {address.email || 'alex@example.com'}
                      </div>
                    </div>
                  )}

                  {/* Apple / Google Pay Option */}
                  {paymentType === 'apple_pay' && (
                    <div className="p-6 rounded-2xl bg-slate-950 border border-slate-700 text-center space-y-4">
                      <div className="w-12 h-12 rounded-full bg-slate-800 text-white flex items-center justify-center mx-auto">
                        <Smartphone className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm">Biometric Fast Pay (Apple Pay / Google Pay)</h4>
                        <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                          Authenticate with Touch ID, Face ID, or your default saved device wallet.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Crypto / Wire Option */}
                  {paymentType === 'wallet' && (
                    <div className="p-6 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-3 text-xs">
                      <div className="flex items-center gap-2 text-amber-400 font-bold">
                        <Zap className="w-4 h-4" />
                        <span>Instant USDC / USDT / BTC or Wire Transfer</span>
                      </div>
                      <p className="text-slate-400">
                        Zero transaction fees with immediate confirmation on EVM / Solana / Bitcoin network.
                      </p>
                      <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[11px] text-amber-300 select-all">
                        0x71C94840e6A082f8B92942F992E5C9A312B47e22
                      </div>
                    </div>
                  )}

                  {/* Step 2 Action Buttons */}
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveStep('details')}
                      className="px-4 py-3 rounded-xl border border-slate-800 hover:bg-slate-800 text-slate-300 font-semibold text-xs transition-colors"
                    >
                      Back to Shipping
                    </button>

                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={handleFinalizeOrder}
                      className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-heading font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                          <span>Authorizing Transaction in USD...</span>
                        </div>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          <span>Pay {formatUSD(totalAmount)} & Place Order</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Order Summary Sidebar */}
            <div className="lg:col-span-5 bg-slate-950 p-5 rounded-2xl border border-slate-800/80 space-y-4 text-xs">
              <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-white border-b border-slate-800 pb-2">
                Order Summary ({cart.length} items)
              </h3>

              {/* Items Mini List */}
              <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                {cart.map(({ product, quantity }) => (
                  <div key={product.id} className="flex items-center gap-3">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-lg object-contain bg-slate-900 border border-slate-800 shrink-0 p-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-white truncate">{product.name}</p>
                      <p className="text-[10px] text-slate-400">{quantity}x • {formatUSD(product.price)}</p>
                    </div>
                    <span className="font-mono font-bold text-white">
                      {formatUSD(product.price * quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Breakdown */}
              <div className="pt-3 border-t border-slate-800 space-y-1.5 text-slate-400">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-mono text-slate-200">{formatUSD(cartSubtotal)}</span>
                </div>

                {cartDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-medium">
                    <span>Discount ({appliedCoupon?.code}):</span>
                    <span className="font-mono">-{formatUSD(cartDiscount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span className="font-mono text-slate-200">
                    {cartShippingCost === 0 ? <span className="text-emerald-400 font-bold">FREE</span> : formatUSD(cartShippingCost)}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-800 flex justify-between items-baseline text-white">
                  <span className="font-bold text-sm">Total:</span>
                  <span className="font-mono font-black text-lg text-emerald-400">
                    {formatUSD(totalAmount)}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1 text-[11px] text-slate-400">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Buyer Protection Guaranteed</span>
                </div>
                <p>30-day hassle-free returns with prepaid return shipping label.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
