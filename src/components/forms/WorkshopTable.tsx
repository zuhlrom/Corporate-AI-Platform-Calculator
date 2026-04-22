import type { WorkshopUseCase } from "@/calc/model"
import { NumInput } from "@/components/forms/NumInput"
import { computeBenefits } from "@/calc/benefits"
import { Button } from "@/components/ui/button"
import { formatChf, formatNum } from "@/lib/format"
import { useModelStore } from "@/state/store"

/** Columns grouping mirrors Excel §2 header rows. */
type Field = keyof Omit<
  WorkshopUseCase,
  "id" | "taskLabel" | "businessCaseLabel"
>

interface ColumnSpec {
  key: Field
  label: string
  step?: number
}

const VOLUME_COLS: ColumnSpec[] = [
  { key: "casesCH", label: "Cases CH" },
  { key: "casesLaden", label: "Cases Laden" },
  { key: "adoptionCH", label: "Adoption CH (0–1)", step: 0.01 },
  { key: "adoptionLaden", label: "Adoption Laden (0–1)", step: 0.01 },
  { key: "successRate", label: "Erfolgsquote KI (0–1)", step: 0.01 },
]

const TIME_COLS: ColumnSpec[] = [
  { key: "timeBeforeMin", label: "Zeit heute (min)", step: 0.1 },
  { key: "timeAfterAiMin", label: "Zeit mit AI (min)", step: 0.1 },
  { key: "costPerMinCHF", label: "CHF / Min. CH", step: 0.01 },
  { key: "costPerMinLadenCHF", label: "CHF / Min. Laden", step: 0.01 },
]

const OUTCOME_COLS: ColumnSpec[] = [
  { key: "avoidedServiceOrders", label: "Vermied. SA / Jahr" },
  { key: "costPerServiceOrderCHF", label: "CHF / SA", step: 0.1 },
  { key: "avoidedDirectCredits", label: "Vermied. DG / Jahr" },
  { key: "costPerDirectCreditCHF", label: "CHF / DG", step: 0.1 },
  { key: "extraMarginCHFPerYear", label: "Zusätzl. Deckungsbeitrag CHF" },
  { key: "extraSparePartsSales", label: "Zus. Ersatzteil-Verkäufe / Jahr" },
  { key: "benefitPerSparePartSaleCHF", label: "CHF / Ersatzteil", step: 0.1 },
]

export function WorkshopTable() {
  const model = useModelStore((s) => s.model)
  const apply = useModelStore((s) => s.apply)
  const add = useModelStore((s) => s.addWorkshopUseCase)
  const duplicate = useModelStore((s) => s.duplicateWorkshopUseCase)
  const remove = useModelStore((s) => s.removeWorkshopUseCase)
  const move = useModelStore((s) => s.moveWorkshopUseCase)

  const benefits = computeBenefits(
    model.benefits,
    model.commercial,
    model.workshopUseCases,
  )
  const w = benefits.workshop
  const lineByIndex = (i: number) => w.lines[i]

  const updateField = (id: string, key: Field, value: number) => {
    apply((m) => {
      const row = m.workshopUseCases.find((u) => u.id === id)
      if (row) row[key] = value
    })
  }

  const updateText = (
    id: string,
    key: "taskLabel" | "businessCaseLabel",
    value: string,
  ) => {
    apply((m) => {
      const row = m.workshopUseCases.find((u) => u.id === id)
      if (row) row[key] = value
    })
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" size="sm" onClick={() => add()}>
          + Use Case
        </Button>
        <span className="text-xs text-muted-foreground">
          Bottom-up Crosscheck zu den Top-down-Hebeln. Pro Zeile werden
          Arbeitsnutzen, vermiedene SA/DG und Zusatzumsatz kombiniert.
        </span>
      </div>

      <div className="overflow-x-auto rounded-md border border-border">
        <table className="w-max min-w-full text-[11px]">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-left">
              <th className="sticky left-0 z-10 w-8 bg-muted/50 p-1 text-center">
                #
              </th>
              <th className="sticky left-8 z-10 min-w-[180px] bg-muted/50 p-1">
                Task
              </th>
              <th className="min-w-[180px] p-1">Business Case</th>
              {VOLUME_COLS.map((c) => (
                <th key={c.key} className="min-w-[110px] p-1 text-right">
                  {c.label}
                </th>
              ))}
              {TIME_COLS.map((c) => (
                <th key={c.key} className="min-w-[110px] p-1 text-right">
                  {c.label}
                </th>
              ))}
              {OUTCOME_COLS.map((c) => (
                <th key={c.key} className="min-w-[120px] p-1 text-right">
                  {c.label}
                </th>
              ))}
              <th className="min-w-[110px] p-1 text-right">Nutzen CH</th>
              <th className="min-w-[110px] p-1 text-right">Nutzen Laden</th>
              <th className="min-w-[110px] p-1 text-right">Total CHF p.a.</th>
              <th className="min-w-[90px] p-1 text-right">Aktion</th>
            </tr>
          </thead>
          <tbody>
            {model.workshopUseCases.map((u, i) => {
              const line = lineByIndex(i)
              return (
                <tr key={u.id} className="border-b border-border/60">
                  <td className="sticky left-0 z-10 bg-background p-1 text-center text-muted-foreground">
                    {i + 1}
                  </td>
                  <td className="sticky left-8 z-10 bg-background p-1">
                    <input
                      type="text"
                      value={u.taskLabel}
                      onChange={(e) =>
                        updateText(u.id, "taskLabel", e.target.value)
                      }
                      className="w-44 rounded-md border border-input bg-yellow-50 px-1 py-0.5 text-[11px] text-blue-800 dark:bg-yellow-900/25 dark:text-blue-200"
                    />
                  </td>
                  <td className="p-1">
                    <input
                      type="text"
                      value={u.businessCaseLabel}
                      onChange={(e) =>
                        updateText(u.id, "businessCaseLabel", e.target.value)
                      }
                      className="w-44 rounded-md border border-input bg-yellow-50 px-1 py-0.5 text-[11px] text-blue-800 dark:bg-yellow-900/25 dark:text-blue-200"
                    />
                  </td>
                  {[...VOLUME_COLS, ...TIME_COLS, ...OUTCOME_COLS].map((c) => (
                    <td key={c.key} className="p-1">
                      <NumInput
                        className="w-full text-right"
                        value={u[c.key]}
                        step={c.step ?? 1}
                        onChange={(v) => updateField(u.id, c.key, v)}
                      />
                    </td>
                  ))}
                  <td className="p-1 text-right tabular-nums text-muted-foreground">
                    {formatChf(line?.grossCH ?? 0)}
                  </td>
                  <td className="p-1 text-right tabular-nums text-muted-foreground">
                    {formatChf(line?.grossLaden ?? 0)}
                  </td>
                  <td className="p-1 text-right tabular-nums font-medium">
                    {formatChf(line?.totalCHFPerYear ?? 0)}
                  </td>
                  <td className="p-1 text-right">
                    <div className="inline-flex gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={i <= 0}
                        onClick={() => move(u.id, -1)}
                      >
                        ↑
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={i >= model.workshopUseCases.length - 1}
                        onClick={() => move(u.id, 1)}
                      >
                        ↓
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => duplicate(u.id)}
                      >
                        ⧉
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => remove(u.id)}
                      >
                        ✕
                      </Button>
                    </div>
                  </td>
                </tr>
              )
            })}
            <tr className="bg-muted/40 font-medium">
              <td />
              <td className="sticky left-8 bg-muted/40 p-1">Total</td>
              <td className="p-1" />
              <td className="p-1 text-right tabular-nums">
                {formatNum(
                  model.workshopUseCases.reduce((a, u) => a + u.casesCH, 0),
                )}
              </td>
              <td className="p-1 text-right tabular-nums">
                {formatNum(
                  model.workshopUseCases.reduce((a, u) => a + u.casesLaden, 0),
                )}
              </td>
              <td className="p-1" />
              <td className="p-1" />
              <td className="p-1" />
              <td className="p-1" />
              <td className="p-1" />
              <td className="p-1" />
              <td className="p-1" />
              <td className="p-1 text-right tabular-nums">
                {formatNum(
                  model.workshopUseCases.reduce(
                    (a, u) => a + u.avoidedServiceOrders,
                    0,
                  ),
                )}
              </td>
              <td className="p-1" />
              <td className="p-1 text-right tabular-nums">
                {formatNum(
                  model.workshopUseCases.reduce(
                    (a, u) => a + u.avoidedDirectCredits,
                    0,
                  ),
                )}
              </td>
              <td className="p-1" />
              <td className="p-1 text-right tabular-nums">
                {formatChf(w.totalExtraMargin)}
              </td>
              <td className="p-1" />
              <td className="p-1" />
              <td className="p-1 text-right tabular-nums">
                {formatChf(w.grossCHOnly)}
              </td>
              <td className="p-1 text-right tabular-nums">
                {formatChf(w.totalWorkLaden)}
              </td>
              <td className="p-1 text-right tabular-nums">
                {formatChf(w.grossCHFPerYear)}
              </td>
              <td />
            </tr>
          </tbody>
        </table>
      </div>

      <div className="grid gap-2 text-xs sm:grid-cols-3">
        <div className="rounded-md border border-border bg-card p-2">
          <div className="text-[10px] uppercase text-muted-foreground">
            Bottom-up Landi CH p.a.
          </div>
          <div className="mt-1 font-medium">{formatChf(w.grossCHOnly)}</div>
          <div className="text-[10px] text-muted-foreground">
            Crosscheck gegen Top-down Brutto{" "}
            <strong>{formatChf(benefits.topDownGrossCHFPerYear)}</strong>
          </div>
        </div>
        <div className="rounded-md border border-border bg-card p-2">
          <div className="text-[10px] uppercase text-muted-foreground">
            Bottom-up Landi Laden p.a.
          </div>
          <div className="mt-1 font-medium">{formatChf(w.totalWorkLaden)}</div>
          <div className="text-[10px] text-muted-foreground">
            Nur Arbeitsnutzen Laden
          </div>
        </div>
        <div className="rounded-md border border-border bg-card p-2">
          <div className="text-[10px] uppercase text-muted-foreground">
            Bottom-up Gesamt p.a.
          </div>
          <div className="mt-1 font-medium">
            {formatChf(w.grossCHFPerYear)}
          </div>
          <div className="text-[10px] text-muted-foreground">
            CH + Laden + Outcomes
          </div>
        </div>
      </div>
    </div>
  )
}
