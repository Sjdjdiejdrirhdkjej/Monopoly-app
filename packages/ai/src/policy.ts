import { Action, Phase, TileKind } from '@monopoly/shared'
import { selectors } from '@monopoly/rules'
import { AiContext } from './types'
import { auctionAgent } from './auctionAgent'
import { tradeProposer, tradeResponder } from './tradeAgent'
import { jailStrategy } from './jailStrategy'
import { buildStrategy } from './buildStrategy'
import { estimatePropertyEV } from './eval'

export const chooseAction = (state: any, legal: Action[], ctx: AiContext): Action => {
  // Auction handling
  const auc = auctionAgent(state, legal, ctx)
  if (auc) return auc

  // Trade response
  const tr = tradeResponder(state, legal, ctx)
  if (tr) return tr

  // Jail decisions
  const jail = jailStrategy(state, legal, ctx)
  if (jail) return jail

  // Build before roll/end if beneficial
  const build = buildStrategy(state, legal, ctx)
  if (build) return build

  // Buy decision
  if (state.phase === Phase.BuyDecision) {
    const pid = state.currentPlayer
    const pos = state.players[pid].position
    const tile = state.board[pos]
    const price = tile.price
    const ev = estimatePropertyEV(state, pid, tile.index, ctx.params)
    const canAfford = state.players[pid].cash - price >= ctx.params.liquidityBuffer
    if (canAfford && ev >= 0.8 * price) return { type: 'Buy' }
    return { type: 'DeclineBuy' }
  }

  // Optionally propose a trade sometimes at safe phases
  const tp = tradeProposer(state, legal, ctx)
  if (tp) return tp

  // Default flow
  for (const a of legal) if (a.type === 'Roll') return a
  for (const a of legal) if (a.type === 'EndTurn') return a
  for (const a of legal) if (a.type === 'AcceptTrade' || a.type === 'RejectTrade') return a
  for (const a of legal) if (a.type === 'PassBid' || a.type === 'Bid') return a
  return legal[0]
}
