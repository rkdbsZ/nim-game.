/**
 * Nim Game Master (님 게임 마스터) - Main Application
 */
import React, { useState, useEffect, useRef } from 'react';
import { GameBoard } from './components/GameBoard';
import { GameControls } from './components/GameControls';
import { StrategyGuide } from './components/StrategyGuide';
import { SimulatorSandbox } from './components/SimulatorSandbox';
import { VictoryModal } from './components/VictoryModal';
import { PuzzleChallenge } from './components/PuzzleChallenge';
import {
  ActiveTab,
  AIDifficulty,
  GameMode,
  MoveRecord,
  PieceTheme,
  PresetConfig,
  RuleType,
} from './types/nim';
import {
  analyzeNimState,
  getAIMove,
  getWinner,
  isGameOver,
  PRESETS,
} from './utils/nimLogic';
import {
  isSoundEnabled,
  playLoseSound,
  playPickSound,
  playTakeSound,
  playTurnSound,
  playWinSound,
  setSoundEnabled,
} from './utils/audio';
import {
  Bot,
  Users,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Binary,
  Play,
  ArrowRight,
  History,
  Undo2,
} from 'lucide-react';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<ActiveTab>('game');

  // Game Settings
  const [currentPreset, setCurrentPreset] = useState<PresetConfig>(PRESETS[0]);
  const [piles, setPiles] = useState<number[]>([...PRESETS[0].piles]);
  const [gameMode, setGameMode] = useState<GameMode>('vs-ai');
  const [firstPlayer, setFirstPlayer] = useState<'player1' | 'ai'>('player1');
  const [aiDifficulty, setAiDifficulty] = useState<AIDifficulty>('master');
  const [rule, setRule] = useState<RuleType>('normal');
  const [theme, setTheme] = useState<PieceTheme>('pebbles');
  const [isMuted, setIsMuted] = useState(false);
  const [showBinaryInBoard, setShowBinaryInBoard] = useState(false);

  // Turn and selection state
  const [currentTurn, setCurrentTurn] = useState<'player1' | 'player2' | 'ai'>('player1');
  const [selectedPile, setSelectedPile] = useState<number | null>(null);
  const [selectedCount, setSelectedCount] = useState<number>(0);
  const [isAIPondering, setIsAIPondering] = useState<boolean>(false);

  // History & Statistics
  const [moveHistory, setMoveHistory] = useState<MoveRecord[]>([]);
  const [lastMoveSummary, setLastMoveSummary] = useState<string | null>(null);

  // Game End State
  const [gameEnded, setGameEnded] = useState<boolean>(false);
  const [winnerInfo, setWinnerInfo] = useState<{
    winner: 'player1' | 'player2' | 'ai';
    title: string;
    subtitle: string;
  } | null>(null);

  // Live Analysis
  const analysis = analyzeNimState(piles, rule, currentPreset.maxTakePerTurn);

  // Reset Game
  const resetGameWithPreset = (preset: PresetConfig) => {
    setCurrentPreset(preset);
    setPiles([...preset.piles]);
    if (preset.suggestedRule) {
      setRule(preset.suggestedRule);
    }
    const initialTurn = gameMode === 'vs-ai' && firstPlayer === 'ai' ? 'ai' : 'player1';
    setCurrentTurn(initialTurn);
    setSelectedPile(null);
    setSelectedCount(0);
    setIsAIPondering(initialTurn === 'ai');
    setMoveHistory([]);
    setLastMoveSummary(null);
    setGameEnded(false);
    setWinnerInfo(null);
    playTurnSound();
  };

  const handleResetCurrentGame = () => {
    setPiles([...currentPreset.piles]);
    const initialTurn = gameMode === 'vs-ai' && firstPlayer === 'ai' ? 'ai' : 'player1';
    setCurrentTurn(initialTurn);
    setSelectedPile(null);
    setSelectedCount(0);
    setIsAIPondering(initialTurn === 'ai');
    setMoveHistory([]);
    setLastMoveSummary(null);
    setGameEnded(false);
    setWinnerInfo(null);
    playTurnSound();
  };

  const handleApplyCustomPiles = (customPiles: number[], maxTake?: number) => {
    const customConfig: PresetConfig = {
      id: 'custom',
      name: `커스텀 (${customPiles.join('-')})`,
      description: '사용자가 직접 설정한 더미 배치',
      piles: customPiles,
      maxTakePerTurn: maxTake,
    };
    resetGameWithPreset(customConfig);
  };

  // Toggle Mute
  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    setSoundEnabled(!next);
  };

  // Handle Piece selection on board
  const handleSelectPile = (pileIndex: number, count: number) => {
    if (currentTurn === 'ai' || isAIPondering || gameEnded) return;
    setSelectedPile(pileIndex);
    setSelectedCount(count);
    playPickSound();
  };

  // Player confirms their move
  const handleConfirmMove = () => {
    if (selectedPile === null || selectedCount <= 0 || isAIPondering || gameEnded) return;

    executeMove(currentTurn, selectedPile, selectedCount);
  };

  // Central Move Execution
  const executeMove = (
    player: 'player1' | 'player2' | 'ai',
    pileIdx: number,
    count: number
  ) => {
    const prevPiles = [...piles];
    const newPiles = [...piles];
    newPiles[pileIdx] = Math.max(0, newPiles[pileIdx] - count);

    const nimBefore = analyzeNimState(prevPiles, rule, currentPreset.maxTakePerTurn).nimSum;
    const nimAfter = analyzeNimState(newPiles, rule, currentPreset.maxTakePerTurn).nimSum;

    // Record history
    const record: MoveRecord = {
      id: Math.random().toString(36).substring(2, 9),
      player,
      pileIndex: pileIdx,
      count,
      remainingInPile: newPiles[pileIdx],
      nimSumBefore: nimBefore,
      nimSumAfter: nimAfter,
      pilesSnapshot: newPiles,
      timestamp: new Date(),
    };

    setPiles(newPiles);
    setMoveHistory((prev) => [record, ...prev]);
    setSelectedPile(null);
    setSelectedCount(0);

    const playerName = player === 'player1' ? '1P' : player === 'player2' ? '2P' : 'AI';
    setLastMoveSummary(
      `${playerName}가 ${pileIdx + 1}번 더미에서 돌 ${count}개를 가져갔습니다.`
    );
    playTakeSound();

    // Check game over
    if (isGameOver(newPiles)) {
      const result = getWinner(player, rule, gameMode);
      setWinnerInfo(result);
      setGameEnded(true);

      if (gameMode === 'vs-ai') {
        if (result.winner === 'player1') {
          playWinSound();
        } else {
          playLoseSound();
        }
      } else {
        playWinSound();
      }
      return;
    }

    // Next Turn
    if (gameMode === 'vs-ai') {
      if (player === 'player1') {
        setCurrentTurn('ai');
        setIsAIPondering(true);
      } else {
        setCurrentTurn('player1');
        setIsAIPondering(false);
        playTurnSound();
      }
    } else {
      // 2-Player Pass & Play
      setCurrentTurn(player === 'player1' ? 'player2' : 'player1');
      playTurnSound();
    }
  };

  // AI Turn Effect
  const aiTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (gameMode === 'vs-ai' && currentTurn === 'ai' && !gameEnded) {
      setIsAIPondering(true);

      // Natural thinking delay (600ms - 900ms)
      const delay = Math.floor(Math.random() * 300) + 650;
      aiTimeoutRef.current = window.setTimeout(() => {
        const aiMove = getAIMove(piles, aiDifficulty, rule, currentPreset.maxTakePerTurn);
        if (aiMove.count > 0) {
          executeMove('ai', aiMove.pileIndex, aiMove.count);
        }
        setIsAIPondering(false);
      }, delay);

      return () => {
        if (aiTimeoutRef.current) {
          clearTimeout(aiTimeoutRef.current);
        }
      };
    }
  }, [currentTurn, gameMode, piles, gameEnded, aiDifficulty, rule]);

  // Undo last move (if 2P, 1 move; if vs-ai, undo player + AI move)
  const handleUndo = () => {
    if (moveHistory.length === 0 || isAIPondering || gameEnded) return;

    if (gameMode === 'pass-and-play') {
      const last = moveHistory[0];
      const reverted = [...piles];
      reverted[last.pileIndex] += last.count;
      setPiles(reverted);
      setCurrentTurn(last.player);
      setMoveHistory(moveHistory.slice(1));
      setLastMoveSummary('이전 수로 되돌렸습니다.');
      playTurnSound();
    } else {
      // vs-ai: if it's currently player turn, undo AI move and player's preceding move
      if (currentTurn === 'player1' && moveHistory.length >= 2) {
        const aiLast = moveHistory[0];
        const playerLast = moveHistory[1];
        const reverted = [...piles];
        reverted[aiLast.pileIndex] += aiLast.count;
        reverted[playerLast.pileIndex] += playerLast.count;
        setPiles(reverted);
        setMoveHistory(moveHistory.slice(2));
        setLastMoveSummary('한 턴 전으로 되돌렸습니다.');
        playTurnSound();
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Bar (Follows Top Bar Contract: 1-line Wordmark, 4 clean links/tabs, 1 CTA) */}
      <header className="flex items-center justify-between gap-8 px-6 py-4 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        {/* Zone 1: Wordmark */}
        <div className="flex items-center gap-3 whitespace-nowrap shrink-0">
          <span className="text-lg font-extrabold tracking-tight text-slate-100">
            님 게임 마스터
          </span>
          <span className="text-xs text-slate-400 font-mono hidden sm:inline">
            Nim Game
          </span>
        </div>

        {/* Zone 2: Navigation Links / Tabs */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          <button
            type="button"
            onClick={() => setActiveTab('game')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-100 pb-0.5 ${
              activeTab === 'game'
                ? 'text-amber-400 border-b-2 border-amber-400 font-semibold'
                : ''
            }`}
          >
            게임 대전
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('puzzle')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-100 pb-0.5 ${
              activeTab === 'puzzle'
                ? 'text-amber-400 border-b-2 border-amber-400 font-semibold'
                : ''
            }`}
          >
            퍼즐 챌린지
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('strategy')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-100 pb-0.5 ${
              activeTab === 'strategy'
                ? 'text-amber-400 border-b-2 border-amber-400 font-semibold'
                : ''
            }`}
          >
            수학적 필승법 해설
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('simulator')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-100 pb-0.5 ${
              activeTab === 'simulator'
                ? 'text-amber-400 border-b-2 border-amber-400 font-semibold'
                : ''
            }`}
          >
            님-합(XOR) 계산 실험실
          </button>
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleResetCurrentGame}
            className="px-4 py-2 text-xs font-bold text-slate-950 bg-amber-500 rounded-lg hover:bg-amber-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-sm shadow-amber-500/20 active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>새 게임</span>
          </button>
        </div>
      </header>

      {/* Mobile Tab Switcher */}
      <div className="md:hidden flex items-center justify-around border-b border-slate-800 bg-slate-900/50 p-1">
        <button
          type="button"
          onClick={() => setActiveTab('game')}
          className={`py-2 px-2.5 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'game' ? 'bg-slate-800 text-amber-400' : 'text-slate-400'
          }`}
        >
          게임 대전
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('puzzle')}
          className={`py-2 px-2.5 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'puzzle' ? 'bg-slate-800 text-amber-400' : 'text-slate-400'
          }`}
        >
          퍼즐
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('strategy')}
          className={`py-2 px-2.5 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'strategy' ? 'bg-slate-800 text-amber-400' : 'text-slate-400'
          }`}
        >
          필승법
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('simulator')}
          className={`py-2 px-2.5 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'simulator' ? 'bg-slate-800 text-amber-400' : 'text-slate-400'
          }`}
        >
          실험실
        </button>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'game' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 8 Cols: Game Arena */}
            <div className="lg:col-span-8 space-y-5">
              {/* Turn Banner */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                      currentTurn === 'player1'
                        ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300'
                        : currentTurn === 'player2'
                        ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300'
                        : 'bg-rose-500/20 border border-rose-500/40 text-rose-300'
                    }`}
                  >
                    {currentTurn === 'player1' ? (
                      '1P'
                    ) : currentTurn === 'player2' ? (
                      '2P'
                    ) : (
                      <Bot className="w-5 h-5 text-rose-400" />
                    )}
                  </div>

                  <div>
                    <div className="text-xs text-slate-400">현재 차례</div>
                    <div className="text-base font-bold text-slate-100 flex items-center gap-2">
                      <span>
                        {gameMode === 'vs-ai'
                          ? currentTurn === 'player1'
                            ? '플레이어 (당신의 턴)'
                            : isAIPondering
                            ? 'AI 계산 중...'
                            : 'AI 턴'
                          : currentTurn === 'player1'
                          ? '1P 플레이어'
                          : '2P 플레이어'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Move undo & quick actions */}
                <div className="flex items-center gap-2">
                  {moveHistory.length > 0 && (
                    <button
                      type="button"
                      onClick={handleUndo}
                      disabled={isAIPondering || gameEnded}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
                    >
                      <Undo2 className="w-3.5 h-3.5" />
                      <span>무르기</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Interactive Game Board */}
              <GameBoard
                piles={piles}
                selectedPile={selectedPile}
                selectedCount={selectedCount}
                onSelectPile={handleSelectPile}
                onConfirmMove={handleConfirmMove}
                isMyTurn={currentTurn === 'player1' || (gameMode === 'pass-and-play' && currentTurn === 'player2')}
                isAIPondering={isAIPondering}
                maxTakePerTurn={currentPreset.maxTakePerTurn}
                theme={theme}
                showBinaryInBoard={showBinaryInBoard}
                rule={rule}
              />

              {/* Move History Log */}
              {moveHistory.length > 0 && (
                <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-4">
                  <div className="flex items-center gap-2 pb-2 mb-2 border-b border-slate-800/60 text-xs font-semibold text-slate-400">
                    <History className="w-3.5 h-3.5 text-slate-400" />
                    <span>최근 착수 기록 ({moveHistory.length}회)</span>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {moveHistory.slice(0, 6).map((move, i) => (
                      <div
                        key={move.id}
                        className="px-2.5 py-1 rounded bg-slate-800/60 border border-slate-800 text-slate-300 font-mono text-[11px]"
                      >
                        <strong className="text-amber-400">
                          {move.player === 'player1' ? '1P' : move.player === 'player2' ? '2P' : 'AI'}
                        </strong>
                        : #{move.pileIndex + 1}에서 {move.count}개 가져감 (남은 돌: {move.remainingInPile}개)
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right 4 Cols: Settings & Controls */}
            <div className="lg:col-span-4 space-y-5">
              <GameControls
                currentPresetId={currentPreset.id}
                onSelectPreset={resetGameWithPreset}
                onApplyCustomPiles={handleApplyCustomPiles}
                gameMode={gameMode}
                onChangeGameMode={(m) => {
                  setGameMode(m);
                  const initialTurn = m === 'vs-ai' && firstPlayer === 'ai' ? 'ai' : 'player1';
                  setCurrentTurn(initialTurn);
                  setIsAIPondering(initialTurn === 'ai');
                }}
                firstPlayer={firstPlayer}
                onChangeFirstPlayer={(first) => {
                  setFirstPlayer(first);
                  if (gameMode === 'vs-ai') {
                    setCurrentTurn(first);
                    setIsAIPondering(first === 'ai');
                  }
                }}
                aiDifficulty={aiDifficulty}
                onChangeDifficulty={setAiDifficulty}
                rule={rule}
                onChangeRule={(r) => {
                  setRule(r);
                  handleResetCurrentGame();
                }}
                theme={theme}
                onChangeTheme={setTheme}
                isMuted={isMuted}
                onToggleMute={handleToggleMute}
                showBinaryInBoard={showBinaryInBoard}
                onToggleBinaryInBoard={() => setShowBinaryInBoard(!showBinaryInBoard)}
                onResetGame={handleResetCurrentGame}
              />

              {/* Quick Strategy Card */}
              <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-5 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
                  <Sparkles className="w-4 h-4" />
                  <span>핵심 수학 필승 법칙</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  님 게임의 모든 배치는 <strong>2진수 비트 XOR 합(님-합)</strong>으로 승패가 이미 결정되어 있습니다. 
                  내 턴을 마칠 때 상대에게 <strong>님-합 = 0</strong>을 만들어 넘기면 수학적으로 100% 승리합니다!
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('strategy')}
                  className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 transition-colors"
                >
                  <span>수학적 증명과 해설 보러가기</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'puzzle' && <PuzzleChallenge theme={theme} />}

        {activeTab === 'strategy' && <StrategyGuide />}

        {activeTab === 'simulator' && <SimulatorSandbox />}
      </main>

      {/* Victory Modal */}
      {gameEnded && winnerInfo && (
        <VictoryModal
          winnerInfo={winnerInfo}
          rule={rule}
          moveCount={moveHistory.length}
          onPlayAgain={handleResetCurrentGame}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 px-6 text-center text-xs text-slate-500">
        님 게임 마스터 · 찰스 부통의 님-합 정리(Bouton's Theorem, 1901) 기반 인터랙티브 시뮬레이터
      </footer>
    </div>
  );
}
