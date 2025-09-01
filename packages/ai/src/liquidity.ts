import { GameState } from '@monopoly/shared'
import { selectors } from '@monopoly/rules'

export const ensureLiquidity = (s: GameState, pid: number, minCash: number): { actions: { type: 'Sell'; tile: number }[] } => {
  const p = s.players[pid]
  if (p.cash >= minCash) return { actions: [] }
  const sells = selectors.legalSellTiles(s, pid).sort((a, b) => b.value - a.value)
  const actions: { type: 'Sell'; tile: number }[] = []
  let need = minCash - p.cash
  for (const sel of sells) {
    actions.push({ type: 'Sell', tile: sel.tile })
    need -= sel.value
    if (need <= 0) break
  }
  return { actions }
}
