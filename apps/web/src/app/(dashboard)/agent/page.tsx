"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { usePortalStore } from '@/stores/portalStore';
import { 
  PhoneForwarded, Phone, PhoneOff, Mic, MicOff, 
  Pause, Play, Calendar, CheckCircle, Clock, 
  AlertTriangle, ShieldCheck, MapPin, Building,
  ArrowRight, FileText, Sparkles, User, RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function AgentScreen() {
  const t = useTranslations('dialer');
  const { 
    leads, 
    startCall, 
    activeDialerLead, 
    callStatus, 
    hangupCall, 
    toggleMute, 
    toggleHold, 
    isMuted, 
    isHeld, 
    callDuration 
  } = usePortalStore();

  const [notes, setNotes] = useState('');
  const [currentLeadIndex, setCurrentLeadIndex] = useState(0);

  const availableLeads = leads.filter((l) => l.status !== 'do_not_call');
  const currentLead = activeDialerLead || availableLeads[currentLeadIndex % availableLeads.length];

  const handleNextLead = () => {
    setCurrentLeadIndex((prev) => (prev + 1) % availableLeads.length);
    setNotes('');
  };

  const handleOutcome = (outcome: string) => {
    hangupCall(outcome, notes);
    setNotes('');
    handleNextLead();
  };

  const formatSec = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-dark-900 border border-dark-border p-4 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500/20 to-gold-500/10 text-gold-400 border border-gold-500/30">
            <PhoneForwarded size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-100 flex items-center gap-2">
              <span>{t('title')}</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                SIP Preview Dialer
              </span>
            </h1>
            <p className="text-xs text-gray-400">Browser-basierte Telefonie mit deutschen Festnetz- & Mobilfunknummern</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={handleNextLead}
            className="flex items-center gap-1.5 text-xs text-gray-300 hover:text-gold-400 bg-dark-850"
          >
            <RefreshCw size={14} />
            <span>{t('nextLead')}</span>
          </Button>
        </div>
      </div>

      {currentLead ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Lead Info & Call Bar (1 Col) */}
          <div className="space-y-6">
            {/* Softphone Bar */}
            <div className="bg-dark-900 border border-gold-500/40 rounded-2xl p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Telefonie-Status</span>
                <span className="font-mono text-xs text-gold-400 font-bold">
                  {callStatus === 'connected' ? `AKTIV (${formatSec(callDuration)})` : 'BEREIT'}
                </span>
              </div>

              <div className="text-center py-2">
                <div className="text-2xl font-mono font-black text-gray-100 tracking-wider">
                  {currentLead.phone}
                </div>
                <div className="text-xs text-emerald-400 mt-1 flex items-center justify-center gap-1">
                  <ShieldCheck size={14} />
                  <span>DSGVO Werbeeinwilligung verifiziert</span>
                </div>
              </div>

              {/* Call Buttons */}
              {callStatus === 'idle' ? (
                <Button
                  onClick={() => startCall(currentLead)}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:brightness-110 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2"
                >
                  <Phone size={18} />
                  <span>Klick-to-Call starten</span>
                </Button>
              ) : (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      onClick={toggleMute}
                      className={`flex-1 text-xs ${isMuted ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' : ''}`}
                    >
                      {isMuted ? <MicOff size={14} className="mr-1" /> : <Mic size={14} className="mr-1" />}
                      {isMuted ? 'Stumm' : 'Mute'}
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={toggleHold}
                      className={`flex-1 text-xs ${isHeld ? 'bg-blue-500/20 text-blue-400 border-blue-500/40' : ''}`}
                    >
                      {isHeld ? <Play size={14} className="mr-1" /> : <Pause size={14} className="mr-1" />}
                      {isHeld ? 'Halten' : 'Hold'}
                    </Button>
                  </div>
                  <Button
                    onClick={() => hangupCall('contacted', notes)}
                    className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-red-600/20 flex items-center justify-center gap-2"
                  >
                    <PhoneOff size={16} />
                    <span>Auflegen</span>
                  </Button>
                </div>
              )}
            </div>

            {/* Lead Details Card */}
            <div className="bg-dark-900 border border-dark-border rounded-2xl p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-dark-border">
                <span className="text-xs uppercase font-bold text-gold-500">Musterdaten</span>
                <span className="text-[10px] bg-dark-800 text-gray-400 px-2 py-0.5 rounded">
                  ID: {currentLead.id}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-gray-500 block">Name:</span>
                  <span className="font-bold text-gray-200 text-sm">{currentLead.firstName} {currentLead.lastName}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Adresse:</span>
                  <span className="text-gray-200">{currentLead.postalCode} {currentLead.city}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Interesse:</span>
                  <span className="font-semibold text-gold-400">{currentLead.product}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Kampagne:</span>
                  <span className="text-gray-300">{currentLead.campaignName}</span>
                </div>
              </div>
            </div>

            {/* Disposition Outcome Buttons */}
            <div className="bg-dark-900 border border-dark-border rounded-2xl p-5 shadow-xl space-y-2.5">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                {t('disposition')}
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleOutcome('qualified')}
                  className="py-2.5 px-3 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 font-bold hover:bg-emerald-600 hover:text-white transition-all text-xs text-center"
                >
                  ✓ Qualifiziert
                </button>
                <button
                  onClick={() => handleOutcome('callback')}
                  className="py-2.5 px-3 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-300 font-bold hover:bg-blue-600 hover:text-white transition-all text-xs text-center"
                >
                  📅 Rückruf
                </button>
                <button
                  onClick={() => handleOutcome('not_reachable')}
                  className="py-2.5 px-3 rounded-xl bg-amber-600/20 border border-amber-500/30 text-amber-300 font-bold hover:bg-amber-600 hover:text-white transition-all text-xs text-center"
                >
                  ⏱ Nicht erreichbar
                </button>
                <button
                  onClick={() => handleOutcome('do_not_call')}
                  className="py-2.5 px-3 rounded-xl bg-red-600/20 border border-red-500/30 text-red-300 font-bold hover:bg-red-600 hover:text-white transition-all text-xs text-center"
                >
                  ✕ Sperren (DNC)
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Script & Notes (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Script Box */}
            <div className="bg-dark-900 border border-dark-border rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-dark-border">
                <h3 className="text-base font-bold text-gray-100 flex items-center gap-2">
                  <FileText className="text-gold-500" size={18} />
                  <span>{t('callScript')}</span>
                </h3>
                <span className="text-[11px] text-gray-400 bg-dark-850 px-2 py-0.5 rounded border border-dark-border">
                  Standard Leitfaden DE-2026
                </span>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-dark-850 border-l-4 border-gold-500">
                  <div className="text-xs uppercase font-bold text-gold-400 tracking-wider">1. Begrüßung & Einstieg:</div>
                  <p className="text-sm text-gray-200 mt-1 leading-relaxed">
                    "Guten Tag Herr/Frau <strong className="text-gold-400">{currentLead.lastName}</strong>! Mein Name ist von Calendra Lead Partner. Sie hatten sich vor Kurzem bezüglich einer <strong className="text-gold-400">{currentLead.product}</strong> informiert. Ich melde mich kurz bei Ihnen, um die technischen Eckdaten für Ihr individuelles Festpreisangebot aufzunehmen."
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-dark-850 border-l-4 border-blue-500">
                  <div className="text-xs uppercase font-bold text-blue-400 tracking-wider">2. Qualifizierungsfragen:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2 text-xs text-gray-300">
                    <div className="bg-dark-900 p-2.5 rounded-lg border border-dark-border">
                      <strong>Immobilieneigentum:</strong>
                      <p className="text-gray-400 mt-0.5">Sind Sie alleiniger oder Miteigentümer des Hauses?</p>
                    </div>
                    <div className="bg-dark-900 p-2.5 rounded-lg border border-dark-border">
                      <strong>Dachbeschaffenheit:</strong>
                      <p className="text-gray-400 mt-0.5">Welcher Dachtyp (Ziegel, Schiefer, Flachdach)?</p>
                    </div>
                    <div className="bg-dark-900 p-2.5 rounded-lg border border-dark-border">
                      <strong>Stromverbrauch:</strong>
                      <p className="text-gray-400 mt-0.5">Wie hoch ist Ihr jährlicher Verbrauch (ca. kWh)?</p>
                    </div>
                    <div className="bg-dark-900 p-2.5 rounded-lg border border-dark-border">
                      <strong>Zeitrahmen:</strong>
                      <p className="text-gray-400 mt-0.5">Wann soll die Installation idealerweise erfolgen?</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-dark-850 border-l-4 border-amber-500">
                  <div className="text-xs uppercase font-bold text-amber-400 tracking-wider">3. Einwandbehandlung (Häufige Hürden):</div>
                  <div className="space-y-1.5 mt-2 text-xs text-gray-300">
                    <p><strong className="text-amber-300">"Habe gerade keine Zeit":</strong> "Kein Problem, wann darf ich Sie heute oder morgen kurz zurückrufen?"</p>
                    <p><strong className="text-amber-300">"Ist mir zu teuer":</strong> "Durch die aktuelle 0% MwSt.-Befreiung und KfW-Förderung rechnet sich die Anlage ab Monat 1 durch die Stromersparnis."</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Agent Notes */}
            <div className="bg-dark-900 border border-dark-border rounded-2xl p-6 shadow-xl space-y-3">
              <h3 className="text-sm font-bold text-gray-100 flex items-center justify-between">
                <span>Gesprächsnotizen</span>
                <span className="text-[11px] text-gray-400 font-normal">Wird automatisch archiviert</span>
              </h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Tragen Sie hier alle Absprachen mit dem Kunden ein (z. B. Dachausrichtung Süd, Verbrauch 4500 kWh, Rückruf erwünscht)..."
                rows={4}
                className="w-full bg-dark-850 text-gray-100 border border-dark-border rounded-xl p-3 text-xs focus:border-gold-500 focus:outline-none transition-colors"
              />
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500">Tastaturkürzel: [Leertaste] = Pause, [Enter] = Speichern</span>
                <Button
                  onClick={handleNextLead}
                  className="bg-gold-500 hover:bg-gold-600 text-dark-950 font-bold text-xs flex items-center gap-1.5"
                >
                  <span>{t('nextLead')}</span>
                  <ArrowRight size={14} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-dark-900 border border-dark-border rounded-2xl p-12 text-center text-gray-400">
          Keine Leads im aktuellen Pool verfügbar.
        </div>
      )}
    </div>
  );
}
