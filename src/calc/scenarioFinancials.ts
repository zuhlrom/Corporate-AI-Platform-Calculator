import type { CalcModel, ScenarioModel } from "./model"
import type { UsageYearSeries } from "./usage"

export interface ScenarioFinancials {
  externalPdPoc: number
  internalPdPoc: number
  externalPdMvp: number
  internalPdMvp: number
  implementationChf: number
  variableOpexYRef: number
  fixedOpexAnnualYRef: number
  steadyOpexAnnualYRef: number
  opexPerYear: number[]
  fiveYearOpex: number
  fiveYearTco: number
}

function sum(a: readonly number[]): number {
  return a.reduce((s, x) => s + x, 0)
}

function platformMonthlyTotal(s: ScenarioModel): number {
  const base = sum(s.platformInfraMonthlyCHF)
  const c = s.platformContingencyFraction ?? 0.1
  return base * (1 + c)
}

function variableUsageCost(
  s: ScenarioModel,
  usage: UsageYearSeries,
  refIdx: number,
): number {
  if (s.pricingMode === "credits") {
    return (
      s.creditsPerInteraction *
      s.chfPerCredit *
      usage.interactions[refIdx]!
    )
  }
  return (
    (s.tokenInputChfPerM / 1_000_000) * usage.inputTokens[refIdx]! +
    (s.tokenOutputChfPerM / 1_000_000) * usage.outputTokens[refIdx]!
  )
}

function fteAnnualCost(model: CalcModel, s: ScenarioModel): number {
  const m = model.fteCosts
  const op = s.operating
  const qaRate = m.monthlyBusinessCHF
  return (
    op.ftePO * m.monthlyBusinessCHF * 12 +
    op.fteContentOps * m.monthlyContentCHF * 12 +
    op.ftePlatform * m.monthlyPlatformCHF * 12 +
    op.fteQA * qaRate * 12 +
    op.externalSupportMonthlyCHF * 12 +
    op.hypercareContentFteY1 * m.monthlyContentCHF * 12
  )
}

/**
 * Workbook uses adoption in calendar Y4 (column F) as reference for variable scaling.
 * For `horizonYears = n`, that is index `n - 2` when `n >= 2`.
 */
export function usageReferenceYearIndex(horizonYears: number): number {
  if (horizonYears <= 1) return 0
  return Math.max(0, horizonYears - 2)
}

export function computeScenarioFinancials(
  model: CalcModel,
  s: ScenarioModel,
  usage: UsageYearSeries,
): ScenarioFinancials {
  const ph = model.phase
  const f = s.costFactor

  const pocImplChf = sum(ph.pocPhaseExtChfBaseline.map((v) => v * f))
  const mvpImplChf = sum(ph.mvpBlockExtChfBaseline.map((v) => v * f))
  const implementationChf = pocImplChf + mvpImplChf

  const refIdx = usageReferenceYearIndex(model.horizonYears)
  const q = model.usage.activeUserShareY
  const qRef = q[refIdx]!
  if (qRef === 0) {
    throw new Error("Adoption share at reference year must be > 0")
  }

  const variableYRef = variableUsageCost(s, usage, refIdx)

  const platformAnnual = platformMonthlyTotal(s) * 12
  const fteAnnual = fteAnnualCost(model, s)
  const fixedAnnual = platformAnnual + fteAnnual
  const steadyOpexAnnualYRef = variableYRef + fixedAnnual

  const opexPerYear: number[] = []
  for (let yi = 0; yi < model.horizonYears; yi++) {
    opexPerYear.push(variableYRef * (q[yi]! / qRef) + fixedAnnual)
  }

  return {
    externalPdPoc: ph.pocExternalPdBase * f,
    internalPdPoc: ph.pocInternalPdBase * f,
    externalPdMvp: ph.mvpExternalPdBase * f,
    internalPdMvp: ph.mvpInternalPdBase * f,
    implementationChf,
    variableOpexYRef: variableYRef,
    fixedOpexAnnualYRef: fixedAnnual,
    steadyOpexAnnualYRef,
    opexPerYear,
    fiveYearOpex: sum(opexPerYear),
    fiveYearTco: implementationChf + sum(opexPerYear),
  }
}
