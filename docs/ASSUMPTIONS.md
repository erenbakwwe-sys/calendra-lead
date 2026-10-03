# Annahmen (Assumptions)

Dieses Dokument hält alle getroffenen Annahmen fest.

## Architektur

1. **NestJS** statt Fastify: NestJS bietet bessere Modularität, DI, Guards, Interceptors und Pipes — ideal für ein mandantenfähiges System mit komplexen Rollen.
2. **Prisma** statt TypeORM: Bessere TypeScript-Integration, deklaratives Schema, automatische Migrationen.
3. **App Router** (Next.js 14): Wird mit Server Components und Route Handlers verwendet.
4. **SIP.js** statt JsSIP: Aktivere Wartung, bessere TypeScript-Unterstützung, bessere WebRTC-Integration.
5. **Asterisk** statt FreeSWITCH: Breitere Community, einfachere Konfiguration für Outbound-Szenarien, ARI bietet eine moderne REST-API. Begründung in TELEPHONY.md.

## Datenmodell

6. **UUIDs** als Primary Keys für alle Tabellen — sicherer als auto-increment IDs.
7. **Soft Deletes** für Leads und Benutzer (deleted_at Timestamp).
8. **JSON-Feld** für zusätzliche Lead-Daten (extra_data), nicht als separate Tabelle.
9. **Einwilligungsnachweis** wird als separates immutable Record gespeichert (lead_consents), nicht überschreibbar.

## Geschäftslogik

10. **Mandant = Firma**: Ein Mandant kann mehrere Callcenter haben, jedes mit eigenen Teams.
11. **Provider sehen kein UI**: In v1 haben Anbieter nur API-Zugang, kein Dashboard.
12. **Standardanrufzeiten**: Mo-Sa 09:00-20:00 Uhr deutscher Zeit (Europe/Berlin).
13. **Duplikat-Zeitfenster**: Standard 30 Tage, konfigurierbar pro Mandant.
14. **Lead-Sperre**: 15 Minuten Standard, konfigurierbar pro Kampagne.

## Sicherheit

15. **API-Keys** werden mit SHA-256 gehasht gespeichert, der Klartext wird nur bei der Erstellung einmalig angezeigt.
16. **SIP-Zugangsdaten** werden mit AES-256-GCM verschlüsselt gespeichert, Schlüssel aus Umgebungsvariable.
17. **Telefonnummern** werden in der Lead-Liste standardmäßig maskiert (nur letzte 4 Ziffern), der Agent sieht die volle Nummer nur im Anrufbildschirm.

## i18n

18. **DE** ist Standard für Admin/Kundenseite, **TR** für Agenten/Teamleiter-Bereiche.
19. Sprache wird pro User-Profil gespeichert und kann jederzeit umgeschaltet werden.
