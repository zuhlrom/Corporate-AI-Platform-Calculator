import { useState } from "react"

import { SectionCard } from "@/components/forms/SectionCard"
import { NumInput } from "@/components/forms/NumInput"
import {
  MVP_BLOCK_LABELS_DE,
  POC_PHASE_LABELS_DE,
} from "@/lib/excelLabels"
import { formatChf, formatNum } from "@/lib/format"
import { usageReferenceYearIndex } from "@/calc/scenarioFinancials"
import { useModelStore } from "@/state/store"
import { useEngine } from "@/hooks/useEngine"

export default function CostsPage() {
  const model = useModelStore((s) => s.model)
  const apply = useModelStore((s) => s.apply)
  const result = useEngine(model)
  const [open, setOpen] = useState<string | null>(model.scenarios[0]?.id ?? null)

  const refIdx = usageReferenceYearIndex(model.horizonYears)
  const yLabels = Array.from({ length: model.horizonYears }, (_, i) => `Y${i + 1}`)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">05_KOSTEN_MODELL</h1>
        <p className="text-muted-foreground mt-1 max-w-3xl text-sm">
          Abschnitt 1: Usage-Baseline (abgeleitet). Abschnitt 2–5: je Szenario
          Implementierung, OPEX, TCO – mit Aufschlüsselung wie im Excel.
        </p>
      </div>

      <SectionCard title="1) Usage- und Kapazitätsbaseline">
        <p className="text-muted-foreground mb-2 text-xs">
          Referenzjahr für variable Skalierung: Index {refIdx} (
          {yLabels[refIdx]}). Interaktionen = MAU × Interaktionen/Tag ×
          Arbeitstage/Jahr × Aktionen/Interaktion (Excel-Logik).
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-left">
                <th className="p-2 font-medium">Treiber</th>
                {yLabels.map((y) => (
                  <th key={y} className="p-2 text-right font-medium">
                    {y}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/70">
                <td className="p-2 text-muted-foreground">
                  Monatlich aktive Nutzer
                </td>
                {result.usage.mau.map((v, i) => (
                  <td key={i} className="p-2 text-right tabular-nums">
                    {formatNum(v)}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-border/70">
                <td className="p-2 text-muted-foreground">
                  Jährliche Interaktionen
                </td>
                {result.usage.interactions.map((v, i) => (
                  <td key={i} className="p-2 text-right tabular-nums">
                    {formatNum(v)}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-border/70">
                <td className="p-2 text-muted-foreground">Input-Tokens</td>
                {result.usage.inputTokens.map((v, i) => (
                  <td key={i} className="p-2 text-right tabular-nums">
                    {formatNum(v)}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-border/70">
                <td className="p-2 text-muted-foreground">Output-Tokens</td>
                {result.usage.outputTokens.map((v, i) => (
                  <td key={i} className="p-2 text-right tabular-nums">
                    {formatNum(v)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-muted-foreground mt-2 text-[11px]">
          Potenzielle Nutzer (fix) ={" "}
          <NumInput
            className="inline-block w-24 align-middle"
            value={model.usage.potentialUsers}
            onChange={(v) => apply((m) => void (m.usage.potentialUsers = v))}
          />{" "}
          (editierbar; gleiche Basis für alle Szenarien).
        </p>
      </SectionCard>

      <SectionCard title="2–5) Kosten je Szenario (aufklappen)">
        <div className="space-y-2">
          {result.scenarios.map((row) => {
            const f = row.financials
            const isOpen = open === row.id
            return (
              <div
                key={row.id}
                className="rounded-md border border-border bg-muted/20"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : row.id)}
                  className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm font-medium"
                >
                  <span>{row.name}</span>
                  <span className="text-muted-foreground text-xs font-normal">
                    TCO 5J {formatChf(f.fiveYearTco)} · Invest{" "}
                    {formatChf(f.implementationChf)}
                  </span>
                </button>
                {isOpen ? (
                  <div className="space-y-3 border-t border-border p-3 text-xs">
                    <div>
                      <div className="font-medium">Implementierung PoC</div>
                      <table className="mt-1 w-full">
                        <tbody>
                          {POC_PHASE_LABELS_DE.map((lbl, i) => (
                            <tr key={lbl} className="border-b border-border/50">
                              <td className="py-0.5 pr-2 text-muted-foreground">
                                {lbl}
                              </td>
                              <td className="py-0.5 text-right tabular-nums">
                                {formatChf(f.pocPhaseCostsChf[i] ?? 0)}
                              </td>
                            </tr>
                          ))}
                          <tr className="font-medium">
                            <td className="py-1">Summe PoC</td>
                            <td className="py-1 text-right">
                              {formatChf(
                                f.pocPhaseCostsChf.reduce((a, x) => a + x, 0),
                              )}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div>
                      <div className="font-medium">Implementierung MVP</div>
                      <table className="mt-1 w-full">
                        <tbody>
                          {MVP_BLOCK_LABELS_DE.map((lbl, i) => (
                            <tr key={lbl} className="border-b border-border/50">
                              <td className="py-0.5 pr-2 text-muted-foreground">
                                {lbl}
                              </td>
                              <td className="py-0.5 text-right tabular-nums">
                                {formatChf(f.mvpBlockCostsChf[i] ?? 0)}
                              </td>
                            </tr>
                          ))}
                          <tr className="font-medium">
                            <td className="py-1">Summe MVP</td>
                            <td className="py-1 text-right">
                              {formatChf(
                                f.mvpBlockCostsChf.reduce((a, x) => a + x, 0),
                              )}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div>
                      <div className="font-medium">OPEX Steady (Ref.-Jahr)</div>
                      <table className="mt-1 w-full">
                        <tbody>
                          <tr className="border-b border-border/50">
                            <td className="text-muted-foreground">
                              Variable Nutzung (Ref.)
                            </td>
                            <td className="text-right">
                              {formatChf(f.variableOpexYRef)}
                            </td>
                          </tr>
                          <tr className="border-b border-border/50">
                            <td className="text-muted-foreground">
                              Fixe Plattform p.a. (inkl. Contingency)
                            </td>
                            <td className="text-right">
                              {formatChf(f.platformAnnualChf)}
                            </td>
                          </tr>
                          {f.fteLines.map((l) => (
                            <tr
                              key={l.key}
                              className="border-b border-border/50"
                            >
                              <td className="text-muted-foreground">
                                {l.labelDe}
                              </td>
                              <td className="text-right">
                                {formatChf(l.annualChf)}
                              </td>
                            </tr>
                          ))}
                          <tr className="font-medium">
                            <td className="py-1">Total OPEX Ref.-Jahr</td>
                            <td className="py-1 text-right">
                              {formatChf(f.steadyOpexAnnualYRef)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div>
                      <div className="font-medium">OPEX nach Jahr</div>
                      <div className="mt-1 overflow-x-auto">
                        <table className="w-full min-w-[400px]">
                          <thead>
                            <tr className="border-b border-border text-left">
                              <th className="py-1 pr-2">Jahr</th>
                              {yLabels.map((y) => (
                                <th key={y} className="py-1 text-right">
                                  {y}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="text-muted-foreground">OPEX</td>
                              {f.opexPerYear.map((v, i) => (
                                <td key={i} className="text-right tabular-nums">
                                  {formatChf(v)}
                                </td>
                              ))}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            )
          })}
        </div>
      </SectionCard>
    </div>
  )
}
