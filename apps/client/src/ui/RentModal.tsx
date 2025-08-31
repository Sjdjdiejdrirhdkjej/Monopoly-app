import React from 'react'
import { GameState, TileKind } from '@monopoly/shared'

export const RentModal: React.FC<{ state: GameState }> = ({ state }) => {
  // Show a transient notice when a rent payment occurs; simplest: read last log
  const last = state.logs[state.logs.length - 1]
  if (!last || last.type !== 'Paid' || last.reason !== 'Rent') return null
  const payer = state.players[last.from].name
  const to = typeof last.to === 'number' ? state.players[last.to].name : 'Bank'
  return (
    <div style={toastStyle}>Rent: {payer} paid ${last.amount} to {to}</div>
  )
}

const toastStyle: React.CSSProperties = {
  position: 'fixed', top: 16, right: 16, background: 'rgba(0,0,0,0.75)', color: 'white', padding: '8px 12px', borderRadius: 6, zIndex: 25
}
