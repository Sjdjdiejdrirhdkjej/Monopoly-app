import { describe, it, expect } from 'vitest'
import { auctionAgent } from '../src/auctionAgent'
import { initialState, apply } from '@monopoly/rules'
import { Action, Phase } from '@monopoly/shared'
import { PRESETS } from '../src/config'

const setupAuction = () => {
  let s: any = initialState()
  s = apply(s, { type: 'StartGame', seed: 't', players: [{ name: 'A' }, { name: 'B' }] })
  s.phase = Phase.Auction
  s.auction = { active: true, tile: 1, currentBid: 0, highestBidder: null, participants: [0, 1], minIncrement: 10 }
  s.players[0].cash = 1000
  return s
}

describe('Auction agent', () => {
  it('makes a bid under cap', () => {
    const s = setupAuction()
    const legal: Action[] = [{ type: 'Bid', amount: 10 }, { type: 'PassBid' }]
    const a = auctionAgent(s, legal, { params: PRESETS.Balanced, rng: { next: () => 0.5 }, memory: { auctionPass: {}, tradeRounds: {} } })
    expect(a && a.type).toBe('Bid')
  })
})
