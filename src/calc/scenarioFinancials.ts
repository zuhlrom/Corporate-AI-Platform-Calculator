import type { CalcModel, ScenarioModel } from "./model"
import type { UsageYearSeries } from "./usage"

export interface FteAnnualLine {
  key: string
  labelDe: string
  annualChf: number
}

export interface ScenarioFinancials {
  externalPdPoc: number
  internalPdPoc: number
  externalPdMvp: number
  internalPdMvp: number
  /** PoC phase extern CHF after scenario cost factor (wie Zeilen P0–P7). */
  pocPhaseCostsChf: number[]
  /** MVP-Blöcke nach Faktor (wie L30/L35/L42/L51). */
  mvpBlockCostsChf: number[]
  implementationChf: number
  variableOpexYRef: number
  platformAnnualChf: number
  fteAnnualChf: number
  fteLines: FteAnnualLine[]
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

function fteAnnualLines(
  model: CalcModel,
  s: ScenarioModel,
): { lines: FteAnnualLine[]; total: number } {
  const m = model.fteCosts
  const op = s.operating
  const qaRate = m.monthlyBusinessCHF
  const lines: FteAnnualLine[] = [
    {
      key: "po",
      labelDe: "Product Owner / Backlog (FTE)",
      annualChf: op.ftePO * m.monthlyBusinessCHF * 12,
    },
    {
      key: "content",
      labelDe: "Wissensmanagement / Content Ops (FTE)",
      annualChf: op.fteContentOps * m.monthlyContentCHF * 12,
    },
    {
      key: "platform",
      labelDe: "Plattform / Integration (FTE)",
      annualChf: op.ftePlatform * m.monthlyPlatformCHF * 12,
    },
    {
      key: "qa",
      labelDe: "QA / Analytics / Governance (FTE)",
      annualChf: op.fteQA * qaRate * 12,
    },
    {
      key: "ext_support",
      labelDe: "Externer Support / Managed Service",
      annualChf: op.externalSupportMonthlyCHF * 12,
    },
    {
      key: "hypercare",
      labelDe: "Hypercare-Aufschlag auf FTE (Modell)",
      annualChf: op.hypercareContentFteY1 * m.monthlyContentCHF * 12,
    },
  ]
  const total = lines.reduce((a, l) => a + l.annualChf, 0)
  return { lines, total }
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

  const pocPhaseCostsChf = ph.pocPhaseExtChfBaseline.map((v) => v * f)
  const mvpBlockCostsChf = ph.mvpBlockExtChfBaseline.map((v) => v * f)
  const pocImplChf = sum(pocPhaseCostsChf)
  const mvpImplChf = sum(mvpBlockCostsChf)
  const implementationChf = pocImplChf + mvpImplChf

  const refIdx = usageReferenceYearIndex(model.horizonYears)
  const q = model.usage.activeUserShareY
  const qRef = q[refIdx]!
  if (qRef === 0) {
    throw new Error("Adoption share at reference year must be > 0")
  }

  const variableYRef = variableUsageCost(s, usage, refIdx)

  const platformAnnual = platformMonthlyTotal(s) * 12
  const { lines: fteLines, total: fteAnnual } = fteAnnualLines(model, s)
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
    pocPhaseCostsChf,
    mvpBlockCostsChf,
    implementationChf,
    variableOpexYRef: variableYRef,
    platformAnnualChf: platformAnnual,
    fteAnnualChf: fteAnnual,
    fteLines,
    fixedOpexAnnualYRef: fixedAnnual,
    steadyOpexAnnualYRef,
    opexPerYear,
    fiveYearOpex: sum(opexPerYear),
    fiveYearTco: implementationChf + sum(opexPerYear),
  }
}
