const chfFmt = new Intl.NumberFormat("de-CH", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

const numFmt = new Intl.NumberFormat("de-CH", {
  maximumFractionDigits: 6,
})

export function formatChf(n: number): string {
  return `${chfFmt.format(n)} CHF`
}

export function formatNum(n: number): string {
  return numFmt.format(n)
}

export function formatPct(n: number, digits = 1): string {
  return `${(n * 100).toFixed(digits)} %`
}
