import seedrandom from 'seedrandom'
import {
  Action,
  AuctionState,
  BOARD_SIZE,
  BOARD,
  GROUPS,
  Card,
  CardDeck,
  CardKind,
  DiceRoll,
  Event,
  GameConfig,
  GameState,
  Ownership,
  Phase,
  Player,
  RAILROADS,
  RNGState,
  Tile,
  TileKind,
  UTILITIES,
} from '@monopoly/shared'
import { createDecks } from '@monopoly/shared'

const VERSION = 1

const defaultConfig: GameConfig = { startingCash: 1500, goAmount: 200, jailFine: 50 }

const clone = <T,>(x: T): T => JSON.parse(JSON.stringify(x))

const createRNG = (seed: string, prngState?: any, calls?: number): RNG => {
  let rng = seedrandom('', { state: prngState })
  if (!prngState) rng = seedrandom(seed, { state: true })
  let c = calls ?? 0
  const next = () => {
    c += 1
    return rng()
  }
  const rollD6 = () => Math.floor(next() * 6) + 1
  return {
    seed,
    state: () => ({ seed, prngState: (rng as any).state?.(), calls: c }),
    int: (min, max) => Math.floor(next() * (max - min + 1)) + min,
    shuffle: <T,>(arr: T[]) => {
      const a = arr.slice()
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(next() * (i + 1))
        ;[a[i], a[j]] = [a[j], a[i]]
      }
      return a
    },
    dice: (): DiceRoll => {
      const d1 = rollD6()
      const d2 = rollD6()
      return { d1, d2, total: d1 + d2, isDouble: d1 === d2 }
    }
  }
}

export type RNG = {
  seed: string
  state: () => RNGState
  int: (min: number, max: number) => number
  shuffle: <T>(arr: T[]) => T[]
  dice: () => DiceRoll
}

export const initialState = (): GameState => ({
  version: VERSION,
  config: defaultConfig,
  phase: Phase.Setup,
  currentPlayer: 0,
  players: [],
  board: BOARD,
  ownership: {},
  decks: createDecks(''),
  rng: { seed: '', prngState: null, calls: 0 },
  lastRoll: null,
  doublesInRow: 0,
  auction: null,
  trade: { active: false, offer: null },
  logs: [],
  winner: null,
})

const addLog = (s: GameState, e: Event) => {
  s.logs.push(e)
}

const getOwnership = (s: GameState, i: number): Ownership => {
  if (!s.ownership[i]) s.ownership[i] = { owner: null }
  return s.ownership[i]
}

const playerCount = (s: GameState) => s.players.filter(p => !p.bankrupt).length

const nextPlayerIndex = (s: GameState): number => {
  let i = s.currentPlayer
  for (let step = 0; step < s.players.length; step++) {
    i = (i + 1) % s.players.length
    if (!s.players[i].bankrupt) return i
  }
  return s.currentPlayer
}

const awardGo = (s: GameState, pid: number) => {
  const amount = s.config.goAmount
  s.players[pid].cash += amount
  addLog(s, { type: 'Received', to: pid, amount, reason: 'PassGo' })
  addLog(s, { type: 'PassedGo', player: pid, amount })
}

const moveBy = (s: GameState, pid: number, steps: number) => {
  const p = s.players[pid]
  const from = p.position
  let to = (p.position + steps) % BOARD_SIZE
  if (to < from) awardGo(s, pid)
  p.position = to
  addLog(s, { type: 'Moved', player: pid, from, to })
}

const goTo = (s: GameState, pid: number, to: number, awardGoOnPass = true) => {
  const p = s.players[pid]
  const from = p.position
  if (awardGoOnPass && to < from) awardGo(s, pid)
  p.position = to
  addLog(s, { type: 'Moved', player: pid, from, to })
}

const sendToJail = (s: GameState, pid: number) => {
  const jailIndex = 10
  goTo(s, pid, jailIndex, false)
  s.players[pid].inJail = true
  s.players[pid].jailTurns = 0
  s.doublesInRow = 0
  addLog(s, { type: 'WentToJail', player: pid })
}

const ownsAllInGroup = (s: GameState, pid: number, color: any): boolean => {
  const tiles = BOARD.filter(t => t.kind === TileKind.Property && t.color === color).map(t => t.index)
  return tiles.every(i => getOwnership(s, i).owner === pid)
}

const railroadsOwned = (s: GameState, pid: number): number => RAILROADS.filter(i => getOwnership(s, i).owner === pid).length

const utilitiesOwned = (s: GameState, pid: number): number => UTILITIES.filter(i => getOwnership(s, i).owner === pid).length

const rentFor = (s: GameState, i: number, dice?: DiceRoll, cardUtilityMultiplier?: number): number => {
  const tile = s.board[i]
  const own = getOwnership(s, i)
  if (tile.kind === TileKind.Property) {
    if (own.hotel) return tile.rents[5]
    const houses = own.houses ?? 0
    if (houses > 0) return tile.rents[houses]
    const owner = own.owner
    if (owner === null) return 0
    const monopoly = ownsAllInGroup(s, owner, tile.color)
    return monopoly ? tile.rents[0] * 2 : tile.rents[0]
  }
  if (tile.kind === TileKind.Railroad) {
    const n = own.owner != null ? railroadsOwned(s, own.owner) : 0
    if (n === 1) return 25
    if (n === 2) return 50
    if (n === 3) return 100
    if (n >= 4) return 200
    return 0
  }
  if (tile.kind === TileKind.Utility) {
    if (!dice) return 0
    const owner = own.owner
    if (owner == null) return 0
    const n = utilitiesOwned(s, owner)
    const mult = cardUtilityMultiplier ? 10 : n === 2 ? 10 : 4
    return mult * dice.total
  }
  return 0
}

const pay = (s: GameState, from: number, to: number | 'Bank', amount: number, reason: string) => {
  const p = s.players[from]
  if (p.cash >= amount) {
    p.cash -= amount
    if (to !== 'Bank') s.players[to].cash += amount
    addLog(s, { type: 'Paid', from, to, amount, reason })
  } else {
    handleBankruptcy(s, from, to, amount - p.cash)
  }
}

const transferTile = (s: GameState, tile: number, to: number | null) => {
  const own = getOwnership(s, tile)
  own.owner = to
  own.houses = own.houses ?? 0
  own.hotel = own.hotel ?? false
}

const handleBankruptcy = (s: GameState, pid: number, to: number | 'Bank', shortfall: number) => {
  const p = s.players[pid]
  p.bankrupt = true
  p.cash = 0
  if (to !== 'Bank') {
    Object.keys(s.ownership).forEach(k => {
      const i = Number(k)
      const own = s.ownership[i]
      if (own.owner === pid) transferTile(s, i, to)
    })
  } else {
    Object.keys(s.ownership).forEach(k => {
      const i = Number(k)
      const own = s.ownership[i]
      if (own.owner === pid) {
        own.owner = null
        s.auction = {
          active: true,
          tile: i,
          currentBid: 0,
          highestBidder: null,
          participants: s.players.filter(pp => !pp.bankrupt).map(pp => pp.id),
          minIncrement: 10,
        }
      }
    })
  }
  addLog(s, { type: 'Bankrupt', player: pid, to })
  if (playerCount(s) === 1) {
    s.winner = s.players.find(pp => !pp.bankrupt)?.id ?? null
    s.phase = Phase.GameOver
  }
}

const nearest = (pos: number, targets: number[]): number => {
  let best = targets[0]
  let minDist = 1000
  for (const t of targets) {
    const d = (t - pos + BOARD_SIZE) % BOARD_SIZE
    if (d >= 0 && d < minDist) {
      minDist = d
      best = t
    }
  }
  return best
}

const drawCard = (s: GameState, deckName: 'chance' | 'chest'): Card => {
  const deck = s.decks
  if (deckName === 'chance') {
    const card = deck.chance[deck.chanceIndex]
    deck.chanceIndex = (deck.chanceIndex + 1) % deck.chance.length
    return card
  } else {
    const card = deck.chest[deck.chestIndex]
    deck.chestIndex = (deck.chestIndex + 1) % deck.chest.length
    return card
  }
}

const resolveLanding = (s: GameState, rng: RNG, pid: number) => {
  const tile = s.board[s.players[pid].position]
  if (tile.kind === TileKind.Tax) {
    pay(s, pid, 'Bank', tile.amount, 'Tax')
    return
  }
  if (tile.kind === TileKind.GoToJail) {
    sendToJail(s, pid)
    s.phase = Phase.EndTurn
    return
  }
  if (tile.kind === TileKind.Property || tile.kind === TileKind.Railroad || tile.kind === TileKind.Utility) {
    const own = getOwnership(s, tile.index)
    if (own.owner == null) {
      s.phase = Phase.BuyDecision
      return
    }
    if (own.owner !== pid) {
      const rent = rentFor(s, tile.index, s.lastRoll ?? undefined)
      pay(s, pid, own.owner, rent, 'Rent')
      s.phase = Phase.EndTurn
      return
    }
  }
  if (tile.kind === TileKind.Chance || tile.kind === TileKind.CommunityChest) {
    const deckName = tile.kind === TileKind.Chance ? 'chance' : 'chest'
    const card = drawCard(s, deckName)
    addLog(s, { type: 'DrewCard', player: pid, deck: deckName, text: card.text })
    applyCard(s, rng, pid, card)
    return
  }
  s.phase = Phase.EndTurn
}

const applyCard = (s: GameState, rng: RNG, pid: number, card: Card) => {
  if (card.kind === CardKind.MoveTo) {
    const to = card.arg
    const from = s.players[pid].position
    goTo(s, pid, to, to < from)
    resolveLanding(s, rng, pid)
    return
  }
  if (card.kind === CardKind.MoveToNearestRailroad) {
    const dest = nearest(s.players[pid].position, RAILROADS)
    const from = s.players[pid].position
    goTo(s, pid, dest, dest < from)
    const own = getOwnership(s, dest)
    if (own.owner != null && own.owner !== pid) {
      const rent = rentFor(s, dest)
      pay(s, pid, own.owner, rent * 2, 'RailroadCardRent')
    }
    s.phase = Phase.EndTurn
    return
  }
  if (card.kind === CardKind.MoveToNearestUtility) {
    const dest = nearest(s.players[pid].position, UTILITIES)
    const from = s.players[pid].position
    goTo(s, pid, dest, dest < from)
    const own = getOwnership(s, dest)
    if (own.owner != null && own.owner !== pid) {
      const roll = rng.dice()
      const rent = rentFor(s, dest, roll, 10)
      pay(s, pid, own.owner, rent, 'UtilityCardRent')
    }
    s.phase = Phase.EndTurn
    return
  }
  if (card.kind === CardKind.Pay) {
    pay(s, pid, 'Bank', card.arg, 'CardPay')
    s.phase = Phase.EndTurn
    return
  }
  if (card.kind === CardKind.Receive) {
    s.players[pid].cash += card.arg
    addLog(s, { type: 'Received', to: pid, amount: card.arg, reason: 'CardReceive' })
    s.phase = Phase.EndTurn
    return
  }
  if (card.kind === CardKind.PayEachPlayer) {
    for (const other of s.players) if (other.id !== pid && !other.bankrupt) pay(s, pid, other.id, card.arg, 'CardPayEach')
    s.phase = Phase.EndTurn
    return
  }
  if (card.kind === CardKind.GoToJail) {
    sendToJail(s, pid)
    s.phase = Phase.EndTurn
    return
  }
  if (card.kind === CardKind.GetOutOfJail) {
    s.players[pid].getOutOfJailCards += 1
    addLog(s, { type: 'UsedJailCard', player: pid })
    s.phase = Phase.EndTurn
    return
  }
  if (card.kind === CardKind.Repairs) {
    let total = 0
    for (const [k, own] of Object.entries(s.ownership)) {
      if (own.owner === pid) {
        const houses = own.hotel ? 0 : own.houses ?? 0
        const hotels = own.hotel ? 1 : 0
        total += houses * card.arg + hotels * card.arg2
      }
    }
    pay(s, pid, 'Bank', total, 'Repairs')
    s.phase = Phase.EndTurn
    return
  }
}

export const generateLegalActions = (s: GameState): Action[] => {
  if (s.phase === Phase.Setup) return [{ type: 'StartGame', seed: 'seed', players: [] }]
  if (s.phase === Phase.GameOver) return []
  const pid = s.currentPlayer
  const p = s.players[pid]
  if (s.auction?.active) {
    const actions: Action[] = []
    actions.push({ type: 'PassBid' })
    actions.push({ type: 'Bid', amount: (s.auction.currentBid || 0) + s.auction.minIncrement })
    return actions
  }
  if (s.trade?.active && s.trade.offer) return [{ type: 'AcceptTrade' }, { type: 'RejectTrade' }]
  if (s.phase === Phase.PreRoll) {
    if (p.inJail) {
      const acts: Action[] = [{ type: 'TryDoubles' }]
      if (p.cash >= s.config.jailFine) acts.push({ type: 'PayJail' })
      if (p.getOutOfJailCards > 0) acts.push({ type: 'UseJailCard' })
      return acts
    }
    return [{ type: 'Roll' }]
  }
  if (s.phase === Phase.BuyDecision) return [{ type: 'Buy' }, { type: 'DeclineBuy' }]
  if (s.phase === Phase.EndTurn) return [{ type: 'EndTurn' }]
  return []
}

export const apply = (state: GameState, action: Action): GameState => {
  const s = clone(state)
  const rng = createRNG(s.rng.seed || 'seed', s.rng.prngState, s.rng.calls)
  const pid = s.currentPlayer
  if (action.type === 'StartGame') {
    const seed = action.seed
    const rng2 = createRNG(seed)
    const players: Player[] = action.players.map((p, i) => ({
      id: i,
      name: p.name,
      cash: s.config.startingCash,
      position: 0,
      inJail: false,
      jailTurns: 0,
      getOutOfJailCards: 0,
      bankrupt: false,
    }))
    const ownership: Record<number, Ownership> = {}
    for (const t of s.board) if (t.kind === TileKind.Property || t.kind === TileKind.Railroad || t.kind === TileKind.Utility) ownership[t.index] = { owner: null, houses: 0, hotel: false, mortgaged: false }
    const decks: CardDeck = createDecks(seed)
    const nextState: GameState = {
      ...s,
      version: VERSION,
      rng: rng2.state(),
      decks,
      players,
      currentPlayer: 0,
      phase: Phase.PreRoll,
      logs: [],
      lastRoll: null,
      doublesInRow: 0,
      auction: null,
      trade: { active: false, offer: null },
      winner: null,
    }
    addLog(nextState, { type: 'GameStarted', seed })
    addLog(nextState, { type: 'TurnStarted', player: nextState.currentPlayer })
    return nextState
  }

  if (s.phase === Phase.PreRoll) {
    if (action.type === 'PayJail' && s.players[pid].inJail) {
      pay(s, pid, 'Bank', s.config.jailFine, 'JailFine')
      s.players[pid].inJail = false
      s.players[pid].jailTurns = 0
      s.phase = Phase.PreRoll
      s.rng = rng.state()
      return s
    }
    if (action.type === 'UseJailCard' && s.players[pid].getOutOfJailCards > 0 && s.players[pid].inJail) {
      s.players[pid].getOutOfJailCards -= 1
      s.players[pid].inJail = false
      s.players[pid].jailTurns = 0
      s.phase = Phase.PreRoll
      s.rng = rng.state()
      return s
    }
    if (action.type === 'TryDoubles' && s.players[pid].inJail) {
      const roll = rng.dice()
      addLog(s, { type: 'Rolled', player: pid, d1: roll.d1, d2: roll.d2 })
      if (roll.isDouble) {
        s.players[pid].inJail = false
        s.players[pid].jailTurns = 0
        s.lastRoll = roll
        moveBy(s, pid, roll.total)
        resolveLanding(s, rng, pid)
      } else {
        s.players[pid].jailTurns += 1
        if (s.players[pid].jailTurns >= 3) {
          pay(s, pid, 'Bank', s.config.jailFine, 'JailFine3rd')
          s.players[pid].inJail = false
          s.players[pid].jailTurns = 0
          s.lastRoll = roll
          moveBy(s, pid, roll.total)
          resolveLanding(s, rng, pid)
        } else {
          s.phase = Phase.EndTurn
        }
      }
      s.rng = rng.state()
      return s
    }
    if (action.type === 'Roll' && !s.players[pid].inJail) {
      const roll = rng.dice()
      addLog(s, { type: 'Rolled', player: pid, d1: roll.d1, d2: roll.d2 })
      s.lastRoll = roll
      if (roll.isDouble) s.doublesInRow += 1
      else s.doublesInRow = 0
      if (s.doublesInRow >= 3) {
        sendToJail(s, pid)
        s.phase = Phase.EndTurn
      } else {
        moveBy(s, pid, roll.total)
        resolveLanding(s, rng, pid)
        if (roll.isDouble && !s.players[pid].inJail) {
          s.phase = Phase.PreRoll
        }
      }
      s.rng = rng.state()
      return s
    }
  }

  if (s.phase === Phase.BuyDecision) {
    const pos = s.players[pid].position
    const tile = s.board[pos]
    if (action.type === 'Buy') {
      if (tile.kind === TileKind.Property || tile.kind === TileKind.Railroad || tile.kind === TileKind.Utility) {
        pay(s, pid, 'Bank', tile.price, 'Buy')
        transferTile(s, tile.index, pid)
        addLog(s, { type: 'BoughtProperty', player: pid, tile: tile.index, price: tile.price })
      }
      s.phase = Phase.EndTurn
      s.rng = rng.state()
      return s
    }
    if (action.type === 'DeclineBuy') {
      s.auction = {
        active: true,
        tile: tile.index,
        currentBid: 0,
        highestBidder: null,
        participants: s.players.filter(p => !p.bankrupt).map(p => p.id),
        minIncrement: 10,
      }
      s.phase = Phase.Auction
      addLog(s, { type: 'StartedAuction', tile: tile.index })
      s.rng = rng.state()
      return s
    }
  }

  if (s.phase === Phase.Auction && s.auction?.active) {
    const auc = s.auction
    if (action.type === 'Bid') {
      const amount = action.amount
      if (amount >= auc.currentBid + auc.minIncrement && s.players[pid].cash >= amount) {
        auc.currentBid = amount
        auc.highestBidder = pid
        addLog(s, { type: 'Bid', player: pid, amount })
      }
      s.rng = rng.state()
      return s
    }
    if (action.type === 'PassBid') {
      auc.participants = auc.participants.filter(x => x !== pid)
      if (auc.participants.length <= 1 && auc.highestBidder != null) {
        const winner = auc.highestBidder
        const price = auc.currentBid
        pay(s, winner, 'Bank', price, 'AuctionWin')
        transferTile(s, auc.tile, winner)
        addLog(s, { type: 'WonAuction', player: winner, tile: auc.tile, price })
        s.auction = null
        s.phase = Phase.EndTurn
      }
      s.rng = rng.state()
      return s
    }
  }

  if (action.type === 'ProposeTrade' && (!s.auction || !s.auction.active)) {
    s.trade = { active: true, offer: action.offer }
    addLog(s, { type: 'TradeProposed', offer: action.offer })
    s.rng = rng.state()
    return s
  }
  if (s.trade?.active && s.trade.offer) {
    const offer = s.trade.offer
    if (action.type === 'RejectTrade') {
      addLog(s, { type: 'TradeRejected', offer })
      s.trade = { active: false, offer: null }
      s.rng = rng.state()
      return s
    }
    if (action.type === 'AcceptTrade') {
      const from = s.players[offer.from]
      const to = s.players[offer.to]
      if (from.cash >= offer.cashFrom && to.cash >= offer.cashTo) {
        from.cash -= offer.cashFrom
        to.cash += offer.cashFrom
        to.cash -= offer.cashTo
        from.cash += offer.cashTo
        for (const t of offer.tilesFrom) transferTile(s, t, offer.to)
        for (const t of offer.tilesTo) transferTile(s, t, offer.from)
        const minJ = Math.min(from.getOutOfJailCards, offer.jailCardsFrom)
        from.getOutOfJailCards -= minJ
        to.getOutOfJailCards += minJ
        const minJ2 = Math.min(to.getOutOfJailCards, offer.jailCardsTo)
        to.getOutOfJailCards -= minJ2
        from.getOutOfJailCards += minJ2
        addLog(s, { type: 'TradeAccepted', offer })
      } else {
        addLog(s, { type: 'TradeRejected', offer })
      }
      s.trade = { active: false, offer: null }
      s.rng = rng.state()
      return s
    }
  }

  if (action.type === 'Build') {
    const own = getOwnership(s, action.tile)
    const tile = s.board[action.tile]
    if (tile.kind !== TileKind.Property) throw new Error('Can only build on properties')
    const groupTiles = BOARD.filter(t => t.kind === TileKind.Property && t.color === tile.color).map(t => t.index)
    if (!groupTiles.every(i => getOwnership(s, i).owner === pid)) throw new Error('Need monopoly')
    const houses = own.houses ?? 0
    if (own.hotel) throw new Error('Already hotel')
    const minH = Math.min(...groupTiles.map(i => getOwnership(s, i).houses ?? 0))
    if (houses > minH) throw new Error('Even-building rule')
    pay(s, pid, 'Bank', tile.houseCost, 'Build')
    if (houses >= 4) {
      own.hotel = true
      own.houses = 4
    } else {
      own.houses = houses + 1
    }
    addLog(s, { type: 'Built', player: pid, tile: action.tile, houses: own.houses ?? 0, hotel: !!own.hotel })
    s.rng = rng.state()
    return s
  }
  if (action.type === 'Sell') {
    const own = getOwnership(s, action.tile)
    const tile = s.board[action.tile]
    if (tile.kind !== TileKind.Property) throw new Error('Can only sell on properties')
    const groupTiles = BOARD.filter(t => t.kind === TileKind.Property && t.color === tile.color).map(t => t.index)
    const maxH = Math.max(...groupTiles.map(i => getOwnership(s, i).houses ?? 0))
    const houses = own.houses ?? 0
    if (own.hotel) {
      own.hotel = false
      own.houses = 4
      s.players[pid].cash += tile.houseCost / 2
    } else {
      if (houses <= Math.min(...groupTiles.map(i => getOwnership(s, i).houses ?? 0))) {
        if (houses === 0) throw new Error('No houses to sell')
      }
      if (houses < maxH) throw new Error('Even-building rule')
      own.houses = houses - 1
      s.players[pid].cash += tile.houseCost / 2
    }
    addLog(s, { type: 'Sold', player: pid, tile: action.tile, houses: own.houses ?? 0, hotel: !!own.hotel })
    s.rng = rng.state()
    return s
  }
  if (action.type === 'Mortgage' || action.type === 'Unmortgage') {
    throw new Error('Mortgages not implemented in M1')
  }

  if (action.type === 'EndTurn') {
    if (s.phase !== Phase.GameOver) {
      s.currentPlayer = nextPlayerIndex(s)
      s.phase = Phase.PreRoll
      s.doublesInRow = 0
      addLog(s, { type: 'TurnStarted', player: s.currentPlayer })
    }
    s.rng = rng.state()
    return s
  }

  s.rng = rng.state()
  return s
}

export const serialize = (s: GameState): string => JSON.stringify(s)

export const deserialize = (json: string): GameState => {
  const s = JSON.parse(json) as GameState
  return s
}

const diceTotals = (() => {
  const counts: Record<number, number> = {}
  for (let d1 = 1; d1 <= 6; d1++) for (let d2 = 1; d2 <= 6; d2++) counts[d1 + d2] = (counts[d1 + d2] || 0) + 1
  const out: { steps: number; p: number }[] = []
  for (let t = 2; t <= 12; t++) out.push({ steps: t, p: (counts[t] || 0) / 36 })
  return out
})()

const JAIL_INDEX = 10

const groupTiles = (color: any): number[] => GROUPS[color as keyof typeof GROUPS] || []

const groupOf = (i: number): any | null => {
  const tile = BOARD[i]
  return tile.kind === TileKind.Property ? tile.color : null
}

const canBuildOn = (s: GameState, pid: number, tile: number): boolean => {
  const t = s.board[tile]
  if (t.kind !== TileKind.Property) return false
  const tiles = BOARD.filter(x => x.kind === TileKind.Property && x.color === t.color).map(x => x.index)
  if (!tiles.every(i => (s.ownership[i]?.owner ?? null) === pid)) return false
  const own = s.ownership[tile] || { owner: null, houses: 0, hotel: false }
  if (own.hotel) return false
  const houses = own.houses ?? 0
  const minH = Math.min(...tiles.map(i => (s.ownership[i]?.houses ?? 0)))
  if (houses > minH) return false
  if ((s.players[pid]?.cash ?? 0) < t.houseCost) return false
  return true
}

const legalBuildTiles = (s: GameState, pid: number): { tile: number; cost: number }[] => {
  const res: { tile: number; cost: number }[] = []
  for (const [k, own] of Object.entries(s.ownership)) {
    const i = Number(k)
    if (own.owner !== pid) continue
    const t = s.board[i]
    if (t.kind !== TileKind.Property) continue
    if (canBuildOn(s, pid, i)) res.push({ tile: i, cost: t.houseCost })
  }
  return res
}

const legalSellTiles = (s: GameState, pid: number): { tile: number; value: number }[] => {
  const res: { tile: number; value: number }[] = []
  for (const [k, own] of Object.entries(s.ownership)) {
    const i = Number(k)
    if (own.owner !== pid) continue
    const t = s.board[i]
    if (t.kind !== TileKind.Property) continue
    const tiles = BOARD.filter(x => x.kind === TileKind.Property && x.color === t.color).map(x => x.index)
    const maxH = Math.max(...tiles.map(ii => (s.ownership[ii]?.houses ?? 0)))
    const houses = own.hotel ? 5 : own.houses ?? 0
    if (houses <= 0) continue
    if (!own.hotel && (own.houses ?? 0) < maxH) continue
    res.push({ tile: i, value: Math.floor(t.houseCost / 2) })
  }
  return res
}

const roughLiquidity = (s: GameState, pid: number): { cash: number; houseSaleValue: number; total: number } => {
  let value = 0
  for (const [k, own] of Object.entries(s.ownership)) {
    const i = Number(k)
    if (own.owner !== pid) continue
    const t = s.board[i]
    if (t.kind !== TileKind.Property) continue
    const houses = (own.hotel ? 5 : (own.houses ?? 0))
    value += houses * (t.houseCost / 2)
  }
  const cash = s.players[pid]?.cash ?? 0
  return { cash, houseSaleValue: Math.floor(value), total: cash + Math.floor(value) }
}

const rentCurve = (s: GameState, tile: number): number[] => {
  const t = s.board[tile]
  if (t.kind !== TileKind.Property) return [0, 0, 0, 0, 0, 0]
  const owner = s.ownership[tile]?.owner
  const hasMono = owner != null ? BOARD.filter(x => x.kind === TileKind.Property && x.color === t.color).map(x => x.index).every(i => (s.ownership[i]?.owner ?? null) === owner) : false
  const base0 = hasMono ? t.rents[0] * 2 : t.rents[0]
  return [base0, t.rents[1], t.rents[2], t.rents[3], t.rents[4], t.rents[5]]
}

const computeLandingProbs = (s: GameState, pid: number, turns = 1): number[] => {
  const size = BOARD_SIZE
  const pos0 = s.players[pid]?.position ?? 0
  let current = new Float64Array(size)
  current[pos0] = 1
  let accum = new Float64Array(size)
  for (let step = 0; step < turns; step++) {
    const next = new Float64Array(size)
    for (let i = 0; i < size; i++) {
      const pHere = current[i]
      if (pHere === 0) continue
      for (const { steps, p } of diceTotals) {
        let dest = (i + steps) % size
        const tile = s.board[dest]
        if (tile.kind === TileKind.GoToJail) dest = JAIL_INDEX
        next[dest] += pHere * p
      }
    }
    for (let i = 0; i < size; i++) accum[i] += next[i]
    current = next
  }
  const out = Array.from(accum).map(x => x / Math.max(1, turns))
  return out
}

const expectedRentRisk = (s: GameState, pid: number, turns = 1): number => {
  const probs = computeLandingProbs(s, pid, turns)
  let sum = 0
  const avgDice: DiceRoll = { d1: 3, d2: 4, total: 7, isDouble: false }
  for (let i = 0; i < probs.length; i++) {
    const own = s.ownership[i]
    if (!own || own.owner == null || own.owner === pid) continue
    sum += probs[i] * rentFor(s, i, avgDice)
  }
  return sum
}

const monopolyProgress = (s: GameState, pid: number) => {
  const res: { color: any; own: number; total: number; missing: number; unowned: number; ownedBy: Record<number, number> }[] = []
  for (const [color, tiles] of Object.entries(GROUPS)) {
    const ints = tiles as unknown as number[]
    let own = 0
    const ownedBy: Record<number, number> = {}
    let unowned = 0
    for (const i of ints) {
      const o = s.ownership[i]
      if (!o || o.owner == null) unowned += 1
      else if (o.owner === pid) own += 1
      else ownedBy[o.owner] = (ownedBy[o.owner] || 0) + 1
    }
    const total = ints.length
    res.push({ color: color as any, own, total, missing: total - own, unowned, ownedBy })
  }
  return res
}

export const selectors = {
  rentFor,
  ownsAllInGroup,
  groupTiles,
  groupOf,
  canBuildOn,
  legalBuildTiles,
  legalSellTiles,
  roughLiquidity,
  rentCurve,
  computeLandingProbs,
  expectedRentRisk,
  monopolyProgress,
}
