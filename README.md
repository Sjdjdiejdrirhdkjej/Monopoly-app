# Monopoly Clone (M1)

Monorepo for a web-based, deterministic Monopoly-style game. Milestone 1 delivers the complete rules engine, shared schemas, seedable RNG, auctions, trading, jail/bankruptcy, serialization, tests, and a minimal React client to step through turns.

## Stack
- TypeScript (strict)
- pnpm workspaces
- Packages: `@monopoly/shared`, `@monopoly/rules`, `@monopoly/ai`
- Client: React + Vite (apps/client)
- Testing: vitest
- Validation: zod

## Quick start
```
pnpm install
pnpm -r build
pnpm test
```

Run a deterministic AI-vs-AI simulation:
```
pnpm sim seed123 P1,P2,P3
```

Client dev server:
```
cd apps/client
pnpm dev
```

## Scripts
- build: build all packages and apps
- test: run unit tests with coverage
- sim: run scripts/simulate.ts (AI playout)

## Architecture
- packages/shared: types, zod schemas, board and card constants
- packages/rules: pure, event-sourced reducer: `apply(state, action) => state`, `serialize/deserialize`, utilities and selectors
- packages/ai: minimal policy and `playout` to complete games deterministically
- apps/client: minimal HUD to start a seeded game, step/auto-advance turns, view state/logs, save/load via localStorage

## Determinism
All randomness is injected via a seedable RNG. Dice and deck shuffles use the same seed to ensure replayability. Serialization preserves RNG state so games can be saved, loaded, and continued with identical outcomes.

## Deviations / Deferrals
- Mortgages are stubbed in M1 and will throw a NotImplemented error.
- No 3D visuals in M1. M2 will introduce 3D board and physics dice.
- Bank pool limits for houses/hotels ignored in M1.

## Roadmap
- M2: 3D scene (react-three-fiber), physics dice, token/housing visuals
- M3: Advanced AI, richer trading/auction strategies
- M4: UX polish, tutorials, telemetry stream for multiplayer

## License
MIT

