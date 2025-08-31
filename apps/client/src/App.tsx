import React, { useMemo, useRef, useState } from 'react'
import { apply } from '@monopoly/rules'
import { BOARD, GameState, Phase, Action, TileKind, DiceRoll } from '@monopoly/shared'
import { newGame } from '@monopoly/ai'
import { ThreeStage } from './scene/ThreeStage'
import { Board as Board3D, computeTileCenters } from './scene/Board'
import { Tokens } from './scene/Tokens'
import { HousesHotels } from './scene/HousesHotels'
import { Dice, DiceApi } from './scene/Dice'
import { PurchaseModal } from './ui/PurchaseModal'
import { RentModal } from './ui/RentModal'
import { EventLog } from './ui/EventLog'
import { QualityPanel } from './ui/QualityPanel'
import { HUD } from './ui/HUD'

const defaultNames = ['P1', 'P2', 'P3', 'P4']

const App: React.FC = () => {
  const [seed, setSeed] = useState('m2')
  const [names, setNames] = useState<string[]>(defaultNames)
  const [state, setState] = useState<GameState | null>(null)
  const [auto, setAuto] = useState(false)

  const [hovered, setHovered] = useState<number | null>(null)
  const [selected, setSelected] = useState<number | null>(null)
  const [shadows, setShadows] = useState(true)
  const [physicsDice, setPhysicsDice] = useState(true)

  const diceRef = useRef<DiceApi>(null)

  const start = () => {
    const s = newGame(seed, names)
    setState(s)
  }

  const doAction = async (action: Action) => {
    if (!state) return
    const next = apply(state, action)
    setState(next)
    if (action.type === 'Roll') {
      const target: DiceRoll | null = next.lastRoll
      await diceRef.current?.roll(target, !physicsDice)
    }
  }

  const step = async () => {
    if (!state) return
    if (state.phase === Phase.GameOver) return
    const acts: Action[] = inferLegal(state)
    const action = acts[0]
    await doAction(action)
  }

  React.useEffect(() => {
    if (!auto || !state) return
    if (state.phase === Phase.GameOver) return
    const t = setTimeout(step, 250)
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

  const centers = useMemo(() => computeTileCenters(), [])

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      {!state && (
        <div style={{ position: 'fixed', inset: 0, display: 'grid', placeItems: 'center', background: '#f7f9fc' }}>
          <div style={{ display: 'grid', gap: 8, padding: 16, background: 'white', border: '1px solid #ddd', borderRadius: 8 }}>
            <h1>Monopoly Clone - M2</h1>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input value={seed} onChange={e => setSeed(e.target.value)} placeholder="seed" />
              <input
                value={names.join(',')}
                onChange={e => setNames(e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                placeholder="player names comma separated"
              />
              <button onClick={start}>Start</button>
            </div>
          </div>
        </div>
      )}

      <ThreeStage quality={{ shadows, showPerf: false }}>
        <Board3D hovered={hovered} selected={selected} onHoverTile={setHovered} onSelectTile={setSelected} />
        {state && (
          <>
            <Tokens players={state.players} active={state.currentPlayer} tileCenters={centers} />
            <HousesHotels state={state} />
          </>
        )}
        <Dice ref={diceRef} enabled={physicsDice} />
      </ThreeStage>

      {state && (
        <>
          <HUD state={state} hoveredTile={hovered != null ? state.board[hovered] : null} />
          <EventLog state={state} />
          <QualityPanel shadows={shadows} setShadows={setShadows} physicsDice={physicsDice} setPhysicsDice={setPhysicsDice} />

          <div style={{ position: 'fixed', right: 16, top: 16, display: 'flex', gap: 8, zIndex: 12 }}>
            <button onClick={() => step()}>Step</button>
            <label>
              <input type="checkbox" checked={auto} onChange={e => setAuto(e.target.checked)} /> Auto
            </label>
            <button onClick={save}>Save</button>
            <button onClick={load}>Load</button>
          </div>

          <Controls state={state} onAct={doAction} />

          <PurchaseModal state={state} onBuy={() => doAction({ type: 'Buy' })} onDecline={() => doAction({ type: 'DeclineBuy' })} />
          <RentModal state={state} />
        </>
      )}
    </div>
  )
}

const Controls: React.FC<{ state: GameState; onAct: (a: Action) => void | Promise<void> }> = ({ state, onAct }) => {
  const pid = state.currentPlayer
  const p = state.players[pid]
  const phase = state.phase
  return (
    <div style={{ position: 'fixed', left: '50%', bottom: 16, transform: 'translateX(-50%)', display: 'flex', gap: 6, zIndex: 15 }}>
      {phase === Phase.PreRoll && !p.inJail && <button onClick={() => onAct({ type: 'Roll' })}>Roll</button>}
      {phase === Phase.PreRoll && p.inJail && (
        <>
          {p.cash >= state.config.jailFine && <button onClick={() => onAct({ type: 'PayJail' })}>Pay ${state.config.jailFine}</button>}
          {p.getOutOfJailCards > 0 && <button onClick={() => onAct({ type: 'UseJailCard' })}>Use Jail Card</button>}
          <button onClick={() => onAct({ type: 'TryDoubles' })}>Try Doubles</button>
        </>
      )}
      {phase === Phase.EndTurn && <button onClick={() => onAct({ type: 'EndTurn' })}>End Turn</button>}
      {phase === Phase.Auction && state.auction?.active && (
        <>
          <button onClick={() => onAct({ type: 'Bid', amount: (state.auction!.currentBid || 0) + (state.auction!.minIncrement || 10) })}>Bid ${(state.auction!.currentBid || 0) + (state.auction!.minIncrement || 10)}</button>
          <button onClick={() => onAct({ type: 'PassBid' })}>Pass</button>
        </>
      )}
    </div>
  )
}

const inferLegal = (s: GameState): Action[] => {
  const acts: Action[] = []
  if (s.phase === Phase.PreRoll) {
    if (s.players[s.currentPlayer].inJail) {
      acts.push({ type: 'PayJail' }, { type: 'TryDoubles' })
      if (s.players[s.currentPlayer].getOutOfJailCards > 0) acts.push({ type: 'UseJailCard' })
    } else acts.push({ type: 'Roll' })
  } else if (s.phase === Phase.BuyDecision) {
    acts.push({ type: 'Buy' }, { type: 'DeclineBuy' })
  } else if (s.phase === Phase.Auction && s.auction?.active) {
    acts.push({ type: 'Bid', amount: (s.auction.currentBid || 0) + 10 }, { type: 'PassBid' })
  } else if (s.phase === Phase.EndTurn) {
    acts.push({ type: 'EndTurn' })
  } else if (s.trade?.active && s.trade.offer) {
    acts.push({ type: 'AcceptTrade' }, { type: 'RejectTrade' })
  }
  return acts.length ? acts : [{ type: 'EndTurn' }]
}

export default App
