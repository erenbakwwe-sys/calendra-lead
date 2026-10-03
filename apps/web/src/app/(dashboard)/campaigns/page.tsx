"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { usePortalStore, CampaignItem } from '@/stores/portalStore';
import { 
  Target, Plus, Play, Pause, Clock, ShieldCheck, 
  Settings, Users, BarChart3, ArrowRight 
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function CampaignsPage() {
  const t = useTranslations('nav');
  const { campaigns, toggleCampaignStatus, addCampaign } = usePortalStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    product: 'Photovoltaik',
    assignmentMode: 'round_robin' as const,
    dialerMode: 'preview' as const,
    callWindow: '09:00 - 20:00 (Berlin)',
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) return;
    addCampaign(form);
    setModalOpen(false);
    setForm({
      name: '',
      product: 'Photovoltaik',
      assignmentMode: 'round_robin',
      dialerMode: 'preview',
      callWindow: '09:00 - 20:00 (Berlin)',
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-100 flex items-center gap-2.5">
            <Target className="text-gold-500" size={24} />
            <span>Kampagnenverwaltung</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Steuerung von Anrufzeiten (09:00-20:00 DE), Dialermodi und automatischen Zuweisungen
          </p>
        </div>

        <Button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-gold-500 to-amber-500 text-dark-950 font-bold text-xs shadow-lg shadow-gold-500/20 hover:brightness-110"
        >
          <Plus size={16} />
          <span>Neue Kampagne anlegen</span>
        </Button>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((camp) => (
          <div
            key={camp.id}
            className={`p-6 rounded-2xl border transition-all space-y-5 shadow-xl ${
              camp.isActive
                ? 'bg-dark-900 border-gold-500/40 shadow-gold-500/5'
                : 'bg-dark-900/60 border-dark-border opacity-70'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-gold-400 uppercase tracking-wider">
                  {camp.product}
                </span>
                <h3 className="font-bold text-lg text-gray-100 mt-0.5">{camp.name}</h3>
              </div>

              <button
                onClick={() => toggleCampaignStatus(camp.id)}
                className={`p-2 rounded-xl border transition-all ${
                  camp.isActive
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
                }`}
                title={camp.isActive ? 'Pausieren' : 'Aktivieren'}
              >
                {camp.isActive ? <Pause size={16} /> : <Play size={16} />}
              </button>
            </div>

            {/* Campaign Metrics */}
            <div className="grid grid-cols-3 gap-2 bg-dark-850 p-3 rounded-xl border border-dark-border text-center">
              <div>
                <span className="text-[10px] text-gray-400 block">Gesamt</span>
                <span className="font-extrabold text-sm text-gray-200">{camp.totalLeads}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block">Angerufen</span>
                <span className="font-extrabold text-sm text-gold-400">{camp.contactedLeads}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block">Konversion</span>
                <span className="font-extrabold text-sm text-emerald-400">{camp.conversionRate}</span>
              </div>
            </div>

            {/* Rules & Time window */}
            <div className="space-y-2 text-xs text-gray-300">
              <div className="flex items-center justify-between py-1 border-b border-dark-border">
                <span className="text-gray-400">Dialer-Modus:</span>
                <span className="font-semibold uppercase text-gold-400">{camp.dialerMode}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-dark-border">
                <span className="text-gray-400">Zuweisung:</span>
                <span className="font-semibold text-gray-200">{camp.assignmentMode}</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-gray-400 flex items-center gap-1">
                  <Clock size={13} />
                  <span>Anrufzeiten DE:</span>
                </span>
                <span className="font-mono text-gray-200">{camp.callWindow}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center text-xs">
              <span className={`inline-flex items-center gap-1 font-semibold ${camp.isActive ? 'text-emerald-400' : 'text-amber-400'}`}>
                <span className={`h-2 w-2 rounded-full ${camp.isActive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                <span>{camp.isActive ? 'Aktiv (Wählt)' : 'Pausiert'}</span>
              </span>

              <span className="text-[11px] text-gray-400 bg-dark-850 px-2.5 py-1 rounded-lg border border-dark-border">
                Keine Anrufe an Sonn-/Feiertagen
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* New Campaign Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-lg bg-dark-900 border border-gold-500/40 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-gray-100 flex items-center gap-2">
              <Target className="text-gold-500" size={20} />
              <span>Neue Kampagne konfigurieren</span>
            </h3>

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="text-xs text-gray-400 block mb-1">Kampagnenname:</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="z. B. Wärmepumpe Bayern 2026"
                  className="w-full bg-dark-850 border border-dark-border rounded-lg p-2.5 text-xs text-gray-100 focus:border-gold-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Produkt / Branche:</label>
                  <select
                    value={form.product}
                    onChange={(e) => setForm({ ...form, product: e.target.value })}
                    className="w-full bg-dark-850 border border-dark-border rounded-lg p-2.5 text-xs text-gray-100 focus:border-gold-500 focus:outline-none"
                  >
                    <option value="Photovoltaik">Photovoltaik</option>
                    <option value="Wärmepumpe">Wärmepumpe</option>
                    <option value="Treppenlift">Treppenlift</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-gray-400 block mb-1">Dialer-Modus:</label>
                  <select
                    value={form.dialerMode}
                    onChange={(e) => setForm({ ...form, dialerMode: e.target.value as any })}
                    className="w-full bg-dark-850 border border-dark-border rounded-lg p-2.5 text-xs text-gray-100 focus:border-gold-500 focus:outline-none"
                  >
                    <option value="preview">Preview (Agent sieht Lead vorher)</option>
                    <option value="power">Power-Dialer (Auto-Wahl)</option>
                    <option value="manual">Manuell (Click-to-Call)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-400 block mb-1">Zuweisungsverfahren:</label>
                <select
                  value={form.assignmentMode}
                  onChange={(e) => setForm({ ...form, assignmentMode: e.target.value as any })}
                  className="w-full bg-dark-850 border border-dark-border rounded-lg p-2.5 text-xs text-gray-100 focus:border-gold-500 focus:outline-none"
                >
                  <option value="round_robin">Round-Robin (Gleichmäßige Reihung)</option>
                  <option value="load_based">Lastbasiert (Wenigste offene Leads zuerst)</option>
                  <option value="pool">Pool-Modus (Agenten nehmen nächsten Lead)</option>
                  <option value="manual">Manuell durch Teamleiter</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-dark-border">
                <Button variant="ghost" type="button" onClick={() => setModalOpen(false)}>
                  Abbrechen
                </Button>
                <Button type="submit" className="bg-gold-500 hover:bg-gold-600 text-dark-950 font-bold">
                  Kampagne starten
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
