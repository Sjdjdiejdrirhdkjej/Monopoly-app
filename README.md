# Monopoly Clone (M1/M2/M3)

Monorepo for a web-based, deterministic Monopoly-style game. Milestone 1 delivers the complete rules engine, shared schemas, seedable RNG, auctions, trading, jail/bankruptcy, serialization, tests, and a minimal React client to step through turns. Milestone 2 adds a playable 3D board experience with physical-feeling dice and weighty animations, while preserving the M1 rules reducer as the single source of truth.

## Stack
- TypeScript (strict)
- pnpm workspaces
- Packages: `@monopoly/shared`, `@monopoly/rules`, `@monopoly/ai`
- Client: React + Vite (apps/client)
- 3D: `@react-three/fiber`, `@react-three/drei`, `@react-three/cannon` (`cannon-es`), `@react-spring/three`, `three`
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
pnpm sim seed123 P1,P2,P3 Balanced
```
Outputs telemetry (#turns, #auctions, bids, trades proposed/accepted, bankruptcies) in JSON.

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
- packages/ai: modular agents: auction, trade, jail, build, liquidity manager, heuristic evaluation, and `playout` with telemetry
- apps/client: 3D scene and UI integrating with the rules reducer (no game logic in components); AI difficulty presets selectable at start

### M2 3D architecture
- Scene: `scene/ThreeStage.tsx` provides `<Canvas>`, tone mapping, sky/lighting, and orbit camera with sensible limits. `useFocusCamera` helper snaps camera focus to points of interest (e.g. active token).
- Board: `scene/Board.tsx` renders a beveled board (RoundedBox), tile grid, and interactive tile hit-areas. Labels are generated with `scene/TileLabel.tsx` using CanvasTexture so names/prices stay readable.
- Tokens: `scene/Tokens.tsx` renders simple metal tokens, animating paths tile-by-tile with eased, weighty motion and subtle idle wobble.
- Buildings: `scene/HousesHotels.tsx` observes `ownership` and places houses/hotels on tiles, following even-building updates produced by the rules.
- Dice: `scene/Dice.tsx` provides two d6 with physics via `@react-three/cannon`. Rolls reconcile to the reducer’s target dice values; after a small number of retries the visual snaps to the target for consistency.

### Performance tips
- Instancing is used where it matters (buildings), and materials/geometry are memoized. Avoid per-frame allocations; keep components pure and stable.
- Use the Quality panel (bottom-right) to toggle shadows and physics dice for low-power devices.
- Camera and controls are constrained to prevent extreme zoom/angles that hurt performance.

### Fast mode (CI and low-end devices)
- Physics dice can be disabled in the Quality panel. In fast mode, dice rolls are deterministic and snap immediately to the reducer’s `lastRoll` without running physics. This keeps CI and headless testing reliable.

## Determinism
All randomness is injected via a seedable RNG. Dice and deck shuffles use the same seed to ensure replayability. The AI uses an independent seeded RNG derived from the game seed to ensure identical decisions for the same seed and parameters. Serialization preserves RNG state so games can be saved, loaded, and continued with identical outcomes.

## Deviations / Deferrals
- Mortgages are stubbed in M1 and will throw a NotImplemented error.
- SSAO/FXAA are omitted in M2 for simplicity. Hooks exist in the scene to add them behind the Quality panel.
- Bank pool limits for houses/hotels ignored in M1/M2.

## M3 AI design
- Heuristic evaluation: score = cash + asset value + monopoly potential − expected rent risk − liquidity penalty. Heatmap approximates landing probabilities over next N turns via dice convolution.
- Auction agent: bids up to k×EV subject to liquidity buffer and bankruptcy guards; competitive increments; denial value against opponent near-monopolies.
- Trade agent: proposes Pareto-improving 1-for-1 or +cash deals to complete monopolies; simple counter cap and deterministic tie-breaking; validates even-building feasibility post-trade.
- Jail strategy: weighs risk ahead vs cash; may stay in jail when board is dangerous.
- Build strategy: even-building across monopolies using ROI per house while maintaining a cash buffer.
- Playout telemetry: turns, auctions, bids, trades proposed/accepted, bankruptcies.

### Presets
- Conservative: cautious bidding, larger liquidity buffer, low exploration
- Balanced: default
- Aggressive: higher risk tolerance, builds earlier, bids more

### Debugging tips
- Enable client Auto with a preset to observe different behaviors.
- Use scripts/simulate.ts to reproduce scenarios by seed. Compare JSON outputs between presets.
- Add console logs to packages/ai/src/* agents to inspect decisions; they are pure functions.

## Roadmap
- M4: UX polish, tutorials, telemetry stream for multiplayer

## License
MIT

