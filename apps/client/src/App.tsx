import React, { useMemo, useState } from 'react'
import { apply } from '@monopoly/rules'
import { BOARD, GameState, Phase } from '@monopoly/shared'
import { newGame } from '@monopoly/ai'

const defaultNames = ['P1', 'P2']

const App: React.FC = () => {
  const [seed, setSeed] = useState('m1')
  const [names, setNames] = useState<string[]>(defaultNames)
  const [state, setState] = useState<GameState | null>(null)
  const [auto, setAuto] = useState(false)

  const start = () => {
    const s = newGame(seed, names)
    setState(s)
  }

  const step = () => {
    if (!state) return
    if (state.phase === Phase.GameOver) return
    const acts: any[] = []
    if (state.phase === Phase.PreRoll) {
      if (state.players[state.currentPlayer].inJail) {
        if (state.players[state.currentPlayer].getOutOfJailCards > 0) acts.push({ type: 'UseJailCard' })
        if (state.players[state.currentPlayer].cash >= state.config.jailFine) acts.push({ type: 'PayJail' })
        acts.push({ type: 'TryDoubles' })
      } else acts.push({ type: 'Roll' })
    } else if (state.phase === Phase.BuyDecision) {
      const tile = state.board[state.players[state.currentPlayer].position] as any
      if (tile.price && state.players[state.currentPlayer].cash >= tile.price) acts.push({ type: 'Buy' })
      acts.push({ type: 'DeclineBuy' })
    } else if (state.phase === Phase.Auction && state.auction?.active) {
      acts.push({ type: 'Bid', amount: (state.auction.currentBid || 0) + 10 }, { type: 'PassBid' })
    } else if (state.phase === Phase.EndTurn) acts.push({ type: 'EndTurn' })
    const action = acts[0]
    setState(apply(state, action))
  }

  React.useEffect(() => {
    if (!auto || !state) return
    if (state.phase === Phase.GameOver) return
    const t = setTimeout(step, 50)
    return () => clearTimeout(t)
  }, [auto, state])

  const save = () => {
    if (!state) return
    localStorage.setItem('monopoly-state', JSON.stringify(state))
  }
  const load = () => {
    const s = localStorage.getItem('monopoly-state')
    if (s) setState(JSON.parse(s))
  }

  return (
    <div style={{ fontFamily: 'system-ui', padding: 16, display: 'grid', gap: 12 }}>
      <h1>Monopoly Clone - M1</h1>
      {!state && (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input value={seed} onChange={e => setSeed(e.target.value)} placeholder="seed" />
          <input
            value={names.join(',')}
            onChange={e => setNames(e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
            placeholder="player names comma separated"
          />
          <button onClick={start}>Start</button>
        </div>
      )}
      {state && (
        <>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button onClick={step}>Step</button>
            <label>
              <input type="checkbox" checked={auto} onChange={e => setAuto(e.target.checked)} /> Auto
            </label>
            <button onClick={save}>Save</button>
            <button onClick={load}>Load</button>
          </div>
          <div>Phase: {state.phase}</div>
          <div>Current: {state.players[state.currentPlayer]?.name}</div>
          <div style={{ display: 'flex', gap: 16 }}>
            {state.players.map(p => (
              <div key={p.id} style={{ border: '1px solid #ccc', padding: 8 }}>
                <div>{p.name}</div>
                <div>Cash: ${p.cash}</div>
                <div>Pos: {p.position}</div>
                <div>Jail: {p.inJail ? 'Yes' : 'No'}</div>
                <div>Owned: {Object.entries(state.ownership)
                  .filter(([i, own]) => (own as any).owner === p.id)
                  .map(([i]) => state.board[Number(i)].name)
                  .join(', ')}</div>
              </div>
            ))}
          </div>
          <div style={{ maxHeight: 200, overflow: 'auto', border: '1px solid #eee', padding: 8 }}>
            {state.logs.slice(-50).map((l, idx) => (
              <div key={idx}>{JSON.stringify(l)}</div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default App
