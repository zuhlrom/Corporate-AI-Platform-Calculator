import { useMemo } from "react"

import { Button } from "@/components/ui/button"
import { computeEngine } from "@/calc/engine"
import { defaultModel } from "@/state/defaultModel"

function formatChf(n: number): string {
  return (
    new Intl.NumberFormat("de-CH", {
      style: "decimal",
      maximumFractionDigits: 0,
    }).format(Math.round(n)) + " CHF"
  )
}

function App() {
  const result = useMemo(() => computeEngine(defaultModel), [])

  return (
    <div className="min-h-svh bg-background p-6 text-foreground">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight">
            Corporate AI Platform Calculator
          </h1>
          <p className="text-muted-foreground text-sm max-w-3xl leading-relaxed">
            Calculation engine aligned with{" "}
            <a
              className="text-primary underline-offset-4 hover:underline"
              href="/Digital_Assistant_Szenario_Berechnung_v11-1.xlsx"
            >
              Digital_Assistant_Szenario_Berechnung_v11-1.xlsx
            </a>
            . Scenario totals below are live from <code>computeEngine</code>{" "}
            (see <code>npm run test</code>).
          </p>
        </header>

        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-left">
                <th className="p-2 font-medium">#</th>
                <th className="p-2 font-medium">Szenario</th>
                <th className="p-2 text-right font-medium">Ext. PD PoC</th>
                <th className="p-2 text-right font-medium">Investition</th>
                <th className="p-2 text-right font-medium">OPEX p.a. (Ref.)</th>
                <th className="p-2 text-right font-medium">5Y TCO</th>
                <th className="p-2 text-right font-medium">Steady Nutzen</th>
                <th className="p-2 text-right font-medium">5Y Netto</th>
                <th className="p-2 text-right font-medium">Payback (Mt)</th>
              </tr>
            </thead>
            <tbody>
              {result.scenarios.map((s) => (
                <tr key={s.id} className="border-b border-border/80">
                  <td className="p-2 text-muted-foreground">{s.rank}</td>
                  <td className="p-2 font-medium">{s.name}</td>
                  <td className="p-2 text-right tabular-nums">
                    {s.financials.externalPdPoc.toFixed(2)}
                  </td>
                  <td className="p-2 text-right tabular-nums">
                    {formatChf(s.financials.implementationChf)}
                  </td>
                  <td className="p-2 text-right tabular-nums">
                    {formatChf(s.financials.steadyOpexAnnualYRef)}
                  </td>
                  <td className="p-2 text-right tabular-nums">
                    {formatChf(s.financials.fiveYearTco)}
                  </td>
                  <td className="p-2 text-right tabular-nums">
                    {formatChf(s.value.steadyTotal)}
                  </td>
                  <td className="p-2 text-right tabular-nums">
                    {formatChf(s.value.fiveYearNetValue)}
                  </td>
                  <td className="p-2 text-right tabular-nums">
                    {s.value.paybackMonths !== null
                      ? s.value.paybackMonths.toFixed(2)
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Button type="button" variant="outline" asChild>
          <a href="/Digital_Assistant_Szenario_Berechnung_v11-1.xlsx" download>
            Excel-Modell herunterladen
          </a>
        </Button>
      </div>
    </div>
  )
}

export default App
