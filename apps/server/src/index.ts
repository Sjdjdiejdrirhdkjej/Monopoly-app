import { WebSocketServer, WebSocket } from 'ws'
import { v4 as uuidv4 } from 'uuid'
import * as fs from 'fs/promises'
import * as path from 'path'
import { validateEventBatch, validateWebSocketMessage, EventBatch, GameEvent } from './events.js'

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001
const LOG_DIR = process.env.LOG_DIR || './logs'

interface GameSession {
  gameId: string
  clients: Set<WebSocket>
  events: GameEvent[]
  createdAt: Date
  lastActivity: Date
}

interface ClientInfo {
  id: string
  gameId?: string
  connectedAt: Date
  lastPing: Date
}

class MonopolyTelemetryServer {
  private wss: WebSocketServer
  private sessions: Map<string, GameSession> = new Map()
  private clients: Map<WebSocket, ClientInfo> = new Map()
  private eventQueue: EventBatch[] = []
  private logStream: any = null

  constructor() {
    this.wss = new WebSocketServer({ 
      port: PORT,
      path: '/ws/game'
    })
    
    console.log(`🎯 Monopoly Telemetry Server starting on ws://localhost:${PORT}/ws/game`)
    this.setupEventHandlers()
    this.initializeLogging()
    this.startPeriodicTasks()
  }

  private setupEventHandlers() {
    this.wss.on('connection', (ws, req) => {
      const clientId = uuidv4()
      const clientInfo: ClientInfo = {
        id: clientId,
        connectedAt: new Date(),
        lastPing: new Date()
      }
      
      this.clients.set(ws, clientInfo)
      console.log(`📱 Client connected: ${clientId} from ${req.socket.remoteAddress}`)

      ws.on('message', async (data) => {
        try {
          await this.handleMessage(ws, data)
        } catch (error) {
          console.error('❌ Message handling error:', error)
          this.sendError(ws, 'Invalid message format', error instanceof Error ? error.message : 'Unknown error')
        }
      })

      ws.on('close', () => {
        this.handleDisconnection(ws)
      })

      ws.on('error', (error) => {
        console.error('❌ WebSocket error:', error)
        this.handleDisconnection(ws)
      })

      // Send welcome message
      this.sendMessage(ws, {
        id: uuidv4(),
        type: 'ping',
        payload: {}
      })
    })
  }

  private async handleMessage(ws: WebSocket, data: any) {
    const message = validateWebSocketMessage(JSON.parse(data.toString()))
    const clientInfo = this.clients.get(ws)
    
    if (!clientInfo) {
      this.sendError(ws, 'Client not registered')
      return
    }

    switch (message.type) {
      case 'ping':
        clientInfo.lastPing = new Date()
        this.sendMessage(ws, {
          id: uuidv4(),
          type: 'pong',
          payload: {}
        })
        break

      case 'subscribe':
        if (message.payload && 'gameId' in message.payload) {
          await this.subscribeToGame(ws, message.payload.gameId)
        }
        break

      case 'unsubscribe':
        this.unsubscribeFromGame(ws)
        break

      case 'event_batch':
        if (message.payload) {
          await this.handleEventBatch(ws, message.payload as EventBatch)
        }
        break

      default:
        this.sendError(ws, 'Unknown message type')
    }
  }

  private async subscribeToGame(ws: WebSocket, gameId: string) {
    const clientInfo = this.clients.get(ws)
    if (!clientInfo) return

    // Unsubscribe from previous game if any
    this.unsubscribeFromGame(ws)

    // Subscribe to new game
    clientInfo.gameId = gameId
    
    let session = this.sessions.get(gameId)
    if (!session) {
      session = {
        gameId,
        clients: new Set(),
        events: [],
        createdAt: new Date(),
        lastActivity: new Date()
      }
      this.sessions.set(gameId, session)
      console.log(`🎮 Created new game session: ${gameId}`)
    }

    session.clients.add(ws)
    session.lastActivity = new Date()
    
    console.log(`🔗 Client ${clientInfo.id} subscribed to game ${gameId} (${session.clients.size} clients)`)
  }

  private unsubscribeFromGame(ws: WebSocket) {
    const clientInfo = this.clients.get(ws)
    if (!clientInfo || !clientInfo.gameId) return

    const session = this.sessions.get(clientInfo.gameId)
    if (session) {
      session.clients.delete(ws)
      
      // Clean up empty sessions after delay
      if (session.clients.size === 0) {
        setTimeout(() => {
          const currentSession = this.sessions.get(clientInfo.gameId!)
          if (currentSession && currentSession.clients.size === 0) {
            this.sessions.delete(clientInfo.gameId!)
            console.log(`🗑️ Cleaned up empty session: ${clientInfo.gameId}`)
          }
        }, 30000) // 30 second cleanup delay
      }
    }

    console.log(`🔌 Client ${clientInfo.id} unsubscribed from game ${clientInfo.gameId}`)
    clientInfo.gameId = undefined
  }

  private async handleEventBatch(ws: WebSocket, batch: EventBatch) {
    try {
      // Validate the entire batch
      const validatedBatch = validateEventBatch(batch)
      
      const session = this.sessions.get(validatedBatch.gameId)
      if (!session) {
        this.sendError(ws, 'Game session not found', validatedBatch.gameId)
        return
      }

      // Process each event
      for (const event of validatedBatch.events) {
        await this.processEvent(event)
      }

      // Add events to session
      session.events.push(...validatedBatch.events)
      session.lastActivity = new Date()

      // Log to file
      await this.logEvents(validatedBatch)

      // Acknowledge receipt
      this.sendMessage(ws, {
        id: uuidv4(),
        type: 'pong', // Reusing pong for acknowledgment
        payload: { 
          acknowledged: validatedBatch.sequenceNumber,
          eventsProcessed: validatedBatch.events.length
        }
      })

      console.log(`📊 Processed ${validatedBatch.events.length} events for game ${validatedBatch.gameId}`)

    } catch (error) {
      console.error('❌ Event batch processing error:', error)
      this.sendError(ws, 'Event batch validation failed', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  private async processEvent(event: GameEvent) {
    // Process individual events for real-time analytics
    switch (event.type) {
      case 'game_started':
        console.log(`🚀 Game started: ${event.gameId} with ${event.data.playerNames.length} players`)
        break
        
      case 'auction_started':
        console.log(`🏛️ Auction started for ${event.data.property} in game ${event.gameId}`)
        break
        
      case 'trade_proposed':
        console.log(`🤝 Trade proposed in game ${event.gameId}: ${event.data.cashOffered} cash + ${event.data.propertiesOffered.length} properties`)
        break
        
      case 'bankrupt':
        console.log(`💀 Player bankrupt in game ${event.gameId}: ${event.playerId}`)
        break
        
      case 'game_ended':
        console.log(`🎉 Game ended: ${event.gameId}, winner: ${event.data.winner}, duration: ${event.data.duration}s`)
        break
        
      // Add more specific event processing as needed
      default:
        // Generic event processing
        break
    }
  }

  private async initializeLogging() {
    try {
      await fs.mkdir(LOG_DIR, { recursive: true })
      console.log(`📝 Logging initialized in ${LOG_DIR}`)
    } catch (error) {
      console.error('❌ Failed to initialize logging:', error)
    }
  }

  private async logEvents(batch: EventBatch) {
    try {
      const date = new Date().toISOString().split('T')[0]
      const logFile = path.join(LOG_DIR, `monopoly-events-${date}.jsonl`)
      
      const logEntry = {
        timestamp: new Date().toISOString(),
        batch
      }
      
      await fs.appendFile(logFile, JSON.stringify(logEntry) + '\n')
    } catch (error) {
      console.error('❌ Failed to log events:', error)
    }
  }

  private handleDisconnection(ws: WebSocket) {
    const clientInfo = this.clients.get(ws)
    if (clientInfo) {
      console.log(`👋 Client disconnected: ${clientInfo.id}`)
      this.unsubscribeFromGame(ws)
      this.clients.delete(ws)
    }
  }

  private sendMessage(ws: WebSocket, message: any) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message))
    }
  }

  private sendError(ws: WebSocket, message: string, details?: string) {
    this.sendMessage(ws, {
      id: uuidv4(),
      type: 'error',
      error: message,
      details
    })
  }

  private startPeriodicTasks() {
    // Cleanup inactive sessions every 5 minutes
    setInterval(() => {
      const now = new Date()
      const staleThreshold = 30 * 60 * 1000 // 30 minutes

      for (const [gameId, session] of this.sessions.entries()) {
        if (now.getTime() - session.lastActivity.getTime() > staleThreshold) {
          this.sessions.delete(gameId)
          console.log(`🗑️ Cleaned up stale session: ${gameId}`)
        }
      }
    }, 5 * 60 * 1000)

    // Health check every 30 seconds
    setInterval(() => {
      const activeClients = this.clients.size
      const activeSessions = this.sessions.size
      const totalEvents = Array.from(this.sessions.values())
        .reduce((sum, session) => sum + session.events.length, 0)

      console.log(`📊 Health: ${activeClients} clients, ${activeSessions} sessions, ${totalEvents} events`)
    }, 30 * 1000)

    // Ping clients every 20 seconds to keep connections alive
    setInterval(() => {
      const now = new Date()
      for (const [ws, clientInfo] of this.clients.entries()) {
        if (ws.readyState === WebSocket.OPEN) {
          if (now.getTime() - clientInfo.lastPing.getTime() > 60000) {
            // Client hasn't pinged in over a minute, disconnect
            console.log(`💔 Disconnecting stale client: ${clientInfo.id}`)
            ws.terminate()
          } else {
            this.sendMessage(ws, {
              id: uuidv4(),
              type: 'ping',
              payload: {}
            })
          }
        }
      }
    }, 20 * 1000)
  }

  // Public API for statistics
  getStats() {
    return {
      activeClients: this.clients.size,
      activeSessions: this.sessions.size,
      totalEvents: Array.from(this.sessions.values())
        .reduce((sum, session) => sum + session.events.length, 0),
      uptime: process.uptime()
    }
  }

  async shutdown() {
    console.log('🛑 Shutting down server...')
    
    // Close all client connections
    for (const ws of this.clients.keys()) {
      ws.close(1000, 'Server shutting down')
    }
    
    // Close WebSocket server
    this.wss.close(() => {
      console.log('✅ Server shutdown complete')
    })
  }
}

// Start server
const server = new MonopolyTelemetryServer()

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Received SIGINT, shutting down gracefully...')
  await server.shutdown()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  console.log('\n🛑 Received SIGTERM, shutting down gracefully...')
  await server.shutdown()
  process.exit(0)
})

// Health check endpoint (if needed for deployment)
if (process.env.NODE_ENV === 'production') {
  const http = require('http')
  const healthServer = http.createServer((req: any, res: any) => {
    if (req.url === '/health') {
      const stats = server.getStats()
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ 
        status: 'healthy', 
        ...stats,
        timestamp: new Date().toISOString()
      }))
    } else {
      res.writeHead(404)
      res.end('Not Found')
    }
  })
  
  const healthPort = PORT + 1
  healthServer.listen(healthPort, () => {
    console.log(`❤️ Health check endpoint available at http://localhost:${healthPort}/health`)
  })
}

export default server