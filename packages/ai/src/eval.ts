import { GameState, TileKind, DiceRoll } from '@monopoly/shared'
import { selectors } from '@monopoly/rules'
import { AiParams } from './types'

export type EvalBreakdown = {
  cash: number
  asset: number
  monoPotential: number
  riskPenalty: number
  liquidityPenalty: number
  score: number
}

export const evaluatePlayer = (s: GameState, pid: number, params: AiParams): EvalBreakdown => {
  const p = s.players[pid]
  let asset = 0
  for (const [k, own] of Object.entries(s.ownership)) {
    const i = Number(k)
    if (own.owner !== pid) continue
    const t = s.board[i]
    if (t.kind === TileKind.Property) {
      const houses = (own.hotel ? 5 : (own.houses ?? 0))
      asset += t.price + houses * t.houseCost
    } else {
      asset += t.price
    }
  }
  const monoProg = selectors.monopolyProgress(s, pid)
  let monoPotential = 0
  for (const g of monoProg) {
    if (g.own === g.total) monoPotential += 150
    else monoPotential += g.own * 30 + g.unowned * 10
  }
  const risk = selectors.expectedRentRisk(s, pid, params.lookaheadTurns)
  const liquidity = selectors.roughLiquidity(s, pid)
  const liquidityPenalty = Math.max(0, params.liquidityBuffer - liquidity.cash) * 0.2
  const riskPenalty = risk * 0.5
  const cash = p.cash
  const score = cash + asset + monoPotential - riskPenalty - liquidityPenalty
  return { cash, asset, monoPotential, riskPenalty, liquidityPenalty, score }
}

export const normalizeScores01 = (scores: number[]): number[] => {
  const min = Math.min(...scores)
  const max = Math.max(...scores)
  const range = Math.max(1, max - min)
  return scores.map(v => (v - min) / range)
}

export const estimatePropertyEV = (s: GameState, pid: number, tile: number, params: AiParams): number => {
  const t = s.board[tile]
  if (t.kind !== TileKind.Property && t.kind !== TileKind.Railroad && t.kind !== TileKind.Utility) return 0
  // Base value: book price
  let base = t.price
  // Rent value baseline
  const avgDice: DiceRoll = { d1: 3, d2: 4, total: 7, isDouble: false }
  let baseRent = 0
  if (t.kind === TileKind.Property) {
    const rc = selectors.rentCurve(s, tile)
    baseRent = rc[0]
  } else {
    baseRent = 25 // railroad rough
    if (t.kind === TileKind.Utility) baseRent = 4 * avgDice.total
  }
  // Opponent denial: if any opponent is close to monopoly on this color
  let denial = 0
  if (t.kind === TileKind.Property) {
    for (const [color, tiles] of Object.entries((selectors as any).groupTiles ? { [t.color]: (selectors as any).groupTiles(t.color) } : {})) {
      const gs = selectors.monopolyProgress(s, pid)
      const entry = gs.find(g => g.color === (t as any).color)
      if (entry) {
        for (const [oppStr, cnt] of Object.entries(entry.ownedBy)) {
          const opp = Number(oppStr)
          if (opp !== pid && cnt >= entry.total - 1) denial += 200
        }
      }
    }
  }
  // Monopoly completion potential for me
  let myMonoBoost = 0
  if (t.kind === TileKind.Property) {
    const prog = selectors.monopolyProgress(s, pid).find(g => g.color === (t as any).color)
    if (prog) {
      if (prog.own >= prog.total - 1) myMonoBoost += 200
      else if (prog.own > 0) myMonoBoost += 60
    }
  }
  // Liquidity adjustment
  const liquidity = selectors.roughLiquidity(s, pid)
  const liqAdj = liquidity.total < 400 ? -100 : 0
  const ev = base + 12 * baseRent + denial + myMonoBoost + liqAdj
  return ev
}
