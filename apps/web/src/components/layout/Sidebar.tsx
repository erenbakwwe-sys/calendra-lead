"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Target, 
  Building2, 
  Headphones, 
  BarChart3, 
  CheckCircle, 
  MessageSquare, 
  PhoneCall, 
  Activity, 
  Settings,
  PhoneForwarded,
  ShieldCheck,
  Radio,
  Server,
  X,
  Layers,
  ChevronRight
} from 'lucide-react';
import { usePortalStore } from '@/stores/portalStore';

export function Sidebar() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const { 
    callbacks, 
    leads, 
    mobileMenuOpen, 
    setMobileMenuOpen,
    workMode,
    setWorkMode,
    tenants,
    currentTenantId,
    switchTenant
  } = usePortalStore();

  const pendingCallbacks = callbacks.filter((c) => !c.isCompleted).length;
  const qcPendingCount = leads.filter((l) => l.status === 'qc_pending' || l.status === 'qualified').length;

  const navGroups = [
    {
      title: 'OPERATIONS',
      items: [
        { href: '/', icon: LayoutDashboard, label: t('dashboard') },
        { href: '/leads', icon: FileText, label: t('leads'), badge: leads.length },
        { href: '/agent', icon: PhoneForwarded, label: t('dialer'), highlight: true, dot: true },
        { href: '/callbacks', icon: PhoneCall, label: t('callbacks'), badge: pendingCallbacks > 0 ? pendingCallbacks : undefined },
      ]
    },
    {
      title: 'MANAGEMENT & QC',
      items: [
        { href: '/campaigns', icon: Target, label: t('campaigns') },
        { href: '/qc', icon: CheckCircle, label: t('qc'), badge: qcPendingCount > 0 ? qcPendingCount : undefined },
        { href: '/live', icon: Activity, label: t('liveView') },
        { href: '/users', icon: Users, label: t('users') },
      ]
    },
    {
      title: 'ORGANISATION & STATS',
      items: [
        { href: '/callcenters', icon: Headphones, label: t('callcenters') },
        { href: '/providers', icon: Building2, label: t('providers') },
        { href: '/chat', icon: MessageSquare, label: t('chat') },
        { href: '/statistics', icon: BarChart3, label: t('statistics') },
        { href: '/settings', icon: Settings, label: t('settings') },
      ]
    }
  ];

  const renderNavLinks = (onItemClick?: () => void) => (
    <div className="p-4 flex-1 space-y-6">
      {navGroups.map((group, gIdx) => (
        <div key={gIdx} className="space-y-1.5">
          <div className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest px-3 mb-2">
            {group.title}
          </div>

          {group.items.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onItemClick}
                className={cn(
                  "group relative flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all duration-200",
                  isActive 
                    ? "bg-gradient-to-r from-gold-500/20 via-gold-500/10 to-transparent text-gold-300 font-bold border-l-2 border-gold-500 shadow-sm" 
                    : "text-gray-400 hover:bg-white/[0.04] hover:text-gray-100",
                  item.highlight && !isActive && "text-amber-300 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/15"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon 
                    size={17} 
                    className={cn(
                      "transition-transform duration-200 group-hover:scale-110",
                      isActive ? "text-gold-400" : item.highlight ? "text-amber-400" : "text-gray-400 group-hover:text-gray-200"
                    )} 
                  />
                  <span className="tracking-tight">{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.dot && (
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400" />
                  )}
                  {item.badge !== undefined && (
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[10px] font-mono font-extrabold",
                      isActive ? "bg-gold-500 text-dark-950 shadow-sm" : "bg-dark-800 text-gray-300 group-hover:bg-dark-700"
                    )}>
                      {item.badge}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      ))}
    </div>
  );

  const renderFooterTrunkWidget = () => (
    <div className="p-4 border-t border-white/[0.06] bg-dark-900/40 space-y-3">
      <div className="rounded-2xl bg-dark-900 border border-white/[0.06] p-3.5 space-y-2.5 shadow-card-dark">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[11px] font-bold text-gray-200 flex items-center gap-1.5">
            <Radio size={13} className="text-emerald-400 animate-pulse" />
            <span>Trunk Auslastung</span>
          </span>
          <span className="text-[10px] font-mono font-bold text-gold-400 bg-dark-800 px-1.5 py-0.5 rounded border border-white/[0.04]">
            4 / 10 Kanäle
          </span>
        </div>

        {/* Channel progress bar */}
        <div className="h-1.5 w-full bg-dark-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-emerald-500 via-gold-400 to-amber-500 w-[40%] rounded-full" />
        </div>

        <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono">
          <span>Codec: G.711a (HD)</span>
          <span className="text-emerald-400 font-bold">0.0% Drop</span>
        </div>
      </div>

      <div className="flex items-center justify-between px-2 text-[10px] text-gray-500 font-mono">
        <span className="flex items-center gap-1">
          <ShieldCheck size={12} className="text-emerald-500" />
          <span>DSGVO Enforced</span>
        </span>
        <span>Europe/Berlin</span>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex w-64 border-r border-white/[0.06] bg-dark-950/70 backdrop-blur-xl flex-col h-[calc(100vh-4rem)] overflow-y-auto select-none shrink-0">
        {renderNavLinks()}
        {renderFooterTrunkWidget()}
      </aside>

      {/* Mobile Off-Canvas Drawer Overlay */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm md:hidden animate-in fade-in duration-200"
        />
      )}

      {/* Mobile Off-Canvas Slide Drawer */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-dark-950/98 border-r border-gold-500/30 flex flex-col h-full overflow-y-auto transition-transform duration-300 md:hidden shadow-2xl safe-area-bottom",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Mobile Drawer Header */}
        <div className="p-4 border-b border-white/[0.08] flex items-center justify-between bg-dark-900/60">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold-metallic text-dark-950 font-black text-base shadow-gold-sm">
              C
            </div>
            <div>
              <span className="font-extrabold text-sm text-gray-100">Calendra Lead</span>
              <span className="text-[9px] font-mono block text-gold-400 uppercase">Mobil-Menü</span>
            </div>
          </div>

          <button
            onClick={() => setMobileMenuOpen(false)}
            className="h-8 w-8 rounded-lg bg-dark-850 border border-white/[0.08] flex items-center justify-center text-gray-400 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        {/* Mobile Tenant Selector */}
        <div className="p-3 bg-dark-900/40 border-b border-white/[0.06]">
          <span className="text-[10px] font-mono text-gray-400 uppercase font-bold block mb-1.5">Firma / Mandant:</span>
          <select
            value={currentTenantId}
            onChange={(e) => switchTenant(e.target.value)}
            className="w-full bg-dark-850 border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-gray-200 font-semibold focus:outline-none focus:border-gold-500/50"
          >
            {tenants.map((ten) => (
              <option key={ten.id} value={ten.id} className="bg-dark-900 text-gray-200">
                {ten.name}
              </option>
            ))}
          </select>
        </div>

        {/* Mobile Work Mode Toggle */}
        <div className="px-4 py-2.5 border-b border-white/[0.06] flex items-center justify-between">
          <span className="text-xs text-gray-300 font-medium">Betriebsmodus:</span>
          <button
            onClick={() => setWorkMode(workMode === 'provider_leads' ? 'own_projects' : 'provider_leads')}
            className={cn(
              "px-2.5 py-1 rounded-full text-[11px] font-bold border transition-colors",
              workMode === 'provider_leads'
                ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                : "bg-amber-500/15 text-amber-300 border-amber-500/30"
            )}
          >
            {workMode === 'provider_leads' ? 'Provider-Leads' : 'Eigene Projekte'}
          </button>
        </div>

        {/* Nav Links with auto-close */}
        {renderNavLinks(() => setMobileMenuOpen(false))}

        {/* Asterisk Widget */}
        {renderFooterTrunkWidget()}
      </aside>
    </>
  );
}
