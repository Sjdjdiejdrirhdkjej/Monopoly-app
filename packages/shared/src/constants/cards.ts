import { Card, CardDeck, CardKind } from '../types'
import seedrandom from 'seedrandom'

const chanceCards: Card[] = [
  { kind: CardKind.MoveTo, arg: 0, text: 'Advance to Start' },
  { kind: CardKind.MoveTo, arg: 24, text: 'Advance to Red-3' },
  { kind: CardKind.MoveTo, arg: 39, text: 'Advance to DarkBlue-2' },
  { kind: CardKind.MoveToNearestRailroad, text: 'Advance to nearest Railroad; if owned pay double rent' },
  { kind: CardKind.MoveToNearestUtility, text: 'Advance to nearest Utility; if owned pay 10x dice' },
  { kind: CardKind.PayEachPlayer, arg: 50, text: 'Pay each player $50' },
  { kind: CardKind.Receive, arg: 150, text: 'Your investment matures, collect $150' },
  { kind: CardKind.GoToJail, text: 'Go to Jail' },
  { kind: CardKind.GetOutOfJail, text: 'Get out of jail free' },
  { kind: CardKind.Repairs, arg: 25, arg2: 100, text: 'Property repairs: $25/house, $100/hotel' },
]

const chestCards: Card[] = [
  { kind: CardKind.Receive, arg: 200, text: 'Bank error in your favor, collect $200' },
  { kind: CardKind.Pay, arg: 50, text: 'Doctor fees, pay $50' },
  { kind: CardKind.GetOutOfJail, text: 'Get out of jail free' },
  { kind: CardKind.GoToJail, text: 'Go to Jail' },
  { kind: CardKind.Receive, arg: 100, text: 'You inherit $100' },
  { kind: CardKind.Receive, arg: 10, text: 'Collect $10 from sale' },
  { kind: CardKind.Pay, arg: 100, text: 'Pay school fees of $100' },
  { kind: CardKind.MoveTo, arg: 0, text: 'Advance to Start' },
  { kind: CardKind.Repairs, arg: 40, arg2: 115, text: 'Property repairs: $40/house, $115/hotel' },
]

export const createDecks = (seed: string): CardDeck => {
  const rng = seedrandom(seed, { state: true })
  const shuffle = <T,>(a: T[]): T[] => {
    const arr = a.slice()
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  }
  return {
    seed,
    chance: shuffle(chanceCards),
    chest: shuffle(chestCards),
    chanceIndex: 0,
    chestIndex: 0
  }
}
