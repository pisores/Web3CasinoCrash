import { Card, Rank, Suit, HandRanking, ranks, suits } from "@shared/schema";

const RANK_VALUES: Record<Rank, number> = {
  "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9,
  "T": 10, "J": 11, "Q": 12, "K": 13, "A": 14
};

interface HandResult {
  ranking: HandRanking;
  rankValue: number; // 0-9, higher is better
  kickers: number[]; // For tie-breaking
  description: string;
}

export function evaluateHand(holeCards: Card[], communityCards: Card[]): HandResult {
  const allCards = [...holeCards, ...communityCards];
  if (allCards.length < 5) {
    return { ranking: "high_card", rankValue: 0, kickers: [], description: "Not enough cards" };
  }

  // Generate all 5-card combinations
  const combinations = getCombinations(allCards, 5);
  let bestHand: HandResult = { ranking: "high_card", rankValue: 0, kickers: [0], description: "" };

  for (const combo of combinations) {
    const result = evaluate5Cards(combo);
    if (compareHands(result, bestHand) > 0) {
      bestHand = result;
    }
  }

  return bestHand;
}

function evaluate5Cards(cards: Card[]): HandResult {
  const sortedCards = [...cards].sort((a, b) => RANK_VALUES[b.rank] - RANK_VALUES[a.rank]);
  const values = sortedCards.map(c => RANK_VALUES[c.rank]);
  const suitCounts = getSuitCounts(sortedCards);
  const rankCounts = getRankCounts(sortedCards);

  const isFlush = Object.values(suitCounts).some(count => count === 5);
  const isStraight = checkStraight(values);
  const isWheel = checkWheel(values); // A-2-3-4-5

  // Check for straight flush / royal flush
  if (isFlush && (isStraight || isWheel)) {
    if (values[0] === 14 && isStraight) {
      return { ranking: "royal_flush", rankValue: 9, kickers: [14], description: "Royal Flush" };
    }
    return { 
      ranking: "straight_flush", 
      rankValue: 8, 
      kickers: isWheel ? [5] : [values[0]], 
      description: `Straight Flush, ${getRankName(isWheel ? 5 : values[0])} high` 
    };
  }

  // Four of a kind
  const quads = Object.entries(rankCounts).find(([_, count]) => count === 4);
  if (quads) {
    const quadValue = RANK_VALUES[quads[0] as Rank];
    const kicker = values.find(v => v !== quadValue)!;
    return { ranking: "four_of_a_kind", rankValue: 7, kickers: [quadValue, kicker], description: `Four of a Kind, ${getRankName(quadValue)}s` };
  }

  // Full house
  const trips = Object.entries(rankCounts).find(([_, count]) => count === 3);
  const pair = Object.entries(rankCounts).find(([_, count]) => count === 2);
  if (trips && pair) {
    return { 
      ranking: "full_house", 
      rankValue: 6, 
      kickers: [RANK_VALUES[trips[0] as Rank], RANK_VALUES[pair[0] as Rank]], 
      description: `Full House, ${getRankName(RANK_VALUES[trips[0] as Rank])}s full of ${getRankName(RANK_VALUES[pair[0] as Rank])}s` 
    };
  }

  // Flush
  if (isFlush) {
    return { ranking: "flush", rankValue: 5, kickers: values, description: `Flush, ${getRankName(values[0])} high` };
  }

  // Straight
  if (isStraight || isWheel) {
    return { 
      ranking: "straight", 
      rankValue: 4, 
      kickers: isWheel ? [5] : [values[0]], 
      description: `Straight, ${getRankName(isWheel ? 5 : values[0])} high` 
    };
  }

  // Three of a kind
  if (trips) {
    const tripValue = RANK_VALUES[trips[0] as Rank];
    const kickers = values.filter(v => v !== tripValue);
    return { ranking: "three_of_a_kind", rankValue: 3, kickers: [tripValue, ...kickers], description: `Three of a Kind, ${getRankName(tripValue)}s` };
  }

  // Two pair
  const pairs = Object.entries(rankCounts).filter(([_, count]) => count === 2);
  if (pairs.length === 2) {
    const pairValues = pairs.map(p => RANK_VALUES[p[0] as Rank]).sort((a, b) => b - a);
    const kicker = values.find(v => !pairValues.includes(v))!;
    return { ranking: "two_pair", rankValue: 2, kickers: [...pairValues, kicker], description: `Two Pair, ${getRankName(pairValues[0])}s and ${getRankName(pairValues[1])}s` };
  }

  // One pair
  if (pairs.length === 1) {
    const pairValue = RANK_VALUES[pairs[0][0] as Rank];
    const kickers = values.filter(v => v !== pairValue);
    return { ranking: "pair", rankValue: 1, kickers: [pairValue, ...kickers], description: `Pair of ${getRankName(pairValue)}s` };
  }

  // High card
  return { ranking: "high_card", rankValue: 0, kickers: values, description: `High Card, ${getRankName(values[0])}` };
}

function getSuitCounts(cards: Card[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const card of cards) {
    counts[card.suit] = (counts[card.suit] || 0) + 1;
  }
  return counts;
}

function getRankCounts(cards: Card[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const card of cards) {
    counts[card.rank] = (counts[card.rank] || 0) + 1;
  }
  return counts;
}

function checkStraight(values: number[]): boolean {
  const unique = [...new Set(values)].sort((a, b) => b - a);
  if (unique.length < 5) return false;
  for (let i = 0; i < unique.length - 4; i++) {
    if (unique[i] - unique[i + 4] === 4) return true;
  }
  return false;
}

function checkWheel(values: number[]): boolean {
  const unique = [...new Set(values)];
  return [14, 2, 3, 4, 5].every(v => unique.includes(v));
}

function getRankName(value: number): string {
  const names: Record<number, string> = {
    2: "Two", 3: "Three", 4: "Four", 5: "Five", 6: "Six",
    7: "Seven", 8: "Eight", 9: "Nine", 10: "Ten",
    11: "Jack", 12: "Queen", 13: "King", 14: "Ace"
  };
  return names[value] || String(value);
}

function getCombinations<T>(arr: T[], k: number): T[][] {
  const result: T[][] = [];
  
  function combine(start: number, current: T[]) {
    if (current.length === k) {
      result.push([...current]);
      return;
    }
    for (let i = start; i < arr.length; i++) {
      current.push(arr[i]);
      combine(i + 1, current);
      current.pop();
    }
  }
  
  combine(0, []);
  return result;
}

export function compareHands(a: HandResult, b: HandResult): number {
  if (a.rankValue !== b.rankValue) {
    return a.rankValue - b.rankValue;
  }
  
  for (let i = 0; i < Math.min(a.kickers.length, b.kickers.length); i++) {
    if (a.kickers[i] !== b.kickers[i]) {
      return a.kickers[i] - b.kickers[i];
    }
  }
  
  return 0;
}

export function createDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({ rank, suit });
    }
  }
  return deck;
}

export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function cardToString(card: Card): string {
  const suitSymbols: Record<Suit, string> = {
    hearts: "♥",
    diamonds: "♦",
    clubs: "♣",
    spades: "♠"
  };
  return `${card.rank}${suitSymbols[card.suit]}`;
}

export function cardsToString(cards: Card[]): string {
  return cards.map(cardToString).join(" ");
}
