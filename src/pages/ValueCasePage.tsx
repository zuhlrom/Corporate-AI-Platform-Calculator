import { SectionCard } from "@/components/forms/SectionCard"
import { formatChf, formatNum } from "@/lib/format"
import { useModelStore } from "@/state/store"
import { useEngine } from "@/hooks/useEngine"

export default function ValueCasePage() {
  const model = useModelStore((s) => s.model)
  const result = useEngine(model)
  const yN = Array.from({ length: model.horizonYears }, (_, i) => `Y${i + 1}`)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">07_VALUE_CASE</h1>
        <p className="text-muted-foreground mt-1 max-w-3xl text-sm">
          Steady-State Nutzen, Ramp-up über die Jahre, Netto-Cashflow und
          Kennzahlen pro Szenario.
        </p>
      </div>

      <SectionCard title="Kernkennzahlen">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[880px] text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-left">
                <th className="p-2 font-medium">Szenario</th>
                <th className="p-2 text-right font-medium">Steady Effizienz</th>
                <th className="p-2 text-right font-medium">Steady kommerziell</th>
                <th className="p-2 text-right font-medium">Steady total</th>
                <th className="p-2 text-right font-medium">5Y Nutzen</th>
                <th className="p-2 text-right font-medium">5Y Netto</th>
                <th className="p-2 text-right font-medium">ROI 5J</th>
                <th className="p-2 text-right font-medium">Net Y1</th>
              </tr>
            </thead>
            <tbody>
              {result.scenarios.map((s) => (
                <tr key={s.id} className="border-b border-border/70">
                  <td className="p-2 font-medium">
                    <span className="text-muted-foreground mr-1">{s.rank}.</span>
                    {s.name}
                  </td>
                  <td className="p-2 text-right tabular-nums">
                    {formatChf(s.value.steadyEfficiency)}
                  </td>
                  <td className="p-2 text-right tabular-nums">
                    {formatChf(s.value.steadyCommercial)}
                  </td>
                  <td className="p-2 text-right tabular-nums">
                    {formatChf(s.value.steadyTotal)}
                  </td>
                  <td className="p-2 text-right tabular-nums">
                    {formatChf(s.value.fiveYearBenefit)}
                  </td>
                  <td className="p-2 text-right tabular-nums">
                    {formatChf(s.value.fiveYearNetValue)}
                  </td>
                  <td className="p-2 text-right tabular-nums">
                    {formatNum(s.value.fiveYearRoi)}×
                  </td>
                  <td className="p-2 text-right tabular-nums">
                    {formatChf(s.value.netYearOne)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <SectionCard title="Nutzen & Break-even (erstes Szenario als Beispiel)">
        {(() => {
          const s0 = result.scenarios[0]
          if (!s0) return null
          return (
            <div className="space-y-2">
              <div className="text-sm font-medium">{s0.name}</div>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="p-1 font-medium">Periode</th>
                    <th className="p-1 text-right font-medium">Nutzen</th>
                    <th className="p-1 text-right font-medium">Kosten</th>
                    <th className="p-1 text-right font-medium">Kum. Netto</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/60">
                    <td className="p-1">Y0 (Invest)</td>
                    <td className="p-1 text-right">—</td>
                    <td className="p-1 text-right">
                      {formatChf(s0.financials.implementationChf)}
                    </td>
                    <td className="p-1 text-right tabular-nums">
                      {formatChf(s0.value.breakEvenCumulative[0] ?? 0)}
                    </td>
                  </tr>
                  {yN.map((yl, i) => (
                    <tr key={yl} className="border-b border-border/60">
                      <td className="p-1">{yl}</td>
                      <td className="p-1 text-right tabular-nums">
                        {formatChf(s0.value.benefitPerYear[i] ?? 0)}
                      </td>
                      <td className="p-1 text-right tabular-nums">
                        {formatChf(s0.financials.opexPerYear[i] ?? 0)}
                      </td>
                      <td className="p-1 text-right tabular-nums">
                        {formatChf(s0.value.breakEvenCumulative[i + 1] ?? 0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        })()}
      </SectionCard>
    </div>
  )
}
