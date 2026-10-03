"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { 
  Settings, Phone, Lock, ShieldCheck, Save, 
  Sliders, Server, AlertTriangle, CheckCircle2 
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function SettingsPage() {
  const [savedSuccess, setSavedSuccess] = useState(false);

  // SIP Trunk Form
  const [trunk, setTrunk] = useState({
    name: 'Telekom Deutschland Gateway',
    host: 'sip.trunk.telekom.de',
    port: 5060,
    transport: 'TLS',
    username: 'calendra_outbound_01',
    password: '••••••••••••••••',
    callerId: '+49 30 12345670',
    maxChannels: 10,
    codecs: 'alaw, ulaw, opus',
  });

  // Feature Flags
  const [flags, setFlags] = useState({
    predictiveDialer: false,
    predictivePace: 3,
    maskPhoneNumbers: true,
    ownProjectsMode: true,
    callRecordingNotice: true,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-100 flex items-center gap-2.5">
          <Settings className="text-gold-500" size={24} />
          <span>System- & Telefonieeinstellungen</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          SIP-Trunk Konfiguration, Verschlüsselung und Feature-Flags für diesen Mandanten
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={16} />
          <span className="font-bold">Einstellungen erfolgreich gespeichert und verschlüsselt archiviert!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* SIP Trunk Configuration Card */}
        <div className="bg-dark-900 border border-dark-border rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-dark-border">
            <h3 className="text-sm font-bold text-gray-100 flex items-center gap-2">
              <Phone className="text-gold-500" size={18} />
              <span>SIP-Trunk Anbindung (Deutscher Provider)</span>
            </h3>
            <span className="text-[10px] uppercase font-mono font-bold bg-dark-850 text-emerald-400 px-2.5 py-1 rounded border border-emerald-500/30 flex items-center gap-1">
              <Lock size={12} />
              <span>AES-256-GCM Verschlüsselt</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-gray-400 block mb-1">SIP Trunk Name:</label>
              <input
                type="text"
                value={trunk.name}
                onChange={(e) => setTrunk({ ...trunk, name: e.target.value })}
                className="w-full bg-dark-850 border border-dark-border rounded-xl p-2.5 text-gray-100 focus:border-gold-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-gray-400 block mb-1">SIP Server Host / IP:</label>
              <input
                type="text"
                value={trunk.host}
                onChange={(e) => setTrunk({ ...trunk, host: e.target.value })}
                className="w-full bg-dark-850 border border-dark-border rounded-xl p-2.5 text-gray-100 focus:border-gold-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-gray-400 block mb-1">Port & Transport:</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={trunk.port}
                  onChange={(e) => setTrunk({ ...trunk, port: parseInt(e.target.value) || 5060 })}
                  className="w-24 bg-dark-850 border border-dark-border rounded-xl p-2.5 text-gray-100 focus:border-gold-500 focus:outline-none"
                />
                <select
                  value={trunk.transport}
                  onChange={(e) => setTrunk({ ...trunk, transport: e.target.value })}
                  className="flex-1 bg-dark-850 border border-dark-border rounded-xl p-2.5 text-gray-100 focus:border-gold-500 focus:outline-none"
                >
                  <option value="TLS">TLS (Empfohlen / WSS)</option>
                  <option value="UDP">UDP</option>
                  <option value="TCP">TCP</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-gray-400 block mb-1">Verifizierte Caller-ID (Ausgehende Rufnummer):</label>
              <input
                type="text"
                value={trunk.callerId}
                onChange={(e) => setTrunk({ ...trunk, callerId: e.target.value })}
                className="w-full bg-dark-850 border border-dark-border rounded-xl p-2.5 text-gray-100 font-mono focus:border-gold-500 focus:outline-none"
              />
              <span className="text-[10px] text-gray-500 mt-1 block">Kein Caller-ID Spoofing erlaubt. Nur offiziell verifizierte Nummern.</span>
            </div>

            <div>
              <label className="text-gray-400 block mb-1">SIP Benutzername:</label>
              <input
                type="text"
                value={trunk.username}
                onChange={(e) => setTrunk({ ...trunk, username: e.target.value })}
                className="w-full bg-dark-850 border border-dark-border rounded-xl p-2.5 text-gray-100 focus:border-gold-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-gray-400 block mb-1">SIP Passwort:</label>
              <input
                type="password"
                value={trunk.password}
                onChange={(e) => setTrunk({ ...trunk, password: e.target.value })}
                className="w-full bg-dark-850 border border-dark-border rounded-xl p-2.5 text-gray-100 focus:border-gold-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Feature Flags & Compliance */}
        <div className="bg-dark-900 border border-dark-border rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-gray-100 flex items-center gap-2 pb-3 border-b border-dark-border">
            <Sliders className="text-gold-500" size={18} />
            <span>Feature-Flags & Mandantenregeln</span>
          </h3>

          <div className="space-y-3 text-xs">
            {/* Mask Phone Numbers */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-dark-850 border border-dark-border">
              <div>
                <strong className="text-gray-200 block">DSGVO Telefonnummer-Maskierung:</strong>
                <span className="text-gray-400">Versteckt die Telefonnummern in Listen vor Agenten (nur Click-to-Call).</span>
              </div>
              <input
                type="checkbox"
                checked={flags.maskPhoneNumbers}
                onChange={(e) => setFlags({ ...flags, maskPhoneNumbers: e.target.checked })}
                className="h-4 w-4 rounded bg-dark-900 border-dark-border text-gold-500 focus:ring-0"
              />
            </div>

            {/* Own Projects Mode */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-dark-850 border border-dark-border">
              <div>
                <strong className="text-gray-200 block">Modus 'Eigene Projekte / Kunden' aktivieren:</strong>
                <span className="text-gray-400">Erlaubt den Wechsel zwischen Provider-Leads und internem Vertrieb.</span>
              </div>
              <input
                type="checkbox"
                checked={flags.ownProjectsMode}
                onChange={(e) => setFlags({ ...flags, ownProjectsMode: e.target.checked })}
                className="h-4 w-4 rounded bg-dark-900 border-dark-border text-gold-500 focus:ring-0"
              />
            </div>

            {/* Predictive Dialer (Experimental) */}
            <div className="p-3 rounded-xl bg-dark-850 border border-amber-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-gray-200">Predictive Dialer</strong>
                    <span className="text-[10px] font-bold uppercase text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      Experimentell
                    </span>
                  </div>
                  <span className="text-gray-400 text-[11px]">Wählt statistisch voraus mit harter Abbruchquotenbegrenzung (&lt; 3%).</span>
                </div>
                <input
                  type="checkbox"
                  checked={flags.predictiveDialer}
                  onChange={(e) => setFlags({ ...flags, predictiveDialer: e.target.checked })}
                  className="h-4 w-4 rounded bg-dark-900 border-dark-border text-gold-500 focus:ring-0"
                />
              </div>

              {flags.predictiveDialer && (
                <div className="pt-2 border-t border-dark-border flex items-center justify-between">
                  <span className="text-gray-400">Wähltempo (1 bis 10):</span>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={flags.predictivePace}
                      onChange={(e) => setFlags({ ...flags, predictivePace: parseInt(e.target.value) })}
                      className="accent-gold-500"
                    />
                    <span className="font-mono font-bold text-gold-400 text-sm">{flags.predictivePace}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gold-500 to-amber-500 text-dark-950 font-bold text-xs rounded-xl shadow-lg shadow-gold-500/20 hover:brightness-110"
          >
            <Save size={16} />
            <span>Einstellungen speichern</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
