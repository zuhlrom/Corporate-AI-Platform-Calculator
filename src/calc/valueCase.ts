import type { ScenarioModel } from "./model"
import type { ScenarioFinancials } from "./scenarioFinancials"
import type { BenefitCore } from "./benefits"
import type { UsageYearSeries } from "./usage"
import { usageReferenceYearIndex } from "./scenarioFinancials"

export interface ValueCasePerScenario {
  steadyEfficiency: number
  steadyCommercial: number
  steadyTotal: number
  benefitPerYear: number[]
  fiveYearBenefit: number
  fiveYearNetValue: number
  netYearOne: number
  paybackMonths: number | null
  fiveYearRoi: number
  breakEvenCumulative: number[]
}

function sum(a: readonly number[]): number {
  return a.reduce((s, x) => s + x, 0)
}

export function computeValueCase(
  horizonYears: number,
  benefits: BenefitCore,
  commercialActiveInBase: boolean,
  usage: UsageYearSeries,
  scenario: ScenarioModel,
  fin: ScenarioFinancials,
): ValueCasePerScenario {
  const refIdx = usageReferenceYearIndex(horizonYears)
  const ixRef = usage.interactions[refIdx]!
  if (ixRef === 0) {
    throw new Error("Interactions at reference year must be > 0")
  }

  const steadyEfficiency =
    benefits.conservativeEfficiencyCHFPerYear * scenario.realizationEfficiency

  const commercialConservative = benefits.commercialConservativeCHFPerYear
  const steadyCommercial =
    commercialActiveInBase && commercialConservative > 0
      ? commercialConservative * scenario.realizationCommercial
      : 0

  const steadyTotal = steadyEfficiency + steadyCommercial

  const ramp = usage.interactions.map((ix) => ix / ixRef)
  const benefitPerYear = ramp.map((rf) => steadyTotal * rf)
  const fiveYearBenefit = sum(benefitPerYear)

  const fiveYearNetValue = fiveYearBenefit - fin.fiveYearTco

  const netYearOne =
    benefitPerYear[0]! - fin.opexPerYear[0]! - fin.implementationChf

  const monthlyNetSteady = (steadyTotal - fin.steadyOpexAnnualYRef) / 12
  const paybackMonths =
    monthlyNetSteady > 0 ? fin.implementationChf / monthlyNetSteady : null

  const fiveYearRoi =
    fin.fiveYearTco !== 0 ? fiveYearNetValue / fin.fiveYearTco : 0

  const breakEvenCumulative: number[] = []
  let c = -fin.implementationChf
  breakEvenCumulative.push(c)
  for (let yi = 0; yi < horizonYears; yi++) {
    c += benefitPerYear[yi]! - fin.opexPerYear[yi]!
    breakEvenCumulative.push(c)
  }

  return {
    steadyEfficiency,
    steadyCommercial,
    steadyTotal,
    benefitPerYear,
    fiveYearBenefit,
    fiveYearNetValue,
    netYearOne,
    paybackMonths,
    fiveYearRoi,
    breakEvenCumulative,
  }
}
