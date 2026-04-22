import { useModelStore } from "@/state/store"
import { useEngine } from "@/hooks/useEngine"
import { formatChf } from "@/lib/format"
import { SectionCard } from "@/components/forms/SectionCard"

function KpiCard({
  label,
  value,
  hint,
}: {
  label: string
  value: string
  hint?: string
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 text-lg font-semibold tabular-nums">{value}</div>
      {hint ? (
        <div className="mt-1 text-[11px] text-muted-foreground">{hint}</div>
      ) : null}
    </div>
  )
}

export default function OverviewPage() {
  const model = useModelStore((s) => s.model)
  const result = useEngine(model)

  const best = [...result.scenarios].sort((a, b) => a.rank - b.rank)[0]
  const worst = [...result.scenarios].sort((a, b) => b.rank - a.rank)[0]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Überblick</h1>
        <p className="text-muted-foreground mt-1 max-w-3xl text-sm">
          Entspricht logisch dem Blatt{" "}
          <span className="font-mono">01_EXEC_SUMMARY</span>. Alle Kennzahlen
          werden live aus den Inputs, Szenarien und Phasen berechnet. Editieren
          Sie auf den nächsten Seiten, um die Werte hier sofort neu zu sehen.
        </p>
      </div>

      {best && worst ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            label="Bestes Szenario (5Y Netto)"
            value={best.name}
            hint={`${formatChf(best.value.fiveYearNetValue)} Netto · Payback ${
              best.value.paybackMonths != null
                ? `${best.value.paybackMonths.toFixed(1)} Mt`
                : "—"
            }`}
          />
          <KpiCard
            label="5Y Netto (Spannweite)"
            value={`${formatChf(worst.value.fiveYearNetValue)} … ${formatChf(
              best.value.fiveYearNetValue,
            )}`}
            hint="Differenz bester vs. schlechtester Run"
          />
          <KpiCard
            label="Steady Nutzen (best)"
            value={formatChf(best.value.steadyTotal)}
            hint="p.a. im Referenzjahr (Y4 bei Horizont=5)"
          />
          <KpiCard
            label="5Y TCO (best)"
            value={formatChf(best.financials.fiveYearTco)}
            hint="Invest + 5× OPEX"
          />
        </div>
      ) : null}

      <SectionCard title="Szenario-Rangliste">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-left">
                <th className="p-2 font-medium">Rang</th>
                <th className="p-2 font-medium">Szenario</th>
                <th className="p-2 text-right font-medium">Ext. PD PoC</th>
                <th className="p-2 text-right font-medium">Investition</th>
                <th className="p-2 text-right font-medium">OPEX p.a. (Ref.)</th>
                <th className="p-2 text-right font-medium">5Y TCO</th>
                <th className="p-2 text-right font-medium">Steady Nutzen</th>
                <th className="p-2 text-right font-medium">5Y Netto</th>
                <th className="p-2 text-right font-medium">Payback (Mt)</th>
                <th className="p-2 text-right font-medium">Scorecard</th>
              </tr>
            </thead>
            <tbody>
              {result.scenarios.map((s) => {
                const scoreTotal = s.scenario.scorecard.reduce(
                  (a, e) => a + e.score,
                  0,
                )
                const scoreMax = s.scenario.scorecard.length * 5
                return (
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
                        ? s.value.paybackMonths.toFixed(1)
                        : "—"}
                    </td>
                    <td className="p-2 text-right tabular-nums">
                      {scoreTotal} / {scoreMax}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  )
}
