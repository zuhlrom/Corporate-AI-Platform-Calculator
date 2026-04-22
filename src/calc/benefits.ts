import type {
  BenefitInputs,
  CommercialInputs,
  WorkshopUseCase,
} from "./model"

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

export interface WorkshopLine extends WorkshopUseCase {
  kiCasesCH: number
  successfulCasesCH: number
  kiCasesLaden: number
  successfulCasesLaden: number
  savedMinutes: number
  benefitWorkCH: number
  benefitWorkLaden: number
  benefitAvoidedSa: number
  benefitAvoidedDc: number
  benefitExtraSpareParts: number
  /** Landi CH brutto (Excel AE): Arbeitsnutzen CH + SA + DG + Marge + Ersatzteile. */
  grossCH: number
  /** Landi Laden brutto (Excel AF): Arbeitsnutzen Laden. */
  grossLaden: number
  /** Gesamt brutto (Excel AG): grossCH + grossLaden. */
  totalCHFPerYear: number
}

export interface WorkshopCore {
  lines: WorkshopLine[]
  totalWorkCH: number
  totalWorkLaden: number
  totalAvoidedSa: number
  totalAvoidedDc: number
  totalExtraMargin: number
  totalExtraSpareParts: number
  /** Gesamt brutto (CH + Laden + Outcomes) p.a. */
  grossCHFPerYear: number
  /** Nur Landi CH brutto p.a. – Crosscheck gegen Top-down. */
  grossCHOnly: number
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
  workshop: WorkshopCore
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

function computeWorkshop(useCases: WorkshopUseCase[]): WorkshopCore {
  const lines: WorkshopLine[] = useCases.map((u) => {
    const kiCH = u.casesCH * u.adoptionCH
    const successCH = kiCH * u.successRate
    const kiLaden = u.casesLaden * u.adoptionLaden
    const successLaden = kiLaden * u.successRate
    const savedMin = Math.max(u.timeBeforeMin - u.timeAfterAiMin, 0)
    const benefitCH = successCH * savedMin * u.costPerMinCHF
    const benefitLaden = successLaden * savedMin * u.costPerMinLadenCHF
    const benefitSa = u.avoidedServiceOrders * u.costPerServiceOrderCHF
    const benefitDc = u.avoidedDirectCredits * u.costPerDirectCreditCHF
    const benefitSp = u.extraSparePartsSales * u.benefitPerSparePartSaleCHF
    const grossCH =
      benefitCH + benefitSa + benefitDc + u.extraMarginCHFPerYear + benefitSp
    const grossLaden = benefitLaden
    return {
      ...u,
      kiCasesCH: kiCH,
      successfulCasesCH: successCH,
      kiCasesLaden: kiLaden,
      successfulCasesLaden: successLaden,
      savedMinutes: savedMin,
      benefitWorkCH: benefitCH,
      benefitWorkLaden: benefitLaden,
      benefitAvoidedSa: benefitSa,
      benefitAvoidedDc: benefitDc,
      benefitExtraSpareParts: benefitSp,
      grossCH,
      grossLaden,
      totalCHFPerYear: grossCH + grossLaden,
    }
  })

  const totalWorkCH = lines.reduce((a, l) => a + l.benefitWorkCH, 0)
  const totalWorkLaden = lines.reduce((a, l) => a + l.benefitWorkLaden, 0)
  const totalAvoidedSa = lines.reduce((a, l) => a + l.benefitAvoidedSa, 0)
  const totalAvoidedDc = lines.reduce((a, l) => a + l.benefitAvoidedDc, 0)
  const totalExtraMargin = lines.reduce(
    (a, l) => a + l.extraMarginCHFPerYear,
    0,
  )
  const totalExtraSpareParts = lines.reduce(
    (a, l) => a + l.benefitExtraSpareParts,
    0,
  )
  const grossCHOnly = lines.reduce((a, l) => a + l.grossCH, 0)
  const gross = grossCHOnly + totalWorkLaden

  return {
    lines,
    totalWorkCH,
    totalWorkLaden,
    totalAvoidedSa,
    totalAvoidedDc,
    totalExtraMargin,
    totalExtraSpareParts,
    grossCHFPerYear: gross,
    grossCHOnly,
  }
}

export function computeBenefits(
  b: BenefitInputs,
  c: CommercialInputs,
  workshopUseCases: WorkshopUseCase[] = [],
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
    workshop: computeWorkshop(workshopUseCases),
  }
}
