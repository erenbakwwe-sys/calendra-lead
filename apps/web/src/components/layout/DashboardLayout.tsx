"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { MobileBottomBar } from './MobileBottomBar';
import { OnboardingTour } from './OnboardingTour';
import { ActiveCallOverlay } from '@/components/dialer/ActiveCallOverlay';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated) {
      window.location.href = '/login';
    }
  }, [isAuthenticated]);

  if (!mounted || !isAuthenticated) {
    return (
      <div className="h-screen w-screen bg-dark-950 flex items-center justify-center relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="ambient-glow-gold -top-20 left-1/2 -translate-x-1/2 animate-pulse-slow pointer-events-none" />

        <div className="flex flex-col items-center gap-4 relative z-10">
          <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-metallic text-dark-950 font-black text-2xl shadow-gold-md animate-glow">
            <span className="drop-shadow-sm">V</span>
            <div className="absolute inset-0 rounded-2xl bg-white/20 animate-pulse" />
          </div>

          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs text-gold-400 font-mono tracking-widest font-semibold uppercase">
              VertriebsHub wird geladen...
            </span>
          </div>

          {!isAuthenticated && mounted && (
            <button
              onClick={() => { window.location.href = '/login'; }}
              className="mt-2 text-xs font-bold text-gray-400 hover:text-gold-300 underline"
            >
              Zum Login weiterleiten →
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col font-sans">
      <Header />
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-3.5 sm:p-5 md:p-6 lg:p-8 bg-dark-950/50 pb-24 md:pb-8">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Dock Bar */}
      <MobileBottomBar />

      {/* Global Modals / Overlays */}
      <OnboardingTour />
      <ActiveCallOverlay />
    </div>
  );
}
