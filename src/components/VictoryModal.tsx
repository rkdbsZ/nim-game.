import React from 'react';
import { Trophy, RotateCcw, Award, CheckCircle } from 'lucide-react';
import { RuleType } from '../types/nim';

interface VictoryModalProps {
  winnerInfo: {
    winner: 'player1' | 'player2' | 'ai';
    title: string;
    subtitle: string;
  };
  rule: RuleType;
  moveCount: number;
  onPlayAgain: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  winnerInfo,
  rule,
  moveCount,
  onPlayAgain,
}) => {
  const isPlayerWin = winnerInfo.winner === 'player1';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-center space-y-6">
        {/* Trophy / Result Icon */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-[0_0_24px_rgba(245,158,11,0.3)]">
          {isPlayerWin ? (
            <Trophy className="w-8 h-8 text-amber-400" />
          ) : (
            <Award className="w-8 h-8 text-slate-300" />
          )}
        </div>

        {/* Title & Subtitle */}
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight">
            {winnerInfo.title}
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            {winnerInfo.subtitle}
          </p>
        </div>

        {/* Stats card */}
        <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-950/70 rounded-2xl border border-slate-800 text-left">
          <div className="space-y-0.5">
            <span className="text-[11px] text-slate-400">총 턴 수</span>
            <div className="text-base font-bold text-slate-200 tabular-nums font-mono">
              {moveCount}회 착수
            </div>
          </div>
          <div className="space-y-0.5">
            <span className="text-[11px] text-slate-400">적용 규칙</span>
            <div className="text-xs font-semibold text-amber-300">
              {rule === 'normal' ? '일반 (마지막=승)' : '마이제르 (마지막=패)'}
            </div>
          </div>
        </div>

        {/* Play Again Primary Button */}
        <button
          type="button"
          onClick={onPlayAgain}
          className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 active:scale-95 cursor-pointer whitespace-nowrap"
        >
          <RotateCcw className="w-4 h-4" />
          <span>한 판 더 플레이하기</span>
        </button>
      </div>
    </div>
  );
};
