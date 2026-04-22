import type { CalcModel } from "./model"

export interface UsageYearSeries {
  mau: number[]
  interactions: number[]
  inputTokens: number[]
  outputTokens: number[]
  ragRequests: number[]
  actionInteractions: number[]
  flowActions: number[]
  peakInteractionsPerHour: number[]
  peakTokensPerSecond: number[]
}

export function computeUsage(model: CalcModel): UsageYearSeries {
  const n = model.horizonYears
  const u = model.usage
  const q = u.activeUserShareY
  if (q.length !== n) {
    throw new Error("activeUserShareY length must equal horizonYears")
  }

  const mau: number[] = []
  const interactions: number[] = []
  const inputTokens: number[] = []
  const outputTokens: number[] = []
  const ragRequests: number[] = []
  const actionInteractions: number[] = []
  const flowActions: number[] = []
  const peakInteractionsPerHour: number[] = []
  const peakTokensPerSecond: number[] = []

  const tokenInPerIx =
    u.inputTokensPerInteraction +
    u.imageInteractionFraction * u.extraInputTokensForImage
  const tokenOutPerIx = u.outputTokensPerInteraction

  for (let yi = 0; yi < n; yi++) {
    const m = u.potentialUsers * q[yi]!
    mau.push(m)
    const ix =
      m *
      u.interactionsPerActiveUserPerWorkday *
      u.workdaysPerYear *
      u.actionsPerInteraction
    interactions.push(ix)
    inputTokens.push(ix * tokenInPerIx)
    outputTokens.push(ix * tokenOutPerIx)
    ragRequests.push(ix * u.ragInteractionFraction)
    const actIx = ix * u.actionInteractionFraction
    actionInteractions.push(actIx)
    flowActions.push(actIx * u.actionsPerInteraction)
    const denom = u.workdaysPerMonth * 12 * u.operatingHoursPerDay
    peakInteractionsPerHour.push((ix / denom) * u.peakLoadMultiplier)
    peakTokensPerSecond.push(
      ((ix / denom) * u.peakLoadMultiplier * (tokenInPerIx + tokenOutPerIx)) /
        3600,
    )
  }

  return {
    mau,
    interactions,
    inputTokens,
    outputTokens,
    ragRequests,
    actionInteractions,
    flowActions,
    peakInteractionsPerHour,
    peakTokensPerSecond,
  }
}
