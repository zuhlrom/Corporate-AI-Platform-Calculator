import type { ReactNode } from "react"

import { SectionCard } from "@/components/forms/SectionCard"
import { NumInput } from "@/components/forms/NumInput"
import { WorkshopTable } from "@/components/forms/WorkshopTable"
import { useModelStore } from "@/state/store"
import { computeBenefits } from "@/calc/benefits"
import { formatChf } from "@/lib/format"

function Row({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: ReactNode
}) {
  return (
    <div className="grid grid-cols-[minmax(12rem,1.3fr)_minmax(8rem,1fr)] items-start gap-2 border-b border-border/60 py-1.5 text-sm last:border-0">
      <span className="text-muted-foreground">
        {label}
        {hint ? (
          <span className="block text-[10px] text-muted-foreground/70">
            {hint}
          </span>
        ) : null}
      </span>
      {children}
    </div>
  )
}

export default function InputsPage() {
  const apply = useModelStore((s) => s.apply)
  const model = useModelStore((s) => s.model)
  const setHorizonYears = useModelStore((s) => s.setHorizonYears)

  const b = computeBenefits(
    model.benefits,
    model.commercial,
    model.workshopUseCases,
  )

  const computedPotentialUsers =
    model.scaling.numberOfPoS * model.scaling.serviceMAPerPoS +
    model.scaling.serviceCenterUsers +
    model.scaling.centralExperts

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">02_INPUTS</h1>
        <p className="text-muted-foreground mt-1 max-w-3xl text-sm">
          Gemeinsame Treiber für alle Szenarien. Gelbe Felder = editierbar wie
          im Excel; daraus werden OPEX, Nutzen und Value Case berechnet.
        </p>
      </div>

      <SectionCard
        title="0) Planungshorizont"
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
        title="1) Skalierung & Organisation"
        subtitle="Block 1 im Excel. Potenzielle Nutzer werden aus den Bestandteilen abgeleitet."
      >
        <Row label="Anzahl PoS (Filialen)">
          <NumInput
            value={model.scaling.numberOfPoS}
            onChange={(v) => apply((m) => void (m.scaling.numberOfPoS = v))}
          />
        </Row>
        <Row label="Service-MA pro PoS">
          <NumInput
            value={model.scaling.serviceMAPerPoS}
            onChange={(v) => apply((m) => void (m.scaling.serviceMAPerPoS = v))}
          />
        </Row>
        <Row label="Service-Center Nutzer">
          <NumInput
            value={model.scaling.serviceCenterUsers}
            onChange={(v) =>
              apply((m) => void (m.scaling.serviceCenterUsers = v))
            }
          />
        </Row>
        <Row label="Zentrale Experten">
          <NumInput
            value={model.scaling.centralExperts}
            onChange={(v) => apply((m) => void (m.scaling.centralExperts = v))}
          />
        </Row>
        <Row label="USD/CHF FX" hint="Umrechnung USD-Listenpreise">
          <NumInput
            value={model.scaling.usdChfFx}
            onChange={(v) => apply((m) => void (m.scaling.usdChfFx = v))}
            step={0.01}
          />
        </Row>
        <Row
          label="Totale potenzielle Nutzer (Modell)"
          hint="Editierbar, falls Sie einen abweichenden Zielwert verwenden. Default = Summe oben."
        >
          <NumInput
            value={model.usage.potentialUsers}
            onChange={(v) => apply((m) => void (m.usage.potentialUsers = v))}
          />
        </Row>
        <div className="mt-1 text-xs text-muted-foreground">
          Summenvorschlag: <strong>{computedPotentialUsers}</strong> Nutzer
          (PoS × MA/PoS + Service-Center + Experten).
        </div>
      </SectionCard>

      <SectionCard
        title="2) Nutzung & Volumen"
        subtitle="Block 2 im Excel – Adoption, Token-Mix, Peak-Last."
      >
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
        <Row label="Interaktionen / aktiver Nutzer / Arbeitstag">
          <NumInput
            value={model.usage.interactionsPerActiveUserPerWorkday}
            onChange={(v) =>
              apply(
                (m) =>
                  void (m.usage.interactionsPerActiveUserPerWorkday = v),
              )
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

      <SectionCard
        title="3) Komplexität & Kostensätze"
        subtitle="Block 3 im Excel. Treiber für Delivery-Aufwand und OPEX-FTE."
      >
        <Row label="Wissensquellen (#)">
          <NumInput
            value={model.rates.knowledgeSources}
            onChange={(v) => apply((m) => void (m.rates.knowledgeSources = v))}
          />
        </Row>
        <Row label="Kernsysteme (#)">
          <NumInput
            value={model.rates.coreSystems}
            onChange={(v) => apply((m) => void (m.rates.coreSystems = v))}
          />
        </Row>
        <Row label="Use Cases Phase 1 (#)">
          <NumInput
            value={model.rates.useCasesPhase1}
            onChange={(v) => apply((m) => void (m.rates.useCasesPhase1 = v))}
          />
        </Row>
        <Row label="Sprachen Welle 1 (#)">
          <NumInput
            value={model.rates.languagesWave1}
            onChange={(v) => apply((m) => void (m.rates.languagesWave1 = v))}
          />
        </Row>
        <Row label="Sicherheits-Multiplikator">
          <NumInput
            value={model.rates.securityMultiplier}
            onChange={(v) =>
              apply((m) => void (m.rates.securityMultiplier = v))
            }
            step={0.05}
          />
        </Row>
        <Row label="Externer Tagessatz (CHF/PD)">
          <NumInput
            value={model.rates.externalDayRateCHF}
            onChange={(v) =>
              apply((m) => void (m.rates.externalDayRateCHF = v))
            }
          />
        </Row>
        <Row label="Interner Tagessatz (CHF/PD)">
          <NumInput
            value={model.rates.internalDayRateCHF}
            onChange={(v) =>
              apply((m) => void (m.rates.internalDayRateCHF = v))
            }
          />
        </Row>
        <Row label="Bison-Tagessatz (CHF/PD)">
          <NumInput
            value={model.rates.bisonDayRateCHF}
            onChange={(v) => apply((m) => void (m.rates.bisonDayRateCHF = v))}
          />
        </Row>
        <Row label="Personalkosten Service (CHF/h)">
          <NumInput
            value={model.rates.servicePersonnelCHFPerHour}
            onChange={(v) =>
              apply((m) => void (m.rates.servicePersonnelCHFPerHour = v))
            }
          />
        </Row>
        <Row label="Produktive Stunden / FTE / Jahr">
          <NumInput
            value={model.rates.productiveHoursPerFteYear}
            onChange={(v) =>
              apply((m) => void (m.rates.productiveHoursPerFteYear = v))
            }
          />
        </Row>
        <Row label="Contingency (0–1)">
          <NumInput
            value={model.rates.contingencyFraction}
            onChange={(v) =>
              apply((m) => void (m.rates.contingencyFraction = v))
            }
            step={0.01}
          />
        </Row>
        <Row label="Hybrid- / On-Prem-Faktor">
          <NumInput
            value={model.rates.hybridOnPremFactor}
            onChange={(v) =>
              apply((m) => void (m.rates.hybridOnPremFactor = v))
            }
            step={0.05}
          />
        </Row>
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
        title="4) Nutzenmodell – Top-down Hebel"
        subtitle="Zeilenblock 1 aus 06_NUTZEN_MODELL. Treiber pro Fallgruppe; Override-Felder > 0 ersetzen den abgeleiteten Fallzählerwert."
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
        <Row label="Satz Service/Technik (CHF/h)">
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
        <Row
          label="Landi-Referenz DG-Nutzen (CHF)"
          hint="Rein informativ als Crosscheck; fliesst nicht in den Basiscase ein."
        >
          <NumInput
            value={model.benefits.directCreditReferenceCHF}
            onChange={(v) =>
              apply((m) => void (m.benefits.directCreditReferenceCHF = v))
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
        <div className="mt-2 rounded bg-muted/40 p-2 text-xs text-muted-foreground">
          Abgeleiteter konservativer Brutto-Nutzen:{" "}
          <strong>{formatChf(b.conservativeEfficiencyCHFPerYear)}</strong> p.a.
        </div>
      </SectionCard>

      <SectionCard
        title="5) Nutzenmodell – Bottom-up Workshop"
        subtitle="Zeilenblock 2 aus 06_NUTZEN_MODELL. Jeder Task ist vollständig editierbar (CRUD). Arbeitsnutzen = Erfolgreiche Cases × eingesparte Minuten × CHF/Min."
      >
        <WorkshopTable />
      </SectionCard>

      <SectionCard
        title="6) Kommerzielle Hebel (Online & Stationär)"
        subtitle="Blatt 06 §3 – abgeleitet aus Sessions, Conversion, Basket & Spare Parts. Override möglich."
      >
        <Row label="Kommerzielle Upside im Basiscase aktiv">
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
        <Row label="Budget-Variante (Sessions/CR/Basket = Budget)">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="size-4 rounded border-input"
              checked={model.commercial.useBudgetForOnline}
              onChange={(e) =>
                apply(
                  (m) =>
                    void (m.commercial.useBudgetForOnline = e.target.checked),
                )
              }
            />
            <span>Budget statt aktuell</span>
          </label>
        </Row>
        <Row label="Haircut (0–1)">
          <NumInput
            value={model.commercial.haircutFraction}
            onChange={(v) =>
              apply((m) => void (m.commercial.haircutFraction = v))
            }
            step={0.05}
          />
        </Row>
        <Row label="Basket aktuell (CHF)">
          <NumInput
            value={model.commercial.basketCurrentCHF}
            onChange={(v) =>
              apply((m) => void (m.commercial.basketCurrentCHF = v))
            }
            step={0.1}
          />
        </Row>
        <Row label="Basket Budget (CHF)">
          <NumInput
            value={model.commercial.basketBudgetCHF}
            onChange={(v) =>
              apply((m) => void (m.commercial.basketBudgetCHF = v))
            }
            step={0.1}
          />
        </Row>
        <Row label="Sessions aktuell p.a.">
          <NumInput
            value={model.commercial.sessionsCurrentPerYear}
            onChange={(v) =>
              apply((m) => void (m.commercial.sessionsCurrentPerYear = v))
            }
          />
        </Row>
        <Row label="Sessions Budget p.a.">
          <NumInput
            value={model.commercial.sessionsBudgetPerYear}
            onChange={(v) =>
              apply((m) => void (m.commercial.sessionsBudgetPerYear = v))
            }
          />
        </Row>
        <Row label="Conversion aktuell (0–1)">
          <NumInput
            value={model.commercial.conversionRateCurrent}
            onChange={(v) =>
              apply((m) => void (m.commercial.conversionRateCurrent = v))
            }
            step={0.0001}
          />
        </Row>
        <Row label="Conversion Budget (0–1)">
          <NumInput
            value={model.commercial.conversionRateBudget}
            onChange={(v) =>
              apply((m) => void (m.commercial.conversionRateBudget = v))
            }
            step={0.0001}
          />
        </Row>
        <Row label="Conversion Zielwert mit Assistant (0–1)">
          <NumInput
            value={model.commercial.conversionRateNew}
            onChange={(v) =>
              apply((m) => void (m.commercial.conversionRateNew = v))
            }
            step={0.0001}
          />
        </Row>
        <Row label="Marge (0–1)">
          <NumInput
            value={model.commercial.marginFraction}
            onChange={(v) =>
              apply((m) => void (m.commercial.marginFraction = v))
            }
            step={0.001}
          />
        </Row>
        <Row label="Stationärer Umsatz gesamt (CHF)">
          <NumInput
            value={model.commercial.stationaryRevenueTotalCHF}
            onChange={(v) =>
              apply((m) => void (m.commercial.stationaryRevenueTotalCHF = v))
            }
          />
        </Row>
        <Row label="Basket-Uplift Anteil (0–1)">
          <NumInput
            value={model.commercial.basketUpliftFraction}
            onChange={(v) =>
              apply((m) => void (m.commercial.basketUpliftFraction = v))
            }
            step={0.01}
          />
        </Row>
        <Row label="Frequenz-Uplift Anteil (0–1)">
          <NumInput
            value={model.commercial.frequencyUpliftFraction}
            onChange={(v) =>
              apply((m) => void (m.commercial.frequencyUpliftFraction = v))
            }
            step={0.01}
          />
        </Row>
        <Row label="Ersatzteil-Umsatz (CHF)">
          <NumInput
            value={model.commercial.sparePartsRevenueCHF}
            onChange={(v) =>
              apply((m) => void (m.commercial.sparePartsRevenueCHF = v))
            }
          />
        </Row>
        <Row label="Ersatzteil-Marge (0–1)">
          <NumInput
            value={model.commercial.sparePartsMarginFraction}
            onChange={(v) =>
              apply((m) => void (m.commercial.sparePartsMarginFraction = v))
            }
            step={0.01}
          />
        </Row>
        <Row label="Ersatzteil-Uplift (0–1)">
          <NumInput
            value={model.commercial.sparePartsUpliftFraction}
            onChange={(v) =>
              apply((m) => void (m.commercial.sparePartsUpliftFraction = v))
            }
            step={0.01}
          />
        </Row>
        <Row
          label="Override Brutto-Upside (CHF p.a.)"
          hint="Wenn > 0, ersetzt den abgeleiteten Gesamtwert."
        >
          <NumInput
            value={model.commercial.overrideGrossCHF}
            onChange={(v) =>
              apply((m) => void (m.commercial.overrideGrossCHF = v))
            }
          />
        </Row>
        <div className="mt-2 rounded bg-muted/40 p-2 text-xs text-muted-foreground">
          Abgeleitete Brutto-Upside:{" "}
          <strong>{formatChf(b.commercialGrossCHFPerYear)}</strong> p.a. · Nach
          Haircut <strong>{formatChf(b.commercialAfterHaircutCHFPerYear)}</strong>
          .
        </div>
      </SectionCard>

      <SectionCard
        title="7) Dokumentmengen (Kontext)"
        subtitle="Block 6 im Excel – informativ für RAG/Speicher-Kalkulation."
      >
        <Row label="PIM-Export (#)">
          <NumInput
            value={model.documents.pimExport}
            onChange={(v) => apply((m) => void (m.documents.pimExport = v))}
          />
        </Row>
        <Row label="Produktbilder (#)">
          <NumInput
            value={model.documents.productImages}
            onChange={(v) =>
              apply((m) => void (m.documents.productImages = v))
            }
          />
        </Row>
        <Row label="Ersatzteil-Bilder (#)">
          <NumInput
            value={model.documents.sparePartImages}
            onChange={(v) =>
              apply((m) => void (m.documents.sparePartImages = v))
            }
          />
        </Row>
        <Row label="MAM PDFs (#)">
          <NumInput
            value={model.documents.mamPdfs}
            onChange={(v) => apply((m) => void (m.documents.mamPdfs = v))}
          />
        </Row>
        <Row label="Seiten / PDF">
          <NumInput
            value={model.documents.pagesPerPdf}
            onChange={(v) =>
              apply((m) => void (m.documents.pagesPerPdf = v))
            }
          />
        </Row>
        <Row label="Zeichen / Seite">
          <NumInput
            value={model.documents.charsPerPage}
            onChange={(v) =>
              apply((m) => void (m.documents.charsPerPage = v))
            }
          />
        </Row>
        <Row label="MB / Seite">
          <NumInput
            value={model.documents.mbPerPage}
            onChange={(v) => apply((m) => void (m.documents.mbPerPage = v))}
            step={0.01}
          />
        </Row>
        <Row label="Zeichen Serviceaufträge">
          <NumInput
            value={model.documents.serviceOrderCharacters}
            onChange={(v) =>
              apply((m) => void (m.documents.serviceOrderCharacters = v))
            }
          />
        </Row>
      </SectionCard>
    </div>
  )
}
