# Monopoly Clone (M1/M2/M3/M4)

Monorepo for a web-based, deterministic Monopoly-style game. Milestone 1 delivers the complete rules engine, shared schemas, seedable RNG, auctions, trading, jail/bankruptcy, serialization, tests, and a minimal React client to step through turns. Milestone 2 adds a playable 3D board experience with physical-feeling dice and weighty animations, while preserving the M1 rules reducer as the single source of truth. **Milestone 4 elevates the UX with complete card and trading flows, interactive tutorials, mobile-friendly controls, and a structured WebSocket event stream for telemetry and future multiplayer support.**

## Stack
- TypeScript (strict)
- pnpm workspaces
- Packages: `@monopoly/shared`, `@monopoly/rules`, `@monopoly/ai`
- Client: React + Vite (apps/client)
- Server: Node.js + WebSocket (apps/server) 
- 3D: `@react-three/fiber`, `@react-three/drei`, `@react-three/cannon` (`cannon-es`), `@react-spring/three`, `three`
- Testing: vitest + Playwright (E2E)
- Validation: zod
- Deployment: Vercel with preview builds

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

Server dev (for WebSocket telemetry):
```
cd apps/server
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

## M4 Features (🚀 Latest)

### Enhanced UI/UX
- **🃏 Card System**: Animated card draws with flip animations, visual effects for all Chance/Community Chest cards
- **🏛️ Auction Interface**: Real-time auction modal with bid ladder, participant status, AI rationale display, and countdown timers
- **🤝 Trading System**: Comprehensive trade interface with dual-pane asset picker, cash/property/jail card trading, and trade value analysis
- **📖 Tutorial System**: Interactive tutorial overlay guiding new players through game mechanics with contextual highlights
- **📋 Help Panel**: Complete rules reference with icon legend and control instructions

### Mobile Optimization
- **📱 Responsive Design**: Mobile-first CSS with touch-friendly controls and optimized layouts
- **👆 Touch Gestures**: Enhanced OrbitControls for smooth camera manipulation on mobile devices  
- **⚡ Performance**: Mobile-specific performance presets automatically applied (reduced shadows, simplified animations)
- **🎯 Touch Targets**: Minimum 44px touch targets following iOS guidelines
- **📐 Adaptive Layout**: UI components automatically adjust for portrait/landscape orientations

### WebSocket Telemetry
- **📡 Event Stream**: Real-time game event publishing with zod validation
- **🔄 Reconnection**: Automatic reconnection with exponential backoff
- **📊 Analytics**: Comprehensive event tracking (game lifecycle, trades, auctions, bankruptcies)
- **🗂️ Event Batching**: Efficient event transmission with batch processing
- **📝 Logging**: JSONL event logs for analysis and debugging

### Deployment
- **🚀 Vercel Integration**: Automated preview deployments for pull requests
- **⚙️ CI/CD Pipeline**: GitHub Actions workflow with quality checks and E2E testing
- **🌐 Environment Config**: Production-ready environment variable management
- **🔍 Health Monitoring**: Server health endpoints and connection monitoring

## Telemetry Protocol

The WebSocket event stream captures detailed game telemetry for analytics and future multiplayer features:

### Event Types
- `game_started` - Game initialization with players and settings
- `turn_started` - Player turn beginning with position and cash
- `dice_rolled` - Dice roll results with doubles detection  
- `moved` - Player movement with GO passing detection
- `landed` - Landing on tiles with ownership info
- `rent_paid` - Rent transactions with property details
- `bought_property` - Property purchases with pricing
- `auction_started` - Auction initiation with participants
- `bid_placed` - Auction bids with AI rationale
- `auction_won` - Auction completion with final pricing
- `trade_proposed` - Trade offers with complete asset details
- `trade_resolved` - Trade outcomes with acceptance/rejection
- `jailed` - Jail events with reasons and context
- `released_from_jail` - Jail release methods and duration
- `bankrupt` - Bankruptcy events with debt and asset transfer
- `game_ended` - Game completion with winner and statistics

### Event Structure
```typescript
interface TelemetryEvent {
  gameId: string
  playerId: string  
  timestamp: string
  sessionId: string
  type: string
  data: object // Event-specific payload
}
```

Events are batched for efficient transmission and validated server-side with zod schemas.

## Mobile Optimizations

### Automatic Performance Tuning
The game automatically detects mobile devices and applies optimized settings:
- Disables shadows and physics dice on mobile for better performance
- Reduces animation complexity and duration
- Limits device pixel ratio to prevent excessive GPU load
- Uses touch-optimized camera controls

### Responsive Layout
- **HUD**: Collapses to horizontal strip on mobile with essential info
- **Event Log**: Moves to bottom overlay with swipe gestures
- **Controls**: Stack vertically on mobile with larger touch targets
- **Modals**: Full-screen on mobile with improved scrolling
- **Typography**: Scales appropriately for readability on small screens

### Touch Interactions
- **Camera Control**: Enhanced OrbitControls with momentum and inertia
- **UI Elements**: 44px minimum touch targets with visual feedback
- **Gestures**: Pinch-to-zoom and pan gestures for camera manipulation
- **Performance**: Passive event listeners for smooth scrolling

## Deployment Guide

### Vercel Setup
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard:
   ```
   VERCEL_ORG_ID=your-org-id
   VERCEL_PROJECT_ID=your-project-id
   ```
3. Enable automatic deployments for the main branch
4. Preview deployments are automatically created for pull requests

### Environment Variables
Copy `.env.example` to `.env.local` and configure:
- `WS_URL` - WebSocket server URL for telemetry
- `PORT` - Server port (default: 3001)
- `LOG_DIR` - Directory for event logs (default: ./logs)

### Manual Deployment
```bash
# Install Vercel CLI
pnpm add -g vercel

# Deploy
vercel --prod
```

## Roadmap
- M5: Real-time multiplayer with room management and spectator mode

## License
MIT

