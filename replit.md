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
- **users**: id, telegramId, username, firstName, lastName, balance, referralCode, referredBy, referralCount
- **bets**: id, userId, gameType, amount, multiplier, payout, isWin, gameData, createdAt

## API Endpoints
- `POST /api/users/telegram` - Create/fetch user by Telegram ID
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
- `POST /api/users/:id/referral-code` - Generate referral code
- `POST /api/users/:id/apply-referral` - Apply referral code (get $100 bonus)
- `GET /api/users/:id/referral-stats` - Get referral statistics

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

## User Preferences
- Dark theme by default (gaming aesthetic)
- Mobile-first design optimized for Telegram viewport
- Touch-optimized controls with haptic feedback
- All communication in Russian when requested
