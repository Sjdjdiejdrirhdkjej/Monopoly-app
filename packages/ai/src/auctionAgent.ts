import { Action, Phase } from '@monopoly/shared'
import { selectors } from '@monopoly/rules'
import { AiContext } from './types'
import { estimatePropertyEV } from './eval'

export const auctionAgent = (s: any, legal: Action[], ctx: AiContext): Action | null => {
  if (!(s.phase === Phase.Auction && s.auction?.active)) return null
  const pid = s.currentPlayer
  const auc = s.auction!
  const maxAffordable = Math.max(0, s.players[pid].cash - ctx.params.liquidityBuffer)
  const ev = estimatePropertyEV(s, pid, auc.tile, ctx.params)
  const cap = Math.max(0, Math.floor(ctx.params.riskK * ctx.params.auctionAggression * ev))
  const maxBid = Math.min(cap, maxAffordable)
  const nextBid = (auc.currentBid || 0) + (auc.minIncrement || 10)
  if (nextBid <= maxBid) return { type: 'Bid', amount: nextBid }
  return { type: 'PassBid' }
}
