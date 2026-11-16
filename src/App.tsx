import React, { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { BackgroundDancingPastels } from './components/BackgroundDancingPastels';
import { HomeScreen } from './components/HomeScreen';
import { TestScreen } from './components/TestScreen';
import { LoadingScreen } from './components/LoadingScreen';
import { ResultScreen } from './components/ResultScreen';
import { AdminModal } from './components/AdminModal';
import { PWAInstallButton } from './components/PWAInstallButton';
import { INITIAL_DESSERTS } from './data/initialDesserts';
import { Dessert, UserAnswer, RecommendationResult } from './types';
import { recommendDessertSmart, getEligibleDesserts } from './utils/sommelier';

const STORAGE_KEY = 'frada_desserts_v1';
const RECENT_STORAGE_KEY = 'frada_recent_desserts_v1';

export default function App() {
  const [desserts, setDesserts] = useState<Dessert[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading stored desserts:', e);
    }
    return INITIAL_DESSERTS;
  });

  const [recentDessertIds, setRecentDessertIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(RECENT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return [];
  });

  const [currentScreen, setCurrentScreen] = useState<'home' | 'test' | 'loading' | 'result'>('home');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [recommendation, setRecommendation] = useState<RecommendationResult | null>(null);
  const [selectedDessert, setSelectedDessert] = useState<Dessert | null>(null);

  // Save desserts to localStorage on update
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(desserts));
    } catch (e) {
      console.error('Error saving desserts to storage:', e);
    }
  }, [desserts]);

  // Save recent recommendations rotation to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(recentDessertIds));
    } catch (e) {}
  }, [recentDessertIds]);

  const recordRecommendation = (chosenId: string, inStockDesserts: Dessert[]) => {
    setRecentDessertIds((prev) => {
      const inStockIds = new Set(inStockDesserts.map((d) => d.id));
      const validPrev = prev.filter((id) => inStockIds.has(id));
      // Keep full chronological recency order (oldest -> newest) so the 2-test cooldown
      // and extended rest window are never wiped between cycles.
      const maxHistory = Math.max(inStockDesserts.length * 2, 24);
      const next = [...validPrev.filter((id) => id !== chosenId), chosenId];
      return next.slice(-maxHistory);
    });
  };

  // Available desserts with stock > 0
  const availableDesserts = desserts.filter((d) => d.stock > 0);

  const handleStartTest = () => {
    if (availableDesserts.length === 0) {
      setIsAdminOpen(true);
      return;
    }
    setCurrentScreen('test');
  };

  const handleTestComplete = async (answers: UserAnswer[]) => {
    setCurrentScreen('loading');

    // Filter desserts with stock > 0
    const inStockDesserts = desserts.filter((d) => d.stock > 0);

    if (inStockDesserts.length === 0) {
      setCurrentScreen('home');
      setIsAdminOpen(true);
      return;
    }

    // Determine eligible desserts excluding recently shown ones
    const eligibleDesserts = getEligibleDesserts(inStockDesserts, recentDessertIds);

    // Calculate dynamic personalized recommendation based on the user's answers and rotation
    const dynamicSmartResult = recommendDessertSmart(answers, eligibleDesserts);
    const dynamicDessert =
      eligibleDesserts.find((d) => d.id === dynamicSmartResult.dessertId) || eligibleDesserts[0];

    try {
      // Try backend endpoint with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5200);

      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers,
          availableDesserts: inStockDesserts,
          recentDessertIds,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error('Servidor devolvió status ' + res.status);
      }

      const data: RecommendationResult = await res.json();
      const matched =
        eligibleDesserts.find((d) => d.id === data.dessertId) ||
        dynamicDessert;

      const finalResult: RecommendationResult =
        matched.id === data.dessertId ? data : { ...dynamicSmartResult, dessertId: matched.id, dessertName: matched.name };

      recordRecommendation(matched.id, inStockDesserts);
      setRecommendation(finalResult);
      setSelectedDessert(matched);
      setCurrentScreen('result');
    } catch (err: any) {
      console.warn('Usando sommelier dinámico personalizado:', err?.message || err);
      recordRecommendation(dynamicDessert.id, inStockDesserts);
      setRecommendation(dynamicSmartResult);
      setSelectedDessert(dynamicDessert);
      setCurrentScreen('result');
    }
  };

  const handleGoToCheckout = (dessertId: string) => {
    // 1. Decrement stock by 1 for the chosen dessert
    setDesserts((prev) =>
      prev.map((d) => {
        if (d.id === dessertId) {
          const nextStock = Math.max(0, d.stock - 1);
          return { ...d, stock: nextStock };
        }
        return d;
      })
    );

    // 2. Instantly reset state for the next customer
    setRecommendation(null);
    setSelectedDessert(null);
    setCurrentScreen('home');
  };

  const handleResetDefaults = () => {
    if (window.confirm('¿Deseas restaurar el catálogo y el stock original de Frada?')) {
      setDesserts(INITIAL_DESSERTS);
      setRecentDessertIds([]);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DESSERTS));
      localStorage.removeItem(RECENT_STORAGE_KEY);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between selection:bg-pink-200 selection:text-pink-900">
      {/* Background with dancing cream, vanilla and pastel pink colors */}
      <BackgroundDancingPastels />

      {/* Top Header Bar */}
      <header className="w-full px-4 sm:px-8 py-4 sm:py-5 flex items-center justify-between relative z-30 max-w-6xl mx-auto">
        {/* Left Brand Badge */}
        <div
          onClick={() => setCurrentScreen('home')}
          className="glass-pill-94 flex items-center gap-2.5 px-4 py-1.5 rounded-full cursor-pointer hover:bg-white/60 transition-all active:scale-95"
        >
          <img
            src="/assets/aistudio/IMG_2254_9e1ac89f.JPG"
            alt="Frada Logo"
            className="w-7 h-7 rounded-full object-cover border border-white/90"
          />
          <div className="flex flex-col text-left">
            <span className="text-xs font-extrabold tracking-wider text-[#4A2E18] leading-none">
              FRADA IA
            </span>
            <span className="text-[9px] font-script text-[#9C4155] leading-none">
              Gelatinas Artesanales
            </span>
          </div>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center gap-3">
          {/* PWA Install Button */}
          <PWAInstallButton />

          {/* Admin Gear Button ⚙️ (Top Right, rounded circle, PIN 1534) */}
          <button
            onClick={() => setIsAdminOpen(true)}
            className="glass-pill-94 flex items-center justify-center w-11 h-11 rounded-full text-[#52301A] hover:bg-white/70 hover:rotate-45 hover:shadow-md transition-all active:scale-90 cursor-pointer"
            aria-label="Panel de Configuración Admin"
            title="Panel de Configuración (PIN: 1534)"
          >
            <Settings className="w-5 h-5 text-[#6B4226]" />
          </button>
        </div>
      </header>

      {/* Main Content View */}
      <main className="flex-1 flex items-center justify-center relative z-20 py-2">
        {currentScreen === 'home' && (
          <HomeScreen
            onStartTest={handleStartTest}
            availableDessertsCount={availableDesserts.length}
          />
        )}

        {currentScreen === 'test' && (
          <TestScreen
            onComplete={handleTestComplete}
            onCancel={() => setCurrentScreen('home')}
          />
        )}

        {currentScreen === 'loading' && <LoadingScreen />}

        {currentScreen === 'result' && (
          recommendation && selectedDessert ? (
            <ResultScreen
              result={recommendation}
              dessert={selectedDessert}
              onGoToCheckout={handleGoToCheckout}
            />
          ) : (
            <HomeScreen
              onStartTest={handleStartTest}
              availableDessertsCount={availableDesserts.length}
            />
          )
        )}
      </main>

      {/* Subtle Footer */}
      <footer className="w-full py-3 px-4 text-center relative z-20">
        <p className="text-[11px] text-[#9E7356] font-medium tracking-wide">
          Frada Postres de Gelatina Artesanales • Sabor que Enamora • Impulsado por Google AI Studio
        </p>
      </footer>

      {/* Admin Panel Modal (PIN 1234) */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        desserts={desserts}
        onUpdateDesserts={setDesserts}
        onResetDefaults={handleResetDefaults}
      />
    </div>
  );
}
