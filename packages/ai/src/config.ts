import { AiParams } from './types'

export const PRESETS: Record<'Conservative' | 'Balanced' | 'Aggressive', AiParams> = {
  Conservative: {
    riskK: 0.6,
    liquidityBuffer: 400,
    temperature: 0.05,
    lookaheadTurns: 1,
    auctionAggression: 0.9,
    tradeMaxRounds: 2,
    tradeMinDelta: 20,
    buildMinCashBuffer: 600,
  },
  Balanced: {
    riskK: 0.8,
    liquidityBuffer: 300,
    temperature: 0.1,
    lookaheadTurns: 2,
    auctionAggression: 1.0,
    tradeMaxRounds: 3,
    tradeMinDelta: 10,
    buildMinCashBuffer: 500,
  },
  Aggressive: {
    riskK: 1.1,
    liquidityBuffer: 200,
    temperature: 0.15,
    lookaheadTurns: 2,
    auctionAggression: 1.1,
    tradeMaxRounds: 3,
    tradeMinDelta: 5,
    buildMinCashBuffer: 300,
  },
}
