# Monopoly Clone (M1/M2)

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
- apps/client: 3D scene and UI integrating with the rules reducer (no game logic in components)

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
All randomness is injected via a seedable RNG. Dice and deck shuffles use the same seed to ensure replayability. Serialization preserves RNG state so games can be saved, loaded, and continued with identical outcomes.

## Deviations / Deferrals
- Mortgages are stubbed in M1 and will throw a NotImplemented error.
- SSAO/FXAA are omitted in M2 for simplicity. Hooks exist in the scene to add them behind the Quality panel.
- Bank pool limits for houses/hotels ignored in M1/M2.

## Roadmap
- M3: Advanced AI, richer trading/auction strategies, deeper UI
- M4: UX polish, tutorials, telemetry stream for multiplayer

## License
MIT

