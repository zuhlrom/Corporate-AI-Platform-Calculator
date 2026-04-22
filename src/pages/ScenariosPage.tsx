import { useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import { NumInput } from "@/components/forms/NumInput"
import { SectionCard } from "@/components/forms/SectionCard"
import { PLATFORM_LINE_LABELS_DE } from "@/lib/excelLabels"
import type { PricingMode } from "@/calc/model"
import { useModelStore } from "@/state/store"

export default function ScenariosPage() {
  const model = useModelStore((s) => s.model)
  const apply = useModelStore((s) => s.apply)
  const addScenario = useModelStore((s) => s.addScenario)
  const duplicateScenario = useModelStore((s) => s.duplicateScenario)
  const removeScenario = useModelStore((s) => s.removeScenario)
  const moveScenario = useModelStore((s) => s.moveScenario)

  const [pickId, setPickId] = useState<string | null>(null)

  const active = useMemo(() => {
    if (pickId) {
      const hit = model.scenarios.find((s) => s.id === pickId)
      if (hit) return hit
    }
    return model.scenarios[0]
  }, [pickId, model.scenarios])

  if (!active) {
    return <p className="text-sm text-muted-foreground">Kein Szenario.</p>
  }

  const idx = model.scenarios.findIndex((s) => s.id === active.id)
  const activeId = active.id

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">03_SZENARIEN</h1>
          <p className="text-muted-foreground mt-1 max-w-2xl text-sm">
            Pro Szenario: Kostenfaktor, Preismodus (Credits vs. Tokens),
            Operating Model, Plattformzeilen (monatlich, ohne Contingency),
            Realisierungsfaktoren.
          </p>
        </div>
        <Button type="button" onClick={() => addScenario()}>
          Szenario hinzufügen
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[16rem_1fr]">
        <SectionCard title="Szenarien" className="h-fit">
          <ul className="space-y-1">
            {model.scenarios.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => setPickId(s.id)}
                  className={`w-full rounded-md px-2 py-1.5 text-left text-sm ${
                    s.id === active.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  {s.name}
                </button>
              </li>
            ))}
          </ul>
        </SectionCard>

        <div className="space-y-4">
          <SectionCard title="Kopf / Identität">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-xs text-muted-foreground">
                Name
                <input
                  type="text"
                  value={active.name}
                  onChange={(e) =>
                    apply((m) => {
                      const t = m.scenarios.find((x) => x.id === activeId)
                      if (t) t.name = e.target.value
                    })
                  }
                  className="mt-1 w-full rounded-md border border-input bg-yellow-50 px-2 py-1 text-sm text-blue-800 dark:bg-yellow-900/25 dark:text-blue-200"
                />
              </label>
              <label className="text-xs text-muted-foreground">
                Kostenfaktor externe PT
                <div className="mt-1">
                  <NumInput
                    value={active.costFactor}
                    onChange={(v) =>
                      apply((m) => {
                        const t = m.scenarios.find((x) => x.id === activeId)
                        if (t) t.costFactor = v
                      })
                    }
                    step={0.01}
                  />
                </div>
              </label>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => duplicateScenario(activeId)}
              >
                Duplizieren
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={model.scenarios.length <= 1}
                onClick={() => {
                  removeScenario(activeId)
                  setPickId(null)
                }}
              >
                Löschen
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={idx <= 0}
                onClick={() => moveScenario(activeId, -1)}
              >
                ↑
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={idx < 0 || idx >= model.scenarios.length - 1}
                onClick={() => moveScenario(activeId, 1)}
              >
                ↓
              </Button>
            </div>
          </SectionCard>

          <SectionCard title="LLM-Preise & Modus">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-xs text-muted-foreground">
                Preismodus
                <select
                  value={active.pricingMode}
                  onChange={(e) =>
                    apply((m) => {
                      const t = m.scenarios.find((x) => x.id === activeId)
                      if (t) t.pricingMode = e.target.value as PricingMode
                    })
                  }
                  className="mt-1 w-full rounded-md border border-input bg-yellow-50 px-2 py-1 text-sm dark:bg-yellow-900/25"
                >
                  <option value="credits">Credits (Copilot-Logik)</option>
                  <option value="tokens">Tokens CHF / 1Mio</option>
                </select>
              </label>
              <label className="text-xs text-muted-foreground">
                Credits / Interaktion
                <div className="mt-1">
                  <NumInput
                    value={active.creditsPerInteraction}
                    onChange={(v) =>
                      apply((m) => {
                        const t = m.scenarios.find((x) => x.id === activeId)
                        if (t) t.creditsPerInteraction = v
                      })
                    }
                  />
                </div>
              </label>
              <label className="text-xs text-muted-foreground">
                CHF / Credit
                <div className="mt-1">
                  <NumInput
                    value={active.chfPerCredit}
                    onChange={(v) =>
                      apply((m) => {
                        const t = m.scenarios.find((x) => x.id === activeId)
                        if (t) t.chfPerCredit = v
                      })
                    }
                    step={0.0001}
                  />
                </div>
              </label>
              <label className="text-xs text-muted-foreground">
                Token Input CHF / 1M
                <div className="mt-1">
                  <NumInput
                    value={active.tokenInputChfPerM}
                    onChange={(v) =>
                      apply((m) => {
                        const t = m.scenarios.find((x) => x.id === activeId)
                        if (t) t.tokenInputChfPerM = v
                      })
                    }
                    step={0.1}
                  />
                </div>
              </label>
              <label className="text-xs text-muted-foreground">
                Token Output CHF / 1M
                <div className="mt-1">
                  <NumInput
                    value={active.tokenOutputChfPerM}
                    onChange={(v) =>
                      apply((m) => {
                        const t = m.scenarios.find((x) => x.id === activeId)
                        if (t) t.tokenOutputChfPerM = v
                      })
                    }
                    step={0.1}
                  />
                </div>
              </label>
            </div>
          </SectionCard>

          <SectionCard title="Operating Model (FTE & Support)">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {(
                [
                  ["ftePO", "Product Owner (FTE)"],
                  ["fteContentOps", "Content Ops (FTE)"],
                  ["ftePlatform", "Plattform (FTE)"],
                  ["fteQA", "QA / Governance (FTE)"],
                  ["externalSupportMonthlyCHF", "Externer Support CHF/Monat"],
                  ["hypercareContentFteY1", "Hypercare (Content-FTE)"],
                ] as const
              ).map(([key, label]) => (
                <label key={key} className="text-xs text-muted-foreground">
                  {label}
                  <div className="mt-1">
                    <NumInput
                      value={active.operating[key]}
                      onChange={(v) =>
                        apply((m) => {
                          const t = m.scenarios.find((x) => x.id === activeId)
                          if (t) t.operating[key] = v
                        })
                      }
                      step={key.includes("CHF") ? 50 : 0.05}
                    />
                  </div>
                </label>
              ))}
            </div>
          </SectionCard>

          <SectionCard
            title="Plattform & Infrastruktur (CHF / Monat, ohne Contingency)"
            subtitle="Contingency = 10 % auf die Summe dieser Zeilen (wie Excel)."
          >
            <div className="max-h-[28rem] overflow-auto">
              <table className="w-full text-xs">
                <tbody>
                  {PLATFORM_LINE_LABELS_DE.map((lbl, i) => (
                    <tr key={lbl} className="border-b border-border/60">
                      <td className="py-1 pr-2 text-muted-foreground">{lbl}</td>
                      <td className="py-1 text-right">
                        <NumInput
                          className="w-28 text-right"
                          value={active.platformInfraMonthlyCHF[i] ?? 0}
                          onChange={(v) =>
                            apply((m) => {
                              const t = m.scenarios.find(
                                (x) => x.id === activeId,
                              )
                              if (!t) return
                              while (t.platformInfraMonthlyCHF.length <= i) {
                                t.platformInfraMonthlyCHF.push(0)
                              }
                              t.platformInfraMonthlyCHF[i] = v
                            })
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>

          <SectionCard title="Realisierung (Nutzen)">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-xs text-muted-foreground">
                Faktor Effizienznutzen (0–1)
                <div className="mt-1">
                  <NumInput
                    value={active.realizationEfficiency}
                    onChange={(v) =>
                      apply((m) => {
                        const t = m.scenarios.find((x) => x.id === activeId)
                        if (t) t.realizationEfficiency = v
                      })
                    }
                    step={0.01}
                  />
                </div>
              </label>
              <label className="text-xs text-muted-foreground">
                Faktor kommerzielle Upside (0–1)
                <div className="mt-1">
                  <NumInput
                    value={active.realizationCommercial}
                    onChange={(v) =>
                      apply((m) => {
                        const t = m.scenarios.find((x) => x.id === activeId)
                        if (t) t.realizationCommercial = v
                      })
                    }
                    step={0.01}
                  />
                </div>
              </label>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  )
}
