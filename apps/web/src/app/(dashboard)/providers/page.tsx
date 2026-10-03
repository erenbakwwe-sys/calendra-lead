"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { usePortalStore, ProviderItem } from '@/stores/portalStore';
import { 
  Building2, Key, Plus, Copy, Check, ShieldCheck, 
  ExternalLink, Terminal, RefreshCw, AlertCircle 
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function ProvidersPage() {
  const { providers, generateApiKey } = usePortalStore();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeSecret, setActiveSecret] = useState<{ name: string; key: string } | null>(null);

  const handleGenerate = (provider: ProviderItem) => {
    const key = generateApiKey(provider.id);
    setActiveSecret({ name: provider.name, key });
  };

  const handleCopy = (keyText: string) => {
    navigator.clipboard.writeText(keyText);
    setCopiedKey(keyText);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-100 flex items-center gap-2.5">
            <Building2 className="text-gold-500" size={24} />
            <span>Lead-Anbieter (Provider-Schnittstellen)</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Anbindung deutscher Portale per REST-Push (API-Key) und geplante REST-Pull Adapter
          </p>
        </div>

        <Button
          onClick={() => {
            const newKey = `cal_live_${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`;
            setActiveSecret({ name: 'Neuer Partner (DE)', key: newKey });
          }}
          className="flex items-center gap-2 bg-gradient-to-r from-gold-500 to-amber-500 text-dark-950 font-bold text-xs shadow-lg shadow-gold-500/20"
        >
          <Plus size={16} />
          <span>Neuen Anbieter anbinden</span>
        </Button>
      </div>

      {/* Generated Key Alert Modal */}
      {activeSecret && (
        <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/40 text-xs space-y-3 animate-in fade-in">
          <div className="flex items-center gap-2 font-bold text-amber-300 text-sm">
            <Key size={18} />
            <span>Neuer API-Key für {activeSecret.name} generiert!</span>
          </div>
          <p className="text-gray-300">
            Kopieren Sie diesen Schlüssel jetzt. Aus Sicherheitsgründen wird er in der Datenbank nur gehasht (SHA-256) gespeichert und kann nicht erneut angezeigt werden.
          </p>
          <div className="flex items-center gap-2 bg-dark-950 p-3 rounded-xl border border-dark-border">
            <code className="font-mono text-gold-400 text-xs flex-1 break-all select-all">
              {activeSecret.key}
            </code>
            <Button
              onClick={() => handleCopy(activeSecret.key)}
              className="bg-gold-500 hover:bg-gold-600 text-dark-950 font-bold text-xs flex items-center gap-1.5"
            >
              {copiedKey === activeSecret.key ? <Check size={14} /> : <Copy size={14} />}
              <span>{copiedKey === activeSecret.key ? 'Kopiert!' : 'Kopieren'}</span>
            </Button>
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => setActiveSecret(null)}
              className="text-gray-400 hover:text-gray-200 text-xs underline"
            >
              Schließen
            </button>
          </div>
        </div>
      )}

      {/* Provider Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {providers.map((p) => (
          <div key={p.id} className="p-6 rounded-2xl bg-dark-900 border border-dark-border hover:border-gold-500/40 transition-all space-y-5 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                  Methode: {p.type === 'push' ? 'REST PUSH (Echtzeit)' : 'REST PULL (Cron)'}
                </span>
                <h3 className="font-bold text-base text-gray-100 mt-1">{p.name}</h3>
              </div>
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" title="Schnittstelle aktiv" />
            </div>

            {/* Performance */}
            <div className="grid grid-cols-2 gap-2 bg-dark-850 p-3 rounded-xl border border-dark-border text-xs">
              <div>
                <span className="text-gray-400 block text-[10px]">Empfangene Leads:</span>
                <span className="font-mono font-bold text-gray-200 text-sm">{p.leadsReceived}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px]">Akzeptanzrate:</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">{p.acceptanceRate}</span>
              </div>
            </div>

            {/* API Key Box */}
            <div className="space-y-1.5 text-xs">
              <span className="text-gray-400 block">Aktiver API-Key (Präfix):</span>
              <div className="flex items-center justify-between bg-dark-850 p-2.5 rounded-xl border border-dark-border font-mono text-[11px] text-gray-300">
                <span>{p.apiKeySecret ? p.apiKeySecret.substring(0, 16) + '...' : p.apiKeyPrefix}</span>
                <button
                  onClick={() => handleGenerate(p)}
                  className="text-gold-400 hover:text-gold-300 font-bold ml-2 text-[10px] uppercase"
                  title="Schlüssel rotieren"
                >
                  Neu generieren
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-dark-border">
              <span>Letzter Ingest: {p.lastSync}</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <ShieldCheck size={14} />
                <span>DSGVO Gate</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* cURL Integration Preview */}
      <div className="bg-dark-900 border border-dark-border rounded-2xl p-6 shadow-xl space-y-3">
        <h3 className="text-sm font-bold text-gray-100 flex items-center gap-2">
          <Terminal size={18} className="text-gold-500" />
          <span>cURL Vorlage für deutsche Partner (POST /api/v1/ingest/leads)</span>
        </h3>
        <p className="text-xs text-gray-400">
          So pusht ein externer Anbieter Leads in unser System. Die Einwilligung (consent) ist Pflichtfeld:
        </p>
        <pre className="bg-dark-950 p-4 rounded-xl border border-dark-border font-mono text-xs text-gray-300 overflow-x-auto select-all">
{`curl -X POST https://portal.calendra.de/api/v1/ingest/leads \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: cal_live_sv24..." \\
  -d '{
    "first_name": "Maximilian",
    "last_name": "Mustermann",
    "phone": "+4917612345678",
    "email": "m.mustermann@web.de",
    "city": "Berlin",
    "postal_code": "10115",
    "product": "Photovoltaik",
    "consent": {
      "given": true,
      "timestamp": "2026-10-02T07:14:22Z",
      "source_url": "https://solar-vergleich.de/anfrage",
      "ip": "84.115.42.19",
      "text_version": "v2.4_GDPR_DE",
      "named_partners": ["Calendra GmbH"]
    }
  }'`}
        </pre>
      </div>
    </div>
  );
}
