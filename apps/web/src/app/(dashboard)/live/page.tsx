"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { 
  Activity, Headphones, PhoneCall, Radio, Volume2, 
  Mic, UserCheck, ShieldAlert, Sparkles, CheckCircle2,
  Clock, Coffee, PhoneOff
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function LivePage() {
  const t = useTranslations('live');
  const [supervisorAction, setSupervisorAction] = useState<{ type: 'listen' | 'whisper' | 'barge'; agent: string; lead: string } | null>(null);

  const agents = [
    { id: '1', name: 'Mehmet Demir', team: 'Team Alpha', status: 'on_call', duration: '04:12', lead: 'Sabine Müller (München)', phone: '+49 151 98765432' },
    { id: '2', name: 'Ayşe Kaya', team: 'Team Alpha', status: 'on_call', duration: '01:45', lead: 'Maximilian Mustermann (Berlin)', phone: '+49 176 12345678' },
    { id: '3', name: 'Can Polat', team: 'Team Beta', status: 'available', duration: '00:22', lead: null, phone: null },
    { id: '4', name: 'Fatma Şahin', team: 'Team Alpha', status: 'wrap_up', duration: '00:48', lead: 'Elena Fischer', phone: null },
    { id: '5', name: 'Emre Yurt', team: 'Team Beta', status: 'pause', duration: '07:15', lead: null, phone: null },
    { id: '6', name: 'Burak Tan', team: 'Team Alpha', status: 'offline', duration: '02h', lead: null, phone: null },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'on_call':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
            <span>Im Gespräch</span>
          </span>
        );
      case 'available':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span>Verfügbar (Bereit)</span>
          </span>
        );
      case 'wrap_up':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">
            <Clock size={12} />
            <span>Nachbearbeitung</span>
          </span>
        );
      case 'pause':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-500/15 text-purple-400 border border-purple-500/30">
            <Coffee size={12} />
            <span>Pause</span>
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-dark-800 text-gray-500 border border-dark-border">
            <span>Offline</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-100 flex items-center gap-2.5">
            <Activity className="text-gold-500" size={24} />
            <span>{t('title')}</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">{t('subtitle')}</p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-dark-900 border border-dark-border text-xs">
          <Radio size={14} className="text-emerald-400 animate-pulse" />
          <span className="text-gray-300 font-mono">{t('sipTrunk')}</span>
        </div>
      </div>

      {/* Real-time Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className={`p-5 rounded-2xl border transition-all space-y-4 shadow-xl ${
              agent.status === 'on_call'
                ? 'bg-dark-900 border-gold-500/40 shadow-gold-500/5'
                : 'bg-dark-900 border-dark-border'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-dark-850 border border-dark-border flex items-center justify-center font-bold text-sm text-gold-400">
                  {agent.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-gray-100">{agent.name}</h3>
                  <span className="text-[11px] text-gray-500">{agent.team}</span>
                </div>
              </div>

              {getStatusBadge(agent.status)}
            </div>

            {agent.status === 'on_call' && agent.lead && (
              <div className="p-3 rounded-xl bg-dark-850 border border-dark-border space-y-1.5 text-xs">
                <div className="flex justify-between items-center text-gray-400">
                  <span>Aktiver Anruf:</span>
                  <span className="font-mono text-gold-400 font-bold">{agent.duration}</span>
                </div>
                <div className="font-semibold text-gray-200">{agent.lead}</div>
                <div className="font-mono text-[11px] text-gray-400">{agent.phone}</div>

                {/* Supervisor Action Buttons */}
                <div className="pt-2 border-t border-dark-border/60 flex gap-1.5">
                  <button
                    onClick={() => setSupervisorAction({ type: 'listen', agent: agent.name, lead: agent.lead || '' })}
                    className="flex-1 py-1.5 rounded-lg bg-dark-900 hover:bg-gold-500 hover:text-dark-950 text-gray-300 text-[11px] font-bold border border-dark-border transition-colors flex items-center justify-center gap-1"
                    title="Nur zuhören"
                  >
                    <Volume2 size={12} />
                    <span>Mithören</span>
                  </button>

                  <button
                    onClick={() => setSupervisorAction({ type: 'whisper', agent: agent.name, lead: agent.lead || '' })}
                    className="flex-1 py-1.5 rounded-lg bg-dark-900 hover:bg-blue-500 hover:text-white text-gray-300 text-[11px] font-bold border border-dark-border transition-colors flex items-center justify-center gap-1"
                    title="Nur der Agent hört Sie"
                  >
                    <Mic size={12} />
                    <span>Zuflüstern</span>
                  </button>

                  <button
                    onClick={() => setSupervisorAction({ type: 'barge', agent: agent.name, lead: agent.lead || '' })}
                    className="flex-1 py-1.5 rounded-lg bg-dark-900 hover:bg-red-500 hover:text-white text-gray-300 text-[11px] font-bold border border-dark-border transition-colors flex items-center justify-center gap-1"
                    title="Konferenz mit Kunde und Agent"
                  >
                    <Radio size={12} />
                    <span>Aufschalten</span>
                  </button>
                </div>
              </div>
            )}

            {agent.status === 'available' && (
              <div className="p-3 rounded-xl bg-dark-850/60 border border-dark-border text-center text-xs text-gray-400">
                Wartet auf den nächsten eingehenden/ausgehenden Lead...
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Supervisor Active Modal */}
      {supervisorAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-dark-900 border border-gold-500/40 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gold-500/20 text-gold-400 border border-gold-500/30">
                <Headphones size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-100">
                  Supervisor: {supervisorAction.type === 'listen' ? 'Mithören (Silent)' : supervisorAction.type === 'whisper' ? 'Zuflüstern (Coaching)' : 'Aufschalten (Barge-in)'}
                </h3>
                <p className="text-xs text-gray-400">Agent: <strong>{supervisorAction.agent}</strong></p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-dark-850 border border-dark-border text-xs space-y-2">
              <div className="text-gray-400">Kunde: <strong className="text-gray-200">{supervisorAction.lead}</strong></div>
              <div className="flex items-center justify-center gap-1 h-12 bg-dark-900 rounded-lg">
                {[30, 60, 20, 80, 50, 90, 40, 70, 30, 85].map((h, i) => (
                  <div key={i} className="w-1 bg-gold-500 rounded-full animate-pulse" style={{ height: `${h}%` }} />
                ))}
              </div>
              <span className="text-[10px] text-emerald-400 font-mono block text-center">
                Audio-Stream aktiv via Asterisk ARI Spy Engine
              </span>
            </div>

            <Button
              onClick={() => setSupervisorAction(null)}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold"
            >
              Überwachung beenden
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
