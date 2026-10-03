# Sicherheitsdokumentation

## Authentifizierung

### Passwörter
- Hashing mit **argon2id** (memory-hard, GPU-resistent)
- Mindestlänge: 8 Zeichen
- Keine Passwörter in Logs

### JWT-Token
- **Access Token**: 15 Minuten Lebensdauer, HS256
- **Refresh Token**: 7 Tage Lebensdauer, in DB gespeichert (widerrufbar)
- Payload: `{ userId, tenantId, role, email }`
- Kein sensitives Material im Token

### Rate Limiting
- Login: 5 Versuche pro IP / 10 Minuten
- API allgemein: 100 Requests / Minute (konfigurierbar)
- Lead-Ingestion: 1000 Requests / Minute pro API-Key

### 2FA (TOTP)
- Optional für Admins
- TOTP-Secret mit AES-256-GCM verschlüsselt gespeichert
- Kompatibel mit Google Authenticator, Authy etc.

## Mandantenisolation

### Drei-Ebenen-Schutz

1. **JWT-Ebene**: `tenant_id` ist im Token kodiert
2. **Middleware-Ebene**: Extrahiert und validiert `tenant_id`
3. **Query-Ebene**: Prisma-Middleware fügt automatisch `WHERE tenant_id = ?` hinzu

### Super-Admin-Ausnahme
- Kann über `X-Tenant-Id`-Header den Kontext wechseln
- Alle Aktionen werden im Audit-Log festgehalten

## API-Sicherheit

### Eingabevalidierung
- class-validator auf allen DTOs
- Parametrisierte Queries (Prisma, kein Raw SQL ohne Escaping)
- Telefonnummern: E.164-Validierung mit libphonenumber

### HTTP-Sicherheit
- **Helmet**: Security Headers (X-Frame-Options, CSP, etc.)
- **CORS**: Whitelist aus Umgebungsvariable
- **CSRF**: Token-basierter Schutz für Session-basierte Endpunkte
- **Cookie-Flags**: HttpOnly, Secure, SameSite=Strict

### API-Key-Sicherheit (Anbieter)
- Keys werden mit **SHA-256** gehasht gespeichert
- Klartext wird nur bei Erstellung einmalig angezeigt
- Optionale IP-Allowlist pro Key
- Optionale HMAC-Signatur (X-Signature Header)

## Datenschutz (DSGVO)

### Datenminimierung
- Nur notwendige Felder werden gespeichert
- Telefonnummern in Listen maskiert (nur letzte 4 Ziffern sichtbar)
- Vollständige Nummer nur im Anrufkontext

### Zugriffskontrolle
- Rollenbasiert (RBAC) auf allen Endpunkten
- Audit-Log für Datenzugriffe und -exporte
- Callcenter sieht nie Anbieterdaten anderer Callcenter

### Recht auf Löschung
- `DELETE /api/v1/leads/:id/anonymize` — anonymisiert Lead-Daten
- Konfigurierbare Aufbewahrungsfristen
- Automatische Löschung nach Ablauf

### Datenexport
- `GET /api/v1/leads/:id/export` — Exportiert alle Daten eines Leads
- Wird im Audit-Log festgehalten

## Einwilligungsnachweis

- **Pflicht** für jeden Lead (deutscher Markt)
- Immutable Records in `lead_consents`-Tabelle
- Felder: consent_given, timestamp, source_url/text, IP, text_version, benannte Partner
- Leads ohne gültige Einwilligung: Status `rejected_no_consent`, NICHT anwählbar
- Serverseitig erzwungen: Dialer prüft Einwilligungsstatus vor jedem Anruf

## Verschlüsselung

### At Rest
- SIP-Zugangsdaten: AES-256-GCM
- TOTP-Secrets: AES-256-GCM
- API-Keys: SHA-256 (One-Way-Hash)
- Schlüssel aus `ENCRYPTION_KEY` Umgebungsvariable

### In Transit
- HTTPS / TLS überall
- WSS für WebSocket-Verbindungen
- SRTP für Medienstreams (WebRTC)

## Audit-Trail

Alle sicherheitsrelevanten Aktionen werden protokolliert:
- Login-Versuche (erfolgreich und fehlgeschlagen)
- Lead-Ansichten und -Exporte
- Statusänderungen
- Zuweisungen
- Einstellungsänderungen
- Benutzerverwaltung
- API-Key-Erstellung

Format: `{ userId, tenantId, action, entity, entityId, oldValue, newValue, ip, userAgent, timestamp }`

## Secrets-Management

- Alle Secrets in Umgebungsvariablen
- `.env` Dateien NIE im Repository
- `.env.example` als Vorlage ohne echte Werte
- Keine Passwörter, Token oder SIP-Zugangsdaten in Logs
