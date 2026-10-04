"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { usePortalStore, LeadItem } from '@/stores/portalStore';
import { useRouter } from 'next/navigation';
import { 
  Sun, Flame, Accessibility, Zap, Fuel, 
  Package, Check, ArrowRight, ArrowLeft, ShieldCheck, 
  User, Phone, Mail, MapPin, Building, Sparkles,
  PhoneCall, FileText, CheckCircle2, AlertCircle, X
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export type ProjectKey = 'solar' | 'waermepumpe' | 'treppenlift' | 'strom' | 'gas' | 'pflegebox';

interface LeadIntakeWizardProps {
  isOpen?: boolean;
  onClose?: () => void;
  defaultProject?: ProjectKey;
}

export function LeadIntakeWizard({ isOpen = true, onClose, defaultProject = 'solar' }: LeadIntakeWizardProps) {
  const router = useRouter();
  const { addLead, startCall } = usePortalStore();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [compactMode, setCompactMode] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectKey>(defaultProject);
  const [createdLead, setCreatedLead] = useState<LeadItem | null>(null);

  // Common Contact Form
  const [contact, setContact] = useState({
    salutation: 'Herr',
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    postalCode: '',
    city: '',
    street: '',
  });

  // Project Specific States
  const [solarData, setSolarData] = useState({
    isOwner: 'Ja',
    roofType: 'Satteldach',
    roofOrientation: 'Südausrichtung',
    yearlyConsumption: '4.500 kWh',
    storageWanted: 'Ja',
    wallboxWanted: 'Ja',
  });

  const [heatPumpData, setHeatPumpData] = useState({
    currentHeating: 'Gasheizung',
    heatingAge: '16-20 Jahre',
    livingSpace: '140 m²',
    radiatorType: 'Standard-Heizkörper',
    insulation: 'Teilsaniert',
  });

  const [stairliftData, setStairliftData] = useState({
    stairType: 'Kurvige Treppe (über 1 Etage)',
    careLevel: 'Pflegegrad 2 (4.000€ Zuschuss)',
    environment: 'Innenbereich',
    urgency: 'Schnellstmöglich',
  });

  const [electricityData, setElectricityData] = useState({
    currentProvider: 'Grundversorger / E.ON',
    yearlyKwh: '3.800 kWh',
    meterNumber: '',
    preference: 'Günstigster Ökostrom mit Preisgarantie',
  });

  const [gasData, setGasData] = useState({
    currentProvider: 'Stadtwerke / Vattenfall',
    yearlyKwh: '18.000 kWh',
    buildingType: 'Einfamilienhaus',
    savingsGoal: 'Bis zu 350€ Ersparnis/Jahr',
  });

  const [careboxData, setCareboxData] = useState({
    careLevel: 'Pflegegrad 2',
    insuredName: '',
    healthInsurance: 'AOK',
    disinfectionSurfaces: true,
    disinfectionHands: true,
    glovesSize: 'Größe M',
    bedProtectors: true,
    masks: true,
  });

  const [consentConfirmed, setConsentConfirmed] = useState(true);

  if (!isOpen) return null;

  const projectDefinitions: Record<ProjectKey, {
    title: string;
    badge: string;
    icon: any;
    desc: string;
    accent: string;
    bgBorder: string;
    productName: string;
    campaignName: string;
  }> = {
    solar: {
      title: 'Solar / Photovoltaik',
      badge: 'Dachanlagen & Speicher',
      icon: Sun,
      desc: 'Aufdachanlagen, Speicherbatterien und KfW-Förderung für Hauseigentümer',
      accent: 'text-amber-400',
      bgBorder: 'hover:border-amber-400 group-hover:text-amber-400',
      productName: 'Photovoltaik (10 kWp + Speicher)',
      campaignName: 'PV Deutschland 2026',
    },
    waermepumpe: {
      title: 'Wärmepumpe',
      badge: 'Heizungstausch & bis 70% KfW',
      icon: Flame,
      desc: 'Luft-Wasser- & Erdwärmepumpen als Ersatz für Gas- und Ölheizungen',
      accent: 'text-rose-400',
      bgBorder: 'hover:border-rose-400 group-hover:text-rose-400',
      productName: 'Wärmepumpe Luft-Wasser',
      campaignName: 'Wärmepumpe Deutschland',
    },
    treppenlift: {
      title: 'Treppenlift',
      badge: 'Bis zu 4.000€ Pflegekassenzuschuss',
      icon: Accessibility,
      desc: 'Gerade und kurvige Treppenlifte, Plattformlifte und barrierefreie Mobilität',
      accent: 'text-purple-400',
      bgBorder: 'hover:border-purple-400 group-hover:text-purple-400',
      productName: 'Treppenlift Kurve & Gerade',
      campaignName: 'Barrierefrei Nord/Süd',
    },
    strom: {
      title: 'Stromtarif-Wechsel',
      badge: 'Bis zu 350€ Ersparnis/Jahr',
      icon: Zap,
      desc: 'Günstiger Ökostrom, Bonusschutz und automatische Preisgarantie',
      accent: 'text-yellow-400',
      bgBorder: 'hover:border-yellow-400 group-hover:text-yellow-400',
      productName: 'Stromtarif-Optimierung',
      campaignName: 'Strom & Energie 2026',
    },
    gas: {
      title: 'Gastarif-Wechsel',
      badge: 'Heizkostenoptimierung',
      icon: Fuel,
      desc: 'Senkung der monatlichen Gasabschläge für Haus- und Wohnungsbesitzer',
      accent: 'text-blue-400',
      bgBorder: 'hover:border-blue-400 group-hover:text-blue-400',
      productName: 'Gaskostensenkung',
      campaignName: 'Gas & Wärme 2026',
    },
    pflegebox: {
      title: 'Pflegebox (§ 40 SGB XI)',
      badge: 'Bis zu 40€ monatlich GRATIS',
      icon: Package,
      desc: 'Kostenlose Pflegehilfsmittel zum Verbrauch, 100% bezahlt von der Pflegekasse',
      accent: 'text-emerald-400',
      bgBorder: 'hover:border-emerald-400 group-hover:text-emerald-400',
      productName: 'Pflegebox §40 SGB XI (Kostenlos)',
      campaignName: 'Pflegebox Direkt 2026',
    },
  };

  const handleCompleteSubmit = () => {
    if (!contact.firstName || !contact.phone) {
      alert('Bitte füllen Sie mindestens Vorname und Telefonnummer aus.');
      return;
    }

    let extraData = {};
    if (selectedProject === 'solar') extraData = solarData;
    if (selectedProject === 'waermepumpe') extraData = heatPumpData;
    if (selectedProject === 'treppenlift') extraData = stairliftData;
    if (selectedProject === 'strom') extraData = electricityData;
    if (selectedProject === 'gas') extraData = gasData;
    if (selectedProject === 'pflegebox') extraData = careboxData;

    const projInfo = projectDefinitions[selectedProject];

    const newLeadData: Partial<LeadItem> = {
      firstName: contact.firstName,
      lastName: contact.lastName,
      phone: contact.phone.startsWith('+') ? contact.phone : `+49 ${contact.phone.replace(/^0/, '')}`,
      phoneNormalized: contact.phone.replace(/\D/g, '').replace(/^0/, '49'),
      email: contact.email,
      city: contact.city || 'Berlin',
      postalCode: contact.postalCode || '10115',
      street: contact.street,
      product: projInfo.productName,
      projectType: selectedProject,
      campaignName: projInfo.campaignName,
      extraData,
      source: `Projekt-Tool (${projInfo.title})`,
      priority: 1,
    };

    addLead(newLeadData);

    const generatedLead: LeadItem = {
      id: `lead-${Date.now()}`,
      firstName: contact.firstName,
      lastName: contact.lastName,
      phone: newLeadData.phone!,
      phoneNormalized: newLeadData.phoneNormalized!,
      email: contact.email,
      city: contact.city || 'Berlin',
      postalCode: contact.postalCode || '10115',
      street: contact.street,
      product: projInfo.productName,
      projectType: selectedProject,
      source: `Projekt-Tool (${projInfo.title})`,
      status: 'new',
      priority: 1,
      attempts: 0,
      maxAttempts: 5,
      campaignName: projInfo.campaignName,
      providerName: 'Manuell eingetragen',
      createdAt: 'Gerade eben',
      consent: {
        given: true,
        timestamp: new Date().toISOString(),
        sourceUrl: 'https://portal.vertriebshub.de/lead-tool',
        ip: '127.0.0.1',
        textVersion: 'v2.4_GDPR_DE',
        namedPartners: ['VertriebsHub GmbH', projInfo.title],
      },
      notes: [{ id: '1', author: 'Agent / Erfasser', content: `Kunde für ${projInfo.title} eingetragen.`, createdAt: 'Heute' }],
      history: [{ id: '1', from: 'none', to: 'new', user: 'Projekt-Tool', note: 'Lead aufgenommen', createdAt: 'Jetzt' }],
      extraData,
    };

    setCreatedLead(generatedLead);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-300 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-dark-900 border border-gold-500/40 rounded-3xl shadow-2xl shadow-gold-500/20 overflow-hidden flex flex-col my-8 max-h-[92vh] animate-in zoom-in-95 duration-300">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-5 bg-dark-850 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gold-metallic flex items-center justify-center text-dark-950 font-black text-lg shadow-gold-sm">
              <Sparkles size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-gray-100">
                  Lead-Erfassungs-Tool
                </h2>
                <span className="text-[10px] uppercase font-mono font-bold px-2.5 py-0.5 rounded-full bg-gold-500/15 text-gold-300 border border-gold-500/30">
                  6 Kern-Projekte (DE)
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Wählen Sie das Projekt (Solar, Wärmepumpe, Treppenlift, Strom, Gas, Pflegebox) und qualifizieren Sie den Kunden rechtssicher.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCompactMode(!compactMode)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                compactMode
                  ? 'bg-gradient-to-r from-gold-500 to-amber-500 text-dark-950 border-gold-400 shadow-gold-sm scale-105'
                  : 'bg-dark-800 text-gray-300 border-white/[0.08] hover:border-gold-500/40 hover:text-white'
              }`}
            >
              <Sparkles size={12} className={compactMode ? 'text-dark-950' : 'text-gold-400'} />
              <span>{compactMode ? '✓ Kompaktmodus' : 'Kompaktmodus'}</span>
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-100 hover:bg-dark-800 transition-colors"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Wizard Steps Indicator (1 to 4) */}
        {!createdLead && !compactMode && (
          <div className="flex items-center justify-between px-8 py-3 bg-dark-950/70 border-b border-white/[0.06] text-xs font-semibold">
            {[
              { num: 1, label: '1. Projekt wählen' },
              { num: 2, label: '2. Kundendaten' },
              { num: 3, label: '3. Fach-Qualifizierung' },
              { num: 4, label: '4. Bestätigung & DSGVO' },
            ].map((s) => (
              <div
                key={s.num}
                className={`flex items-center gap-2 ${
                  step === s.num
                    ? 'text-gold-400 font-bold'
                    : step > s.num
                    ? 'text-emerald-400'
                    : 'text-gray-500'
                }`}
              >
                <div
                  className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                    step === s.num
                      ? 'bg-gold-500 text-dark-950 shadow-gold-sm'
                      : step > s.num
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-dark-800 text-gray-500'
                  }`}
                >
                  {step > s.num ? <Check size={12} /> : s.num}
                </div>
                <span className="hidden sm:inline">{s.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Wizard Content Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          {/* SUCCESS SCREEN */}
          {createdLead ? (
            <div className="text-center py-8 space-y-6 animate-in zoom-in-95">
              <div className="h-16 w-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <CheckCircle2 size={36} />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black text-gray-100">
                  Kunde erfolgreich für {projectDefinitions[selectedProject].title} eingetragen!
                </h3>
                <p className="text-xs text-gray-400 max-w-md mx-auto">
                  Der Datensatz wurde mit vollständigem DSGVO-Einwilligungsnachweis im System hinterlegt und ist sofort wählbar.
                </p>
              </div>

              {/* Summary Card */}
              <div className="max-w-md mx-auto p-5 rounded-2xl bg-dark-850 border border-gold-500/30 text-left text-xs space-y-2 font-mono">
                <div className="flex justify-between text-gray-300">
                  <span className="text-gray-500">Name:</span>
                  <span className="font-bold text-gray-100">{createdLead.firstName} {createdLead.lastName}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span className="text-gray-500">Telefon:</span>
                  <span className="text-gold-400 font-bold">{createdLead.phone}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span className="text-gray-500">Ort:</span>
                  <span>{createdLead.postalCode} {createdLead.city}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span className="text-gray-500">Projekt:</span>
                  <span className="text-emerald-400 font-bold">{createdLead.product}</span>
                </div>
                <div className="flex justify-between items-center text-gray-300 pt-2 border-t border-white/[0.08]">
                  <span className="text-gray-500">Vertriebspartner API:</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 size={13} />
                    <span>Direkt übermittelt</span>
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                <Button
                  onClick={() => {
                    startCall(createdLead);
                    if (onClose) onClose();
                  }}
                  className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-extrabold px-6 py-3.5 rounded-xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2"
                >
                  <Phone size={16} />
                  <span>Diesen Kunden jetzt sofort anrufen</span>
                </Button>

                <Button
                  variant="secondary"
                  onClick={() => {
                    setCreatedLead(null);
                    setStep(1);
                    setContact({ salutation: 'Herr', firstName: '', lastName: '', phone: '', email: '', postalCode: '', city: '', street: '' });
                  }}
                  className="w-full sm:w-auto px-5 py-3.5 rounded-xl"
                >
                  Weiteren Kunden eintragen
                </Button>

                <Button
                  variant="ghost"
                  onClick={() => {
                    if (onClose) onClose();
                    router.push('/leads');
                  }}
                  className="w-full sm:w-auto text-gold-400"
                >
                  Zur Leadliste
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* STEP 1: PROJECT SELECTION */}
              {(compactMode || step === 1) && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-extrabold text-gray-100 flex items-center gap-2">
                      <Sparkles size={16} className="text-gold-500" />
                      <span>Schritt 1: Für welches Projekt soll der Kunde aufgenommen werden?</span>
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      Klicken Sie auf eines der 6 aktiven Themengebiete im deutschen Markt:
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {(Object.keys(projectDefinitions) as ProjectKey[]).map((pKey) => {
                      const proj = projectDefinitions[pKey];
                      const isSelected = selectedProject === pKey;
                      const IconComp = proj.icon;

                      return (
                        <div
                          key={pKey}
                          onClick={() => setSelectedProject(pKey)}
                          className={`group cursor-pointer rounded-2xl p-5 border transition-all duration-300 relative flex flex-col justify-between space-y-4 ${
                            isSelected
                              ? 'bg-dark-850 border-gold-500 shadow-gold-md shadow-gold-500/10'
                              : 'bg-dark-900 border-white/[0.08] hover:border-gold-500/40 hover:bg-dark-850'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className={`p-3 rounded-2xl border transition-all ${
                              isSelected
                                ? 'bg-gold-metallic text-dark-950 shadow-gold-sm border-transparent'
                                : 'bg-dark-800 border-white/[0.06] text-gray-300 group-hover:text-gold-400 group-hover:border-gold-500/40'
                            }`}>
                              <IconComp size={24} />
                            </div>

                            <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                              isSelected
                                ? 'bg-gold-500/20 text-gold-300 border-gold-500/40'
                                : 'bg-dark-800 text-gray-400 border-white/[0.04]'
                            }`}>
                              {proj.badge}
                            </span>
                          </div>

                          <div>
                            <h4 className="font-extrabold text-base text-gray-100 group-hover:text-gold-300 transition-colors">
                              {proj.title}
                            </h4>
                            <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                              {proj.desc}
                            </p>
                          </div>

                          <div className="pt-2 flex items-center justify-between text-xs font-bold border-t border-white/[0.04]">
                            <span className={isSelected ? 'text-gold-400' : 'text-gray-500'}>
                              {isSelected ? '✓ Ausgewählt' : 'Auswählen'}
                            </span>
                            <div className={`h-6 w-6 rounded-full flex items-center justify-center ${
                              isSelected ? 'bg-gold-500 text-dark-950 font-bold' : 'bg-dark-800 text-gray-500'
                            }`}>
                              <ArrowRight size={12} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 2: CONTACT INFORMATION */}
              {(compactMode || step === 2) && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                    <div>
                      <h3 className="text-base font-extrabold text-gray-100 flex items-center gap-2">
                        <User size={16} className="text-gold-500" />
                        <span>Schritt 2: Kontaktdaten des Kunden ({projectDefinitions[selectedProject].title})</span>
                      </h3>
                      <p className="text-xs text-gray-400 mt-0.5">Erfassen Sie Name, Telefon und Wohnort in Deutschland</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-gold-400 bg-gold-500/10 px-3 py-1 rounded-xl border border-gold-500/30">
                      Projekt: {projectDefinitions[selectedProject].title}
                    </span>
                  </div>

                  <div className="space-y-4">
                    {/* Salutation */}
                    <div>
                      <label className="text-xs font-semibold text-gray-300 block mb-1">Anrede:</label>
                      <div className="flex gap-3">
                        {['Herr', 'Frau', 'Familie'].map((sal) => (
                          <button
                            key={sal}
                            type="button"
                            onClick={() => setContact({ ...contact, salutation: sal })}
                            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                              contact.salutation === sal
                                ? 'bg-gold-500 text-dark-950 border-gold-500 shadow-gold-sm'
                                : 'bg-dark-850 text-gray-400 border-white/[0.08] hover:bg-dark-800'
                            }`}
                          >
                            {sal}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Name */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-gray-300 block mb-1">Vorname *:</label>
                        <input
                          type="text"
                          required
                          value={contact.firstName}
                          onChange={(e) => setContact({ ...contact, firstName: e.target.value })}
                          placeholder="z. B. Klaus"
                          className="w-full bg-dark-850 border border-white/[0.08] rounded-xl p-3 text-xs text-gray-100 focus:border-gold-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-300 block mb-1">Nachname *:</label>
                        <input
                          type="text"
                          required
                          value={contact.lastName}
                          onChange={(e) => setContact({ ...contact, lastName: e.target.value })}
                          placeholder="z. B. Weber"
                          className="w-full bg-dark-850 border border-white/[0.08] rounded-xl p-3 text-xs text-gray-100 focus:border-gold-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Phone & Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-gray-300 block mb-1">
                          Telefonnummer (E.164 Mobil/Festnetz DE) *:
                        </label>
                        <input
                          type="text"
                          required
                          value={contact.phone}
                          onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                          placeholder="z. B. 0176 12345678 oder +49176..."
                          className="w-full bg-dark-850 border border-white/[0.08] rounded-xl p-3 text-xs text-gray-100 font-mono focus:border-gold-500 focus:outline-none"
                        />
                        <span className="text-[10px] text-gray-500 mt-1 block">Wird automatisch in deutsches Standardformat normalisiert.</span>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-300 block mb-1">E-Mail-Adresse (Optional):</label>
                        <input
                          type="email"
                          value={contact.email}
                          onChange={(e) => setContact({ ...contact, email: e.target.value })}
                          placeholder="klaus.weber@t-online.de"
                          className="w-full bg-dark-850 border border-white/[0.08] rounded-xl p-3 text-xs text-gray-100 focus:border-gold-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Address: Postal code, City, Street */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-gray-300 block mb-1">PLZ (Postleitzahl) *:</label>
                        <input
                          type="text"
                          required
                          value={contact.postalCode}
                          onChange={(e) => setContact({ ...contact, postalCode: e.target.value })}
                          placeholder="50667"
                          className="w-full bg-dark-850 border border-white/[0.08] rounded-xl p-3 text-xs text-gray-100 font-mono focus:border-gold-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-300 block mb-1">Ort / Stadt *:</label>
                        <input
                          type="text"
                          required
                          value={contact.city}
                          onChange={(e) => setContact({ ...contact, city: e.target.value })}
                          placeholder="Köln"
                          className="w-full bg-dark-850 border border-white/[0.08] rounded-xl p-3 text-xs text-gray-100 focus:border-gold-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-300 block mb-1">Straße & Nr.:</label>
                        <input
                          type="text"
                          value={contact.street}
                          onChange={(e) => setContact({ ...contact, street: e.target.value })}
                          placeholder="Hauptstraße 14"
                          className="w-full bg-dark-850 border border-white/[0.08] rounded-xl p-3 text-xs text-gray-100 focus:border-gold-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: PROJECT-SPECIFIC QUALIFICATION FORM */}
              {(compactMode || step === 3) && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                    <div>
                      <h3 className="text-base font-extrabold text-gray-100 flex items-center gap-2">
                        <FileText size={16} className="text-gold-500" />
                        <span>Schritt 3: Fachliche Qualifizierung für {projectDefinitions[selectedProject].title}</span>
                      </h3>
                      <p className="text-xs text-gray-400 mt-0.5">Fragenkatalog für dieses spezifische Produkt ausfüllen</p>
                    </div>
                  </div>

                  {/* 1. SOLAR FORM */}
                  {selectedProject === 'solar' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="text-gray-300 font-semibold block mb-1">Immobilieneigentümer (Voraussetzung) *:</label>
                        <select
                          value={solarData.isOwner}
                          onChange={(e) => setSolarData({ ...solarData, isOwner: e.target.value })}
                          className="w-full bg-dark-850 border border-white/[0.08] rounded-xl p-3 text-gray-100 focus:border-gold-500 focus:outline-none"
                        >
                          <option value="Ja">Ja, Alleineigentümer / Miteigentümer</option>
                          <option value="Nein">Nein, Mieter (Nicht qualifiziert)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-gray-300 font-semibold block mb-1">Dachform:</label>
                        <select
                          value={solarData.roofType}
                          onChange={(e) => setSolarData({ ...solarData, roofType: e.target.value })}
                          className="w-full bg-dark-850 border border-white/[0.08] rounded-xl p-3 text-gray-100 focus:border-gold-500 focus:outline-none"
                        >
                          <option value="Satteldach">Satteldach</option>
                          <option value="Flachdach">Flachdach</option>
                          <option value="Pultdach">Pultdach</option>
                          <option value="Walmdach">Walmdach</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-gray-300 font-semibold block mb-1">Dachausrichtung:</label>
                        <select
                          value={solarData.roofOrientation}
                          onChange={(e) => setSolarData({ ...solarData, roofOrientation: e.target.value })}
                          className="w-full bg-dark-850 border border-white/[0.08] rounded-xl p-3 text-gray-100 focus:border-gold-500 focus:outline-none"
                        >
                          <option value="Südausrichtung">Südausrichtung (Optimal)</option>
                          <option value="Ost-West-Ausrichtung">Ost-West-Ausrichtung</option>
                          <option value="Südwest / Südost">Südwest / Südost</option>
                          <option value="Nordseite">Nordseite</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-gray-300 font-semibold block mb-1">Jährlicher Stromverbrauch (ca.):</label>
                        <input
                          type="text"
                          value={solarData.yearlyConsumption}
                          onChange={(e) => setSolarData({ ...solarData, yearlyConsumption: e.target.value })}
                          placeholder="z. B. 4.500 kWh"
                          className="w-full bg-dark-850 border border-white/[0.08] rounded-xl p-3 text-gray-100 focus:border-gold-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-gray-300 font-semibold block mb-1">Batteriespeicher erwünscht?</label>
                        <select
                          value={solarData.storageWanted}
                          onChange={(e) => setSolarData({ ...solarData, storageWanted: e.target.value })}
                          className="w-full bg-dark-850 border border-white/[0.08] rounded-xl p-3 text-gray-100 focus:border-gold-500 focus:outline-none"
                        >
                          <option value="Ja">Ja, Speicher erwünscht (8-10 kWh)</option>
                          <option value="Nein">Nein, nur Einspeisung</option>
                          <option value="Beratung">Beratung im Termin gewünscht</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-gray-300 font-semibold block mb-1">Wallbox / E-Auto vorhanden?</label>
                        <select
                          value={solarData.wallboxWanted}
                          onChange={(e) => setSolarData({ ...solarData, wallboxWanted: e.target.value })}
                          className="w-full bg-dark-850 border border-white/[0.08] rounded-xl p-3 text-gray-100 focus:border-gold-500 focus:outline-none"
                        >
                          <option value="Ja">Ja, Wallbox gewünscht / E-Auto vorhanden</option>
                          <option value="Später">In Zukunft geplant</option>
                          <option value="Nein">Nein</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* 2. WÄRMEPUMPE FORM */}
                  {selectedProject === 'waermepumpe' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="text-gray-300 font-semibold block mb-1">Aktuelles Heizsystem:</label>
                        <select
                          value={heatPumpData.currentHeating}
                          onChange={(e) => setHeatPumpData({ ...heatPumpData, currentHeating: e.target.value })}
                          className="w-full bg-dark-850 border border-white/[0.08] rounded-xl p-3 text-gray-100 focus:border-gold-500 focus:outline-none"
                        >
                          <option value="Gasheizung">Gasheizung</option>
                          <option value="Ölheizung">Ölheizung (Hohe Austauschprämie)</option>
                          <option value="Nachtspeicher / Strom">Nachtspeicher / Strom</option>
                          <option value="Pellet / Holz">Pellet- oder Holzheizung</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-gray-300 font-semibold block mb-1">Alter der aktuellen Heizung:</label>
                        <select
                          value={heatPumpData.heatingAge}
                          onChange={(e) => setHeatPumpData({ ...heatPumpData, heatingAge: e.target.value })}
                          className="w-full bg-dark-850 border border-white/[0.08] rounded-xl p-3 text-gray-100 focus:border-gold-500 focus:outline-none"
                        >
                          <option value="Über 20 Jahre">Über 20 Jahre alt</option>
                          <option value="16-20 Jahre">16 bis 20 Jahre alt</option>
                          <option value="10-15 Jahre">10 bis 15 Jahre alt</option>
                          <option value="Unter 10 Jahre">Unter 10 Jahre alt</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-gray-300 font-semibold block mb-1">Beheizte Wohnfläche (ca.):</label>
                        <input
                          type="text"
                          value={heatPumpData.livingSpace}
                          onChange={(e) => setHeatPumpData({ ...heatPumpData, livingSpace: e.target.value })}
                          placeholder="z. B. 150 m²"
                          className="w-full bg-dark-850 border border-white/[0.08] rounded-xl p-3 text-gray-100 focus:border-gold-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-gray-300 font-semibold block mb-1">Vorhandene Heizkörper:</label>
                        <select
                          value={heatPumpData.radiatorType}
                          onChange={(e) => setHeatPumpData({ ...heatPumpData, radiatorType: e.target.value })}
                          className="w-full bg-dark-850 border border-white/[0.08] rounded-xl p-3 text-gray-100 focus:border-gold-500 focus:outline-none"
                        >
                          <option value="Fußbodenheizung">Reine Fußbodenheizung</option>
                          <option value="Standard-Heizkörper">Standard-Heizkörper (Radiatoren)</option>
                          <option value="Mischform (FBH + Heizkörper)">Mischform (FBH + Heizkörper)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-gray-300 font-semibold block mb-1">Dämmzustand des Hauses:</label>
                        <select
                          value={heatPumpData.insulation}
                          onChange={(e) => setHeatPumpData({ ...heatPumpData, insulation: e.target.value })}
                          className="w-full bg-dark-850 border border-white/[0.08] rounded-xl p-3 text-gray-100 focus:border-gold-500 focus:outline-none"
                        >
                          <option value="Gut gedämmt (Neubau / KFW)">Gut gedämmt (Neubau / KfW-Standard)</option>
                          <option value="Teilsaniert (Fenster/Dach neu)">Teilsaniert (Fenster oder Dach erneuert)</option>
                          <option value="Altbau unsaniert">Altbau unsaniert</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* 3. TREPPENLIFT FORM */}
                  {selectedProject === 'treppenlift' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="text-gray-300 font-semibold block mb-1">Treppenverlauf:</label>
                        <select
                          value={stairliftData.stairType}
                          onChange={(e) => setStairliftData({ ...stairliftData, stairType: e.target.value })}
                          className="w-full bg-dark-850 border border-white/[0.08] rounded-xl p-3 text-gray-100 focus:border-gold-500 focus:outline-none"
                        >
                          <option value="Gerade Treppe">Gerade Treppe</option>
                          <option value="Kurvige Treppe (über 1 Etage)">Kurvige Treppe (über 1 Etage)</option>
                          <option value="Wendeltreppe / Mehrere Etagen">Wendeltreppe / Mehrere Etagen</option>
                          <option value="Außentreppe">Außentreppe (Garten/Eingang)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-gray-300 font-semibold block mb-1">Pflegegrad vorhanden (Krankenkassen-Zuschuss) *:</label>
                        <select
                          value={stairliftData.careLevel}
                          onChange={(e) => setStairliftData({ ...stairliftData, careLevel: e.target.value })}
                          className="w-full bg-dark-850 border border-white/[0.08] rounded-xl p-3 text-gray-100 font-bold focus:border-gold-500 focus:outline-none"
                        >
                          <option value="Pflegegrad 1 (bis 4.000€ Zuschuss)">Pflegegrad 1 (Bis 4.000€ Zuschuss)</option>
                          <option value="Pflegegrad 2 (bis 4.000€ Zuschuss)">Pflegegrad 2 (Bis 4.000€ Zuschuss)</option>
                          <option value="Pflegegrad 3 (bis 4.000€ Zuschuss)">Pflegegrad 3 (Bis 4.000€ Zuschuss)</option>
                          <option value="Pflegegrad 4 oder 5">Pflegegrad 4 oder 5</option>
                          <option value="Pflegegrad beantragt">Pflegegrad aktuell beantragt</option>
                          <option value="Kein Pflegegrad">Kein Pflegegrad (Selbstzahler)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-gray-300 font-semibold block mb-1">Einsatzbereich:</label>
                        <select
                          value={stairliftData.environment}
                          onChange={(e) => setStairliftData({ ...stairliftData, environment: e.target.value })}
                          className="w-full bg-dark-850 border border-white/[0.08] rounded-xl p-3 text-gray-100 focus:border-gold-500 focus:outline-none"
                        >
                          <option value="Innenbereich">Innenbereich</option>
                          <option value="Außenbereich">Außenbereich (Witterungsbeständig)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-gray-300 font-semibold block mb-1">Dringlichkeit:</label>
                        <select
                          value={stairliftData.urgency}
                          onChange={(e) => setStairliftData({ ...stairliftData, urgency: e.target.value })}
                          className="w-full bg-dark-850 border border-white/[0.08] rounded-xl p-3 text-gray-100 focus:border-gold-500 focus:outline-none"
                        >
                          <option value="Schnellstmöglich (innerhalb 2 Wochen)">Schnellstmöglich (innerhalb 2 Wochen)</option>
                          <option value="In 1-2 Monaten">In 1-2 Monaten</option>
                          <option value="Reine Information">Reine Information / Preisvergleich</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* 4. STROM FORM */}
                  {selectedProject === 'strom' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="text-gray-300 font-semibold block mb-1">Aktueller Stromanbieter:</label>
                        <input
                          type="text"
                          value={electricityData.currentProvider}
                          onChange={(e) => setElectricityData({ ...electricityData, currentProvider: e.target.value })}
                          placeholder="z. B. Vattenfall, E.ON, Stadtwerke"
                          className="w-full bg-dark-850 border border-white/[0.08] rounded-xl p-3 text-gray-100 focus:border-gold-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-gray-300 font-semibold block mb-1">Geschätzter Jahresverbrauch (kWh):</label>
                        <input
                          type="text"
                          value={electricityData.yearlyKwh}
                          onChange={(e) => setElectricityData({ ...electricityData, yearlyKwh: e.target.value })}
                          placeholder="z. B. 3.500 kWh (3-Personen-Haushalt)"
                          className="w-full bg-dark-850 border border-white/[0.08] rounded-xl p-3 text-gray-100 focus:border-gold-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-gray-300 font-semibold block mb-1">Stromzählernummer (falls griffbereit):</label>
                        <input
                          type="text"
                          value={electricityData.meterNumber}
                          onChange={(e) => setElectricityData({ ...electricityData, meterNumber: e.target.value })}
                          placeholder="z. B. 1EMH0012345678"
                          className="w-full bg-dark-850 border border-white/[0.08] rounded-xl p-3 text-gray-100 font-mono focus:border-gold-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-gray-300 font-semibold block mb-1">Kundenwunsch / Tarifart:</label>
                        <select
                          value={electricityData.preference}
                          onChange={(e) => setElectricityData({ ...electricityData, preference: e.target.value })}
                          className="w-full bg-dark-850 border border-white/[0.08] rounded-xl p-3 text-gray-100 focus:border-gold-500 focus:outline-none"
                        >
                          <option value="Günstigster Ökostrom mit Preisgarantie">Günstigster Ökostrom mit 12 Mon. Preisgarantie</option>
                          <option value="Maximaler Wechselbonus">Maximaler Sofortbonus</option>
                          <option value="Monatlich kündbar (Flex)">Monatlich kündbar (Flex)</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* 5. GAS FORM */}
                  {selectedProject === 'gas' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="text-gray-300 font-semibold block mb-1">Aktueller Gasanbieter:</label>
                        <input
                          type="text"
                          value={gasData.currentProvider}
                          onChange={(e) => setGasData({ ...gasData, currentProvider: e.target.value })}
                          placeholder="z. B. Grundversorger / E.ON"
                          className="w-full bg-dark-850 border border-white/[0.08] rounded-xl p-3 text-gray-100 focus:border-gold-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-gray-300 font-semibold block mb-1">Jahresverbrauch Gas (kWh oder m³):</label>
                        <input
                          type="text"
                          value={gasData.yearlyKwh}
                          onChange={(e) => setGasData({ ...gasData, yearlyKwh: e.target.value })}
                          placeholder="z. B. 20.000 kWh / Jahr"
                          className="w-full bg-dark-850 border border-white/[0.08] rounded-xl p-3 text-gray-100 focus:border-gold-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-gray-300 font-semibold block mb-1">Gebäudeart:</label>
                        <select
                          value={gasData.buildingType}
                          onChange={(e) => setGasData({ ...gasData, buildingType: e.target.value })}
                          className="w-full bg-dark-850 border border-white/[0.08] rounded-xl p-3 text-gray-100 focus:border-gold-500 focus:outline-none"
                        >
                          <option value="Einfamilienhaus">Einfamilienhaus</option>
                          <option value="Doppelhaushälfte / Reihenhaus">Doppelhaushälfte / Reihenhaus</option>
                          <option value="Eigentumswohnung">Eigentumswohnung</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-gray-300 font-semibold block mb-1">Erwartetes Sparpotenzial:</label>
                        <input
                          type="text"
                          value={gasData.savingsGoal}
                          onChange={(e) => setGasData({ ...gasData, savingsGoal: e.target.value })}
                          className="w-full bg-dark-850 border border-white/[0.08] rounded-xl p-3 text-gray-100 focus:border-gold-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* 6. PFLEGEBOX FORM (§40 SGB XI bis 40€/Monat gratis) */}
                  {selectedProject === 'pflegebox' && (
                    <div className="space-y-4 text-xs">
                      <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-start gap-2.5">
                        <Package size={20} className="shrink-0 mt-0.5" />
                        <div>
                          <strong className="block">Gesetzlicher Anspruch nach § 40 Abs. 2 SGB XI:</strong>
                          <span>Jede Person mit anerkanntem Pflegegrad (1-5) hat Anspruch auf kostenlose Pflegehilfsmittel im Wert von bis zu 40,00 € pro Monat. Die Abrechnung erfolgt direkt mit der Pflegekasse.</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="text-gray-300 font-semibold block mb-1">Pflegegrad (1-5) *:</label>
                          <select
                            value={careboxData.careLevel}
                            onChange={(e) => setCareboxData({ ...careboxData, careLevel: e.target.value })}
                            className="w-full bg-dark-850 border border-white/[0.08] rounded-xl p-3 text-gray-100 font-bold focus:border-gold-500 focus:outline-none"
                          >
                            <option value="Pflegegrad 1">Pflegegrad 1</option>
                            <option value="Pflegegrad 2">Pflegegrad 2</option>
                            <option value="Pflegegrad 3">Pflegegrad 3</option>
                            <option value="Pflegegrad 4">Pflegegrad 4</option>
                            <option value="Pflegegrad 5">Pflegegrad 5</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-gray-300 font-semibold block mb-1">Name der pflegebedürftigen Person:</label>
                          <input
                            type="text"
                            value={careboxData.insuredName}
                            onChange={(e) => setCareboxData({ ...careboxData, insuredName: e.target.value })}
                            placeholder="Falls abweichend vom Anrufer"
                            className="w-full bg-dark-850 border border-white/[0.08] rounded-xl p-3 text-gray-100 focus:border-gold-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-gray-300 font-semibold block mb-1">Pflegekasse / Krankenkasse:</label>
                          <select
                            value={careboxData.healthInsurance}
                            onChange={(e) => setCareboxData({ ...careboxData, healthInsurance: e.target.value })}
                            className="w-full bg-dark-850 border border-white/[0.08] rounded-xl p-3 text-gray-100 focus:border-gold-500 focus:outline-none"
                          >
                            <option value="AOK">AOK</option>
                            <option value="Barmer">Barmer</option>
                            <option value="Techniker Krankenkasse (TK)">Techniker Krankenkasse (TK)</option>
                            <option value="DAK Gesundheit">DAK Gesundheit</option>
                            <option value="IKK classic">IKK classic</option>
                            <option value="Knappschaft">Knappschaft</option>
                            <option value="Private Pflegekasse">Private Pflegekasse</option>
                          </select>
                        </div>
                      </div>

                      {/* Box Content Customizer */}
                      <div className="bg-dark-850 p-4 rounded-2xl border border-white/[0.06] space-y-3">
                        <span className="font-bold text-gray-200 block">Gewünschte Produkte in der monatlichen Gratis-Pflegebox:</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-dark-900 border border-white/[0.04] cursor-pointer">
                            <input
                              type="checkbox"
                              checked={careboxData.disinfectionSurfaces}
                              onChange={(e) => setCareboxData({ ...careboxData, disinfectionSurfaces: e.target.checked })}
                              className="rounded text-gold-500 bg-dark-800"
                            />
                            <span>Flächendesinfektionsmittel (500 ml)</span>
                          </label>

                          <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-dark-900 border border-white/[0.04] cursor-pointer">
                            <input
                              type="checkbox"
                              checked={careboxData.disinfectionHands}
                              onChange={(e) => setCareboxData({ ...careboxData, disinfectionHands: e.target.checked })}
                              className="rounded text-gold-500 bg-dark-800"
                            />
                            <span>Händedesinfektionsmittel (500 ml)</span>
                          </label>

                          <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-dark-900 border border-white/[0.04] cursor-pointer">
                            <input
                              type="checkbox"
                              checked={careboxData.bedProtectors}
                              onChange={(e) => setCareboxData({ ...careboxData, bedProtectors: e.target.checked })}
                              className="rounded text-gold-500 bg-dark-800"
                            />
                            <span>Saugende Bettschutzeinlagen (Einweg)</span>
                          </label>

                          <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-dark-900 border border-white/[0.04] cursor-pointer">
                            <input
                              type="checkbox"
                              checked={careboxData.masks}
                              onChange={(e) => setCareboxData({ ...careboxData, masks: e.target.checked })}
                              className="rounded text-gold-500 bg-dark-800"
                            />
                            <span>Mundschutz / Schutzmasken (OP & FFP2)</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 4: DSGVO CONSENT & FINAL CONFIRMATION */}
              {(compactMode || step === 4) && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                    <div>
                      <h3 className="text-base font-extrabold text-gray-100 flex items-center gap-2">
                        <ShieldCheck size={18} className="text-emerald-400" />
                        <span>Schritt 4: Rechtssicherer Abschluss & DSGVO-Opt-in</span>
                      </h3>
                      <p className="text-xs text-gray-400 mt-0.5">Dokumentation der Werbeeinwilligung für den deutschen Markt</p>
                    </div>
                  </div>

                  {/* Summary Preview */}
                  <div className="p-4 rounded-2xl bg-dark-850 border border-gold-500/30 space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-200">Zusammenfassung der Eintragung:</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gold-500/20 text-gold-300 font-mono">
                        {projectDefinitions[selectedProject].title}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-gray-300">
                      <div><strong className="text-gray-400">Kunde:</strong> {contact.salutation} {contact.firstName} {contact.lastName}</div>
                      <div><strong className="text-gray-400">Telefon:</strong> <span className="font-mono text-gold-400">{contact.phone}</span></div>
                      <div><strong className="text-gray-400">Standort:</strong> {contact.postalCode} {contact.city} {contact.street && `(${contact.street})`}</div>
                      <div><strong className="text-gray-400">E-Mail:</strong> {contact.email || 'Nicht angegeben'}</div>
                    </div>
                  </div>

                  {/* DSGVO Compliance Gate */}
                  <div className="p-4 rounded-2xl bg-dark-850 border border-emerald-500/40 space-y-3 text-xs">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold">
                      <ShieldCheck size={18} />
                      <span>Einwilligung nach § 7 Abs. 2 Nr. 2 UWG (Opt-in)</span>
                    </div>

                    <p className="text-gray-300 leading-relaxed text-[11px]">
                      "Hiermit wird bestätigt, dass der Verbraucher im Rahmen des Erstkontakts der Kontaktaufnahme durch Fachpartner der VertriebsHub Plattform für das Projekt <strong>{projectDefinitions[selectedProject].title}</strong> ausdrücklich zugestimmt hat."
                    </p>

                    <label className="flex items-center gap-3 p-3 rounded-xl bg-dark-900 border border-white/[0.06] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={consentConfirmed}
                        onChange={(e) => setConsentConfirmed(e.target.checked)}
                        className="h-4 w-4 rounded bg-dark-850 border-white/[0.08] text-gold-500 focus:ring-0"
                      />
                      <span className="font-bold text-gray-100">
                        Ja, der Kunde hat die Werbeeinwilligung telefonisch erteilt (Audioaufnahme protokolliert).
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* Wizard Footer Controls */}
              {compactMode ? (
                <div className="flex items-center justify-end pt-4 border-t border-white/[0.06]">
                  <Button
                    onClick={handleCompleteSubmit}
                    disabled={!consentConfirmed}
                    className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:brightness-110 text-white font-extrabold px-8 py-3.5 rounded-xl shadow-lg shadow-emerald-600/30 flex items-center gap-2"
                  >
                    <Check size={16} />
                    <span>Kunde verbindlich im System anlegen</span>
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
                  {step > 1 ? (
                    <Button
                      variant="secondary"
                      onClick={() => setStep((step - 1) as any)}
                      className="flex items-center gap-2"
                    >
                      <ArrowLeft size={14} />
                      <span>Zurück</span>
                    </Button>
                  ) : (
                    <div />
                  )}

                  {step < 4 ? (
                    <Button
                      onClick={() => {
                        if (step === 2 && (!contact.firstName || !contact.phone)) {
                          alert('Bitte mindestens Vorname und Telefonnummer eingeben.');
                          return;
                        }
                        setStep((step + 1) as any);
                      }}
                      className="gold-button-gradient text-dark-950 font-black flex items-center gap-2 px-6"
                    >
                      <span>Weiter zu Schritt {step + 1}</span>
                      <ArrowRight size={14} />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleCompleteSubmit}
                      disabled={!consentConfirmed}
                      className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:brightness-110 text-white font-extrabold px-8 py-3.5 rounded-xl shadow-lg shadow-emerald-600/30 flex items-center gap-2"
                    >
                      <Check size={16} />
                      <span>Kunde verbindlich im System anlegen</span>
                    </Button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
