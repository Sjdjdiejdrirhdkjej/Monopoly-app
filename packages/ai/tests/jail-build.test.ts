import { describe, it, expect } from 'vitest'
import { initialState, apply } from '@monopoly/rules'
import { Action, Phase, TileKind } from '@monopoly/shared'
import { jailStrategy } from '../src/jailStrategy'
import { buildStrategy } from '../src/buildStrategy'
import { PRESETS } from '../src/config'

const setupJailRisk = () => {
  let s: any = initialState()
  s = apply(s, { type: 'StartGame', seed: 't', players: [{ name: 'A' }, { name: 'B' }] })
  s.players[0].inJail = true
  s.phase = Phase.PreRoll
  // Give opponent DarkBlue monopoly with hotels to raise risk
  s.ownership[37].owner = 1
  s.ownership[39].owner = 1
  s.ownership[37].hotel = true
  s.ownership[39].hotel = true
  s.players[0].cash = 200
  return s
}

const setupBuild = () => {
  let s: any = initialState()
  s = apply(s, { type: 'StartGame', seed: 't', players: [{ name: 'A' }, { name: 'B' }] })
  // Give P0 Orange monopoly
  s.ownership[16].owner = 0
  s.ownership[18].owner = 0
  s.ownership[19].owner = 0
  s.players[0].cash = 2000
  s.phase = Phase.EndTurn
  return s
}

describe('Jail/build strategies', () => {
  it('chooses to try doubles when risky and low cash', () => {
    const s = setupJailRisk()
    const a = jailStrategy(s, [{ type: 'PayJail' }, { type: 'TryDoubles' } as Action], { params: PRESETS.Balanced, rng: { next: () => 0.1 }, memory: { auctionPass: {}, tradeRounds: {} } })
    expect(a && a.type).toBe('TryDoubles')
  })
  it('builds on best ROI tile within buffer', () => {
    const s = setupBuild()
    const a = buildStrategy(s, [], { params: PRESETS.Balanced, rng: { next: () => 0.1 }, memory: { auctionPass: {}, tradeRounds: {} } })
    expect(a && a.type).toBe('Build')
  })
})
