import React from 'react';
import { motion } from 'motion/react';
import { PieceTheme, RuleType } from '../types/nim';
import { Minus, Plus, Check, ArrowRight } from 'lucide-react';

interface GameBoardProps {
  piles: number[];
  selectedPile: number | null;
  selectedCount: number;
  onSelectPile: (pileIndex: number, count: number) => void;
  onConfirmMove: () => void;
  isMyTurn: boolean;
  isAIPondering: boolean;
  maxTakePerTurn?: number;
  theme: PieceTheme;
  showBinaryInBoard: boolean;
  rule: RuleType;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  piles,
  selectedPile,
  selectedCount,
  onSelectPile,
  onConfirmMove,
  isMyTurn,
  isAIPondering,
  maxTakePerTurn,
  theme,
  showBinaryInBoard,
  rule,
}) => {
  const [hoveredCandidate, setHoveredCandidate] = React.useState<{
    pileIndex: number;
    count: number;
  } | null>(null);

  const maxPossibleInPile = (pileIndex: number) => {
    const total = piles[pileIndex];
    return maxTakePerTurn ? Math.min(total, maxTakePerTurn) : total;
  };

  // Render piece based on theme
  const renderPiece = (
    pileIndex: number,
    pieceIndex: number,
    isSelected: boolean,
    isHoveredCandidate: boolean
  ) => {
    const isInteractive = isMyTurn && !isAIPondering && piles[pileIndex] > 0;
    const countToTake = piles[pileIndex] - pieceIndex;
    const allowedTake = maxTakePerTurn ? Math.min(countToTake, maxTakePerTurn) : countToTake;

    const handleMouseEnter = () => {
      if (isInteractive) {
        setHoveredCandidate({ pileIndex, count: allowedTake });
      }
    };

    const handleMouseLeave = () => {
      setHoveredCandidate(null);
    };

    switch (theme) {
      case 'matches':
        return (
          <motion.div
            key={pieceIndex}
            whileHover={isInteractive ? { scale: 1.08, y: -4 } : {}}
            whileTap={isInteractive ? { scale: 0.95 } : {}}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={() => {
              if (!isInteractive) return;
              onSelectPile(pileIndex, allowedTake);
            }}
            className={`relative flex flex-col items-center justify-end w-4 sm:w-5 h-20 sm:h-24 cursor-pointer select-none transition-all duration-150 ${
              isSelected
                ? 'opacity-100 scale-105'
                : isHoveredCandidate
                ? 'opacity-100 scale-105 filter drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                : 'opacity-100'
            }`}
          >
            {/* Match Head */}
            <div
              className={`w-3.5 sm:w-4 h-4 sm:h-5 rounded-t-full transition-all duration-200 ${
                isSelected || isHoveredCandidate
                  ? 'bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.9)]'
                  : 'bg-rose-600 shadow-sm'
              }`}
            />
            {/* Match Stick */}
            <div
              className={`w-2 sm:w-2.5 h-16 sm:h-19 rounded-b-sm border-t-0 border transition-all duration-200 ${
                isSelected || isHoveredCandidate
                  ? 'bg-amber-200 border-amber-300 shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                  : 'bg-amber-100/90 border-amber-300/60 dark:bg-amber-200/80 dark:border-amber-400/40'
              }`}
            />
          </motion.div>
        );

      case 'gems':
        return (
          <motion.div
            key={pieceIndex}
            whileHover={isInteractive ? { scale: 1.15, rotate: 6 } : {}}
            whileTap={isInteractive ? { scale: 0.9 } : {}}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={() => {
              if (!isInteractive) return;
              onSelectPile(pileIndex, allowedTake);
            }}
            className={`w-9 h-9 sm:w-11 sm:h-11 rounded-lg flex items-center justify-center cursor-pointer transform rotate-45 transition-all duration-200 ${
              isSelected
                ? 'bg-gradient-to-tr from-amber-500 via-amber-300 to-yellow-100 shadow-[0_0_16px_rgba(245,158,11,0.8)] scale-110 z-10'
                : isHoveredCandidate
                ? 'bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.6)] scale-105 z-10'
                : 'bg-gradient-to-tr from-cyan-600 via-teal-400 to-emerald-200 shadow-md hover:brightness-110'
            }`}
          >
            <div className="w-4 h-4 rounded-sm bg-white/40 transform -rotate-45" />
          </motion.div>
        );

      case 'coins':
        return (
          <motion.div
            key={pieceIndex}
            whileHover={isInteractive ? { scale: 1.12, y: -3 } : {}}
            whileTap={isInteractive ? { scale: 0.92 } : {}}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={() => {
              if (!isInteractive) return;
              onSelectPile(pileIndex, allowedTake);
            }}
            className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 border ${
              isSelected
                ? 'bg-gradient-to-b from-amber-200 to-amber-500 border-yellow-200 shadow-[0_0_16px_rgba(251,191,36,0.8)] scale-110 z-10'
                : isHoveredCandidate
                ? 'bg-gradient-to-b from-amber-300 to-amber-600 border-yellow-300 shadow-[0_0_12px_rgba(251,191,36,0.6)] scale-105 z-10'
                : 'bg-gradient-to-b from-yellow-500 to-amber-700 border-yellow-600/60 shadow-md hover:brightness-110'
            }`}
          >
            <div className="w-5 h-5 rounded-full border border-amber-900/30 flex items-center justify-center text-[10px] font-bold text-amber-950">
              壱
            </div>
          </motion.div>
        );

      case 'pebbles':
      default:
        return (
          <motion.div
            key={pieceIndex}
            whileHover={isInteractive ? { scale: 1.12, y: -3 } : {}}
            whileTap={isInteractive ? { scale: 0.92 } : {}}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={() => {
              if (!isInteractive) return;
              onSelectPile(pileIndex, allowedTake);
            }}
            className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 relative ${
              isSelected
                ? 'bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 stone-selected-shadow scale-110 z-10 ring-2 ring-amber-300'
                : isHoveredCandidate
                ? 'bg-gradient-to-br from-amber-200 via-amber-300 to-amber-500 stone-selected-shadow scale-105 z-10 ring-2 ring-amber-400/80'
                : 'bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400 dark:from-slate-700 dark:via-slate-800 dark:to-slate-900 stone-shadow hover:scale-105'
            }`}
          >
            {/* Subtle 3D stone sheen */}
            <div className="absolute top-1.5 left-2 w-3.5 h-2 rounded-full bg-white/40 blur-[0.5px]" />
            <span
              className={`text-xs font-semibold tabular-nums select-none ${
                isSelected || isHoveredCandidate
                  ? 'text-amber-950 font-bold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {pieceIndex + 1}
            </span>
          </motion.div>
        );
    }
  };

  return (
    <div className="relative w-full rounded-2xl bg-slate-900/90 border border-slate-800/80 p-5 sm:p-7 backdrop-blur-md overflow-hidden">
      {/* Table Background Glow / Grain */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/5 via-transparent to-transparent pointer-events-none" />

      {/* Header status bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-200 tracking-wide">
              게임 테이블
            </span>
            <span className="text-xs text-slate-400">
              · {piles.length}개 더미
            </span>
            <span className="text-xs text-slate-400">
              · 총 {piles.reduce((a, b) => a + b, 0)}개 돌
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {maxTakePerTurn && (
            <span className="text-xs px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300 font-mono">
              1회당 최대 {maxTakePerTurn}개 제한
            </span>
          )}
          <span className="text-xs px-2.5 py-1 rounded bg-slate-800 text-slate-300 font-medium">
            {rule === 'normal' ? '일반 룰 (마지막 돌 획득 = 승리)' : '마이제르 룰 (마지막 돌 획득 = 패배)'}
          </span>
        </div>
      </div>

      {/* Piles Container */}
      <div className="py-6 space-y-6">
        {piles.map((count, pileIndex) => {
          const isThisPileSelected = selectedPile === pileIndex;
          const maxTake = maxPossibleInPile(pileIndex);

          return (
            <div
              key={pileIndex}
              className={`p-4 rounded-xl border transition-all duration-200 ${
                isThisPileSelected
                  ? 'bg-amber-950/20 border-amber-500/40 shadow-[0_0_24px_rgba(245,158,11,0.1)]'
                  : 'bg-slate-950/40 border-slate-800/60 hover:border-slate-700/80'
              }`}
            >
              {/* Pile Header */}
              <div className="flex items-center justify-between gap-4 mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-md bg-slate-800 text-slate-300 text-xs font-mono font-bold flex items-center justify-center">
                    {pileIndex + 1}
                  </span>
                  <span className="text-sm font-medium text-slate-200">
                    {pileIndex + 1}번 더미
                  </span>
                  <span className="text-xs text-slate-400 tabular-nums font-mono">
                    ({count}개)
                  </span>

                  {showBinaryInBoard && (
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-800/80 text-amber-300 font-mono tracking-wider">
                      2진수: {count.toString(2).padStart(3, '0')}
                    </span>
                  )}
                </div>

                {/* Direct quick action buttons for this pile */}
                {isMyTurn && !isAIPondering && count > 0 && (
                  <div className="flex items-center gap-1.5">
                    {/* Stepper buttons */}
                    <div className="flex items-center bg-slate-800/90 rounded-lg p-0.5 border border-slate-700/60">
                      <button
                        type="button"
                        aria-label="가져갈 돌 줄이기"
                        disabled={!isThisPileSelected || selectedCount <= 1}
                        onClick={() => {
                          if (isThisPileSelected && selectedCount > 1) {
                            onSelectPile(pileIndex, selectedCount - 1);
                          }
                        }}
                        className="w-7 h-7 flex items-center justify-center rounded text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>

                      <span className="w-8 text-center text-xs font-mono font-bold tabular-nums text-amber-300">
                        {isThisPileSelected ? selectedCount : 0}
                      </span>

                      <button
                        type="button"
                        aria-label="가져갈 돌 늘리기"
                        disabled={isThisPileSelected && selectedCount >= maxTake}
                        onClick={() => {
                          if (!isThisPileSelected) {
                            onSelectPile(pileIndex, 1);
                          } else if (selectedCount < maxTake) {
                            onSelectPile(pileIndex, selectedCount + 1);
                          }
                        }}
                        className="w-7 h-7 flex items-center justify-center rounded text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Quick select: All or 1 */}
                    <button
                      type="button"
                      onClick={() => onSelectPile(pileIndex, maxTake)}
                      className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-all ${
                        isThisPileSelected && selectedCount === maxTake
                          ? 'bg-amber-500/20 border-amber-500/50 text-amber-200'
                          : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      {maxTakePerTurn ? `최대 (${maxTake}개)` : '모두 선택'}
                    </button>
                  </div>
                )}
              </div>

              {/* Pieces Row */}
              <div className="min-h-[52px] flex flex-wrap items-center gap-2.5 sm:gap-3 py-1">
                {count === 0 ? (
                  <span className="text-xs text-slate-500 italic py-2">
                    돌이 모두 소진되었습니다.
                  </span>
                ) : (
                  Array.from({ length: count }).map((_, pieceIndex) => {
                    const isSelected =
                      isThisPileSelected && pieceIndex >= count - selectedCount;
                    const isHovered =
                      !isThisPileSelected &&
                      hoveredCandidate?.pileIndex === pileIndex &&
                      pieceIndex >= count - hoveredCandidate.count;
                    return renderPiece(pileIndex, pieceIndex, isSelected, isHovered);
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Turn Action Bar & Instructions */}
      <div className="mt-4 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-slate-300">
          {isAIPondering ? (
            <div className="flex items-center gap-2 text-amber-300">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>AI가 님-합(XOR)을 계산하며 최선의 수를 생각 중입니다...</span>
            </div>
          ) : isMyTurn ? (
            selectedPile !== null && selectedCount > 0 ? (
              <span className="text-amber-300 font-medium">
                {selectedPile + 1}번 더미에서 돌 <strong className="font-bold underline">{selectedCount}개</strong>를 가져옵니다.
              </span>
            ) : (
              <span className="text-slate-400">
                원하는 더미의 돌을 클릭하거나 +/- 버튼으로 가져갈 개수를 선택하세요.
              </span>
            )
          ) : (
            <span className="text-slate-400">상대방의 턴을 기다리는 중입니다.</span>
          )}
        </div>

        {/* Action Confirm Button */}
        <button
          type="button"
          disabled={!isMyTurn || isAIPondering || selectedPile === null || selectedCount === 0}
          onClick={onConfirmMove}
          className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center gap-2 shrink-0 ${
            selectedPile !== null && selectedCount > 0 && isMyTurn && !isAIPondering
              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/25 active:scale-95 cursor-pointer'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-60'
          }`}
        >
          <span>돌 가져가기</span>
          <Check className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
