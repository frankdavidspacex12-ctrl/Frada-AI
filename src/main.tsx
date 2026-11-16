import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Safely clear any stale service workers in development to prevent white screen hangs
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      // In dev environment unregister stale workers that cause blank pages
      if (window.location.hostname.includes('run.app') || window.location.hostname === 'localhost') {
        registration.unregister().catch(() => {});
      }
    }
  }).catch(() => {});
}

// Global Error Boundary to prevent any blank white screen
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Frada IA caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#FFFDF7] p-6 text-center font-sans">
          <div className="max-w-md w-full bg-white p-8 rounded-[36px] shadow-2xl border-2 border-[#FCE7F3]">
            <img
              src="/assets/aistudio/IMG_2254_9e1ac89f.JPG"
              alt="Frada"
              className="w-20 h-20 mx-auto rounded-full object-cover mb-4 shadow-md"
            />
            <h2 className="text-2xl font-bold text-[#4A2E18] mb-2 font-serif">Frada IA</h2>
            <p className="text-sm text-[#78543B] mb-6">
              Tuvimos un pequeño contratiempo cargando el mostrador. Pulsa el botón para continuar disfrutando.
            </p>
            <button
              onClick={() => {
                localStorage.removeItem('frada_desserts_v1');
                window.location.reload();
              }}
              className="w-full py-3.5 px-6 rounded-full bg-[#52301A] text-white font-bold text-sm shadow-lg hover:bg-[#3D2211] transition active:scale-95"
            >
              Reiniciar mostrador de postres
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
