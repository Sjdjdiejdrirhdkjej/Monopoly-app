export type ColorGroup = 'Brown' | 'LightBlue' | 'Purple' | 'Orange' | 'Red' | 'Yellow' | 'Green' | 'DarkBlue';
export declare enum TileKind {
    Go = "Go",
    Property = "Property",
    Railroad = "Railroad",
    Utility = "Utility",
    Tax = "Tax",
    Chance = "Chance",
    CommunityChest = "CommunityChest",
    Jail = "Jail",
    FreeParking = "FreeParking",
    GoToJail = "GoToJail"
}
export type Tile = {
    index: number;
    kind: TileKind.Go;
    name: string;
} | {
    index: number;
    kind: TileKind.Property;
    name: string;
    color: ColorGroup;
    price: number;
    rents: [number, number, number, number, number, number];
    houseCost: number;
} | {
    index: number;
    kind: TileKind.Railroad;
    name: string;
    price: number;
} | {
    index: number;
    kind: TileKind.Utility;
    name: string;
    price: number;
} | {
    index: number;
    kind: TileKind.Tax;
    name: string;
    amount: number;
} | {
    index: number;
    kind: TileKind.Chance;
    name: string;
} | {
    index: number;
    kind: TileKind.CommunityChest;
    name: string;
} | {
    index: number;
    kind: TileKind.Jail;
    name: string;
} | {
    index: number;
    kind: TileKind.FreeParking;
    name: string;
} | {
    index: number;
    kind: TileKind.GoToJail;
    name: string;
};
export declare enum Phase {
    Setup = "Setup",
    TurnStart = "TurnStart",
    PreRoll = "PreRoll",
    Rolling = "Rolling",
    Move = "Move",
    Resolve = "Resolve",
    BuyDecision = "BuyDecision",
    Auction = "Auction",
    Trade = "Trade",
    BuildSell = "BuildSell",
    EndTurn = "EndTurn",
    GameOver = "GameOver"
}
export type DiceRoll = {
    d1: number;
    d2: number;
    total: number;
    isDouble: boolean;
};
export declare enum CardKind {
    MoveTo = "MoveTo",
    MoveToNearestRailroad = "MoveToNearestRailroad",
    MoveToNearestUtility = "MoveToNearestUtility",
    Pay = "Pay",
    Receive = "Receive",
    PayEachPlayer = "PayEachPlayer",
    GoToJail = "GoToJail",
    GetOutOfJail = "GetOutOfJail",
    Repairs = "Repairs"
}
export type Card = {
    kind: CardKind.MoveTo;
    arg: number;
    text: string;
} | {
    kind: CardKind.MoveToNearestRailroad;
    text: string;
} | {
    kind: CardKind.MoveToNearestUtility;
    text: string;
} | {
    kind: CardKind.Pay;
    arg: number;
    text: string;
} | {
    kind: CardKind.Receive;
    arg: number;
    text: string;
} | {
    kind: CardKind.PayEachPlayer;
    arg: number;
    text: string;
} | {
    kind: CardKind.GoToJail;
    text: string;
} | {
    kind: CardKind.GetOutOfJail;
    text: string;
} | {
    kind: CardKind.Repairs;
    arg: number;
    arg2: number;
    text: string;
};
export type CardDeck = {
    seed: string;
    chance: Card[];
    chest: Card[];
    chanceIndex: number;
    chestIndex: number;
};
export type Ownership = {
    owner: number | null;
    houses?: number;
    hotel?: boolean;
    mortgaged?: boolean;
};
export type Player = {
    id: number;
    name: string;
    cash: number;
    position: number;
    inJail: boolean;
    jailTurns: number;
    getOutOfJailCards: number;
    bankrupt: boolean;
};
export type AuctionState = {
    active: boolean;
    tile: number;
    currentBid: number;
    highestBidder: number | null;
    participants: number[];
    minIncrement: number;
};
export type TradeOffer = {
    from: number;
    to: number;
    cashFrom: number;
    cashTo: number;
    tilesFrom: number[];
    tilesTo: number[];
    jailCardsFrom: number;
    jailCardsTo: number;
};
export type TradeState = {
    active: boolean;
    offer: TradeOffer | null;
};
export type Event = {
    type: 'GameStarted';
    seed: string;
} | {
    type: 'TurnStarted';
    player: number;
} | {
    type: 'Rolled';
    player: number;
    d1: number;
    d2: number;
} | {
    type: 'Moved';
    player: number;
    from: number;
    to: number;
} | {
    type: 'PassedGo';
    player: number;
    amount: number;
} | {
    type: 'Paid';
    from: number;
    to: number | 'Bank';
    amount: number;
    reason: string;
} | {
    type: 'Received';
    to: number;
    amount: number;
    reason: string;
} | {
    type: 'BoughtProperty';
    player: number;
    tile: number;
    price: number;
} | {
    type: 'StartedAuction';
    tile: number;
} | {
    type: 'Bid';
    player: number;
    amount: number;
} | {
    type: 'WonAuction';
    player: number;
    tile: number;
    price: number;
} | {
    type: 'WentToJail';
    player: number;
} | {
    type: 'UsedJailCard';
    player: number;
} | {
    type: 'TradeProposed';
    offer: TradeOffer;
} | {
    type: 'TradeAccepted';
    offer: TradeOffer;
} | {
    type: 'TradeRejected';
    offer: TradeOffer;
} | {
    type: 'Built';
    player: number;
    tile: number;
    houses: number;
    hotel: boolean;
} | {
    type: 'Sold';
    player: number;
    tile: number;
    houses: number;
    hotel: boolean;
} | {
    type: 'Bankrupt';
    player: number;
    to: number | 'Bank';
} | {
    type: 'DrewCard';
    player: number;
    deck: 'chance' | 'chest';
    text: string;
};
export type RNGState = {
    seed: string;
    prngState: any;
    calls: number;
};
export type GameConfig = {
    startingCash: number;
    goAmount: number;
    jailFine: number;
};
export type GameState = {
    version: number;
    config: GameConfig;
    phase: Phase;
    currentPlayer: number;
    players: Player[];
    board: Tile[];
    ownership: Record<number, Ownership>;
    decks: CardDeck;
    rng: RNGState;
    lastRoll: DiceRoll | null;
    doublesInRow: number;
    auction: AuctionState | null;
    trade: TradeState | null;
    logs: Event[];
    winner: number | null;
};
export type Action = {
    type: 'StartGame';
    seed: string;
    players: {
        name: string;
    }[];
} | {
    type: 'EndTurn';
} | {
    type: 'Roll';
} | {
    type: 'Buy';
} | {
    type: 'DeclineBuy';
} | {
    type: 'StartAuction';
} | {
    type: 'Bid';
    amount: number;
} | {
    type: 'PassBid';
} | {
    type: 'PayJail';
} | {
    type: 'UseJailCard';
} | {
    type: 'TryDoubles';
} | {
    type: 'ProposeTrade';
    offer: TradeOffer;
} | {
    type: 'AcceptTrade';
} | {
    type: 'RejectTrade';
} | {
    type: 'Build';
    tile: number;
} | {
    type: 'Sell';
    tile: number;
} | {
    type: 'Mortgage';
    tile: number;
} | {
    type: 'Unmortgage';
    tile: number;
};
//# sourceMappingURL=types.d.ts.map