import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { Sparkles, ShoppingBag, CheckCircle2, Heart, ArrowRight, Star } from 'lucide-react';
import { Dessert, RecommendationResult } from '../types';

interface ResultScreenProps {
  result: RecommendationResult;
  dessert: Dessert;
  onGoToCheckout: (dessertId: string) => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  result,
  dessert,
  onGoToCheckout,
}) => {
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);

  useEffect(() => {
    // Fire confetti celebration
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#FDE2E4', '#FFF3BF', '#F4A8BA', '#C86A82', '#6B4226', '#3B82F6', '#FEF08A'],
    });
  }, []);

  const handleCheckoutClick = () => {
    setIsProcessingCheckout(true);
    setTimeout(() => {
      onGoToCheckout(dessert.id);
    }, 700);
  };

  // Format price in COP
  const formattedPrice = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(dessert.price);

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] px-4 py-6 max-w-xl mx-auto w-full select-none">
      {/* Processing Checkout overlay modal */}
      {isProcessingCheckout && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 backdrop-blur-md p-4"
        >
          <div className="glass-94 w-full max-w-sm rounded-[67px] p-8 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100/90 flex items-center justify-center mb-4 text-emerald-600 animate-bounce">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="text-2xl font-black text-[#4A2E18]">¡Listo para Caja!</h3>
            <p className="mt-2 text-xs text-[#52301A]">
              Se descontó 1 unidad de <strong>{dessert.name}</strong> del inventario.
            </p>
          </div>
        </motion.div>
      )}

      {/* Top Congratulatory Pill Badge */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-pill-94 mb-4 inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-black text-[#9C4155]"
      >
        <Sparkles className="w-4 h-4 text-[#E07A5F] animate-spin" />
        <span className="uppercase tracking-wider">Tu Postre Ideal en Frada</span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#E07A5F]" />
        <span className="text-[#52301A]">{result.personalityArchetype}</span>
      </motion.div>

      {/* Main 94% Glassmorphic Card with 67px Radius */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="glass-94 w-full rounded-[67px] p-7 sm:p-9 ring-8 ring-white/25 text-center flex flex-col items-center"
      >
        {/* Photo Container with rounded border & glow */}
        <div className="glass-pill-94 relative w-48 h-48 sm:w-56 sm:h-56 mb-5 rounded-full p-2.5 shadow-xl flex items-center justify-center group overflow-hidden">
          <img
            src={dessert.imageUrl}
            alt={dessert.name}
            className="w-full h-full object-cover rounded-full group-hover:scale-108 transition-transform duration-500 shadow-inner"
            onError={(e) => {
              // Fallback to Frada logo if image fails
              (e.target as HTMLImageElement).src = '/assets/aistudio/IMG_2254_9e1ac89f.JPG';
            }}
          />
          <div className="absolute bottom-2 px-3 py-1 rounded-full bg-[#52301A]/90 text-white text-[11px] font-black backdrop-blur-md shadow-sm">
            {dessert.category || 'Artesanal'}
          </div>
        </div>

        {/* Dessert Name */}
        <h2 className="text-2xl sm:text-3xl font-black text-[#4A2E18] font-serif-title leading-tight mb-2">
          {dessert.name}
        </h2>

        {/* Price Pill */}
        <div className="glass-pill-94 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-emerald-900 text-sm font-black mb-4">
          <span>{formattedPrice}</span>
          <span className="text-[10px] text-emerald-800 font-semibold uppercase">COP</span>
        </div>

        {/* Motivational Personalized Message Box */}
        <div className="glass-pill-94 w-full rounded-[44px] p-5 mb-5 text-left">
          <div className="flex items-center gap-2 mb-2 text-[#9C4155] font-bold text-xs uppercase tracking-wider">
            <Heart className="w-4 h-4 fill-[#C86A82] text-[#C86A82]" />
            <span>Mensaje para tu alma:</span>
          </div>
          <p className="text-xs sm:text-sm text-[#4A2E18] leading-relaxed font-semibold">
            "{result.motivationalMessage}"
          </p>

          {result.matchReason && (
            <p className="mt-2.5 pt-2 border-t border-white/50 text-[11px] text-[#6B4226] italic font-medium">
              ✨ {result.matchReason}
            </p>
          )}
        </div>

        {/* Blue Pill "Ir a Caja" Button */}
        <button
          onClick={handleCheckoutClick}
          className="group relative w-full sm:w-auto px-8 sm:px-12 py-4 rounded-full bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-base shadow-xl hover:shadow-2xl hover:shadow-blue-500/35 transition-all duration-200 transform active:scale-95 flex items-center justify-center gap-3 cursor-pointer border border-white/30 hover:scale-102"
        >
          <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span>Ir a Caja</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

        <p className="mt-3 text-[11px] text-[#A0795F] font-medium">
          Al tocar "Ir a Caja" se descontará del stock y volverá al inicio para el siguiente cliente.
        </p>
      </motion.div>
    </div>
  );
};
