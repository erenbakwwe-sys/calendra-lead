"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { 
  Headphones, Users, Plus, ShieldCheck, MapPin, 
  Building, ChevronRight, CheckCircle2 
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function CallCentersPage() {
  const [centers, setCenters] = useState([
    {
      id: 'cc-1',
      name: 'Berlin Call Center (Deutschland)',
      city: 'Berlin',
      teams: [
        { id: 't-1', name: 'Team Alpha (PV Spezialisten)', agentsCount: 8, leader: 'Ahmet Yilmaz' },
        { id: 't-2', name: 'Team Beta (Wärmepumpe & Sanierung)', agentsCount: 6, leader: 'Can Polat' },
      ],
      assignedCampaigns: ['PV Deutschland 2026', 'Wärmepumpe Süd & West'],
      activeAgents: 14,
      totalCallsToday: 412,
    },
    {
      id: 'cc-2',
      name: 'Izmir Operations Center (Türkei)',
      city: 'Izmir / Bornova',
      teams: [
        { id: 't-3', name: 'Team Ege Outbound', agentsCount: 10, leader: 'Emre Yurt' },
      ],
      assignedCampaigns: ['PV Deutschland 2026'],
      activeAgents: 10,
      totalCallsToday: 430,
    }
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [newCenterName, setNewCenterName] = useState('');
  const [newCenterCity, setNewCenterCity] = useState('');

  const handleAddCenter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCenterName) return;
    setCenters([
      ...centers,
      {
        id: `cc-${Date.now()}`,
        name: newCenterName,
        city: newCenterCity || 'Istanbul',
        teams: [{ id: `t-${Date.now()}`, name: 'Hauptteam', agentsCount: 4, leader: 'Teamleiter' }],
        assignedCampaigns: ['PV Deutschland 2026'],
        activeAgents: 4,
        totalCallsToday: 0,
      }
    ]);
    setModalOpen(false);
    setNewCenterName('');
    setNewCenterCity('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-100 flex items-center gap-2.5">
            <Headphones className="text-gold-500" size={24} />
            <span>Callcenter & Partnerorganisationen</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Standorte in Deutschland & der Türkei mit strikter Datenisolation
          </p>
        </div>

        <Button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-gold-500 to-amber-500 text-dark-950 font-bold text-xs shadow-lg shadow-gold-500/20 hover:brightness-110"
        >
          <Plus size={16} />
          <span>Callcenter hinzufügen</span>
        </Button>
      </div>

      {/* Compliance / Isolation Info Banner */}
      <div className="p-4 rounded-2xl bg-dark-900 border border-emerald-500/30 flex items-start gap-3 shadow-xl">
        <ShieldCheck className="text-emerald-400 mt-0.5 shrink-0" size={20} />
        <div className="text-xs space-y-1">
          <strong className="text-gray-200">Garantierte Callcenter-Isolation:</strong>
          <p className="text-gray-400 leading-relaxed">
            Ein Callcenter sieht ausschließlich die ihm explizit zugewiesenen Leads. Der Name des Lead-Anbieters wird für Agenten und Teamleiter standardmäßig anonymisiert.
          </p>
        </div>
      </div>

      {/* Centers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {centers.map((cc) => (
          <div key={cc.id} className="p-6 rounded-2xl bg-dark-900 border border-dark-border hover:border-gold-500/40 transition-all space-y-5 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-gold-500 tracking-wider">
                  Standort: {cc.city}
                </span>
                <h3 className="text-lg font-bold text-gray-100 mt-1">{cc.name}</h3>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
                Online ({cc.activeAgents} Agenten)
              </span>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-3 bg-dark-850 p-3 rounded-xl border border-dark-border text-xs">
              <div>
                <span className="text-gray-400 block text-[10px]">Anrufe heute:</span>
                <span className="font-extrabold text-base text-gray-100 font-mono">{cc.totalCallsToday}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px]">Aktive Teams:</span>
                <span className="font-extrabold text-base text-gold-400 font-mono">{cc.teams.length} Teams</span>
              </div>
            </div>

            {/* Teams List */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                Zugeordnete Teams:
              </span>
              <div className="space-y-2">
                {cc.teams.map((tm) => (
                  <div key={tm.id} className="flex items-center justify-between p-3 rounded-xl bg-dark-850 border border-dark-border text-xs">
                    <div>
                      <span className="font-bold text-gray-200 block">{tm.name}</span>
                      <span className="text-[10px] text-gray-500">Leitung: {tm.leader}</span>
                    </div>
                    <span className="font-mono text-gray-300 font-semibold bg-dark-900 px-2 py-1 rounded border border-dark-border">
                      {tm.agentsCount} Agenten
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Assigned Campaigns */}
            <div className="pt-2 border-t border-dark-border flex items-center justify-between text-xs text-gray-400">
              <span>Kampagnen: {cc.assignedCampaigns.join(', ')}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-dark-900 border border-gold-500/40 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-gray-100 flex items-center gap-2">
              <Building className="text-gold-500" size={20} />
              <span>Neues Callcenter anlegen</span>
            </h3>

            <form onSubmit={handleAddCenter} className="space-y-3">
              <div>
                <label className="text-xs text-gray-400 block mb-1">Name der Organisation:</label>
                <input
                  type="text"
                  required
                  value={newCenterName}
                  onChange={(e) => setNewCenterName(e.target.value)}
                  placeholder="z. B. Antalya Dialer Hub"
                  className="w-full bg-dark-850 border border-dark-border rounded-lg p-2.5 text-xs text-gray-100 focus:border-gold-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-gray-400 block mb-1">Stadt / Standort:</label>
                <input
                  type="text"
                  value={newCenterCity}
                  onChange={(e) => setNewCenterCity(e.target.value)}
                  placeholder="z. B. Antalya"
                  className="w-full bg-dark-850 border border-dark-border rounded-lg p-2.5 text-xs text-gray-100 focus:border-gold-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="ghost" onClick={() => setModalOpen(false)}>
                  Abbrechen
                </Button>
                <Button type="submit" className="bg-gold-500 hover:bg-gold-600 text-dark-950 font-bold">
                  Speichern
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
