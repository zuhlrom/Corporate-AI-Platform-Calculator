/** Matches sheet `03` platform block order (ohne Contingency-Zeile). */
export const PLATFORM_LINE_LABELS_DE = [
  "Suche / RAG (Vector Search)",
  "API Gateway / Orchestrierung / Compute",
  "Sessions / Dialogflow",
  "State / Session Cache (Redis/Memorystore)",
  "Datenbank (Conversation History / State)",
  "Monitoring / Logging",
  "Storage (Dokumente, Backups, Registry)",
  "Secrets / Key Management",
  "Security / DDoS (Cloud Armor / API Shield)",
  "Custom Connector Hosting (für MAM/Agronet)",
  "Basis-Plattform / Monat (paketiert / OSS)",
] as const

export const POC_PHASE_LABELS_DE = [
  "P0 Projektsteuerung PoC und PMO",
  "P1 Ground Truth & Kalibrierung",
  "P2 Detaildesign & Datenvorbereitung",
  "P3 Runtime & Basisplattform",
  "P4 Agenten-Implementierung",
  "P5 Validierung & Tuning",
  "P6 Abschluss & MVP-Entscheid",
  "P7 PoC-Dokumentation & Go/No-Go Vorlage",
] as const

export const MVP_BLOCK_LABELS_DE = [
  "── Projektstart und Organisation ──────",
  "── INTEGRATIONEN ───────────────",
  "── USE CASES ───────────────────",
  "── ABSCHLUSS ───────────────────",
] as const

export const SHEET_NAV = [
  { to: "/", code: "01", label: "Überblick" },
  { to: "/inputs", code: "02", label: "INPUTS" },
  { to: "/scenarios", code: "03", label: "SZENARIEN" },
  { to: "/phases", code: "04", label: "PoC / MVP Phasen" },
  { to: "/costs", code: "05", label: "KOSTEN_MODELL" },
  { to: "/benefits", code: "06", label: "NUTZEN_MODELL" },
  { to: "/value", code: "07", label: "VALUE_CASE" },
  { to: "/export", code: "99", label: "Export / Reset" },
] as const
