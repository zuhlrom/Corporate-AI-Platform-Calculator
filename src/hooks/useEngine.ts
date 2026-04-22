import { useMemo } from "react"

import { computeEngine } from "@/calc/engine"
import type { CalcModel } from "@/calc/model"

export function useEngine(model: CalcModel) {
  return useMemo(() => computeEngine(model), [model])
}
