# Telefonie-Dokumentation

## Architekturentscheidung: Asterisk (via ARI)

### Warum Asterisk statt FreeSWITCH?

| Kriterium | Asterisk | FreeSWITCH |
|---|---|---|
| Community & Dokumentation | Größere Community, mehr Ressourcen | Kleinere, aber technisch versierte Community |
| Outbound-Dialing | Hervorragend, native Unterstützung | Gut, aber komplexere Konfiguration |
| WebRTC-Unterstützung | Nativ seit Asterisk 12+ | Nativ, sehr gut |
| REST-API | ARI (Asterisk REST Interface) | ESL (Event Socket Library) |
| Lernkurve | Flacher | Steiler |
| Docker-Integration | Viele offizielle Images | Weniger offizielle Images |

**Entscheidung**: Asterisk mit ARI für die REST-basierte Steuerung. ARI bietet eine moderne, RESTful API, die gut mit unserem Node.js-Backend zusammenarbeitet.

## Architektur

```
Agent Browser (SIP.js/WebRTC)
    │
    ├── WSS (WebSocket Secure)
    │
    ▼
Asterisk Server (Docker)
    │
    ├── ARI (REST API) ←── Node.js Backend
    │
    ├── PJSIP (SIP Stack)
    │
    └── SIP Trunk ──► Deutscher Telekom-Anbieter
```

## TelephonyProvider Interface

```typescript
interface TelephonyProvider {
  // Anruf starten
  originate(params: OriginateParams): Promise<CallResult>;
  
  // Anruf beenden
  hangup(callId: string): Promise<void>;
  
  // Stummschalten
  mute(callId: string, muted: boolean): Promise<void>;
  
  // Halten
  hold(callId: string, held: boolean): Promise<void>;
  
  // Events abonnieren
  onEvent(event: TelephonyEvent, handler: EventHandler): void;
  
  // Trunk-Status prüfen
  getTrunkStatus(): Promise<TrunkStatus>;
  
  // Aufzeichnung starten/stoppen
  startRecording(callId: string): Promise<string>;
  stopRecording(callId: string): Promise<void>;
}
```

## SIP-Trunk anbinden

### Voraussetzungen
- SIP-Trunk-Zugangsdaten vom deutschen Anbieter
- Öffentliche IP-Adresse oder Domain für den Asterisk-Server
- TLS-Zertifikat für WSS (WebSocket Secure)

### Konfiguration über die Admin-UI

1. **Admin → Einstellungen → SIP-Trunks**
2. Neuen Trunk anlegen:
   - **Name**: z.B. "Haupttrunk Telekom"
   - **Host**: sip.provider.de
   - **Port**: 5060 (oder 5061 für TLS)
   - **Transport**: UDP / TCP / TLS
   - **Authentifizierung**: Benutzername + Passwort ODER IP-basiert
   - **Codecs**: alaw, ulaw (G.711 Standard für DE)
   - **Max. Kanäle**: Anzahl gleichzeitiger Gespräche
   - **Ausgehende Rufnummer**: Die verifizierte Caller-ID

### Sicherheitshinweise

- SIP-Zugangsdaten werden mit AES-256-GCM verschlüsselt gespeichert
- Der Verschlüsselungsschlüssel liegt in der Umgebungsvariable `ENCRYPTION_KEY`
- Caller-ID-Nummern müssen explizit konfiguriert und als dem Mandanten zugehörig verifiziert sein
- Kein Spoofing, keine unterdrückten Nummern

## TURN-Server (coturn)

Agenten in der Türkei benötigen einen TURN-Server für WebRTC-Verbindungen durch restriktive Firewalls.

```yaml
# docker-compose.yml
coturn:
  image: coturn/coturn:latest
  ports:
    - "3478:3478/udp"
    - "3478:3478/tcp"
    - "5349:5349/udp"  # TLS
    - "5349:5349/tcp"
    - "49152-49200:49152-49200/udp"  # Media relay
  environment:
    - DETECT_EXTERNAL_IP=yes
    - DETECT_RELAY_IP=yes
  volumes:
    - ./infra/coturn/turnserver.conf:/etc/coturn/turnserver.conf
```

## Anrufzeiten

- **Standard**: Mo-Sa 09:00-20:00 Uhr (Europe/Berlin)
- **Sonntage**: Keine Anrufe (Standard)
- **Feiertage**: Keine Anrufe (Deutsche Feiertage)
- Serverseitig erzwungen — der Dialer blockiert Anrufe außerhalb der erlaubten Zeiten

## Dialer-Modi

1. **Manuell** (v1): Agent wählt die Nummer manuell
2. **Preview**: Agent sieht Lead-Daten, klickt "Anrufen"
3. **Power**: System wählt automatisch nach Gesprächsende
4. **Predictive** (EXPERIMENTELL, Feature-Flag): System wählt voraus, einstellbares Tempo 1-10
