"use client";

import { useEffect, useState } from 'react';
import { usePortalStore } from '@/stores/portalStore';
import { useTranslations } from 'next-intl';
import { 
  PhoneCall, PhoneOff, Mic, MicOff, Pause, Play, 
  Calendar, CheckCircle, XCircle, AlertTriangle, ShieldCheck, 
  Clock, MapPin, Building, ChevronDown, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { RadarAudio3D } from './RadarAudio3D';

export function ActiveCallOverlay() {
  const t = useTranslations('dialer');
  const commonT = useTranslations('common');
  const { 
    activeDialerLead, 
    callStatus, 
    callDuration, 
    isMuted, 
    isHeld, 
    hangupCall, 
    toggleMute, 
    toggleHold, 
    setCallDuration, 
    addCallback 
  } = usePortalStore();

  const [notes, setNotes] = useState('');
  const [showCallbackModal, setShowCallbackModal] = useState(false);
  const [callbackTime, setCallbackTime] = useState('14:00');
  const [callbackDate, setCallbackDate] = useState('Heute');
  const [activeTab, setActiveTab] = useState<'script' | 'notes' | 'consent'>('script');

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (callStatus === 'connected' && !isHeld) {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [callStatus, isHeld, setCallDuration]);

  if (!activeDialerLead || callStatus === 'idle') return null;

  const formatDuration = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainingSecs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const handleOutcome = (outcome: string) => {
    hangupCall(outcome, notes);
    setNotes('');
  };

  const handleScheduleCallback = () => {
    addCallback({
      leadId: activeDialerLead.id,
      leadName: `${activeDialerLead.firstName} ${activeDialerLead.lastName}`,
      phone: activeDialerLead.phone,
      scheduledAt: callbackDate,
      timeSlot: callbackTime,
      note: notes || 'Rückruf nach Erstgespräch vereinbart',
      campaign: activeDialerLead.campaignName
    });
    handleOutcome('callback');
    setShowCallbackModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-3xl rounded-2xl bg-dark-900 border border-gold-500/50 shadow-2xl shadow-gold-500/10 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-dark-850 border-b border-dark-border">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${
              callStatus === 'connected' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse' :
              callStatus === 'calling' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
              'bg-red-500/20 text-red-400'
            }`}>
              <PhoneCall size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-100 text-lg">
                  {activeDialerLead.firstName} {activeDialerLead.lastName}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-dark-800 text-gold-400 border border-gold-500/30 font-medium">
                  {activeDialerLead.product}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                <span className="font-mono text-gray-300">{activeDialerLead.phone}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><MapPin size={12} /> {activeDialerLead.postalCode} {activeDialerLead.city}</span>
              </div>
            </div>
          </div>

          {/* Call Status & Timer */}
          <div className="text-right">
            <div className="flex items-center gap-2 justify-end">
              <span className={`h-2.5 w-2.5 rounded-full ${
                callStatus === 'connected' ? 'bg-emerald-400 animate-ping' : 'bg-amber-400 animate-pulse'
              }`} />
              <span className="text-sm font-semibold text-gray-200">
                {callStatus === 'calling' ? t('calling') :
                 callStatus === 'connected' ? t('connected') : t('ended')}
              </span>
            </div>
            <div className="text-2xl font-mono font-bold text-gold-400 mt-0.5 tracking-wider">
              {formatDuration(callDuration)}
            </div>
          </div>
        </div>

        {/* 3D Circular Audio Frequency Radar Visualizer */}
        {callStatus === 'connected' && (
          <div className="p-3 bg-dark-950/70 border-b border-dark-border">
            <RadarAudio3D isActive={callStatus === 'connected'} isMuted={isMuted} isHeld={isHeld} />
          </div>
        )}

        {/* Main Content: Script, Notes, Consent */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Tabs */}
          <div className="flex gap-2 border-b border-dark-border pb-3">
            <button
              onClick={() => setActiveTab('script')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'script'
                  ? 'bg-gold-500 text-dark-950 font-bold shadow-md shadow-gold-500/20'
                  : 'bg-dark-800 text-gray-400 hover:text-gray-100'
              }`}
            >
              {t('callScript')}
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'notes'
                  ? 'bg-gold-500 text-dark-950 font-bold shadow-md shadow-gold-500/20'
                  : 'bg-dark-800 text-gray-400 hover:text-gray-100'
              }`}
            >
              Gesprächsnotizen ({notes ? '1' : '0'})
            </button>
            <button
              onClick={() => setActiveTab('consent')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'consent'
                  ? 'bg-gold-500 text-dark-950 font-bold shadow-md shadow-gold-500/20'
                  : 'bg-dark-800 text-gray-400 hover:text-gray-100'
              }`}
            >
              DSGVO-Einwilligung
            </button>
          </div>

          {activeTab === 'script' && (
            <div className="space-y-3 bg-dark-850 p-4 rounded-xl border border-dark-border">
              <div className="p-3.5 rounded-lg bg-dark-900 border-l-4 border-gold-500">
                <span className="text-xs uppercase font-bold text-gold-400 tracking-wider">Einstieg / Begrüßung:</span>
                <p className="text-sm text-gray-200 mt-1 leading-relaxed">
                  "Guten Tag Herr/Frau <strong className="text-gold-400">{activeDialerLead.lastName}</strong>! Mein Name ist von Calendra Partnernetzwerk. Sie hatten online eine Anfrage für <strong className="text-gold-400">{activeDialerLead.product}</strong> gestellt. Ich möchte kurz mit Ihnen die Eckdaten für das unverbindliche Vor-Ort-Angebot durchgehen."
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-dark-900 border-l-4 border-blue-500">
                <span className="text-xs uppercase font-bold text-blue-400 tracking-wider">Qualifizierungsfragen:</span>
                <ul className="text-xs text-gray-300 mt-2 space-y-1.5 list-disc list-inside">
                  <li>Sind Sie Eigentümer der Immobilie in {activeDialerLead.city}?</li>
                  <li>Um welchen Dachtyp handelt es sich (Satteldach, Flachdach)?</li>
                  <li>Wann wurde das Haus in etwa erbaut?</li>
                  <li>Besteht Interesse an einem zusätzlichen Stromspeicher?</li>
                </ul>
              </div>

              <div className="p-3.5 rounded-lg bg-dark-900 border-l-4 border-amber-500">
                <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">Einwandbehandlung (Zu teuer / Keine Zeit):</span>
                <p className="text-xs text-gray-300 mt-1">
                  "Gerade durch die aktuelle 0% Mehrwertsteuer-Regelung und KfW-Zuschüsse amortisiert sich die Anlage schneller denn je. Wann passt Ihnen ein 15-minütiges Beratungsgespräch am besten?"
                </p>
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-3">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t('notesPlaceholder')}
                rows={5}
                className="w-full bg-dark-850 text-gray-100 border border-dark-border rounded-xl p-3 text-sm focus:border-gold-500 focus:outline-none transition-colors"
              />
              <p className="text-xs text-gray-500">
                Notizen werden bei Gesprächsbeendigung automatisch in der Lead-Historie archiviert.
              </p>
            </div>
          )}

          {activeTab === 'consent' && (
            <div className="bg-dark-850 p-4 rounded-xl border border-dark-border space-y-3 text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                <ShieldCheck size={18} />
                <span>Verifizierter DSGVO-Einwilligungsnachweis (Opt-in)</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-gray-300">
                <div>
                  <span className="text-gray-500 block">Einwilligung erteilt am:</span>
                  <span className="font-mono">{activeDialerLead.consent.timestamp}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">IP-Adresse:</span>
                  <span className="font-mono">{activeDialerLead.consent.ip}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Quell-URL:</span>
                  <span className="text-gold-400 truncate block">{activeDialerLead.consent.sourceUrl}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Text-Version:</span>
                  <span className="font-mono">{activeDialerLead.consent.textVersion}</span>
                </div>
              </div>
              <div className="mt-2 text-gray-400 bg-dark-900 p-2.5 rounded-lg border border-dark-border">
                <strong>Benannte Partner:</strong> {activeDialerLead.consent.namedPartners.join(', ')}
              </div>
            </div>
          )}

          {/* In-Call Controls (Mute / Hold) */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <Button
              variant="secondary"
              onClick={toggleMute}
              className={`flex items-center gap-2 ${isMuted ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' : ''}`}
            >
              {isMuted ? <MicOff size={16} /> : <Mic size={16} />}
              <span>{isMuted ? t('unmute') : t('mute')}</span>
            </Button>
            <Button
              variant="secondary"
              onClick={toggleHold}
              className={`flex items-center gap-2 ${isHeld ? 'bg-blue-500/20 text-blue-400 border-blue-500/40' : ''}`}
            >
              {isHeld ? <Play size={16} /> : <Pause size={16} />}
              <span>{isHeld ? t('unhold') : t('hold')}</span>
            </Button>
            <Button
              onClick={() => setShowCallbackModal(true)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Calendar size={16} />
              <span>{t('scheduleCallback')}</span>
            </Button>
          </div>
        </div>

        {/* Outcome Disposition Buttons */}
        <div className="bg-dark-850 p-4 border-t border-dark-border">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            {t('disposition')}:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={() => handleOutcome('qualified')}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 font-bold hover:bg-emerald-600 hover:text-white transition-all text-xs"
            >
              <CheckCircle size={15} />
              <span>Qualifiziert (QC)</span>
            </button>
            <button
              onClick={() => setShowCallbackModal(true)}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-blue-600/20 border border-blue-500/40 text-blue-300 font-bold hover:bg-blue-600 hover:text-white transition-all text-xs"
            >
              <Calendar size={15} />
              <span>Rückruf planen</span>
            </button>
            <button
              onClick={() => handleOutcome('not_reachable')}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-amber-600/20 border border-amber-500/40 text-amber-300 font-bold hover:bg-amber-600 hover:text-white transition-all text-xs"
            >
              <Clock size={15} />
              <span>Nicht erreichbar</span>
            </button>
            <button
              onClick={() => handleOutcome('do_not_call')}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-red-600/20 border border-red-500/40 text-red-300 font-bold hover:bg-red-600 hover:text-white transition-all text-xs"
            >
              <AlertTriangle size={15} />
              <span>Nicht anrufen (DNC)</span>
            </button>
          </div>

          <div className="mt-3 flex justify-end">
            <button
              onClick={() => hangupCall('contacted', notes)}
              className="flex items-center gap-2 py-2 px-5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-lg shadow-red-600/20 transition-all"
            >
              <PhoneOff size={16} />
              <span>{t('hangup')}</span>
            </button>
          </div>
        </div>

        {/* Callback Modal */}
        {showCallbackModal && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 p-4 animate-in fade-in">
            <div className="w-full max-w-md bg-dark-850 p-6 rounded-2xl border border-gold-500/40 space-y-4">
              <h4 className="text-lg font-bold text-gray-100 flex items-center gap-2">
                <Calendar className="text-gold-500" size={20} />
                <span>Rückruftermin festlegen</span>
              </h4>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Tag:</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Heute', 'Morgen', 'In 2 Tagen'].map((d) => (
                    <button
                      key={d}
                      onClick={() => setCallbackDate(d)}
                      className={`py-2 text-xs rounded-lg font-medium border ${
                        callbackDate === d
                          ? 'bg-gold-500 text-dark-950 font-bold border-gold-500'
                          : 'bg-dark-800 text-gray-300 border-dark-border hover:bg-dark-700'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-400 block mb-1">Uhrzeit:</label>
                <input
                  type="time"
                  value={callbackTime}
                  onChange={(e) => setCallbackTime(e.target.value)}
                  className="w-full bg-dark-900 border border-dark-border rounded-lg p-2.5 text-gray-100 text-sm focus:border-gold-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="ghost" onClick={() => setShowCallbackModal(false)}>
                  Abbrechen
                </Button>
                <Button
                  onClick={handleScheduleCallback}
                  className="bg-gold-500 hover:bg-gold-600 text-dark-950 font-bold"
                >
                  Termin speichern
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
