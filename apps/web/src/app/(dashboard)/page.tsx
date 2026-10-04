"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useAuthStore } from '@/stores/auth';
import { usePortalStore, LeadItem } from '@/stores/portalStore';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  Users, UserPlus, BarChart3, PhoneCall, 
  FileText, Target, CheckCircle, MessageSquare,
  Phone, Users2, Activity, ArrowUpRight, 
  Sparkles, ShieldCheck, Clock, MapPin, Plus, 
  Upload, Radio, Zap, ArrowRight, Check, Sun, Flame, Accessibility, Fuel, Package
} from 'lucide-react';
import { LeadIntakeWizard, ProjectKey } from '@/components/leads/LeadIntakeWizard';
import { Canvas3DNetwork } from '@/components/ui/Canvas3DNetwork';
import { Card3D } from '@/components/ui/Card3D';

export default function DashboardPage() {
  const t = useTranslations();
  const router = useRouter();
  const { user } = useAuthStore();
  const { leads, callbacks, startCall, addUser } = usePortalStore();

  const [newUserModalOpen, setNewUserModalOpen] = useState(false);
  const [leadWizardOpen, setLeadWizardOpen] = useState(false);
  const [wizardDefaultProject, setWizardDefaultProject] = useState<ProjectKey>('solar');
  const [newUserForm, setNewUserForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'agent',
    language: 'tr',
    team: 'Team Alpha',
    callCenter: 'Berlin Call Center'
  });

  const pendingCallbacksCount = callbacks.filter((c) => !c.isCompleted).length;
  const qualifiedLeadsCount = leads.filter((l) => l.status === 'qualified' || l.status === 'qc_pending' || l.status === 'approved').length;

  const statCards = [
    { 
      title: t('dashboard.stats.totalLeads'), 
      value: (12400 + leads.length).toLocaleString('de-DE'), 
      change: '+14% heute', 
      subtext: 'API Ingest aktiv',
      icon: FileText, 
      sparkline: [20, 35, 45, 60, 50, 75, 90],
      accentColor: 'text-blue-400',
      action: () => router.push('/leads')
    },
    { 
      title: t('dashboard.stats.callsToday'), 
      value: '842', 
      change: '88% Erreichbarkeit', 
      subtext: 'Ø 03:04 Min/Call',
      icon: Phone, 
      sparkline: [10, 40, 30, 70, 60, 85, 95],
      accentColor: 'text-emerald-400',
      action: () => router.push('/agent')
    },
    { 
      title: t('dashboard.stats.activeAgents'), 
      value: '24', 
      change: '6 Teams online', 
      subtext: 'Türkei & Deutschland',
      icon: Users2, 
      sparkline: [24, 24, 23, 24, 24, 24, 24],
      accentColor: 'text-amber-400',
      action: () => router.push('/live')
    },
    { 
      title: t('dashboard.stats.conversionRate'), 
      value: '16.2%', 
      change: '+2.4% vs. Vormonat', 
      subtext: 'Lead-zu-Sale',
      icon: Activity, 
      sparkline: [12, 13, 13.5, 14.8, 15.2, 15.8, 16.2],
      accentColor: 'text-purple-400',
      action: () => router.push('/statistics')
    },
  ];

  const mainTiles = [
    { 
      id: 'users', 
      title: t('dashboard.tiles.userManagement'), 
      desc: t('dashboard.tiles.userManagementDesc'), 
      icon: Users,
      badge: '24 Aktiv',
      onClick: () => router.push('/users')
    },
    { 
      id: 'new_user', 
      title: t('dashboard.tiles.newUser'), 
      desc: t('dashboard.tiles.newUserDesc'), 
      icon: UserPlus,
      highlight: true,
      onClick: () => setNewUserModalOpen(true)
    },
    { 
      id: 'stats', 
      title: t('dashboard.tiles.statistics'), 
      desc: t('dashboard.tiles.statisticsDesc'), 
      icon: BarChart3,
      badge: 'Live',
      onClick: () => router.push('/statistics')
    },
    { 
      id: 'callbacks', 
      title: t('dashboard.tiles.callbacks'), 
      desc: `${t('dashboard.tiles.callbacksDesc')} (${pendingCallbacksCount} fällig)`, 
      icon: PhoneCall,
      alertBadge: pendingCallbacksCount > 0 ? `${pendingCallbacksCount} Fällig` : undefined,
      onClick: () => router.push('/callbacks')
    },
    { 
      id: 'leads', 
      title: t('dashboard.tiles.leads'), 
      desc: t('dashboard.tiles.leadsDesc'), 
      icon: FileText,
      badge: `${leads.length} Leads`,
      onClick: () => router.push('/leads')
    },
    { 
      id: 'campaigns', 
      title: t('dashboard.tiles.campaigns'), 
      desc: t('dashboard.tiles.campaignsDesc'), 
      icon: Target,
      badge: '3 Aktiv',
      onClick: () => router.push('/campaigns')
    },
    { 
      id: 'qc', 
      title: t('dashboard.tiles.qc'), 
      desc: t('dashboard.tiles.qcDesc'), 
      icon: CheckCircle,
      alertBadge: qualifiedLeadsCount > 0 ? `${qualifiedLeadsCount} Bereit` : undefined,
      onClick: () => router.push('/qc')
    },
    { 
      id: 'chat', 
      title: t('dashboard.tiles.chat'), 
      desc: t('dashboard.tiles.chatDesc'), 
      icon: MessageSquare,
      badge: '4 Online',
      onClick: () => router.push('/chat')
    },
  ];

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserForm.firstName || !newUserForm.email) return;

    addUser(newUserForm);
    setNewUserModalOpen(false);
    setNewUserForm({
      firstName: '',
      lastName: '',
      email: '',
      role: 'agent',
      language: 'tr',
      team: 'Team Alpha',
      callCenter: 'Berlin Call Center'
    });
    router.push('/users');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-7xl mx-auto relative">
      {/* Background Ambient Glows */}
      <div className="ambient-glow-gold -top-20 right-10 animate-pulse-slow pointer-events-none" />
      <div className="ambient-glow-purple top-80 -left-20 animate-pulse-slow pointer-events-none" />
      <div className="ambient-glow-emerald bottom-40 right-20 animate-pulse-slow pointer-events-none" />

      {/* Executive Command Banner */}
      <div className="relative rounded-3xl bg-dark-900 border border-white/[0.08] p-6 lg:p-8 shadow-card-dark overflow-hidden">
        {/* Subtle radial gradients */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        
        {/* 3D Telecommunications Constellation Visualizer (Frankfurt <-> Turkey Hubs) */}
        <div className="absolute -right-12 -top-12 -bottom-12 w-[28rem] opacity-35 pointer-events-none hidden md:block">
          <Canvas3DNetwork particleCount={36} interactive={false} />
        </div>
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-gold-500/15 text-gold-300 border border-gold-500/30 uppercase tracking-widest shadow-sm">
                {user?.role ? t(`users.roles.${user.role}`) : 'Teamleiter'}
              </span>

              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-dark-850 border border-white/[0.06] text-xs">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-gray-300 font-mono text-[11px]">System: Nominal (0 Fehler)</span>
              </div>

              <div className="text-xs text-gray-500 font-mono hidden sm:inline">
                Berlin: {new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} MEZ
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-100 tracking-tight mt-1">
              {t('dashboard.welcome', { name: user?.firstName || 'Teamleiter' })}
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 max-w-2xl leading-relaxed">
              Willkommen im zentralen Steuerungsportal. Leads werden in Echtzeit aus dem deutschen Markt entgegengenommen, DSGVO-validiert und an Ihre Operatoren verteilt.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-3 relative z-10 flex-wrap sm:flex-nowrap">
            <Button
              onClick={() => {
                setWizardDefaultProject('solar');
                setLeadWizardOpen(true);
              }}
              className="gold-button-gradient text-dark-950 font-black flex items-center gap-2 px-5 py-3.5 rounded-xl shadow-gold-md"
            >
              <Plus size={16} />
              <span>Projekt-Lead erfassen</span>
            </Button>

            <Button
              onClick={() => router.push('/agent')}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold flex items-center gap-2 px-5 py-3.5 rounded-xl shadow-md shadow-emerald-600/20"
            >
              <Phone size={16} className="animate-bounce" />
              <span>{t('dashboard.openDialer')}</span>
            </Button>

            <Button
              variant="secondary"
              onClick={() => router.push('/leads')}
              className="flex items-center gap-2 px-4 py-3.5 rounded-xl bg-dark-850 hover:bg-dark-800 text-gray-200 border border-white/[0.08]"
            >
              <Upload size={16} />
              <span>{t('dashboard.importCsv')}</span>
            </Button>
          </div>
        </div>

        {/* 6 Core Projects Fast-Intake Bar */}
        <div className="mt-6 pt-5 border-t border-white/[0.06] relative z-10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles size={13} className="text-gold-400" />
              <span>Lead-Erfassung nach Projekt auswählen (6 Branchen):</span>
            </span>
            <span className="text-[10px] text-gray-500 font-mono hidden sm:inline">1-Klick Projektstart</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {[
              { key: 'solar' as ProjectKey, label: 'Solar / PV', icon: Sun, color: 'text-amber-400' },
              { key: 'waermepumpe' as ProjectKey, label: 'Wärmepumpe', icon: Flame, color: 'text-rose-400' },
              { key: 'treppenlift' as ProjectKey, label: 'Treppenlift', icon: Accessibility, color: 'text-purple-400' },
              { key: 'strom' as ProjectKey, label: 'Stromwechsel', icon: Zap, color: 'text-yellow-400' },
              { key: 'gas' as ProjectKey, label: 'Gaswechsel', icon: Fuel, color: 'text-blue-400' },
              { key: 'pflegebox' as ProjectKey, label: 'Pflegebox §40', icon: Package, color: 'text-emerald-400' },
            ].map((p) => (
              <button
                key={p.key}
                type="button"
                onClick={() => {
                  setWizardDefaultProject(p.key);
                  setLeadWizardOpen(true);
                }}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-dark-850/90 border border-white/[0.06] hover:border-gold-500/60 hover:bg-gold-500/10 hover:-translate-y-1 hover:shadow-gold-sm active:translate-y-0 text-gray-200 hover:text-white transition-all duration-300 group text-left cursor-pointer"
              >
                <div className={`p-2 rounded-xl bg-dark-900 border border-white/[0.05] ${p.color} group-hover:scale-115 group-hover:rotate-3 transition-transform duration-300 shadow-sm`}>
                  <p.icon size={16} />
                </div>
                <div className="truncate">
                  <div className="font-extrabold text-xs truncate group-hover:text-gold-200 transition-colors">{p.label}</div>
                  <div className="text-[10px] text-gray-500 font-mono flex items-center gap-1 group-hover:text-gold-400/80 transition-colors">
                    <span>Erfassen</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Cards Row with Sparklines */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <Card3D 
            key={i} 
            onClick={stat.action}
            intensity={9}
            glowColor="rgba(212, 175, 55, 0.22)"
            className="group cursor-pointer rounded-2xl bg-dark-900 border border-white/[0.07] p-5 shadow-card-dark hover:border-gold-500/40 hover:shadow-card-hover transition-all duration-300 relative overflow-hidden"
          >
            {/* Top row */}
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-gray-400">
                {stat.title}
              </span>
              <div className="p-2 rounded-xl bg-dark-850 border border-white/[0.06] text-gray-300 group-hover:text-gold-400 group-hover:scale-110 transition-all">
                <stat.icon size={18} />
              </div>
            </div>

            {/* Value */}
            <div className="mt-3 flex items-baseline justify-between">
              <div className="text-3xl font-black text-gray-100 tracking-tight font-mono group-hover:text-gold-300 transition-colors">
                {stat.value}
              </div>
              <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                {stat.change}
              </span>
            </div>

            {/* Sparkline Visual Simulation */}
            <div className="mt-4 pt-3 border-t border-white/[0.04] flex items-end justify-between">
              <span className="text-[10px] text-gray-500 font-mono">{stat.subtext}</span>
              <div className="flex items-end gap-1 h-5">
                {stat.sparkline.map((val, sIdx) => (
                  <div
                    key={sIdx}
                    className="w-1.5 bg-gradient-to-t from-gold-500/40 to-gold-400 rounded-full group-hover:from-gold-400 group-hover:to-gold-200 transition-all"
                    style={{ height: `${(val / 100) * 20}px` }}
                  />
                ))}
              </div>
            </div>
          </Card3D>
        ))}
      </div>

      {/* 8 Main Kacheln / Tiles (Elite Grid Layout) */}
      <div>
        <div className="flex items-center justify-between mb-4 px-1">
          <div>
            <h2 className="text-lg font-black text-gray-100 flex items-center gap-2">
              <Sparkles size={18} className="text-gold-400" />
              <span>Hauptfunktionen & Portalmodule</span>
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">Schnellzugriff auf alle Bereiche des Callcenters & Vertriebs</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {mainTiles.map((tile) => (
            <Card3D 
              key={tile.id} 
              onClick={tile.onClick}
              intensity={11}
              highlight={tile.highlight}
              glowColor={tile.highlight ? "rgba(212, 175, 55, 0.35)" : "rgba(212, 175, 55, 0.18)"}
              className={`group cursor-pointer rounded-2xl p-6 transition-all duration-300 relative flex flex-col justify-between h-52 border ${
                tile.highlight
                  ? 'bg-gradient-to-br from-dark-900 via-dark-850 to-dark-900 border-gold-500/50 shadow-gold-sm hover:border-gold-400 hover:shadow-gold-md'
                  : 'bg-dark-900 border-white/[0.07] hover:border-gold-500/40 shadow-card-dark hover:shadow-card-hover'
              }`}
            >
              {/* Top Row: Icon, Badges, Arrow */}
              <div className="flex items-start justify-between">
                <div className={`p-3 rounded-2xl transition-all duration-300 ${
                  tile.highlight
                    ? 'bg-gold-metallic text-dark-950 shadow-gold-sm'
                    : 'bg-dark-850 border border-white/[0.08] text-gold-400 group-hover:bg-gold-500 group-hover:text-dark-950 group-hover:scale-105'
                }`}>
                  <tile.icon size={22} />
                </div>

                <div className="flex items-center gap-2">
                  {tile.alertBadge && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                      {tile.alertBadge}
                    </span>
                  )}
                  {tile.badge && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-dark-800 text-gray-300 border border-white/[0.06]">
                      {tile.badge}
                    </span>
                  )}
                  <div className="h-7 w-7 rounded-full bg-dark-850 border border-white/[0.06] flex items-center justify-center text-gray-400 group-hover:text-gold-400 group-hover:border-gold-500/40 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all">
                    <ArrowUpRight size={14} />
                  </div>
                </div>
              </div>

              {/* Bottom: Title & Description */}
              <div>
                <h3 className="font-extrabold text-base text-gray-100 group-hover:text-gold-300 transition-colors">
                  {tile.title}
                </h3>
                <p className="text-xs text-gray-400 mt-1.5 leading-relaxed line-clamp-2">
                  {tile.desc}
                </p>
              </div>

              {/* Bottom accent glow bar */}
              <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-gold-500/0 to-transparent group-hover:via-gold-500/40 transition-all duration-500" />
            </Card3D>
          ))}
        </div>
      </div>

      {/* Fresh Ingested Leads & Callbacks Command Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Real-time Ingested Leads (2 Cols) */}
        <div className="lg:col-span-2 rounded-2xl bg-dark-900 border border-white/[0.08] p-6 shadow-card-dark space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
            <div>
              <h3 className="text-base font-extrabold text-gray-100 flex items-center gap-2">
                <Radio size={16} className="text-emerald-400 animate-pulse" />
                <span>Neueste Leads aus Deutschland (E.164 verifiziert)</span>
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">Eingehend via REST-Push API • DSGVO Werbeeinwilligung gesichert</p>
            </div>
            <Button
              variant="ghost"
              onClick={() => router.push('/leads')}
              className="text-xs text-gold-400 hover:text-gold-300 font-bold flex items-center gap-1"
            >
              <span>Alle Leads ({leads.length})</span>
              <ArrowRight size={13} />
            </Button>
          </div>

          <div className="space-y-2.5">
            {leads.slice(0, 4).map((lead) => (
              <div
                key={lead.id}
                className="flex items-center justify-between p-3.5 rounded-xl bg-dark-850/80 border border-white/[0.04] hover:border-gold-500/40 hover:bg-dark-850 transition-all duration-200 group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="h-10 w-10 rounded-xl bg-dark-800 text-gold-400 border border-gold-500/30 flex items-center justify-center font-black text-xs font-mono shadow-sm group-hover:scale-105 transition-transform">
                    {lead.firstName.charAt(0)}{lead.lastName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-gray-100 group-hover:text-gold-300 transition-colors">
                        {lead.firstName} {lead.lastName}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.2 rounded-md bg-dark-800 text-gray-400 border border-white/[0.04]">
                        {lead.city} ({lead.postalCode})
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                      <span className="font-mono text-gray-300">{lead.phone}</span>
                      <span>•</span>
                      <span className="text-gold-400 font-semibold">{lead.product}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="hidden sm:flex items-center gap-1 text-[11px] text-emerald-400 font-mono mr-2">
                    <ShieldCheck size={13} />
                    <span>Opt-in OK</span>
                  </div>
                  <Button
                    onClick={() => startCall(lead)}
                    className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:brightness-110 text-white font-bold text-xs py-2 px-4 rounded-xl shadow-md shadow-emerald-600/20"
                  >
                    <Phone size={13} />
                    <span>Anrufen</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Scheduled Callbacks (1 Col) */}
        <div className="rounded-2xl bg-dark-900 border border-white/[0.08] p-6 shadow-card-dark flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-gold-400" />
                <h3 className="text-base font-extrabold text-gray-100">Fällige Rückrufe</h3>
              </div>
              <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-500/15 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                {pendingCallbacksCount} heute
              </span>
            </div>

            <div className="space-y-2.5">
              {callbacks.filter((c) => !c.isCompleted).slice(0, 3).map((cb) => (
                <div key={cb.id} className="p-3.5 rounded-xl bg-dark-850 border border-white/[0.04] text-xs space-y-2 hover:border-gold-500/30 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-100">{cb.leadName}</span>
                    <span className="font-mono font-bold text-gold-400 bg-dark-900 px-2 py-0.5 rounded-lg border border-white/[0.06]">
                      {cb.timeSlot}
                    </span>
                  </div>
                  <p className="text-gray-400 text-[11px] leading-relaxed truncate">"{cb.note}"</p>
                  <div className="flex items-center justify-between pt-1 border-t border-white/[0.04]">
                    <span className="text-[10px] font-mono text-gray-500">{cb.phone}</span>
                    <button
                      onClick={() => {
                        const targetLead = leads.find((l) => l.id === cb.leadId) || leads[0];
                        startCall(targetLead);
                      }}
                      className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
                    >
                      <Phone size={12} />
                      <span>Jetzt wählen</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button
            variant="secondary"
            onClick={() => router.push('/callbacks')}
            className="w-full text-xs font-bold text-gray-200 hover:text-gold-400 bg-dark-850 rounded-xl py-3 border border-white/[0.08]"
          >
            Alle Rückrufe & Kalender anzeigen
          </Button>
        </div>
      </div>

      {/* New User Modal */}
      {newUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in">
          <div className="w-full max-w-lg bg-dark-900 border border-gold-500/40 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <h3 className="text-lg font-extrabold text-gray-100 flex items-center gap-2">
                <UserPlus size={20} className="text-gold-500" />
                <span>{t('users.createUser')}</span>
              </h3>
              <button onClick={() => setNewUserModalOpen(false)} className="text-gray-400 hover:text-gray-100">✕</button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">{t('users.firstName')} *:</label>
                  <input
                    type="text"
                    required
                    value={newUserForm.firstName}
                    onChange={(e) => setNewUserForm({ ...newUserForm, firstName: e.target.value })}
                    className="w-full bg-dark-850 border border-white/[0.08] rounded-xl p-2.5 text-xs text-gray-100 focus:border-gold-500 focus:outline-none"
                    placeholder="Ahmet"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">{t('users.lastName')} *:</label>
                  <input
                    type="text"
                    required
                    value={newUserForm.lastName}
                    onChange={(e) => setNewUserForm({ ...newUserForm, lastName: e.target.value })}
                    className="w-full bg-dark-850 border border-white/[0.08] rounded-xl p-2.5 text-xs text-gray-100 focus:border-gold-500 focus:outline-none"
                    placeholder="Yilmaz"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">{t('users.email')} *:</label>
                <input
                  type="email"
                  required
                  value={newUserForm.email}
                  onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                  className="w-full bg-dark-850 border border-white/[0.08] rounded-xl p-2.5 text-xs text-gray-100 focus:border-gold-500 focus:outline-none"
                  placeholder="ahmet@demo.de"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">{t('users.role')}:</label>
                  <select
                    value={newUserForm.role}
                    onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                    className="w-full bg-dark-850 border border-white/[0.08] rounded-xl p-2.5 text-xs text-gray-100 focus:border-gold-500 focus:outline-none"
                  >
                    <option value="agent">Agent (Operator)</option>
                    <option value="team_leader">Teamleiter</option>
                    <option value="qc">Qualitätskontrolle (QC)</option>
                    <option value="tenant_admin">Mandanten-Admin</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">Standard-Sprache:</label>
                  <select
                    value={newUserForm.language}
                    onChange={(e) => setNewUserForm({ ...newUserForm, language: e.target.value })}
                    className="w-full bg-dark-850 border border-white/[0.08] rounded-xl p-2.5 text-xs text-gray-100 focus:border-gold-500 focus:outline-none"
                  >
                    <option value="tr">Türkisch (TR)</option>
                    <option value="de">Deutsch (DE)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-white/[0.06]">
                <Button variant="ghost" type="button" onClick={() => setNewUserModalOpen(false)}>
                  {t('common.cancel')}
                </Button>
                <Button type="submit" className="gold-button-gradient text-dark-950 font-bold px-5">
                  {t('common.save')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dedicated Project Lead Intake Tool (6 Core Projects) */}
      <LeadIntakeWizard
        isOpen={leadWizardOpen}
        onClose={() => setLeadWizardOpen(false)}
        defaultProject={wizardDefaultProject}
      />
    </div>
  );
}
