import React from 'react';
import { Sparkles } from 'lucide-react';
import { GelatinSilhouette } from './GelatinIcon';

interface HomeScreenProps {
  onStartTest: () => void;
  availableDessertsCount: number;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onStartTest,
  availableDessertsCount,
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[78vh] px-4 text-center select-none relative w-full max-w-xl mx-auto">
      {/* Top status badge - 94% Glassmorphic Pill */}
      <div className="glass-pill-94 mb-4 inline-flex items-center gap-2.5 px-5 py-2 rounded-full text-xs font-semibold text-[#8B4513] transition-all hover:bg-white/60 hover:scale-105">
        <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-[#E07A5F] to-[#C86A82] animate-ping" />
        <span className="text-[#9C4155] font-script text-lg">Hechos con Pasión</span>
        <span className="text-[#D1A085]">•</span>
        <span className="font-bold text-[#52301A]">
          {availableDessertsCount > 0
            ? `${availableDessertsCount} postres listos hoy`
            : 'Inventario por reponer'}
        </span>
      </div>

      {/* Planetary 3D Rotating Logo with Ambient Glowing Ring */}
      <div className="relative my-4 flex flex-col items-center justify-center">
        {/* Apple-style multi-color radial aura */}
        <div className="absolute w-72 h-72 rounded-full bg-gradient-to-tr from-[#FFD1DC]/80 via-[#FFF3BF]/70 to-[#FCE7F3]/90 blur-3xl opacity-80 pointer-events-none animate-pulse" />

        {/* Floating wrapper */}
        <div className="animate-planet-float relative z-10 flex flex-col items-center">
          {/* 3D Perspective Container */}
          <div className="perspective-1000 w-56 h-56 sm:w-64 sm:h-64 cursor-pointer">
            {/* Spinning planetary medallion rotating 360° on vertical Y axis */}
            <div className="preserve-3d animate-planet-spin w-full h-full relative rounded-full">
              {/* FRONT FACE (Frada Emblem) */}
              <div className="backface-hidden glass-94 absolute inset-0 w-full h-full rounded-full p-2.5 ring-8 ring-white/35 flex items-center justify-center">
                <img
                  src="/assets/aistudio/IMG_2254_9e1ac89f.JPG"
                  alt="Frada - Logo frontal"
                  className="w-full h-full object-cover rounded-full pointer-events-none shadow-inner"
                />
              </div>

              {/* BACK FACE (Complementary Frada Artwork) */}
              <div
                className="backface-hidden glass-94 absolute inset-0 w-full h-full rounded-full p-2.5 ring-8 ring-white/35 flex items-center justify-center"
                style={{ transform: 'rotateY(180deg)' }}
              >
                <img
                  src="/assets/aistudio/be4b200f-fedb-4a63-9a60-189315f86ab5_e3b6c00f.jpg"
                  alt="Frada - Logo reverso"
                  className="w-full h-full object-cover rounded-full pointer-events-none shadow-inner"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Soft planetary shadow on the surface */}
        <div className="animate-planet-shadow w-44 sm:w-52 h-4 rounded-full bg-gradient-to-r from-transparent via-[#52301A]/20 to-transparent blur-md -mt-1" />
      </div>

      {/* Main Titles */}
      <div className="mt-4 mb-8 max-w-md">
        <h1 className="text-4xl sm:text-5xl font-black text-[#4A2E18] tracking-tight leading-tight">
          Frada IA
        </h1>
        <p className="mt-1.5 text-base sm:text-lg font-semibold text-[#7A4B29] tracking-wide">
          Descubre tu postre ideal
        </p>
      </div>

      {/* Coffee-colored Elongated Rounded Start Button: ONLY white gelatin silhouette, with vibrant pulsing aura */}
      <div className="flex flex-col items-center justify-center">
        <div className="relative group">
          {/* Subtle gradient glow behind the button */}
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#C86A82] via-[#E07A5F] to-[#52301A] opacity-40 blur-md group-hover:opacity-75 transition-opacity duration-300" />

          <button
            onClick={onStartTest}
            disabled={availableDessertsCount === 0}
            aria-label="Iniciar test para descubrir tu postre ideal"
            className={`relative flex items-center justify-center rounded-full px-8 sm:px-10 py-3 sm:py-3.5 w-44 sm:w-52 h-13 sm:h-14 transition-all duration-300 transform active:scale-95 border border-white/30 ${
              availableDessertsCount === 0
                ? 'bg-stone-400 cursor-not-allowed opacity-60'
                : 'bg-gradient-to-r from-[#52301A] via-[#432311] to-[#52301A] text-white shadow-xl hover:shadow-2xl cursor-pointer hover:scale-105'
            }`}
          >
            {/* ONLY the white gelatin silhouette in the center */}
            <div className="group-hover:scale-115 group-active:scale-95 transition-transform duration-200 flex items-center justify-center">
              <GelatinSilhouette className="w-9 h-9 sm:w-10 sm:h-10 drop-shadow-md" color="#FFFFFF" />
            </div>
          </button>
        </div>

        {availableDessertsCount === 0 && (
          <p className="mt-3 text-xs text-rose-600 font-semibold">
            * Sin stock en el mostrador. Abre el panel ⚙️ arriba a la derecha para reabastecer.
          </p>
        )}
      </div>
    </div>
  );
};
