import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { GelatinSilhouette } from './GelatinIcon';

export const LoadingScreen: React.FC = () => {
  const [phraseIndex, setPhraseIndex] = useState(0);

  const phrases = [
    'Conectando con Google AI Studio...',
    'Consultando las delicias con stock en el mostrador...',
    'Interpretando tu energía y notas de sabor...',
    'Escribiendo un mensaje especial para tu corazón...',
    '¡Casi listo tu postre artesanal perfecto!',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
    }, 1400);
    return () => clearInterval(interval);
  }, [phrases.length]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center select-none">
      <div className="glass-94 w-full max-w-md rounded-[67px] p-8 sm:p-11 ring-8 ring-white/25 text-center">
        {/* Animated Jiggling Gelatin */}
        <div className="relative mx-auto w-28 h-28 flex items-center justify-center mb-5">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#FFD1DC] via-[#FFF3BF] to-[#BAE6FD] blur-xl opacity-70 animate-pulse" />
          <div className="animate-bounce relative z-10 w-24 h-24 rounded-full bg-[#52301A]/90 backdrop-blur-md border border-white/40 flex items-center justify-center shadow-lg shadow-[#52301A]/30">
            <GelatinSilhouette className="w-14 h-14" color="#FFFFFF" />
          </div>
        </div>

        {/* Brand IA Badge */}
        <div className="glass-pill-94 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold text-[#7A4B29] mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#C86A82] animate-spin" />
          <span>Frada IA & Google AI Studio</span>
        </div>

        <h3 className="text-2xl font-extrabold text-[#4A2E18] font-serif-title mb-2">
          Descubriendo tu Postre
        </h3>

        {/* Dynamic changing phrase with fade */}
        <p className="text-xs sm:text-sm text-[#78543B] font-medium h-8 flex items-center justify-center transition-all duration-300">
          {phrases[phraseIndex]}
        </p>

        {/* Soft rounded animated bar */}
        <div className="w-48 h-2.5 mx-auto mt-6 rounded-full bg-[#F3E8E2] overflow-hidden relative">
          <div className="h-full w-24 bg-gradient-to-r from-[#C86A82] via-[#E07A5F] to-[#52301A] rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
};
