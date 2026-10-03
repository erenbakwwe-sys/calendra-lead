"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { 
  BarChart3, Download, Calendar, TrendingUp, 
  Users, CheckCircle2, Phone, Award, ArrowUpRight 
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function StatisticsPage() {
  const [timeRange, setTimeRange] = useState('heute');

  const agentLeaderboard = [
    { rank: 1, name: 'Ayşe Kaya', calls: 142, reached: 118, qualified: 24, rate: '20.3%', avgDuration: '03:14 Min' },
    { rank: 2, name: 'Mehmet Demir', calls: 168, reached: 132, qualified: 22, rate: '16.6%', avgDuration: '02:48 Min' },
    { rank: 3, name: 'Can Polat', calls: 94, reached: 78, qualified: 14, rate: '17.9%', avgDuration: '03:02 Min' },
    { rank: 4, name: 'Fatma Şahin', calls: 110, reached: 85, qualified: 12, rate: '14.1%', avgDuration: '02:30 Min' },
  ];

  const funnelSteps = [
    { label: 'Eingegangene Leads (API)', count: 1250, percent: 100, color: 'bg-blue-500' },
    { label: 'Erste Wählung erfolgt', count: 1120, percent: 89.6, color: 'bg-indigo-500' },
    { label: 'Kunde telefonisch erreicht', count: 842, percent: 67.3, color: 'bg-amber-500' },
    { label: 'Lead durch Agent qualifiziert', count: 198, percent: 15.8, color: 'bg-teal-500' },
    { label: 'QC Genehmigt (Vertriebsfertig)', count: 182, percent: 14.5, color: 'bg-emerald-500' },
  ];

  const handleExport = () => {
    alert('Statistikbericht als CSV erfolgreich heruntergeladen!');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-100 flex items-center gap-2.5">
            <BarChart3 className="text-gold-500" size={24} />
            <span>Statistiken & Performance-KPIs</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Konversionsraten, Anrufdauern und Agenten-Rangliste in Echtzeit
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Time Filter */}
          <div className="flex bg-dark-900 border border-dark-border rounded-xl p-1 text-xs">
            {['heute', 'woche', 'monat'].map((t) => (
              <button
                key={t}
                onClick={() => setTimeRange(t)}
                className={`px-3 py-1.5 rounded-lg font-bold capitalize transition-all ${
                  timeRange === t
                    ? 'bg-gold-500 text-dark-950 shadow-md'
                    : 'text-gray-400 hover:text-gray-100'
                }`}
              >
                {t === 'heute' ? 'Heute' : t === 'woche' ? 'Diese Woche' : 'Dieser Monat'}
              </button>
            ))}
          </div>

          <Button
            variant="secondary"
            onClick={handleExport}
            className="flex items-center gap-1.5 text-xs text-gray-200"
          >
            <Download size={14} />
            <span>CSV Export</span>
          </Button>
        </div>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-dark-900 border border-dark-border shadow-xl">
          <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Erreichte Leads</span>
          <div className="text-3xl font-extrabold text-gray-100 mt-1 font-mono">842</div>
          <span className="text-xs text-emerald-400 mt-1 block">67.3% Erreichbarkeitsquote</span>
        </div>

        <div className="p-5 rounded-2xl bg-dark-900 border border-dark-border shadow-xl">
          <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Ø Gesprächsdauer</span>
          <div className="text-3xl font-extrabold text-gold-400 mt-1 font-mono">03:04 Min</div>
          <span className="text-xs text-gray-400 mt-1 block">Optimal für Qualifizierung</span>
        </div>

        <div className="p-5 rounded-2xl bg-dark-900 border border-dark-border shadow-xl">
          <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Konversionsrate</span>
          <div className="text-3xl font-extrabold text-emerald-400 mt-1 font-mono">16.2%</div>
          <span className="text-xs text-emerald-400 mt-1 block">+2.4% über Branchenschnitt</span>
        </div>

        <div className="p-5 rounded-2xl bg-dark-900 border border-dark-border shadow-xl">
          <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Anrufe pro Stunde</span>
          <div className="text-3xl font-extrabold text-purple-400 mt-1 font-mono">18.4</div>
          <span className="text-xs text-gray-400 mt-1 block">Hohe Agentenauslastung</span>
        </div>
      </div>

      {/* Conversion Funnel */}
      <div className="bg-dark-900 border border-dark-border rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-gray-100 flex items-center gap-2">
          <TrendingUp className="text-gold-500" size={18} />
          <span>Lead-Konversionstrichter (Funnel)</span>
        </h3>

        <div className="space-y-3">
          {funnelSteps.map((step) => (
            <div key={step.label} className="space-y-1 text-xs">
              <div className="flex justify-between items-center text-gray-300">
                <span className="font-semibold">{step.label}</span>
                <span className="font-mono font-bold text-gray-100">
                  {step.count.toLocaleString()} ({step.percent}%)
                </span>
              </div>
              <div className="h-3 w-full bg-dark-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${step.color} rounded-full transition-all duration-500`}
                  style={{ width: `${step.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Agent Ranking Table */}
      <div className="bg-dark-900 border border-dark-border rounded-2xl shadow-xl overflow-hidden">
        <div className="p-5 border-b border-dark-border flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-100 flex items-center gap-2">
            <Award className="text-gold-500" size={18} />
            <span>Agenten-Leistungsranking</span>
          </h3>
          <span className="text-xs text-gray-400">Automatische Sortierung nach Konversion</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-dark-850 text-gray-400 uppercase font-semibold border-b border-dark-border text-[11px]">
              <tr>
                <th className="py-3 px-4">Rang</th>
                <th className="py-3 px-4">Agent</th>
                <th className="py-3 px-4">Anrufe</th>
                <th className="py-3 px-4">Erreicht</th>
                <th className="py-3 px-4">Qualifiziert</th>
                <th className="py-3 px-4">Ø Dauer</th>
                <th className="py-3 px-4 text-right">Konversion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border text-gray-200">
              {agentLeaderboard.map((a) => (
                <tr key={a.rank} className="hover:bg-dark-850/60 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-gold-400">
                    {a.rank === 1 ? '🥇 #1' : a.rank === 2 ? '🥈 #2' : a.rank === 3 ? '🥉 #3' : `#${a.rank}`}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-gray-100">{a.name}</td>
                  <td className="py-3.5 px-4 font-mono">{a.calls}</td>
                  <td className="py-3.5 px-4 font-mono">{a.reached}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">{a.qualified}</td>
                  <td className="py-3.5 px-4 font-mono">{a.avgDuration}</td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-gold-400">{a.rate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
