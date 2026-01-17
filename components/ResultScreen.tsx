
import React from 'react';
import { UserStats } from '../types';

interface Props {
  stats: UserStats;
  onRestart: () => void;
  onRetryIncorrect: () => void;
}

const ResultScreen: React.FC<Props> = ({ stats, onRestart, onRetryIncorrect }) => {
  const accuracy = Math.round((stats.correctCount / (stats.correctCount + stats.incorrectCount)) * 100) || 0;

  return (
    <div className="p-10 text-center flex flex-col items-center justify-center h-full pop">
      <div className="w-32 h-32 bg-amber-100 rounded-full flex items-center justify-center text-7xl mb-6 shadow-inner animate-float">🎉</div>
      <h2 className="text-5xl font-black text-indigo-600 mb-2">Giỏi Quá!</h2>
      <p className="text-slate-500 font-bold mb-10 italic">Bé đã hoàn thành bài học hôm nay thật xuất sắc!</p>
      
      <div className="grid grid-cols-2 gap-6 w-full max-w-md mb-10">
        <div className="p-6 bg-indigo-50 rounded-3xl border-4 border-indigo-100">
          <p className="text-[10px] font-black text-indigo-400 uppercase mb-1 tracking-widest">Tổng điểm</p>
          <p className="text-4xl font-black text-indigo-600">{stats.score}</p>
        </div>
        <div className="p-6 bg-emerald-50 rounded-3xl border-4 border-emerald-100">
          <p className="text-[10px] font-black text-emerald-400 uppercase mb-1 tracking-widest">Chính xác</p>
          <p className="text-4xl font-black text-emerald-600">{accuracy}%</p>
        </div>
      </div>

      {stats.incorrectWords.length > 0 && (
        <div className="w-full max-w-md mb-10 text-left">
          <p className="text-slate-400 font-black text-[10px] uppercase mb-3 tracking-widest">Từ bé cần luyện thêm:</p>
          <div className="max-h-32 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
            {stats.incorrectWords.map((word, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-white border-2 border-slate-50 rounded-2xl shadow-sm">
                <span className="font-black text-indigo-600">{word.english}</span>
                <span className="text-slate-400 text-xs font-bold">{word.vietnamese}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4 w-full max-w-sm">
        <button 
          onClick={onRestart}
          className="w-full py-5 bg-indigo-600 text-white font-black text-xl rounded-3xl shadow-xl hover:bg-indigo-700 transition-all hover:scale-105"
        >
          Học bài mới thôi!
        </button>
        {stats.incorrectWords.length > 0 && (
          <button 
            onClick={onRetryIncorrect}
            className="w-full py-4 bg-white border-4 border-indigo-100 text-indigo-600 font-black text-lg rounded-3xl hover:bg-indigo-50 transition-all"
          >
            Luyện lại từ sai ({stats.incorrectWords.length})
          </button>
        )}
      </div>
    </div>
  );
};

export default ResultScreen;
