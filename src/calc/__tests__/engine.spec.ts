import { describe, expect, it } from "vitest"

import { computeEngine } from "@/calc/engine"
import { defaultModel } from "@/state/defaultModel"

const EPS = 0.02

describe("computeEngine vs Digital_Assistant_Szenario_Berechnung_v11-1", () => {
  const r = computeEngine(defaultModel)

  it("matches external PoC PD", () => {
    const ext = r.scenarios.map((s) => s.financials.externalPdPoc)
    expect(ext[0]).toBeCloseTo(91.375, 6)
    expect(ext[1]).toBeCloseTo(123.625, 6)
    expect(ext[2]).toBeCloseTo(129, 6)
    expect(ext[3]).toBeCloseTo(107.5, 6)
    expect(ext[4]).toBeCloseTo(118.25, 6)
  })

  it("matches implementation investment (CHF)", () => {
    const impl = r.scenarios.map((s) => s.financials.implementationChf)
    expect(impl[0]).toBeCloseTo(849_830, EPS)
    expect(impl[1]).toBeCloseTo(1_149_770, EPS)
    expect(impl[2]).toBeCloseTo(1_199_760, EPS)
    expect(impl[3]).toBeCloseTo(999_800, EPS)
    expect(impl[4]).toBeCloseTo(1_099_780, EPS)
  })

  it("matches steady OPEX Y4", () => {
    const opex = r.scenarios.map((s) => s.financials.steadyOpexAnnualYRef)
    expect(opex[0]).toBeCloseTo(548_669.63, EPS)
    expect(opex[1]).toBeCloseTo(415_234.36, EPS)
    expect(opex[2]).toBeCloseTo(388_869.03, EPS)
    expect(opex[3]).toBeCloseTo(329_073.67, EPS)
    expect(opex[4]).toBeCloseTo(386_245.33, EPS)
  })

  it("matches 5Y TCO", () => {
    const tco = r.scenarios.map((s) => s.financials.fiveYearTco)
    expect(tco[0]).toBeCloseTo(3_305_878.54, EPS)
    expect(tco[1]).toBeCloseTo(3_180_398.3, EPS)
    expect(tco[2]).toBeCloseTo(3_134_996.46, EPS)
    expect(tco[3]).toBeCloseTo(2_626_950.92, EPS)
    expect(tco[4]).toBeCloseTo(2_994_571.84, EPS)
  })

  it("matches steady benefit", () => {
    const steady = r.scenarios.map((s) => s.value.steadyTotal)
    expect(steady[0]).toBeCloseTo(1_207_439.484_267_83, 6)
    expect(steady[1]).toBeCloseTo(1_349_491.188_299_339_3, 6)
    expect(steady[2]).toBeCloseTo(1_349_491.188_299_339_3, 6)
    expect(steady[3]).toBeCloseTo(1_278_465.336_283_584_6, 6)
    expect(steady[4]).toBeCloseTo(1_349_491.188_299_339_3, 6)
  })

  it("matches 5Y net value", () => {
    const net = r.scenarios.map((s) => s.value.fiveYearNetValue)
    expect(net[0]).toBeCloseTo(1_389_719, EPS)
    expect(net[1]).toBeCloseTo(2_067_623, EPS)
    expect(net[2]).toBeCloseTo(2_113_025, EPS)
    expect(net[3]).toBeCloseTo(2_344_859, EPS)
    expect(net[4]).toBeCloseTo(2_253_449, EPS)
  })

  it("matches payback months", () => {
    const pb = r.scenarios.map((s) => s.value.paybackMonths)
    expect(pb[0]).toBeCloseTo(15.480_307_524_424_997, 6)
    expect(pb[1]).toBeCloseTo(14.768_144_706_200_593, 6)
    expect(pb[2]).toBeCloseTo(14.987_287_053_816_424, 6)
    expect(pb[3]).toBeCloseTo(12.637_144_775_522_3, 6)
    expect(pb[4]).toBeCloseTo(13.700_925_764_114_713, 6)
  })

  it("ranks GCP Vertex first", () => {
    const vertex = r.scenarios.find((s) => s.id === "gcp-vertex")
    expect(vertex?.rank).toBe(1)
  })
})
