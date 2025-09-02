import { z } from 'zod'

// WebSocket Event Schema for Monopoly Game Telemetry
// These events are sent from clients to track game progression for analytics and future multiplayer

// Base event structure
const BaseEventSchema = z.object({
  gameId: z.string(),
  playerId: z.string(),
  timestamp: z.string().datetime(),
  sessionId: z.string()
})

// Game lifecycle events
export const GameStartedEventSchema = BaseEventSchema.extend({
  type: z.literal('game_started'),
  data: z.object({
    seed: z.string(),
    playerNames: z.array(z.string()),
    aiPreset: z.string()
  })
})

export const GameEndedEventSchema = BaseEventSchema.extend({
  type: z.literal('game_ended'),
  data: z.object({
    winner: z.string(),
    duration: z.number(),
    totalTurns: z.number(),
    bankruptPlayers: z.array(z.string())
  })
})

// Turn events
export const TurnStartedEventSchema = BaseEventSchema.extend({
  type: z.literal('turn_started'),
  data: z.object({
    turnNumber: z.number(),
    playerPosition: z.number(),
    cash: z.number()
  })
})

export const DiceRolledEventSchema = BaseEventSchema.extend({
  type: z.literal('dice_rolled'),
  data: z.object({
    d1: z.number().min(1).max(6),
    d2: z.number().min(1).max(6),
    total: z.number().min(2).max(12),
    isDouble: z.boolean()
  })
})

export const MovedEventSchema = BaseEventSchema.extend({
  type: z.literal('moved'),
  data: z.object({
    fromPosition: z.number().min(0).max(39),
    toPosition: z.number().min(0).max(39),
    passedGo: z.boolean()
  })
})

export const LandedEventSchema = BaseEventSchema.extend({
  type: z.literal('landed'),
  data: z.object({
    position: z.number().min(0).max(39),
    tileName: z.string(),
    tileType: z.string(),
    ownedBy: z.string().optional()
  })
})

// Property events
export const RentPaidEventSchema = BaseEventSchema.extend({
  type: z.literal('rent_paid'),
  data: z.object({
    amount: z.number(),
    to: z.string(),
    property: z.string(),
    propertyGroup: z.string().optional(),
    houses: z.number().optional(),
    hotel: z.boolean().optional()
  })
})

export const BoughtPropertyEventSchema = BaseEventSchema.extend({
  type: z.literal('bought_property'),
  data: z.object({
    property: z.string(),
    price: z.number(),
    propertyGroup: z.string().optional(),
    position: z.number().min(0).max(39)
  })
})

// Auction events
export const AuctionStartedEventSchema = BaseEventSchema.extend({
  type: z.literal('auction_started'),
  data: z.object({
    property: z.string(),
    participants: z.array(z.string()),
    startingBid: z.number()
  })
})

export const BidPlacedEventSchema = BaseEventSchema.extend({
  type: z.literal('bid_placed'),
  data: z.object({
    amount: z.number(),
    property: z.string(),
    previousBid: z.number(),
    isAI: z.boolean(),
    aiRationale: z.string().optional()
  })
})

export const AuctionWonEventSchema = BaseEventSchema.extend({
  type: z.literal('auction_won'),
  data: z.object({
    property: z.string(),
    finalBid: z.number(),
    totalBids: z.number(),
    participantCount: z.number()
  })
})

// Trading events
export const TradeProposedEventSchema = BaseEventSchema.extend({
  type: z.literal('trade_proposed'),
  data: z.object({
    to: z.string(),
    cashOffered: z.number(),
    cashRequested: z.number(),
    propertiesOffered: z.array(z.string()),
    propertiesRequested: z.array(z.string()),
    jailCardsOffered: z.number(),
    jailCardsRequested: z.number()
  })
})

export const TradeResolvedEventSchema = BaseEventSchema.extend({
  type: z.literal('trade_resolved'),
  data: z.object({
    accepted: z.boolean(),
    reason: z.string().optional(),
    totalValue: z.number()
  })
})

// Jail events
export const JailedEventSchema = BaseEventSchema.extend({
  type: z.literal('jailed'),
  data: z.object({
    reason: z.string(), // 'card', 'gotojail', 'doubles'
    previousPosition: z.number()
  })
})

export const ReleasedFromJailEventSchema = BaseEventSchema.extend({
  type: z.literal('released_from_jail'),
  data: z.object({
    method: z.string(), // 'payment', 'card', 'doubles'
    amount: z.number().optional(),
    turnsInJail: z.number()
  })
})

// Bankruptcy event
export const BankruptEventSchema = BaseEventSchema.extend({
  type: z.literal('bankrupt'),
  data: z.object({
    creditor: z.string(),
    debt: z.number(),
    assetsTransferred: z.number(),
    turnNumber: z.number()
  })
})

// Union of all event types
export const GameEventSchema = z.union([
  GameStartedEventSchema,
  GameEndedEventSchema,
  TurnStartedEventSchema,
  DiceRolledEventSchema,
  MovedEventSchema,
  LandedEventSchema,
  RentPaidEventSchema,
  BoughtPropertyEventSchema,
  AuctionStartedEventSchema,
  BidPlacedEventSchema,
  AuctionWonEventSchema,
  TradeProposedEventSchema,
  TradeResolvedEventSchema,
  JailedEventSchema,
  ReleasedFromJailEventSchema,
  BankruptEventSchema
])

// Event batch for efficient transmission
export const EventBatchSchema = z.object({
  sessionId: z.string(),
  gameId: z.string(),
  events: z.array(GameEventSchema),
  clientTimestamp: z.string().datetime(),
  sequenceNumber: z.number()
})

// WebSocket message wrapper
export const WebSocketMessageSchema = z.object({
  id: z.string(),
  type: z.enum(['event_batch', 'ping', 'pong', 'subscribe', 'unsubscribe']),
  payload: z.union([
    EventBatchSchema,
    z.object({ gameId: z.string() }), // subscribe/unsubscribe
    z.object({}) // ping/pong
  ]).optional()
})

// Type exports
export type GameEvent = z.infer<typeof GameEventSchema>
export type EventBatch = z.infer<typeof EventBatchSchema>
export type WebSocketMessage = z.infer<typeof WebSocketMessageSchema>

// Event type helpers
export const createEvent = <T extends GameEvent['type']>(
  type: T,
  baseInfo: z.infer<typeof BaseEventSchema>,
  data: Extract<GameEvent, { type: T }>['data']
): Extract<GameEvent, { type: T }> => {
  return {
    type,
    ...baseInfo,
    data
  } as Extract<GameEvent, { type: T }>
}

// Validation helpers
export const validateEventBatch = (data: unknown): EventBatch => {
  return EventBatchSchema.parse(data)
}

export const validateWebSocketMessage = (data: unknown): WebSocketMessage => {
  return WebSocketMessageSchema.parse(data)
}