/** Data model aligned with `Digital_Assistant_Szenario_Berechnung_v11-1.xlsx`. */

export type PricingMode = "credits" | "tokens"

export interface PhaseRollup {
  /** Sum of external-role PD in PoC summary row (before scenario cost factor). */
  pocExternalPdBase: number
  /** Sum of internal-role PD columns E+F in PoC PHASE TOTAL row. */
  pocInternalPdBase: number
  mvpExternalPdBase: number
  mvpInternalPdBase: number
  /** Sheet `04` column L for PoC rows P0–P7 (CHF, before cost factor). */
  pocPhaseExtChfBaseline: number[]
  /** Sheet `04` cells L30, L35, L42, L51 (MVP block extern CHF, before factor). */
  mvpBlockExtChfBaseline: number[]
}

/** Qualitative scorecard (1–5). Extra criteria may be added by the user. */
export interface ScorecardEntry {
  id: string
  labelDe: string
  score: number
}

export interface ScenarioModel {
  id: string
  name: string
  /** Narrative / positioning text (sheet `03` row 6). */
  narrative: string
  /** Multiplier on external PT and on PoC/MVP CHF baselines (sheet `04` block). */
  costFactor: number
  pricingMode: PricingMode
  creditsPerInteraction: number
  chfPerCredit: number
  tokenInputChfPerM: number
  tokenOutputChfPerM: number
  realizationEfficiency: number
  realizationCommercial: number
  operating: {
    ftePO: number
    fteContentOps: number
    ftePlatform: number
    fteQA: number
    externalSupportMonthlyCHF: number
    /** Hypercare uplift expressed as additional Content-Ops FTE in Y1 (sheet model). */
    hypercareContentFteY1: number
  }
  /**
   * Monthly CHF per infrastructure line (sheet `03`, rows under platform block, excluding contingency).
   * `"—"` / empty cells → 0.
   */
  platformInfraMonthlyCHF: number[]
  /** Contingency on infra lines (workbook uses 10%). */
  platformContingencyFraction?: number
  scorecard: ScorecardEntry[]
}

/** One editable row in the bottom-up workshop table (sheet `06` §2). */
export interface WorkshopUseCase {
  id: string
  taskLabel: string
  businessCaseLabel: string
  casesCH: number
  casesLaden: number
  adoptionCH: number
  adoptionLaden: number
  successRate: number
  timeBeforeMin: number
  timeAfterAiMin: number
  costPerMinCHF: number
  costPerMinLadenCHF: number
  avoidedServiceOrders: number
  costPerServiceOrderCHF: number
  avoidedDirectCredits: number
  /** CHF Nutzen pro vermiedene Direktgutschrift. */
  costPerDirectCreditCHF: number
  /** Zusätzlicher Deckungsbeitrag p.a. (CHF) – Excel col AA. */
  extraMarginCHFPerYear: number
  /** Zusätzliche Ersatzteilverkäufe / Jahr – Excel col AB. */
  extraSparePartsSales: number
  /** Nutzen pro Ersatzteilverkauf (CHF) – Excel col AC. */
  benefitPerSparePartSaleCHF: number
}

export interface BenefitInputs {
  unnecessarySaReductionFraction: number
  returnedServiceOrdersPerYear: number
  minutesPerUnnecessarySa: number
  fullCostServiceTechCHFPerHour: number
  minutesSavedPerReturnedSa: number
  serviceCenterCHFPerHour: number
  directCreditsPerYear: number
  directCreditVolumeCHF: number
  directCreditReductionFraction: number
  overrideAvoidedUnnecessarySa: number
  overrideAvoidedWrittenRequests: number
  minutesPerWrittenRequest: number
  overrideRemainingOptimizedRequests: number
  remainingRequestTimeSavingFraction: number
  overrideAvoidedDirectCredits: number
  /** Landi-Referenz CHF/p.a. (informativ, zum Crosscheck mit Modellwert). */
  directCreditReferenceCHF: number
  /** Default 0.75 in workbook. */
  conservativeEfficiencyFactor: number
}

export interface CommercialInputs {
  activeInBaseCase: boolean
  haircutFraction: number
  /** Online & stationary drivers (sheet `02` rows 67–85). */
  basketCurrentCHF: number
  basketBudgetCHF: number
  revenueOnlineCurrentCHF: number
  revenueOnlineBudgetCHF: number
  sessionsCurrentPerYear: number
  sessionsBudgetPerYear: number
  conversionRateCurrent: number
  conversionRateBudget: number
  conversionRateNew: number
  stationaryRevenueTotalCHF: number
  marginFraction: number
  influencedStationaryShare: number
  basketUpliftFraction: number
  frequencyUpliftFraction: number
  sparePartsRevenueCHF: number
  sparePartsMarginFraction: number
  sparePartsUpliftFraction: number
  /**
   * If > 0, overrides the derived "Brutto kommerzielle Upside" before haircut.
   * 0 means use the derived value.
   */
  overrideGrossCHF: number
  /** Apply budget variant for online uplift (sheet `06` row 35). */
  useBudgetForOnline: boolean
}

export interface UsageInputs {
  potentialUsers: number
  /** Length = horizon; workbook default 5× adoption ramp. */
  activeUserShareY: number[]
  interactionsPerActiveUserPerWorkday: number
  workdaysPerYear: number
  workdaysPerMonth: number
  operatingHoursPerDay: number
  inputTokensPerInteraction: number
  outputTokensPerInteraction: number
  imageInteractionFraction: number
  extraInputTokensForImage: number
  ragInteractionFraction: number
  actionInteractionFraction: number
  actionsPerInteraction: number
  peakLoadMultiplier: number
}

export interface FteCostInputs {
  monthlyBusinessCHF: number
  monthlyPlatformCHF: number
  monthlyContentCHF: number
}

/** Skalierung / Organisation / Basisgrössen – disaggregiert wie im Workbook. */
export interface ScalingInputs {
  numberOfPoS: number
  serviceMAPerPoS: number
  serviceCenterUsers: number
  centralExperts: number
  usdChfFx: number
}

/** Komplexität & Kostensätze (sheet `02` block 3). */
export interface RatesInputs {
  knowledgeSources: number
  coreSystems: number
  useCasesPhase1: number
  languagesWave1: number
  securityMultiplier: number
  externalDayRateCHF: number
  internalDayRateCHF: number
  bisonDayRateCHF: number
  servicePersonnelCHFPerHour: number
  productiveHoursPerFteYear: number
  contingencyFraction: number
  hybridOnPremFactor: number
}

/** Dokumentmengen (sheet `02` block 6). */
export interface DocumentCountsInputs {
  pimExport: number
  productImages: number
  sparePartImages: number
  mamPdfs: number
  pagesPerPdf: number
  charsPerPage: number
  mbPerPage: number
  serviceOrderCharacters: number
}

export interface CalcModel {
  horizonYears: number
  scaling: ScalingInputs
  rates: RatesInputs
  documents: DocumentCountsInputs
  usage: UsageInputs
  fteCosts: FteCostInputs
  benefits: BenefitInputs
  commercial: CommercialInputs
  workshopUseCases: WorkshopUseCase[]
  phase: PhaseRollup
  scenarios: ScenarioModel[]
}
