# Architektur — Calendra Lead Portal

## Übersicht

Mandantenfähiges Lead-Verteilungs- und Dialer-Portal für den deutschen Markt.

```
Lead-Anbieter (DE) ──API──▶ Portal ──▶ Callcenter (TR) ──▶ Agenten rufen Leads an (WebRTC/SIP)
```

## Tech-Stack

| Schicht | Technologie |
|---|---|
| Backend | Node.js + TypeScript, NestJS, REST-API, Swagger |
| Datenbank | PostgreSQL 16 + Prisma ORM |
| Queue/Cache | Redis + BullMQ |
| Frontend | Next.js 14 (App Router) + TypeScript + Tailwind CSS |
| Echtzeit | Socket.IO (WebSocket) |
| Browser-Telefonie | SIP.js (WebRTC) |
| Telefonieserver | Asterisk (via ARI) hinter TelephonyProvider-Abstraktion |
| Deployment | Docker + docker-compose |
| i18n | next-intl (DE + TR) |

## Monorepo-Struktur

```
calendra-lead/
├── apps/
│   ├── api/                    # NestJS Backend
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── auth/       # JWT, Login, 2FA
│   │   │   │   ├── tenants/    # Mandantenverwaltung
│   │   │   │   ├── users/      # Benutzerverwaltung
│   │   │   │   ├── leads/      # Lead-Management
│   │   │   │   ├── campaigns/  # Kampagnenverwaltung
│   │   │   │   ├── providers/  # Anbieter + Ingestion
│   │   │   │   ├── callcenters/# Callcenter + Teams
│   │   │   │   ├── telephony/  # TelephonyProvider-Abstraktion
│   │   │   │   ├── qc/         # Qualitätskontrolle
│   │   │   │   ├── chat/       # Interner Chat
│   │   │   │   ├── stats/      # Statistiken
│   │   │   │   ├── notifications/ # Benachrichtigungen
│   │   │   │   └── audit/      # Audit-Log
│   │   │   ├── common/
│   │   │   │   ├── guards/     # Auth, Roles, Tenant Guards
│   │   │   │   ├── middleware/ # Tenant-Context, Rate Limiting
│   │   │   │   ├── decorators/ # @Roles, @TenantId, @CurrentUser
│   │   │   │   ├── filters/   # Exception Filters
│   │   │   │   └── interceptors/ # Audit, Logging
│   │   │   ├── prisma/        # Prisma Client + Service
│   │   │   └── main.ts
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   ├── migrations/
│   │   │   └── seed.ts
│   │   └── test/
│   └── web/                    # Next.js Frontend
│       ├── src/
│       │   ├── app/            # App Router Pages
│       │   ├── components/     # UI-Komponenten
│       │   ├── lib/            # API-Client, Utils
│       │   ├── hooks/          # Custom Hooks
│       │   ├── stores/         # Zustand Stores
│       │   └── i18n/           # Übersetzungen (DE, TR)
│       └── public/
├── packages/
│   └── shared/                 # Geteilte Types, Enums, Constants
│       └── src/
├── infra/
│   ├── docker-compose.yml
│   ├── docker-compose.dev.yml
│   ├── asterisk/               # Asterisk-Konfiguration
│   ├── coturn/                 # TURN-Server-Konfiguration
│   └── nginx/                  # Reverse Proxy
├── docs/
│   ├── ARCHITECTURE.md
│   ├── ASSUMPTIONS.md
│   ├── TELEPHONY.md
│   ├── SECURITY.md
│   └── PROVIDER_ONBOARDING.md
├── scripts/
│   ├── seed.ts
│   └── provider-simulator.ts
└── package.json                # Workspace Root
```

## Mandantenisolation

Jede geschäftsdatenrelevante Tabelle enthält `tenant_id`. Die Isolation wird auf drei Ebenen erzwungen:

1. **Middleware**: Extrahiert `tenant_id` aus dem JWT und setzt den Tenant-Context
2. **Guards**: Prüft Rollenberechtigung + Tenant-Zugehörigkeit
3. **Prisma Middleware**: Fügt automatisch `WHERE tenant_id = ?` zu allen Queries hinzu

Super-Admins können den Tenant wechseln (Header `X-Tenant-Id`).

## Authentifizierung

```
Login -> argon2-Prüfung -> JWT Access Token (15 min) + Refresh Token (7 Tage)
                        -> Optional TOTP-Prüfung für Admins
```

- Rate Limiting: 5 Versuche pro IP/10 Min
- Audit-Log für jeden Login-Versuch
- Session-Timeout konfigurierbar

## Datenfluss Leads

```
Anbieter ──POST /api/v1/ingest/leads──▶ API-Key-Prüfung
    ▶ Validierung (Pflichtfelder, Telefon E.164, Einwilligung)
    ▶ Duplikaterkennung (Telefon + Zeitfenster)
    ▶ Normalisierung -> NormalizedLead
    ▶ Speicherung (Status: new)
    ▶ Verteilung an Kampagne/Agent
```
