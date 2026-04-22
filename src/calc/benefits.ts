import type { BenefitInputs, CommercialInputs } from "./model"

export interface EfficiencyLeverLine {
  key: string
  cases: number
  chfPerYear: number
}

export interface BenefitCore {
  topDownLines: EfficiencyLeverLine[]
  topDownGrossCHFPerYear: number
  conservativeEfficiencyCHFPerYear: number
  commercialGrossCHFPerYear: number
  commercialConservativeCHFPerYear: number
  /** Basiscase p.a. (Effizienz + optional kommerziell per workbook). */
  baseCaseCHFPerYear: number
}

function leverUnnecessarySa(b: BenefitInputs): EfficiencyLeverLine {
  const cases =
    b.overrideAvoidedUnnecessarySa > 0
      ? b.overrideAvoidedUnnecessarySa
      : Math.round(
          b.returnedServiceOrdersPerYear * b.unnecessarySaReductionFraction,
        )
  const chf =
    cases * (b.minutesPerUnnecessarySa / 60) * b.fullCostServiceTechCHFPerHour
  return { key: "unnecessary_sa", cases, chfPerYear: chf }
}

function leverReturnedSa(b: BenefitInputs): EfficiencyLeverLine {
  const cases = b.returnedServiceOrdersPerYear
  const chf =
    cases * (b.minutesSavedPerReturnedSa / 60) * b.serviceCenterCHFPerHour
  return { key: "returned_sa", cases, chfPerYear: chf }
}

function leverDirectCredits(b: BenefitInputs): EfficiencyLeverLine {
  const cases =
    b.overrideAvoidedDirectCredits > 0
      ? b.overrideAvoidedDirectCredits
      : Math.round(b.directCreditsPerYear * b.directCreditReductionFraction)
  const chf =
    b.overrideAvoidedDirectCredits > 0
      ? cases * (b.directCreditVolumeCHF / b.directCreditsPerYear)
      : b.directCreditVolumeCHF * b.directCreditReductionFraction
  return { key: "direct_credits", cases, chfPerYear: chf }
}

function leverWrittenRequests(b: BenefitInputs): EfficiencyLeverLine {
  const cases = b.overrideAvoidedWrittenRequests
  const chf =
    cases * (b.minutesPerWrittenRequest / 60) * b.serviceCenterCHFPerHour
  return { key: "written_requests", cases, chfPerYear: chf }
}

function leverRemainingRequests(b: BenefitInputs): EfficiencyLeverLine {
  const cases = b.overrideRemainingOptimizedRequests
  const chf =
    cases *
    b.minutesPerWrittenRequest *
    (b.remainingRequestTimeSavingFraction / 60) *
    b.serviceCenterCHFPerHour
  return { key: "remaining_requests", cases, chfPerYear: chf }
}

export function computeBenefits(
  b: BenefitInputs,
  c: CommercialInputs,
): BenefitCore {
  const lines = [
    leverUnnecessarySa(b),
    leverReturnedSa(b),
    leverDirectCredits(b),
    leverWrittenRequests(b),
    leverRemainingRequests(b),
  ]
  const gross = lines.reduce((s, l) => s + l.chfPerYear, 0)
  const conservative = gross * b.conservativeEfficiencyFactor
  const commercialGross = c.conversionUpliftCurrentCHFGross
  const commercialNet =
    c.activeInBaseCase && c.haircutFraction >= 0
      ? commercialGross * c.haircutFraction
      : 0
  const baseCase =
    conservative + (c.activeInBaseCase ? commercialNet : 0)

  return {
    topDownLines: lines,
    topDownGrossCHFPerYear: gross,
    conservativeEfficiencyCHFPerYear: conservative,
    commercialGrossCHFPerYear: commercialGross,
    commercialConservativeCHFPerYear: commercialNet,
    baseCaseCHFPerYear: baseCase,
  }
}
