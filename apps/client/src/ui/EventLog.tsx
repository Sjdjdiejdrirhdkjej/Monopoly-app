import React from 'react'
import { Event, GameState } from '@monopoly/shared'

export const EventLog: React.FC<{ state: GameState }> = ({ state }) => {
  return (
    <div style={panel}>
      <div style={{ fontWeight: 600, marginBottom: 6 }}>Events</div>
      <div style={{ maxHeight: 140, overflow: 'auto', display: 'grid', gap: 4 }}>
        {state.logs.slice(-30).reverse().map((e, i) => (
          <div key={i} style={{ fontSize: 12, opacity: 0.85 }}>{formatEvent(e, state)}</div>
        ))}
      </div>
    </div>
  )
}

const formatEvent = (e: Event, s: GameState): string => {
  switch (e.type) {
    case 'TurnStarted':
      return `➡️ Turn: ${s.players[e.player].name}`
    case 'Rolled':
      return `🎲 Rolled ${e.d1}+${e.d2}`
    case 'Moved':
      return `🚶 Moved to ${s.board[e.to].name}`
    case 'BoughtProperty':
      return `🏷️ Bought ${s.board[e.tile].name} for $${e.price}`
    case 'Paid':
      return `💸 ${s.players[e.from].name} paid ${typeof e.to === 'number' ? s.players[e.to].name : 'Bank'} $${e.amount} (${e.reason})`
    case 'Received':
      return `💰 ${s.players[e.to].name} +$${e.amount} (${e.reason})`
    case 'WentToJail':
      return `🚔 ${s.players[e.player].name} went to Jail`
    case 'DrewCard':
      return `🃏 Drew ${e.deck}: ${e.text}`
    case 'Bankrupt':
      return `☠️ ${s.players[e.player].name} bankrupt`
    default:
      return JSON.stringify(e)
  }
}

const panel: React.CSSProperties = {
  position: 'fixed', left: 16, bottom: 16, background: 'white', border: '1px solid #ddd', borderRadius: 8, padding: 12, width: 280, zIndex: 10
}
