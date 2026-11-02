import React, { useState } from 'react';
import { AIDifficulty, GameMode, PieceTheme, PresetConfig, RuleType } from '../types/nim';
import { PRESETS } from '../utils/nimLogic';
import { Volume2, VolumeX, RotateCcw, Sliders, Users, Bot, Binary } from 'lucide-react';

interface GameControlsProps {
  currentPresetId: string;
  onSelectPreset: (preset: PresetConfig) => void;
  onApplyCustomPiles: (piles: number[], maxTake?: number) => void;
  gameMode: GameMode;
  onChangeGameMode: (mode: GameMode) => void;
  firstPlayer: 'player1' | 'ai';
  onChangeFirstPlayer: (first: 'player1' | 'ai') => void;
  aiDifficulty: AIDifficulty;
  onChangeDifficulty: (difficulty: AIDifficulty) => void;
  rule: RuleType;
  onChangeRule: (rule: RuleType) => void;
  theme: PieceTheme;
  onChangeTheme: (theme: PieceTheme) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  showBinaryInBoard: boolean;
  onToggleBinaryInBoard: () => void;
  onResetGame: () => void;
}

export const GameControls: React.FC<GameControlsProps> = ({
  currentPresetId,
  onSelectPreset,
  onApplyCustomPiles,
  gameMode,
  onChangeGameMode,
  firstPlayer,
  onChangeFirstPlayer,
  aiDifficulty,
  onChangeDifficulty,
  rule,
  onChangeRule,
  theme,
  onChangeTheme,
  isMuted,
  onToggleMute,
  showBinaryInBoard,
  onToggleBinaryInBoard,
  onResetGame,
}) => {
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customInput, setCustomInput] = useState('3, 4, 5');
  const [customMaxTake, setCustomMaxTake] = useState('');

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = customInput
      .split(/[, ]+/)
      .map(s => parseInt(s.trim(), 10))
      .filter(n => !isNaN(n) && n > 0 && n <= 30);

    if (parsed.length > 0) {
      const maxTake = customMaxTake ? parseInt(customMaxTake, 10) : undefined;
      onApplyCustomPiles(parsed, maxTake && maxTake > 0 ? maxTake : undefined);
      setShowCustomModal(false);
    }
  };

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 backdrop-blur-md space-y-6">
      {/* Action Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold text-slate-100">게임 모드 & 설정</h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleMute}
            aria-label={isMuted ? '음소거 해제' : '음소거'}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
          </button>

          <button
            type="button"
            onClick={onResetGame}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>재시작</span>
          </button>
        </div>
      </div>

      {/* Mode Selector */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-slate-400">대전 모드</label>
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950/70 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => onChangeGameMode('vs-ai')}
            className={`flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
              gameMode === 'vs-ai'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>AI 대전</span>
          </button>
          <button
            type="button"
            onClick={() => onChangeGameMode('pass-and-play')}
            className={`flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
              gameMode === 'pass-and-play'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>2인 대전 (패스앤플레이)</span>
          </button>
        </div>
      </div>

      {/* AI Difficulty (if vs AI) */}
      {gameMode === 'vs-ai' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-slate-400">AI 난이도</label>
            <span className="text-[11px] text-amber-300 font-mono">
              {aiDifficulty === 'master' ? '100% 필승 공식 (Bouton 무적 봇)' : aiDifficulty === 'medium' ? '50% 수학적 최적수' : '초급 (랜덤 착수)'}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950/70 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => onChangeDifficulty('easy')}
              className={`py-1.5 text-xs font-medium rounded-lg transition-all ${
                aiDifficulty === 'easy'
                  ? 'bg-slate-700 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              초급
            </button>
            <button
              type="button"
              onClick={() => onChangeDifficulty('medium')}
              className={`py-1.5 text-xs font-medium rounded-lg transition-all ${
                aiDifficulty === 'medium'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              중급
            </button>
            <button
              type="button"
              onClick={() => onChangeDifficulty('master')}
              className={`py-1.5 text-xs font-medium rounded-lg transition-all ${
                aiDifficulty === 'master'
                  ? 'bg-rose-600 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              수학 천재 ⚡
            </button>
          </div>

          {/* First Player Choice */}
          <div className="pt-2">
            <label className="text-xs font-medium text-slate-400 block mb-1">선공 / 후공 선택</label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950/70 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => onChangeFirstPlayer('player1')}
                className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  firstPlayer === 'player1'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                내가 선공 (첫 턴)
              </button>
              <button
                type="button"
                onClick={() => onChangeFirstPlayer('ai')}
                className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  firstPlayer === 'ai'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                AI 선공 (첫 턴)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Presets Grid */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-slate-400">더미 배치 프리셋</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {PRESETS.map((preset) => {
            const isSelected = currentPresetId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => onSelectPreset(preset)}
                className={`p-2.5 rounded-xl text-left border transition-all ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-500/50 text-amber-200'
                    : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-semibold text-slate-200 truncate">
                  {preset.name}
                </div>
                <div className="text-[11px] text-slate-400 truncate mt-0.5 font-mono">
                  배치: [{preset.piles.join(', ')}]
                </div>
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => setShowCustomModal(true)}
            className={`p-2.5 rounded-xl text-left border transition-all ${
              currentPresetId === 'custom'
                ? 'bg-amber-500/15 border-amber-500/50 text-amber-200'
                : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <div className="text-xs font-semibold text-slate-200">
              ⚙️ 커스텀 직접 설정
            </div>
            <div className="text-[11px] text-slate-400 truncate mt-0.5">
              원하는 줄 수와 개수 자유 지정
            </div>
          </button>
        </div>
      </div>

      {/* Rules Toggle */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-slate-400">승리 규칙 (Rule Type)</label>
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950/70 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => onChangeRule('normal')}
            className={`py-2 text-xs font-semibold rounded-lg transition-all ${
              rule === 'normal'
                ? 'bg-slate-800 text-amber-300 shadow-sm border border-amber-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            일반 룰 (마지막 = 승리)
          </button>
          <button
            type="button"
            onClick={() => onChangeRule('misere')}
            className={`py-2 text-xs font-semibold rounded-lg transition-all ${
              rule === 'misere'
                ? 'bg-slate-800 text-amber-300 shadow-sm border border-amber-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            마이제르 룰 (마지막 = 패배)
          </button>
        </div>
      </div>

      {/* Piece Theme & Visual Toggles */}
      <div className="pt-2 border-t border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-slate-400">돌 그래픽 테마</label>
          <div className="flex items-center gap-1">
            {(['pebbles', 'matches', 'gems', 'coins'] as PieceTheme[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => onChangeTheme(t)}
                className={`px-2 py-1 text-xs rounded-md capitalize transition-all ${
                  theme === t
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {t === 'pebbles' ? '바둑돌' : t === 'matches' ? '성냥개비' : t === 'gems' ? '크리스탈' : '동전'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <Binary className="w-4 h-4 text-slate-400" />
            <span>보드에 2진수 비트 표기</span>
          </div>
          <button
            type="button"
            onClick={onToggleBinaryInBoard}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              showBinaryInBoard ? 'bg-amber-500' : 'bg-slate-700'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${
                showBinaryInBoard ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Custom Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h4 className="text-base font-bold text-slate-100">
              커스텀 더미 설정
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              각 줄의 돌 개수를 쉼표로 구분하여 입력하세요 (예: 3, 5, 7 또는 1, 2, 3, 4, 5).
            </p>

            <form onSubmit={handleCustomSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-slate-300 block mb-1">
                  더미별 개수 (1~30)
                </label>
                <input
                  type="text"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder="예: 3, 4, 5"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 font-mono text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">
                  1회당 최대 가져오기 제한 (선택 사항, 비워두면 무제한)
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={customMaxTake}
                  onChange={(e) => setCustomMaxTake(e.target.value)}
                  placeholder="예: 3 (바셰의 게임처럼 제한)"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 font-mono text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold"
                >
                  적용하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
