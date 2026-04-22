import { SectionCard } from "@/components/forms/SectionCard"
import { NumInput } from "@/components/forms/NumInput"
import {
  MVP_BLOCK_LABELS_DE,
  POC_PHASE_LABELS_DE,
} from "@/lib/excelLabels"
import { useModelStore } from "@/state/store"

export default function PhasesPage() {
  const model = useModelStore((s) => s.model)
  const apply = useModelStore((s) => s.apply)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">04_PoC_MVP_Phasen</h1>
        <p className="text-muted-foreground mt-1 max-w-3xl text-sm">
          Externe CHF-Baselines pro PoC-Phase und MVP-Block (Spalte L im Excel,
          vor Szenario-Kostenfaktor). Personentage-Basis für PoC/MVP separat –
          werden mit jedem Szenario-Faktor multipliziert.
        </p>
      </div>

      <SectionCard title="PoC – externe CHF pro Phase (× Szenario-Faktor)">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="p-2 font-medium">Phase</th>
                <th className="p-2 text-right font-medium">CHF Basis</th>
              </tr>
            </thead>
            <tbody>
              {POC_PHASE_LABELS_DE.map((lbl, i) => (
                <tr key={lbl} className="border-b border-border/70">
                  <td className="p-2 text-muted-foreground">{lbl}</td>
                  <td className="p-2 text-right">
                    <NumInput
                      className="ml-auto w-36"
                      value={model.phase.pocPhaseExtChfBaseline[i] ?? 0}
                      onChange={(v) =>
                        apply((m) => void (m.phase.pocPhaseExtChfBaseline[i] = v))
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <SectionCard title="MVP – externe CHF pro Block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="p-2 font-medium">Block</th>
              <th className="p-2 text-right font-medium">CHF Basis</th>
            </tr>
          </thead>
          <tbody>
            {MVP_BLOCK_LABELS_DE.map((lbl, i) => (
              <tr key={lbl} className="border-b border-border/70">
                <td className="p-2 text-muted-foreground">{lbl}</td>
                <td className="p-2 text-right">
                  <NumInput
                    className="ml-auto w-36"
                    value={model.phase.mvpBlockExtChfBaseline[i] ?? 0}
                    onChange={(v) =>
                      apply((m) => void (m.phase.mvpBlockExtChfBaseline[i] = v))
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>

      <SectionCard title="Personentage-Basis (Summen vor Faktor)">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="text-xs text-muted-foreground">
            Ext. PD PoC (Basis)
            <div className="mt-1">
              <NumInput
                value={model.phase.pocExternalPdBase}
                onChange={(v) =>
                  apply((m) => void (m.phase.pocExternalPdBase = v))
                }
                step={0.1}
              />
            </div>
          </label>
          <label className="text-xs text-muted-foreground">
            Int. PD PoC (Basis)
            <div className="mt-1">
              <NumInput
                value={model.phase.pocInternalPdBase}
                onChange={(v) =>
                  apply((m) => void (m.phase.pocInternalPdBase = v))
                }
                step={0.1}
              />
            </div>
          </label>
          <label className="text-xs text-muted-foreground">
            Ext. PD MVP (Basis)
            <div className="mt-1">
              <NumInput
                value={model.phase.mvpExternalPdBase}
                onChange={(v) =>
                  apply((m) => void (m.phase.mvpExternalPdBase = v))
                }
                step={0.1}
              />
            </div>
          </label>
          <label className="text-xs text-muted-foreground">
            Int. PD MVP (Basis)
            <div className="mt-1">
              <NumInput
                value={model.phase.mvpInternalPdBase}
                onChange={(v) =>
                  apply((m) => void (m.phase.mvpInternalPdBase = v))
                }
                step={0.1}
              />
            </div>
          </label>
        </div>
      </SectionCard>
    </div>
  )
}
