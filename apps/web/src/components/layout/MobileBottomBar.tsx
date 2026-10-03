"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { 
  LayoutDashboard, 
  FileText, 
  Phone, 
  PhoneCall, 
  Menu,
  Sparkles
} from 'lucide-react';
import { usePortalStore } from '@/stores/portalStore';
import { cn } from '@/lib/utils';

export function MobileBottomBar() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const router = useRouter();
  const { callbacks, leads, mobileMenuOpen, setMobileMenuOpen } = usePortalStore();

  const pendingCallbacks = callbacks.filter((c) => !c.isCompleted).length;

  const items = [
    {
      href: '/',
      icon: LayoutDashboard,
      label: 'Panel',
      isActive: pathname === '/'
    },
    {
      href: '/leads',
      icon: FileText,
      label: 'Leads',
      badge: leads.length,
      isActive: pathname === '/leads' || pathname.startsWith('/leads/')
    },
    {
      href: '/agent',
      icon: Phone,
      label: 'Dialer',
      isCenterDialer: true,
      isActive: pathname === '/agent'
    },
    {
      href: '/callbacks',
      icon: PhoneCall,
      label: 'Rückrufe',
      badge: pendingCallbacks > 0 ? pendingCallbacks : undefined,
      isActive: pathname === '/callbacks'
    },
    {
      href: '#menu',
      icon: Menu,
      label: 'Menü',
      isMenuTrigger: true,
      isActive: mobileMenuOpen
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-dark-950/95 backdrop-blur-2xl border-t border-white/[0.08] px-3 py-2 flex items-center justify-around shadow-2xl safe-area-bottom">
      {items.map((item, idx) => {
        if (item.isCenterDialer) {
          return (
            <Link
              key={idx}
              href={item.href}
              className="flex flex-col items-center -mt-6 group focus:outline-none"
            >
              <div className={cn(
                "h-13 w-13 rounded-2xl flex items-center justify-center shadow-lg transition-transform active:scale-95 duration-200 border",
                item.isActive
                  ? "bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white border-emerald-300/40 shadow-emerald-500/30 shadow-lg scale-105"
                  : "gold-button-gradient text-dark-950 border-gold-300/50 shadow-gold-sm"
              )}>
                <item.icon size={22} className={cn(item.isActive && "animate-pulse")} />
              </div>
              <span className="text-[10px] font-bold mt-1 text-gold-400 font-mono tracking-tight">
                {item.label}
              </span>
            </Link>
          );
        }

        if (item.isMenuTrigger) {
          return (
            <button
              key={idx}
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={cn(
                "flex flex-col items-center justify-center min-w-[54px] py-1 transition-colors relative group",
                item.isActive ? "text-gold-400" : "text-gray-400 hover:text-gray-200"
              )}
            >
              <div className="relative">
                <item.icon size={20} className="transition-transform group-hover:scale-110" />
              </div>
              <span className="text-[10px] font-semibold mt-1 tracking-tight">
                {item.label}
              </span>
            </button>
          );
        }

        return (
          <Link
            key={idx}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center min-w-[54px] py-1 transition-colors relative group",
              item.isActive ? "text-gold-400 font-bold" : "text-gray-400 hover:text-gray-200"
            )}
          >
            <div className="relative">
              <item.icon size={20} className="transition-transform group-hover:scale-110" />
              {item.badge !== undefined && (
                <span className="absolute -top-1.5 -right-2.5 px-1.5 py-0.2 rounded-full text-[9px] font-mono font-black bg-gold-500 text-dark-950 shadow-sm">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-1 tracking-tight">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
