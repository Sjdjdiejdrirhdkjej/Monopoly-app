import { Action, TileKind } from '@monopoly/shared'
import { selectors } from '@monopoly/rules'
import { AiContext } from './types'

export const buildStrategy = (s: any, _legal: Action[], ctx: AiContext): Action | null => {
  const pid = s.currentPlayer
  const buffer = ctx.params.buildMinCashBuffer
  if (s.players[pid].cash < buffer) return null
  // Evaluate ROI per potential house
  const options = selectors.legalBuildTiles(s, pid)
  if (options.length === 0) return null
  let best: { tile: number; roi: number } | null = null
  for (const opt of options) {
    const t = s.board[opt.tile]
    if (t.kind !== TileKind.Property) continue
    const rc = selectors.rentCurve(s, opt.tile)
    const houses = s.ownership[opt.tile]?.houses ?? 0
    const rentBefore = rc[Math.min(houses, 5)]
    const rentAfter = rc[Math.min(houses + 1, 5)]
    const delta = rentAfter - rentBefore
    const roi = delta / t.houseCost
    if (!best || roi > best.roi) best = { tile: opt.tile, roi }
  }
  if (!best) return null
  if (s.players[pid].cash - (s.board[best.tile].houseCost) < buffer) return null
  return { type: 'Build', tile: best.tile }
}
