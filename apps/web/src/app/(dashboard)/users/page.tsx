"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { usePortalStore, UserItem } from '@/stores/portalStore';
import { 
  Users, UserPlus, Search, Shield, Building, 
  Trash2, CheckCircle2, XCircle, Globe, MoreVertical 
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function UsersPage() {
  const t = useTranslations('users');
  const commonT = useTranslations('common');
  const { users, addUser, toggleUserStatus, deleteUser } = usePortalStore();

  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'agent',
    language: 'tr',
    callCenter: 'Berlin Call Center',
    team: 'Team Alpha',
  });

  const filteredUsers = users.filter((u) =>
    u.firstName.toLowerCase().includes(search.toLowerCase()) ||
    u.lastName.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.email) return;
    addUser(form);
    setModalOpen(false);
    setForm({
      firstName: '',
      lastName: '',
      email: '',
      role: 'agent',
      language: 'tr',
      callCenter: 'Berlin Call Center',
      team: 'Team Alpha',
    });
  };

  const getRoleBadge = (role: string) => {
    const map: Record<string, { label: string; color: string }> = {
      super_admin: { label: '👑 Super-Admin', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30 font-bold' },
      tenant_admin: { label: '🏢 Firma Admin', color: 'bg-gold-500/20 text-gold-300 border-gold-500/30 font-bold' },
      team_leader: { label: '👔 Teamleiter', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
      agent: { label: '🎧 Agent (Operator)', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
      qc: { label: '🔍 Qualitätskontrolle', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
    };
    const r = map[role] || { label: role, color: 'bg-dark-800 text-gray-300 border-dark-border' };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs border ${r.color}`}>
        {r.label}
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-100 flex items-center gap-2.5">
            <Users className="text-gold-500" size={24} />
            <span>{t('title')}</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Mitarbeiter, Callcenter-Partner und Zugriffsberechtigungen verwalten
          </p>
        </div>

        <Button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-gold-500 to-amber-500 text-dark-950 font-bold text-xs shadow-lg shadow-gold-500/20 hover:brightness-110"
        >
          <UserPlus size={16} />
          <span>{t('createUser')}</span>
        </Button>
      </div>

      {/* Search & Filter */}
      <div className="bg-dark-900 border border-dark-border rounded-2xl p-4 shadow-xl flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Benutzer suchen nach Name, E-Mail oder Rolle..."
            className="w-full bg-dark-850 border border-dark-border rounded-xl pl-10 pr-4 py-2 text-xs text-gray-100 focus:border-gold-500 focus:outline-none transition-colors"
          />
        </div>

        <span className="text-xs text-gray-400 font-medium">
          Gesamt: <strong>{users.length}</strong> Benutzer aktiv
        </span>
      </div>

      {/* Users Table */}
      <div className="bg-dark-900 border border-dark-border rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-dark-850 text-gray-400 uppercase font-semibold border-b border-dark-border tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">{t('firstName')} & {t('lastName')}</th>
                <th className="py-3.5 px-4">{t('email')}</th>
                <th className="py-3.5 px-4">{t('role')}</th>
                <th className="py-3.5 px-4">{t('callcenter')} / {t('team')}</th>
                <th className="py-3.5 px-4">Sprache</th>
                <th className="py-3.5 px-4">{t('status')}</th>
                <th className="py-3.5 px-4 text-right">Aktionen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border text-gray-200">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-dark-850/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-xl bg-gold-500/10 text-gold-400 border border-gold-500/20 flex items-center justify-center font-bold text-xs">
                        {u.firstName.charAt(0)}{u.lastName.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-gray-100 block">{u.firstName} {u.lastName}</span>
                        <span className="text-[10px] text-gray-500">Zuletzt: {u.lastLogin}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-gray-300">{u.email}</td>
                  <td className="py-3.5 px-4">{getRoleBadge(u.role)}</td>
                  <td className="py-3.5 px-4">
                    <div className="text-gray-200">{u.callCenter}</div>
                    <div className="text-[10px] text-gray-500">{u.team}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 font-mono uppercase font-bold text-[10px] bg-dark-850 px-2 py-0.5 rounded border border-dark-border">
                      <Globe size={11} className="text-gold-400" />
                      {u.language}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => toggleUserStatus(u.id)}
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-all ${
                        u.isActive
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                          : 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20'
                      }`}
                    >
                      {u.isActive ? (
                        <>
                          <CheckCircle2 size={12} />
                          <span>Aktiv</span>
                        </>
                      ) : (
                        <>
                          <XCircle size={12} />
                          <span>Inaktiv</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => deleteUser(u.id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Benutzer entfernen"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create User Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-lg bg-dark-900 border border-gold-500/40 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-gray-100 flex items-center gap-2">
              <UserPlus className="text-gold-500" size={20} />
              <span>{t('createUser')}</span>
            </h3>

            <form onSubmit={handleCreate} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">{t('firstName')} *:</label>
                  <input
                    type="text"
                    required
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    className="w-full bg-dark-850 border border-dark-border rounded-lg p-2.5 text-xs text-gray-100 focus:border-gold-500 focus:outline-none"
                    placeholder="Ayşe"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">{t('lastName')} *:</label>
                  <input
                    type="text"
                    required
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    className="w-full bg-dark-850 border border-dark-border rounded-lg p-2.5 text-xs text-gray-100 focus:border-gold-500 focus:outline-none"
                    placeholder="Kaya"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-400 block mb-1">{t('email')} *:</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-dark-850 border border-dark-border rounded-lg p-2.5 text-xs text-gray-100 focus:border-gold-500 focus:outline-none"
                  placeholder="ayse@demo.de"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">{t('role')}:</label>
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="w-full bg-dark-850 border border-dark-border rounded-lg p-2.5 text-xs text-gray-100 focus:border-gold-500 focus:outline-none"
                  >
                    <option value="agent">Agent (Operator)</option>
                    <option value="team_leader">Teamleiter</option>
                    <option value="qc">QC (Qualitätskontrolle)</option>
                    <option value="tenant_admin">Mandanten-Admin</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Standard-Sprache:</label>
                  <select
                    value={form.language}
                    onChange={(e) => setForm({ ...form, language: e.target.value })}
                    className="w-full bg-dark-850 border border-dark-border rounded-lg p-2.5 text-xs text-gray-100 focus:border-gold-500 focus:outline-none"
                  >
                    <option value="tr">Türkçe (TR)</option>
                    <option value="de">Deutsch (DE)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-dark-border">
                <Button variant="ghost" type="button" onClick={() => setModalOpen(false)}>
                  {commonT('cancel')}
                </Button>
                <Button type="submit" className="bg-gold-500 hover:bg-gold-600 text-dark-950 font-bold">
                  {commonT('save')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
