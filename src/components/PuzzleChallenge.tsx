import React, { useState } from 'react';
import { NIM_PUZZLES } from '../utils/nimLogic';
import { NimPuzzle, PieceTheme } from '../types/nim';
import { GameBoard } from './GameBoard';
import { playPickSound, playTakeSound, playWinSound, playLoseSound } from '../utils/audio';
import { Sparkles, HelpCircle, CheckCircle2, XCircle, ArrowRight, RotateCcw, Brain, Lightbulb } from 'lucide-react';

interface PuzzleChallengeProps {
  theme: PieceTheme;
}

export const PuzzleChallenge: React.FC<PuzzleChallengeProps> = ({ theme }) => {
  const [selectedPuzzleIdx, setSelectedPuzzleIdx] = useState(0);
  const currentPuzzle: NimPuzzle = NIM_PUZZLES[selectedPuzzleIdx];

  // User's move choice state on the puzzle board
  const [puzzlePiles, setPuzzlePiles] = useState<number[]>([...currentPuzzle.piles]);
  const [selectedPile, setSelectedPile] = useState<number | null>(null);
  const [selectedCount, setSelectedCount] = useState<number>(0);
  const [showHint, setShowHint] = useState(false);
  const [resultState, setResultState] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');

  const handleSelectPuzzle = (idx: number) => {
    setSelectedPuzzleIdx(idx);
    const puzzle = NIM_PUZZLES[idx];
    setPuzzlePiles([...puzzle.piles]);
    setSelectedPile(null);
    setSelectedCount(0);
    setShowHint(false);
    setResultState('idle');
    setFeedbackMessage('');
  };

  const handleResetPuzzle = () => {
    setPuzzlePiles([...currentPuzzle.piles]);
    setSelectedPile(null);
    setSelectedCount(0);
    setResultState('idle');
    setFeedbackMessage('');
  };

  const handleSelectPile = (pileIndex: number, count: number) => {
    if (resultState === 'correct') return;
    setSelectedPile(pileIndex);
    setSelectedCount(count);
    playPickSound();
  };

  const handleCheckAnswer = () => {
    if (selectedPile === null || selectedCount <= 0) return;

    // Simulate move
    const testPiles = [...puzzlePiles];
    testPiles[selectedPile] -= selectedCount;

    // Calculate resulting nim-sum
    const resultingNimSum = testPiles.reduce((acc, c) => acc ^ c, 0);

    let isSuccess = false;

    if (currentPuzzle.rule === 'normal') {
      // Normal rule: winning move achieves nim-sum = 0
      isSuccess = resultingNimSum === 0;
    } else {
      // Misere rule:
      const largePiles = testPiles.filter(c => c > 1).length;
      if (largePiles === 0) {
        // all remaining piles have size <= 1, count of 1s must be odd
        const ones = testPiles.filter(c => c === 1).length;
        isSuccess = ones % 2 === 1;
      } else {
        isSuccess = resultingNimSum === 0;
      }
    }

    if (isSuccess) {
      setResultState('correct');
      setFeedbackMessage('🎉 정답입니다! 완벽한 수학적 필승 수를 두셨습니다.');
      playWinSound();
    } else {
      setResultState('incorrect');
      setFeedbackMessage(
        `아쉽습니다! 선택한 착수 후 남은 님-합(XOR)은 ${resultingNimSum}입니다. 상대에게 필승의 기회를 넘기게 됩니다. 다시 시도해보세요!`
      );
      playLoseSound();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-2">
      {/* Header */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100">
                수학 퍼즐 챌린지 (One-Move Puzzle)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                실제 경기 중 마주치는 핵심 포지션에서 단 한 수로 승기를 잡는 필승 착수를 찾아보세요.
              </p>
            </div>
          </div>
        </div>

        {/* Puzzle Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4">
          {NIM_PUZZLES.map((puzzle, idx) => {
            const isCurrent = idx === selectedPuzzleIdx;
            return (
              <button
                key={puzzle.id}
                type="button"
                onClick={() => handleSelectPuzzle(idx)}
                className={`p-3 rounded-xl text-left border transition-all ${
                  isCurrent
                    ? 'bg-amber-500/15 border-amber-500/50 text-amber-200 shadow-sm'
                    : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-mono text-slate-400">
                    Q{idx + 1}
                  </span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                      puzzle.difficulty === 'easy'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : puzzle.difficulty === 'medium'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}
                  >
                    {puzzle.difficulty === 'easy' ? '초급' : puzzle.difficulty === 'medium' ? '중급' : '고급'}
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-200 truncate">
                  {puzzle.title.split(':')[1] || puzzle.title}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Current Puzzle Card */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 space-y-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-bold text-amber-400">
              {currentPuzzle.title}
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
              {currentPuzzle.rule === 'normal' ? '일반 규칙' : '마이제르 규칙'}
            </span>
          </div>
          <p className="text-sm text-slate-200 leading-relaxed">
            {currentPuzzle.description}
          </p>
        </div>

        {/* Puzzle GameBoard */}
        <div className="rounded-xl overflow-hidden border border-slate-800">
          <GameBoard
            piles={puzzlePiles}
            selectedPile={selectedPile}
            selectedCount={selectedCount}
            onSelectPile={handleSelectPile}
            onConfirmMove={handleCheckAnswer}
            isMyTurn={resultState !== 'correct'}
            isAIPondering={false}
            maxTakePerTurn={currentPuzzle.maxTakePerTurn}
            theme={theme}
            showBinaryInBoard={true}
            rule={currentPuzzle.rule}
          />
        </div>

        {/* Actions & Result Notification */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowHint(!showHint)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span>{showHint ? '힌트 숨기기' : '힌트 보기'}</span>
            </button>

            <button
              type="button"
              onClick={handleResetPuzzle}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>다시 시도</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={selectedPile === null || selectedCount <= 0 || resultState === 'correct'}
              onClick={handleCheckAnswer}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 text-xs font-bold transition-all shadow-sm shadow-amber-500/20 flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>정답 확인하기</span>
            </button>

            {resultState === 'correct' && selectedPuzzleIdx < NIM_PUZZLES.length - 1 && (
              <button
                type="button"
                onClick={() => handleSelectPuzzle(selectedPuzzleIdx + 1)}
                className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
              >
                <span>다음 퍼즐 풀기</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Hint Box */}
        {showHint && (
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200/90 leading-relaxed space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-amber-300">
              <Lightbulb className="w-4 h-4" />
              <span>수학적 힌트</span>
            </div>
            <p>{currentPuzzle.hint}</p>
          </div>
        )}

        {/* Feedback Alert */}
        {resultState !== 'idle' && (
          <div
            className={`p-4 rounded-xl border leading-relaxed text-xs space-y-2 ${
              resultState === 'correct'
                ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                : 'bg-rose-950/30 border-rose-500/40 text-rose-200'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-sm">
              {resultState === 'correct' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-400" />
              )}
              <span>{feedbackMessage}</span>
            </div>

            {resultState === 'correct' && (
              <p className="text-slate-300 text-xs pt-1 border-t border-emerald-500/20 font-sans">
                <strong>정답 해설:</strong> {currentPuzzle.solutionExplanation}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
