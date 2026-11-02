import React from 'react';
import { NimAnalysis, RuleType } from '../types/nim';
import { Binary, Sparkles, AlertCircle, CheckCircle2, ChevronRight, HelpCircle } from 'lucide-react';

interface NimSumVisualizerProps {
  analysis: NimAnalysis;
  rule: RuleType;
  onApplyOptimalMove?: (pileIndex: number, count: number) => void;
  canApply: boolean;
}

export const NimSumVisualizer: React.FC<NimSumVisualizerProps> = ({
  analysis,
  rule,
  onApplyOptimalMove,
  canApply
}) => {
  const { nimSum, isWinningPosition, binaryPiles, nimSumBits, optimalMove } = analysis;

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Binary className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              실시간 님-합(Nim-Sum) 분석기
            </h3>
            <span className="text-xs text-slate-400">
              찰스 부통의 정리(1901) · 2진법 비트별 배타적 논리합(XOR)
            </span>
          </div>
        </div>

        {/* Position badge */}
        <div className="flex items-center gap-2">
          {isWinningPosition ? (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>N-포지션 (필승 상태)</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>P-포지션 (불리한 상태)</span>
            </div>
          )}
        </div>
      </div>

      {/* Bit Matrix Table */}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-xs font-mono">
          <thead>
            <tr className="text-slate-400 border-b border-slate-800/80">
              <th className="py-2 text-left font-sans font-medium text-slate-400">더미</th>
              <th className="py-2 text-right font-sans font-medium text-slate-400">돌 개수</th>
              <th className="py-2 text-center tracking-widest font-sans font-medium text-slate-400">
                2진수 비트 (각 자릿수)
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40">
            {binaryPiles.map((pile) => (
              <tr key={pile.pileIndex} className="hover:bg-slate-800/20 transition-colors">
                <td className="py-2.5 text-slate-300 font-sans font-medium">
                  더미 #{pile.pileIndex + 1}
                </td>
                <td className="py-2.5 text-right font-bold text-slate-200 tabular-nums">
                  {pile.count}
                </td>
                <td className="py-2.5 text-center">
                  <div className="inline-flex items-center gap-1.5 tracking-widest">
                    {pile.bits.map((bit, bitIdx) => (
                      <span
                        key={bitIdx}
                        className={`w-5 h-5 rounded flex items-center justify-center font-bold tabular-nums text-xs transition-colors ${
                          bit === 1
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-slate-800/40 text-slate-500'
                        }`}
                      >
                        {bit}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}

            {/* Nim-Sum Result Row */}
            <tr className="bg-amber-500/5 font-bold border-t-2 border-slate-700">
              <td className="py-3 text-amber-300 font-sans font-semibold">
                님-합 (XOR 합)
              </td>
              <td className="py-3 text-right text-amber-300 text-sm tabular-nums">
                {nimSum}
              </td>
              <td className="py-3 text-center">
                <div className="inline-flex items-center gap-1.5 tracking-widest">
                  {nimSumBits.map((bit, bitIdx) => (
                    <span
                      key={bitIdx}
                      className={`w-5 h-5 rounded flex items-center justify-center font-bold tabular-nums text-xs ${
                        bit === 1
                          ? 'bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/40'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {bit}
                    </span>
                  ))}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Explanation & Optimal Move Advice */}
      <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-3">
        {optimalMove ? (
          <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-3.5">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-xs font-bold text-amber-200">
                    수학적 최적의 수 (필승 착수)
                  </span>
                </div>
                <p className="text-xs text-amber-100/90 leading-relaxed font-sans">
                  {optimalMove.reasoning}
                </p>
                <div className="text-xs text-amber-300 font-mono mt-1">
                  추천: {optimalMove.pileIndex + 1}번 더미에서{' '}
                  <strong className="underline text-white font-bold">
                    {optimalMove.countToTake}개
                  </strong>
                  를 가져오면 상대방에게 님-합 0을 넘기게 됩니다.
                </div>
              </div>

              {canApply && onApplyOptimalMove && (
                <button
                  type="button"
                  onClick={() =>
                    onApplyOptimalMove(optimalMove.pileIndex, optimalMove.countToTake)
                  }
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shrink-0 transition-colors flex items-center gap-1 shadow-sm shadow-amber-500/30"
                >
                  <span>이 수 적용</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="rounded-xl bg-slate-800/40 border border-slate-800 p-3.5 text-xs text-slate-300 space-y-1">
            <div className="flex items-center gap-2 text-rose-300 font-semibold">
              <AlertCircle className="w-4 h-4" />
              <span>현재 님-합이 0인 패배 포지션(P-Position)입니다.</span>
            </div>
            <p className="text-slate-400 leading-relaxed font-sans">
              모든 2진 자릿수의 1의 개수가 짝수입니다. 어떤 돌을 가져가더라도 님-합이 0이 아닌 상태로 바뀌어 상대방에게 필승의 기회를 주게 됩니다. 상대방이 실수를 하기를 유도해야 합니다!
            </p>
          </div>
        )}

        {/* Quick math tip */}
        <div className="flex items-center gap-2 text-[11px] text-slate-400 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/60">
          <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>
            {rule === 'normal'
              ? '일반 규칙: 상대에게 항상 님-합 = 0을 넘기는 자가 결국 마지막 돌을 가져가 승리합니다.'
              : '마이제르 규칙: 1보다 큰 더미가 1개만 남았을 때, 1개짜리 더미가 홀수 개 남도록 변환하는 것이 승리의 열쇠입니다.'}
          </span>
        </div>
      </div>
    </div>
  );
};
