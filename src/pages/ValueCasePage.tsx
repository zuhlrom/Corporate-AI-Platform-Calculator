import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { SectionCard } from "@/components/forms/SectionCard"
import { formatChf, formatNum } from "@/lib/format"
import { useModelStore } from "@/state/store"
import { useEngine } from "@/hooks/useEngine"

const SCENARIO_COLORS = [
  "#2563eb", // blue
  "#16a34a", // green
  "#dc2626", // red
  "#f59e0b", // amber
  "#7c3aed", // violet
  "#0ea5e9", // sky
  "#db2777", // pink
]

function colorFor(index: number): string {
  return SCENARIO_COLORS[index % SCENARIO_COLORS.length]!
}

function compactChf(value: number): string {
  const abs = Math.abs(value)
  if (abs >= 1_000_000) return `${(value / 1_000_000).toFixed(1)} Mio CHF`
  if (abs >= 1_000) return `${(value / 1_000).toFixed(0)} T CHF`
  return formatChf(value)
}

export default function ValueCasePage() {
  const model = useModelStore((s) => s.model)
  const result = useEngine(model)
  const yN = Array.from({ length: model.horizonYears }, (_, i) => `Y${i + 1}`)

  // Break-even chart data: one row per year-index (0..horizon), one series per scenario.
  const chartData = Array.from(
    { length: model.horizonYears + 1 },
    (_, i) => {
      const row: Record<string, number | string> = {
        period: i === 0 ? "Y0" : `Y${i}`,
      }
      for (const s of result.scenarios) {
        row[s.name] = s.value.breakEvenCumulative[i] ?? 0
      }
      return row
    },
  )

  const paybackLabel = (months: number | null) =>
    months == null
      ? "—"
      : `${months.toFixed(1)} Mt. (Y${Math.ceil(months / 12)})`

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">07_VALUE_CASE</h1>
        <p className="text-muted-foreground mt-1 max-w-3xl text-sm">
          Steady-State Nutzen, Ramp-up über die Jahre, kumulativer Netto-Cashflow
          und Break-even pro Szenario.
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
                <th className="p-2 text-right font-medium">5Y TCO</th>
                <th className="p-2 text-right font-medium">5Y Netto</th>
                <th className="p-2 text-right font-medium">ROI 5J</th>
                <th className="p-2 text-right font-medium">Net Y1</th>
                <th className="p-2 text-right font-medium">Payback</th>
              </tr>
            </thead>
            <tbody>
              {result.scenarios.map((s, i) => (
                <tr key={s.id} className="border-b border-border/70">
                  <td className="p-2 font-medium">
                    <span
                      className="mr-2 inline-block size-2.5 rounded-sm align-middle"
                      style={{ backgroundColor: colorFor(i) }}
                      aria-hidden="true"
                    />
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
                    {formatChf(s.financials.fiveYearTco)}
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
                  <td className="p-2 text-right tabular-nums">
                    {paybackLabel(s.value.paybackMonths)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <SectionCard
        title="Break-even pro Szenario"
        subtitle="Kumulativer Netto-Cashflow (Nutzen – OPEX – Invest). Der Schnittpunkt mit der 0-Linie markiert den Break-even."
      >
        <div className="h-[360px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
              <XAxis dataKey="period" tick={{ fontSize: 12 }} />
              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={(v: number) => compactChf(v)}
                width={90}
              />
              <Tooltip
                formatter={(val) => formatChf(Number(val))}
                labelFormatter={(lbl) => `Periode ${lbl}`}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <ReferenceLine
                y={0}
                stroke="#64748b"
                strokeDasharray="4 4"
                label={{ value: "Break-even", position: "insideTopRight", fontSize: 11 }}
              />
              {result.scenarios.map((s, i) => (
                <Line
                  key={s.id}
                  type="monotone"
                  dataKey={s.name}
                  stroke={colorFor(i)}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>

      <SectionCard title="Kumulativer Netto-Cashflow – Details">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-left">
                <th className="p-2 font-medium">Szenario</th>
                <th className="p-2 text-right font-medium">Y0 (Invest)</th>
                {yN.map((yl) => (
                  <th key={yl} className="p-2 text-right font-medium">
                    {yl}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {result.scenarios.map((s, i) => (
                <tr key={s.id} className="border-b border-border/70">
                  <td className="p-2 font-medium">
                    <span
                      className="mr-2 inline-block size-2.5 rounded-sm align-middle"
                      style={{ backgroundColor: colorFor(i) }}
                      aria-hidden="true"
                    />
                    {s.name}
                  </td>
                  {s.value.breakEvenCumulative.map((v, k) => (
                    <td
                      key={k}
                      className={`p-2 text-right tabular-nums ${
                        v >= 0 ? "text-emerald-600 dark:text-emerald-400" : ""
                      }`}
                    >
                      {formatChf(v)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  )
}
