# VertriebsHub

Mandantenfähiges Lead-Verteilungs- und Dialer-Portal für den deutschen Markt.

```
Lead-Anbieter (DE) ──API──▶ Calendra Portal ──▶ Callcenter (TR) ──▶ Agenten (WebRTC/SIP)
```

## 🚀 Quick Start (< 10 Minuten)

### Voraussetzungen
- Node.js 20+ 
- Docker & Docker Compose
- Git

### 1. Repository klonen & Environment einrichten
```bash
git clone <repo-url> calendra-lead
cd calendra-lead
cp .env.example .env
```

### 2. Services starten
```bash
docker compose up -d   # PostgreSQL + Redis
npm install            # Dependencies installieren
```

### 3. Datenbank einrichten
```bash
cd apps/api
npx prisma migrate dev --name init   # Schema erstellen
npx prisma db seed                    # Demo-Daten
cd ../..
```

### 4. Anwendung starten
```bash
npm run dev   # API (Port 3001) + Frontend (Port 3000)
```

### 5. Im Browser öffnen
- **Frontend**: http://localhost:3000
- **API Docs (Swagger)**: http://localhost:3001/api/docs

### Demo-Zugangsdaten

| Rolle | E-Mail | Passwort |
|---|---|---|
| Super-Admin | super@calendra.de | Admin123! |
| Tenant-Admin | admin@demo.de | Admin123! |
| Teamleiter | teamlead@demo.de | Admin123! |
| Agent 1 | agent1@demo.de | Admin123! |
| Agent 2 | agent2@demo.de | Admin123! |
| QC | qc@demo.de | Admin123! |

## 📁 Projektstruktur

```
calendra-lead/
├── apps/
│   ├── api/          # NestJS Backend (Port 3001)
│   └── web/          # Next.js Frontend (Port 3000)
├── packages/
│   └── shared/       # Geteilte Types & Enums
├── infra/            # Docker & Infrastruktur
├── docs/             # Dokumentation
├── scripts/          # Hilfsskripte
└── docker-compose.yml
```

## 📚 Dokumentation

- [Architektur](docs/ARCHITECTURE.md)
- [Annahmen](docs/ASSUMPTIONS.md)
- [Telefonie](docs/TELEPHONY.md)
- [Sicherheit](docs/SECURITY.md)
- [Anbieter-Anbindung](docs/PROVIDER_ONBOARDING.md)

## 🛠 Tech-Stack

| Schicht | Technologie |
|---|---|
| Backend | NestJS + TypeScript |
| Datenbank | PostgreSQL 16 + Prisma |
| Cache/Queue | Redis + BullMQ |
| Frontend | Next.js 14 + Tailwind CSS |
| Echtzeit | Socket.IO |
| Telefonie | SIP.js + Asterisk (ARI) |
| i18n | Deutsch (DE) + Türkisch (TR) |

## 🔑 API

### Lead-Annahme (Push)
```bash
curl -X POST http://localhost:3001/api/v1/ingest/leads \
  -H "Content-Type: application/json" \
  -H "X-API-Key: <your-api-key>" \
  -d '{"first_name":"Max","phone":"+4917612345678","consent":{"given":true,"timestamp":"2024-01-15T14:30:00Z","source_url":"https://example.de"}}'
```

Vollständige API-Dokumentation unter http://localhost:3001/api/docs

## 🧪 Tests

```bash
cd apps/api
npm test              # Unit-Tests
npm run test:e2e      # Integrationstests
```

## 📋 Meilensteine

- [x] M1: Projekt-Setup, DB-Schema, Auth, Rollen, i18n, Dashboard
- [ ] M2: Benutzerverwaltung, Callcenter/Teams, Anbieter + API-Keys
- [ ] M3: Lead-Annahme, Validierung, Normalisierung, CSV-Import
- [ ] M4: Kampagnen, Zuweisungsmodi, Lead-Listen, DNC
- [ ] M5: Agentenbildschirm, MockProvider-Telefonie
- [ ] M6: WebRTC-Dialer, SIP-Trunk, Aufzeichnung
- [ ] M7: QC, Statistiken, Live-Ansicht, Chat
- [ ] M8: Pull-Adapter, Härtung, Tests, Deployment

## 📄 Lizenz

Proprietär — Alle Rechte vorbehalten.
