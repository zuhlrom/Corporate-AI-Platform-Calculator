import { useModelStore } from "@/state/store"
import { useEngine } from "@/hooks/useEngine"
import { formatChf } from "@/lib/format"

export default function OverviewPage() {
  const model = useModelStore((s) => s.model)
  const result = useEngine(model)

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Überblick</h1>
        <p className="text-muted-foreground mt-1 max-w-3xl text-sm">
          Entspricht logisch dem Blatt{" "}
          <span className="font-mono">01_EXEC_SUMMARY</span>: Kennzahlen
          aller Szenarien, live aus dem Rechenkern.
        </p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-[900px] border-collapse text-sm">
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
    </div>
  )
}
