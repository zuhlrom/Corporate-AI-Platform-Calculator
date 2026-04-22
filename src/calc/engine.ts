import type { CalcModel, ScenarioModel } from "./model"
import { computeBenefits } from "./benefits"
import { computeUsage } from "./usage"
import {
  computeScenarioFinancials,
  type ScenarioFinancials,
} from "./scenarioFinancials"
import { computeValueCase, type ValueCasePerScenario } from "./valueCase"

export interface EngineResult {
  usage: ReturnType<typeof computeUsage>
  scenarios: {
    id: string
    name: string
    rank: number
    scenario: ScenarioModel
    financials: ScenarioFinancials
    value: ValueCasePerScenario
  }[]
}

function rankDesc(values: number[]): number[] {
  const idx = values.map((_, i) => i)
  idx.sort((a, b) => values[b]! - values[a]!)
  const rank = new Array(values.length).fill(0) as number[]
  let r = 1
  for (const i of idx) {
    rank[i] = r
    r += 1
  }
  return rank
}

export function computeEngine(model: CalcModel): EngineResult {
  const usage = computeUsage(model)
  const benefits = computeBenefits(model.benefits, model.commercial)

  const scenarios = model.scenarios.map((s) => {
    const financials = computeScenarioFinancials(model, s, usage)
    const value = computeValueCase(
      model.horizonYears,
      benefits,
      model.commercial.activeInBaseCase,
      usage,
      s,
      financials,
    )
    return { id: s.id, name: s.name, rank: 0, scenario: s, financials, value }
  })

  const nets = scenarios.map((s) => s.value.fiveYearNetValue)
  const ranks = rankDesc(nets)
  const withRank = scenarios.map((s, i) => ({
    ...s,
    rank: ranks[i]!,
  }))

  return { usage, scenarios: withRank }
}
