
import React, { useState, useCallback } from 'react';
import { GameState, WordItem, UserStats, VoiceSettings } from './types';
import { VOCABULARY_SETS } from './constants';
import { shuffleArray } from './services/utils';
import StartScreen from './components/StartScreen';
import GameView from './components/GameView';
import ResultScreen from './components/ResultScreen';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [playerName, setPlayerName] = useState('Bé yêu');
  const [words, setWords] = useState<WordItem[]>([]);
  const [currentSetKey, setCurrentSetKey] = useState<string>('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    voiceURI: '',
    readingRate: 1.0,
    spellingRate: 1.0
  });
  const [stats, setStats] = useState<UserStats>({
    score: 0,
    correctCount: 0,
    incorrectCount: 0,
    incorrectWords: []
  });

  const handleStart = (name: string, setKey: string) => {
    setPlayerName(name || 'Bé');
    setCurrentSetKey(setKey);
    // Tải toàn bộ từ của bộ đề đó và xáo trộn
    setWords(shuffleArray(VOCABULARY_SETS[setKey]));
    setCurrentIndex(0);
    setStats({
      score: 0,
      correctCount: 0,
      incorrectCount: 0,
      incorrectWords: []
    });
    setGameState(GameState.PLAYING);
  };

  const handleCorrect = useCallback((points: number) => {
    setStats(prev => ({
      ...prev,
      score: prev.score + points,
      correctCount: prev.correctCount + 1
    }));
  }, []);

  const handleIncorrect = useCallback((word: WordItem) => {
    setStats(prev => ({
      ...prev,
      incorrectCount: prev.incorrectCount + 1,
      incorrectWords: prev.incorrectWords.some(w => w.english === word.english) 
        ? prev.incorrectWords 
        : [...prev.incorrectWords, word]
    }));
  }, []);

  const handleNext = useCallback(() => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setGameState(GameState.FINISHED);
    }
  }, [currentIndex, words.length]);

  const handleRestart = () => {
    setGameState(GameState.START);
  };

  const handleChangeTopic = () => {
    setGameState(GameState.START);
  };

  const handleRetryIncorrect = () => {
    if (stats.incorrectWords.length === 0) return;
    setWords(shuffleArray(stats.incorrectWords));
    setCurrentIndex(0);
    setStats({
      score: 0,
      correctCount: 0,
      incorrectCount: 0,
      incorrectWords: []
    });
    setGameState(GameState.PLAYING);
  };

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center p-4">
      <div className="kids-card w-full max-w-2xl min-h-[600px] flex flex-col overflow-hidden">
        {gameState === GameState.START && (
          <StartScreen onStart={handleStart} initialName={playerName} />
        )}
        
        {gameState === GameState.PLAYING && words.length > 0 && (
          <GameView 
            playerName={playerName}
            word={words[currentIndex]}
            index={currentIndex}
            total={words.length}
            score={stats.score}
            topicName={currentSetKey}
            voiceSettings={voiceSettings}
            onUpdateVoiceSettings={setVoiceSettings}
            onCorrect={handleCorrect}
            onIncorrect={handleIncorrect}
            onNext={handleNext}
            onChangeTopic={handleChangeTopic}
          />
        )}

        {gameState === GameState.FINISHED && (
          <ResultScreen 
            stats={stats} 
            onRestart={handleRestart} 
            onRetryIncorrect={handleRetryIncorrect}
          />
        )}
      </div>
    </main>
  );
};

export default App;
