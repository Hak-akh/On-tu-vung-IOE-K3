
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { WordItem, Letter, VoiceSettings } from '../types';
import { stripEmoji, getEmoji, scramblePhrase } from '../services/utils';
import { speak, spellAndSpeak } from '../services/speechService';

interface Props {
  playerName: string;
  word: WordItem;
  index: number;
  total: number;
  score: number;
  topicName: string;
  voiceSettings: VoiceSettings;
  onUpdateVoiceSettings: (settings: VoiceSettings) => void;
  onCorrect: (pts: number) => void;
  onIncorrect: (word: WordItem) => void;
  onNext: () => void;
  onChangeTopic: () => void;
}

type GameStatus = 'playing' | 'checking' | 'correct' | 'wrong' | 'revealing' | 'transitioning';

const GameView: React.FC<Props> = ({ 
  playerName, word, index, total, score, topicName, voiceSettings, onUpdateVoiceSettings, onCorrect, onIncorrect, onNext, onChangeTopic 
}) => {
  const [scrambled, setScrambled] = useState<Letter[][]>([]);
  const [playerAnswer, setPlayerAnswer] = useState<Letter[]>([]);
  const [status, setStatus] = useState<GameStatus>('playing');
  const [attempts, setAttempts] = useState(0);
  const [spellingIdx, setSpellingIdx] = useState<number | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  
  const isComponentMounted = useRef(true);
  const spellingInProgress = useRef(false);

  useEffect(() => {
    isComponentMounted.current = true;
    return () => { 
      isComponentMounted.current = false; 
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, []);

  const cleanWord = useMemo(() => stripEmoji(word.english), [word.english]);
  const emoji = useMemo(() => getEmoji(word.english), [word.english]);
  const totalLetters = useMemo(() => cleanWord.replace(/\s/g, '').length, [cleanWord]);

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices().filter(v => v.lang.startsWith('en'));
      if (voices.length > 0) {
        setAvailableVoices(voices);
        if (!voiceSettings.voiceURI) {
          onUpdateVoiceSettings({ ...voiceSettings, voiceURI: voices[0].voiceURI });
        }
      }
    };
    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const initWord = useCallback(() => {
    if (!isComponentMounted.current) return;
    setStatus('playing');
    setScrambled(scramblePhrase(cleanWord));
    setPlayerAnswer([]);
    setAttempts(0);
    setSpellingIdx(null);
    spellingInProgress.current = false;
    speak(cleanWord, voiceSettings.readingRate, voiceSettings.voiceURI);
  }, [cleanWord, voiceSettings.readingRate, voiceSettings.voiceURI]);

  useEffect(() => {
    initWord();
  }, [word]);

  const handleLetterClick = (letter: Letter) => {
    if (status !== 'playing') return;
    
    setPlayerAnswer(prev => [...prev, letter]);
    setScrambled(prev => 
      prev.map(group => group.map(l => l.id === letter.id ? { ...l, used: true } : l))
    );
  };

  const handleRemoveLetter = (letterToRemove: Letter) => {
    if (status !== 'playing') return;
    
    setPlayerAnswer(prev => prev.filter(l => l.id !== letterToRemove.id));
    setScrambled(prev => 
      prev.map(group => group.map(l => l.id === letterToRemove.id ? { ...l, used: false } : l))
    );
  };

  const moveToNextWord = useCallback(() => {
    if (!isComponentMounted.current) return;
    setStatus('transitioning');
    spellingInProgress.current = false;
    onNext();
  }, [onNext]);

  const handleCheck = useCallback(() => {
    if (status !== 'playing' || spellingInProgress.current) return;
    
    spellingInProgress.current = true;
    setStatus('checking');

    const answerStr = playerAnswer.map(l => l.char).join('').toLowerCase();
    const correctStr = cleanWord.replace(/\s/g, '').toLowerCase();

    if (answerStr === correctStr) {
      setStatus('correct');
      const points = attempts === 0 ? 10 : attempts === 1 ? 5 : 2;
      onCorrect(points);
      
      setTimeout(() => {
        spellAndSpeak(cleanWord, voiceSettings.spellingRate, voiceSettings.voiceURI, setSpellingIdx, () => {
          if (isComponentMounted.current) {
            setTimeout(moveToNextWord, 600);
          }
        });
      }, 300);
    } else {
      setStatus('wrong');
      const nextAttempts = attempts + 1;
      setAttempts(nextAttempts);
      onIncorrect(word);

      if (nextAttempts >= 3) {
        setTimeout(() => {
          if (!isComponentMounted.current) return;
          setStatus('revealing');
          spellAndSpeak(cleanWord, voiceSettings.spellingRate, voiceSettings.voiceURI, setSpellingIdx, () => {
            if (isComponentMounted.current) {
              setTimeout(moveToNextWord, 1000);
            }
          });
        }, 800);
      } else {
        setTimeout(() => {
          if (!isComponentMounted.current) return;
          setPlayerAnswer([]);
          setScrambled(prev => prev.map(g => g.map(l => ({ ...l, used: false }))));
          setStatus('playing');
          spellingInProgress.current = false;
        }, 1000);
      }
    }
  }, [playerAnswer, cleanWord, attempts, onCorrect, onIncorrect, word, voiceSettings, moveToNextWord, status]);

  useEffect(() => {
    if (playerAnswer.length === totalLetters && status === 'playing') {
      const timer = setTimeout(handleCheck, 200);
      return () => clearTimeout(timer);
    }
  }, [playerAnswer, totalLetters, status, handleCheck]);

  return (
    <div className="p-6 md:p-8 flex flex-col h-full relative select-none overflow-hidden">
      {/* Header Info */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-xl shadow-inner border border-white">👶</div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Bé</p>
              <p className="text-sm font-black text-indigo-600 leading-tight">{playerName}</p>
            </div>
        </div>
        <div className="text-center">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Điểm</p>
          <p className="text-2xl font-black text-amber-500 drop-shadow-sm">{score}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Chủ đề</p>
          <p className="text-xs font-black text-slate-700 leading-tight bg-slate-100 px-2 py-1 rounded-lg">{topicName.split(':')[0]}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center gap-3 mb-8">
        <div className="flex-grow progress-container shadow-inner border border-white/50">
            <div className="progress-bar" style={{ width: `${((index + 1) / total) * 100}%` }}></div>
        </div>
        <span className="text-[10px] font-black text-slate-400">{index + 1}/{total}</span>
      </div>

      <div className="flex-grow flex flex-col items-center justify-center space-y-6">
        {/* Hint Section */}
        <div className="text-center pop">
          <p className="text-slate-400 text-xs font-black uppercase mb-1 tracking-widest">Nghĩa là:</p>
          <h2 className="text-3xl md:text-4xl font-black text-slate-800 flex items-center justify-center gap-3">
            {word.vietnamese} <span className="text-5xl animate-float inline-block">{emoji}</span>
          </h2>
          {attempts > 0 && status === 'playing' && (
            <p className="text-pink-500 font-black text-sm mt-2 animate-bounce">
              Sai rồi! Bé thử lại nhé! ({attempts}/3)
            </p>
          )}
          {status === 'revealing' && (
            <p className="text-amber-500 font-black text-sm mt-2 animate-pulse">Đáp án đúng là:</p>
          )}
          {status === 'correct' && (
            <p className="text-emerald-500 font-black text-sm mt-2">Đúng rồi! Tuyệt vời quá! 🎉</p>
          )}
        </div>

        {/* Answer Box */}
        <div className={`w-full max-w-lg min-h-[100px] p-5 bg-indigo-50/40 rounded-[2.5rem] border-4 border-dashed flex flex-wrap items-center justify-center gap-2 transition-all duration-300 ${status === 'wrong' ? 'border-pink-400 bg-pink-50/50 shake' : (status === 'correct' || status === 'revealing' || status === 'transitioning' || status === 'checking' && playerAnswer.length === totalLetters) ? 'border-emerald-400 bg-emerald-50/50' : 'border-indigo-100'}`}>
          {(status === 'correct' || status === 'revealing' || status === 'transitioning') ? (
            cleanWord.split('').map((char, i) => (
              char === ' ' ? <div key={i} className="w-4" /> :
              <span key={i} className={`text-4xl md:text-5xl font-black transition-all duration-200 ${i === spellingIdx ? 'text-indigo-600 scale-125' : 'text-slate-800'}`}>
                {char}
              </span>
            ))
          ) : playerAnswer.length === 0 ? (
            <span className="text-indigo-200 font-black text-xl italic animate-pulse">Chạm chữ cái để ghép từ...</span>
          ) : (
            playerAnswer.map((l) => (
               <button 
                key={l.id} 
                onClick={() => handleRemoveLetter(l)}
                className="text-4xl md:text-5xl font-black text-indigo-700 pop cursor-pointer hover:text-pink-500 hover:scale-110 transition-all active:scale-90"
                title="Bấm để xóa"
               >
                 {l.char}
               </button>
            ))
          )}
        </div>

        {/* Interaction Area */}
        {status === 'playing' && (
          <div className="flex flex-col items-center gap-3 w-full py-4">
            {scrambled.map((group, gIdx) => (
              <div key={gIdx} className="flex flex-wrap justify-center gap-2 md:gap-3">
                {group.map((letter) => (
                  <button
                    key={letter.id}
                    onClick={() => handleLetterClick(letter)}
                    disabled={letter.used}
                    className="letter-btn w-12 h-12 md:w-14 md:h-14 bg-white border-2 border-indigo-100 rounded-2xl text-xl md:text-2xl font-black text-indigo-600 disabled:opacity-20 disabled:scale-90 shadow-sm"
                  >
                    {letter.char}
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Status indicator */}
        {(status !== 'playing') && <div className="h-24 flex items-center justify-center">
            {(status === 'checking' || status === 'transitioning') && <div className="animate-bounce text-3xl">⭐</div>}
        </div>}

        {/* Footer Controls */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 pt-4">
          <button 
            onClick={() => speak(cleanWord, voiceSettings.readingRate, voiceSettings.voiceURI)}
            disabled={status === 'revealing' || status === 'transitioning' || status === 'checking'}
            className="px-6 py-3 flex items-center gap-2 bg-indigo-100 text-indigo-600 font-black rounded-2xl hover:bg-indigo-200 transition-colors disabled:opacity-50 text-sm md:text-base"
          >
            🔊 Nghe lại
          </button>
          <button 
            onClick={() => setShowSettings(true)}
            disabled={status === 'transitioning' || status === 'checking'}
            className="px-6 py-3 flex items-center gap-2 bg-slate-100 text-slate-600 font-black rounded-2xl hover:bg-slate-200 transition-colors disabled:opacity-50 text-sm md:text-base"
          >
            ⚙️ Giọng đọc
          </button>
          <button 
            onClick={onChangeTopic}
            className="px-6 py-3 flex items-center gap-2 bg-amber-100 text-amber-700 font-black rounded-2xl hover:bg-amber-200 transition-colors text-sm md:text-base"
          >
            📂 Đổi chủ đề
          </button>
        </div>

        {/* Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowSettings(false)}>
            <div className="w-full max-w-sm p-6 bg-white rounded-[2.5rem] border-4 border-indigo-100 shadow-2xl pop space-y-4" onClick={e => e.stopPropagation()}>
              <h4 className="text-xl font-black text-indigo-600 text-center mb-4">Cài đặt giọng nói ⚙️</h4>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Giọng đọc</label>
                  <select 
                    value={voiceSettings.voiceURI}
                    onChange={(e) => onUpdateVoiceSettings({ ...voiceSettings, voiceURI: e.target.value })}
                    className="w-full p-3 bg-indigo-50 border-2 border-indigo-100 rounded-xl font-bold text-indigo-700 text-sm outline-none"
                  >
                    {availableVoices.map(v => <option key={v.voiceURI} value={v.voiceURI}>{v.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tốc độ đọc</label>
                    <span className="text-xs font-black text-indigo-500">{voiceSettings.readingRate}x</span>
                  </div>
                  <input type="range" min="0.5" max="2" step="0.1" value={voiceSettings.readingRate} onChange={(e) => onUpdateVoiceSettings({ ...voiceSettings, readingRate: parseFloat(e.target.value) })} className="w-full accent-indigo-600 cursor-pointer" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tốc độ đánh vần</label>
                    <span className="text-xs font-black text-indigo-500">{voiceSettings.spellingRate}x</span>
                  </div>
                  <input type="range" min="0.5" max="2" step="0.1" value={voiceSettings.spellingRate} onChange={(e) => onUpdateVoiceSettings({ ...voiceSettings, spellingRate: parseFloat(e.target.value) })} className="w-full accent-indigo-600 cursor-pointer" />
                </div>
              </div>
              <button 
                onClick={() => setShowSettings(false)} 
                className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl mt-4 shadow-lg hover:bg-indigo-700 transition-all"
              >
                Xong rồi
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameView;
