import { Card, PokerGameState, PokerPlayerState, PokerAction } from "@shared/schema";
import { createDeck, shuffleDeck, evaluateHand, compareHands, cardsToString } from "./handEvaluator";

interface TablePlayer {
  odejs: string;
  username: string;
  photoUrl?: string;
  seatNumber: number;
  chipStack: number;
  holeCards: Card[];
  betAmount: number;
  totalBetInHand: number;
  isFolded: boolean;
  isAllIn: boolean;
  hasActed: boolean;
  isSittingOut: boolean;
}

interface ActiveHand {
  tableId: string;
  handNumber: number;
  pot: number;
  sidePots: { amount: number; eligiblePlayers: string[] }[];
  communityCards: Card[];
  deck: Card[];
  deckIndex: number;
  status: "waiting" | "preflop" | "flop" | "turn" | "river" | "showdown";
  dealerSeat: number;
  smallBlindSeat: number;
  bigBlindSeat: number;
  currentTurn: number | null;
  currentBet: number;
  minRaise: number;
  lastRaiser: number | null;
  players: Map<number, TablePlayer>;
  smallBlind: number;
  bigBlind: number;
  rakePercent: number;
  rakeCap: number;
  rake: number;
  actionTimeout: NodeJS.Timeout | null;
}

const TURN_TIME_SECONDS = 30;

class PokerTableManager {
  private tables: Map<string, ActiveHand> = new Map();
  private tableHandNumbers: Map<string, number> = new Map();
  private onStateChange: (tableId: string, state: PokerGameState) => void;
  private onBalanceChange: (odejs: string, amount: number) => void;

  constructor(
    onStateChange: (tableId: string, state: PokerGameState) => void,
    onBalanceChange: (odejs: string, amount: number) => void
  ) {
    this.onStateChange = onStateChange;
    this.onBalanceChange = onBalanceChange;
  }

  getOrCreateTable(tableId: string, smallBlind: number, bigBlind: number, rakePercent: number, rakeCap: number): ActiveHand {
    let hand = this.tables.get(tableId);
    if (!hand) {
      hand = {
        tableId,
        handNumber: this.tableHandNumbers.get(tableId) || 0,
        pot: 0,
        sidePots: [],
        communityCards: [],
        deck: [],
        deckIndex: 0,
        status: "waiting",
        dealerSeat: 0,
        smallBlindSeat: 0,
        bigBlindSeat: 0,
        currentTurn: null,
        currentBet: 0,
        minRaise: bigBlind,
        lastRaiser: null,
        players: new Map(),
        smallBlind,
        bigBlind,
        rakePercent,
        rakeCap,
        rake: 0,
        actionTimeout: null,
      };
      this.tables.set(tableId, hand);
    }
    return hand;
  }

  addPlayer(tableId: string, player: Omit<TablePlayer, "holeCards" | "betAmount" | "totalBetInHand" | "isFolded" | "isAllIn" | "hasActed">): boolean {
    const hand = this.tables.get(tableId);
    if (!hand) return false;

    if (hand.players.has(player.seatNumber)) return false;

    hand.players.set(player.seatNumber, {
      ...player,
      holeCards: [],
      betAmount: 0,
      totalBetInHand: 0,
      isFolded: false,
      isAllIn: false,
      hasActed: false,
    });

    this.broadcastState(tableId);
    return true;
  }

  removePlayer(tableId: string, seatNumber: number): boolean {
    const hand = this.tables.get(tableId);
    if (!hand) return false;

    const player = hand.players.get(seatNumber);
    if (!player) return false;

    // Return chips to player balance
    if (player.chipStack > 0) {
      this.onBalanceChange(player.odejs, player.chipStack);
    }

    hand.players.delete(seatNumber);
    this.broadcastState(tableId);
    return true;
  }

  canStartHand(tableId: string): boolean {
    const hand = this.tables.get(tableId);
    if (!hand) return false;

    const activePlayers = Array.from(hand.players.values()).filter(p => !p.isSittingOut && p.chipStack > 0);
    return activePlayers.length >= 2 && hand.status === "waiting";
  }

  startNewHand(tableId: string): boolean {
    const hand = this.tables.get(tableId);
    if (!hand || !this.canStartHand(tableId)) return false;

    // Increment hand number
    hand.handNumber++;
    this.tableHandNumbers.set(tableId, hand.handNumber);

    // Reset hand state
    hand.pot = 0;
    hand.sidePots = [];
    hand.communityCards = [];
    hand.currentBet = 0;
    hand.minRaise = hand.bigBlind;
    hand.lastRaiser = null;
    hand.rake = 0;
    hand.status = "preflop";

    // Create and shuffle deck
    hand.deck = shuffleDeck(createDeck());
    hand.deckIndex = 0;

    // Reset player states
    const activePlayers = Array.from(hand.players.entries())
      .filter(([_, p]) => !p.isSittingOut && p.chipStack > 0)
      .sort((a, b) => a[0] - b[0]);

    for (const [seat, player] of Array.from(hand.players.entries())) {
      player.holeCards = [];
      player.betAmount = 0;
      player.totalBetInHand = 0;
      player.isFolded = player.isSittingOut || player.chipStack <= 0;
      player.isAllIn = false;
      player.hasActed = false;
    }

    // Move dealer button
    const seats = activePlayers.map(([seat]) => seat);
    const currentDealerIndex = seats.indexOf(hand.dealerSeat);
    const newDealerIndex = (currentDealerIndex + 1) % seats.length;
    hand.dealerSeat = seats[newDealerIndex];

    // Set blinds
    const sbIndex = (newDealerIndex + 1) % seats.length;
    const bbIndex = (newDealerIndex + 2) % seats.length;
    
    // Special case for heads-up
    if (seats.length === 2) {
      hand.smallBlindSeat = seats[newDealerIndex];
      hand.bigBlindSeat = seats[(newDealerIndex + 1) % 2];
    } else {
      hand.smallBlindSeat = seats[sbIndex];
      hand.bigBlindSeat = seats[bbIndex];
    }

    // Post blinds
    this.postBlind(hand, hand.smallBlindSeat, hand.smallBlind);
    this.postBlind(hand, hand.bigBlindSeat, hand.bigBlind);
    hand.currentBet = hand.bigBlind;

    // Deal hole cards
    for (const [seat, player] of Array.from(hand.players.entries())) {
      if (!player.isFolded) {
        player.holeCards = [
          hand.deck[hand.deckIndex++],
          hand.deck[hand.deckIndex++]
        ];
      }
    }

    // Set first action
    const firstToActIndex = seats.length === 2 ? 0 : (bbIndex + 1) % seats.length;
    hand.currentTurn = seats[firstToActIndex];

    this.startTurnTimer(tableId);
    this.broadcastState(tableId);
    return true;
  }

  private postBlind(hand: ActiveHand, seatNumber: number, amount: number): void {
    const player = hand.players.get(seatNumber);
    if (!player) return;

    const actualAmount = Math.min(amount, player.chipStack);
    player.chipStack -= actualAmount;
    player.betAmount = actualAmount;
    player.totalBetInHand = actualAmount;
    hand.pot += actualAmount;

    if (player.chipStack === 0) {
      player.isAllIn = true;
    }
  }

  handleAction(tableId: string, seatNumber: number, action: PokerAction, amount?: number): boolean {
    const hand = this.tables.get(tableId);
    if (!hand || hand.currentTurn !== seatNumber) return false;

    const player = hand.players.get(seatNumber);
    if (!player || player.isFolded || player.isAllIn) return false;

    this.clearTurnTimer(hand);

    switch (action) {
      case "fold":
        player.isFolded = true;
        break;

      case "check":
        if (hand.currentBet > player.betAmount) return false;
        break;

      case "call":
        const callAmount = Math.min(hand.currentBet - player.betAmount, player.chipStack);
        player.chipStack -= callAmount;
        player.betAmount += callAmount;
        player.totalBetInHand += callAmount;
        hand.pot += callAmount;
        if (player.chipStack === 0) player.isAllIn = true;
        break;

      case "bet":
      case "raise":
        if (!amount || amount < hand.minRaise) return false;
        const totalBet = hand.currentBet > 0 ? hand.currentBet + amount : amount;
        const raiseAmount = totalBet - player.betAmount;
        if (raiseAmount > player.chipStack) return false;
        
        player.chipStack -= raiseAmount;
        player.betAmount = totalBet;
        player.totalBetInHand += raiseAmount;
        hand.pot += raiseAmount;
        hand.currentBet = totalBet;
        hand.minRaise = amount;
        hand.lastRaiser = seatNumber;
        
        if (player.chipStack === 0) player.isAllIn = true;

        // Reset hasActed for all other players
        for (const [s, p] of Array.from(hand.players.entries())) {
          if (s !== seatNumber && !p.isFolded && !p.isAllIn) {
            p.hasActed = false;
          }
        }
        break;

      case "all_in":
        const allInAmount = player.chipStack;
        const newBet = player.betAmount + allInAmount;
        
        if (newBet > hand.currentBet) {
          hand.minRaise = Math.max(hand.minRaise, newBet - hand.currentBet);
          hand.currentBet = newBet;
          hand.lastRaiser = seatNumber;
          
          // Reset hasActed for all other players
          for (const [s, p] of Array.from(hand.players.entries())) {
            if (s !== seatNumber && !p.isFolded && !p.isAllIn) {
              p.hasActed = false;
            }
          }
        }
        
        player.chipStack = 0;
        player.betAmount = newBet;
        player.totalBetInHand += allInAmount;
        hand.pot += allInAmount;
        player.isAllIn = true;
        break;
    }

    player.hasActed = true;

    // Check if hand is over
    const activePlayers = Array.from(hand.players.values()).filter(p => !p.isFolded);
    if (activePlayers.length === 1) {
      this.awardPot(hand, activePlayers[0]);
      this.endHand(tableId);
      return true;
    }

    // Move to next player or next street
    if (this.isStreetComplete(hand)) {
      this.advanceStreet(hand);
    } else {
      this.moveToNextPlayer(hand);
    }

    this.startTurnTimer(tableId);
    this.broadcastState(tableId);
    return true;
  }

  private isStreetComplete(hand: ActiveHand): boolean {
    const activePlayers = Array.from(hand.players.values()).filter(p => !p.isFolded && !p.isAllIn);
    
    if (activePlayers.length === 0) return true;
    
    return activePlayers.every(p => p.hasActed && p.betAmount === hand.currentBet);
  }

  private moveToNextPlayer(hand: ActiveHand): void {
    const seats = Array.from(hand.players.keys()).sort((a, b) => a - b);
    const currentIndex = seats.indexOf(hand.currentTurn!);
    
    for (let i = 1; i <= seats.length; i++) {
      const nextSeat = seats[(currentIndex + i) % seats.length];
      const player = hand.players.get(nextSeat);
      if (player && !player.isFolded && !player.isAllIn && !player.hasActed) {
        hand.currentTurn = nextSeat;
        return;
      }
    }
    
    // If no one else can act, street is complete
    hand.currentTurn = null;
  }

  private advanceStreet(hand: ActiveHand): void {
    // Reset bets for new street
    for (const [_, player] of Array.from(hand.players.entries())) {
      player.betAmount = 0;
      player.hasActed = false;
    }
    hand.currentBet = 0;
    hand.minRaise = hand.bigBlind;
    hand.lastRaiser = null;

    const activePlayers = Array.from(hand.players.values()).filter(p => !p.isFolded && !p.isAllIn);
    
    switch (hand.status) {
      case "preflop":
        hand.status = "flop";
        hand.communityCards = [
          hand.deck[hand.deckIndex++],
          hand.deck[hand.deckIndex++],
          hand.deck[hand.deckIndex++]
        ];
        break;
      case "flop":
        hand.status = "turn";
        hand.communityCards.push(hand.deck[hand.deckIndex++]);
        break;
      case "turn":
        hand.status = "river";
        hand.communityCards.push(hand.deck[hand.deckIndex++]);
        break;
      case "river":
        hand.status = "showdown";
        this.determineWinners(hand);
        this.endHand(hand.tableId);
        return;
    }

    // If only one player can act (everyone else is all-in)
    if (activePlayers.length <= 1) {
      this.advanceStreet(hand);
      return;
    }

    // Set first to act (first player after dealer)
    const seats = Array.from(hand.players.keys()).sort((a, b) => a - b);
    const dealerIndex = seats.indexOf(hand.dealerSeat);
    
    for (let i = 1; i <= seats.length; i++) {
      const seat = seats[(dealerIndex + i) % seats.length];
      const player = hand.players.get(seat);
      if (player && !player.isFolded && !player.isAllIn) {
        hand.currentTurn = seat;
        break;
      }
    }
  }

  private determineWinners(hand: ActiveHand): void {
    const contenders = Array.from(hand.players.entries())
      .filter(([_, p]) => !p.isFolded)
      .map(([seat, player]) => ({
        seat,
        player,
        handResult: evaluateHand(player.holeCards, hand.communityCards)
      }))
      .sort((a, b) => -compareHands(a.handResult, b.handResult));

    // Calculate rake
    const potBeforeRake = hand.pot;
    const rakeAmount = Math.min(potBeforeRake * (hand.rakePercent / 100), hand.rakeCap);
    hand.rake = rakeAmount;
    const potAfterRake = potBeforeRake - rakeAmount;

    // Simple winner determination (TODO: implement side pots properly)
    const winner = contenders[0];
    winner.player.chipStack += potAfterRake;

    console.log(`Hand #${hand.handNumber} Winner: Seat ${winner.seat} with ${winner.handResult.description}`);
  }

  private awardPot(hand: ActiveHand, winner: TablePlayer): void {
    const rakeAmount = Math.min(hand.pot * (hand.rakePercent / 100), hand.rakeCap);
    hand.rake = rakeAmount;
    winner.chipStack += hand.pot - rakeAmount;
  }

  private endHand(tableId: string): void {
    const hand = this.tables.get(tableId);
    if (!hand) return;

    this.clearTurnTimer(hand);
    hand.status = "waiting";
    hand.currentTurn = null;

    this.broadcastState(tableId);

    // Auto-start next hand after delay if enough players
    setTimeout(() => {
      if (this.canStartHand(tableId)) {
        this.startNewHand(tableId);
      }
    }, 3000);
  }

  private startTurnTimer(tableId: string): void {
    const hand = this.tables.get(tableId);
    if (!hand || !hand.currentTurn) return;

    hand.actionTimeout = setTimeout(() => {
      // Auto-fold on timeout
      const player = hand.players.get(hand.currentTurn!);
      if (player) {
        if (hand.currentBet <= player.betAmount) {
          this.handleAction(tableId, hand.currentTurn!, "check");
        } else {
          this.handleAction(tableId, hand.currentTurn!, "fold");
        }
      }
    }, TURN_TIME_SECONDS * 1000);
  }

  private clearTurnTimer(hand: ActiveHand): void {
    if (hand.actionTimeout) {
      clearTimeout(hand.actionTimeout);
      hand.actionTimeout = null;
    }
  }

  getState(tableId: string, requestingUserId?: string): PokerGameState | null {
    const hand = this.tables.get(tableId);
    if (!hand) return null;

    const players: PokerPlayerState[] = [];
    const seats = Array.from(hand.players.entries()).sort((a, b) => a[0] - b[0]);

    for (const [seat, player] of seats) {
      players.push({
        odejs: player.odejs,
        odejsname: player.username,
        odejsPhotoUrl: player.photoUrl,
        seatNumber: seat,
        chipStack: player.chipStack,
        betAmount: player.betAmount,
        isFolded: player.isFolded,
        isAllIn: player.isAllIn,
        isDealer: seat === hand.dealerSeat,
        isSmallBlind: seat === hand.smallBlindSeat,
        isBigBlind: seat === hand.bigBlindSeat,
        isCurrentTurn: seat === hand.currentTurn,
        holeCards: player.odejs === requestingUserId ? player.holeCards : 
          (hand.status === "showdown" && !player.isFolded ? player.holeCards : undefined),
        isSittingOut: player.isSittingOut,
      });
    }

    return {
      tableId: hand.tableId,
      tableName: "",
      handNumber: hand.handNumber,
      pot: hand.pot,
      communityCards: hand.communityCards,
      status: hand.status,
      dealerSeat: hand.dealerSeat,
      currentTurn: hand.currentTurn,
      currentBet: hand.currentBet,
      minRaise: hand.minRaise,
      players,
      timeBank: TURN_TIME_SECONDS,
    };
  }

  private broadcastState(tableId: string): void {
    const state = this.getState(tableId);
    if (state) {
      this.onStateChange(tableId, state);
    }
  }
}

// Singleton instance
let pokerManager: PokerTableManager | null = null;

export function getPokerManager(
  onStateChange?: (tableId: string, state: PokerGameState) => void,
  onBalanceChange?: (odejs: string, amount: number) => void
): PokerTableManager {
  if (!pokerManager && onStateChange && onBalanceChange) {
    pokerManager = new PokerTableManager(onStateChange, onBalanceChange);
  }
  if (!pokerManager) {
    throw new Error("PokerManager not initialized");
  }
  return pokerManager;
}
