import React, { useState } from 'react';
import { BookOpen, Check, Calculator, Brain, Lightbulb, Sparkles } from 'lucide-react';

export const StrategyGuide: React.FC = () => {
  const [interactivePiles, setInteractivePiles] = useState<number[]>([3, 4, 5]);

  const calculateSampleNimSum = () => {
    return interactivePiles.reduce((acc, curr) => acc ^ curr, 0);
  };

  const sampleNimSum = calculateSampleNimSum();

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-2">
      {/* Intro Hero Box */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/30 border border-slate-800 p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-100">
              님 게임(Nim Game)과 수학적 필승 전략의 모든 것
            </h2>
            <p className="text-sm text-slate-400">
              1901년 하버드 수학자 찰스 부통이 증명한 2진법 XOR 연산의 마법
            </p>
          </div>
        </div>

        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          <strong>님 게임(Nim Game)</strong>은 두 명의 플레이어가 여러 개의 물건(돌, 성냥개비 등) 더미에서 번갈아 가며 
          돌을 가져가는 대표적인 <strong>조합 게임(Combinatorial Game)</strong>입니다. 
          규칙은 매우 단순하지만, <strong>수학적으로 선공 또는 후공의 100% 필승법이 완전히 규명된 게임</strong>으로, 
          tvN 예능 『더 지니어스』 등 각종 두뇌 서바이벌과 수학 올림피아드에 단골로 등장합니다.
        </p>
      </div>

      {/* Rules Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-5 space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <span className="w-6 h-6 rounded-md bg-amber-500/10 flex items-center justify-center text-xs">1</span>
            <span>기본 규칙 (Rules)</span>
          </div>
          <ul className="text-xs text-slate-300 space-y-2 leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="text-amber-400 font-bold">·</span>
              <span>두 플레이어가 번갈아가며 자신의 턴을 진행합니다.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400 font-bold">·</span>
              <span>자신의 차례에는 <strong>오직 하나의 더미만 선택</strong>할 수 있습니다.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400 font-bold">·</span>
              <span>선택한 더미에서 <strong>최소 1개부터 최대 그 더미의 모든 돌</strong>까지 자유롭게 가져옵니다.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400 font-bold">·</span>
              <span>두 개 이상의 더미에서 동시에 돌을 가져올 수는 없습니다.</span>
            </li>
          </ul>
        </div>

        <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-5 space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <span className="w-6 h-6 rounded-md bg-amber-500/10 flex items-center justify-center text-xs">2</span>
            <span>승리 조건 (Normal vs Misère)</span>
          </div>
          <div className="space-y-2.5 text-xs text-slate-300">
            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
              <strong className="text-emerald-400 block mb-1">일반 규칙 (Normal Play)</strong>
              마지막 남은 돌을 가져가는 플레이어가 <strong>승리</strong>합니다. 수학적으로 가장 자연스러운 기본 규칙입니다.
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
              <strong className="text-amber-400 block mb-1">마이제르 규칙 (Misère Play / 역 규칙)</strong>
              마지막 남은 돌을 가져가는 플레이어가 <strong>패배</strong>합니다. 예능 『더 지니어스』에서 채택되어 긴장감을 극대화한 방식입니다.
            </div>
          </div>
        </div>
      </div>

      {/* Core Math: Bouton's Theorem and Nim-Sum */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-5">
        <div className="flex items-center gap-2.5 text-slate-100 font-bold text-lg">
          <Calculator className="w-5 h-5 text-amber-400" />
          <span>부통의 정리 (Bouton's Theorem) & 님-합(Nim-Sum)</span>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          1901년 하버드 대학교 수학 교수 찰스 부통(Charles L. Bouton)은 님 게임의 모든 상태를 
          <strong>2진법 비트 단위의 배타적 논리합(XOR, Exclusive OR)</strong>으로 완벽히 분석했습니다. 
          이를 <strong>님-합(Nim-Sum, 기호 ⊕)</strong>이라고 부릅니다.
        </p>

        {/* 1-2-3-4-5 Pyramid Calculation Table */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
          <div className="text-xs font-semibold text-slate-300 mb-3 flex items-center justify-between">
            <span>[한국 교과서/퍼즐북 단골] 1부터 5까지 5단 피라미드 (1 - 2 - 3 - 4 - 5)</span>
            <span className="text-amber-400 font-mono">1 ⊕ 2 ⊕ 3 ⊕ 4 ⊕ 5 = 1 ≠ 0</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-left">
                  <th className="py-2">더미</th>
                  <th className="py-2">돌 개수 (10진수)</th>
                  <th className="py-2 text-center">4의 자리 (2²)</th>
                  <th className="py-2 text-center">2의 자리 (2¹)</th>
                  <th className="py-2 text-center">1의 자리 (2⁰)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                <tr>
                  <td className="py-2 text-slate-300">1번 줄</td>
                  <td className="py-2 font-bold text-slate-200">1</td>
                  <td className="py-2 text-center text-slate-500">0</td>
                  <td className="py-2 text-center text-slate-500">0</td>
                  <td className="py-2 text-center text-amber-300 font-bold">1</td>
                </tr>
                <tr>
                  <td className="py-2 text-slate-300">2번 줄</td>
                  <td className="py-2 font-bold text-slate-200">2</td>
                  <td className="py-2 text-center text-slate-500">0</td>
                  <td className="py-2 text-center text-amber-300 font-bold">1</td>
                  <td className="py-2 text-center text-slate-500">0</td>
                </tr>
                <tr>
                  <td className="py-2 text-slate-300">3번 줄</td>
                  <td className="py-2 font-bold text-slate-200">3</td>
                  <td className="py-2 text-center text-slate-500">0</td>
                  <td className="py-2 text-center text-amber-300 font-bold">1</td>
                  <td className="py-2 text-center text-amber-300 font-bold">1</td>
                </tr>
                <tr>
                  <td className="py-2 text-slate-300">4번 줄</td>
                  <td className="py-2 font-bold text-slate-200">4</td>
                  <td className="py-2 text-center text-amber-300 font-bold">1</td>
                  <td className="py-2 text-center text-slate-500">0</td>
                  <td className="py-2 text-center text-slate-500">0</td>
                </tr>
                <tr>
                  <td className="py-2 text-slate-300">5번 줄</td>
                  <td className="py-2 font-bold text-slate-200">5</td>
                  <td className="py-2 text-center text-amber-300 font-bold">1</td>
                  <td className="py-2 text-center text-slate-500">0</td>
                  <td className="py-2 text-center text-amber-300 font-bold">1</td>
                </tr>
                <tr className="bg-amber-500/10 font-bold border-t-2 border-amber-500/30">
                  <td className="py-2 text-amber-300">님-합 (XOR 합)</td>
                  <td className="py-2 text-amber-300 text-sm">1</td>
                  <td className="py-2 text-center text-slate-400">0 (1이 2개 = 짝수)</td>
                  <td className="py-2 text-center text-slate-400">0 (1이 2개 = 짝수)</td>
                  <td className="py-2 text-center text-amber-400">1 (1이 3개 = 홀수)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-3 text-xs text-slate-300 bg-slate-900/90 p-3 rounded-lg border border-slate-800 leading-relaxed">
            <strong className="text-amber-400">💡 1-2-3-4-5 필승 수:</strong> 님-합이 1이므로 <strong>선공이 100% 필승</strong>입니다! 
            1의 자리를 짝수로 만들기 위해, <strong>1번 줄(1개)을 전부 없애거나</strong>, <strong>3번 줄에서 1개를 빼 2개</strong>로 만들거나, 
            <strong>5번 줄에서 1개를 빼 4개</strong>로 만들면 님-합이 0이 되어 상대방에게 완벽한 패배 국면을 넘깁니다.
          </div>
        </div>

        {/* 3-4-5 Calculation Example Table */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
          <div className="text-xs font-semibold text-slate-300 mb-3 flex items-center justify-between">
            <span>[전통 예시] 3줄 클래식 (3 - 4 - 5)의 님-합 계산</span>
            <span className="text-amber-400 font-mono">3 ⊕ 4 ⊕ 5 = 2 ≠ 0</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-left">
                  <th className="py-2">더미 번호</th>
                  <th className="py-2">돌 개수 (10진수)</th>
                  <th className="py-2 text-center">4의 자리 (2²)</th>
                  <th className="py-2 text-center">2의 자리 (2¹)</th>
                  <th className="py-2 text-center">1의 자리 (2⁰)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                <tr>
                  <td className="py-2 text-slate-300">1번 더미</td>
                  <td className="py-2 font-bold text-slate-200">3</td>
                  <td className="py-2 text-center text-slate-500">0</td>
                  <td className="py-2 text-center text-amber-300 font-bold">1</td>
                  <td className="py-2 text-center text-amber-300 font-bold">1</td>
                </tr>
                <tr>
                  <td className="py-2 text-slate-300">2번 더미</td>
                  <td className="py-2 font-bold text-slate-200">4</td>
                  <td className="py-2 text-center text-amber-300 font-bold">1</td>
                  <td className="py-2 text-center text-slate-500">0</td>
                  <td className="py-2 text-center text-slate-500">0</td>
                </tr>
                <tr>
                  <td className="py-2 text-slate-300">3번 더미</td>
                  <td className="py-2 font-bold text-slate-200">5</td>
                  <td className="py-2 text-center text-amber-300 font-bold">1</td>
                  <td className="py-2 text-center text-slate-500">0</td>
                  <td className="py-2 text-center text-amber-300 font-bold">1</td>
                </tr>
                <tr className="bg-amber-500/10 font-bold border-t-2 border-amber-500/30">
                  <td className="py-2 text-amber-300">님-합 (XOR 합)</td>
                  <td className="py-2 text-amber-300 text-sm">2</td>
                  <td className="py-2 text-center text-slate-400">0 (1이 2개 = 짝수)</td>
                  <td className="py-2 text-center text-amber-400">1 (1이 1개 = 홀수)</td>
                  <td className="py-2 text-center text-slate-400">0 (1이 2개 = 짝수)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-3 text-xs text-slate-300 bg-slate-900/90 p-3 rounded-lg border border-slate-800 leading-relaxed">
            <strong className="text-amber-400">💡 필승 수 찾는 법:</strong> 각 자릿수에서 1의 개수가 홀수인 자리를 짝수로 만들어야 합니다. 
            위의 경우 님-합이 2이므로, 1번 더미(3개)에서 2개를 빼서 <strong>1개</strong>로 만들면 (1, 4, 5)가 되고, 
            <span className="font-mono text-amber-300"> 1 ⊕ 4 ⊕ 5 = 0</span>이 되어 상대방에게 님-합 0을 넘기게 됩니다!
          </div>
        </div>

        {/* N-position vs P-position logic */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
            <span className="text-xs font-bold text-emerald-400 block mb-1">
              N-포지션 (Next-player winning position)
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>님-합 ≠ 0인 상태</strong>입니다. 지금 차례인 플레이어에게 무조건 님-합을 0으로 만드는 합법적인 수가 최소 1개 이상 존재합니다. 
              즉, 실수만 하지 않으면 <strong>반드시 승리</strong>합니다.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30">
            <span className="text-xs font-bold text-rose-400 block mb-1">
              P-포지션 (Previous-player winning position)
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>님-합 = 0인 상태</strong>입니다. 지금 차례인 플레이어가 어떤 더미에서 어떤 개수를 가져가든, 
              님-합은 무조건 0이 아닌 상태로 변합니다. 즉, 상대가 최적의 수를 아는 한 <strong>패배 확정</strong>입니다.
            </p>
          </div>
        </div>
      </div>

      {/* Misere Strategy Nuance */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-4">
        <div className="flex items-center gap-2.5 text-slate-100 font-bold text-lg">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span>마이제르(Misère) 룰에서의 결정적 순간</span>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          마지막 돌을 가져가는 사람이 지는 마이제르 룰에서는 언제까지 일반 님-합 전략을 쓸까요?
        </p>

        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs text-slate-300 leading-relaxed">
          <div className="font-semibold text-amber-300">
            📌 황금 공식: "2개 이상인 더미가 오직 1개만 남았을 때 전환하라!"
          </div>
          <p>
            1보다 큰 더미가 2개 이상일 때는 <strong>일반 룰과 똑같이 님-합을 0으로 만드는 수</strong>를 둡니다. 
            그러나 어느 순간 <strong>2개 이상인 더미가 딱 1개만 남고 나머지는 모두 1개짜리 더미들</strong>만 남는 턴이 옵니다.
          </p>
          <p className="text-amber-200">
            이때 그 큰 더미를 조절하여, <strong>전체 남는 1개짜리 더미의 총 개수가 "홀수 개"</strong>가 되도록 만듭니다! 
            (필요에 따라 그 더미를 1개로 줄이거나 완전히 0개로 없애버림)
          </p>
          <p className="text-slate-400">
            그러면 상대방은 홀수 개의 1개짜리 돌을 번갈아 가져가야 하므로, <strong>결국 마지막 돌을 강제로 집게 되어 패배</strong>하게 됩니다!
          </p>
        </div>
      </div>

      {/* Interactive Mini Sandbox in Guide */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-4">
        <div className="flex items-center gap-2.5 text-slate-100 font-bold text-lg">
          <Lightbulb className="w-5 h-5 text-amber-400" />
          <span>미니 체험: 직접 숫자 바꿔보며 님-합 확인하기</span>
        </div>

        <p className="text-xs text-slate-400">
          아래 슬라이더를 움직여 더미의 돌 개수를 변경해보세요. 실시간으로 님-합(XOR)과 유불리 상태가 계산됩니다.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {interactivePiles.map((count, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs text-slate-300">
                <span>{idx + 1}번 더미</span>
                <span className="font-mono font-bold text-amber-300">
                  {count}개 ({count.toString(2).padStart(3, '0')})
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={count}
                onChange={(e) => {
                  const newPiles = [...interactivePiles];
                  newPiles[idx] = parseInt(e.target.value, 10);
                  setInteractivePiles(newPiles);
                }}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
          ))}
        </div>

        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-medium">현재 님-합:</span>
            <span className="text-lg font-mono font-bold text-amber-400">
              {sampleNimSum}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              ({sampleNimSum.toString(2).padStart(3, '0')})
            </span>
          </div>

          <div>
            {sampleNimSum === 0 ? (
              <span className="text-xs px-3 py-1 rounded bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
                P-포지션 (선공 불리 / 후공 필승)
              </span>
            ) : (
              <span className="text-xs px-3 py-1 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                N-포지션 (선공 필승 상태)
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
