import React from 'react'
import { GameState, Tile, TileKind } from '@monopoly/shared'

export const HUD: React.FC<{
  state: GameState
  hoveredTile: Tile | null
}> = ({ state, hoveredTile }) => {
  return (
    <div style={hud}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <div>Phase: {state.phase}</div>
        <div>Current: <b>{state.players[state.currentPlayer]?.name}</b></div>
      </div>
      {hoveredTile && (
        <div style={{ marginTop: 8, fontSize: 14, opacity: 0.9 }}>
          <b>{hoveredTile.name}</b>
          <span> — {tileInfo(hoveredTile)}</span>
        </div>
      )}
    </div>
  )
}

const tileInfo = (t: Tile) => {
  if (t.kind === TileKind.Property || t.kind === TileKind.Railroad || t.kind === TileKind.Utility) return `$${t.price}`
  if (t.kind === TileKind.Tax) return `Pay $${t.amount}`
  return t.kind
}

const hud: React.CSSProperties = {
  position: 'fixed', left: 16, top: 16, background: 'white', border: '1px solid #ddd', borderRadius: 8, padding: 12, zIndex: 10
}
