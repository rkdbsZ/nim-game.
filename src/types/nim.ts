/**
 * Types and interfaces for the Nim Game application
 */

export type GameMode = 'vs-ai' | 'pass-and-play';

export type RuleType = 'normal' | 'misere';
// normal: The player who takes the last object WINS
// misere: The player who takes the last object LOSES (마지막 돌을 가져가면 패배)

export type AIDifficulty = 'easy' | 'medium' | 'master';

export type PieceTheme = 'pebbles' | 'matches' | 'gems' | 'coins';

export type ActiveTab = 'game' | 'puzzle' | 'strategy' | 'simulator';

export interface NimPuzzle {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  description: string;
  piles: number[];
  rule: RuleType;
  maxTakePerTurn?: number;
  hint: string;
  solutionExplanation: string;
}

export interface MoveRecord {
  id: string;
  player: 'player1' | 'player2' | 'ai';
  pileIndex: number;
  count: number;
  remainingInPile: number;
  nimSumBefore: number;
  nimSumAfter: number;
  pilesSnapshot: number[];
  timestamp: Date;
}

export interface PresetConfig {
  id: string;
  name: string;
  description: string;
  piles: number[];
  maxTakePerTurn?: number; // For Bachet's game (e.g. max 3 per turn)
  suggestedRule?: RuleType;
}

export interface NimAnalysis {
  nimSum: number;
  isWinningPosition: boolean; // N-position (true) vs P-position (false)
  binaryPiles: {
    pileIndex: number;
    count: number;
    binaryString: string;
    bits: number[];
  }[];
  nimSumBinary: string;
  nimSumBits: number[];
  optimalMove: {
    pileIndex: number;
    countToTake: number;
    targetCount: number;
    reasoning: string;
  } | null;
}
