"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { usePortalStore, CallbackItem } from '@/stores/portalStore';
import { 
  PhoneCall, Clock, CheckCircle2, Phone, Calendar, 
  Plus, Check, User, MapPin, Search 
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function CallbacksPage() {
  const t = useTranslations('nav');
  const { callbacks, leads, startCall, completeCallback, addCallback } = usePortalStore();

  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('pending');
  const [modalOpen, setModalOpen] = useState(false);
  const [newCb, setNewCb] = useState({
    leadName: '',
    phone: '',
    scheduledAt: 'Heute',
    timeSlot: '14:00',
    note: '',
    agentName: 'Mehmet Demir',
    campaign: 'PV Deutschland 2026',
  });

  const filteredCallbacks = callbacks.filter((c) => {
    if (filter === 'pending') return !c.isCompleted;
    if (filter === 'completed') return c.isCompleted;
    return true;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCb.leadName || !newCb.phone) return;
    addCallback(newCb);
    setModalOpen(false);
    setNewCb({
      leadName: '',
      phone: '',
      scheduledAt: 'Heute',
      timeSlot: '14:00',
      note: '',
      agentName: 'Mehmet Demir',
      campaign: 'PV Deutschland 2026',
    });
  };

  const handleCall = (cb: CallbackItem) => {
    const targetLead = leads.find((l) => l.id === cb.leadId) || {
      id: `cb-lead-${Date.now()}`,
      firstName: cb.leadName.split(' ')[0] || 'Kunde',
      lastName: cb.leadName.split(' ')[1] || '',
      phone: cb.phone,
      phoneNormalized: cb.phone,
      email: '',
      city: 'Berlin',
      postalCode: '10115',
      product: cb.campaign,
      source: 'Rückruf',
      status: 'callback',
      priority: 1,
      attempts: 1,
      maxAttempts: 5,
      campaignName: cb.campaign,
      providerName: 'Calendra Portal',
      createdAt: 'Rückruf',
      consent: {
        given: true,
        timestamp: new Date().toISOString(),
        sourceUrl: 'https://calendra.de',
        ip: '127.0.0.1',
        textVersion: 'v2.4_GDPR_DE',
        namedPartners: ['Calendra GmbH'],
      },
      notes: [{ id: 'n1', author: cb.agentName, content: cb.note, createdAt: 'Termin' }],
      history: [],
    };

    startCall(targetLead);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-100 flex items-center gap-2.5">
            <PhoneCall className="text-gold-500" size={24} />
            <span>Rückrufe & Wiedervorlagen</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Terminierte Anrufe mit deutschen Interessenten — 1-Klick-Anwahl
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-gold-500 to-amber-500 text-dark-950 font-bold text-xs shadow-lg shadow-gold-500/20"
          >
            <Plus size={15} />
            <span>Neuen Rückruf planen</span>
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            filter === 'pending'
              ? 'bg-gold-500 text-dark-950 shadow-md shadow-gold-500/20'
              : 'bg-dark-900 text-gray-400 border border-dark-border hover:text-gray-100'
          }`}
        >
          Offene Rückrufe ({callbacks.filter((c) => !c.isCompleted).length})
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            filter === 'completed'
              ? 'bg-gold-500 text-dark-950 shadow-md shadow-gold-500/20'
              : 'bg-dark-900 text-gray-400 border border-dark-border hover:text-gray-100'
          }`}
        >
          Erledigt ({callbacks.filter((c) => c.isCompleted).length})
        </button>
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            filter === 'all'
              ? 'bg-gold-500 text-dark-950 shadow-md shadow-gold-500/20'
              : 'bg-dark-900 text-gray-400 border border-dark-border hover:text-gray-100'
          }`}
        >
          Alle ({callbacks.length})
        </button>
      </div>

      {/* Callback Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCallbacks.map((cb) => (
          <div
            key={cb.id}
            className={`p-5 rounded-2xl border transition-all space-y-4 shadow-xl ${
              cb.isCompleted
                ? 'bg-dark-900/60 border-dark-border opacity-70'
                : 'bg-dark-900 border-gold-500/30 hover:border-gold-500/60'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                  {cb.campaign}
                </span>
                <h3 className="font-bold text-base text-gray-100 mt-0.5">
                  {cb.leadName}
                </h3>
                <span className="font-mono text-xs text-gray-400">{cb.phone}</span>
              </div>

              <div className="text-right">
                <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-dark-850 text-gold-400 border border-dark-border">
                  {cb.scheduledAt}, {cb.timeSlot}
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-300 bg-dark-850/80 p-3 rounded-xl border border-dark-border leading-relaxed">
              "{cb.note}"
            </p>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-gray-400 flex items-center gap-1">
                <User size={13} />
                <span>Agent: {cb.agentName}</span>
              </span>

              <div className="flex items-center gap-2">
                {!cb.isCompleted ? (
                  <>
                    <button
                      onClick={() => completeCallback(cb.id)}
                      className="p-2 rounded-lg bg-dark-800 text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                      title="Als erledigt markieren"
                    >
                      <Check size={16} />
                    </button>
                    <Button
                      onClick={() => handleCall(cb)}
                      className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-1.5 px-3 rounded-xl shadow-md shadow-emerald-600/20"
                    >
                      <Phone size={13} />
                      <span>Anrufen</span>
                    </Button>
                  </>
                ) : (
                  <span className="text-emerald-400 font-medium flex items-center gap-1">
                    <CheckCircle2 size={15} />
                    <span>Erledigt</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Callback Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-dark-900 border border-gold-500/40 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-gray-100 flex items-center gap-2">
              <Calendar className="text-gold-500" size={20} />
              <span>Neuen Rückruf planen</span>
            </h3>

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="text-xs text-gray-400 block mb-1">Name des Kunden:</label>
                <input
                  type="text"
                  required
                  value={newCb.leadName}
                  onChange={(e) => setNewCb({ ...newCb, leadName: e.target.value })}
                  placeholder="Klaus Weber"
                  className="w-full bg-dark-850 border border-dark-border rounded-lg p-2.5 text-xs text-gray-100 focus:border-gold-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-gray-400 block mb-1">Telefonnummer:</label>
                <input
                  type="text"
                  required
                  value={newCb.phone}
                  onChange={(e) => setNewCb({ ...newCb, phone: e.target.value })}
                  placeholder="+49 176 12345678"
                  className="w-full bg-dark-850 border border-dark-border rounded-lg p-2.5 text-xs text-gray-100 focus:border-gold-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Datum:</label>
                  <select
                    value={newCb.scheduledAt}
                    onChange={(e) => setNewCb({ ...newCb, scheduledAt: e.target.value })}
                    className="w-full bg-dark-850 border border-dark-border rounded-lg p-2.5 text-xs text-gray-100 focus:border-gold-500 focus:outline-none"
                  >
                    <option value="Heute">Heute</option>
                    <option value="Morgen">Morgen</option>
                    <option value="In 2 Tagen">In 2 Tagen</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Uhrzeit:</label>
                  <input
                    type="time"
                    value={newCb.timeSlot}
                    onChange={(e) => setNewCb({ ...newCb, timeSlot: e.target.value })}
                    className="w-full bg-dark-850 border border-dark-border rounded-lg p-2.5 text-xs text-gray-100 focus:border-gold-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-400 block mb-1">Notiz / Thema:</label>
                <textarea
                  value={newCb.note}
                  onChange={(e) => setNewCb({ ...newCb, note: e.target.value })}
                  placeholder="Kunde wünscht Zweitgespräch mit Ehefrau..."
                  rows={3}
                  className="w-full bg-dark-850 border border-dark-border rounded-lg p-2.5 text-xs text-gray-100 focus:border-gold-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="ghost" type="button" onClick={() => setModalOpen(false)}>
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
