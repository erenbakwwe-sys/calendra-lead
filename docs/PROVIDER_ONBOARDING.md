# Provider Onboarding

## Übersicht

Anbieter (Lead-Provider) liefern Leads per API an die Calendra-Plattform. Dieses Dokument beschreibt den Anbindungsprozess.

## Schritt 1: Anbieter anlegen

Ein Admin legt den Anbieter in der Plattform an und generiert einen API-Key.

**Der API-Key wird nur einmal angezeigt — sicher aufbewahren!**

## Schritt 2: API-Endpunkt

### Einzelner Lead

```bash
curl -X POST https://portal.calendra.de/api/v1/ingest/leads \
  -H "Content-Type: application/json" \
  -H "X-API-Key: cal_live_abc123..." \
  -H "Idempotency-Key: unique-request-id-123" \
  -d '{
    "provider_lead_id": "lead-001",
    "first_name": "Max",
    "last_name": "Mustermann",
    "phone": "+4917612345678",
    "email": "max@example.de",
    "postal_code": "10115",
    "city": "Berlin",
    "product": "Photovoltaik",
    "source": "website-form",
    "consent": {
      "given": true,
      "timestamp": "2024-01-15T14:30:00Z",
      "source_url": "https://solar-vergleich.de/anfrage",
      "ip": "192.168.1.1",
      "text_version": "v2.1",
      "named_partners": ["Calendra GmbH", "Solar Partner AG"]
    },
    "extra_data": {
      "roof_type": "Satteldach",
      "interest_level": "hoch"
    }
  }'
```

### Batch (bis zu 500 Leads)

```bash
curl -X POST https://portal.calendra.de/api/v1/ingest/leads/batch \
  -H "Content-Type: application/json" \
  -H "X-API-Key: cal_live_abc123..." \
  -H "Idempotency-Key: batch-20240115-001" \
  -d '{
    "leads": [
      {
        "provider_lead_id": "lead-001",
        "first_name": "Max",
        "phone": "+4917612345678",
        "consent": { "given": true, "timestamp": "2024-01-15T14:30:00Z", "source_url": "https://example.de" }
      },
      {
        "provider_lead_id": "lead-002",
        "first_name": "Anna",
        "phone": "+4915112345678",
        "consent": { "given": true, "timestamp": "2024-01-15T14:31:00Z", "source_url": "https://example.de" }
      }
    ]
  }'
```

## Schritt 3: Antwortformat

### Erfolgreiche Antwort (einzelner Lead)

```json
{
  "status": "success",
  "data": {
    "lead_id": "550e8400-e29b-41d4-a716-446655440000",
    "provider_lead_id": "lead-001",
    "result": "accepted"
  }
}
```

### Batch-Antwort

```json
{
  "status": "success",
  "data": {
    "total": 2,
    "accepted": 1,
    "rejected": 0,
    "duplicate": 1,
    "results": [
      {
        "provider_lead_id": "lead-001",
        "result": "accepted",
        "lead_id": "550e8400-e29b-41d4-a716-446655440000"
      },
      {
        "provider_lead_id": "lead-002",
        "result": "duplicate",
        "reason": "Phone number already submitted within 30 days"
      }
    ]
  }
}
```

### Fehler-Antworten

```json
// 401 - Ungültiger API-Key
{ "status": "error", "message": "Invalid API key" }

// 422 - Validierungsfehler
{
  "status": "error",
  "message": "Validation failed",
  "errors": [
    { "field": "phone", "message": "Invalid phone number format" },
    { "field": "consent.given", "message": "Consent is required" }
  ]
}

// 429 - Rate Limit
{ "status": "error", "message": "Too many requests. Retry after 60 seconds." }

// 409 - Duplikat (bei Idempotency-Key)
{ "status": "error", "message": "Duplicate request", "original_lead_id": "..." }
```

## Pflichtfelder

| Feld | Typ | Pflicht | Beschreibung |
|---|---|---|---|
| provider_lead_id | string | Empfohlen | Eindeutige ID beim Anbieter |
| first_name | string | **Ja** | Vorname |
| last_name | string | Nein | Nachname |
| phone | string | **Ja** | Telefonnummer (E.164 empfohlen, z.B. +49176...) |
| email | string | Nein | E-Mail-Adresse |
| postal_code | string | Nein | Postleitzahl |
| city | string | Nein | Ort |
| product | string | Nein | Produkt/Thema (z.B. Photovoltaik) |
| source | string | Nein | Quelle des Leads |
| consent | object | **Ja** | Einwilligungsnachweis |
| consent.given | boolean | **Ja** | Einwilligung erteilt |
| consent.timestamp | ISO 8601 | **Ja** | Zeitpunkt der Einwilligung |
| consent.source_url | string | Empfohlen | URL der Einwilligungsseite |
| consent.ip | string | Empfohlen | IP-Adresse bei Einwilligung |
| consent.text_version | string | Nein | Version des Einwilligungstexts |
| consent.named_partners | string[] | Nein | Namentlich genannte Partner |
| extra_data | object | Nein | Zusätzliche Felder (JSON) |

## Telefonnummern

- Empfohlen: E.164-Format (`+49176...`)
- Akzeptiert: Deutsche Formate (`0176...`, `0176 123...`)
- Standardland: Deutschland (DE)
- Ungültige Nummern werden abgelehnt

## Sicherheit

### API-Key
- Im Header: `X-API-Key: cal_live_...`
- Niemals in URLs oder Logs verwenden

### HMAC-Signatur (optional)
```
X-Signature: sha256=<HMAC-SHA256(body, secret)>
```

### IP-Allowlist (optional)
Kann im Admin-Panel pro API-Key konfiguriert werden.

## Rate Limits

- Standard: 1000 Requests / Minute pro API-Key
- Batch: Maximal 500 Leads pro Request
- Bei Überschreitung: HTTP 429 mit Retry-After Header
