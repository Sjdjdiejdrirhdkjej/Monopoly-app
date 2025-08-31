import { GameState } from '@monopoly/shared';
export declare const newGame: (seed: string, names: string[]) => GameState;
export declare const playout: (seed: string, names: string[], maxTurns?: number) => {
    winner: number | null;
    turns: number;
    state: GameState;
};
//# sourceMappingURL=playout.d.ts.map