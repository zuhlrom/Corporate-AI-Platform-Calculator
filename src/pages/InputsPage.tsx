import type { ReactNode } from "react"

import { SectionCard } from "@/components/forms/SectionCard"
import { NumInput } from "@/components/forms/NumInput"
import { useModelStore } from "@/state/store"

function Row({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div className="grid grid-cols-[minmax(12rem,1.2fr)_minmax(8rem,1fr)] items-center gap-2 border-b border-border/60 py-1.5 text-sm last:border-0">
      <span className="text-muted-foreground">{label}</span>
      {children}
    </div>
  )
}

export default function InputsPage() {
  const apply = useModelStore((s) => s.apply)
  const model = useModelStore((s) => s.model)
  const setHorizonYears = useModelStore((s) => s.setHorizonYears)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">02_INPUTS</h1>
        <p className="text-muted-foreground mt-1 max-w-3xl text-sm">
          Gemeinsame Treiber für alle Szenarien (Skalierung, Nutzung,
          Kostensätze, Effizienzhebel, kommerzielle Schalter). Gelbe Felder =
          editierbar wie im Excel.
        </p>
      </div>

      <SectionCard
        title="Planungshorizont"
        subtitle="Passt die Länge der Adoption Y1…Yn an (letzter Wert wird für neue Jahre kopiert)."
      >
        <Row label="Jahre">
          <NumInput
            value={model.horizonYears}
            onChange={(v) => setHorizonYears(v)}
            min={1}
            max={15}
          />
        </Row>
      </SectionCard>

      <SectionCard
        title="Skalierung & Nutzung"
        subtitle="Entspricht den Blöcken 1) und 2) im Excel."
      >
        <Row label="Potenzielle Nutzer (#)">
          <NumInput
            value={model.usage.potentialUsers}
            onChange={(v) => apply((m) => void (m.usage.potentialUsers = v))}
          />
        </Row>
        <Row label="Interaktionen / aktiver Nutzer / Arbeitstag">
          <NumInput
            value={model.usage.interactionsPerActiveUserPerWorkday}
            onChange={(v) =>
              apply((m) => void (m.usage.interactionsPerActiveUserPerWorkday = v))
            }
          />
        </Row>
        <Row label="Arbeitstage / Jahr">
          <NumInput
            value={model.usage.workdaysPerYear}
            onChange={(v) => apply((m) => void (m.usage.workdaysPerYear = v))}
          />
        </Row>
        <Row label="Arbeitstage / Monat">
          <NumInput
            value={model.usage.workdaysPerMonth}
            onChange={(v) => apply((m) => void (m.usage.workdaysPerMonth = v))}
          />
        </Row>
        <Row label="Betriebsstunden / Tag">
          <NumInput
            value={model.usage.operatingHoursPerDay}
            onChange={(v) =>
              apply((m) => void (m.usage.operatingHoursPerDay = v))
            }
          />
        </Row>
        <Row label="Input-Tokens / Interaktion">
          <NumInput
            value={model.usage.inputTokensPerInteraction}
            onChange={(v) =>
              apply((m) => void (m.usage.inputTokensPerInteraction = v))
            }
          />
        </Row>
        <Row label="Output-Tokens / Interaktion">
          <NumInput
            value={model.usage.outputTokensPerInteraction}
            onChange={(v) =>
              apply((m) => void (m.usage.outputTokensPerInteraction = v))
            }
          />
        </Row>
        <Row label="Anteil Bild-Interaktionen (0–1)">
          <NumInput
            value={model.usage.imageInteractionFraction}
            onChange={(v) =>
              apply((m) => void (m.usage.imageInteractionFraction = v))
            }
            step={0.01}
          />
        </Row>
        <Row label="Zusatz-Input-Tokens Bild">
          <NumInput
            value={model.usage.extraInputTokensForImage}
            onChange={(v) =>
              apply((m) => void (m.usage.extraInputTokensForImage = v))
            }
          />
        </Row>
        <Row label="Anteil RAG-Interaktionen (0–1)">
          <NumInput
            value={model.usage.ragInteractionFraction}
            onChange={(v) =>
              apply((m) => void (m.usage.ragInteractionFraction = v))
            }
            step={0.01}
          />
        </Row>
        <Row label="Anteil Aktions-Interaktionen (0–1)">
          <NumInput
            value={model.usage.actionInteractionFraction}
            onChange={(v) =>
              apply((m) => void (m.usage.actionInteractionFraction = v))
            }
            step={0.01}
          />
        </Row>
        <Row label="Aktionen / Interaktion">
          <NumInput
            value={model.usage.actionsPerInteraction}
            onChange={(v) =>
              apply((m) => void (m.usage.actionsPerInteraction = v))
            }
          />
        </Row>
        <Row label="Spitzenlast-Multiplikator">
          <NumInput
            value={model.usage.peakLoadMultiplier}
            onChange={(v) =>
              apply((m) => void (m.usage.peakLoadMultiplier = v))
            }
            step={0.1}
          />
        </Row>
        <div className="mt-3 text-xs font-medium text-muted-foreground">
          Anteil monatlich aktiver Nutzer (Y1…Y{model.horizonYears})
        </div>
        <div className="mt-1 flex flex-wrap gap-2">
          {model.usage.activeUserShareY.map((q, i) => (
            <label
              key={i}
              className="flex items-center gap-1 text-xs text-muted-foreground"
            >
              <span className="w-6">Y{i + 1}</span>
              <NumInput
                className="w-24"
                value={q}
                onChange={(v) =>
                  apply((m) => void (m.usage.activeUserShareY[i] = v))
                }
                step={0.01}
              />
            </label>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="FTE-Monatskosten (CHF)" subtitle="Für Run-Model / OPEX.">
        <Row label="Business / PO">
          <NumInput
            value={model.fteCosts.monthlyBusinessCHF}
            onChange={(v) =>
              apply((m) => void (m.fteCosts.monthlyBusinessCHF = v))
            }
          />
        </Row>
        <Row label="Plattform / Integration">
          <NumInput
            value={model.fteCosts.monthlyPlatformCHF}
            onChange={(v) =>
              apply((m) => void (m.fteCosts.monthlyPlatformCHF = v))
            }
          />
        </Row>
        <Row label="Content / Wissen">
          <NumInput
            value={model.fteCosts.monthlyContentCHF}
            onChange={(v) =>
              apply((m) => void (m.fteCosts.monthlyContentCHF = v))
            }
          />
        </Row>
      </SectionCard>

      <SectionCard
        title="Effizienzhebel (Top-down)"
        subtitle="Wie Zeilenblock 1) im Blatt 06_NUTZEN_MODELL."
      >
        <Row label="Reduktion unnötige SA (Ziel %)">
          <NumInput
            value={model.benefits.unnecessarySaReductionFraction}
            onChange={(v) =>
              apply((m) => void (m.benefits.unnecessarySaReductionFraction = v))
            }
            step={0.01}
          />
        </Row>
        <Row label="Retournierte SA / Jahr">
          <NumInput
            value={model.benefits.returnedServiceOrdersPerYear}
            onChange={(v) =>
              apply((m) => void (m.benefits.returnedServiceOrdersPerYear = v))
            }
          />
        </Row>
        <Row label="Bearbeitungsdauer unnötige SA (Min)">
          <NumInput
            value={model.benefits.minutesPerUnnecessarySa}
            onChange={(v) =>
              apply((m) => void (m.benefits.minutesPerUnnecessarySa = v))
            }
          />
        </Row>
        <Row label="Vollkostenähnlicher Satz Service/Technik (CHF/h)">
          <NumInput
            value={model.benefits.fullCostServiceTechCHFPerHour}
            onChange={(v) =>
              apply((m) => void (m.benefits.fullCostServiceTechCHFPerHour = v))
            }
          />
        </Row>
        <Row label="Zeitersparnis retournierte SA (Min)">
          <NumInput
            value={model.benefits.minutesSavedPerReturnedSa}
            onChange={(v) =>
              apply((m) => void (m.benefits.minutesSavedPerReturnedSa = v))
            }
          />
        </Row>
        <Row label="Service-Center Satz (CHF/h)">
          <NumInput
            value={model.benefits.serviceCenterCHFPerHour}
            onChange={(v) =>
              apply((m) => void (m.benefits.serviceCenterCHFPerHour = v))
            }
          />
        </Row>
        <Row label="Direktgutschriften p.a. (#)">
          <NumInput
            value={model.benefits.directCreditsPerYear}
            onChange={(v) =>
              apply((m) => void (m.benefits.directCreditsPerYear = v))
            }
          />
        </Row>
        <Row label="Volumen Direktgutschriften (CHF)">
          <NumInput
            value={model.benefits.directCreditVolumeCHF}
            onChange={(v) =>
              apply((m) => void (m.benefits.directCreditVolumeCHF = v))
            }
          />
        </Row>
        <Row label="Reduktion DG (Ziel %)">
          <NumInput
            value={model.benefits.directCreditReductionFraction}
            onChange={(v) =>
              apply((m) => void (m.benefits.directCreditReductionFraction = v))
            }
            step={0.01}
          />
        </Row>
        <Row label="Override vermiedene unnötige SA">
          <NumInput
            value={model.benefits.overrideAvoidedUnnecessarySa}
            onChange={(v) =>
              apply((m) => void (m.benefits.overrideAvoidedUnnecessarySa = v))
            }
          />
        </Row>
        <Row label="Override vermiedene Anfragen">
          <NumInput
            value={model.benefits.overrideAvoidedWrittenRequests}
            onChange={(v) =>
              apply((m) => void (m.benefits.overrideAvoidedWrittenRequests = v))
            }
          />
        </Row>
        <Row label="Bearbeitungsdauer Anfrage (Min)">
          <NumInput
            value={model.benefits.minutesPerWrittenRequest}
            onChange={(v) =>
              apply((m) => void (m.benefits.minutesPerWrittenRequest = v))
            }
          />
        </Row>
        <Row label="Override optimierte Restanfragen">
          <NumInput
            value={model.benefits.overrideRemainingOptimizedRequests}
            onChange={(v) =>
              apply(
                (m) => void (m.benefits.overrideRemainingOptimizedRequests = v),
              )
            }
          />
        </Row>
        <Row label="Zeitersparnis verbleibende Anfragen (0–1)">
          <NumInput
            value={model.benefits.remainingRequestTimeSavingFraction}
            onChange={(v) =>
              apply(
                (m) => void (m.benefits.remainingRequestTimeSavingFraction = v),
              )
            }
            step={0.001}
          />
        </Row>
        <Row label="Override vermiedene DG (#)">
          <NumInput
            value={model.benefits.overrideAvoidedDirectCredits}
            onChange={(v) =>
              apply((m) => void (m.benefits.overrideAvoidedDirectCredits = v))
            }
          />
        </Row>
        <Row label="Konservativer Wirkungsgrad Effizienz (0–1)">
          <NumInput
            value={model.benefits.conservativeEfficiencyFactor}
            onChange={(v) =>
              apply((m) => void (m.benefits.conservativeEfficiencyFactor = v))
            }
            step={0.01}
          />
        </Row>
      </SectionCard>

      <SectionCard title="Kommerzielle Hebel (Schalter)" subtitle="Blatt 06 / 02">
        <Row label="Kommerzielle Upside im Basiscase aktiv (0/1)">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="size-4 rounded border-input"
              checked={model.commercial.activeInBaseCase}
              onChange={(e) =>
                apply(
                  (m) => void (m.commercial.activeInBaseCase = e.target.checked),
                )
              }
            />
            <span>Aktiv</span>
          </label>
        </Row>
        <Row label="Haircut kommerzielle Upside (0–1)">
          <NumInput
            value={model.commercial.haircutFraction}
            onChange={(v) =>
              apply((m) => void (m.commercial.haircutFraction = v))
            }
            step={0.05}
          />
        </Row>
        <Row label="Conversion-Uplift brutto (CHF p.a.)">
          <NumInput
            value={model.commercial.conversionUpliftCurrentCHFGross}
            onChange={(v) =>
              apply((m) => void (m.commercial.conversionUpliftCurrentCHFGross = v))
            }
          />
        </Row>
      </SectionCard>
    </div>
  )
}
