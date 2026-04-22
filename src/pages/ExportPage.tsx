import { Button } from "@/components/ui/button"
import { SectionCard } from "@/components/forms/SectionCard"
import type { CalcModel } from "@/calc/model"
import { useModelStore } from "@/state/store"

function downloadJson(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export default function ExportPage() {
  const model = useModelStore((s) => s.model)
  const reset = useModelStore((s) => s.resetToWorkbookDefaults)
  const importModel = useModelStore((s) => s.importModel)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Export / Reset</h1>
        <p className="text-muted-foreground mt-1 max-w-2xl text-sm">
          Modellzustand als JSON sichern oder auf die v11-1-Startwerte
          zurücksetzen (gleiche Zahlen wie die Vitest-Fixtures).
        </p>
      </div>

      <SectionCard title="JSON">
        <p className="text-muted-foreground mb-3 text-xs">
          Enthält das komplette <code>CalcModel</code> inkl. aller Szenarien und
          Phasen-Baselines.
        </p>
        <Button
          type="button"
          onClick={() =>
            downloadJson(
              `model-${new Date().toISOString().slice(0, 10)}.json`,
              model,
            )
          }
        >
          model.json herunterladen
        </Button>
        <label className="mt-4 block text-xs text-muted-foreground">
          JSON importieren
          <input
            type="file"
            accept="application/json"
            className="mt-1 block w-full max-w-sm text-sm"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (!file) return
              const reader = new FileReader()
              reader.onload = () => {
                try {
                  const parsed = JSON.parse(String(reader.result)) as CalcModel
                  importModel(parsed)
                } catch {
                  alert("Ungültige JSON-Datei.")
                }
              }
              reader.readAsText(file)
            }}
          />
        </label>
      </SectionCard>

      <SectionCard title="Zurücksetzen">
        <p className="text-muted-foreground mb-3 text-xs">
          Setzt alle Felder auf die Standardwerte aus dem Excel v11-1 (5
          Szenarien).
        </p>
        <Button
          type="button"
          variant="destructive"
          onClick={() => {
            if (
              confirm(
                "Alle Eingaben auf Workbook-Standard zurücksetzen?",
              ) === true
            ) {
              reset()
            }
          }}
        >
          Auf Standard zurücksetzen
        </Button>
      </SectionCard>

      <SectionCard title="Workbook-Datei">
        <a
          className="text-primary text-sm underline-offset-4 hover:underline"
          href="/Digital_Assistant_Szenario_Berechnung_v11-1.xlsx"
          download
        >
          Digital_Assistant_Szenario_Berechnung_v11-1.xlsx herunterladen
        </a>
      </SectionCard>
    </div>
  )
}
