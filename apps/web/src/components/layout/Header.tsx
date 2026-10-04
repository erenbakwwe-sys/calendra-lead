"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { 
  Bell, User, LogOut, BookOpen, Globe, Building2, 
  CheckCircle, ChevronDown, Activity, Sparkles, Layers,
  ExternalLink, Check, Radio, ShieldCheck, Menu, X, ArrowLeft
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth';
import { usePortalStore } from '@/stores/portalStore';
import { useRouter } from 'next/navigation';

export function Header() {
  const t = useTranslations();
  const router = useRouter();
  const { user, logout, setLanguage } = useAuthStore();
  const { 
    workMode, 
    setWorkMode, 
    currentTenantId, 
    tenants, 
    switchTenant, 
    openTour, 
    notifications, 
    markNotificationRead, 
    markAllNotificationsRead,
    mobileMenuOpen,
    setMobileMenuOpen
  } = usePortalStore();

  const [tenantDropdownOpen, setTenantDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const currentTenant = tenants.find((t) => t.id === currentTenantId) || tenants[0];
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleLanguageSwitch = (lang: string) => {
    setLanguage(lang);
    document.cookie = `NEXT_LOCALE=${lang}; path=/; max-age=31536000`;
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-white/[0.06] bg-dark-950/85 backdrop-blur-2xl px-4 sm:px-6 lg:px-8 shadow-2xl">
      {/* Left: Brand & Company Switcher */}
      <div className="flex items-center gap-3 sm:gap-5">
        {/* Mobile Back Button */}
        <button
          onClick={() => router.back()}
          className="md:hidden flex items-center justify-center h-10 w-10 rounded-xl bg-dark-900 border border-white/[0.08] text-gray-300 hover:text-gold-400 hover:border-gold-500/40 transition-all shrink-0"
          aria-label="Zurück"
        >
          <ArrowLeft size={19} />
        </button>

        {/* Mobile Hamburger Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden flex items-center justify-center h-10 w-10 rounded-xl bg-dark-900 border border-white/[0.08] text-gray-300 hover:text-gold-400 hover:border-gold-500/40 transition-all shrink-0"
          aria-label="Menü"
        >
          {mobileMenuOpen ? <X size={19} /> : <Menu size={19} />}
        </button>

        <div 
          onClick={() => router.push('/')}
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group select-none"
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gold-metallic text-dark-950 font-black text-xl shadow-gold-md group-hover:scale-110 group-hover:shadow-gold-lg transition-all duration-300 animate-glow">
            <span className="relative z-10 drop-shadow-sm font-black">V</span>
            <div className="absolute inset-0 rounded-xl bg-white/25 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div>
            <div className="text-lg font-black tracking-tight text-gray-100 flex items-center gap-1 group-hover:text-gold-200 transition-colors">
              Vertriebs<span className="gold-gradient-text font-black">Hub</span>
            </div>
            <div className="flex items-center gap-1.5 -mt-1">
              <span className="text-[9px] font-mono tracking-widest text-gold-400 uppercase font-semibold">
                Lead Management & Vertrieb
              </span>
              <span className="text-gray-600 text-[9px]">•</span>
              <span className="text-[9px] text-gray-500 font-mono">v1.2</span>
            </div>
          </div>
        </div>

        {/* Vertical Divider */}
        <div className="h-6 w-px bg-white/[0.08] hidden md:block" />

        {/* Tenant Switcher Dropdown (Super Admin / Admin) */}
        <div className="relative hidden md:block">
          <button
            onClick={() => setTenantDropdownOpen(!tenantDropdownOpen)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-dark-900 border border-white/[0.08] text-xs text-gray-200 hover:border-gold-500/50 hover:bg-dark-850 hover:text-white transition-all shadow-sm group"
          >
            <div className="h-5 w-5 rounded-md bg-gold-500/15 border border-gold-500/30 flex items-center justify-center text-gold-400">
              <Building2 size={12} />
            </div>
            <span className="font-bold tracking-tight">{currentTenant.name}</span>
            <ChevronDown size={13} className="text-gray-500 group-hover:text-gold-400 transition-colors" />
          </button>

          {tenantDropdownOpen && (
            <div className="absolute left-0 mt-2 w-64 rounded-2xl bg-dark-900 border border-gold-500/30 p-2 shadow-card-hover z-50 animate-in fade-in backdrop-blur-2xl">
              <div className="px-3 py-1.5 text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider border-b border-white/[0.06] mb-1">
                {t('tenant.selectTenant')}
              </div>
              {tenants.map((ten) => (
                <button
                  key={ten.id}
                  onClick={() => {
                    switchTenant(ten.id);
                    setTenantDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 text-xs rounded-xl text-left transition-all ${
                    ten.id === currentTenantId
                      ? 'bg-gold-500/20 text-gold-300 font-bold border border-gold-500/40 shadow-sm'
                      : 'text-gray-300 hover:bg-dark-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`h-1.5 w-1.5 rounded-full ${ten.id === currentTenantId ? 'bg-gold-400' : 'bg-gray-600'}`} />
                    <span>{ten.name}</span>
                  </div>
                  {ten.id === currentTenantId && <Check size={14} className="text-gold-400" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Work Mode Toggle Badge */}
        <button
          onClick={() => setWorkMode(workMode === 'provider_leads' ? 'own_projects' : 'provider_leads')}
          className={`hidden lg:flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
            workMode === 'provider_leads'
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20 shadow-sm'
              : 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20 shadow-sm'
          }`}
          title="Modus umschalten (Provider-Leads vs. Eigene Projekte)"
        >
          <Layers size={13} />
          <span>{workMode === 'provider_leads' ? t('mode.provider_leads') : t('mode.own_projects')}</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/40 text-gray-300">Umschalten</span>
        </button>
      </div>

      {/* Right: Telephony Status, Tour, Language, Notifications, User */}
      <div className="flex items-center gap-3">
        {/* SIP Trunk Live Status Beacon */}
        <div className="hidden xl:flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-dark-900 border border-white/[0.08] text-[11px] text-gray-300 shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-emerald-500"></span>
          </span>
          <span className="font-mono text-gray-400">SIP Trunk:</span>
          <span className="text-emerald-400 font-bold font-mono">Frankfurt WSS</span>
          <span className="text-gray-600 font-mono">|</span>
          <span className="text-gray-400 font-mono text-[10px]">24ms</span>
        </div>

        {/* Guided Tour (Anleitung) Button */}
        <button
          onClick={openTour}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gold-500/10 border border-gold-500/30 text-gold-400 hover:bg-gold-500 hover:text-dark-950 font-bold text-xs transition-all shadow-gold-sm hover:shadow-gold-md"
        >
          <Sparkles size={14} className="text-gold-400" />
          <span className="hidden sm:inline">{t('common.guide')}</span>
        </button>

        {/* Language Switcher Pill (DE / TR) */}
        <div className="flex items-center bg-dark-900 border border-white/[0.08] rounded-xl p-0.5 shadow-sm">
          <button
            onClick={() => handleLanguageSwitch('de')}
            className={`px-2.5 py-1 text-xs font-black rounded-lg transition-all ${
              user?.language === 'de' 
                ? 'gold-button-gradient text-dark-950 shadow-sm' 
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            DE
          </button>
          <button
            onClick={() => handleLanguageSwitch('tr')}
            className={`px-2.5 py-1 text-xs font-black rounded-lg transition-all ${
              user?.language === 'tr' 
                ? 'gold-button-gradient text-dark-950 shadow-sm' 
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            TR
          </button>
        </div>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
            className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-dark-900 border border-white/[0.08] text-gray-300 hover:text-gold-400 hover:border-gold-500/40 transition-all shadow-sm"
          >
            <Bell size={17} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-r from-red-600 to-rose-500 text-[10px] font-black text-white shadow-md shadow-red-500/40 animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {notifDropdownOpen && (
            <div className="absolute right-0 mt-3 w-84 rounded-2xl bg-dark-900/95 border border-gold-500/30 p-3.5 shadow-card-hover z-50 animate-in fade-in backdrop-blur-2xl">
              <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-white/[0.08]">
                <span className="text-xs font-bold text-gray-100 flex items-center gap-1.5">
                  <Bell size={14} className="text-gold-500" />
                  <span>{t('common.notifications')}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-dark-800 text-gold-400 font-mono font-bold">
                    {unreadCount} neu
                  </span>
                </span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-[11px] font-semibold text-gold-400 hover:text-gold-300 hover:underline"
                  >
                    Gelesen markieren
                  </button>
                )}
              </div>
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => markNotificationRead(n.id)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                      n.isRead
                        ? 'bg-dark-950/60 border-white/[0.04] text-gray-400'
                        : 'bg-dark-850 border-gold-500/30 text-gray-200 hover:border-gold-500/50 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span className={n.isRead ? 'text-gray-300' : 'text-gold-300'}>{n.title}</span>
                      <span className="text-[10px] text-gray-500 font-mono">{n.time}</span>
                    </div>
                    <p className="mt-1 text-[11px] leading-relaxed text-gray-400">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Separator */}
        <div className="h-6 w-px bg-white/[0.08] hidden sm:block" />

        {/* User Profile Pill */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-dark-850 border border-transparent hover:border-white/[0.08] transition-all"
          >
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gold-metallic text-dark-950 font-black text-xs shadow-gold-sm">
              {user?.firstName?.charAt(0) || 'A'}
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-dark-900" />
            </div>
            <div className="hidden md:block text-left pr-1">
              <p className="text-xs font-bold text-gray-200 leading-tight">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-[10px] text-gold-400 font-semibold font-mono tracking-tight">
                {user?.role ? t(`users.roles.${user.role}`) : 'Teamleiter'}
              </p>
            </div>
            <ChevronDown size={13} className="text-gray-500 hidden md:block" />
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-3 w-56 rounded-2xl bg-dark-900 border border-gold-500/30 p-2 shadow-card-hover z-50 animate-in fade-in backdrop-blur-2xl">
              <div className="px-3 py-2.5 border-b border-white/[0.08] mb-1">
                <p className="text-xs font-bold text-gray-100">{user?.email}</p>
                <span className="text-[10px] text-gray-400 block font-mono">{currentTenant.name}</span>
              </div>
              <button
                onClick={() => {
                  setProfileDropdownOpen(false);
                  router.push('/settings');
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs rounded-xl text-gray-300 hover:bg-dark-800 hover:text-gold-300 font-medium transition-colors"
              >
                <span>{t('common.settings')}</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs rounded-xl text-red-400 hover:bg-red-500/10 font-bold transition-colors mt-1"
              >
                <LogOut size={14} />
                <span>{t('common.logout')}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
