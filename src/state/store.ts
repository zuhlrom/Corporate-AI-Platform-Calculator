import { create } from "zustand"
import { immer } from "zustand/middleware/immer"

import type { CalcModel, ScenarioModel } from "@/calc/model"
import { cloneDefaultModel } from "@/state/defaultModel"

const PLATFORM_LINE_COUNT = 11

function newScenarioId(): string {
  return `sc-${Math.random().toString(36).slice(2, 10)}`
}

function templateScenario(name = "Neues Szenario"): ScenarioModel {
  return {
    id: newScenarioId(),
    name,
    costFactor: 1,
    pricingMode: "tokens",
    creditsPerInteraction: 10,
    chfPerCredit: 0.0088,
    tokenInputChfPerM: 1,
    tokenOutputChfPerM: 6,
    realizationEfficiency: 0.85,
    realizationCommercial: 0.7,
    operating: {
      ftePO: 0.3,
      fteContentOps: 0.35,
      ftePlatform: 0.4,
      fteQA: 0.2,
      externalSupportMonthlyCHF: 1500,
      hypercareContentFteY1: 0.2,
    },
    platformInfraMonthlyCHF: Array(PLATFORM_LINE_COUNT).fill(0),
  }
}

export type ModelUpdater = (draft: CalcModel) => void

type ModelStore = {
  model: CalcModel
  /** Apply arbitrary immer-safe updates to the full model. */
  apply: (fn: ModelUpdater) => void
  /** Replace entire model (e.g. JSON import). */
  importModel: (next: CalcModel) => void
  resetToWorkbookDefaults: () => void
  setHorizonYears: (years: number) => void
  addScenario: () => void
  duplicateScenario: (id: string) => void
  removeScenario: (id: string) => void
  moveScenario: (id: string, direction: -1 | 1) => void
}

export const useModelStore = create<ModelStore>()(
  immer((set) => ({
    model: cloneDefaultModel(),

    apply: (fn) =>
      set((s) => {
        fn(s.model)
      }),

    importModel: (next) =>
      set((s) => {
        s.model = structuredClone(next)
      }),

    resetToWorkbookDefaults: () =>
      set((s) => {
        s.model = cloneDefaultModel()
      }),

    setHorizonYears: (years) =>
      set((s) => {
        const n = Math.max(1, Math.min(15, Math.round(years)))
        s.model.horizonYears = n
        const ay = s.model.usage.activeUserShareY
        const last = ay[ay.length - 1] ?? 0.9
        if (ay.length < n) {
          while (ay.length < n) ay.push(last)
        } else {
          ay.length = n
        }
      }),

    addScenario: () =>
      set((s) => {
        s.model.scenarios.push(templateScenario())
      }),

    duplicateScenario: (id) =>
      set((s) => {
        const i = s.model.scenarios.findIndex((x) => x.id === id)
        if (i === -1) return
        const copy = structuredClone(s.model.scenarios[i]!)
        copy.id = newScenarioId()
        copy.name = `${copy.name} (Kopie)`
        s.model.scenarios.splice(i + 1, 0, copy)
      }),

    removeScenario: (id) =>
      set((s) => {
        if (s.model.scenarios.length <= 1) return
        s.model.scenarios = s.model.scenarios.filter((x) => x.id !== id)
      }),

    moveScenario: (id, direction) =>
      set((s) => {
        const arr = s.model.scenarios
        const i = arr.findIndex((x) => x.id === id)
        if (i === -1) return
        const j = i + direction
        if (j < 0 || j >= arr.length) return
        const tmp = arr[i]!
        arr[i] = arr[j]!
        arr[j] = tmp
      }),
  })),
)
