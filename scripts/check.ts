import { apply, initialState } from '../packages/rules/src/index'

const s0 = initialState()
const s1 = apply(s0, { type: 'StartGame', seed: 'x', players: [{ name: 'A' }, { name: 'B' }] })
console.log('phase', s1.phase)
console.log('ownership keys', Object.keys(s1.ownership).length)
console.log('pos0 owner entry', s1.ownership[1])
