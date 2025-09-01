import { describe, it, expect } from 'vitest'
import { estimatePropertyEV } from '../src/eval'
import { initialState, apply } from '@monopoly/rules'
import { BOARD, Phase } from '@monopoly/shared'
import { PRESETS } from '../src/config'

const setup = () => {
  let s = initialState()
  s = apply(s, { type: 'StartGame', seed: 't', players: [{ name: 'A' }, { name: 'B' }] })
  return s
}

describe('EV estimation sanity', () => {
  it('values cheap properties reasonably', () => {
    const s = setup()
    const brown1 = 1
    const ev = estimatePropertyEV(s, 0, brown1, PRESETS.Balanced)
    expect(ev).toBeGreaterThan(BOARD[brown1].price * 0.5)
  })
})
