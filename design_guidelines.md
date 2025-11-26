# Design Guidelines: Telegram Mini App Casino

## Design Approach
**Reference-Based:** Drawing from modern crypto gaming platforms (Stake, Rollbit) while respecting Telegram's native design language. The design balances gaming excitement with Telegram's clean, mobile-first aesthetic.

## Core Design Principles
1. **Telegram-Native Integration:** Respect theme_params for seamless light/dark mode transitions
2. **Mobile-First Gaming:** Touch-optimized, portrait-oriented game interfaces
3. **Instant Clarity:** Game states and actions immediately obvious
4. **Minimal Distraction:** Clean UI that keeps focus on gameplay

---

## Typography

**Font Stack:** 
- Primary: SF Pro Display (iOS), Roboto (Android) - system fonts for optimal Telegram integration
- Fallback: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif

**Hierarchy:**
- Game Titles: 24px/28px, Bold (600)
- Section Headers: 18px/22px, Semibold (600)
- Primary Content: 15px/20px, Regular (400)
- Secondary/Stats: 13px/18px, Regular (400)
- Button Text: 15px/20px, Medium (500)

---

## Layout System

**Spacing Primitives:** Use Tailwind units of 2, 4, 8, 12, 16 for consistency
- Micro spacing (icons, badges): p-2, gap-2
- Component internal: p-4, gap-4
- Section spacing: py-8, px-4
- Game containers: p-8, gap-8

**Grid Structure:**
- Container: max-w-md (448px) - optimized for mobile devices
- Safe Area: px-4 on all screens (respects Telegram safe areas)
- Game Grid: Single column on mobile, no multi-column layouts (vertical scrolling)

---

## Component Library

### Navigation
**Telegram Bottom Bar Integration:**
- Use Telegram's MainButton API for primary actions ("Play", "Bet", "Cash Out")
- BackButton for navigation between game lobby and individual games
- No custom header - respect Telegram's native top bar

### Game Lobby
**Layout:**
- Vertical scrolling card list
- Each game card: 16:9 aspect ratio thumbnail, game name, current players count
- Cards with rounded corners (rounded-2xl), subtle shadow

### Individual Game Screens
**Universal Structure:**
- Game Canvas Area: 60% of viewport height (main game visualization)
- Controls Panel: Bottom 40% (betting, buttons, stats)
- Sticky bottom controls that respect Telegram safe areas

### Betting Interface
**Components:**
- Amount Input: Large, center-aligned number display with +/- quick adjust buttons
- Primary Action: Full-width Telegram MainButton (controlled via SDK)
- Bet History: Collapsible panel (not always visible to reduce clutter)

### Stats Display
**Cards:**
- Compact stat cards showing: Current Multiplier, Total Bet, Potential Win
- Use badge styling (rounded-full, px-4, py-2) for live game stats
- Color-coded: Green for wins, Red for losses, Blue/neutral for active

### Modals/Overlays
- Use Telegram's Popup API where possible
- Custom modals: Full-screen overlays with backdrop blur
- Slide-up animation from bottom (mobile-native pattern)

---

## Game-Specific Layouts

### Crash Game
- Large animated graph (canvas) taking 65% viewport
- Live multiplier display: Center, very large typography (48px+)
- Cash Out button: Prominent, bottom-center
- Active bets list: Sidebar panel (collapsible on mobile)

### Mines
- Grid: 5×5 centered layout, square tiles with rounded corners
- Tile size: Dynamic based on screen width, minimum touch target 48px
- Bomb counter and current multiplier: Top sticky bar

### Dice/Plinko/Slots
- Central game visualization: 55% viewport
- Result history: Horizontal scrolling chips below game
- Betting controls: Fixed bottom panel

### Turtle Race
- Horizontal race track: Full width, 40% viewport height
- Turtle selection: Horizontal scrollable cards
- Live positions: Minimal UI overlays on track

---

## Telegram Theme Integration

**Adapt to theme_params:**
- Background: `var(--tg-theme-bg-color)`
- Cards/Surfaces: `var(--tg-theme-secondary-bg-color)`
- Primary Text: `var(--tg-theme-text-color)`
- Secondary Text: `var(--tg-theme-hint-color)`
- Accent/CTA: `var(--tg-theme-button-color)`
- Button Text: `var(--tg-theme-button-text-color)`

**Custom Accents:**
- Win/Success: Bright green (#10B981)
- Loss/Danger: Bright red (#EF4444)
- Active Bet: Electric blue (#3B82F6)

---

## Animations

**Minimal, Purposeful:**
- Game state transitions: 200ms ease-out
- MainButton interactions: Handled by Telegram SDK
- Winning celebrations: Subtle scale pulse (scale-105), 300ms
- Loading states: Telegram's built-in loading indicators

**No Animations:**
- Page navigation (handled by Telegram)
- Scroll effects
- Background animations

---

## Images

**Game Thumbnails (Lobby):**
- 16:9 ratio cards showing game preview
- Each game needs distinctive thumbnail:
  - Crash: Ascending graph line visual
  - Mines: Grid with stylized bombs
  - Dice: Rolling dice mid-air
  - Slots: Reels with symbols
  - Turtle: Race track with turtles
  - Scissors: Rock-paper-scissors hands
  - Plinko: Ball dropping through pegs

**No Hero Section:** Telegram Mini Apps open directly to content - start with game grid immediately

**Icons:** Use Heroicons (outline style) for UI elements via CDN, sized at 20px/24px for optimal mobile touch targets

---

## Mobile Optimizations

- All touch targets minimum 44px
- Sticky positioning for critical controls (betting panel, MainButton)
- Prevent zoom on input focus (font-size: 16px minimum)
- Haptic feedback integration via Telegram HapticFeedback API
- Respect safe area insets for devices with notches