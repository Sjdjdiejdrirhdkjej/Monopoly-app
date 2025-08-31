import { Action, GameState, Phase } from '@monopoly/shared'
import { apply, initialState } from '@monopoly/rules'
import { chooseAction } from './policy'
import { createAiRng } from './rng'
import { AiContext, AiParams } from './types'
import { PRESETS } from './config'

export const newGame = (seed: string, names: string[]): GameState => {
  let s = initialState()
  s = apply(s, { type: 'StartGame', seed, players: names.map(n => ({ name: n })) })
  return s
}

export type Telemetry = {
  winner: number | null
  turns: number
  auctions: number
  bids: number
  tradesProposed: number
  tradesAccepted: number
  bankruptcies: number
}

export const playout = (
  seed: string,
  names: string[],
  maxTurns = 500,
  params: AiParams = PRESETS.Balanced,
): { winner: number | null; turns: number; state: GameState; telemetry: Telemetry } => {
  let s = newGame(seed, names)
  let turns = 0
  const ctx: AiContext = {
    params,
    rng: createAiRng(seed + '/ai'),
    memory: { auctionPass: {}, tradeRounds: {} },
  }
  const telemetry: Telemetry = { winner: null, turns: 0, auctions: 0, bids: 0, tradesProposed: 0, tradesAccepted: 0, bankruptcies: 0 }
  while (s.phase !== Phase.GameOver && turns < maxTurns) {
    const legal = inferLegal(s)
    const action = chooseAction(s, legal, ctx)
    if (action.type === 'Bid') telemetry.bids += 1
    if (action.type === 'PassBid') {}
    if (action.type === 'ProposeTrade') telemetry.tradesProposed += 1
    if (action.type === 'AcceptTrade') telemetry.tradesAccepted += 1
    if (s.phase === Phase.Auction && s.auction?.active) telemetry.auctions += 0 // count only on start event
    const prevBankrupt = s.players.filter(p => p.bankrupt).length
    s = apply(s, action)
    const nowBankrupt = s.players.filter(p => p.bankrupt).length
    if (nowBankrupt > prevBankrupt) telemetry.bankruptcies += nowBankrupt - prevBankrupt
    if (action.type === 'EndTurn') turns += 1
  }
  telemetry.winner = s.winner
  telemetry.turns = turns
  return { winner: s.winner, turns, state: s, telemetry }
}

const inferLegal = (s: GameState): Action[] => {
  const acts: Action[] = []
  if (s.phase === Phase.PreRoll) {
    if (s.players[s.currentPlayer].inJail) {
      acts.push({ type: 'PayJail' }, { type: 'TryDoubles' })
      if (s.players[s.currentPlayer].getOutOfJailCards > 0) acts.push({ type: 'UseJailCard' })
    } else acts.push({ type: 'Roll' })
  } else if (s.phase === Phase.BuyDecision) {
    acts.push({ type: 'Buy' }, { type: 'DeclineBuy' })
  } else if (s.phase === Phase.Auction && s.auction?.active) {
    acts.push({ type: 'Bid', amount: (s.auction.currentBid || 0) + 10 }, { type: 'PassBid' })
  } else if (s.phase === Phase.EndTurn) {
    acts.push({ type: 'EndTurn' })
  } else if (s.trade?.active && s.trade.offer) {
    acts.push({ type: 'AcceptTrade' }, { type: 'RejectTrade' })
  }
  return acts.length ? acts : [{ type: 'EndTurn' }]
}
