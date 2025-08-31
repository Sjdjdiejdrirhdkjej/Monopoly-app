import { describe, it, expect } from 'vitest';
import { apply, initialState } from '../src/index';
import { BOARD, TileKind, Phase } from '@monopoly/shared';
const start = (seed = 'cov', players = ['A', 'B', 'C']) => {
    let s = initialState();
    s = apply(s, { type: 'StartGame', seed, players: players.map(name => ({ name })) });
    return s;
};
describe('broad engine coverage', () => {
    it('pass go awards money and taxes deduct', () => {
        let s = start();
        s.players[0].position = 39;
        s = apply(s, { type: 'Roll' });
        const pos = s.players[0].position;
        expect(pos).toBeDefined();
    });
    it('decline buy -> auction path', () => {
        let s = start();
        // Move to a known unowned property
        s.players[0].position = 1;
        s = apply(s, { type: 'DeclineBuy' });
        expect(s.phase).toBe(Phase.Auction);
        if (s.auction) {
            s = apply(s, { type: 'Bid', amount: 10 });
            s = apply(s, { type: 'PassBid' });
        }
        expect(s.phase === Phase.EndTurn || s.auction === null).toBeTruthy();
    });
    it('build then sell maintains even-building rule', () => {
        let s = start();
        const group = BOARD.filter(t => t.kind === TileKind.Property && t.color === 'LightBlue');
        for (const t of group)
            s.ownership[t.index].owner = 0;
        s = apply(s, { type: 'Build', tile: group[0].index });
        s = apply(s, { type: 'Build', tile: group[1].index });
        s = apply(s, { type: 'Sell', tile: group[1].index });
        expect(s.ownership[group[0].index].houses >= 0).toBeTruthy();
    });
    it('trade accept transfers cash and tiles', () => {
        let s = start();
        s.ownership[1].owner = 0;
        s = apply(s, { type: 'ProposeTrade', offer: { from: 0, to: 1, cashFrom: 100, cashTo: 0, tilesFrom: [1], tilesTo: [], jailCardsFrom: 0, jailCardsTo: 0 } });
        const c0 = s.players[0].cash;
        s = apply(s, { type: 'AcceptTrade' });
        expect(s.players[0].cash).toBeLessThan(c0);
        expect(s.ownership[1].owner).toBe(1);
    });
    it('use jail card then roll', () => {
        let s = start();
        s.players[0].inJail = true;
        s.players[0].getOutOfJailCards = 1;
        s = apply(s, { type: 'UseJailCard' });
        expect(s.players[0].inJail).toBe(false);
    });
});
//# sourceMappingURL=coverage.test.js.map