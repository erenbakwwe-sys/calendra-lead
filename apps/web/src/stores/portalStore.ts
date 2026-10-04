import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useAuthStore } from './auth';

export interface LeadItem {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  phoneNormalized: string;
  email: string;
  city: string;
  postalCode: string;
  product: string;
  projectType?: 'solar' | 'waermepumpe' | 'treppenlift' | 'strom' | 'gas' | 'pflegebox';
  street?: string;
  extraData?: Record<string, any>;
  source: string;
  status: string;
  priority: number;
  attempts: number;
  maxAttempts: number;
  assignedAgentName?: string;
  campaignName: string;
  providerName: string;
  createdAt: string;
  consent: {
    given: boolean;
    timestamp: string;
    sourceUrl: string;
    ip: string;
    textVersion: string;
    namedPartners: string[];
  };
  notes: { id: string; author: string; content: string; createdAt: string }[];
  history: { id: string; from: string; to: string; user: string; note: string; createdAt: string }[];
}

export interface UserItem {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
  language: string;
  callCenter: string;
  team: string;
  lastLogin: string;
}

export interface CallbackItem {
  id: string;
  leadId: string;
  leadName: string;
  phone: string;
  scheduledAt: string;
  timeSlot: string;
  note: string;
  agentName: string;
  isCompleted: boolean;
  campaign: string;
}

export interface CampaignItem {
  id: string;
  name: string;
  product: string;
  assignmentMode: 'manual' | 'round_robin' | 'load_based' | 'pool';
  dialerMode: 'manual' | 'preview' | 'power' | 'predictive';
  callWindow: string;
  isActive: boolean;
  totalLeads: number;
  contactedLeads: number;
  conversionRate: string;
}

export interface ProviderItem {
  id: string;
  name: string;
  type: 'push' | 'pull';
  apiKeyPrefix: string;
  apiKeySecret?: string;
  isActive: boolean;
  leadsReceived: number;
  acceptanceRate: string;
  lastSync: string;
}

export interface ChatMsg {
  id: string;
  sender: string;
  role: string;
  content: string;
  channel: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  type: 'lead' | 'callback' | 'qc' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  time: string;
}

interface PortalState {
  leads: LeadItem[];
  users: UserItem[];
  callbacks: CallbackItem[];
  campaigns: CampaignItem[];
  providers: ProviderItem[];
  chatMessages: ChatMsg[];
  notifications: NotificationItem[];
  dncList: { phone: string; reason: string; date: string }[];
  
  // Work mode & Tenant
  workMode: 'provider_leads' | 'own_projects';
  currentTenantId: string;
  tenants: { id: string; name: string; slug: string }[];

  // Onboarding Tour
  tourOpen: boolean;
  tourStep: number;

  // Mobile Navigation
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;

  // Active Dialer / WebRTC call simulation
  activeDialerLead: LeadItem | null;
  callStatus: 'idle' | 'calling' | 'connected' | 'ended';
  callDuration: number;
  isMuted: boolean;
  isHeld: boolean;
  
  // Actions
  setWorkMode: (mode: 'provider_leads' | 'own_projects') => void;
  switchTenant: (tenantId: string) => void;
  openTour: () => void;
  closeTour: () => void;
  setTourStep: (step: number) => void;

  // Lead actions
  addLead: (lead: Partial<LeadItem>) => void;
  forwardLeadToPartner: (leadId: string, partnerId?: string, webhookUrl?: string) => Promise<boolean>;
  updateLeadStatus: (leadId: string, status: string, note?: string) => void;
  addLeadNote: (leadId: string, note: string) => void;
  addToDnc: (phone: string, reason: string) => void;
  deleteLead: (leadId: string) => void;

  // User actions
  addUser: (user: Partial<UserItem>) => void;
  toggleUserStatus: (userId: string) => void;
  deleteUser: (userId: string) => void;

  // Campaign & Provider
  toggleCampaignStatus: (campaignId: string) => void;
  addCampaign: (campaign: Partial<CampaignItem>) => void;
  generateApiKey: (providerId: string) => string;

  // QC actions
  approveQc: (leadId: string, note?: string) => void;
  rejectQc: (leadId: string, reason: string) => void;

  // Callbacks
  addCallback: (cb: Partial<CallbackItem>) => void;
  completeCallback: (id: string) => void;

  // Chat
  sendChatMessage: (content: string, channel?: string) => void;

  // Notifications
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Dialer
  startCall: (lead: LeadItem) => void;
  hangupCall: (disposition?: string, note?: string) => void;
  toggleMute: () => void;
  toggleHold: () => void;
  setCallDuration: (sec: number | ((prev: number) => number)) => void;
  resetCall: () => void;
}

const initialLeads: LeadItem[] = [
  {
    id: 'lead-1',
    firstName: 'Maximilian',
    lastName: 'Mustermann',
    phone: '+49 176 12345678',
    phoneNormalized: '+4917612345678',
    email: 'm.mustermann@web.de',
    city: 'Berlin',
    postalCode: '10115',
    product: 'Photovoltaik (10 kWp)',
    source: 'Solar-Vergleich.de',
    status: 'new',
    priority: 1,
    attempts: 0,
    maxAttempts: 5,
    assignedAgentName: 'Ahmet Yilmaz',
    campaignName: 'PV Deutschland 2026',
    providerName: 'SolarVergleich24',
    createdAt: 'Heute, 09:15',
    consent: {
      given: true,
      timestamp: '2026-10-02T07:14:22Z',
      sourceUrl: 'https://solar-vergleich.de/anfrage/pv-10kwp',
      ip: '84.115.42.19',
      textVersion: 'v2.4_GDPR_DE',
      namedPartners: ['VertriebsHub GmbH', 'SolarTech Partner DE'],
    },
    notes: [
      { id: 'n-1', author: 'System', content: 'Lead via API-Push erfolgreich importiert und validiert.', createdAt: '09:15' }
    ],
    history: [
      { id: 'h-1', from: 'none', to: 'new', user: 'API Ingest', note: 'Einwilligung DSGVO-konform geprüft', createdAt: '09:15' }
    ]
  },
  {
    id: 'lead-2',
    firstName: 'Sabine',
    lastName: 'Müller',
    phone: '+49 151 98765432',
    phoneNormalized: '+4915198765432',
    email: 'sabine.mueller@gmx.de',
    city: 'München',
    postalCode: '80331',
    product: 'Wärmepumpe Luft-Wasser',
    source: 'Heizung-Sparen.net',
    status: 'callback',
    priority: 2,
    attempts: 1,
    maxAttempts: 5,
    assignedAgentName: 'Mehmet Demir',
    campaignName: 'Wärmepumpe Süd',
    providerName: 'EcoLeads Berlin',
    createdAt: 'Gestern, 14:20',
    consent: {
      given: true,
      timestamp: '2026-10-01T12:18:00Z',
      sourceUrl: 'https://heizung-sparen.net/wp-form',
      ip: '194.25.10.4',
      textVersion: 'v2.1_WP',
      namedPartners: ['VertriebsHub GmbH'],
    },
    notes: [
      { id: 'n-2', author: 'Mehmet Demir', content: 'Kunde war auf dem Sprung, bitte heute um 14:00 anrufen.', createdAt: '14:32' }
    ],
    history: [
      { id: 'h-2', from: 'new', to: 'in_progress', user: 'Mehmet Demir', note: 'Erstkontakt versucht', createdAt: '14:30' },
      { id: 'h-3', from: 'in_progress', to: 'callback', user: 'Mehmet Demir', note: 'Rückruf für 14:00 vereinbart', createdAt: '14:32' }
    ]
  },
  {
    id: 'lead-3',
    firstName: 'Klaus',
    lastName: 'Weber',
    phone: '+49 160 5551234',
    phoneNormalized: '+491605551234',
    email: 'klaus.weber@t-online.de',
    city: 'Köln',
    postalCode: '50667',
    product: 'Photovoltaik + Speicher',
    source: 'Solar-Vergleich.de',
    status: 'qualified',
    priority: 1,
    attempts: 2,
    maxAttempts: 5,
    assignedAgentName: 'Ayşe Kaya',
    campaignName: 'PV Deutschland 2026',
    providerName: 'SolarVergleich24',
    createdAt: 'Heute, 08:30',
    consent: {
      given: true,
      timestamp: '2026-10-02T06:25:00Z',
      sourceUrl: 'https://solar-vergleich.de/anfrage/pv-speicher',
      ip: '91.64.212.80',
      textVersion: 'v2.4_GDPR_DE',
      namedPartners: ['VertriebsHub GmbH'],
    },
    notes: [
      { id: 'n-3', author: 'Ayşe Kaya', content: 'Einfamilienhaus Eigentümer, Dachneigung 35 Grad Südausrichtung, 8000 kWh Verbrauch. Sehr interessiert.', createdAt: '09:05' }
    ],
    history: [
      { id: 'h-4', from: 'new', to: 'contacted', user: 'Ayşe Kaya', note: 'Kunde erreicht', createdAt: '08:50' },
      { id: 'h-5', from: 'contacted', to: 'qualified', user: 'Ayşe Kaya', note: 'Kriterien erfüllt, wartet auf QC-Freigabe', createdAt: '09:05' }
    ]
  },
  {
    id: 'lead-4',
    firstName: 'Thomas',
    lastName: 'Schneider',
    phone: '+49 171 4433221',
    phoneNormalized: '+491714433221',
    email: 't.schneider@gmail.com',
    city: 'Hamburg',
    postalCode: '20095',
    product: 'Treppenlift Kurve',
    source: 'SeniorenRatgeber.de',
    status: 'qc_pending',
    priority: 2,
    attempts: 1,
    maxAttempts: 4,
    assignedAgentName: 'Mehmet Demir',
    campaignName: 'Barrierefrei Nord',
    providerName: 'LeadGen Deutschland GmbH',
    createdAt: 'Heute, 09:40',
    consent: {
      given: true,
      timestamp: '2026-10-02T07:35:10Z',
      sourceUrl: 'https://seniorenratgeber.de/treppenlift-check',
      ip: '217.80.12.3',
      textVersion: 'v1.9_SENIOR',
      namedPartners: ['VertriebsHub GmbH', 'Lifte24'],
    },
    notes: [
      { id: 'n-4', author: 'Mehmet Demir', content: 'Aufnahme liegt vor. Pflegestufe 2 vorhanden, 4.000€ Zuschuss.', createdAt: '10:02' }
    ],
    history: [
      { id: 'h-6', from: 'new', to: 'qualified', user: 'Mehmet Demir', note: 'Qualifiziert', createdAt: '10:00' },
      { id: 'h-7', from: 'qualified', to: 'qc_pending', user: 'System', note: 'An QC weitergeleitet', createdAt: '10:02' }
    ]
  },
  {
    id: 'lead-5',
    firstName: 'Elena',
    lastName: 'Fischer',
    phone: '+49 152 7788990',
    phoneNormalized: '+491527788990',
    email: 'elena.fischer@icloud.com',
    city: 'Frankfurt am Main',
    postalCode: '60311',
    product: 'Photovoltaik (8 kWp)',
    source: 'EcoEnergy-Direct',
    status: 'approved',
    priority: 1,
    attempts: 1,
    maxAttempts: 5,
    assignedAgentName: 'Ayşe Kaya',
    campaignName: 'PV Deutschland 2026',
    providerName: 'SolarVergleich24',
    createdAt: 'Gestern, 11:00',
    consent: {
      given: true,
      timestamp: '2026-10-01T09:00:00Z',
      sourceUrl: 'https://ecoenergy.de/solar',
      ip: '80.150.2.14',
      textVersion: 'v2.4_GDPR_DE',
      namedPartners: ['VertriebsHub GmbH'],
    },
    notes: [
      { id: 'n-5', author: 'Lisa Müller (QC)', content: 'Aufzeichnung geprüft. Einwilligung und Daten zu 100% verifiziert. Freigegeben.', createdAt: '11:45' }
    ],
    history: [
      { id: 'h-8', from: 'qc_pending', to: 'approved', user: 'Lisa Müller', note: 'QC Genehmigung erteilt', createdAt: '11:45' }
    ]
  }
];

const initialUsers: UserItem[] = [
  { id: 'u-1', firstName: 'Super', lastName: 'Admin', email: 'super@calendra.de', role: 'super_admin', isActive: true, language: 'de', callCenter: 'Hauptverwaltung', team: 'Management', lastLogin: 'Vor 5 Min' },
  { id: 'u-2', firstName: 'Firma', lastName: 'Admin', email: 'admin@demo.de', role: 'tenant_admin', isActive: true, language: 'de', callCenter: 'Berlin Call Center', team: 'Operations', lastLogin: 'Heute, 08:00' },
  { id: 'u-3', firstName: 'Ahmet', lastName: 'Yilmaz', email: 'teamlead@demo.de', role: 'team_leader', isActive: true, language: 'tr', callCenter: 'Berlin Call Center', team: 'Team Alpha', lastLogin: 'Heute, 08:30' },
  { id: 'u-4', firstName: 'Mehmet', lastName: 'Demir', email: 'agent1@demo.de', role: 'agent', isActive: true, language: 'tr', callCenter: 'Berlin Call Center', team: 'Team Alpha', lastLogin: 'Heute, 08:45' },
  { id: 'u-5', firstName: 'Ayşe', lastName: 'Kaya', email: 'agent2@demo.de', role: 'agent', isActive: true, language: 'tr', callCenter: 'Berlin Call Center', team: 'Team Alpha', lastLogin: 'Heute, 09:00' },
  { id: 'u-6', firstName: 'Lisa', lastName: 'Müller', email: 'qc@demo.de', role: 'qc', isActive: true, language: 'de', callCenter: 'Berlin Call Center', team: 'Qualitätskontrolle', lastLogin: 'Heute, 09:10' },
];

const initialCallbacks: CallbackItem[] = [
  { id: 'cb-1', leadId: 'lead-2', leadName: 'Sabine Müller', phone: '+49 151 98765432', scheduledAt: 'Heute', timeSlot: '14:00', note: 'Kunde erwartet Angebot für Wärmepumpe Luft-Wasser.', agentName: 'Mehmet Demir', isCompleted: false, campaign: 'Wärmepumpe Süd' },
  { id: 'cb-2', leadId: 'lead-1', leadName: 'Maximilian Mustermann', phone: '+49 176 12345678', scheduledAt: 'Heute', timeSlot: '16:30', note: 'Zweitgespräch mit Ehepartnerin.', agentName: 'Ahmet Yilmaz', isCompleted: false, campaign: 'PV Deutschland 2026' },
  { id: 'cb-3', leadId: 'lead-6', leadName: 'Wolfgang Becker', phone: '+49 170 3322114', scheduledAt: 'Morgen', timeSlot: '10:00', note: 'Angebot über 12 kWp PV mit Speicher besprechen.', agentName: 'Ayşe Kaya', isCompleted: false, campaign: 'PV Deutschland 2026' },
];

const initialCampaigns: CampaignItem[] = [
  { id: 'c-1', name: 'PV Deutschland 2026', product: 'Photovoltaik', assignmentMode: 'round_robin', dialerMode: 'preview', callWindow: '09:00 - 20:00', isActive: true, totalLeads: 1240, contactedLeads: 980, conversionRate: '16.4%' },
  { id: 'c-2', name: 'Wärmepumpe Süd & West', product: 'Wärmepumpen', assignmentMode: 'load_based', dialerMode: 'power', callWindow: '09:00 - 19:30', isActive: true, totalLeads: 650, contactedLeads: 490, conversionRate: '12.8%' },
  { id: 'c-3', name: 'Treppenlift & Barrierefrei', product: 'Treppenlifte', assignmentMode: 'manual', dialerMode: 'manual', callWindow: '10:00 - 18:00', isActive: false, totalLeads: 310, contactedLeads: 280, conversionRate: '19.1%' },
];

const initialProviders: ProviderItem[] = [
  { id: 'p-1', name: 'SolarVergleich24', type: 'push', apiKeyPrefix: 'cal_live_sv24', isActive: true, leadsReceived: 842, acceptanceRate: '96.2%', lastSync: 'Vor 2 Min' },
  { id: 'p-2', name: 'LeadGen Deutschland GmbH', type: 'push', apiKeyPrefix: 'cal_live_lgde', isActive: true, leadsReceived: 1250, acceptanceRate: '94.8%', lastSync: 'Vor 15 Min' },
  { id: 'p-3', name: 'EcoLeads Berlin', type: 'pull', apiKeyPrefix: 'cal_live_ecol', isActive: true, leadsReceived: 410, acceptanceRate: '98.0%', lastSync: 'Vor 1 Stunde' },
];

const initialChatMessages: ChatMsg[] = [
  { id: 'cm-1', sender: 'Ahmet Yilmaz', role: 'team_leader', content: 'Guten Morgen Team! Heute haben wir 85 neue PV-Leads reinbekommen. Bitte zügig anrufen.', channel: 'allgemein', createdAt: '08:45' },
  { id: 'cm-2', sender: 'Mehmet Demir', role: 'agent', content: 'Guten Morgen! Bin eingeloggt und im Preview-Modus.', channel: 'allgemein', createdAt: '08:47' },
  { id: 'cm-3', sender: 'Ayşe Kaya', role: 'agent', content: 'Erster Lead Klaus Weber qualifiziert und an QC übergeben!', channel: 'allgemein', createdAt: '09:06' },
  { id: 'cm-4', sender: 'Lisa Müller', role: 'qc', content: 'Super Ayşe, schaue mir das Audiofile gleich an.', channel: 'allgemein', createdAt: '09:08' },
];

const initialNotifications: NotificationItem[] = [
  { id: 'notif-1', type: 'lead', title: 'Neuer Lead zugewiesen', message: 'Maximilian Mustermann (PV 10kWp) wurde Ihnen zugewiesen.', isRead: false, time: 'Vor 5 Min' },
  { id: 'notif-2', type: 'callback', title: 'Rückruf fällig in 30 Min', message: 'Sabine Müller (Wärmepumpe) um 14:00 Uhr.', isRead: false, time: 'Vor 20 Min' },
  { id: 'notif-3', type: 'qc', title: 'Lead freigegeben', message: 'Elena Fischer wurde von QC genehmigt.', isRead: true, time: 'Vor 2 Stunden' },
  { id: 'notif-4', type: 'system', title: 'SIP-Trunk bereit', message: 'Asterisk Frankfurt Trunk online (10/10 Kanäle frei).', isRead: true, time: 'Vor 4 Stunden' },
];

export const usePortalStore = create<PortalState>()(
  persist(
    (set, get) => ({
      leads: initialLeads,
      users: initialUsers,
      callbacks: initialCallbacks,
      campaigns: initialCampaigns,
      providers: initialProviders,
      chatMessages: initialChatMessages,
      notifications: initialNotifications,
      dncList: [
        { phone: '+49 172 0000000', reason: 'Kunde wünscht keine Anrufe mehr', date: '2026-09-28' },
        { phone: '+49 157 1111111', reason: 'Falsche Nummer / Widerspruch', date: '2026-09-30' }
      ],
      workMode: 'provider_leads',
      currentTenantId: 't-1',
      tenants: [
        { id: 't-1', name: 'Demo GmbH (Berlin)', slug: 'demo' },
        { id: 't-2', name: 'SolarTech Deutschland', slug: 'solartech' },
        { id: 't-3', name: 'EnergieDirekt AG', slug: 'energiedirekt' },
      ],
      tourOpen: false,
      tourStep: 0,
      mobileMenuOpen: false,
      activeDialerLead: null,
      callStatus: 'idle',
      callDuration: 0,
      isMuted: false,
      isHeld: false,

      setWorkMode: (mode) => set({ workMode: mode }),
      switchTenant: (tenantId) => set({ currentTenantId: tenantId }),
      openTour: () => set({ tourOpen: true, tourStep: 0 }),
      closeTour: () => set({ tourOpen: false }),
      setTourStep: (step) => set({ tourStep: step }),
      setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),

      addLead: (lead) => {
        const newLead: LeadItem = {
          id: `lead-${Date.now()}`,
          firstName: lead.firstName || 'Unbekannt',
          lastName: lead.lastName || '',
          phone: lead.phone || '',
          phoneNormalized: lead.phoneNormalized || lead.phone || '',
          email: lead.email || '',
          city: lead.city || 'Berlin',
          postalCode: lead.postalCode || '10115',
          street: lead.street || '',
          product: lead.product || 'Photovoltaik',
          projectType: lead.projectType || 'solar',
          extraData: lead.extraData || {},
          source: lead.source || 'Manuell / Web',
          status: 'new',
          priority: lead.priority || 1,
          attempts: 0,
          maxAttempts: 5,
          campaignName: lead.campaignName || 'PV Deutschland 2026',
          providerName: lead.providerName || 'Eigenes Projekt',
          createdAt: 'Gerade eben',
          consent: {
            given: true,
            timestamp: new Date().toISOString(),
            sourceUrl: 'https://portal.vertriebshub.de/lead-form',
            ip: '127.0.0.1',
            textVersion: 'v2.4_GDPR_DE',
            namedPartners: ['VertriebsHub GmbH'],
          },
          notes: [{ id: `n-${Date.now()}`, author: 'User', content: 'Lead manuell angelegt.', createdAt: 'Gerade eben' }],
          history: [{ id: `h-${Date.now()}`, from: 'none', to: 'new', user: 'Admin', note: 'Erstellt', createdAt: 'Gerade eben' }],
        };
        set((state) => ({ leads: [newLead, ...state.leads] }));

        // Also send to backend API
        try {
          const rawBase = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1').replace(/\/+$/, '');
          const apiBase = rawBase.endsWith('/v1') ? rawBase : `${rawBase}/api/v1`;
          const token = typeof window !== 'undefined' ? (useAuthStore.getState().accessToken || localStorage.getItem('auth-token')) : null;

          fetch(`${apiBase}/leads`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({
              firstName: newLead.firstName,
              lastName: newLead.lastName,
              phone: newLead.phone,
              email: newLead.email,
              postalCode: newLead.postalCode,
              city: newLead.city,
              street: newLead.street,
              product: newLead.product,
              projectType: newLead.projectType,
              source: newLead.source,
              priority: newLead.priority,
              campaignName: newLead.campaignName,
              extraData: newLead.extraData,
              consent: newLead.consent,
            }),
          }).then(async (res) => {
            if (res.ok) {
              const data = await res.json();
              console.log('[VertriebsHub] Lead erfolgreich an API übertragen:', data.id);
              // Auto-forward to partner
              if (data.id) {
                fetch(`${apiBase}/leads/${data.id}/forward`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
                  },
                  body: JSON.stringify({ partnerId: 'auto' }),
                }).then(() => {
                  console.log('[VertriebsHub] Lead direkt an Vertriebspartner weitergeleitet!');
                }).catch((err) => console.warn('[VertriebsHub] Partner-Weiterleitung fehlgeschlagen:', err));
              }
            } else {
              console.warn('[VertriebsHub] API Status beim Lead-Senden:', res.status);
            }
          }).catch((err) => {
            console.warn('[VertriebsHub] Backend API nicht aktiv, Lead lokal im Store hinterlegt:', err);
          });
        } catch (e) {
          console.warn('[VertriebsHub] Fehler beim API-Aufruf:', e);
        }
      },

      forwardLeadToPartner: async (leadId, partnerId = 'auto', webhookUrl) => {
        try {
          const rawBase = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1').replace(/\/+$/, '');
          const apiBase = rawBase.endsWith('/v1') ? rawBase : `${rawBase}/api/v1`;
          const token = typeof window !== 'undefined' ? (useAuthStore.getState().accessToken || localStorage.getItem('auth-token')) : null;

          const res = await fetch(`${apiBase}/leads/${leadId}/forward`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({ partnerId, partnerWebhookUrl: webhookUrl }),
          });

          if (res.ok) {
            get().updateLeadStatus(leadId, 'assigned', 'Erfolgreich an Vertriebspartner übertragen');
            return true;
          }
          return false;
        } catch (err) {
          console.warn('[VertriebsHub] Manuelle Partner-Weiterleitung fehlgeschlagen:', err);
          get().updateLeadStatus(leadId, 'assigned', 'An Vertriebspartner übertragen (Offline/Simuliert)');
          return true;
        }
      },

      updateLeadStatus: (leadId, status, note) => {
        set((state) => ({
          leads: state.leads.map((l) => {
            if (l.id !== leadId) return l;
            return {
              ...l,
              status,
              history: [
                ...l.history,
                {
                  id: `h-${Date.now()}`,
                  from: l.status,
                  to: status,
                  user: 'Agent / Teamleiter',
                  note: note || `Status auf ${status} geändert`,
                  createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                },
              ],
            };
          }),
        }));
      },

      addLeadNote: (leadId, content) => {
        set((state) => ({
          leads: state.leads.map((l) => {
            if (l.id !== leadId) return l;
            return {
              ...l,
              notes: [
                ...l.notes,
                {
                  id: `n-${Date.now()}`,
                  author: 'Aktueller Benutzer',
                  content,
                  createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                },
              ],
            };
          }),
        }));
      },

      addToDnc: (phone, reason) => {
        set((state) => ({
          dncList: [...state.dncList, { phone, reason, date: new Date().toISOString().split('T')[0] }],
          leads: state.leads.map((l) => (l.phone === phone ? { ...l, status: 'do_not_call' } : l)),
        }));
      },

      deleteLead: (leadId) => {
        set((state) => ({ leads: state.leads.filter((l) => l.id !== leadId) }));
      },

      addUser: (user) => {
        const newUser: UserItem = {
          id: `u-${Date.now()}`,
          firstName: user.firstName || 'Neu',
          lastName: user.lastName || 'Benutzer',
          email: user.email || 'user@demo.de',
          role: user.role || 'agent',
          isActive: true,
          language: user.language || 'de',
          callCenter: user.callCenter || 'Berlin Call Center',
          team: user.team || 'Team Alpha',
          lastLogin: 'Nie',
        };
        set((state) => ({ users: [...state.users, newUser] }));
      },

      toggleUserStatus: (userId) => {
        set((state) => ({
          users: state.users.map((u) => (u.id === userId ? { ...u, isActive: !u.isActive } : u)),
        }));
      },

      deleteUser: (userId) => {
        set((state) => ({ users: state.users.filter((u) => u.id !== userId) }));
      },

      toggleCampaignStatus: (campaignId) => {
        set((state) => ({
          campaigns: state.campaigns.map((c) => (c.id === campaignId ? { ...c, isActive: !c.isActive } : c)),
        }));
      },

      addCampaign: (campaign) => {
        const newCamp: CampaignItem = {
          id: `c-${Date.now()}`,
          name: campaign.name || 'Neue Kampagne',
          product: campaign.product || 'Photovoltaik',
          assignmentMode: campaign.assignmentMode || 'round_robin',
          dialerMode: campaign.dialerMode || 'preview',
          callWindow: campaign.callWindow || '09:00 - 20:00',
          isActive: true,
          totalLeads: 0,
          contactedLeads: 0,
          conversionRate: '0.0%',
        };
        set((state) => ({ campaigns: [...state.campaigns, newCamp] }));
      },

      generateApiKey: (providerId) => {
        const newKey = `cal_live_${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`;
        set((state) => ({
          providers: state.providers.map((p) =>
            p.id === providerId ? { ...p, apiKeyPrefix: newKey.substring(0, 16) + '...', apiKeySecret: newKey } : p
          ),
        }));
        return newKey;
      },

      approveQc: (leadId, note) => {
        get().updateLeadStatus(leadId, 'approved', note || 'Durch QC-Prüfung freigegeben');
      },

      rejectQc: (leadId, reason) => {
        get().updateLeadStatus(leadId, 'rejected', reason || 'QC Ablehnung: Angaben fehlerhaft');
      },

      addCallback: (cb) => {
        const newCb: CallbackItem = {
          id: `cb-${Date.now()}`,
          leadId: cb.leadId || '',
          leadName: cb.leadName || '',
          phone: cb.phone || '',
          scheduledAt: cb.scheduledAt || 'Heute',
          timeSlot: cb.timeSlot || '15:00',
          note: cb.note || '',
          agentName: cb.agentName || 'Agent',
          isCompleted: false,
          campaign: cb.campaign || 'PV Deutschland 2026',
        };
        set((state) => ({ callbacks: [newCb, ...state.callbacks] }));
      },

      completeCallback: (id) => {
        set((state) => ({
          callbacks: state.callbacks.map((c) => (c.id === id ? { ...c, isCompleted: true } : c)),
        }));
      },

      sendChatMessage: (content, channel = 'allgemein') => {
        const msg: ChatMsg = {
          id: `cm-${Date.now()}`,
          sender: 'Sie (Aktueller Benutzer)',
          role: 'team_leader',
          content,
          channel,
          createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        set((state) => ({ chatMessages: [...state.chatMessages, msg] }));
      },

      markNotificationRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
        }));
      },

      markAllNotificationsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        }));
      },

      startCall: (lead) => {
        set({
          activeDialerLead: lead,
          callStatus: 'calling',
          callDuration: 0,
          isMuted: false,
          isHeld: false,
        });
        // Simulate connecting after 1.5 seconds
        setTimeout(() => {
          if (get().callStatus === 'calling') {
            set({ callStatus: 'connected' });
            get().updateLeadStatus(lead.id, 'in_progress', 'Anruf über WebRTC-Dialer aufgebaut');
          }
        }, 1500);
      },

      hangupCall: (disposition, note) => {
        const currentLead = get().activeDialerLead;
        if (currentLead && disposition) {
          get().updateLeadStatus(currentLead.id, disposition, note);
        }
        set({ callStatus: 'ended' });
        setTimeout(() => {
          set({ callStatus: 'idle', activeDialerLead: null, callDuration: 0 });
        }, 1000);
      },

      toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
      toggleHold: () => set((state) => ({ isHeld: !state.isHeld })),
      setCallDuration: (sec) =>
        set((state) => ({
          callDuration: typeof sec === 'function' ? sec(state.callDuration) : sec,
        })),
      resetCall: () => set({ callStatus: 'idle', activeDialerLead: null, callDuration: 0 }),
    }),
    {
      name: 'vertriebshub-portal-storage',
    }
  )
);
