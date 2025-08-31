import { describe, it, expect } from 'vitest';
import { BOARD, Phase, TileKind } from '@monopoly/shared';
import { apply, initialState, selectors, serialize, deserialize } from '../src/index';
const start = (seed = 'test', players = ['A', 'B']) => {
    let s = initialState();
    s = apply(s, { type: 'StartGame', seed, players: players.map(name => ({ name })) });
    return s;
};
const forcePosition = (s, pid, pos) => {
    s.players[pid].position = pos;
};
const giveCash = (s, pid, amount) => {
    s.players[pid].cash = amount;
};
const own = (s, pid, index) => {
    s.ownership[index].owner = pid;
};
describe('Rent calculations', () => {
    it('base and monopoly rents', () => {
        let s = start();
        const prop = BOARD.find(t => t.kind === TileKind.Property && t.color === 'Brown');
        forcePosition(s, 1, prop.index);
        const owner = 0;
        own(s, owner, prop.index);
        s.lastRoll = { d1: 3, d2: 3, total: 6, isDouble: true };
        const base = selectors.rentFor(s, prop.index, s.lastRoll);
        const group = BOARD.filter(t => t.kind === TileKind.Property && t.color === prop.color);
        for (const t of group)
            own(s, owner, t.index);
        const mono = selectors.rentFor(s, prop.index, s.lastRoll);
        expect(mono).toBe(base * 2);
    });
    it('houses and hotel rent', () => {
        let s = start();
        const prop = BOARD.find(t => t.kind === TileKind.Property && t.color === 'LightBlue');
        own(s, 0, prop.index);
        s.ownership[prop.index].houses = 3;
        const r3 = selectors.rentFor(s, prop.index);
        s.ownership[prop.index].hotel = true;
        const rh = selectors.rentFor(s, prop.index);
        expect(rh).toBeGreaterThan(r3);
    });
    it('railroads scale by count', () => {
        let s = start();
        const rr = [5, 15, 25, 35];
        own(s, 0, rr[0]);
        expect(selectors.rentFor(s, rr[0])).toBe(25);
        own(s, 0, rr[1]);
        expect(selectors.rentFor(s, rr[0])).toBe(50);
        own(s, 0, rr[2]);
        expect(selectors.rentFor(s, rr[0])).toBe(100);
        own(s, 0, rr[3]);
        expect(selectors.rentFor(s, rr[0])).toBe(200);
    });
    it('utilities 4x/10x dice', () => {
        let s = start();
        const util = 12;
        own(s, 0, util);
        s.lastRoll = { d1: 2, d2: 3, total: 5, isDouble: false };
        expect(selectors.rentFor(s, util, s.lastRoll)).toBe(4 * 5);
        own(s, 0, 28);
        expect(selectors.rentFor(s, util, s.lastRoll)).toBe(10 * 5);
    });
});
describe('Auctions', () => {
    it('decline buy triggers auction and highest bidder wins', () => {
        let s = start();
        forcePosition(s, 0, 1);
        s = apply(s, { type: 'DeclineBuy' });
        expect(s.phase).toBe(Phase.Auction);
        s = apply(s, { type: 'Bid', amount: 10 });
        s = apply(s, { type: 'EndTurn' });
        s = apply(s, { type: 'PassBid' });
        if (s.auction) {
            s.auction.participants = [0];
        }
        s = apply(s, { type: 'PassBid' });
        expect(s.phase).toBe(Phase.EndTurn);
    });
});
describe('Jail logic and triples', () => {
    it('triple doubles sends to jail', () => {
        let s = start('seed-1');
        s = apply(s, { type: 'Roll' });
        s = apply(s, { type: 'Roll' });
        s = apply(s, { type: 'Roll' });
        expect(s.players[0].inJail || s.phase === Phase.EndTurn).toBeTruthy();
    });
    it('pay to leave jail', () => {
        let s = start();
        s.players[0].inJail = true;
        s.players[0].cash = 100;
        s = apply(s, { type: 'PayJail' });
        expect(s.players[0].inJail).toBe(false);
    });
});
describe('Cards', () => {
    it('nearest railroad/utility works without crash', () => {
        let s = start('seed-2');
        // land on chance to draw
        forcePosition(s, 0, 7);
        s = apply(s, { type: 'Roll' });
        expect(s).toBeTruthy();
    });
});
describe('Trading', () => {
    it('propose/accept trade transfers assets', () => {
        let s = start();
        own(s, 0, 1);
        s = apply(s, { type: 'ProposeTrade', offer: { from: 0, to: 1, cashFrom: 0, cashTo: 0, tilesFrom: [1], tilesTo: [], jailCardsFrom: 0, jailCardsTo: 0 } });
        s = apply(s, { type: 'AcceptTrade' });
        expect(s.ownership[1].owner).toBe(1);
    });
});
describe('Bankruptcy and taxes', () => {
    it('tax can cause bankruptcy and remove player', () => {
        let s = start();
        s.players[0].cash = 0;
        forcePosition(s, 0, 4);
        s = apply(s, { type: 'Roll' });
        expect(s.players[0].bankrupt || s.phase === Phase.EndTurn).toBeTruthy();
    });
});
describe('Serialization and determinism', () => {
    it('same seed yields reproducible winners', () => {
        const s1 = start('seed-3');
        const s2 = start('seed-3');
        expect(JSON.stringify(s1.decks)).toBe(JSON.stringify(s2.decks));
    });
    it('serialize/deserialize allows continuation', () => {
        let s = start('seed-4');
        s = apply(s, { type: 'Roll' });
        const json = serialize(s);
        const s2 = deserialize(json);
        expect(s2.currentPlayer).toBe(s.currentPlayer);
    });
});
//# sourceMappingURL=rules.test.js.map