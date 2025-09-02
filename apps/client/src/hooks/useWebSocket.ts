import React, { useEffect, useRef, useState, useCallback } from 'react'
import { GameState, Event as GameEvent } from '@monopoly/shared'
import { v4 as uuidv4 } from 'uuid'

interface TelemetryEvent {
  gameId: string
  playerId: string
  timestamp: string
  sessionId: string
  type: string
  data: any
}

interface EventBatch {
  sessionId: string
  gameId: string
  events: TelemetryEvent[]
  clientTimestamp: string
  sequenceNumber: number
}

interface WebSocketState {
  connected: boolean
  connecting: boolean
  error: string | null
  lastPing: Date | null
}

interface UseWebSocketOptions {
  url?: string
  gameId?: string
  playerId?: string
  enabled?: boolean
  batchSize?: number
  batchTimeout?: number
  reconnectDelay?: number
  maxReconnectAttempts?: number
}

export const useWebSocket = (options: UseWebSocketOptions = {}) => {
  const {
    url = 'ws://localhost:3001/ws/game',
    gameId = 'local-game',
    playerId = 'player-1',
    enabled = true,
    batchSize = 10,
    batchTimeout = 5000,
    reconnectDelay = 1000,
    maxReconnectAttempts = 5
  } = options

  const [state, setState] = useState<WebSocketState>({
    connected: false,
    connecting: false,
    error: null,
    lastPing: null
  })

  const wsRef = useRef<WebSocket | null>(null)
  const sessionId = useRef(uuidv4())
  const sequenceNumber = useRef(0)
  const eventQueue = useRef<TelemetryEvent[]>([])
  const batchTimer = useRef<NodeJS.Timeout | null>(null)
  const reconnectAttempts = useRef(0)
  const reconnectTimer = useRef<NodeJS.Timeout | null>(null)

  // Connect to WebSocket server
  const connect = useCallback(() => {
    if (!enabled || state.connecting || state.connected) return

    setState(prev => ({ ...prev, connecting: true, error: null }))

    try {
      const ws = new WebSocket(url)
      wsRef.current = ws

      ws.onopen = () => {
        console.log('🔗 WebSocket connected')
        setState(prev => ({ 
          ...prev, 
          connected: true, 
          connecting: false, 
          error: null 
        }))
        reconnectAttempts.current = 0

        // Subscribe to game
        if (gameId) {
          sendMessage({
            id: uuidv4(),
            type: 'subscribe',
            payload: { gameId }
          })
        }
      }

      ws.onclose = (event) => {
        console.log('🔌 WebSocket disconnected:', event.code, event.reason)
        setState(prev => ({ 
          ...prev, 
          connected: false, 
          connecting: false 
        }))
        wsRef.current = null

        // Attempt reconnection if enabled and not manually closed
        if (enabled && event.code !== 1000 && reconnectAttempts.current < maxReconnectAttempts) {
          const delay = Math.min(reconnectDelay * Math.pow(2, reconnectAttempts.current), 30000)
          reconnectAttempts.current++
          
          console.log(`🔄 Reconnecting in ${delay}ms (attempt ${reconnectAttempts.current}/${maxReconnectAttempts})`)
          
          reconnectTimer.current = setTimeout(() => {
            connect()
          }, delay)
        }
      }

      ws.onerror = (error) => {
        console.error('❌ WebSocket error:', error)
        setState(prev => ({ 
          ...prev, 
          error: 'Connection failed',
          connecting: false 
        }))
      }

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data)
          
          if (message.type === 'ping') {
            // Respond to ping
            sendMessage({
              id: uuidv4(),
              type: 'pong',
              payload: {}
            })
          } else if (message.type === 'pong') {
            setState(prev => ({ ...prev, lastPing: new Date() }))
          }
        } catch (error) {
          console.error('❌ Failed to parse WebSocket message:', error)
        }
      }

    } catch (error) {
      console.error('❌ Failed to create WebSocket connection:', error)
      setState(prev => ({ 
        ...prev, 
        connecting: false, 
        error: 'Failed to connect' 
      }))
    }
  }, [enabled, url, gameId, reconnectDelay, maxReconnectAttempts])

  // Send message to server
  const sendMessage = useCallback((message: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message))
      return true
    }
    return false
  }, [])

  // Flush current event batch
  const flushEvents = useCallback(() => {
    if (eventQueue.current.length === 0) return

    const batch: EventBatch = {
      sessionId: sessionId.current,
      gameId,
      events: [...eventQueue.current],
      clientTimestamp: new Date().toISOString(),
      sequenceNumber: sequenceNumber.current++
    }

    const sent = sendMessage({
      id: uuidv4(),
      type: 'event_batch',
      payload: batch
    })

    if (sent) {
      console.log(`📤 Sent batch of ${batch.events.length} events`)
      eventQueue.current = []
    }

    if (batchTimer.current) {
      clearTimeout(batchTimer.current)
      batchTimer.current = null
    }
  }, [gameId, sendMessage])

  // Add event to queue
  const publishEvent = useCallback((type: string, data: any) => {
    if (!enabled) return

    const event: TelemetryEvent = {
      gameId,
      playerId,
      timestamp: new Date().toISOString(),
      sessionId: sessionId.current,
      type,
      data
    }

    eventQueue.current.push(event)

    // Flush immediately if batch is full
    if (eventQueue.current.length >= batchSize) {
      flushEvents()
    } else {
      // Set timer for batch flush
      if (batchTimer.current) {
        clearTimeout(batchTimer.current)
      }
      batchTimer.current = setTimeout(flushEvents, batchTimeout)
    }
  }, [enabled, gameId, playerId, batchSize, batchTimeout, flushEvents])

  // Disconnect
  const disconnect = useCallback(() => {
    if (reconnectTimer.current) {
      clearTimeout(reconnectTimer.current)
      reconnectTimer.current = null
    }

    if (batchTimer.current) {
      clearTimeout(batchTimer.current)
      batchTimer.current = null
    }

    // Flush any remaining events
    flushEvents()

    if (wsRef.current) {
      wsRef.current.close(1000, 'Client disconnect')
      wsRef.current = null
    }

    setState({
      connected: false,
      connecting: false,
      error: null,
      lastPing: null
    })
  }, [flushEvents])

  // Connect on mount if enabled
  useEffect(() => {
    if (enabled) {
      connect()
    }
    
    return () => {
      disconnect()
    }
  }, [enabled, connect, disconnect])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect()
    }
  }, [disconnect])

  return {
    state,
    connect,
    disconnect,
    publishEvent,
    flushEvents,
    isConnected: state.connected
  }
}

// Hook to automatically publish game events
export const useGameTelemetry = (gameState: GameState | null, enabled = true) => {
  const ws = useWebSocket({ 
    enabled,
    gameId: gameState ? `game-${gameState.seed}` : undefined,
    playerId: gameState ? `player-${gameState.currentPlayer}` : undefined
  })
  
  const lastLogLength = useRef(0)
  const publishedEvents = useRef(new Set<string>())

  // Publish new events from game log
  useEffect(() => {
    if (!gameState || !ws.isConnected) return

    const newEvents = gameState.logs.slice(lastLogLength.current)
    
    for (const event of newEvents) {
      const eventKey = `${event.type}-${lastLogLength.current}`
      
      if (publishedEvents.current.has(eventKey)) continue
      
      publishedEvents.current.add(eventKey)
      
      // Convert game events to telemetry events
      switch (event.type) {
        case 'GameStarted':
          ws.publishEvent('game_started', {
            seed: event.seed,
            playerNames: gameState.players.map(p => p.name),
            aiPreset: 'Unknown' // Could be passed from props
          })
          break

        case 'TurnStarted':
          ws.publishEvent('turn_started', {
            turnNumber: gameState.logs.filter(e => e.type === 'TurnStarted').length,
            playerPosition: gameState.players[event.player].position,
            cash: gameState.players[event.player].cash
          })
          break

        case 'Rolled':
          ws.publishEvent('dice_rolled', {
            d1: event.d1,
            d2: event.d2,
            total: event.d1 + event.d2,
            isDouble: event.d1 === event.d2
          })
          break

        case 'Moved':
          ws.publishEvent('moved', {
            fromPosition: event.from,
            toPosition: event.to,
            passedGo: event.to < event.from // Simple heuristic
          })
          break

        case 'BoughtProperty':
          const tile = gameState.board[event.tile]
          ws.publishEvent('bought_property', {
            property: tile.name,
            price: event.price,
            propertyGroup: tile.kind === 'Property' ? tile.color : undefined,
            position: event.tile
          })
          break

        case 'StartedAuction':
          const auctionTile = gameState.board[event.tile]
          ws.publishEvent('auction_started', {
            property: auctionTile.name,
            participants: gameState.players.map(p => p.name),
            startingBid: 0
          })
          break

        case 'Bid':
          ws.publishEvent('bid_placed', {
            amount: event.amount,
            property: gameState.auction ? gameState.board[gameState.auction.tile].name : 'Unknown',
            previousBid: (gameState.auction?.currentBid || 0),
            isAI: false, // Could be determined from player type
            aiRationale: undefined
          })
          break

        case 'TradeProposed':
          ws.publishEvent('trade_proposed', {
            to: gameState.players[event.offer.to].name,
            cashOffered: event.offer.cashFrom,
            cashRequested: event.offer.cashTo,
            propertiesOffered: event.offer.tilesFrom.map(t => gameState.board[t].name),
            propertiesRequested: event.offer.tilesTo.map(t => gameState.board[t].name),
            jailCardsOffered: event.offer.jailCardsFrom,
            jailCardsRequested: event.offer.jailCardsTo
          })
          break

        case 'TradeAccepted':
        case 'TradeRejected':
          ws.publishEvent('trade_resolved', {
            accepted: event.type === 'TradeAccepted',
            reason: event.type === 'TradeRejected' ? 'Declined by player' : 'Accepted',
            totalValue: event.offer.cashFrom + event.offer.cashTo // Simplified
          })
          break

        case 'WentToJail':
          ws.publishEvent('jailed', {
            reason: 'card', // Could be more specific
            previousPosition: gameState.players[event.player].position
          })
          break

        case 'Bankrupt':
          ws.publishEvent('bankrupt', {
            creditor: typeof event.to === 'number' ? gameState.players[event.to].name : 'Bank',
            debt: 0, // Could be calculated
            assetsTransferred: 0, // Could be calculated
            turnNumber: gameState.logs.filter(e => e.type === 'TurnStarted').length
          })
          break

        default:
          // Don't publish unknown event types
          break
      }
    }

    lastLogLength.current = gameState.logs.length
  }, [gameState, ws.isConnected, ws.publishEvent])

  // Publish game end event
  useEffect(() => {
    if (!gameState || gameState.phase !== 'GameOver' || !ws.isConnected) return

    const winner = gameState.players.find(p => !p.bankrupt)
    const duration = Date.now() - (gameState as any).startTime || 0 // Would need to add startTime to state

    ws.publishEvent('game_ended', {
      winner: winner?.name || 'Unknown',
      duration: Math.floor(duration / 1000),
      totalTurns: gameState.logs.filter(e => e.type === 'TurnStarted').length,
      bankruptPlayers: gameState.players.filter(p => p.bankrupt).map(p => p.name)
    })
  }, [gameState?.phase, ws.isConnected, ws.publishEvent])

  return {
    connectionState: ws.state,
    isConnected: ws.isConnected,
    connect: ws.connect,
    disconnect: ws.disconnect,
    publishEvent: ws.publishEvent
  }
}

// React context for WebSocket telemetry
export const TelemetryContext = React.createContext<{
  publishEvent: (type: string, data: any) => void
  isConnected: boolean
} | null>(null)