import React from 'react'
import { GameState, TileKind } from '@monopoly/shared'

export const PurchaseModal: React.FC<{
  state: GameState
  onBuy: () => void
  onDecline: () => void
}> = ({ state, onBuy, onDecline }) => {
  const pos = state.players[state.currentPlayer].position
  const tile = state.board[pos]
  if (state.phase !== 'BuyDecision') return null
  if (!(tile.kind === TileKind.Property || tile.kind === TileKind.Railroad || tile.kind === TileKind.Utility)) return null
  return (
    <div style={modalStyle}>
      <div style={boxStyle}>
        <h3>Purchase {tile.name}?</h3>
        <div>Price: ${tile.price}</div>
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <button onClick={onBuy}>Buy</button>
          <button onClick={onDecline}>Decline</button>
        </div>
      </div>
    </div>
  )
}

const modalStyle: React.CSSProperties = {
  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 20
}
const boxStyle: React.CSSProperties = {
  background: 'white', padding: 16, borderRadius: 8, minWidth: 280, boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
}
