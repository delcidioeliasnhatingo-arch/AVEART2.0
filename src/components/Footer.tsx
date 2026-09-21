import React from 'react';
import { 
  Gamepad2, 
  ShieldCheck, 
  Lock, 
  Truck, 
  Phone, 
  Mail, 
  Clock, 
  Wallet,
  Zap,
  Gift
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs mt-16">
      {/* Top Security & Payment Badges Bar */}
      <div className="border-b border-slate-900 py-8 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-white text-sm">Official Manufacturer Warranty</p>
                <p className="text-[11px] text-slate-400">All hardware covered by 2-year manufacturer guarantee</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-white text-sm">Free Express Shipping</p>
                <p className="text-[11px] text-slate-400">Eligible on orders over $99 across the United States</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <Gift className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-white text-sm">Daily Deals & BOGO</p>
                <p className="text-[11px] text-slate-400">Exclusive flash sales and buy-one-get-one promotions</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-white text-sm">Encrypted USD Checkout</p>
                <p className="text-[11px] text-slate-400">256-bit bank encryption with PCI-DSS compliance</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand & About */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Gamepad2 className="w-5 h-5 text-slate-950" />
              </div>
              <span className="font-heading font-black text-xl tracking-tight text-white">
                HYPER<span className="text-cyan-400">GEAR</span>
              </span>
            </div>

            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              The premier electronics, gaming hardware, and enthusiast gadget destination. Featuring RTX 40/50 series GPUs, magnetic Hall Effect keyboards, QD-OLED monitors, and curated limited-time promotions.
            </p>

            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Customer Support: 1-800-555-GEAR (Mon–Fri 8AM–8PM EST)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                <span>support@hypergear.io</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Same-day fulfillment on orders placed before 2 PM EST</span>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-white">
              Categories
            </h4>
            <ul className="space-y-2 text-xs">
              <li><span className="hover:text-emerald-400 cursor-pointer transition-colors">Graphics Cards & GPUs</span></li>
              <li><span className="hover:text-emerald-400 cursor-pointer transition-colors">Gaming Monitors OLED</span></li>
              <li><span className="hover:text-emerald-400 cursor-pointer transition-colors">Magnetic Keyboards 8000Hz</span></li>
              <li><span className="hover:text-emerald-400 cursor-pointer transition-colors">Ultralight eSports Mice</span></li>
              <li><span className="hover:text-emerald-400 cursor-pointer transition-colors">Spatial Audio Headsets</span></li>
              <li><span className="hover:text-emerald-400 cursor-pointer transition-colors">Handheld PC Consoles</span></li>
            </ul>
          </div>

          {/* Help & Support */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-white">
              Help & Support
            </h4>
            <ul className="space-y-2 text-xs">
              <li><span className="hover:text-emerald-400 cursor-pointer transition-colors">Live Order Tracking</span></li>
              <li><span className="hover:text-emerald-400 cursor-pointer transition-colors">30-Day Money Back Guarantee</span></li>
              <li><span className="hover:text-emerald-400 cursor-pointer transition-colors">US Warranty & RMA Support</span></li>
              <li><span className="hover:text-emerald-400 cursor-pointer transition-colors">Shareable Wishlists</span></li>
              <li><span className="hover:text-emerald-400 cursor-pointer transition-colors">Security & Privacy Policy</span></li>
            </ul>
          </div>

          {/* Accepted Payments */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-white">
              Accepted Payments (USD)
            </h4>
            <div className="flex flex-wrap gap-1.5">
              <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] font-bold text-slate-200">
                Visa
              </span>
              <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] font-bold text-slate-200">
                Mastercard
              </span>
              <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] font-bold text-slate-200">
                Amex
              </span>
              <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] font-bold text-slate-200">
                Discover
              </span>
              <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] font-bold text-cyan-400 flex items-center gap-1">
                <Wallet className="w-3 h-3" /> PayPal
              </span>
              <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] font-bold text-slate-200">
                Apple Pay
              </span>
              <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] font-bold text-slate-200">
                Google Pay
              </span>
              <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] font-bold text-amber-400 flex items-center gap-1">
                <Zap className="w-3 h-3" /> USDC / Wire
              </span>
            </div>

            <div className="pt-2">
              <h4 className="font-heading font-bold text-[11px] uppercase tracking-wider text-slate-400 mb-2">
                Trust & Compliance
              </h4>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                  ✓ Verified Merchant
                </span>
                <span className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 text-[10px] font-bold">
                  ✓ 256-Bit SSL
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© 2026 HyperGear Tech Inc. All prices in USD ($). All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Privacy Notice</span>
            <span className="hover:text-slate-400 cursor-pointer">Do Not Sell My Info</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
