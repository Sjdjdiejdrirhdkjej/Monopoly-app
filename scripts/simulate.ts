import { playout, PRESETS } from '@monopoly/ai'

const seed = process.argv[2] || 'm3'
const players = (process.argv[3]?.split(',') || ['A', 'B']).filter(Boolean)
const presetName = (process.argv[4] as 'Conservative' | 'Balanced' | 'Aggressive') || 'Balanced'
const { winner, turns, telemetry } = playout(seed, players, 500, PRESETS[presetName])
console.log(JSON.stringify({ seed, players, winner, turns, preset: presetName, telemetry }))
