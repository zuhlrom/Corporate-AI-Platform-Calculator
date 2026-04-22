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

export interface ScenarioModel {
  id: string
  name: string
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
  overrideDirectCreditBenefitCHF: number
  /** When >0, lever 3 CHF = overrideAvoidedDirectCredits × (directCreditVolumeCHF / directCreditsPerYear). */
  conservativeEfficiencyFactor: number
}

export interface CommercialInputs {
  activeInBaseCase: boolean
  haircutFraction: number
  /** Primary conversion-uplift path (sheet `06` D34) when active. */
  conversionUpliftCurrentCHFGross: number
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

export interface CalcModel {
  horizonYears: number
  usage: UsageInputs
  fteCosts: FteCostInputs
  benefits: BenefitInputs
  commercial: CommercialInputs
  phase: PhaseRollup
  scenarios: ScenarioModel[]
}
