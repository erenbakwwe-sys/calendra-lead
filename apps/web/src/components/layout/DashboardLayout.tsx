"use client";

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/auth';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { MobileBottomBar } from './MobileBottomBar';
import { OnboardingTour } from './OnboardingTour';
import { ActiveCallOverlay } from '@/components/dialer/ActiveCallOverlay';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, login } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated || !user) {
      login({
        user: {
          id: 'u-3',
          email: 'teamlead@demo.de',
          firstName: 'Ahmet',
          lastName: 'Yilmaz',
          role: 'team_leader',
          tenantId: 't-1',
          language: 'tr',
        },
        accessToken: 'demo_token_authenticated',
        refreshToken: 'demo_refresh_token',
      });
    }
  }, [isAuthenticated, user, login]);

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
