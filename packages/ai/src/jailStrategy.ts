import { Action, Phase } from '@monopoly/shared'
import { selectors } from '@monopoly/rules'
import { AiContext } from './types'

export const jailStrategy = (s: any, legal: Action[], ctx: AiContext): Action | null => {
  if (!(s.phase === Phase.PreRoll && s.players[s.currentPlayer].inJail)) return null
  const pid = s.currentPlayer
  const canPay = s.players[pid].cash >= s.config.jailFine
  const hasCard = s.players[pid].getOutOfJailCards > 0
  const risk = selectors.expectedRentRisk(s, pid, Math.max(1, ctx.params.lookaheadTurns))
  const lowCash = s.players[pid].cash < ctx.params.liquidityBuffer
  if (!canPay && !hasCard) return { type: 'TryDoubles' }
  if (lowCash && risk > 100) return { type: 'TryDoubles' }
  if (hasCard && !lowCash && risk < 80) return { type: 'UseJailCard' }
  if (canPay) return { type: 'PayJail' }
  return { type: 'TryDoubles' }
}
