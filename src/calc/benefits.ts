import type { BenefitInputs, CommercialInputs } from "./model"

export interface EfficiencyLeverLine {
  key: string
  cases: number
  chfPerYear: number
}

export interface CommercialLeverLine {
  key: string
  labelDe: string
  unitsOrCases: number
  chfPerYear: number
}

export interface BenefitCore {
  topDownLines: EfficiencyLeverLine[]
  topDownGrossCHFPerYear: number
  conservativeEfficiencyCHFPerYear: number
  commercialLines: CommercialLeverLine[]
  commercialGrossCHFPerYear: number
  commercialAfterHaircutCHFPerYear: number
  /** Basiscase p.a. (Effizienz + optional kommerzielle Upside). */
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

function computeCommercial(c: CommercialInputs): {
  lines: CommercialLeverLine[]
  gross: number
} {
  const online = c.useBudgetForOnline
    ? {
        sessions: c.sessionsBudgetPerYear,
        crBase: c.conversionRateBudget,
        basket: c.basketBudgetCHF,
        labelDe: "landi.ch Conversion-Uplift (Budget → neu)",
      }
    : {
        sessions: c.sessionsCurrentPerYear,
        crBase: c.conversionRateCurrent,
        basket: c.basketCurrentCHF,
        labelDe: "landi.ch Conversion-Uplift (aktuell → neu)",
      }

  const additionalOrders = Math.max(
    online.sessions * c.conversionRateNew - online.sessions * online.crBase,
    0,
  )
  const conversionChf = additionalOrders * online.basket * c.marginFraction

  const stationaryBasketUnits =
    c.stationaryRevenueTotalCHF * c.basketUpliftFraction
  const stationaryBasketChf = stationaryBasketUnits * c.marginFraction

  const stationaryFrequencyUnits =
    c.stationaryRevenueTotalCHF * c.frequencyUpliftFraction
  const stationaryFrequencyChf = stationaryFrequencyUnits * c.marginFraction

  const spareUnits = c.sparePartsRevenueCHF * c.sparePartsUpliftFraction
  const spareChf = spareUnits * c.sparePartsMarginFraction

  const lines: CommercialLeverLine[] = [
    {
      key: "conversion",
      labelDe: online.labelDe,
      unitsOrCases: additionalOrders,
      chfPerYear: conversionChf,
    },
    {
      key: "stationary_basket",
      labelDe: "Stationärer Basket-Uplift",
      unitsOrCases: stationaryBasketUnits,
      chfPerYear: stationaryBasketChf,
    },
    {
      key: "stationary_frequency",
      labelDe: "Stationäre Frequenz-Uplift",
      unitsOrCases: stationaryFrequencyUnits,
      chfPerYear: stationaryFrequencyChf,
    },
    {
      key: "spare_parts",
      labelDe: "Ersatzteil-Umsatz-Uplift",
      unitsOrCases: spareUnits,
      chfPerYear: spareChf,
    },
  ]

  const derivedGross = lines.reduce((a, l) => a + l.chfPerYear, 0)
  const gross = c.overrideGrossCHF > 0 ? c.overrideGrossCHF : derivedGross
  return { lines, gross }
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
  const { lines: commercialLines, gross: commercialGross } =
    computeCommercial(c)
  const commercialAfterHaircut = commercialGross * c.haircutFraction
  const baseCase =
    conservative + (c.activeInBaseCase ? commercialAfterHaircut : 0)

  return {
    topDownLines: lines,
    topDownGrossCHFPerYear: gross,
    conservativeEfficiencyCHFPerYear: conservative,
    commercialLines,
    commercialGrossCHFPerYear: commercialGross,
    commercialAfterHaircutCHFPerYear: commercialAfterHaircut,
    baseCaseCHFPerYear: baseCase,
  }
}
