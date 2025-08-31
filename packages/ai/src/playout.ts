import { Action, GameState, Phase } from '@monopoly/shared'
import { apply, initialState } from '@monopoly/rules'
import { chooseAction } from './policy'

export const newGame = (seed: string, names: string[]): GameState => {
  let s = initialState()
  s = apply(s, { type: 'StartGame', seed, players: names.map(n => ({ name: n })) })
  return s
}

export const playout = (seed: string, names: string[], maxTurns = 500): { winner: number | null; turns: number; state: GameState } => {
  let s = newGame(seed, names)
  let turns = 0
  while (s.phase !== Phase.GameOver && turns < maxTurns) {
    const legal = inferLegal(s)
    const action = chooseAction(s, legal)
    s = apply(s, action)
    if (action.type === 'EndTurn') turns += 1
  }
  return { winner: s.winner, turns, state: s }
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
