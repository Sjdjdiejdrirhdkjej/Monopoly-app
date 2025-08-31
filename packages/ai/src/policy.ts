import { Action, Phase } from '@monopoly/shared'
import { selectors } from '@monopoly/rules'

export const chooseAction = (state: any, legal: Action[]): Action => {
  for (const a of legal) if (a.type === 'Buy') return a
  for (const a of legal) if (a.type === 'PayJail') return a
  for (const a of legal) if (a.type === 'TryDoubles') return a
  for (const a of legal) if (a.type === 'UseJailCard') return a
  for (const a of legal) if (a.type === 'Roll') return a
  for (const a of legal) if (a.type === 'Bid') return a
  for (const a of legal) if (a.type === 'PassBid') return a
  for (const a of legal) if (a.type === 'AcceptTrade') return a
  for (const a of legal) if (a.type === 'RejectTrade') return a
  for (const a of legal) if (a.type === 'EndTurn') return a
  return legal[0]
}
