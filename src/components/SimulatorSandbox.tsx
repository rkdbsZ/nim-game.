import React, { useState } from 'react';
import { Plus, Trash2, RotateCcw, Sparkles, Binary, ArrowRight } from 'lucide-react';
import { analyzeNimState } from '../utils/nimLogic';
import { RuleType } from '../types/nim';

export const SimulatorSandbox: React.FC = () => {
  const [sandboxPiles, setSandboxPiles] = useState<number[]>([1, 3, 5, 7]);
  const [rule, setRule] = useState<RuleType>('normal');

  const analysis = analyzeNimState(sandboxPiles, rule);

  const handleAddPile = () => {
    if (sandboxPiles.length < 8) {
      setSandboxPiles([...sandboxPiles, 4]);
    }
  };

  const handleRemovePile = (index: number) => {
    if (sandboxPiles.length > 1) {
      setSandboxPiles(sandboxPiles.filter((_, i) => i !== index));
    }
  };

  const handleUpdateCount = (index: number, val: number) => {
    const updated = [...sandboxPiles];
    updated[index] = Math.max(0, Math.min(val, 20));
    setSandboxPiles(updated);
  };

  const handleApplyOptimal = () => {
    if (analysis.optimalMove) {
      const updated = [...sandboxPiles];
      updated[analysis.optimalMove.pileIndex] = analysis.optimalMove.targetCount;
      setSandboxPiles(updated);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-2">
      {/* Sandbox Header */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <Binary className="w-5 h-5 text-amber-400" />
              <span>수학적 님-합(Nim-Sum) 실험실 & 시뮬레이터</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              원하는 대로 더미를 추가·수정하며 2진수 비트 연산과 P/N 포지션 변화를 실험해보세요.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSandboxPiles([3, 4, 5])}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              3-4-5 초기화
            </button>
            <button
              type="button"
              onClick={handleAddPile}
              disabled={sandboxPiles.length >= 8}
              className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>더미 추가</span>
            </button>
          </div>
        </div>

        {/* Piles Customizer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 py-5">
          {sandboxPiles.map((count, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2.5 relative group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">
                  더미 #{idx + 1}
                </span>
                {sandboxPiles.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemovePile(idx)}
                    aria-label={`더미 ${idx + 1} 삭제`}
                    className="text-slate-500 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-2xl font-bold font-mono text-slate-100 tabular-nums">
                  {count}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-amber-300 font-mono">
                  2진수: {count.toString(2).padStart(4, '0')}
                </span>
              </div>

              <input
                type="range"
                min="0"
                max="15"
                value={count}
                onChange={(e) => handleUpdateCount(idx, parseInt(e.target.value, 10))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
          ))}
        </div>

        {/* Live XOR Matrix */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">
              비트별 배타적 논리합(XOR) 결과
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">님-합 (Nim-Sum):</span>
              <span className="text-base font-bold font-mono text-amber-400 tabular-nums">
                {analysis.nimSum}
              </span>
              <span className="text-xs font-mono text-slate-400">
                ({analysis.nimSumBinary})
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-left">
                  <th className="py-1.5">더미</th>
                  <th className="py-1.5 text-right">돌 개수</th>
                  <th className="py-1.5 text-center">8 (2³)</th>
                  <th className="py-1.5 text-center">4 (2²)</th>
                  <th className="py-1.5 text-center">2 (2¹)</th>
                  <th className="py-1.5 text-center">1 (2⁰)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {sandboxPiles.map((count, idx) => {
                  const bStr = count.toString(2).padStart(4, '0');
                  return (
                    <tr key={idx}>
                      <td className="py-1.5 text-slate-300">더미 #{idx + 1}</td>
                      <td className="py-1.5 text-right font-bold text-slate-200 tabular-nums">
                        {count}
                      </td>
                      {bStr.split('').map((bit, bitIdx) => (
                        <td key={bitIdx} className="py-1.5 text-center">
                          <span
                            className={`inline-block w-5 h-5 leading-5 rounded text-center text-xs font-bold ${
                              bit === '1'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : 'bg-slate-900 text-slate-600'
                            }`}
                          >
                            {bit}
                          </span>
                        </td>
                      ))}
                    </tr>
                  );
                })}
                <tr className="border-t-2 border-slate-700 font-bold bg-amber-500/10">
                  <td className="py-2 text-amber-300 font-semibold">XOR 합</td>
                  <td className="py-2 text-right text-amber-300 text-sm tabular-nums">
                    {analysis.nimSum}
                  </td>
                  {analysis.nimSumBinary.padStart(4, '0').slice(-4).split('').map((bit, bitIdx) => (
                    <td key={bitIdx} className="py-2 text-center">
                      <span
                        className={`inline-block w-5 h-5 leading-5 rounded text-center text-xs font-bold ${
                          bit === '1'
                            ? 'bg-amber-500 text-slate-950'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {bit}
                      </span>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Optimal Move Preview */}
          <div className="pt-2">
            {analysis.optimalMove ? (
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-amber-200">
                      추천 필승 수 (Optimal Move)
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    {analysis.optimalMove.pileIndex + 1}번 더미에서 돌{' '}
                    <strong className="text-white underline font-bold">
                      {analysis.optimalMove.countToTake}개
                    </strong>
                    를 가져와 {analysis.optimalMove.targetCount}개로 만듭니다.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleApplyOptimal}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shrink-0 flex items-center gap-1 transition-colors"
                >
                  <span>수 적용해보기</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
                현재 님-합이 0이므로 P-포지션(패배 상태)입니다. 어떤 수를 두어도 님-합이 0이 아닌 상태로 바뀝니다.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
