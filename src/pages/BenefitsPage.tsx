import { computeBenefits } from "@/calc/benefits"
import { SectionCard } from "@/components/forms/SectionCard"
import { formatChf, formatNum } from "@/lib/format"
import { useModelStore } from "@/state/store"

const LEVER_TITLES: Record<string, string> = {
  unnecessary_sa: "Unnötige Service-Aufträge vermeiden",
  returned_sa: "Admin-Aufwand retournierte SA",
  direct_credits: "Direktgutschriften reduzieren",
  written_requests: "Schriftliche Anfragen vermeiden",
  remaining_requests: "Restliche Anfragen optimieren",
}

export default function BenefitsPage() {
  const model = useModelStore((s) => s.model)
  const b = computeBenefits(model.benefits, model.commercial)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">06_NUTZEN_MODELL</h1>
        <p className="text-muted-foreground mt-1 max-w-3xl text-sm">
          Top-down Effizienzhebel (editierbar unter 02_INPUTS) mit abgeleiteten
          CHF und konservativem Total. Kommerzielle Upside folgt den Schaltern
          dort.
        </p>
      </div>

      <SectionCard title="Top-down Hebel (Brutto)">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="p-2 font-medium">Hebel</th>
              <th className="p-2 text-right font-medium">Fälle p.a.</th>
              <th className="p-2 text-right font-medium">CHF p.a.</th>
            </tr>
          </thead>
          <tbody>
            {b.topDownLines.map((line) => (
              <tr key={line.key} className="border-b border-border/70">
                <td className="p-2 text-muted-foreground">
                  {LEVER_TITLES[line.key] ?? line.key}
                </td>
                <td className="p-2 text-right tabular-nums">
                  {formatNum(line.cases)}
                </td>
                <td className="p-2 text-right tabular-nums">
                  {formatChf(line.chfPerYear)}
                </td>
              </tr>
            ))}
            <tr className="font-medium">
              <td className="p-2">Brutto Effizienz</td>
              <td className="p-2 text-right">—</td>
              <td className="p-2 text-right">
                {formatChf(b.topDownGrossCHFPerYear)}
              </td>
            </tr>
            <tr>
              <td className="p-2 text-muted-foreground">
                × konservativer Wirkungsgrad
              </td>
              <td className="p-2 text-right">
                {model.benefits.conservativeEfficiencyFactor}
              </td>
              <td className="p-2 text-right">
                {formatChf(b.conservativeEfficiencyCHFPerYear)}
              </td>
            </tr>
          </tbody>
        </table>
      </SectionCard>

      <SectionCard title="Kommerziell (abgeleitet)">
        <table className="w-full text-sm">
          <tbody>
            <tr className="border-b border-border/70">
              <td className="p-2 text-muted-foreground">Brutto Upside</td>
              <td className="p-2 text-right">
                {formatChf(b.commercialGrossCHFPerYear)}
              </td>
            </tr>
            <tr className="border-b border-border/70">
              <td className="p-2 text-muted-foreground">
                Nach Haircut (falls aktiv)
              </td>
              <td className="p-2 text-right">
                {formatChf(b.commercialConservativeCHFPerYear)}
              </td>
            </tr>
            <tr className="font-medium">
              <td className="p-2">Basiscase p.a. (Effizienz + optional)</td>
              <td className="p-2 text-right">
                {formatChf(b.baseCaseCHFPerYear)}
              </td>
            </tr>
          </tbody>
        </table>
      </SectionCard>
    </div>
  )
}
