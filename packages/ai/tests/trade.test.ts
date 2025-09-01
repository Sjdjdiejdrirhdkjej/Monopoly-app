import { describe, it, expect } from 'vitest'
import { initialState, apply } from '@monopoly/rules'
import { BOARD, Phase, TileKind, Action } from '@monopoly/shared'
import { tradeProposer, tradeResponder } from '../src/tradeAgent'
import { PRESETS } from '../src/config'

const setup = () => {
  let s: any = initialState()
  s = apply(s, { type: 'StartGame', seed: 't', players: [{ name: 'A' }, { name: 'B' }] })
  // Give P0 two Reds and P1 one Red
  const reds = [21, 23, 24]
  s.ownership[21].owner = 0
  s.ownership[23].owner = 0
  s.ownership[24].owner = 1
  s.players[0].cash = 800
  s.players[1].cash = 800
  s.phase = Phase.PreRoll
  return s
}

describe('Trade agent', () => {
  it('proposes a trade to complete monopoly', () => {
    const s = setup()
    const a = tradeProposer(s, [], { params: PRESETS.Balanced, rng: { next: () => 0.1 }, memory: { auctionPass: {}, tradeRounds: {} } })
    expect(a && a.type).toBe('ProposeTrade')
  })
})
