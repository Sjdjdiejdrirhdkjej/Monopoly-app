import { Action, Phase, TradeOffer, TileKind } from '@monopoly/shared'
import { selectors } from '@monopoly/rules'
import { AiContext } from './types'
import { evaluatePlayer } from './eval'

const key = (from: number, to: number, tilesFrom: number[], tilesTo: number[]) => `${from}->${to}:${tilesFrom.sort().join(',')}|${tilesTo.sort().join(',')}`

export const tradeResponder = (s: any, legal: Action[], ctx: AiContext): Action | null => {
  if (!s.trade?.active || !s.trade.offer) return null
  const offer = s.trade.offer as TradeOffer
  const pid = s.currentPlayer
  if (!(offer.to === pid)) return null
  const before = evaluatePlayer(s, pid, ctx.params).score
  const s2 = JSON.parse(JSON.stringify(s))
  // apply trade hypothetically using rules' apply invariants; quick simulate
  const from = s2.players[offer.from]
  const to = s2.players[offer.to]
  if (from.cash < offer.cashFrom || to.cash < offer.cashTo) return { type: 'RejectTrade' }
  from.cash -= offer.cashFrom
  to.cash += offer.cashFrom
  to.cash -= offer.cashTo
  from.cash += offer.cashTo
  for (const t of offer.tilesFrom) s2.ownership[t].owner = offer.to
  for (const t of offer.tilesTo) s2.ownership[t].owner = offer.from
  const after = evaluatePlayer(s2, pid, ctx.params).score
  if (after - before >= ctx.params.tradeMinDelta) return { type: 'AcceptTrade' }
  return { type: 'RejectTrade' }
}

export const tradeProposer = (s: any, _legal: Action[], ctx: AiContext): Action | null => {
  if (s.phase !== Phase.PreRoll && s.phase !== Phase.EndTurn) return null
  if (s.auction?.active) return null
  if (s.trade?.active) return null
  const pid = s.currentPlayer
  // Try to find a 1-for-1 or 1-for-cash swap that gives us or them a monopoly
  const prog = selectors.monopolyProgress(s, pid)
  // Look for missing-1 groups
  const targets = prog.filter(g => g.own >= g.total - 1 && g.missing === 1)
  for (const g of targets) {
    const tiles = (selectors as any).groupTiles(g.color) as number[]
    const missingTile = tiles.find(i => (s.ownership[i]?.owner ?? null) !== pid)!
    const owner = s.ownership[missingTile]?.owner
    if (owner == null || owner === pid) continue
    // Find something to offer
    // Prefer giving them a tile that advances their own near-monopoly
    const oppProg = selectors.monopolyProgress(s, owner)
    let offerTile: number | null = null
    for (const og of oppProg) {
      if (og.own >= og.total - 1 && og.missing === 1) {
        const ogTiles = (selectors as any).groupTiles(og.color) as number[]
        const needed = ogTiles.find(i => (s.ownership[i]?.owner ?? null) !== owner)
        if (needed != null && (s.ownership[needed]?.owner ?? null) === pid) {
          offerTile = needed
          break
        }
      }
    }
    // Otherwise, offer an isolated property
    if (offerTile == null) {
      for (const [k, own] of Object.entries(s.ownership)) {
        const i = Number(k)
        if (own.owner !== pid) continue
        const t = s.board[i]
        if (t.kind === TileKind.Property) {
          const myGroup = (selectors as any).groupTiles(t.color) as number[]
          const myOwnCount = myGroup.filter(ii => s.ownership[ii]?.owner === pid).length
          if (myOwnCount === 1) {
            offerTile = i
            break
          }
        } else {
          offerTile = i
          break
        }
      }
    }
    // Price: ask small cash if symmetric, otherwise offer cash if taking their key
    let cashFrom = 0
    let cashTo = 0
    if (offerTile != null) {
      if ((s.ownership[offerTile]?.owner ?? null) === pid) {
        // we give one away to get the key
        cashFrom = 0
        cashTo = Math.max(0, Math.min(300, Math.floor(0.2 * s.players[pid].cash)))
      } else {
        cashFrom = Math.max(0, Math.min(300, Math.floor(0.2 * s.players[pid].cash)))
        cashTo = 0
      }
      const offer: TradeOffer = {
        from: pid,
        to: owner,
        cashFrom,
        cashTo,
        tilesFrom: offerTile != null ? [offerTile] : [],
        tilesTo: [missingTile],
        jailCardsFrom: 0,
        jailCardsTo: 0,
      }
      const roundsKey = key(offer.from, offer.to, offer.tilesFrom, offer.tilesTo)
      const used = (ctx.memory.tradeRounds[roundsKey] || 0)
      if (used >= ctx.params.tradeMaxRounds) continue
      ctx.memory.tradeRounds[roundsKey] = used + 1
      return { type: 'ProposeTrade', offer }
    }
  }
  return null
}
