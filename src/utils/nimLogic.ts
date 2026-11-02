/**
 * Complete mathematical logic for Nim Game (부통의 정리, 님-합, 마이제르 규칙)
 */
import { AIDifficulty, NimAnalysis, NimPuzzle, PresetConfig, RuleType } from '../types/nim';

export const PRESETS: PresetConfig[] = [
  {
    id: 'pyramid-1-2-3-4-5',
    name: '클래식 5줄 (1 - 2 - 3 - 4 - 5)',
    description: '교과서와 퍼즐북에 가장 많이 등장하는 1부터 5까지 5줄 피라미드 배치 (총 15개 돌).',
    piles: [1, 2, 3, 4, 5],
    suggestedRule: 'normal'
  },
  {
    id: 'classic-3-4-5',
    name: '전통 3줄 (3 - 4 - 5)',
    description: '가장 널리 알려진 3줄 님 게임 배치. 3줄에 각각 3개, 4개, 5개의 돌이 놓입니다.',
    piles: [3, 4, 5],
    suggestedRule: 'normal'
  },
  {
    id: 'pyramid-1-3-5-7',
    name: '홀수 피라미드 (1 - 3 - 5 - 7)',
    description: '대표적인 4단 홀수 피라미드 형태. 님-합이 0인 대칭적 시작 국면입니다.',
    piles: [1, 3, 5, 7],
    suggestedRule: 'misere'
  },
  {
    id: 'genius-3-5-7',
    name: '더 지니어스 스타일 (3 - 5 - 7)',
    description: '두뇌 서바이벌 방송에 자주 등장하는 불균형 홀수 조합 배치.',
    piles: [3, 5, 7],
    suggestedRule: 'misere'
  },
  {
    id: 'bachet-1-to-5',
    name: '바셰의 게임 (31개, 1~5개 가져가기)',
    description: '31개의 성냥에서 한 턴에 1부터 5개까지 자유롭게 가져가는 게임.',
    piles: [31],
    maxTakePerTurn: 5,
    suggestedRule: 'misere'
  },
  {
    id: 'bachet-21',
    name: '바셰의 21 성냥 (1줄, 1~3개 가져가기)',
    description: '21개 성냥에서 한 턴에 1~3개씩 가져가는 유명한 1줄 님 게임.',
    piles: [21],
    maxTakePerTurn: 3,
    suggestedRule: 'misere'
  }
];

export const NIM_PUZZLES: NimPuzzle[] = [
  {
    id: 'puzzle-1',
    title: '퍼즐 1: 1부터 5까지 5단 피라미드 (1-2-3-4-5)',
    difficulty: 'easy',
    description: '1개부터 5개까지 놓인 대표 5줄 피라미드 [1, 2, 3, 4, 5] 상태입니다 (일반 규칙). 선공인 당신이 님-합(XOR)을 0으로 만들어 필승을 굳히는 착수를 찾아보세요!',
    piles: [1, 2, 3, 4, 5],
    rule: 'normal',
    hint: '1 ⊕ 2 ⊕ 3 ⊕ 4 ⊕ 5 = 1 입니다. 님-합이 1이므로 1의 자리를 1개 줄여 짝수로 만들면 됩니다! (예: 1번 더미에서 1개 가져오기, 3번 더미에서 1개 가져오기, 5번 더미에서 1개 가져오기 중 하나)',
    solutionExplanation: '1번 더미의 1개를 모두 가져와 [0, 2, 3, 4, 5]로 만들거나, 3번 더미에서 1개를 빼 [1, 2, 2, 4, 5], 또는 5번 더미에서 1개를 빼 [1, 2, 3, 4, 4]로 만들면 님-합이 정확히 0이 되어 상대에게 필패 국면을 넘깁니다!'
  },
  {
    id: 'puzzle-2',
    title: '퍼즐 2: 클래식 3-4-5의 기선 제압',
    difficulty: 'easy',
    description: '일반 규칙(마지막 돌 획득 = 승리). 현재 [3, 4, 5] 상태에서 선공인 당신이 승리를 확정 짓는 최적의 한 수는 무엇일까요?',
    piles: [3, 4, 5],
    rule: 'normal',
    hint: '3 ⊕ 4 ⊕ 5 = 2 입니다. 님-합을 0으로 만들려면 1번 더미(3개)를 어떻게 해야 할까요?',
    solutionExplanation: '1번 더미에서 2개를 가져와 1개로 만들면 [1, 4, 5]가 되며, 1 ⊕ 4 ⊕ 5 = 0 (님-합 0)이 되어 상대에게 완벽한 패배 포지션을 넘깁니다!'
  },
  {
    id: 'puzzle-2',
    title: '퍼즐 2: 중반전의 비트 균형 맞추기',
    difficulty: 'medium',
    description: '일반 규칙. 더미 상태가 [2, 5, 6]으로 남았습니다. 님-합(XOR)을 0으로 만드는 한 수를 찾으세요!',
    piles: [2, 5, 6],
    rule: 'normal',
    hint: '2 = 010₍₂₎, 5 = 101₍₂₎, 6 = 110₍₂₎ 입니다. XOR 합은 001₍₂₎ = 1 입니다. 1의 자리를 홀수에서 짝수로 바꿔야 합니다.',
    solutionExplanation: '2번 더미(5개)에서 1개를 가져와 4개로 만들면 [2, 4, 6]이 되며, 2 ⊕ 4 ⊕ 6 = 0 이 되어 필승을 확정합니다.'
  },
  {
    id: 'puzzle-3',
    title: '퍼즐 3: 더 지니어스 마이제르 엔드게임',
    difficulty: 'hard',
    description: '마이제르 규칙(마지막 돌 획득 = 패배!). 현재 [1, 1, 1, 4] 상태입니다. 2개 이상인 더미가 1개만 남은 결정적인 순간, 당신의 선택은?',
    piles: [1, 1, 1, 4],
    rule: 'misere',
    hint: '상대가 마지막 돌을 가져가게 하려면 남은 1개짜리 더미의 총 개수가 "홀수 개"가 되어야 합니다. 현재 1개짜리 더미가 3개(홀수) 있습니다.',
    solutionExplanation: '현재 1개짜리 더미가 이미 3개(홀수)이므로, 4번 더미(4개)를 전부 가져와 완전히 없애버려야(0개) 합니다! 그러면 남은 더미는 [1, 1, 1] 3개로 상대가 마지막 돌을 집을 수밖에 없습니다.'
  },
  {
    id: 'puzzle-4',
    title: '퍼즐 4: 바셰의 게임 (Bachet 1~3개 제한)',
    difficulty: 'medium',
    description: '1줄에 14개의 돌이 남아있고, 1턴에 1~3개만 가져갈 수 있습니다 (일반 규칙). 상대방을 반드시 이기기 위해 이번 턴에 몇 개를 가져와야 할까요?',
    piles: [14],
    rule: 'normal',
    maxTakePerTurn: 3,
    hint: '최대 가져갈 수 있는 개수가 3개이므로 k + 1 = 4의 배수를 상대방에게 남겨주어야 합니다.',
    solutionExplanation: '14에서 4의 배수인 12를 남겨주어야 하므로, 정확히 2개를 가져와야 합니다! 이후 상대가 x개를 가져가면 당신은 (4 - x)개를 가져가 항상 4의 배수를 유지하면 무조건 승리합니다.'
  }
];

/**
 * Calculates Nim-Sum (XOR sum) of piles
 */
export function calculateNimSum(piles: number[]): number {
  return piles.reduce((acc, count) => acc ^ count, 0);
}

/**
 * Generates step-by-step binary analysis for current piles
 */
export function analyzeNimState(
  piles: number[],
  rule: RuleType,
  maxTakePerTurn?: number
): NimAnalysis {
  const nimSum = calculateNimSum(piles);
  const maxPile = Math.max(...piles, 1);
  const bitLength = Math.max(3, maxPile.toString(2).length);

  const binaryPiles = piles.map((count, pileIndex) => {
    const rawBinary = count.toString(2).padStart(bitLength, '0');
    return {
      pileIndex,
      count,
      binaryString: rawBinary,
      bits: rawBinary.split('').map(b => parseInt(b, 10))
    };
  });

  const nimSumBinary = nimSum.toString(2).padStart(bitLength, '0');
  const nimSumBits = nimSumBinary.split('').map(b => parseInt(b, 10));

  const optimalMove = findOptimalMove(piles, rule, maxTakePerTurn);

  // In normal play: winning if nimSum != 0
  // In misere play: depends on whether piles with size > 1 exist
  const isWinning = optimalMove !== null;

  return {
    nimSum,
    isWinningPosition: isWinning,
    binaryPiles,
    nimSumBinary,
    nimSumBits,
    optimalMove
  };
}

/**
 * Finds the mathematically optimal move according to Bouton's Theorem and Misère adjustments
 */
export function findOptimalMove(
  piles: number[],
  rule: RuleType,
  maxTakePerTurn?: number
): {
  pileIndex: number;
  countToTake: number;
  targetCount: number;
  reasoning: string;
} | null {
  // If only 1 pile with maxTakePerTurn (Bachet's game)
  if (piles.length === 1 && maxTakePerTurn) {
    const current = piles[0];
    if (current === 0) return null;

    const mod = maxTakePerTurn + 1;
    if (rule === 'normal') {
      // Goal is to leave multiple of (k+1)
      const remainder = current % mod;
      if (remainder !== 0) {
        return {
          pileIndex: 0,
          countToTake: remainder,
          targetCount: current - remainder,
          reasoning: `(k+1)=${mod}의 배수로 만들어 상대에게 턴을 넘깁니다. (${current} -> ${current - remainder})`
        };
      }
      // P-position, any valid move
      return null;
    } else {
      // Misere: Goal is to leave (mod * m) + 1
      const targetRemainder = 1;
      let countToTake = (current - targetRemainder) % mod;
      if (countToTake < 0) countToTake += mod;

      if (countToTake === 0) {
        // Already in losing position
        return null;
      }
      if (countToTake > maxTakePerTurn) {
        countToTake = 1;
      }
      return {
        pileIndex: 0,
        countToTake: Math.min(countToTake, current),
        targetCount: Math.max(0, current - countToTake),
        reasoning: `상대가 마지막 돌을 가져가도록 ${maxTakePerTurn + 1}k + 1 형태로 만듭니다.`
      };
    }
  }

  // Standard multi-pile Nim
  const nimSum = calculateNimSum(piles);
  const pilesGreaterThanOne = piles.filter(count => count > 1).length;
  const nonZeroPiles = piles.map((count, idx) => ({ count, idx })).filter(p => p.count > 0);

  if (nonZeroPiles.length === 0) return null;

  // --- MISÈRE PLAY LOGIC ---
  if (rule === 'misere') {
    // Critical endgame transition: exactly 1 pile has size > 1
    if (pilesGreaterThanOne === 1) {
      const largePile = nonZeroPiles.find(p => p.count > 1)!;
      const onesCount = nonZeroPiles.filter(p => p.count === 1).length;

      // We want to leave an ODD number of 1-size piles!
      // If currently onesCount is even, reduce large pile to 1 (making total 1s = onesCount + 1, which is odd)
      // If currently onesCount is odd, reduce large pile to 0 (making total 1s = onesCount, which is odd)
      const targetCount = onesCount % 2 === 0 ? 1 : 0;
      const countToTake = largePile.count - targetCount;

      return {
        pileIndex: largePile.idx,
        countToTake,
        targetCount,
        reasoning: `마이제르 규칙 핵심 전환: 남은 1개짜리 더미 개수를 홀수(${onesCount % 2 === 0 ? onesCount + 1 : onesCount}개)로 맞춰 상대가 마지막 돌을 집게 만듭니다.`
      };
    }

    // Only piles of size 1 remain
    if (pilesGreaterThanOne === 0) {
      // If total piles of 1 is odd, current player is in a losing position (P-position)
      if (nonZeroPiles.length % 2 === 1) {
        return null; // Losing
      } else {
        // Even number of 1s: take 1 to make it odd for opponent
        const first = nonZeroPiles[0];
        return {
          pileIndex: first.idx,
          countToTake: 1,
          targetCount: 0,
          reasoning: '남은 1개짜리 더미를 하나 제거하여 상대에게 홀수 개를 넘깁니다.'
        };
      }
    }

    // Otherwise (>= 2 piles have count > 1):
    // Misere strategy is IDENTICAL to Normal play (make Nim-Sum = 0)
    // because any single move leaves at least 1 pile with count > 1.
  }

  // --- NORMAL PLAY (or Misère with >= 2 large piles) ---
  if (nimSum === 0) {
    // Losing state (P-position), no move can guarantee a win if opponent plays perfectly
    return null;
  }

  // Winning state (N-position): find a pile i such that (pile[i] ^ nimSum) < pile[i]
  for (let i = 0; i < piles.length; i++) {
    const currentCount = piles[i];
    if (currentCount === 0) continue;

    const targetCount = currentCount ^ nimSum;
    if (targetCount < currentCount) {
      let countToTake = currentCount - targetCount;
      if (maxTakePerTurn && countToTake > maxTakePerTurn) {
        continue;
      }
      return {
        pileIndex: i,
        countToTake,
        targetCount,
        reasoning: `${i + 1}번 줄을 ${currentCount}개에서 ${targetCount}개로 줄여 님-합(XOR)을 0으로 만듭니다. (부통의 정리)`
      };
    }
  }

  return null;
}

/**
 * Computes AI move based on difficulty setting
 */
export function getAIMove(
  piles: number[],
  difficulty: AIDifficulty,
  rule: RuleType,
  maxTakePerTurn?: number
): { pileIndex: number; count: number } {
  const nonZeroPiles = piles
    .map((count, index) => ({ count, index }))
    .filter(p => p.count > 0);

  if (nonZeroPiles.length === 0) {
    return { pileIndex: 0, count: 0 };
  }

  const optimal = findOptimalMove(piles, rule, maxTakePerTurn);

  if (difficulty === 'master') {
    // 100% optimal move if available
    if (optimal) {
      return { pileIndex: optimal.pileIndex, count: optimal.countToTake };
    }
  } else if (difficulty === 'medium') {
    // 50% optimal move, 50% heuristic/random
    if (optimal && Math.random() < 0.55) {
      return { pileIndex: optimal.pileIndex, count: optimal.countToTake };
    }
  }

  // Random or fallback move
  const randomPile = nonZeroPiles[Math.floor(Math.random() * nonZeroPiles.length)];
  const maxPossible = maxTakePerTurn
    ? Math.min(randomPile.count, maxTakePerTurn)
    : randomPile.count;
  
  // Random count between 1 and maxPossible
  const randomCount = Math.floor(Math.random() * maxPossible) + 1;

  return {
    pileIndex: randomPile.index,
    count: randomCount
  };
}

/**
 * Checks if the entire board is empty
 */
export function isGameOver(piles: number[]): boolean {
  return piles.every(count => count === 0);
}

/**
 * Determines winner when game ends
 * lastPlayer: the player who just took the last stone
 */
export function getWinner(
  lastPlayer: 'player1' | 'player2' | 'ai',
  rule: RuleType,
  mode: 'vs-ai' | 'pass-and-play'
): { winner: 'player1' | 'player2' | 'ai'; title: string; subtitle: string } {
  let winningPlayer: 'player1' | 'player2' | 'ai';

  if (rule === 'normal') {
    // Player who took the last stone wins
    winningPlayer = lastPlayer;
  } else {
    // Misere: Player who took the last stone loses
    if (mode === 'vs-ai') {
      winningPlayer = lastPlayer === 'ai' ? 'player1' : 'ai';
    } else {
      winningPlayer = lastPlayer === 'player1' ? 'player2' : 'player1';
    }
  }

  let title = '';
  let subtitle = '';

  if (mode === 'vs-ai') {
    if (winningPlayer === 'player1') {
      title = '🎉 플레이어 승리!';
      subtitle = rule === 'normal' 
        ? '마지막 돌을 가져와 승리했습니다!' 
        : '마지막 돌을 AI에게 넘겨 승리했습니다!';
    } else {
      title = '🤖 AI 승리!';
      subtitle = rule === 'normal'
        ? 'AI가 마지막 돌을 가져갔습니다. 수학의 벽은 높았습니다!'
        : '마지막 돌을 집게 되어 패배했습니다!';
    }
  } else {
    const winnerName = winningPlayer === 'player1' ? '1P' : '2P';
    title = `🏆 ${winnerName} 플레이어 승리!`;
    subtitle = rule === 'normal'
      ? `${winnerName}가 마지막 돌을 가져갔습니다.`
      : `상대에게 마지막 돌을 넘겨 ${winnerName}가 승리했습니다.`;
  }

  return { winner: winningPlayer, title, subtitle };
}
