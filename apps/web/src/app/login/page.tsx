"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useAuthStore } from '@/stores/auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  ShieldCheck, 
  Crown, 
  Building, 
  UserCheck, 
  Headphones, 
  Sparkles, 
  ArrowRight,
  Globe,
  Lock,
  Radio,
  CheckCircle2
} from 'lucide-react';
import { Canvas3DNetwork } from '@/components/ui/Canvas3DNetwork';
import { Card3D } from '@/components/ui/Card3D';

export default function LoginPage() {
  const t = useTranslations();
  const router = useRouter();
  const { login, setLanguage, user } = useAuthStore();
  
  const [email, setEmail] = useState('admin@demo.de');
  const [password, setPassword] = useState('Admin123!');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const demoAccounts = [
    { role: 'super_admin', label: '👑 Super-Admin', email: 'super@vertriebshub.de', name: 'Super Admin', sub: 'Plattform-Ebene', lang: 'de' },
    { role: 'tenant_admin', label: '🏢 Firma Admin', email: 'admin@demo.de', name: 'Firma Admin', sub: 'Mandanten-Admin', lang: 'de' },
    { role: 'team_leader', label: '👔 Takım Lideri (TL)', email: 'teamlead@demo.de', name: 'Ahmet Yilmaz', sub: 'Team Alpha', lang: 'tr' },
    { role: 'agent', label: '🎧 Temsilci / Agent', email: 'agent1@demo.de', name: 'Mehmet Demir', sub: 'Operator', lang: 'tr' },
    { role: 'qc', label: '🔍 Kalite Kontrol (QC)', email: 'qc@demo.de', name: 'Lisa Müller', sub: 'Prüfstelle', lang: 'de' },
  ];

  const handleSelectDemo = (acc: typeof demoAccounts[0]) => {
    setEmail(acc.email);
    setPassword('Admin123!');
    handleLoginDirect(acc.email, acc.role, acc.name, acc.lang);
  };

  const handleLoginDirect = (userEmail: string, role: string, name: string, preferredLang: string) => {
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      const [firstName, ...rest] = name.split(' ');
      const lastName = rest.join(' ') || 'User';

      login({
        user: {
          id: `u-${Date.now()}`,
          email: userEmail,
          firstName,
          lastName,
          role,
          tenantId: 't-1',
          language: preferredLang || 'tr',
        },
        accessToken: `jwt_token_${Date.now()}`,
        refreshToken: `refresh_token_${Date.now()}`,
      });

      document.cookie = `NEXT_LOCALE=${preferredLang || 'tr'}; path=/; max-age=31536000`;
      router.push('/');
    }, 350);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      const foundDemo = demoAccounts.find((d) => d.email.toLowerCase() === email.toLowerCase());
      const role = foundDemo ? foundDemo.role : 'tenant_admin';
      const name = foundDemo ? foundDemo.name : 'Administrator';
      const lang = foundDemo ? foundDemo.lang : 'tr';

      handleLoginDirect(email, role, name, lang);
    }, 450);
  };

  const switchLanguage = (lang: string) => {
    setLanguage(lang);
    document.cookie = `NEXT_LOCALE=${lang}; path=/; max-age=31536000`;
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* 3D Telecommunications Constellation Background */}
      <div className="absolute inset-0 pointer-events-auto opacity-40 z-0">
        <Canvas3DNetwork particleCount={55} interactive={true} />
      </div>

      {/* Dynamic Background Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[34rem] h-[34rem] bg-gold-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-10 left-10 w-80 h-80 bg-amber-500/5 rounded-full blur-[80px] pointer-events-none" />

      {/* Header Logo */}
      <div className="w-full max-w-lg mb-6 flex flex-col items-center text-center relative z-10 pointer-events-none">
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gold-metallic text-dark-950 font-black text-3xl shadow-gold-lg mb-3 border border-white/20 animate-glow">
          <span className="drop-shadow-sm font-black">V</span>
          <div className="absolute inset-0 rounded-2xl bg-white/20 animate-pulse" />
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-black text-gray-100 tracking-tight">
          Vertriebs<span className="gold-gradient-text font-black">Hub</span>
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-md font-medium">
          Mandantenfähiges Lead-Verteilungs- & WebRTC Dialer-Portal
        </p>
      </div>

      {/* Main Login 3D Glass Card */}
      <Card3D intensity={6} glowColor="rgba(212, 175, 55, 0.2)" className="w-full max-w-lg rounded-3xl bg-dark-900/90 border border-white/[0.08] shadow-card-hover backdrop-blur-2xl relative z-10 overflow-hidden">
        {/* Quick Demo Role Picker Bar */}
        <div className="bg-dark-850/90 p-5 border-b border-white/[0.06]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono font-bold text-gold-400 uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles size={14} />
              <span>{t('auth.quickLogin')}</span>
            </span>
            <span className="text-[10px] text-gray-400 font-mono">1-Klick Auswahl</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {demoAccounts.slice(0, 4).map((acc) => (
              <button
                key={acc.email}
                type="button"
                onClick={() => handleSelectDemo(acc)}
                className="flex items-center justify-between p-2.5 rounded-xl bg-dark-900 border border-white/[0.06] hover:border-gold-500/50 hover:bg-gold-500/10 text-gray-300 hover:text-gold-200 text-xs font-semibold transition-all group shadow-sm text-left"
              >
                <div className="truncate pr-1">
                  <div className="font-bold truncate group-hover:text-gold-300 transition-colors">{acc.label}</div>
                  <div className="text-[10px] text-gray-400 truncate">{acc.sub}</div>
                </div>
                <ArrowRight size={13} className="opacity-0 group-hover:opacity-100 text-gold-400 transition-opacity shrink-0" />
              </button>
            ))}
          </div>

          {/* 5th role (QC) full width button */}
          <button
            type="button"
            onClick={() => handleSelectDemo(demoAccounts[4])}
            className="w-full mt-2 flex items-center justify-between p-2.5 rounded-xl bg-dark-900 border border-white/[0.06] hover:border-gold-500/50 hover:bg-gold-500/10 text-gray-300 hover:text-gold-200 text-xs font-semibold transition-all group shadow-sm"
          >
            <div className="flex items-center gap-2">
              <span className="font-bold group-hover:text-gold-300">{demoAccounts[4].label}</span>
              <span className="text-[10px] text-gray-400">({demoAccounts[4].sub})</span>
            </div>
            <ArrowRight size={13} className="opacity-0 group-hover:opacity-100 text-gold-400 transition-opacity" />
          </button>
        </div>

        {/* Standard Form */}
        <div className="p-6 sm:p-8 space-y-5">
          <div className="text-center space-y-1">
            <h2 className="text-xl font-extrabold text-gray-100">
              {t('auth.loginTitle')}
            </h2>
            <p className="text-xs text-gray-400">
              Melden Sie sich mit Ihren Zugangsdaten an
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label={t('auth.email')}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-dark-850"
            />
            <Input
              label={t('auth.password')}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-dark-850"
            />

            <div className="flex justify-between items-center text-xs pt-1">
              <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded bg-dark-800 border-white/[0.08] text-gold-500 focus:ring-0" />
                <span>Angemeldet bleiben</span>
              </label>
              <button type="button" className="text-gold-400 hover:text-gold-300 font-semibold hover:underline">
                {t('auth.forgotPassword')}
              </button>
            </div>

            <Button
              type="submit"
              className="w-full py-4 gold-button-gradient text-dark-950 font-black text-sm rounded-xl shadow-gold-md"
              isLoading={isLoading}
            >
              {t('auth.loginButton')}
            </Button>
          </form>

          {/* Language Switcher Footer */}
          <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-1.5 font-medium">
              <Globe size={14} className="text-gold-400" />
              <span>{t('common.language')}:</span>
            </div>
            <div className="flex gap-1.5 font-bold bg-dark-850 p-1 rounded-xl border border-white/[0.06]">
              <button
                type="button"
                onClick={() => switchLanguage('de')}
                className={`px-3 py-1 rounded-lg text-xs font-black transition-all ${
                  user?.language === 'de' ? 'gold-button-gradient text-dark-950 shadow-sm' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                Deutsch (DE)
              </button>
              <button
                type="button"
                onClick={() => switchLanguage('tr')}
                className={`px-3 py-1 rounded-lg text-xs font-black transition-all ${
                  user?.language !== 'de' ? 'gold-button-gradient text-dark-950 shadow-sm' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                Türkçe (TR)
              </button>
            </div>
          </div>
        </div>
      </Card3D>

      {/* Trust Badges */}
      <div className="mt-8 flex items-center justify-center gap-6 text-[11px] text-gray-400 font-mono">
        <span className="flex items-center gap-1.5">
          <ShieldCheck size={14} className="text-emerald-400" />
          <span>DSGVO Konform (DE)</span>
        </span>
        <span className="text-gray-700">•</span>
        <span className="flex items-center gap-1.5">
          <Lock size={13} className="text-gold-400" />
          <span>AES-256-GCM</span>
        </span>
        <span className="text-gray-700">•</span>
        <span className="flex items-center gap-1.5">
          <Radio size={13} className="text-blue-400" />
          <span>Asterisk WebRTC</span>
        </span>
      </div>
    </div>
  );
}
