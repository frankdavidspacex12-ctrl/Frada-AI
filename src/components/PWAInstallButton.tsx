import React, { useState } from 'react';
import { Download, Sparkles, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="glass-pill-94 flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-[#6B4226] hover:bg-white/65 hover:shadow-md transition-all active:scale-95"
        title="Instalar Frada IA en tu laptop"
      >
        <Download className="w-3.5 h-3.5 text-[#C86A82]" />
        <span>Instalar App</span>
        <Sparkles className="w-3 h-3 text-[#F59E0B]" />
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="glass-pill-94 flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold text-[#6B4226] hover:bg-white/65 transition-all"
        >
          <Download className="w-3.5 h-3.5 text-[#C86A82]" />
          <span>Instalar en iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 backdrop-blur-md p-4">
            <div className="glass-94 w-full max-w-sm rounded-[67px] p-8 text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#FCE7F3] flex items-center justify-center mb-3">
                <Sparkles className="w-6 h-6 text-[#C86A82]" />
              </div>
              <h3 className="text-lg font-bold text-[#4A2E18]">Instalar Frada IA</h3>
              <p className="mt-2 text-xs text-[#78543B] leading-relaxed">
                1. Toca el botón <strong>Compartir</strong> en Safari.<br />
                2. Desliza hacia abajo y selecciona <strong>Agregar a pantalla de inicio</strong>.
              </p>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-full bg-[#6B4226] py-2.5 text-xs font-bold text-white hover:bg-[#52301A] transition shadow-md"
              >
                Entendido
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
