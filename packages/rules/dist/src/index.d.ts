import { Action, DiceRoll, GameState, RNGState } from '@monopoly/shared';
export type RNG = {
    seed: string;
    state: () => RNGState;
    int: (min: number, max: number) => number;
    shuffle: <T>(arr: T[]) => T[];
    dice: () => DiceRoll;
};
export declare const initialState: () => GameState;
export declare const generateLegalActions: (s: GameState) => Action[];
export declare const apply: (state: GameState, action: Action) => GameState;
export declare const serialize: (s: GameState) => string;
export declare const deserialize: (json: string) => GameState;
export declare const selectors: {
    rentFor: (s: GameState, i: number, dice?: DiceRoll, cardUtilityMultiplier?: number) => number;
    ownsAllInGroup: (s: GameState, pid: number, color: any) => boolean;
};
//# sourceMappingURL=index.d.ts.map