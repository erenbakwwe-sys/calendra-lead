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
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!mounted || !isAuthenticated) {
    return (
      <div className="h-screen w-screen bg-dark-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs text-gold-400 font-mono tracking-wider">CALENDRA LEAD LÄDT...</span>
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
