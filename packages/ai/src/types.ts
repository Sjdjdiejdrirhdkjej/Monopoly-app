import { GameState, Action } from '@monopoly/shared'

export type AiParams = {
  riskK: number
  liquidityBuffer: number
  temperature: number
  lookaheadTurns: number
  auctionAggression: number
  tradeMaxRounds: number
  tradeMinDelta: number
  buildMinCashBuffer: number
}

export type AiMemory = {
  auctionPass: Record<string, boolean>
  tradeRounds: Record<string, number>
}

export type AiRng = {
  next: () => number
}

export type AiContext = {
  params: AiParams
  rng: AiRng
  memory: AiMemory
}

export type Policy = (s: GameState, legal: Action[], ctx: AiContext) => Action
