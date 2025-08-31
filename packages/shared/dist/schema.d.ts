import { z } from 'zod';
import { CardKind, Phase, TileKind } from './types';
export declare const zColorGroup: z.ZodEnum<["Brown", "LightBlue", "Purple", "Orange", "Red", "Yellow", "Green", "DarkBlue"]>;
export declare const zTile: z.ZodDiscriminatedUnion<"kind", [z.ZodObject<{
    kind: z.ZodLiteral<TileKind.Go>;
    index: z.ZodNumber;
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    kind: TileKind.Go;
    index: number;
    name: string;
}, {
    kind: TileKind.Go;
    index: number;
    name: string;
}>, z.ZodObject<{
    kind: z.ZodLiteral<TileKind.Property>;
    index: z.ZodNumber;
    name: z.ZodString;
    color: z.ZodEnum<["Brown", "LightBlue", "Purple", "Orange", "Red", "Yellow", "Green", "DarkBlue"]>;
    price: z.ZodNumber;
    rents: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber, z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
    houseCost: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    kind: TileKind.Property;
    index: number;
    name: string;
    color: "Brown" | "LightBlue" | "Purple" | "Orange" | "Red" | "Yellow" | "Green" | "DarkBlue";
    price: number;
    rents: [number, number, number, number, number, number];
    houseCost: number;
}, {
    kind: TileKind.Property;
    index: number;
    name: string;
    color: "Brown" | "LightBlue" | "Purple" | "Orange" | "Red" | "Yellow" | "Green" | "DarkBlue";
    price: number;
    rents: [number, number, number, number, number, number];
    houseCost: number;
}>, z.ZodObject<{
    kind: z.ZodLiteral<TileKind.Railroad>;
    index: z.ZodNumber;
    name: z.ZodString;
    price: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    kind: TileKind.Railroad;
    index: number;
    name: string;
    price: number;
}, {
    kind: TileKind.Railroad;
    index: number;
    name: string;
    price: number;
}>, z.ZodObject<{
    kind: z.ZodLiteral<TileKind.Utility>;
    index: z.ZodNumber;
    name: z.ZodString;
    price: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    kind: TileKind.Utility;
    index: number;
    name: string;
    price: number;
}, {
    kind: TileKind.Utility;
    index: number;
    name: string;
    price: number;
}>, z.ZodObject<{
    kind: z.ZodLiteral<TileKind.Tax>;
    index: z.ZodNumber;
    name: z.ZodString;
    amount: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    kind: TileKind.Tax;
    index: number;
    name: string;
    amount: number;
}, {
    kind: TileKind.Tax;
    index: number;
    name: string;
    amount: number;
}>, z.ZodObject<{
    kind: z.ZodLiteral<TileKind.Chance>;
    index: z.ZodNumber;
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    kind: TileKind.Chance;
    index: number;
    name: string;
}, {
    kind: TileKind.Chance;
    index: number;
    name: string;
}>, z.ZodObject<{
    kind: z.ZodLiteral<TileKind.CommunityChest>;
    index: z.ZodNumber;
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    kind: TileKind.CommunityChest;
    index: number;
    name: string;
}, {
    kind: TileKind.CommunityChest;
    index: number;
    name: string;
}>, z.ZodObject<{
    kind: z.ZodLiteral<TileKind.Jail>;
    index: z.ZodNumber;
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    kind: TileKind.Jail;
    index: number;
    name: string;
}, {
    kind: TileKind.Jail;
    index: number;
    name: string;
}>, z.ZodObject<{
    kind: z.ZodLiteral<TileKind.FreeParking>;
    index: z.ZodNumber;
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    kind: TileKind.FreeParking;
    index: number;
    name: string;
}, {
    kind: TileKind.FreeParking;
    index: number;
    name: string;
}>, z.ZodObject<{
    kind: z.ZodLiteral<TileKind.GoToJail>;
    index: z.ZodNumber;
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    kind: TileKind.GoToJail;
    index: number;
    name: string;
}, {
    kind: TileKind.GoToJail;
    index: number;
    name: string;
}>]>;
export declare const zPhase: z.ZodNativeEnum<typeof Phase>;
export declare const zDice: z.ZodObject<{
    d1: z.ZodNumber;
    d2: z.ZodNumber;
    total: z.ZodNumber;
    isDouble: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    d1: number;
    d2: number;
    total: number;
    isDouble: boolean;
}, {
    d1: number;
    d2: number;
    total: number;
    isDouble: boolean;
}>;
export declare const zCard: z.ZodDiscriminatedUnion<"kind", [z.ZodObject<{
    kind: z.ZodLiteral<CardKind.MoveTo>;
    arg: z.ZodNumber;
    text: z.ZodString;
}, "strip", z.ZodTypeAny, {
    kind: CardKind.MoveTo;
    arg: number;
    text: string;
}, {
    kind: CardKind.MoveTo;
    arg: number;
    text: string;
}>, z.ZodObject<{
    kind: z.ZodLiteral<CardKind.MoveToNearestRailroad>;
    text: z.ZodString;
}, "strip", z.ZodTypeAny, {
    kind: CardKind.MoveToNearestRailroad;
    text: string;
}, {
    kind: CardKind.MoveToNearestRailroad;
    text: string;
}>, z.ZodObject<{
    kind: z.ZodLiteral<CardKind.MoveToNearestUtility>;
    text: z.ZodString;
}, "strip", z.ZodTypeAny, {
    kind: CardKind.MoveToNearestUtility;
    text: string;
}, {
    kind: CardKind.MoveToNearestUtility;
    text: string;
}>, z.ZodObject<{
    kind: z.ZodLiteral<CardKind.Pay>;
    arg: z.ZodNumber;
    text: z.ZodString;
}, "strip", z.ZodTypeAny, {
    kind: CardKind.Pay;
    arg: number;
    text: string;
}, {
    kind: CardKind.Pay;
    arg: number;
    text: string;
}>, z.ZodObject<{
    kind: z.ZodLiteral<CardKind.Receive>;
    arg: z.ZodNumber;
    text: z.ZodString;
}, "strip", z.ZodTypeAny, {
    kind: CardKind.Receive;
    arg: number;
    text: string;
}, {
    kind: CardKind.Receive;
    arg: number;
    text: string;
}>, z.ZodObject<{
    kind: z.ZodLiteral<CardKind.PayEachPlayer>;
    arg: z.ZodNumber;
    text: z.ZodString;
}, "strip", z.ZodTypeAny, {
    kind: CardKind.PayEachPlayer;
    arg: number;
    text: string;
}, {
    kind: CardKind.PayEachPlayer;
    arg: number;
    text: string;
}>, z.ZodObject<{
    kind: z.ZodLiteral<CardKind.GoToJail>;
    text: z.ZodString;
}, "strip", z.ZodTypeAny, {
    kind: CardKind.GoToJail;
    text: string;
}, {
    kind: CardKind.GoToJail;
    text: string;
}>, z.ZodObject<{
    kind: z.ZodLiteral<CardKind.GetOutOfJail>;
    text: z.ZodString;
}, "strip", z.ZodTypeAny, {
    kind: CardKind.GetOutOfJail;
    text: string;
}, {
    kind: CardKind.GetOutOfJail;
    text: string;
}>, z.ZodObject<{
    kind: z.ZodLiteral<CardKind.Repairs>;
    arg: z.ZodNumber;
    arg2: z.ZodNumber;
    text: z.ZodString;
}, "strip", z.ZodTypeAny, {
    kind: CardKind.Repairs;
    arg: number;
    text: string;
    arg2: number;
}, {
    kind: CardKind.Repairs;
    arg: number;
    text: string;
    arg2: number;
}>]>;
export declare const zDeck: z.ZodObject<{
    seed: z.ZodString;
    chance: z.ZodArray<z.ZodDiscriminatedUnion<"kind", [z.ZodObject<{
        kind: z.ZodLiteral<CardKind.MoveTo>;
        arg: z.ZodNumber;
        text: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        kind: CardKind.MoveTo;
        arg: number;
        text: string;
    }, {
        kind: CardKind.MoveTo;
        arg: number;
        text: string;
    }>, z.ZodObject<{
        kind: z.ZodLiteral<CardKind.MoveToNearestRailroad>;
        text: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        kind: CardKind.MoveToNearestRailroad;
        text: string;
    }, {
        kind: CardKind.MoveToNearestRailroad;
        text: string;
    }>, z.ZodObject<{
        kind: z.ZodLiteral<CardKind.MoveToNearestUtility>;
        text: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        kind: CardKind.MoveToNearestUtility;
        text: string;
    }, {
        kind: CardKind.MoveToNearestUtility;
        text: string;
    }>, z.ZodObject<{
        kind: z.ZodLiteral<CardKind.Pay>;
        arg: z.ZodNumber;
        text: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        kind: CardKind.Pay;
        arg: number;
        text: string;
    }, {
        kind: CardKind.Pay;
        arg: number;
        text: string;
    }>, z.ZodObject<{
        kind: z.ZodLiteral<CardKind.Receive>;
        arg: z.ZodNumber;
        text: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        kind: CardKind.Receive;
        arg: number;
        text: string;
    }, {
        kind: CardKind.Receive;
        arg: number;
        text: string;
    }>, z.ZodObject<{
        kind: z.ZodLiteral<CardKind.PayEachPlayer>;
        arg: z.ZodNumber;
        text: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        kind: CardKind.PayEachPlayer;
        arg: number;
        text: string;
    }, {
        kind: CardKind.PayEachPlayer;
        arg: number;
        text: string;
    }>, z.ZodObject<{
        kind: z.ZodLiteral<CardKind.GoToJail>;
        text: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        kind: CardKind.GoToJail;
        text: string;
    }, {
        kind: CardKind.GoToJail;
        text: string;
    }>, z.ZodObject<{
        kind: z.ZodLiteral<CardKind.GetOutOfJail>;
        text: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        kind: CardKind.GetOutOfJail;
        text: string;
    }, {
        kind: CardKind.GetOutOfJail;
        text: string;
    }>, z.ZodObject<{
        kind: z.ZodLiteral<CardKind.Repairs>;
        arg: z.ZodNumber;
        arg2: z.ZodNumber;
        text: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        kind: CardKind.Repairs;
        arg: number;
        text: string;
        arg2: number;
    }, {
        kind: CardKind.Repairs;
        arg: number;
        text: string;
        arg2: number;
    }>]>, "many">;
    chest: z.ZodArray<z.ZodDiscriminatedUnion<"kind", [z.ZodObject<{
        kind: z.ZodLiteral<CardKind.MoveTo>;
        arg: z.ZodNumber;
        text: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        kind: CardKind.MoveTo;
        arg: number;
        text: string;
    }, {
        kind: CardKind.MoveTo;
        arg: number;
        text: string;
    }>, z.ZodObject<{
        kind: z.ZodLiteral<CardKind.MoveToNearestRailroad>;
        text: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        kind: CardKind.MoveToNearestRailroad;
        text: string;
    }, {
        kind: CardKind.MoveToNearestRailroad;
        text: string;
    }>, z.ZodObject<{
        kind: z.ZodLiteral<CardKind.MoveToNearestUtility>;
        text: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        kind: CardKind.MoveToNearestUtility;
        text: string;
    }, {
        kind: CardKind.MoveToNearestUtility;
        text: string;
    }>, z.ZodObject<{
        kind: z.ZodLiteral<CardKind.Pay>;
        arg: z.ZodNumber;
        text: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        kind: CardKind.Pay;
        arg: number;
        text: string;
    }, {
        kind: CardKind.Pay;
        arg: number;
        text: string;
    }>, z.ZodObject<{
        kind: z.ZodLiteral<CardKind.Receive>;
        arg: z.ZodNumber;
        text: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        kind: CardKind.Receive;
        arg: number;
        text: string;
    }, {
        kind: CardKind.Receive;
        arg: number;
        text: string;
    }>, z.ZodObject<{
        kind: z.ZodLiteral<CardKind.PayEachPlayer>;
        arg: z.ZodNumber;
        text: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        kind: CardKind.PayEachPlayer;
        arg: number;
        text: string;
    }, {
        kind: CardKind.PayEachPlayer;
        arg: number;
        text: string;
    }>, z.ZodObject<{
        kind: z.ZodLiteral<CardKind.GoToJail>;
        text: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        kind: CardKind.GoToJail;
        text: string;
    }, {
        kind: CardKind.GoToJail;
        text: string;
    }>, z.ZodObject<{
        kind: z.ZodLiteral<CardKind.GetOutOfJail>;
        text: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        kind: CardKind.GetOutOfJail;
        text: string;
    }, {
        kind: CardKind.GetOutOfJail;
        text: string;
    }>, z.ZodObject<{
        kind: z.ZodLiteral<CardKind.Repairs>;
        arg: z.ZodNumber;
        arg2: z.ZodNumber;
        text: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        kind: CardKind.Repairs;
        arg: number;
        text: string;
        arg2: number;
    }, {
        kind: CardKind.Repairs;
        arg: number;
        text: string;
        arg2: number;
    }>]>, "many">;
    chanceIndex: z.ZodNumber;
    chestIndex: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    chance: ({
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
        text: string;
        arg2: number;
    })[];
    chest: ({
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
        text: string;
        arg2: number;
    })[];
    seed: string;
    chanceIndex: number;
    chestIndex: number;
}, {
    chance: ({
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
        text: string;
        arg2: number;
    })[];
    chest: ({
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
        text: string;
        arg2: number;
    })[];
    seed: string;
    chanceIndex: number;
    chestIndex: number;
}>;
export declare const zOwnership: z.ZodObject<{
    owner: z.ZodNullable<z.ZodNumber>;
    houses: z.ZodOptional<z.ZodNumber>;
    hotel: z.ZodOptional<z.ZodBoolean>;
    mortgaged: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    owner: number | null;
    houses?: number | undefined;
    hotel?: boolean | undefined;
    mortgaged?: boolean | undefined;
}, {
    owner: number | null;
    houses?: number | undefined;
    hotel?: boolean | undefined;
    mortgaged?: boolean | undefined;
}>;
export declare const zPlayer: z.ZodObject<{
    id: z.ZodNumber;
    name: z.ZodString;
    cash: z.ZodNumber;
    position: z.ZodNumber;
    inJail: z.ZodBoolean;
    jailTurns: z.ZodNumber;
    getOutOfJailCards: z.ZodNumber;
    bankrupt: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: number;
    cash: number;
    position: number;
    inJail: boolean;
    jailTurns: number;
    getOutOfJailCards: number;
    bankrupt: boolean;
}, {
    name: string;
    id: number;
    cash: number;
    position: number;
    inJail: boolean;
    jailTurns: number;
    getOutOfJailCards: number;
    bankrupt: boolean;
}>;
export declare const zAuction: z.ZodNullable<z.ZodObject<{
    active: z.ZodBoolean;
    tile: z.ZodNumber;
    currentBid: z.ZodNumber;
    highestBidder: z.ZodNullable<z.ZodNumber>;
    participants: z.ZodArray<z.ZodNumber, "many">;
    minIncrement: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    active: boolean;
    tile: number;
    currentBid: number;
    highestBidder: number | null;
    participants: number[];
    minIncrement: number;
}, {
    active: boolean;
    tile: number;
    currentBid: number;
    highestBidder: number | null;
    participants: number[];
    minIncrement: number;
}>>;
export declare const zTradeOffer: z.ZodObject<{
    from: z.ZodNumber;
    to: z.ZodNumber;
    cashFrom: z.ZodNumber;
    cashTo: z.ZodNumber;
    tilesFrom: z.ZodArray<z.ZodNumber, "many">;
    tilesTo: z.ZodArray<z.ZodNumber, "many">;
    jailCardsFrom: z.ZodNumber;
    jailCardsTo: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    from: number;
    to: number;
    cashFrom: number;
    cashTo: number;
    tilesFrom: number[];
    tilesTo: number[];
    jailCardsFrom: number;
    jailCardsTo: number;
}, {
    from: number;
    to: number;
    cashFrom: number;
    cashTo: number;
    tilesFrom: number[];
    tilesTo: number[];
    jailCardsFrom: number;
    jailCardsTo: number;
}>;
export declare const zTrade: z.ZodNullable<z.ZodObject<{
    active: z.ZodBoolean;
    offer: z.ZodNullable<z.ZodObject<{
        from: z.ZodNumber;
        to: z.ZodNumber;
        cashFrom: z.ZodNumber;
        cashTo: z.ZodNumber;
        tilesFrom: z.ZodArray<z.ZodNumber, "many">;
        tilesTo: z.ZodArray<z.ZodNumber, "many">;
        jailCardsFrom: z.ZodNumber;
        jailCardsTo: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        from: number;
        to: number;
        cashFrom: number;
        cashTo: number;
        tilesFrom: number[];
        tilesTo: number[];
        jailCardsFrom: number;
        jailCardsTo: number;
    }, {
        from: number;
        to: number;
        cashFrom: number;
        cashTo: number;
        tilesFrom: number[];
        tilesTo: number[];
        jailCardsFrom: number;
        jailCardsTo: number;
    }>>;
}, "strip", z.ZodTypeAny, {
    active: boolean;
    offer: {
        from: number;
        to: number;
        cashFrom: number;
        cashTo: number;
        tilesFrom: number[];
        tilesTo: number[];
        jailCardsFrom: number;
        jailCardsTo: number;
    } | null;
}, {
    active: boolean;
    offer: {
        from: number;
        to: number;
        cashFrom: number;
        cashTo: number;
        tilesFrom: number[];
        tilesTo: number[];
        jailCardsFrom: number;
        jailCardsTo: number;
    } | null;
}>>;
export declare const zEvent: z.ZodUnion<[z.ZodObject<{
    type: z.ZodLiteral<"GameStarted">;
    seed: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: "GameStarted";
    seed: string;
}, {
    type: "GameStarted";
    seed: string;
}>, z.ZodObject<{
    type: z.ZodLiteral<"TurnStarted">;
    player: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    type: "TurnStarted";
    player: number;
}, {
    type: "TurnStarted";
    player: number;
}>, z.ZodObject<{
    type: z.ZodLiteral<"Rolled">;
    player: z.ZodNumber;
    d1: z.ZodNumber;
    d2: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    type: "Rolled";
    d1: number;
    d2: number;
    player: number;
}, {
    type: "Rolled";
    d1: number;
    d2: number;
    player: number;
}>, z.ZodObject<{
    type: z.ZodLiteral<"Moved">;
    player: z.ZodNumber;
    from: z.ZodNumber;
    to: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    type: "Moved";
    from: number;
    to: number;
    player: number;
}, {
    type: "Moved";
    from: number;
    to: number;
    player: number;
}>, z.ZodObject<{
    type: z.ZodLiteral<"PassedGo">;
    player: z.ZodNumber;
    amount: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    type: "PassedGo";
    amount: number;
    player: number;
}, {
    type: "PassedGo";
    amount: number;
    player: number;
}>, z.ZodObject<{
    type: z.ZodLiteral<"Paid">;
    from: z.ZodNumber;
    to: z.ZodUnion<[z.ZodNumber, z.ZodLiteral<"Bank">]>;
    amount: z.ZodNumber;
    reason: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: "Paid";
    amount: number;
    from: number;
    to: number | "Bank";
    reason: string;
}, {
    type: "Paid";
    amount: number;
    from: number;
    to: number | "Bank";
    reason: string;
}>, z.ZodObject<{
    type: z.ZodLiteral<"Received">;
    to: z.ZodNumber;
    amount: z.ZodNumber;
    reason: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: "Received";
    amount: number;
    to: number;
    reason: string;
}, {
    type: "Received";
    amount: number;
    to: number;
    reason: string;
}>, z.ZodObject<{
    type: z.ZodLiteral<"BoughtProperty">;
    player: z.ZodNumber;
    tile: z.ZodNumber;
    price: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    type: "BoughtProperty";
    price: number;
    tile: number;
    player: number;
}, {
    type: "BoughtProperty";
    price: number;
    tile: number;
    player: number;
}>, z.ZodObject<{
    type: z.ZodLiteral<"StartedAuction">;
    tile: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    type: "StartedAuction";
    tile: number;
}, {
    type: "StartedAuction";
    tile: number;
}>, z.ZodObject<{
    type: z.ZodLiteral<"Bid">;
    player: z.ZodNumber;
    amount: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    type: "Bid";
    amount: number;
    player: number;
}, {
    type: "Bid";
    amount: number;
    player: number;
}>, z.ZodObject<{
    type: z.ZodLiteral<"WonAuction">;
    player: z.ZodNumber;
    tile: z.ZodNumber;
    price: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    type: "WonAuction";
    price: number;
    tile: number;
    player: number;
}, {
    type: "WonAuction";
    price: number;
    tile: number;
    player: number;
}>, z.ZodObject<{
    type: z.ZodLiteral<"WentToJail">;
    player: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    type: "WentToJail";
    player: number;
}, {
    type: "WentToJail";
    player: number;
}>, z.ZodObject<{
    type: z.ZodLiteral<"UsedJailCard">;
    player: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    type: "UsedJailCard";
    player: number;
}, {
    type: "UsedJailCard";
    player: number;
}>, z.ZodObject<{
    type: z.ZodLiteral<"TradeProposed">;
    offer: z.ZodObject<{
        from: z.ZodNumber;
        to: z.ZodNumber;
        cashFrom: z.ZodNumber;
        cashTo: z.ZodNumber;
        tilesFrom: z.ZodArray<z.ZodNumber, "many">;
        tilesTo: z.ZodArray<z.ZodNumber, "many">;
        jailCardsFrom: z.ZodNumber;
        jailCardsTo: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        from: number;
        to: number;
        cashFrom: number;
        cashTo: number;
        tilesFrom: number[];
        tilesTo: number[];
        jailCardsFrom: number;
        jailCardsTo: number;
    }, {
        from: number;
        to: number;
        cashFrom: number;
        cashTo: number;
        tilesFrom: number[];
        tilesTo: number[];
        jailCardsFrom: number;
        jailCardsTo: number;
    }>;
}, "strip", z.ZodTypeAny, {
    type: "TradeProposed";
    offer: {
        from: number;
        to: number;
        cashFrom: number;
        cashTo: number;
        tilesFrom: number[];
        tilesTo: number[];
        jailCardsFrom: number;
        jailCardsTo: number;
    };
}, {
    type: "TradeProposed";
    offer: {
        from: number;
        to: number;
        cashFrom: number;
        cashTo: number;
        tilesFrom: number[];
        tilesTo: number[];
        jailCardsFrom: number;
        jailCardsTo: number;
    };
}>, z.ZodObject<{
    type: z.ZodLiteral<"TradeAccepted">;
    offer: z.ZodObject<{
        from: z.ZodNumber;
        to: z.ZodNumber;
        cashFrom: z.ZodNumber;
        cashTo: z.ZodNumber;
        tilesFrom: z.ZodArray<z.ZodNumber, "many">;
        tilesTo: z.ZodArray<z.ZodNumber, "many">;
        jailCardsFrom: z.ZodNumber;
        jailCardsTo: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        from: number;
        to: number;
        cashFrom: number;
        cashTo: number;
        tilesFrom: number[];
        tilesTo: number[];
        jailCardsFrom: number;
        jailCardsTo: number;
    }, {
        from: number;
        to: number;
        cashFrom: number;
        cashTo: number;
        tilesFrom: number[];
        tilesTo: number[];
        jailCardsFrom: number;
        jailCardsTo: number;
    }>;
}, "strip", z.ZodTypeAny, {
    type: "TradeAccepted";
    offer: {
        from: number;
        to: number;
        cashFrom: number;
        cashTo: number;
        tilesFrom: number[];
        tilesTo: number[];
        jailCardsFrom: number;
        jailCardsTo: number;
    };
}, {
    type: "TradeAccepted";
    offer: {
        from: number;
        to: number;
        cashFrom: number;
        cashTo: number;
        tilesFrom: number[];
        tilesTo: number[];
        jailCardsFrom: number;
        jailCardsTo: number;
    };
}>, z.ZodObject<{
    type: z.ZodLiteral<"TradeRejected">;
    offer: z.ZodObject<{
        from: z.ZodNumber;
        to: z.ZodNumber;
        cashFrom: z.ZodNumber;
        cashTo: z.ZodNumber;
        tilesFrom: z.ZodArray<z.ZodNumber, "many">;
        tilesTo: z.ZodArray<z.ZodNumber, "many">;
        jailCardsFrom: z.ZodNumber;
        jailCardsTo: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        from: number;
        to: number;
        cashFrom: number;
        cashTo: number;
        tilesFrom: number[];
        tilesTo: number[];
        jailCardsFrom: number;
        jailCardsTo: number;
    }, {
        from: number;
        to: number;
        cashFrom: number;
        cashTo: number;
        tilesFrom: number[];
        tilesTo: number[];
        jailCardsFrom: number;
        jailCardsTo: number;
    }>;
}, "strip", z.ZodTypeAny, {
    type: "TradeRejected";
    offer: {
        from: number;
        to: number;
        cashFrom: number;
        cashTo: number;
        tilesFrom: number[];
        tilesTo: number[];
        jailCardsFrom: number;
        jailCardsTo: number;
    };
}, {
    type: "TradeRejected";
    offer: {
        from: number;
        to: number;
        cashFrom: number;
        cashTo: number;
        tilesFrom: number[];
        tilesTo: number[];
        jailCardsFrom: number;
        jailCardsTo: number;
    };
}>, z.ZodObject<{
    type: z.ZodLiteral<"Built">;
    player: z.ZodNumber;
    tile: z.ZodNumber;
    houses: z.ZodNumber;
    hotel: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    type: "Built";
    houses: number;
    hotel: boolean;
    tile: number;
    player: number;
}, {
    type: "Built";
    houses: number;
    hotel: boolean;
    tile: number;
    player: number;
}>, z.ZodObject<{
    type: z.ZodLiteral<"Sold">;
    player: z.ZodNumber;
    tile: z.ZodNumber;
    houses: z.ZodNumber;
    hotel: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    type: "Sold";
    houses: number;
    hotel: boolean;
    tile: number;
    player: number;
}, {
    type: "Sold";
    houses: number;
    hotel: boolean;
    tile: number;
    player: number;
}>, z.ZodObject<{
    type: z.ZodLiteral<"Bankrupt">;
    player: z.ZodNumber;
    to: z.ZodUnion<[z.ZodNumber, z.ZodLiteral<"Bank">]>;
}, "strip", z.ZodTypeAny, {
    type: "Bankrupt";
    to: number | "Bank";
    player: number;
}, {
    type: "Bankrupt";
    to: number | "Bank";
    player: number;
}>, z.ZodObject<{
    type: z.ZodLiteral<"DrewCard">;
    player: z.ZodNumber;
    deck: z.ZodUnion<[z.ZodLiteral<"chance">, z.ZodLiteral<"chest">]>;
    text: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: "DrewCard";
    text: string;
    player: number;
    deck: "chance" | "chest";
}, {
    type: "DrewCard";
    text: string;
    player: number;
    deck: "chance" | "chest";
}>]>;
export declare const zRNGState: z.ZodObject<{
    seed: z.ZodString;
    prngState: z.ZodAny;
    calls: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    seed: string;
    calls: number;
    prngState?: any;
}, {
    seed: string;
    calls: number;
    prngState?: any;
}>;
export declare const zGameConfig: z.ZodObject<{
    startingCash: z.ZodNumber;
    goAmount: z.ZodNumber;
    jailFine: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    startingCash: number;
    goAmount: number;
    jailFine: number;
}, {
    startingCash: number;
    goAmount: number;
    jailFine: number;
}>;
export declare const zGameState: z.ZodObject<{
    version: z.ZodNumber;
    config: z.ZodObject<{
        startingCash: z.ZodNumber;
        goAmount: z.ZodNumber;
        jailFine: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        startingCash: number;
        goAmount: number;
        jailFine: number;
    }, {
        startingCash: number;
        goAmount: number;
        jailFine: number;
    }>;
    phase: z.ZodNativeEnum<typeof Phase>;
    currentPlayer: z.ZodNumber;
    players: z.ZodArray<z.ZodObject<{
        id: z.ZodNumber;
        name: z.ZodString;
        cash: z.ZodNumber;
        position: z.ZodNumber;
        inJail: z.ZodBoolean;
        jailTurns: z.ZodNumber;
        getOutOfJailCards: z.ZodNumber;
        bankrupt: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        name: string;
        id: number;
        cash: number;
        position: number;
        inJail: boolean;
        jailTurns: number;
        getOutOfJailCards: number;
        bankrupt: boolean;
    }, {
        name: string;
        id: number;
        cash: number;
        position: number;
        inJail: boolean;
        jailTurns: number;
        getOutOfJailCards: number;
        bankrupt: boolean;
    }>, "many">;
    board: z.ZodArray<z.ZodDiscriminatedUnion<"kind", [z.ZodObject<{
        kind: z.ZodLiteral<TileKind.Go>;
        index: z.ZodNumber;
        name: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        kind: TileKind.Go;
        index: number;
        name: string;
    }, {
        kind: TileKind.Go;
        index: number;
        name: string;
    }>, z.ZodObject<{
        kind: z.ZodLiteral<TileKind.Property>;
        index: z.ZodNumber;
        name: z.ZodString;
        color: z.ZodEnum<["Brown", "LightBlue", "Purple", "Orange", "Red", "Yellow", "Green", "DarkBlue"]>;
        price: z.ZodNumber;
        rents: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber, z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
        houseCost: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        kind: TileKind.Property;
        index: number;
        name: string;
        color: "Brown" | "LightBlue" | "Purple" | "Orange" | "Red" | "Yellow" | "Green" | "DarkBlue";
        price: number;
        rents: [number, number, number, number, number, number];
        houseCost: number;
    }, {
        kind: TileKind.Property;
        index: number;
        name: string;
        color: "Brown" | "LightBlue" | "Purple" | "Orange" | "Red" | "Yellow" | "Green" | "DarkBlue";
        price: number;
        rents: [number, number, number, number, number, number];
        houseCost: number;
    }>, z.ZodObject<{
        kind: z.ZodLiteral<TileKind.Railroad>;
        index: z.ZodNumber;
        name: z.ZodString;
        price: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        kind: TileKind.Railroad;
        index: number;
        name: string;
        price: number;
    }, {
        kind: TileKind.Railroad;
        index: number;
        name: string;
        price: number;
    }>, z.ZodObject<{
        kind: z.ZodLiteral<TileKind.Utility>;
        index: z.ZodNumber;
        name: z.ZodString;
        price: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        kind: TileKind.Utility;
        index: number;
        name: string;
        price: number;
    }, {
        kind: TileKind.Utility;
        index: number;
        name: string;
        price: number;
    }>, z.ZodObject<{
        kind: z.ZodLiteral<TileKind.Tax>;
        index: z.ZodNumber;
        name: z.ZodString;
        amount: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        kind: TileKind.Tax;
        index: number;
        name: string;
        amount: number;
    }, {
        kind: TileKind.Tax;
        index: number;
        name: string;
        amount: number;
    }>, z.ZodObject<{
        kind: z.ZodLiteral<TileKind.Chance>;
        index: z.ZodNumber;
        name: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        kind: TileKind.Chance;
        index: number;
        name: string;
    }, {
        kind: TileKind.Chance;
        index: number;
        name: string;
    }>, z.ZodObject<{
        kind: z.ZodLiteral<TileKind.CommunityChest>;
        index: z.ZodNumber;
        name: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        kind: TileKind.CommunityChest;
        index: number;
        name: string;
    }, {
        kind: TileKind.CommunityChest;
        index: number;
        name: string;
    }>, z.ZodObject<{
        kind: z.ZodLiteral<TileKind.Jail>;
        index: z.ZodNumber;
        name: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        kind: TileKind.Jail;
        index: number;
        name: string;
    }, {
        kind: TileKind.Jail;
        index: number;
        name: string;
    }>, z.ZodObject<{
        kind: z.ZodLiteral<TileKind.FreeParking>;
        index: z.ZodNumber;
        name: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        kind: TileKind.FreeParking;
        index: number;
        name: string;
    }, {
        kind: TileKind.FreeParking;
        index: number;
        name: string;
    }>, z.ZodObject<{
        kind: z.ZodLiteral<TileKind.GoToJail>;
        index: z.ZodNumber;
        name: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        kind: TileKind.GoToJail;
        index: number;
        name: string;
    }, {
        kind: TileKind.GoToJail;
        index: number;
        name: string;
    }>]>, "many">;
    ownership: z.ZodRecord<z.ZodString, z.ZodObject<{
        owner: z.ZodNullable<z.ZodNumber>;
        houses: z.ZodOptional<z.ZodNumber>;
        hotel: z.ZodOptional<z.ZodBoolean>;
        mortgaged: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        owner: number | null;
        houses?: number | undefined;
        hotel?: boolean | undefined;
        mortgaged?: boolean | undefined;
    }, {
        owner: number | null;
        houses?: number | undefined;
        hotel?: boolean | undefined;
        mortgaged?: boolean | undefined;
    }>>;
    decks: z.ZodObject<{
        seed: z.ZodString;
        chance: z.ZodArray<z.ZodDiscriminatedUnion<"kind", [z.ZodObject<{
            kind: z.ZodLiteral<CardKind.MoveTo>;
            arg: z.ZodNumber;
            text: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            kind: CardKind.MoveTo;
            arg: number;
            text: string;
        }, {
            kind: CardKind.MoveTo;
            arg: number;
            text: string;
        }>, z.ZodObject<{
            kind: z.ZodLiteral<CardKind.MoveToNearestRailroad>;
            text: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            kind: CardKind.MoveToNearestRailroad;
            text: string;
        }, {
            kind: CardKind.MoveToNearestRailroad;
            text: string;
        }>, z.ZodObject<{
            kind: z.ZodLiteral<CardKind.MoveToNearestUtility>;
            text: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            kind: CardKind.MoveToNearestUtility;
            text: string;
        }, {
            kind: CardKind.MoveToNearestUtility;
            text: string;
        }>, z.ZodObject<{
            kind: z.ZodLiteral<CardKind.Pay>;
            arg: z.ZodNumber;
            text: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            kind: CardKind.Pay;
            arg: number;
            text: string;
        }, {
            kind: CardKind.Pay;
            arg: number;
            text: string;
        }>, z.ZodObject<{
            kind: z.ZodLiteral<CardKind.Receive>;
            arg: z.ZodNumber;
            text: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            kind: CardKind.Receive;
            arg: number;
            text: string;
        }, {
            kind: CardKind.Receive;
            arg: number;
            text: string;
        }>, z.ZodObject<{
            kind: z.ZodLiteral<CardKind.PayEachPlayer>;
            arg: z.ZodNumber;
            text: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            kind: CardKind.PayEachPlayer;
            arg: number;
            text: string;
        }, {
            kind: CardKind.PayEachPlayer;
            arg: number;
            text: string;
        }>, z.ZodObject<{
            kind: z.ZodLiteral<CardKind.GoToJail>;
            text: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            kind: CardKind.GoToJail;
            text: string;
        }, {
            kind: CardKind.GoToJail;
            text: string;
        }>, z.ZodObject<{
            kind: z.ZodLiteral<CardKind.GetOutOfJail>;
            text: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            kind: CardKind.GetOutOfJail;
            text: string;
        }, {
            kind: CardKind.GetOutOfJail;
            text: string;
        }>, z.ZodObject<{
            kind: z.ZodLiteral<CardKind.Repairs>;
            arg: z.ZodNumber;
            arg2: z.ZodNumber;
            text: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            kind: CardKind.Repairs;
            arg: number;
            text: string;
            arg2: number;
        }, {
            kind: CardKind.Repairs;
            arg: number;
            text: string;
            arg2: number;
        }>]>, "many">;
        chest: z.ZodArray<z.ZodDiscriminatedUnion<"kind", [z.ZodObject<{
            kind: z.ZodLiteral<CardKind.MoveTo>;
            arg: z.ZodNumber;
            text: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            kind: CardKind.MoveTo;
            arg: number;
            text: string;
        }, {
            kind: CardKind.MoveTo;
            arg: number;
            text: string;
        }>, z.ZodObject<{
            kind: z.ZodLiteral<CardKind.MoveToNearestRailroad>;
            text: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            kind: CardKind.MoveToNearestRailroad;
            text: string;
        }, {
            kind: CardKind.MoveToNearestRailroad;
            text: string;
        }>, z.ZodObject<{
            kind: z.ZodLiteral<CardKind.MoveToNearestUtility>;
            text: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            kind: CardKind.MoveToNearestUtility;
            text: string;
        }, {
            kind: CardKind.MoveToNearestUtility;
            text: string;
        }>, z.ZodObject<{
            kind: z.ZodLiteral<CardKind.Pay>;
            arg: z.ZodNumber;
            text: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            kind: CardKind.Pay;
            arg: number;
            text: string;
        }, {
            kind: CardKind.Pay;
            arg: number;
            text: string;
        }>, z.ZodObject<{
            kind: z.ZodLiteral<CardKind.Receive>;
            arg: z.ZodNumber;
            text: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            kind: CardKind.Receive;
            arg: number;
            text: string;
        }, {
            kind: CardKind.Receive;
            arg: number;
            text: string;
        }>, z.ZodObject<{
            kind: z.ZodLiteral<CardKind.PayEachPlayer>;
            arg: z.ZodNumber;
            text: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            kind: CardKind.PayEachPlayer;
            arg: number;
            text: string;
        }, {
            kind: CardKind.PayEachPlayer;
            arg: number;
            text: string;
        }>, z.ZodObject<{
            kind: z.ZodLiteral<CardKind.GoToJail>;
            text: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            kind: CardKind.GoToJail;
            text: string;
        }, {
            kind: CardKind.GoToJail;
            text: string;
        }>, z.ZodObject<{
            kind: z.ZodLiteral<CardKind.GetOutOfJail>;
            text: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            kind: CardKind.GetOutOfJail;
            text: string;
        }, {
            kind: CardKind.GetOutOfJail;
            text: string;
        }>, z.ZodObject<{
            kind: z.ZodLiteral<CardKind.Repairs>;
            arg: z.ZodNumber;
            arg2: z.ZodNumber;
            text: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            kind: CardKind.Repairs;
            arg: number;
            text: string;
            arg2: number;
        }, {
            kind: CardKind.Repairs;
            arg: number;
            text: string;
            arg2: number;
        }>]>, "many">;
        chanceIndex: z.ZodNumber;
        chestIndex: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        chance: ({
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
            text: string;
            arg2: number;
        })[];
        chest: ({
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
            text: string;
            arg2: number;
        })[];
        seed: string;
        chanceIndex: number;
        chestIndex: number;
    }, {
        chance: ({
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
            text: string;
            arg2: number;
        })[];
        chest: ({
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
            text: string;
            arg2: number;
        })[];
        seed: string;
        chanceIndex: number;
        chestIndex: number;
    }>;
    rng: z.ZodObject<{
        seed: z.ZodString;
        prngState: z.ZodAny;
        calls: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        seed: string;
        calls: number;
        prngState?: any;
    }, {
        seed: string;
        calls: number;
        prngState?: any;
    }>;
    lastRoll: z.ZodNullable<z.ZodObject<{
        d1: z.ZodNumber;
        d2: z.ZodNumber;
        total: z.ZodNumber;
        isDouble: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        d1: number;
        d2: number;
        total: number;
        isDouble: boolean;
    }, {
        d1: number;
        d2: number;
        total: number;
        isDouble: boolean;
    }>>;
    doublesInRow: z.ZodNumber;
    auction: z.ZodNullable<z.ZodObject<{
        active: z.ZodBoolean;
        tile: z.ZodNumber;
        currentBid: z.ZodNumber;
        highestBidder: z.ZodNullable<z.ZodNumber>;
        participants: z.ZodArray<z.ZodNumber, "many">;
        minIncrement: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        active: boolean;
        tile: number;
        currentBid: number;
        highestBidder: number | null;
        participants: number[];
        minIncrement: number;
    }, {
        active: boolean;
        tile: number;
        currentBid: number;
        highestBidder: number | null;
        participants: number[];
        minIncrement: number;
    }>>;
    trade: z.ZodNullable<z.ZodObject<{
        active: z.ZodBoolean;
        offer: z.ZodNullable<z.ZodObject<{
            from: z.ZodNumber;
            to: z.ZodNumber;
            cashFrom: z.ZodNumber;
            cashTo: z.ZodNumber;
            tilesFrom: z.ZodArray<z.ZodNumber, "many">;
            tilesTo: z.ZodArray<z.ZodNumber, "many">;
            jailCardsFrom: z.ZodNumber;
            jailCardsTo: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            from: number;
            to: number;
            cashFrom: number;
            cashTo: number;
            tilesFrom: number[];
            tilesTo: number[];
            jailCardsFrom: number;
            jailCardsTo: number;
        }, {
            from: number;
            to: number;
            cashFrom: number;
            cashTo: number;
            tilesFrom: number[];
            tilesTo: number[];
            jailCardsFrom: number;
            jailCardsTo: number;
        }>>;
    }, "strip", z.ZodTypeAny, {
        active: boolean;
        offer: {
            from: number;
            to: number;
            cashFrom: number;
            cashTo: number;
            tilesFrom: number[];
            tilesTo: number[];
            jailCardsFrom: number;
            jailCardsTo: number;
        } | null;
    }, {
        active: boolean;
        offer: {
            from: number;
            to: number;
            cashFrom: number;
            cashTo: number;
            tilesFrom: number[];
            tilesTo: number[];
            jailCardsFrom: number;
            jailCardsTo: number;
        } | null;
    }>>;
    logs: z.ZodArray<z.ZodUnion<[z.ZodObject<{
        type: z.ZodLiteral<"GameStarted">;
        seed: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: "GameStarted";
        seed: string;
    }, {
        type: "GameStarted";
        seed: string;
    }>, z.ZodObject<{
        type: z.ZodLiteral<"TurnStarted">;
        player: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        type: "TurnStarted";
        player: number;
    }, {
        type: "TurnStarted";
        player: number;
    }>, z.ZodObject<{
        type: z.ZodLiteral<"Rolled">;
        player: z.ZodNumber;
        d1: z.ZodNumber;
        d2: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        type: "Rolled";
        d1: number;
        d2: number;
        player: number;
    }, {
        type: "Rolled";
        d1: number;
        d2: number;
        player: number;
    }>, z.ZodObject<{
        type: z.ZodLiteral<"Moved">;
        player: z.ZodNumber;
        from: z.ZodNumber;
        to: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        type: "Moved";
        from: number;
        to: number;
        player: number;
    }, {
        type: "Moved";
        from: number;
        to: number;
        player: number;
    }>, z.ZodObject<{
        type: z.ZodLiteral<"PassedGo">;
        player: z.ZodNumber;
        amount: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        type: "PassedGo";
        amount: number;
        player: number;
    }, {
        type: "PassedGo";
        amount: number;
        player: number;
    }>, z.ZodObject<{
        type: z.ZodLiteral<"Paid">;
        from: z.ZodNumber;
        to: z.ZodUnion<[z.ZodNumber, z.ZodLiteral<"Bank">]>;
        amount: z.ZodNumber;
        reason: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: "Paid";
        amount: number;
        from: number;
        to: number | "Bank";
        reason: string;
    }, {
        type: "Paid";
        amount: number;
        from: number;
        to: number | "Bank";
        reason: string;
    }>, z.ZodObject<{
        type: z.ZodLiteral<"Received">;
        to: z.ZodNumber;
        amount: z.ZodNumber;
        reason: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: "Received";
        amount: number;
        to: number;
        reason: string;
    }, {
        type: "Received";
        amount: number;
        to: number;
        reason: string;
    }>, z.ZodObject<{
        type: z.ZodLiteral<"BoughtProperty">;
        player: z.ZodNumber;
        tile: z.ZodNumber;
        price: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        type: "BoughtProperty";
        price: number;
        tile: number;
        player: number;
    }, {
        type: "BoughtProperty";
        price: number;
        tile: number;
        player: number;
    }>, z.ZodObject<{
        type: z.ZodLiteral<"StartedAuction">;
        tile: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        type: "StartedAuction";
        tile: number;
    }, {
        type: "StartedAuction";
        tile: number;
    }>, z.ZodObject<{
        type: z.ZodLiteral<"Bid">;
        player: z.ZodNumber;
        amount: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        type: "Bid";
        amount: number;
        player: number;
    }, {
        type: "Bid";
        amount: number;
        player: number;
    }>, z.ZodObject<{
        type: z.ZodLiteral<"WonAuction">;
        player: z.ZodNumber;
        tile: z.ZodNumber;
        price: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        type: "WonAuction";
        price: number;
        tile: number;
        player: number;
    }, {
        type: "WonAuction";
        price: number;
        tile: number;
        player: number;
    }>, z.ZodObject<{
        type: z.ZodLiteral<"WentToJail">;
        player: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        type: "WentToJail";
        player: number;
    }, {
        type: "WentToJail";
        player: number;
    }>, z.ZodObject<{
        type: z.ZodLiteral<"UsedJailCard">;
        player: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        type: "UsedJailCard";
        player: number;
    }, {
        type: "UsedJailCard";
        player: number;
    }>, z.ZodObject<{
        type: z.ZodLiteral<"TradeProposed">;
        offer: z.ZodObject<{
            from: z.ZodNumber;
            to: z.ZodNumber;
            cashFrom: z.ZodNumber;
            cashTo: z.ZodNumber;
            tilesFrom: z.ZodArray<z.ZodNumber, "many">;
            tilesTo: z.ZodArray<z.ZodNumber, "many">;
            jailCardsFrom: z.ZodNumber;
            jailCardsTo: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            from: number;
            to: number;
            cashFrom: number;
            cashTo: number;
            tilesFrom: number[];
            tilesTo: number[];
            jailCardsFrom: number;
            jailCardsTo: number;
        }, {
            from: number;
            to: number;
            cashFrom: number;
            cashTo: number;
            tilesFrom: number[];
            tilesTo: number[];
            jailCardsFrom: number;
            jailCardsTo: number;
        }>;
    }, "strip", z.ZodTypeAny, {
        type: "TradeProposed";
        offer: {
            from: number;
            to: number;
            cashFrom: number;
            cashTo: number;
            tilesFrom: number[];
            tilesTo: number[];
            jailCardsFrom: number;
            jailCardsTo: number;
        };
    }, {
        type: "TradeProposed";
        offer: {
            from: number;
            to: number;
            cashFrom: number;
            cashTo: number;
            tilesFrom: number[];
            tilesTo: number[];
            jailCardsFrom: number;
            jailCardsTo: number;
        };
    }>, z.ZodObject<{
        type: z.ZodLiteral<"TradeAccepted">;
        offer: z.ZodObject<{
            from: z.ZodNumber;
            to: z.ZodNumber;
            cashFrom: z.ZodNumber;
            cashTo: z.ZodNumber;
            tilesFrom: z.ZodArray<z.ZodNumber, "many">;
            tilesTo: z.ZodArray<z.ZodNumber, "many">;
            jailCardsFrom: z.ZodNumber;
            jailCardsTo: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            from: number;
            to: number;
            cashFrom: number;
            cashTo: number;
            tilesFrom: number[];
            tilesTo: number[];
            jailCardsFrom: number;
            jailCardsTo: number;
        }, {
            from: number;
            to: number;
            cashFrom: number;
            cashTo: number;
            tilesFrom: number[];
            tilesTo: number[];
            jailCardsFrom: number;
            jailCardsTo: number;
        }>;
    }, "strip", z.ZodTypeAny, {
        type: "TradeAccepted";
        offer: {
            from: number;
            to: number;
            cashFrom: number;
            cashTo: number;
            tilesFrom: number[];
            tilesTo: number[];
            jailCardsFrom: number;
            jailCardsTo: number;
        };
    }, {
        type: "TradeAccepted";
        offer: {
            from: number;
            to: number;
            cashFrom: number;
            cashTo: number;
            tilesFrom: number[];
            tilesTo: number[];
            jailCardsFrom: number;
            jailCardsTo: number;
        };
    }>, z.ZodObject<{
        type: z.ZodLiteral<"TradeRejected">;
        offer: z.ZodObject<{
            from: z.ZodNumber;
            to: z.ZodNumber;
            cashFrom: z.ZodNumber;
            cashTo: z.ZodNumber;
            tilesFrom: z.ZodArray<z.ZodNumber, "many">;
            tilesTo: z.ZodArray<z.ZodNumber, "many">;
            jailCardsFrom: z.ZodNumber;
            jailCardsTo: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            from: number;
            to: number;
            cashFrom: number;
            cashTo: number;
            tilesFrom: number[];
            tilesTo: number[];
            jailCardsFrom: number;
            jailCardsTo: number;
        }, {
            from: number;
            to: number;
            cashFrom: number;
            cashTo: number;
            tilesFrom: number[];
            tilesTo: number[];
            jailCardsFrom: number;
            jailCardsTo: number;
        }>;
    }, "strip", z.ZodTypeAny, {
        type: "TradeRejected";
        offer: {
            from: number;
            to: number;
            cashFrom: number;
            cashTo: number;
            tilesFrom: number[];
            tilesTo: number[];
            jailCardsFrom: number;
            jailCardsTo: number;
        };
    }, {
        type: "TradeRejected";
        offer: {
            from: number;
            to: number;
            cashFrom: number;
            cashTo: number;
            tilesFrom: number[];
            tilesTo: number[];
            jailCardsFrom: number;
            jailCardsTo: number;
        };
    }>, z.ZodObject<{
        type: z.ZodLiteral<"Built">;
        player: z.ZodNumber;
        tile: z.ZodNumber;
        houses: z.ZodNumber;
        hotel: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        type: "Built";
        houses: number;
        hotel: boolean;
        tile: number;
        player: number;
    }, {
        type: "Built";
        houses: number;
        hotel: boolean;
        tile: number;
        player: number;
    }>, z.ZodObject<{
        type: z.ZodLiteral<"Sold">;
        player: z.ZodNumber;
        tile: z.ZodNumber;
        houses: z.ZodNumber;
        hotel: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        type: "Sold";
        houses: number;
        hotel: boolean;
        tile: number;
        player: number;
    }, {
        type: "Sold";
        houses: number;
        hotel: boolean;
        tile: number;
        player: number;
    }>, z.ZodObject<{
        type: z.ZodLiteral<"Bankrupt">;
        player: z.ZodNumber;
        to: z.ZodUnion<[z.ZodNumber, z.ZodLiteral<"Bank">]>;
    }, "strip", z.ZodTypeAny, {
        type: "Bankrupt";
        to: number | "Bank";
        player: number;
    }, {
        type: "Bankrupt";
        to: number | "Bank";
        player: number;
    }>, z.ZodObject<{
        type: z.ZodLiteral<"DrewCard">;
        player: z.ZodNumber;
        deck: z.ZodUnion<[z.ZodLiteral<"chance">, z.ZodLiteral<"chest">]>;
        text: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: "DrewCard";
        text: string;
        player: number;
        deck: "chance" | "chest";
    }, {
        type: "DrewCard";
        text: string;
        player: number;
        deck: "chance" | "chest";
    }>]>, "many">;
    winner: z.ZodNullable<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    version: number;
    config: {
        startingCash: number;
        goAmount: number;
        jailFine: number;
    };
    phase: Phase;
    currentPlayer: number;
    players: {
        name: string;
        id: number;
        cash: number;
        position: number;
        inJail: boolean;
        jailTurns: number;
        getOutOfJailCards: number;
        bankrupt: boolean;
    }[];
    board: ({
        kind: TileKind.Go;
        index: number;
        name: string;
    } | {
        kind: TileKind.Property;
        index: number;
        name: string;
        color: "Brown" | "LightBlue" | "Purple" | "Orange" | "Red" | "Yellow" | "Green" | "DarkBlue";
        price: number;
        rents: [number, number, number, number, number, number];
        houseCost: number;
    } | {
        kind: TileKind.Railroad;
        index: number;
        name: string;
        price: number;
    } | {
        kind: TileKind.Utility;
        index: number;
        name: string;
        price: number;
    } | {
        kind: TileKind.Tax;
        index: number;
        name: string;
        amount: number;
    } | {
        kind: TileKind.Chance;
        index: number;
        name: string;
    } | {
        kind: TileKind.CommunityChest;
        index: number;
        name: string;
    } | {
        kind: TileKind.Jail;
        index: number;
        name: string;
    } | {
        kind: TileKind.FreeParking;
        index: number;
        name: string;
    } | {
        kind: TileKind.GoToJail;
        index: number;
        name: string;
    })[];
    ownership: Record<string, {
        owner: number | null;
        houses?: number | undefined;
        hotel?: boolean | undefined;
        mortgaged?: boolean | undefined;
    }>;
    decks: {
        chance: ({
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
            text: string;
            arg2: number;
        })[];
        chest: ({
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
            text: string;
            arg2: number;
        })[];
        seed: string;
        chanceIndex: number;
        chestIndex: number;
    };
    rng: {
        seed: string;
        calls: number;
        prngState?: any;
    };
    lastRoll: {
        d1: number;
        d2: number;
        total: number;
        isDouble: boolean;
    } | null;
    doublesInRow: number;
    auction: {
        active: boolean;
        tile: number;
        currentBid: number;
        highestBidder: number | null;
        participants: number[];
        minIncrement: number;
    } | null;
    trade: {
        active: boolean;
        offer: {
            from: number;
            to: number;
            cashFrom: number;
            cashTo: number;
            tilesFrom: number[];
            tilesTo: number[];
            jailCardsFrom: number;
            jailCardsTo: number;
        } | null;
    } | null;
    logs: ({
        type: "GameStarted";
        seed: string;
    } | {
        type: "TurnStarted";
        player: number;
    } | {
        type: "Rolled";
        d1: number;
        d2: number;
        player: number;
    } | {
        type: "Moved";
        from: number;
        to: number;
        player: number;
    } | {
        type: "PassedGo";
        amount: number;
        player: number;
    } | {
        type: "Paid";
        amount: number;
        from: number;
        to: number | "Bank";
        reason: string;
    } | {
        type: "Received";
        amount: number;
        to: number;
        reason: string;
    } | {
        type: "BoughtProperty";
        price: number;
        tile: number;
        player: number;
    } | {
        type: "StartedAuction";
        tile: number;
    } | {
        type: "Bid";
        amount: number;
        player: number;
    } | {
        type: "WonAuction";
        price: number;
        tile: number;
        player: number;
    } | {
        type: "WentToJail";
        player: number;
    } | {
        type: "UsedJailCard";
        player: number;
    } | {
        type: "TradeProposed";
        offer: {
            from: number;
            to: number;
            cashFrom: number;
            cashTo: number;
            tilesFrom: number[];
            tilesTo: number[];
            jailCardsFrom: number;
            jailCardsTo: number;
        };
    } | {
        type: "TradeAccepted";
        offer: {
            from: number;
            to: number;
            cashFrom: number;
            cashTo: number;
            tilesFrom: number[];
            tilesTo: number[];
            jailCardsFrom: number;
            jailCardsTo: number;
        };
    } | {
        type: "TradeRejected";
        offer: {
            from: number;
            to: number;
            cashFrom: number;
            cashTo: number;
            tilesFrom: number[];
            tilesTo: number[];
            jailCardsFrom: number;
            jailCardsTo: number;
        };
    } | {
        type: "Built";
        houses: number;
        hotel: boolean;
        tile: number;
        player: number;
    } | {
        type: "Sold";
        houses: number;
        hotel: boolean;
        tile: number;
        player: number;
    } | {
        type: "Bankrupt";
        to: number | "Bank";
        player: number;
    } | {
        type: "DrewCard";
        text: string;
        player: number;
        deck: "chance" | "chest";
    })[];
    winner: number | null;
}, {
    version: number;
    config: {
        startingCash: number;
        goAmount: number;
        jailFine: number;
    };
    phase: Phase;
    currentPlayer: number;
    players: {
        name: string;
        id: number;
        cash: number;
        position: number;
        inJail: boolean;
        jailTurns: number;
        getOutOfJailCards: number;
        bankrupt: boolean;
    }[];
    board: ({
        kind: TileKind.Go;
        index: number;
        name: string;
    } | {
        kind: TileKind.Property;
        index: number;
        name: string;
        color: "Brown" | "LightBlue" | "Purple" | "Orange" | "Red" | "Yellow" | "Green" | "DarkBlue";
        price: number;
        rents: [number, number, number, number, number, number];
        houseCost: number;
    } | {
        kind: TileKind.Railroad;
        index: number;
        name: string;
        price: number;
    } | {
        kind: TileKind.Utility;
        index: number;
        name: string;
        price: number;
    } | {
        kind: TileKind.Tax;
        index: number;
        name: string;
        amount: number;
    } | {
        kind: TileKind.Chance;
        index: number;
        name: string;
    } | {
        kind: TileKind.CommunityChest;
        index: number;
        name: string;
    } | {
        kind: TileKind.Jail;
        index: number;
        name: string;
    } | {
        kind: TileKind.FreeParking;
        index: number;
        name: string;
    } | {
        kind: TileKind.GoToJail;
        index: number;
        name: string;
    })[];
    ownership: Record<string, {
        owner: number | null;
        houses?: number | undefined;
        hotel?: boolean | undefined;
        mortgaged?: boolean | undefined;
    }>;
    decks: {
        chance: ({
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
            text: string;
            arg2: number;
        })[];
        chest: ({
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
            text: string;
            arg2: number;
        })[];
        seed: string;
        chanceIndex: number;
        chestIndex: number;
    };
    rng: {
        seed: string;
        calls: number;
        prngState?: any;
    };
    lastRoll: {
        d1: number;
        d2: number;
        total: number;
        isDouble: boolean;
    } | null;
    doublesInRow: number;
    auction: {
        active: boolean;
        tile: number;
        currentBid: number;
        highestBidder: number | null;
        participants: number[];
        minIncrement: number;
    } | null;
    trade: {
        active: boolean;
        offer: {
            from: number;
            to: number;
            cashFrom: number;
            cashTo: number;
            tilesFrom: number[];
            tilesTo: number[];
            jailCardsFrom: number;
            jailCardsTo: number;
        } | null;
    } | null;
    logs: ({
        type: "GameStarted";
        seed: string;
    } | {
        type: "TurnStarted";
        player: number;
    } | {
        type: "Rolled";
        d1: number;
        d2: number;
        player: number;
    } | {
        type: "Moved";
        from: number;
        to: number;
        player: number;
    } | {
        type: "PassedGo";
        amount: number;
        player: number;
    } | {
        type: "Paid";
        amount: number;
        from: number;
        to: number | "Bank";
        reason: string;
    } | {
        type: "Received";
        amount: number;
        to: number;
        reason: string;
    } | {
        type: "BoughtProperty";
        price: number;
        tile: number;
        player: number;
    } | {
        type: "StartedAuction";
        tile: number;
    } | {
        type: "Bid";
        amount: number;
        player: number;
    } | {
        type: "WonAuction";
        price: number;
        tile: number;
        player: number;
    } | {
        type: "WentToJail";
        player: number;
    } | {
        type: "UsedJailCard";
        player: number;
    } | {
        type: "TradeProposed";
        offer: {
            from: number;
            to: number;
            cashFrom: number;
            cashTo: number;
            tilesFrom: number[];
            tilesTo: number[];
            jailCardsFrom: number;
            jailCardsTo: number;
        };
    } | {
        type: "TradeAccepted";
        offer: {
            from: number;
            to: number;
            cashFrom: number;
            cashTo: number;
            tilesFrom: number[];
            tilesTo: number[];
            jailCardsFrom: number;
            jailCardsTo: number;
        };
    } | {
        type: "TradeRejected";
        offer: {
            from: number;
            to: number;
            cashFrom: number;
            cashTo: number;
            tilesFrom: number[];
            tilesTo: number[];
            jailCardsFrom: number;
            jailCardsTo: number;
        };
    } | {
        type: "Built";
        houses: number;
        hotel: boolean;
        tile: number;
        player: number;
    } | {
        type: "Sold";
        houses: number;
        hotel: boolean;
        tile: number;
        player: number;
    } | {
        type: "Bankrupt";
        to: number | "Bank";
        player: number;
    } | {
        type: "DrewCard";
        text: string;
        player: number;
        deck: "chance" | "chest";
    })[];
    winner: number | null;
}>;
export declare const zAction: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
    type: z.ZodLiteral<"StartGame">;
    seed: z.ZodString;
    players: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
    }, {
        name: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    type: "StartGame";
    seed: string;
    players: {
        name: string;
    }[];
}, {
    type: "StartGame";
    seed: string;
    players: {
        name: string;
    }[];
}>, z.ZodObject<{
    type: z.ZodLiteral<"EndTurn">;
}, "strip", z.ZodTypeAny, {
    type: "EndTurn";
}, {
    type: "EndTurn";
}>, z.ZodObject<{
    type: z.ZodLiteral<"Roll">;
}, "strip", z.ZodTypeAny, {
    type: "Roll";
}, {
    type: "Roll";
}>, z.ZodObject<{
    type: z.ZodLiteral<"Buy">;
}, "strip", z.ZodTypeAny, {
    type: "Buy";
}, {
    type: "Buy";
}>, z.ZodObject<{
    type: z.ZodLiteral<"DeclineBuy">;
}, "strip", z.ZodTypeAny, {
    type: "DeclineBuy";
}, {
    type: "DeclineBuy";
}>, z.ZodObject<{
    type: z.ZodLiteral<"StartAuction">;
}, "strip", z.ZodTypeAny, {
    type: "StartAuction";
}, {
    type: "StartAuction";
}>, z.ZodObject<{
    type: z.ZodLiteral<"Bid">;
    amount: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    type: "Bid";
    amount: number;
}, {
    type: "Bid";
    amount: number;
}>, z.ZodObject<{
    type: z.ZodLiteral<"PassBid">;
}, "strip", z.ZodTypeAny, {
    type: "PassBid";
}, {
    type: "PassBid";
}>, z.ZodObject<{
    type: z.ZodLiteral<"PayJail">;
}, "strip", z.ZodTypeAny, {
    type: "PayJail";
}, {
    type: "PayJail";
}>, z.ZodObject<{
    type: z.ZodLiteral<"UseJailCard">;
}, "strip", z.ZodTypeAny, {
    type: "UseJailCard";
}, {
    type: "UseJailCard";
}>, z.ZodObject<{
    type: z.ZodLiteral<"TryDoubles">;
}, "strip", z.ZodTypeAny, {
    type: "TryDoubles";
}, {
    type: "TryDoubles";
}>, z.ZodObject<{
    type: z.ZodLiteral<"ProposeTrade">;
    offer: z.ZodObject<{
        from: z.ZodNumber;
        to: z.ZodNumber;
        cashFrom: z.ZodNumber;
        cashTo: z.ZodNumber;
        tilesFrom: z.ZodArray<z.ZodNumber, "many">;
        tilesTo: z.ZodArray<z.ZodNumber, "many">;
        jailCardsFrom: z.ZodNumber;
        jailCardsTo: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        from: number;
        to: number;
        cashFrom: number;
        cashTo: number;
        tilesFrom: number[];
        tilesTo: number[];
        jailCardsFrom: number;
        jailCardsTo: number;
    }, {
        from: number;
        to: number;
        cashFrom: number;
        cashTo: number;
        tilesFrom: number[];
        tilesTo: number[];
        jailCardsFrom: number;
        jailCardsTo: number;
    }>;
}, "strip", z.ZodTypeAny, {
    type: "ProposeTrade";
    offer: {
        from: number;
        to: number;
        cashFrom: number;
        cashTo: number;
        tilesFrom: number[];
        tilesTo: number[];
        jailCardsFrom: number;
        jailCardsTo: number;
    };
}, {
    type: "ProposeTrade";
    offer: {
        from: number;
        to: number;
        cashFrom: number;
        cashTo: number;
        tilesFrom: number[];
        tilesTo: number[];
        jailCardsFrom: number;
        jailCardsTo: number;
    };
}>, z.ZodObject<{
    type: z.ZodLiteral<"AcceptTrade">;
}, "strip", z.ZodTypeAny, {
    type: "AcceptTrade";
}, {
    type: "AcceptTrade";
}>, z.ZodObject<{
    type: z.ZodLiteral<"RejectTrade">;
}, "strip", z.ZodTypeAny, {
    type: "RejectTrade";
}, {
    type: "RejectTrade";
}>, z.ZodObject<{
    type: z.ZodLiteral<"Build">;
    tile: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    type: "Build";
    tile: number;
}, {
    type: "Build";
    tile: number;
}>, z.ZodObject<{
    type: z.ZodLiteral<"Sell">;
    tile: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    type: "Sell";
    tile: number;
}, {
    type: "Sell";
    tile: number;
}>, z.ZodObject<{
    type: z.ZodLiteral<"Mortgage">;
    tile: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    type: "Mortgage";
    tile: number;
}, {
    type: "Mortgage";
    tile: number;
}>, z.ZodObject<{
    type: z.ZodLiteral<"Unmortgage">;
    tile: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    type: "Unmortgage";
    tile: number;
}, {
    type: "Unmortgage";
    tile: number;
}>]>;
//# sourceMappingURL=schema.d.ts.map