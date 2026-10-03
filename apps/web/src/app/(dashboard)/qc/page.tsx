"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { usePortalStore, LeadItem } from '@/stores/portalStore';
import { 
  CheckCircle, Play, Pause, Volume2, ShieldCheck, 
  Check, X, AlertTriangle, FileText, UserCheck, 
  MapPin, Clock, FastForward, RotateCcw
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function QcPage() {
  const t = useTranslations('qc');
  const commonT = useTranslations('common');
  const { leads, approveQc, rejectQc } = usePortalStore();

  const qcLeads = leads.filter((l) => l.status === 'qc_pending' || l.status === 'qualified');
  const [selectedLead, setSelectedLead] = useState<LeadItem | null>(qcLeads[0] || null);

  // Audio Player State
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [currentTime, setCurrentTime] = useState<number>(14);
  const totalDuration = 185; // 3m 05s

  // Checklist State
  const [checks, setChecks] = useState({
    idVerified: true,
    consentRecorded: true,
    requirementsMet: true,
  });

  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('Kunde war bei der Gesprächsaufnahme unsicher bzgl. Eigentumsstatus.');

  const handleApprove = () => {
    if (!selectedLead) return;
    approveQc(selectedLead.id, 'Audioaufnahme und DSGVO-Einwilligung durch QC geprüft und freigegeben.');
    const remaining = qcLeads.filter((l) => l.id !== selectedLead.id);
    setSelectedLead(remaining[0] || null);
    setIsPlaying(false);
  };

  const handleReject = () => {
    if (!selectedLead) return;
    rejectQc(selectedLead.id, rejectReason);
    setRejectModalOpen(false);
    const remaining = qcLeads.filter((l) => l.id !== selectedLead.id);
    setSelectedLead(remaining[0] || null);
    setIsPlaying(false);
  };

  const formatAudioTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-100 flex items-center gap-2.5">
            <CheckCircle className="text-gold-500" size={24} />
            <span>{t('title')}</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">{t('subtitle')}</p>
        </div>

        <span className="text-xs font-bold text-gold-400 bg-gold-500/10 px-3 py-1.5 rounded-xl border border-gold-500/30">
          Warteschlange: {qcLeads.length} Leads zur Prüfung
        </span>
      </div>

      {qcLeads.length === 0 ? (
        <div className="bg-dark-900 border border-dark-border rounded-2xl p-12 text-center space-y-3">
          <div className="flex justify-center text-emerald-400">
            <CheckCircle size={48} />
          </div>
          <h3 className="text-lg font-bold text-gray-100">Alles erledigt!</h3>
          <p className="text-xs text-gray-400 max-w-md mx-auto">
            Aktuell liegen keine ungeprüften Aufnahmen vor. Alle qualifizierten Leads wurden erfolgreich verarbeitet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Queue List (1 Col) */}
          <div className="bg-dark-900 border border-dark-border rounded-2xl p-4 shadow-xl space-y-2.5">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider pb-2 border-b border-dark-border">
              Prüfungsliste
            </div>

            <div className="space-y-2">
              {qcLeads.map((lead) => (
                <div
                  key={lead.id}
                  onClick={() => setSelectedLead(lead)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedLead?.id === lead.id
                      ? 'bg-gold-500/15 border-gold-500/50 shadow-md shadow-gold-500/5'
                      : 'bg-dark-850 border-dark-border hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-xs text-gray-100">
                    <span>{lead.firstName} {lead.lastName}</span>
                    <span className="text-[10px] text-amber-400 font-mono">03:05 Min</span>
                  </div>
                  <div className="text-[11px] text-gray-400 mt-1 flex items-center justify-between">
                    <span>{lead.product}</span>
                    <span className="text-gray-500">{lead.city}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Review Details & Player (2 Cols) */}
          {selectedLead && (
            <div className="lg:col-span-2 space-y-6">
              {/* Lead Summary Header */}
              <div className="bg-dark-900 border border-dark-border rounded-2xl p-5 shadow-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-gold-400 uppercase tracking-wider">
                    {selectedLead.campaignName}
                  </span>
                  <h2 className="text-xl font-extrabold text-gray-100 mt-0.5">
                    {selectedLead.firstName} {selectedLead.lastName}
                  </h2>
                  <div className="text-xs text-gray-400 mt-1 flex items-center gap-3">
                    <span className="font-mono text-gray-300">{selectedLead.phone}</span>
                    <span>•</span>
                    <span>{selectedLead.postalCode} {selectedLead.city}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                    Aufnahme bereit
                  </span>
                </div>
              </div>

              {/* Audio Waveform Player Simulation */}
              <div className="bg-dark-900 border border-gold-500/30 rounded-2xl p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                    <Volume2 size={16} className="text-gold-400" />
                    <span>Gesprächsaufzeichnung (Asterisk CDR)</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">Geschwindigkeit:</span>
                    {[1, 1.25, 1.5].map((spd) => (
                      <button
                        key={spd}
                        onClick={() => setPlaybackSpeed(spd)}
                        className={`px-2 py-0.5 rounded text-[11px] font-bold border transition-colors ${
                          playbackSpeed === spd
                            ? 'bg-gold-500 text-dark-950 border-gold-500'
                            : 'bg-dark-850 text-gray-400 border-dark-border hover:bg-dark-800'
                        }`}
                      >
                        {spd}x
                      </button>
                    ))}
                  </div>
                </div>

                {/* Animated Waveform Visualizer */}
                <div className="bg-dark-950 p-4 rounded-xl border border-dark-border flex items-center gap-1.5 h-20 overflow-hidden">
                  {Array.from({ length: 48 }).map((_, i) => (
                    <div
                      key={i}
                      className={`flex-1 rounded-full transition-all duration-200 ${
                        i < (currentTime / totalDuration) * 48
                          ? 'bg-gold-500'
                          : 'bg-dark-800'
                      }`}
                      style={{
                        height: isPlaying
                          ? `${Math.max(10, Math.abs(Math.sin((i + currentTime) * 0.4)) * 60)}px`
                          : `${Math.max(8, (i % 5) * 8 + 10)}px`,
                      }}
                    />
                  ))}
                </div>

                {/* Controls & Scrubber */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="h-10 w-10 rounded-full bg-gold-500 hover:bg-gold-400 text-dark-950 font-bold flex items-center justify-center shadow-lg shadow-gold-500/20 transition-all"
                    >
                      {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
                    </button>

                    <button
                      onClick={() => setCurrentTime(0)}
                      className="p-2 text-gray-400 hover:text-gray-200"
                      title="Neu starten"
                    >
                      <RotateCcw size={16} />
                    </button>

                    <span className="font-mono text-xs text-gray-300">
                      {formatAudioTime(currentTime)} / {formatAudioTime(totalDuration)}
                    </span>
                  </div>

                  <span className="text-xs text-emerald-400 font-mono bg-dark-850 px-2 py-1 rounded border border-dark-border">
                    Opus 48kHz Stereo
                  </span>
                </div>
              </div>

              {/* QC Verification Checklist */}
              <div className="bg-dark-900 border border-dark-border rounded-2xl p-6 shadow-xl space-y-4">
                <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                  {t('checklist')}
                </h3>

                <div className="space-y-3">
                  <label className="flex items-start gap-3 p-3 rounded-xl bg-dark-850 border border-dark-border cursor-pointer hover:border-gold-500/30 transition-colors">
                    <input
                      type="checkbox"
                      checked={checks.idVerified}
                      onChange={(e) => setChecks({ ...checks, idVerified: e.target.checked })}
                      className="mt-0.5 rounded bg-dark-900 border-dark-border text-gold-500 focus:ring-0"
                    />
                    <div className="text-xs">
                      <strong className="text-gray-200 block">{t('check1')}</strong>
                      <span className="text-gray-400">Verbraucher hat Eigentum und PLZ ({selectedLead.postalCode}) im Telefonat ausdrücklich bestätigt.</span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3 rounded-xl bg-dark-850 border border-dark-border cursor-pointer hover:border-gold-500/30 transition-colors">
                    <input
                      type="checkbox"
                      checked={checks.consentRecorded}
                      onChange={(e) => setChecks({ ...checks, consentRecorded: e.target.checked })}
                      className="mt-0.5 rounded bg-dark-900 border-dark-border text-gold-500 focus:ring-0"
                    />
                    <div className="text-xs">
                      <strong className="text-gray-200 block">{t('check2')}</strong>
                      <span className="text-gray-400">Aufzeichnung enthält unmissverständliche Zusage für das unverbindliche Vor-Ort-Angebot.</span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3 rounded-xl bg-dark-850 border border-dark-border cursor-pointer hover:border-gold-500/30 transition-colors">
                    <input
                      type="checkbox"
                      checked={checks.requirementsMet}
                      onChange={(e) => setChecks({ ...checks, requirementsMet: e.target.checked })}
                      className="mt-0.5 rounded bg-dark-900 border-dark-border text-gold-500 focus:ring-0"
                    />
                    <div className="text-xs">
                      <strong className="text-gray-200 block">{t('check3')}</strong>
                      <span className="text-gray-400">Kriterien für {selectedLead.product} erfüllt (Dachzustand, Machbarkeit).</span>
                    </div>
                  </label>
                </div>

                {/* Approve & Reject Actions */}
                <div className="pt-4 border-t border-dark-border flex gap-3">
                  <Button
                    onClick={handleApprove}
                    disabled={!checks.idVerified || !checks.consentRecorded || !checks.requirementsMet}
                    className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:brightness-110 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
                  >
                    <Check size={16} />
                    <span>{t('approve')}</span>
                  </Button>

                  <Button
                    variant="secondary"
                    onClick={() => setRejectModalOpen(true)}
                    className="py-3 px-5 text-xs text-red-400 border-red-500/30 hover:bg-red-500/10 rounded-xl flex items-center gap-2"
                  >
                    <X size={16} />
                    <span>{t('reject')}</span>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Reject Modal */}
      {rejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-dark-900 border border-red-500/40 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-red-400 flex items-center gap-2">
              <AlertTriangle size={20} />
              <span>Lead durch QC ablehnen</span>
            </h3>

            <p className="text-xs text-gray-300">
              {t('rejectionPrompt')}
            </p>

            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
              className="w-full bg-dark-850 border border-dark-border rounded-xl p-3 text-xs text-gray-100 focus:border-red-500 focus:outline-none"
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={() => setRejectModalOpen(false)}>
                Abbrechen
              </Button>
              <Button onClick={handleReject} className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs">
                Endgültig ablehnen
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
