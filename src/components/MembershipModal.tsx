import React, { useState } from 'react';
import type { MembershipTier } from '../types';
import { Crown, CheckCircle2, Zap, X, ShieldCheck, Tag, QrCode } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MembershipModalProps {
  onClose: () => void;
  onUpgradeSuccess: (tier: MembershipTier) => void;
}

export const MembershipModal: React.FC<MembershipModalProps> = ({
  onClose,
  onUpgradeSuccess,
}) => {
  const [selectedTier, setSelectedTier] = useState<MembershipTier>('yearly');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (code === 'STREAM50' || code === 'SAVER50' || code === 'DESI50') {
      setPromoApplied(true);
      setDiscountPercent(50);
    } else if (code === 'FREEPASS') {
      setPromoApplied(true);
      setDiscountPercent(100);
    } else {
      alert('Invalid promo code. Try "DESI50" for 50% off!');
    }
  };

  const handleCheckout = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      // Trigger Confetti Celebration
      confetti({
        particleCount: 140,
        spread: 90,
        origin: { y: 0.6 },
      });
      onUpgradeSuccess(selectedTier);
    }, 1200);
  };

  const getPrice = (base: number) => {
    const finalPrice = Math.round(base * (1 - discountPercent / 100));
    return finalPrice === 0 ? 'FREE' : `₹${finalPrice}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-[720px] bg-white text-black p-6 sm:p-8 rounded-3xl shadow-2xl border border-black/10 flex flex-col items-center relative overflow-hidden">
        {/* Top Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-black p-1.5 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Crown Icon & Header */}
        <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-600 mb-3 shadow-md">
          <Crown className="w-6 h-6 fill-amber-500" />
        </div>

        <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-widest text-center text-black">
          Super Budget-Friendly Unlimited Access
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 text-center max-w-[520px] mt-1 mb-6 font-medium">
          Remove 24-hour daily download limits. Enjoy unlimited 4K video & MP3 audio extractions across all global platforms!
        </p>

        {/* 3 Budget Rupee Tier Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 w-full mb-6">
          {/* 1. 7-Day Pass (₹70) */}
          <div
            onClick={() => setSelectedTier('weekly')}
            className={`p-4 rounded-2xl border cursor-pointer flex flex-col justify-between transition-all relative ${
              selectedTier === 'weekly'
                ? 'border-[#C80A0A] bg-[#C80A0A]/5 ring-2 ring-[#C80A0A]/20 shadow-md'
                : 'border-gray-200 hover:border-gray-300 bg-gray-50'
            }`}
          >
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">7-Day Starter</span>
              <div className="text-2xl font-extrabold text-black mt-1">
                {getPrice(70)}
              </div>
              <span className="text-[11px] text-gray-400 font-medium">₹10 per day</span>
            </div>
            <ul className="text-[11px] text-gray-600 space-y-1 mt-3">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C80A0A]" /> 7 Days Unlimited
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C80A0A]" /> 4K & HD Streams
              </li>
            </ul>
          </div>

          {/* 2. Monthly Pass (₹149) */}
          <div
            onClick={() => setSelectedTier('monthly')}
            className={`p-4 rounded-2xl border cursor-pointer flex flex-col justify-between transition-all relative ${
              selectedTier === 'monthly'
                ? 'border-[#C80A0A] bg-[#C80A0A]/5 ring-2 ring-[#C80A0A]/20 shadow-md'
                : 'border-gray-200 hover:border-gray-300 bg-gray-50'
            }`}
          >
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">30-Day Pro</span>
              <div className="text-2xl font-extrabold text-black mt-1">
                {getPrice(149)}
                <span className="text-xs text-gray-400 font-normal">/mo</span>
              </div>
              <span className="text-[11px] text-gray-400 font-medium">₹4.9 per day</span>
            </div>
            <ul className="text-[11px] text-gray-600 space-y-1 mt-3">
              <li className="flex items-center gap-1.5 font-semibold text-gray-900">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C80A0A]" /> 30 Days Access
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C80A0A]" /> MP3 Audio 320kbps
              </li>
            </ul>
          </div>

          {/* 3. 1-Year VIP Pass (₹500 - Best Value) */}
          <div
            onClick={() => setSelectedTier('yearly')}
            className={`p-4 rounded-2xl border cursor-pointer flex flex-col justify-between transition-all relative ${
              selectedTier === 'yearly'
                ? 'border-[#C80A0A] bg-[#C80A0A]/5 ring-2 ring-[#C80A0A]/20 shadow-lg'
                : 'border-gray-200 hover:border-gray-300 bg-gray-50'
            }`}
          >
            <span className="absolute -top-2.5 right-3 bg-[#C80A0A] text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow">
              Super Saver 80% OFF
            </span>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">1-Year VIP Pass</span>
              <div className="text-2xl font-extrabold text-black mt-1">
                {getPrice(500)}
                <span className="text-xs text-gray-400 font-normal">/yr</span>
              </div>
              <span className="text-[11px] text-[#C80A0A] font-bold">Only ₹1.3 per day!</span>
            </div>
            <ul className="text-[11px] text-gray-600 space-y-1 mt-3">
              <li className="flex items-center gap-1.5 font-bold text-[#C80A0A]">
                <CheckCircle2 className="w-3.5 h-3.5" /> 365 Days Unlimited
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C80A0A]" /> VIP Priority Bandwidth
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C80A0A]" /> Batch Download Queue
              </li>
            </ul>
          </div>
        </div>

        {/* Promo Code Input Form */}
        <form onSubmit={handleApplyPromo} className="w-full flex items-center gap-2 mb-6">
          <div className="relative flex-1">
            <Tag className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="Promo Code (Try: DESI50)"
              className="w-full bg-gray-100 text-gray-900 placeholder-gray-400 pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 focus:border-[#C80A0A] focus:outline-none text-xs font-mono font-semibold"
            />
          </div>
          <button
            type="submit"
            className="bg-gray-900 text-white hover:bg-black text-xs font-bold px-4 py-2.5 rounded-xl uppercase tracking-wider transition-all"
          >
            Apply
          </button>
        </form>

        {promoApplied && (
          <div className="w-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold px-4 py-2 rounded-xl text-center mb-4">
            🎉 Special Promo Code Applied! Saved {discountPercent}% on your membership.
          </div>
        )}

        {/* Instant UPI & Card Unlock Button */}
        <button
          onClick={handleCheckout}
          disabled={isProcessing}
          className="bg-[#C80A0A] text-white font-bold text-[14px] px-10 py-4 rounded-2xl uppercase tracking-wider hover:bg-red-700 active:scale-95 transition-all shadow-xl w-full flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <span>Activating VIP Pass...</span>
          ) : (
            <>
              <QrCode className="w-4.5 h-4.5" />
              <span>Unlock Unlimited Access ({selectedTier === 'weekly' ? '₹70 / 7 Days' : selectedTier === 'monthly' ? '₹149 / 30 Days' : '₹500 / 1 Year'})</span>
            </>
          )}
        </button>

        <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-gray-400 font-medium mt-4">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> UPI / GPay / PhonePe / Paytm Supported
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-500" /> Instant Activation
          </span>
        </div>
      </div>
    </div>
  );
};
