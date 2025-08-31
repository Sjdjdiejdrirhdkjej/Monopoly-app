import { playout } from '@monopoly/ai'

const seed = process.argv[2] || 'm1'
const players = (process.argv[3]?.split(',') || ['A', 'B']).filter(Boolean)
const { winner, turns } = playout(seed, players, 500)
console.log(JSON.stringify({ seed, players, winner, turns }))
