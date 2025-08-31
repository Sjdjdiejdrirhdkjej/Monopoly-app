import { z } from 'zod';
import { CardKind, Phase, TileKind } from './types';
export const zColorGroup = z.enum([
    'Brown',
    'LightBlue',
    'Purple',
    'Orange',
    'Red',
    'Yellow',
    'Green',
    'DarkBlue'
]);
export const zTile = z.discriminatedUnion('kind', [
    z.object({ kind: z.literal(TileKind.Go), index: z.number(), name: z.string() }),
    z.object({ kind: z.literal(TileKind.Property), index: z.number(), name: z.string(), color: zColorGroup, price: z.number(), rents: z.tuple([z.number(), z.number(), z.number(), z.number(), z.number(), z.number()]), houseCost: z.number() }),
    z.object({ kind: z.literal(TileKind.Railroad), index: z.number(), name: z.string(), price: z.number() }),
    z.object({ kind: z.literal(TileKind.Utility), index: z.number(), name: z.string(), price: z.number() }),
    z.object({ kind: z.literal(TileKind.Tax), index: z.number(), name: z.string(), amount: z.number() }),
    z.object({ kind: z.literal(TileKind.Chance), index: z.number(), name: z.string() }),
    z.object({ kind: z.literal(TileKind.CommunityChest), index: z.number(), name: z.string() }),
    z.object({ kind: z.literal(TileKind.Jail), index: z.number(), name: z.string() }),
    z.object({ kind: z.literal(TileKind.FreeParking), index: z.number(), name: z.string() }),
    z.object({ kind: z.literal(TileKind.GoToJail), index: z.number(), name: z.string() })
]);
export const zPhase = z.nativeEnum(Phase);
export const zDice = z.object({ d1: z.number(), d2: z.number(), total: z.number(), isDouble: z.boolean() });
export const zCard = z.discriminatedUnion('kind', [
    z.object({ kind: z.literal(CardKind.MoveTo), arg: z.number(), text: z.string() }),
    z.object({ kind: z.literal(CardKind.MoveToNearestRailroad), text: z.string() }),
    z.object({ kind: z.literal(CardKind.MoveToNearestUtility), text: z.string() }),
    z.object({ kind: z.literal(CardKind.Pay), arg: z.number(), text: z.string() }),
    z.object({ kind: z.literal(CardKind.Receive), arg: z.number(), text: z.string() }),
    z.object({ kind: z.literal(CardKind.PayEachPlayer), arg: z.number(), text: z.string() }),
    z.object({ kind: z.literal(CardKind.GoToJail), text: z.string() }),
    z.object({ kind: z.literal(CardKind.GetOutOfJail), text: z.string() }),
    z.object({ kind: z.literal(CardKind.Repairs), arg: z.number(), arg2: z.number(), text: z.string() })
]);
export const zDeck = z.object({ seed: z.string(), chance: z.array(zCard), chest: z.array(zCard), chanceIndex: z.number(), chestIndex: z.number() });
export const zOwnership = z.object({ owner: z.number().nullable(), houses: z.number().optional(), hotel: z.boolean().optional(), mortgaged: z.boolean().optional() });
export const zPlayer = z.object({ id: z.number(), name: z.string(), cash: z.number(), position: z.number(), inJail: z.boolean(), jailTurns: z.number(), getOutOfJailCards: z.number(), bankrupt: z.boolean() });
export const zAuction = z.object({ active: z.boolean(), tile: z.number(), currentBid: z.number(), highestBidder: z.number().nullable(), participants: z.array(z.number()), minIncrement: z.number() }).nullable();
export const zTradeOffer = z.object({ from: z.number(), to: z.number(), cashFrom: z.number(), cashTo: z.number(), tilesFrom: z.array(z.number()), tilesTo: z.array(z.number()), jailCardsFrom: z.number(), jailCardsTo: z.number() });
export const zTrade = z.object({ active: z.boolean(), offer: zTradeOffer.nullable() }).nullable();
export const zEvent = z.union([
    z.object({ type: z.literal('GameStarted'), seed: z.string() }),
    z.object({ type: z.literal('TurnStarted'), player: z.number() }),
    z.object({ type: z.literal('Rolled'), player: z.number(), d1: z.number(), d2: z.number() }),
    z.object({ type: z.literal('Moved'), player: z.number(), from: z.number(), to: z.number() }),
    z.object({ type: z.literal('PassedGo'), player: z.number(), amount: z.number() }),
    z.object({ type: z.literal('Paid'), from: z.number(), to: z.union([z.number(), z.literal('Bank')]), amount: z.number(), reason: z.string() }),
    z.object({ type: z.literal('Received'), to: z.number(), amount: z.number(), reason: z.string() }),
    z.object({ type: z.literal('BoughtProperty'), player: z.number(), tile: z.number(), price: z.number() }),
    z.object({ type: z.literal('StartedAuction'), tile: z.number() }),
    z.object({ type: z.literal('Bid'), player: z.number(), amount: z.number() }),
    z.object({ type: z.literal('WonAuction'), player: z.number(), tile: z.number(), price: z.number() }),
    z.object({ type: z.literal('WentToJail'), player: z.number() }),
    z.object({ type: z.literal('UsedJailCard'), player: z.number() }),
    z.object({ type: z.literal('TradeProposed'), offer: zTradeOffer }),
    z.object({ type: z.literal('TradeAccepted'), offer: zTradeOffer }),
    z.object({ type: z.literal('TradeRejected'), offer: zTradeOffer }),
    z.object({ type: z.literal('Built'), player: z.number(), tile: z.number(), houses: z.number(), hotel: z.boolean() }),
    z.object({ type: z.literal('Sold'), player: z.number(), tile: z.number(), houses: z.number(), hotel: z.boolean() }),
    z.object({ type: z.literal('Bankrupt'), player: z.number(), to: z.union([z.number(), z.literal('Bank')]) }),
    z.object({ type: z.literal('DrewCard'), player: z.number(), deck: z.union([z.literal('chance'), z.literal('chest')]), text: z.string() })
]);
export const zRNGState = z.object({ seed: z.string(), prngState: z.any(), calls: z.number() });
export const zGameConfig = z.object({ startingCash: z.number(), goAmount: z.number(), jailFine: z.number() });
export const zGameState = z.object({
    version: z.number(),
    config: zGameConfig,
    phase: z.nativeEnum(Phase),
    currentPlayer: z.number(),
    players: z.array(zPlayer),
    board: z.array(zTile),
    ownership: z.record(z.string(), zOwnership),
    decks: zDeck,
    rng: zRNGState,
    lastRoll: zDice.nullable(),
    doublesInRow: z.number(),
    auction: zAuction,
    trade: zTrade,
    logs: z.array(zEvent),
    winner: z.number().nullable()
});
export const zAction = z.discriminatedUnion('type', [
    z.object({ type: z.literal('StartGame'), seed: z.string(), players: z.array(z.object({ name: z.string() })) }),
    z.object({ type: z.literal('EndTurn') }),
    z.object({ type: z.literal('Roll') }),
    z.object({ type: z.literal('Buy') }),
    z.object({ type: z.literal('DeclineBuy') }),
    z.object({ type: z.literal('StartAuction') }),
    z.object({ type: z.literal('Bid'), amount: z.number() }),
    z.object({ type: z.literal('PassBid') }),
    z.object({ type: z.literal('PayJail') }),
    z.object({ type: z.literal('UseJailCard') }),
    z.object({ type: z.literal('TryDoubles') }),
    z.object({ type: z.literal('ProposeTrade'), offer: z.object({ from: z.number(), to: z.number(), cashFrom: z.number(), cashTo: z.number(), tilesFrom: z.array(z.number()), tilesTo: z.array(z.number()), jailCardsFrom: z.number(), jailCardsTo: z.number() }) }),
    z.object({ type: z.literal('AcceptTrade') }),
    z.object({ type: z.literal('RejectTrade') }),
    z.object({ type: z.literal('Build'), tile: z.number() }),
    z.object({ type: z.literal('Sell'), tile: z.number() }),
    z.object({ type: z.literal('Mortgage'), tile: z.number() }),
    z.object({ type: z.literal('Unmortgage'), tile: z.number() })
]);
//# sourceMappingURL=schema.js.map