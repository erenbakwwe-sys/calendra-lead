"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { usePortalStore, LeadItem } from '@/stores/portalStore';
import { 
  FileText, Search, Filter, Phone, Eye, 
  Download, Plus, ShieldCheck, CheckCircle2, 
  Clock, AlertTriangle, ArrowUpDown, X, Check,
  Building, MapPin, Calendar, UserCheck
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { LeadIntakeWizard } from '@/components/leads/LeadIntakeWizard';

export default function LeadsPage() {
  const t = useTranslations('leads');
  const commonT = useTranslations('common');
  const { leads, startCall, updateLeadStatus, addToDnc, addLead, forwardLeadToPartner } = usePortalStore();

  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<string>('all');
  const [detailLead, setDetailLead] = useState<LeadItem | null>(null);
  const [forwardingId, setForwardingId] = useState<string | null>(null);
  const [forwardSuccess, setForwardSuccess] = useState(false);
  const [newLeadModalOpen, setNewLeadModalOpen] = useState(false);
  const [newLeadForm, setNewLeadForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    city: '',
    postalCode: '',
    product: 'Photovoltaik (10 kWp)',
    campaignName: 'PV Deutschland 2026',
  });

  const statuses = [
    'all', 'new', 'assigned', 'in_progress', 'callback', 
    'qualified', 'qc_pending', 'approved', 'rejected', 'do_not_call'
  ];

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch = 
      lead.firstName.toLowerCase().includes(search.toLowerCase()) ||
      lead.lastName.toLowerCase().includes(search.toLowerCase()) ||
      lead.phone.includes(search) ||
      lead.city.toLowerCase().includes(search.toLowerCase()) ||
      lead.product.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = selectedStatus === 'all' || lead.status === selectedStatus;
    const matchesProduct = selectedProduct === 'all' || lead.product.includes(selectedProduct);

    return matchesSearch && matchesStatus && matchesProduct;
  });

  const handleExportCsv = () => {
    const headers = ['ID', 'Vorname', 'Nachname', 'Telefon', 'PLZ', 'Stadt', 'Produkt', 'Status', 'DSGVO_OptIn'];
    const rows = filteredLeads.map((l) => [
      l.id, l.firstName, l.lastName, l.phoneNormalized, l.postalCode, l.city, l.product, l.status, l.consent.given ? 'JA' : 'NEIN'
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(';'), ...rows.map((e) => e.join(';'))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `vertriebshub_leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadForm.firstName || !newLeadForm.phone) return;

    addLead(newLeadForm);
    setNewLeadModalOpen(false);
    setNewLeadForm({
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      city: '',
      postalCode: '',
      product: 'Photovoltaik (10 kWp)',
      campaignName: 'PV Deutschland 2026',
    });
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, { label: string; color: string }> = {
      new: { label: 'Neu', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
      assigned: { label: 'Zugewiesen', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' },
      in_progress: { label: 'In Bearbeitung', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
      callback: { label: 'Rückruf', color: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
      qualified: { label: 'Qualifiziert', color: 'bg-teal-500/10 text-teal-400 border-teal-500/30' },
      qc_pending: { label: 'QC Prüfen', color: 'bg-amber-500/15 text-amber-300 border-amber-500/40' },
      approved: { label: 'Genehmigt', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40' },
      rejected: { label: 'Abgelehnt', color: 'bg-red-500/10 text-red-400 border-red-500/30' },
      do_not_call: { label: 'Nicht anrufen (DNC)', color: 'bg-red-600/20 text-red-300 border-red-600/40' },
    };
    const s = map[status] || { label: status, color: 'bg-dark-800 text-gray-300 border-dark-border' };
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${s.color}`}>
        {s.label}
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-100 flex items-center gap-2.5">
            <FileText className="text-gold-500" size={24} />
            <span>{t('title')}</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">{t('subtitle')}</p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={handleExportCsv}
            className="flex items-center gap-2 text-xs font-semibold"
          >
            <Download size={15} />
            <span>{t('exportCsv')}</span>
          </Button>

          <Button
            onClick={() => setNewLeadModalOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-gold-500 to-amber-500 text-dark-950 font-bold text-xs shadow-lg shadow-gold-500/20 hover:brightness-110"
          >
            <Plus size={15} />
            <span>{t('newLead')}</span>
          </Button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-dark-900 border border-dark-border rounded-2xl p-4 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full bg-dark-850 border border-dark-border rounded-xl pl-10 pr-4 py-2 text-xs text-gray-100 focus:border-gold-500 focus:outline-none transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="bg-dark-850 border border-dark-border rounded-xl px-3 py-2 text-xs text-gray-200 focus:border-gold-500 focus:outline-none"
            >
              <option value="all">Alle 6 Projekte</option>
              <option value="Photovoltaik">☀️ Solar / Photovoltaik</option>
              <option value="Wärmepumpe">♨️ Wärmepumpe</option>
              <option value="Treppenlift">🦽 Treppenlift</option>
              <option value="Strom">⚡ Stromwechsel</option>
              <option value="Gas">🔥 Gaswechsel</option>
              <option value="Pflegebox">📦 Pflegebox (§40 SGB XI)</option>
            </select>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedStatus === st
                  ? 'bg-gold-500 text-dark-950 font-bold shadow-md shadow-gold-500/20'
                  : 'bg-dark-850 text-gray-400 hover:text-gray-200 hover:bg-dark-800'
              }`}
            >
              {st === 'all' ? 'Alle Leads' : t(`status.${st}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-dark-900 border border-dark-border rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-dark-850 text-gray-400 uppercase font-semibold border-b border-dark-border tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Kunde / Kontakt</th>
                <th className="py-3.5 px-4">Telefon (E.164)</th>
                <th className="py-3.5 px-4">Ort</th>
                <th className="py-3.5 px-4">Produkt / Kampagne</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Einwilligung</th>
                <th className="py-3.5 px-4 text-right">Aktionen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border text-gray-200">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500">
                    Keine Leads für diese Filter gefunden.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-dark-850/60 transition-colors group">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-gray-100 group-hover:text-gold-400 transition-colors">
                        {lead.firstName} {lead.lastName}
                      </div>
                      <div className="text-[11px] text-gray-500">{lead.email || 'Keine E-Mail'}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium text-gray-300">
                      {lead.phone}
                    </td>
                    <td className="py-3.5 px-4">
                      <span>{lead.postalCode} {lead.city}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-gold-400">{lead.product}</div>
                      <div className="text-[10px] text-gray-500">{lead.campaignName}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      {getStatusBadge(lead.status)}
                    </td>
                    <td className="py-3.5 px-4">
                      {lead.consent.given ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                          <ShieldCheck size={14} />
                          <span>DSGVO OK</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-red-400 font-medium">
                          <AlertTriangle size={14} />
                          <span>Kein Opt-in</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <Button
                        onClick={() => startCall(lead)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-1.5 px-3 rounded-lg shadow-sm shadow-emerald-600/20"
                      >
                        <Phone size={13} className="mr-1" />
                        <span>Anrufen</span>
                      </Button>

                      <Button
                        variant="secondary"
                        onClick={() => setDetailLead(lead)}
                        className="text-xs py-1.5 px-2.5 bg-dark-800 hover:bg-dark-700 text-gray-300"
                        title="Details & DSGVO Nachweis"
                      >
                        <Eye size={14} />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-over Detail & Consent Proof Drawer */}
      {detailLead && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-xl bg-dark-900 border-l border-gold-500/40 p-6 overflow-y-auto space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-dark-border">
              <div>
                <span className="text-xs uppercase font-bold text-gold-500 tracking-wider">Lead Details</span>
                <h3 className="text-xl font-bold text-gray-100">
                  {detailLead.firstName} {detailLead.lastName}
                </h3>
              </div>
              <button
                onClick={() => setDetailLead(null)}
                className="p-2 text-gray-400 hover:text-gray-100 rounded-lg hover:bg-dark-800"
              >
                <X size={20} />
              </button>
            </div>

            {/* Quick Call Header in Drawer */}
            <div className="p-4 rounded-xl bg-dark-850 border border-dark-border flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-400">Direktkontakt</div>
                <div className="text-base font-mono font-bold text-gray-100">{detailLead.phone}</div>
              </div>
              <Button
                onClick={() => {
                  startCall(detailLead);
                  setDetailLead(null);
                }}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 px-4 rounded-xl flex items-center gap-1.5"
              >
                <Phone size={14} />
                <span>WebRTC Anruf</span>
              </Button>
            </div>

            {/* DSGVO Consent Proof Box (CRITICAL COMPLIANCE) */}
            <div className="p-4 rounded-xl bg-dark-850 border border-emerald-500/30 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <ShieldCheck size={18} />
                <span>Rechtssicherer DSGVO-Einwilligungsnachweis</span>
              </div>
              <div className="space-y-1.5 text-xs text-gray-300">
                <div className="flex justify-between border-b border-dark-border py-1">
                  <span className="text-gray-500">Opt-in Zeitstempel:</span>
                  <span className="font-mono">{detailLead.consent.timestamp}</span>
                </div>
                <div className="flex justify-between border-b border-dark-border py-1">
                  <span className="text-gray-500">IP-Adresse:</span>
                  <span className="font-mono">{detailLead.consent.ip}</span>
                </div>
                <div className="flex justify-between border-b border-dark-border py-1">
                  <span className="text-gray-500">Quell-URL:</span>
                  <span className="text-gold-400 truncate max-w-xs">{detailLead.consent.sourceUrl}</span>
                </div>
                <div className="flex justify-between border-b border-dark-border py-1">
                  <span className="text-gray-500">Einwilligungstext:</span>
                  <span className="font-mono">{detailLead.consent.textVersion}</span>
                </div>
                <div className="pt-1">
                  <span className="text-gray-500 block">Freigegebene Werbepartner:</span>
                  <span className="text-gray-300 font-medium">{detailLead.consent.namedPartners.join(', ')}</span>
                </div>
              </div>
            </div>

            {/* Lead Status Timeline */}
            <div className="space-y-3">
              <h4 className="text-xs uppercase font-bold text-gray-400 tracking-wider">Status-Verlauf & Audit-Trail</h4>
              <div className="space-y-2 border-l-2 border-dark-border ml-2 pl-4">
                {detailLead.history.map((h) => (
                  <div key={h.id} className="relative text-xs">
                    <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-gold-500 border-2 border-dark-900" />
                    <div className="flex items-center gap-2 font-bold text-gray-200">
                      <span>Status: {h.to}</span>
                      <span className="text-[10px] text-gray-500">({h.createdAt} von {h.user})</span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-0.5">{h.note}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-4 border-t border-dark-border flex flex-col gap-2">
              <Button
                onClick={async () => {
                  setForwardingId(detailLead.id);
                  const ok = await forwardLeadToPartner(detailLead.id);
                  setForwardingId(null);
                  if (ok) {
                    setForwardSuccess(true);
                    setTimeout(() => setForwardSuccess(false), 3000);
                  }
                }}
                className="w-full text-xs font-bold bg-gradient-to-r from-gold-500 to-amber-500 text-dark-950 flex items-center justify-center gap-1.5 shadow-md shadow-gold-500/20 py-2.5 rounded-xl hover:brightness-110"
              >
                <Building size={14} />
                <span>
                  {forwardingId === detailLead.id
                    ? 'Wird an Partner übermittelt...'
                    : forwardSuccess
                    ? '✓ Erfolgreich an Vertriebspartner übermittelt'
                    : 'Jetzt an Vertriebspartner senden (API Push)'}
                </span>
              </Button>

              <Button
                variant="secondary"
                onClick={() => {
                  addToDnc(detailLead.phone, 'Kunde wünscht keine Anrufe');
                  setDetailLead(null);
                }}
                className="w-full text-xs text-red-400 border-red-500/30 hover:bg-red-500/10"
              >
                Auf Sperrliste setzen (DNC)
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Dedicated Project Lead Intake Tool (6 Projects: Solar, Wärmepumpe, Treppenlift, Strom, Gas, Pflegebox) */}
      <LeadIntakeWizard 
        isOpen={newLeadModalOpen} 
        onClose={() => setNewLeadModalOpen(false)} 
      />
    </div>
  );
}
