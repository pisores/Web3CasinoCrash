# Telegram Mini App Casino

## Overview
A Telegram Mini App casino game featuring seven games (Crash, Mines, Dice, Slots, Plinko, Rock Paper Scissors, Turtle Race) with Telegram SDK integration for native mobile experience and PostgreSQL database for persistent balance storage.

## Tech Stack
- **Frontend**: React + TypeScript + Vite
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL (Neon) with Drizzle ORM
- **Styling**: Tailwind CSS + shadcn/ui
- **Telegram**: @telegram-apps/sdk-react for Mini App integration
- **State**: TanStack Query for server state management

## Project Structure
```
├── client/
│   ├── src/
│   │   ├── assets/games/     # Game images (crash.png, mines.png, etc.)
│   │   ├── components/       # Reusable UI components
│   │   │   ├── ui/           # shadcn components
│   │   │   ├── TelegramProvider.tsx  # Telegram SDK context
│   │   │   ├── AudioProvider.tsx     # Audio system context
│   │   │   ├── AudioControls.tsx     # Music/sound toggle UI
│   │   │   ├── BalanceDisplay.tsx
│   │   │   ├── BettingPanel.tsx
│   │   │   ├── GameCard.tsx
│   │   │   └── GameHeader.tsx
│   │   ├── pages/            # Game screens
│   │   │   ├── GameLobby.tsx
│   │   │   ├── CrashGame.tsx
│   │   │   ├── MinesGame.tsx
│   │   │   ├── DiceGame.tsx
│   │   │   ├── SlotsGame.tsx
│   │   │   ├── PlinkoGame.tsx
│   │   │   ├── ScissorsGame.tsx
│   │   │   └── TurtleRaceGame.tsx
│   │   ├── App.tsx           # Main app component
│   │   └── index.css         # Tailwind + custom styles
│   └── index.html            # Entry point with Telegram script
├── server/
│   ├── routes.ts             # API endpoints for all games
│   ├── storage.ts            # Database storage implementation
│   └── db.ts                 # Drizzle database connection
├── shared/
│   └── schema.ts             # Data models, game types & Drizzle schemas
└── design_guidelines.md      # Design system documentation
```

## Games Available (7 Total)
1. **Crash** - Multiplier game, cash out before crash (max 1000x)
2. **Mines** - Find gems, avoid bombs on a 5x5 grid
3. **Dice** - Roll over/under a target number (1-100)
4. **Slots** - Classic slot machine with symbol matching
5. **Plinko** - Ball drop through pegs with multipliers
6. **Rock Paper Scissors** - Classic game vs computer (2x payout)
7. **Turtle Race** - Bet on winning turtle (3x payout)

## Database Schema
- **users**: id, telegramId, username, firstName, lastName, balance, referralCode, referredBy, referralCount, walletAddress, isAdmin, lastSeenAt
- **bets**: id, userId, gameType, amount, multiplier, payout, isWin, gameData, createdAt
- **withdrawals**: id, userId, amount, walletAddress, status, createdAt, processedAt, processedBy
- **promo_codes**: id, code, bonusAmount, maxUses, currentUses, isActive, createdAt, createdBy
- **admin_settings**: id, winRatePercent, updatedAt, updatedBy

## API Endpoints

### User Endpoints
- `POST /api/users/telegram` - Create/fetch user by Telegram ID
- `PATCH /api/users/:id/balance` - Update user balance
- `POST /api/users/:id/heartbeat` - Track user activity
- `POST /api/users/:id/referral-code` - Generate referral code
- `POST /api/users/:id/apply-referral` - Apply referral code (get $100 bonus)
- `GET /api/users/:id/referral-stats` - Get referral statistics

### Game Endpoints
- `POST /api/games/crash/bet` - Place Crash game bet
- `POST /api/games/crash/cashout` - Cash out from Crash
- `POST /api/games/mines/start` - Start Mines game
- `POST /api/games/mines/reveal` - Reveal cell in Mines
- `POST /api/games/mines/cashout` - Cash out from Mines
- `POST /api/games/dice/roll` - Roll dice
- `POST /api/games/slots/spin` - Spin slot machine
- `POST /api/games/plinko/drop` - Drop Plinko ball
- `POST /api/games/scissors/play` - Play Rock Paper Scissors
- `POST /api/games/turtle/race` - Start Turtle Race

### Wallet & Withdrawals
- `POST /api/users/:id/wallet` - Set wallet address
- `POST /api/users/:id/withdraw` - Request withdrawal
- `GET /api/users/:id/withdrawals` - Get user's withdrawals
- `POST /api/promo/apply` - Apply promo code

### Admin Endpoints (requires x-admin-id header)
- `GET /api/admin/settings` - Get admin settings
- `POST /api/admin/settings/winrate` - Update win rate
- `GET /api/admin/users` - Get all users
- `GET /api/admin/users/active` - Get active users (last 24h)
- `POST /api/admin/users/:id/balance` - Set user balance
- `GET /api/admin/users/:id/bets` - Get user's bet history
- `GET /api/admin/users/:id/withdrawals` - Get user's withdrawals
- `GET /api/admin/withdrawals` - Get pending withdrawals
- `POST /api/admin/withdrawals/:id/process` - Approve/reject withdrawal
- `GET /api/admin/bets` - Get all recent bets
- `GET /api/admin/promo-codes` - Get all promo codes
- `POST /api/admin/promo-codes` - Create promo code

## Running the App
The app runs on port 5000 via `npm run dev`

## Database Commands
- `npm run db:push` - Push schema changes to database
- `npm run db:push --force` - Force push if needed

## Telegram Integration
- Uses Telegram WebApp SDK for native integration
- Supports light/dark theme from Telegram
- Haptic feedback for interactions
- Safe area support for mobile devices
- Expands to fullscreen automatically

## Recent Changes
- Added PostgreSQL database with Drizzle ORM for persistent storage
- All games now save bets and update balance in database
- Added 2 new games: Rock Paper Scissors and Turtle Race
- Updated GameCard with vibrant game images from original Web3 Casino design
- Updated gradients to match original casino aesthetic
- Added Profile page with user info
- Implemented referral system: generate codes, invite friends, earn $50 per referral
- New users get $100 bonus when using referral code
- Updated lobby design to pure black casino style
- Admin-controlled win rate system - @nahalist can set win percentage for all games
- Wallet integration - connect TON wallet, deposit, and request withdrawals
- Admin panel for withdrawal approvals/rejections
- All game logic now uses shouldPlayerWin() to respect admin win rate settings
- Fixed Dice game boundary validation for edge cases (targets 1-99/100)
- Extended admin panel with tabs: Users, Withdrawals, Games History, Promo Codes, Settings
- Active users tracking (online/today) with lastSeenAt timestamps
- User detail view showing bet history and withdrawal history
- Heartbeat system tracks user activity every 60 seconds
- Deposit tab with TON address: UQDLojwLKmB87iF5FrF79A8atSmbrMp2s9IWlPXfFQGoaWzs
- **FIX**: Critical balance synchronization fixed - Crash and Mines now save to database via cashout/crashed endpoints
- **NEW**: USDT TRC20 deposit address: TPG3UTHzvGbwEzGkA9xkY5stFVzmqV2rwG
- **NEW**: Automatic balance sync every 10 seconds prevents stale frontend data
- **NEW**: Admin privilege management - grant/revoke admin rights via `/api/admin/users/:id/admin`
- **NEW**: Withdrawal network selection displayed in UI (TON, TRC20, ERC20, BEP20)
- **FIX**: Mines multiplier now starts from 0.12x and progressively increases based on mines count
- **FIX**: With 1 mine, player breaks even after ~10 revealed cells; more mines = faster break even
- **FIX**: RTP slider now immediately saves position after update (no delay)
- **NEW**: Audio system with AudioProvider context and AudioControls component
- **NEW**: Unique background music for each game (8 tracks: lobby, crash, mines, dice, slots, plinko, scissors, turtle)
- **NEW**: Sound effects for game actions (win, lose, click, bet, spin, reveal, crash, cashout)
- **NEW**: Music and sound volume controls with persistence in localStorage

## Audio System
- `AudioProvider` context wraps the app for global audio state
- `AudioControls` component in header shows music/sound toggles and volume sliders
- Each game has unique background music with different moods
- Music is disabled by default (user must enable), sounds enabled at 50% volume
- Settings persist in localStorage under "gameAudioSettings" key

## User Preferences
- Dark theme by default (gaming aesthetic)
- Mobile-first design optimized for Telegram viewport
- Touch-optimized controls with haptic feedback
- All communication in Russian when requested
