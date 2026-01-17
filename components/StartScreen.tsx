
import React, { useState } from 'react';
import { VOCABULARY_SETS } from '../constants';

interface Props {
  onStart: (name: string, setKey: string) => void;
  initialName?: string;
}

const StartScreen: React.FC<Props> = ({ onStart, initialName = '' }) => {
  const [name, setName] = useState(initialName === 'Bé yêu' ? '' : initialName);
  const [selectedSet, setSelectedSet] = useState<string>(Object.keys(VOCABULARY_SETS)[0]);

  const setKeys = Object.keys(VOCABULARY_SETS);

  return (
    <div className="p-8 md:p-10 flex flex-col items-center text-center justify-center h-full pop custom-scrollbar overflow-y-auto">
      <div className="w-24 h-24 md:w-32 md:h-32 bg-indigo-100 rounded-[2.5rem] flex items-center justify-center text-5xl md:text-7xl mb-6 animate-float shadow-inner">🎒</div>
      <h1 className="text-3xl md:text-4xl font-black text-indigo-600 mb-2 drop-shadow-sm">Bé Học Tiếng Anh</h1>
      <p className="text-slate-500 font-bold text-xs md:text-sm mb-6 max-w-md uppercase tracking-wider">Chọn bộ đề và bắt đầu thử thách nhé!</p>
      
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-2 text-left">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Tên của bé là gì nhỉ?</label>
          <input 
            type="text" 
            placeholder="Ví dụ: Bảo Nam..." 
            className="w-full px-6 py-3 bg-indigo-50/50 border-4 border-indigo-100 rounded-3xl text-lg font-black text-indigo-700 focus:outline-none focus:border-indigo-400 transition-all placeholder:text-indigo-200"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="space-y-3 text-left">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Bé muốn học chủ đề nào?</label>
          <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
            {setKeys.map((key) => {
              const wordCount = VOCABULARY_SETS[key].length;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedSet(key)}
                  className={`py-3 px-4 rounded-2xl font-black text-xs md:text-sm transition-all border-4 text-left flex items-center justify-between ${
                    selectedSet === key 
                    ? 'bg-indigo-600 border-indigo-200 text-white shadow-lg scale-[1.02]' 
                    : 'bg-white border-slate-50 text-slate-500 hover:border-indigo-100'
                  }`}
                >
                  <div className="flex flex-col">
                    <span>{key}</span>
                    <span className={`text-[9px] uppercase tracking-wider ${selectedSet === key ? 'text-indigo-200' : 'text-slate-400'}`}>
                      {wordCount} từ vựng
                    </span>
                  </div>
                  {selectedSet === key && <span>✅</span>}
                </button>
              );
            })}
          </div>
        </div>
        
        <button 
          onClick={() => onStart(name, selectedSet)}
          disabled={!name.trim()}
          className="w-full py-4 md:py-5 bg-indigo-600 disabled:bg-slate-300 text-white font-black text-xl md:text-2xl rounded-[2rem] shadow-xl shadow-indigo-100 transition-all hover:scale-105 active:scale-95 hover:bg-indigo-700 mt-2"
        >
          Bắt đầu học ngay! 🚀
        </button>
      </div>

      <div className="mt-8 flex gap-4 text-slate-400 font-black text-[9px] uppercase tracking-widest">
        <span className="flex items-center gap-1"><span className="w-2 h-2 bg-green-400 rounded-full"></span> Vui vẻ</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 bg-blue-400 rounded-full"></span> Dễ hiểu</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 bg-pink-400 rounded-full"></span> Hiệu quả</span>
      </div>
    </div>
  );
};

export default StartScreen;
