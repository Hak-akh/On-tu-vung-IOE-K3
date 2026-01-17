
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";

// --- VOCABULARY DATA ---
const VOCABULARY_SETS = {
    "Đề 1: Trường học": [
        { english: "school 🏫", vietnamese: "trường học" }, { english: "classroom 🏫", vietnamese: "lớp học" }, { english: "playground 🎡", vietnamese: "sân chơi" },
        { english: "library 📚", vietnamese: "thư viện" }, { english: "gym 🤸", vietnamese: "phòng tập" }, { english: "computer room 💻", vietnamese: "phòng máy tính" },
        { english: "desk 📖", vietnamese: "bàn học" }, { english: "table 🍽️", vietnamese: "cái bàn" }, { english: "chair 🪑", vietnamese: "cái ghế" },
        { english: "board 📋", vietnamese: "cái bảng" }, { english: "book 📖", vietnamese: "quyển sách" }, { english: "notebook 📓", vietnamese: "quyển vở" },
        { english: "pencil ✏️", vietnamese: "bút chì" }, { english: "pen 🖊️", vietnamese: "bút mực" }, { english: "ruler 📏", vietnamese: "thước kẻ" },
        { english: "eraser 🧼", vietnamese: "cục tẩy" }, { english: "school bag 🎒", vietnamese: "cặp học sinh" }, { english: "backpack 🎒", vietnamese: "ba lô" },
        { english: "teacher 👩‍🏫", vietnamese: "giáo viên" }, { english: "student 🧑‍🎓", vietnamese: "học sinh" }, { english: "friend 🧑‍🤝‍🧑", vietnamese: "người bạn" },
        { english: "cat 🐈", vietnamese: "con mèo" }, { english: "dog 🐕", vietnamese: "con chó" }, { english: "doll 🎎", vietnamese: "búp bê" },
        { english: "ball ⚽", vietnamese: "quả bóng" }, { english: "red 🔴", vietnamese: "màu đỏ" }, { english: "blue 🔵", vietnamese: "màu xanh dương" },
        { english: "yellow 🟡", vietnamese: "màu vàng" }, { english: "green 🟢", vietnamese: "màu xanh lá" }, { english: "pink 🌸", vietnamese: "màu hồng" },
        { english: "black ⚫", vietnamese: "màu đen" }, { english: "white ⚪", vietnamese: "màu trắng" }, { english: "brown 🟤", vietnamese: "màu nâu" },
        { english: "big 🐘", vietnamese: "to lớn" }, { english: "small 🐁", vietnamese: "nhỏ bé" }, { english: "long 📏", vietnamese: "dài" },
        { english: "short 📏", vietnamese: "ngắn" }, { english: "open 📖", vietnamese: "mở" }, { english: "close 📕", vietnamese: "đóng" },
        { english: "stand up 🧍", vietnamese: "đứng lên" }, { english: "sit down 🪑", vietnamese: "ngồi xuống" }, { english: "look 👀", vietnamese: "nhìn" },
        { english: "listen 👂", vietnamese: "nghe" }, { english: "quiet 🤫", vietnamese: "yên lặng" }, { english: "give 🎁", vietnamese: "đưa cho" },
        { english: "come 🚶", vietnamese: "đến" }, { english: "go 🚶", vietnamese: "đi" }, { english: "play 🎮", vietnamese: "chơi" },
        { english: "read 📖", vietnamese: "đọc" }, { english: "write ✍️", vietnamese: "viết" }, { english: "draw 🎨", vietnamese: "vẽ" },
        { english: "sing 🎤", vietnamese: "hát" }, { english: "one 1️⃣", vietnamese: "số một" }, { english: "two 2️⃣", vietnamese: "số hai" },
        { english: "three 3️⃣", vietnamese: "số ba" }, { english: "four 4️⃣", vietnamese: "số bốn" }, { english: "five 5️⃣", vietnamese: "số năm" },
        { english: "six 6️⃣", vietnamese: "số sáu" }, { english: "seven 7️⃣", vietnamese: "số bảy" }, { english: "eight 8️⃣", vietnamese: "số tám" },
        { english: "nine 9️⃣", vietnamese: "số chín" }, { english: "ten 🔟", vietnamese: "số mười" }, { english: "many 🔟", vietnamese: "nhiều" },
        { english: "there is ☝️", vietnamese: "có (số ít)" }, { english: "there are ✌️", vietnamese: "có (số nhiều)" }
    ],
    "Đề 2: Gia đình & Đời sống": [
        { english: "name 📛", vietnamese: "tên" }, { english: "age 🎂", vietnamese: "tuổi" }, { english: "family 👨‍👩‍👧‍👦", vietnamese: "gia đình" },
        { english: "father 👨", vietnamese: "bố/cha" }, { english: "mother 👩", vietnamese: "mẹ" }, { english: "brother 👦", vietnamese: "anh/em trai" },
        { english: "sister 👧", vietnamese: "chị/em gái" }, { english: "classroom 🏫", vietnamese: "lớp học" }, { english: "school 🏫", vietnamese: "trường học" },
        { english: "library 📚", vietnamese: "thư viện" }, { english: "playground 🎡", vietnamese: "sân chơi" }, { english: "living room 🛋️", vietnamese: "phòng khách" },
        { english: "bedroom 🛌", vietnamese: "phòng ngủ" }, { english: "kitchen 🍳", vietnamese: "nhà bếp" }, { english: "picture 🖼️", vietnamese: "bức tranh" },
        { english: "map 🗺️", vietnamese: "bản đồ" }, { english: "window 🪟", vietnamese: "cửa sổ" }, { english: "door 🚪", vietnamese: "cửa" },
        { english: "pencil case ✏️", vietnamese: "hộp bút" }, { english: "rubber 🧼", vietnamese: "cục tẩy" }, { english: "marker 🖊️", vietnamese: "bút dạ" },
        { english: "crayon 🖍️", vietnamese: "bút màu" }, { english: "shirt 👕", vietnamese: "áo sơ mi" }, { english: "T-shirt 👕", vietnamese: "áo phông" },
        { english: "hat 👒", vietnamese: "cái mũ" }, { english: "shoes 👟", vietnamese: "đôi giày" }, { english: "black ⚫", vietnamese: "màu đen" },
        { english: "blue 🔵", vietnamese: "màu xanh dương" }, { english: "green 🟢", vietnamese: "màu xanh lá" }, { english: "pink 🌸", vietnamese: "màu hồng" },
        { english: "yellow 🟡", vietnamese: "màu vàng" }, { english: "old 👴", vietnamese: "cũ/già" }, { english: "new ✨", vietnamese: "mới" },
        { english: "nice 😊", vietnamese: "đẹp/ngoan" }, { english: "fine 👍", vietnamese: "khỏe" }, { english: "thank you 🙏", vietnamese: "cảm ơn" },
        { english: "please 🙏", vietnamese: "làm ơn" }, { english: "goodbye 👋", vietnamese: "tạm biệt" }, { english: "see you later 👋", vietnamese: "hẹn gặp lại" },
        { english: "help 🤝", vietnamese: "giúp đỡ" }, { english: "like ❤️", vietnamese: "thích" }, { english: "do not like 👎", vietnamese: "không thích" },
        { english: "play football ⚽", vietnamese: "chơi bóng đá" }, { english: "play chess ♟️", vietnamese: "chơi cờ" }, { english: "read books 📚", vietnamese: "đọc sách" },
        { english: "go to school 🏫", vietnamese: "đi học" }, { english: "in 📥", vietnamese: "trong" }, { english: "on 🔝", vietnamese: "trên" },
        { english: "under 👇", vietnamese: "dưới" }, { english: "next to ➡️", vietnamese: "bên cạnh" }
    ],
    "Đề 3: Động vật & Học tập": [
        { english: "classmate 🧑‍🤝‍🧑", vietnamese: "bạn cùng lớp" }, { english: "subject 📚", vietnamese: "môn học" }, { english: "Maths ➕", vietnamese: "Toán" },
        { english: "English 🔤", vietnamese: "Tiếng Anh" }, { english: "Art 🎨", vietnamese: "Mỹ thuật" }, { english: "Music 🎶", vietnamese: "Âm nhạc" },
        { english: "PE 🏀", vietnamese: "Thể dục" }, { english: "break time 🔔", vietnamese: "giờ ra chơi" }, { english: "homework 📝", vietnamese: "bài tập về nhà" },
        { english: "farmer 👨‍🌾", vietnamese: "nông dân" }, { english: "singer 🎤", vietnamese: "ca sĩ" }, { english: "teacher 👩‍🏫", vietnamese: "giáo viên" },
        { english: "pupil 🧑‍🎓", vietnamese: "học sinh" }, { english: "bike 🚲", vietnamese: "xe đạp" }, { english: "bus 🚌", vietnamese: "xe buýt" },
        { english: "car 🚗", vietnamese: "xe hơi" }, { english: "school bus 🚌", vietnamese: "xe buýt trường" }, { english: "playground 🎡", vietnamese: "sân chơi" },
        { english: "gym 🤸", vietnamese: "phòng tập" }, { english: "farm 🚜", vietnamese: "nông trại" }, { english: "animal 🦁", vietnamese: "động vật" },
        { english: "fish 🐟", vietnamese: "con cá" }, { english: "bird 🐦", vietnamese: "con chim" }, { english: "elephant 🐘", vietnamese: "con voi" },
        { english: "mouse 🐭", vietnamese: "con chuột" }, { english: "run 🏃", vietnamese: "chạy" }, { english: "jump 🦘", vietnamese: "nhảy" },
        { english: "swim 🏊", vietnamese: "bơi" }, { english: "fly 🕊️", vietnamese: "bay" }, { english: "clean 🧼", vietnamese: "sạch sẽ" },
        { english: "tidy ✨", vietnamese: "gọn gàng" }, { english: "dirty 🐷", vietnamese: "bẩn" }, { english: "happy 😄", vietnamese: "vui vẻ" },
        { english: "sad 😢", vietnamese: "buồn bã" }, { english: "tired 😫", vietnamese: "mệt mỏi" }, { english: "thirsty 🥛", vietnamese: "khát nước" },
        { english: "hungry 🍔", vietnamese: "đói bụng" }, { english: "favourite ❤️", vietnamese: "yêu thích" }, { english: "colour 🎨", vietnamese: "màu sắc" },
        { english: "food 🍕", vietnamese: "thức ăn" }, { english: "milk 🥛", vietnamese: "sữa" }, { english: "ice cream 🍦", vietnamese: "kem" },
        { english: "apple 🍎", vietnamese: "táo" }, { english: "banana 🍌", vietnamese: "chuối" }
    ],
    "Đề 4: Nhà & Đồ dùng": [
        { english: "house 🏠", vietnamese: "nhà" }, { english: "room 🏠", vietnamese: "phòng" }, { english: "bedroom 🛌", vietnamese: "phòng ngủ" },
        { english: "bathroom 🚿", vietnamese: "phòng tắm" }, { english: "kitchen 🍳", vietnamese: "nhà bếp" }, { english: "school yard 🏫", vietnamese: "sân trường" },
        { english: "road 🛣️", vietnamese: "đường" }, { english: "bike 🚲", vietnamese: "xe đạp" }, { english: "bus 🚌", vietnamese: "xe buýt" },
        { english: "train 🚆", vietnamese: "tàu hỏa" }, { english: "truck 🚚", vietnamese: "xe tải" }, { english: "window 🪟", vietnamese: "cửa sổ" },
        { english: "door 🚪", vietnamese: "cửa" }, { english: "bed 🛏️", vietnamese: "cái giường" }, { english: "shelf 📂", vietnamese: "kệ" },
        { english: "bottle 🍼", vietnamese: "chai" }, { english: "water 💧", vietnamese: "nước" }, { english: "juice 🍹", vietnamese: "nước ép" },
        { english: "clothes 👗", vietnamese: "quần áo" }, { english: "trousers 👖", vietnamese: "quần dài" }, { english: "shoes 👟", vietnamese: "giày" },
        { english: "hair 👱", vietnamese: "tóc" }, { english: "eyes 👀", vietnamese: "mắt" }, { english: "tall 🦒", vietnamese: "cao" },
        { english: "short 📏", vietnamese: "thấp" }, { english: "old 👴", vietnamese: "già" }, { english: "young 🌱", vietnamese: "trẻ" },
        { english: "quiet 🤫", vietnamese: "yên lặng" }, { english: "noisy 📢", vietnamese: "ồn ào" }, { english: "clean 🧼", vietnamese: "sạch" },
        { english: "mess 🌪️", vietnamese: "bừa bộn" }, { english: "happy 😄", vietnamese: "vui" }, { english: "nice 😊", vietnamese: "đẹp" },
        { english: "good 👍", vietnamese: "tốt" }, { english: "bad 👎", vietnamese: "xấu" }, { english: "ride 🏇", vietnamese: "cưỡi/lái" },
        { english: "travel ✈️", vietnamese: "du lịch" }, { english: "learn 📖", vietnamese: "học" }, { english: "study 📚", vietnamese: "học tập" },
        { english: "listen 👂", vietnamese: "nghe" }, { english: "repeat 🔁", vietnamese: "nhắc lại" }, { english: "answer 🗣️", vietnamese: "trả lời" },
        { english: "question ❓", vietnamese: "câu hỏi" }
    ],
    "Đề 5: Hoạt động": [
        { english: "daily activities 📅", vietnamese: "hoạt động hàng ngày" }, { english: "get up ⏰", vietnamese: "thức dậy" }, { english: "brush teeth 🪥", vietnamese: "đánh răng" },
        { english: "wash face 🧼", vietnamese: "rửa mặt" }, { english: "have breakfast 🍳", vietnamese: "ăn sáng" }, { english: "go to school 🏫", vietnamese: "đi học" },
        { english: "study 📚", vietnamese: "học tập" }, { english: "do homework 📝", vietnamese: "làm bài tập" }, { english: "play 🎮", vietnamese: "chơi" },
        { english: "watch TV 📺", vietnamese: "xem TV" }, { english: "listen to music 🎶", vietnamese: "nghe nhạc" }, { english: "read books 📚", vietnamese: "đọc sách" },
        { english: "go to bed 😴", vietnamese: "đi ngủ" }, { english: "morning ☀️", vietnamese: "sáng" }, { english: "afternoon 🌤️", vietnamese: "chiều" },
        { english: "evening 🌙", vietnamese: "tối" }, { english: "night 🌚", vietnamese: "đêm" }, { english: "clock ⏰", vietnamese: "đồng hồ" },
        { english: "time ⌛", vietnamese: "thời gian" }, { english: "early 🌅", vietnamese: "sớm" }, { english: "late 🌃", vietnamese: "muộn" },
        { english: "today 📅", vietnamese: "hôm nay" }, { english: "tomorrow ⏭️", vietnamese: "mai" }, { english: "yesterday ⏮️", vietnamese: "hôm qua" },
        { english: "happy 😄", vietnamese: "vui" }, { english: "tired 😫", vietnamese: "mệt" }, { english: "sleepy 🥱", vietnamese: "buồn ngủ" },
        { english: "school 🏫", vietnamese: "trường học" }, { english: "home 🏠", vietnamese: "nhà" }, { english: "teacher 👩‍🏫", vietnamese: "giáo viên" },
        { english: "student 🧑‍🎓", vietnamese: "học sinh" }
    ]
};

// --- UTILITIES ---
const EMOJI_REGEX = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{3000}-\u{303F}]/gu;
const stripEmoji = (str) => str.replace(EMOJI_REGEX, '').trim();
const getEmoji = (str) => (str.match(EMOJI_REGEX) || []).join('');
const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

const scramblePhrase = (phrase) => {
    let id = 0;
    const clean = phrase.replace(/[^a-zA-Z\s-]/g, '');
    return clean.split(' ').map(word => {
        if (!word) return [];
        let scrambled;
        do { scrambled = shuffleArray(word.split('')); } while (scrambled.join('') === word && word.length > 1);
        return scrambled.map(char => ({ char, id: id++, used: false }));
    }).filter(w => w.length > 0);
};

// --- SPEECH ---
const speak = (text, rate = 1.0, voiceURI) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US'; u.rate = rate;
    if (voiceURI) {
        const v = window.speechSynthesis.getVoices().find(x => x.voiceURI === voiceURI);
        if (v) u.voice = v;
    }
    window.speechSynthesis.speak(u);
};

const spellAndSpeak = (word, rate, voiceURI, onLetter, onEnd) => {
    if (!('speechSynthesis' in window)) return onEnd();
    window.speechSynthesis.cancel();
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.voiceURI === voiceURI);
    const letters = word.replace(/[\s-]/g, '').split('');
    const letterIndices = [];
    word.split('').forEach((c, i) => { if (c.trim() !== '' && c !== '-') letterIndices.push(i); });
    let idx = 0;
    const next = () => {
        if (idx < letters.length) {
            onLetter(letterIndices[idx]);
            const u = new SpeechSynthesisUtterance(letters[idx]);
            u.lang = 'en-US'; u.rate = 2.5 * rate;
            if (voice) u.voice = voice;
            u.onend = () => { idx++; setTimeout(next, 50 / rate); };
            window.speechSynthesis.speak(u);
        } else {
            onLetter(null);
            const f = new SpeechSynthesisUtterance(word);
            f.lang = 'en-US'; f.rate = rate;
            if (voice) f.voice = voice;
            f.onend = onEnd;
            setTimeout(() => window.speechSynthesis.speak(f), 200);
        }
    };
    next();
};

// --- GEMINI AI HINT ---
const getAIHint = async (word, vietnamese) => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Provide a very short, simple English sentence example for the word "${word}" which means "${vietnamese}". Use underscores to hide the word "${word}". Example for "apple": "I eat a red _____."`,
            config: { temperature: 0.7, maxOutputTokens: 50 }
        });
        return response.text?.trim() || "Cố lên bé ơi!";
    } catch (e) {
        return "Hãy thử ghép các chữ cái nhé!";
    }
};

// --- COMPONENTS ---
const StartScreen = ({ onStart, initialName }) => {
    const [name, setName] = useState(initialName === 'Bé yêu' ? '' : initialName);
    const [topic, setTopic] = useState(Object.keys(VOCABULARY_SETS)[0]);
    
    return (
        <div className="p-8 md:p-10 flex flex-col items-center text-center justify-center h-full pop custom-scrollbar overflow-y-auto">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-indigo-100 rounded-[2.5rem] flex items-center justify-center text-5xl md:text-7xl mb-6 animate-float shadow-inner">🧸</div>
            <h1 className="text-3xl md:text-4xl font-black text-indigo-600 mb-2 drop-shadow-sm">Bé Học Tiếng Anh</h1>
            <p className="text-slate-500 font-bold text-xs md:text-sm mb-6 max-w-md uppercase tracking-wider">Chọn bộ đề và bắt đầu thử thách nhé!</p>
            <div className="w-full max-w-sm space-y-6">
                <input type="text" placeholder="Tên của bé là gì nhỉ?" className="w-full px-6 py-3 bg-indigo-50/50 border-4 border-indigo-100 rounded-3xl text-lg font-black text-indigo-700 focus:outline-none focus:border-indigo-400" value={name} onChange={e => setName(e.target.value)} />
                <div className="grid grid-cols-1 gap-2 max-h-56 overflow-y-auto pr-2 custom-scrollbar">
                    {Object.keys(VOCABULARY_SETS).map(k => (
                        <button key={k} onClick={() => setTopic(k)} className={`py-4 px-5 rounded-2xl font-black text-sm transition-all border-4 text-left flex flex-col ${topic === k ? 'bg-indigo-600 border-indigo-200 text-white shadow-lg' : 'bg-white border-slate-50 text-slate-500 hover:border-indigo-100'}`}>
                            <div className="flex items-center justify-between w-full">
                                <span>{k}</span>
                                {topic === k && <span>✅</span>}
                            </div>
                            <span className={`text-[10px] uppercase tracking-widest mt-1 ${topic === k ? 'text-indigo-200' : 'text-slate-400'}`}>
                                Tổng cộng: {VOCABULARY_SETS[k].length} từ vựng
                            </span>
                        </button>
                    ))}
                </div>
                <button onClick={() => onStart(name, topic)} disabled={!name.trim()} className="w-full py-4 md:py-5 bg-indigo-600 disabled:bg-slate-300 text-white font-black text-xl md:text-2xl rounded-[2rem] shadow-xl hover:scale-105 active:scale-95 transition-all">Bắt đầu ngay! 🚀</button>
            </div>
        </div>
    );
};

const GameView = ({ playerName, word, index, total, score, topicName, onCorrect, onIncorrect, onNext, onChangeTopic }) => {
    const [scrambled, setScrambled] = useState([]);
    const [answer, setAnswer] = useState([]);
    const [status, setStatus] = useState('playing');
    const [spellingIdx, setSpellingIdx] = useState(null);
    const [hint, setHint] = useState("");
    const [loadingHint, setLoadingHint] = useState(false);
    const [voiceSettings, setVoiceSettings] = useState({ voiceURI: '', rate: 1.0 });

    const clean = useMemo(() => stripEmoji(word.english), [word.english]);
    const emoji = useMemo(() => getEmoji(word.english), [word.english]);

    useEffect(() => {
        const load = () => {
            const v = window.speechSynthesis.getVoices().filter(x => x.lang.startsWith('en'));
            if (v.length > 0) setVoiceSettings(s => ({ ...s, voiceURI: v[0].voiceURI }));
        };
        load(); window.speechSynthesis.onvoiceschanged = load;
    }, []);

    useEffect(() => {
        setStatus('playing'); setScrambled(scramblePhrase(clean)); setAnswer([]); setSpellingIdx(null); setHint("");
        speak(clean, voiceSettings.rate, voiceSettings.voiceURI);
    }, [word]);

    const handleLetter = (l) => {
        if (status !== 'playing') return;
        const newAns = [...answer, l]; setAnswer(newAns);
        setScrambled(scrambled.map(g => g.map(x => x.id === l.id ? { ...x, used: true } : x)));
        if (newAns.length === clean.replace(/\s/g, '').length) check(newAns);
    };

    const undoLetter = (l) => {
        if (status !== 'playing') return;
        setAnswer(answer.filter(x => x.id !== l.id));
        setScrambled(scrambled.map(g => g.map(x => x.id === l.id ? { ...x, used: false } : x)));
    };

    const check = (ans) => {
        setStatus('checking');
        if (ans.map(x => x.char).join('').toLowerCase() === clean.replace(/\s/g, '').toLowerCase()) {
            setStatus('correct'); onCorrect(10);
            setTimeout(() => spellAndSpeak(clean, voiceSettings.rate, voiceSettings.voiceURI, setSpellingIdx, () => setTimeout(onNext, 600)), 300);
        } else {
            setStatus('wrong'); onIncorrect(word);
            setTimeout(() => { setAnswer([]); setScrambled(s => s.map(g => g.map(x => ({ ...x, used: false })))); setStatus('playing'); }, 1000);
        }
    };

    return (
        <div className="p-6 md:p-8 flex flex-col h-full relative select-none">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">Bé: {playerName}</p>
                    <p className="text-xl font-black text-indigo-600">Điểm: {score}</p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">Tiến trình {topicName.split(':')[0]}</p>
                    <p className="text-sm font-black text-slate-700 bg-slate-100 px-3 py-1 rounded-full">{index + 1} / {total}</p>
                </div>
            </div>
            <div className="progress-container mb-8 shadow-inner border border-white/50">
                <div className="progress-bar" style={{ width: `${((index + 1) / total) * 100}%` }}></div>
            </div>
            <div className="flex-grow flex flex-col items-center justify-center space-y-6">
                <div className="text-center">
                    <p className="text-slate-400 text-xs font-black uppercase mb-1 tracking-widest">Nghĩa là:</p>
                    <h2 className="text-3xl font-black text-slate-800 flex items-center justify-center gap-3">
                        {word.vietnamese} <span className="text-4xl animate-float">{emoji}</span>
                    </h2>
                    {hint && <p className="mt-3 text-indigo-600 font-bold italic bg-indigo-50 px-4 py-2 rounded-2xl border-2 border-indigo-100 pop">"{hint}"</p>}
                </div>
                <div className={`w-full max-w-lg min-h-[100px] p-5 bg-indigo-50/40 rounded-[2.5rem] border-4 border-dashed flex flex-wrap items-center justify-center gap-2 transition-all ${status === 'wrong' ? 'border-pink-400 shake' : (status === 'correct' ? 'border-emerald-400' : 'border-indigo-100')}`}>
                    {status === 'correct' ? clean.split('').map((c, i) => c === ' ' ? <div key={i} className="w-4" /> : <span key={i} className={`text-4xl font-black ${i === spellingIdx ? 'text-indigo-600 scale-125' : 'text-slate-800'} transition-all`}>{c}</span>)
                    : answer.length === 0 ? <span className="text-indigo-200 font-black italic pop">Bé chạm chữ cái ở dưới nhé!</span>
                    : answer.map(l => <button key={l.id} onClick={() => undoLetter(l)} className="text-4xl font-black text-indigo-700 hover:text-pink-500 transition-all active:scale-90">{l.char}</button>)}
                </div>
                {status === 'playing' && (
                    <div className="flex flex-col items-center gap-3 w-full py-2">
                        {scrambled.map((g, gi) => (
                            <div key={gi} className="flex flex-wrap justify-center gap-2">
                                {g.map(l => <button key={l.id} onClick={() => handleLetter(l)} disabled={l.used} className="letter-btn w-12 h-12 md:w-14 md:h-14 bg-white border-2 border-indigo-100 rounded-2xl text-xl font-black text-indigo-600 disabled:opacity-20 shadow-sm">{l.char}</button>)}
                            </div>
                        ))}
                    </div>
                )}
                <div className="flex flex-wrap justify-center gap-3 pt-4">
                    <button onClick={() => speak(clean, voiceSettings.rate, voiceSettings.voiceURI)} className="px-6 py-3 bg-indigo-100 text-indigo-600 font-black rounded-2xl hover:bg-indigo-200 transition-all">🔊 Nghe</button>
                    <button onClick={async () => { setLoadingHint(true); setHint(await getAIHint(clean, word.vietnamese)); setLoadingHint(false); }} disabled={loadingHint || !!hint} className="px-6 py-3 bg-purple-100 text-purple-600 font-black rounded-2xl hover:bg-purple-200 transition-all disabled:opacity-50">✨ Gợi ý</button>
                    <button onClick={onChangeTopic} className="px-6 py-3 bg-amber-100 text-amber-700 font-black rounded-2xl hover:bg-amber-200 transition-all">📂 Đổi đề</button>
                </div>
            </div>
        </div>
    );
};

const ResultScreen = ({ stats, topicName, onRestart, onRetry }) => {
    const acc = Math.round((stats.correctCount / (stats.correctCount + stats.incorrectCount)) * 100) || 0;
    return (
        <div className="p-10 text-center flex flex-col items-center justify-center h-full pop">
            <div className="text-7xl mb-6 animate-float">🏆</div>
            <h2 className="text-4xl font-black text-indigo-600 mb-2">Hoàn Thành!</h2>
            <p className="text-slate-500 font-bold mb-8 italic">Bé đã học xong bài: {topicName}</p>
            <div className="grid grid-cols-2 gap-4 w-full max-w-sm mb-8">
                <div className="p-5 bg-indigo-50 rounded-3xl border-2 border-indigo-100"><p className="text-xs font-black text-indigo-400">ĐIỂM</p><p className="text-3xl font-black text-indigo-600">{stats.score}</p></div>
                <div className="p-5 bg-emerald-50 rounded-3xl border-2 border-emerald-100"><p className="text-xs font-black text-emerald-400">ĐÚNG</p><p className="text-3xl font-black text-emerald-600">{acc}%</p></div>
            </div>
            <div className="flex flex-col gap-3 w-full max-w-xs">
                <button onClick={onRestart} className="py-5 bg-indigo-600 text-white font-black text-xl rounded-[2rem] shadow-lg hover:bg-indigo-700 transition-all hover:scale-105">Học bài mới 🚀</button>
                {stats.incorrectWords.length > 0 && <button onClick={onRetry} className="py-4 bg-white border-4 border-indigo-100 text-indigo-600 font-black rounded-3xl hover:bg-indigo-50 transition-all">Luyện từ chưa thuộc ({stats.incorrectWords.length})</button>}
            </div>
        </div>
    );
};

// --- MAIN APP ---
const App = () => {
    const [state, setState] = useState('START');
    const [name, setName] = useState('Bé yêu');
    const [words, setWords] = useState([]);
    const [topic, setTopic] = useState("");
    const [idx, setIdx] = useState(0);
    const [stats, setStats] = useState({ score: 0, correctCount: 0, incorrectCount: 0, incorrectWords: [] });

    const handleStart = (n, t) => {
        setName(n || "Bé"); setTopic(t); setWords(shuffleArray(VOCABULARY_SETS[t]));
        setIdx(0); setStats({ score: 0, correctCount: 0, incorrectCount: 0, incorrectWords: [] }); setState('PLAYING');
    };

    return (
        <main className="min-h-screen flex items-center justify-center p-4">
            <div className="kids-card w-full max-w-2xl min-h-[600px] flex flex-col overflow-hidden">
                {state === 'START' && <StartScreen onStart={handleStart} initialName={name} />}
                {state === 'PLAYING' && words.length > 0 && (
                    <GameView playerName={name} word={words[idx]} index={idx} total={words.length} score={stats.score} topicName={topic}
                        onCorrect={(p) => setStats(s => ({ ...s, score: s.score + p, correctCount: s.correctCount + 1 }))}
                        onIncorrect={(w) => setStats(s => ({ ...s, incorrectCount: s.incorrectCount + 1, incorrectWords: s.incorrectWords.some(x => x.english === w.english) ? s.incorrectWords : [...s.incorrectWords, w] }))}
                        onNext={() => idx < words.length - 1 ? setIdx(idx + 1) : setState('FINISHED')}
                        onChangeTopic={() => setState('START')} />
                )}
                {state === 'FINISHED' && <ResultScreen stats={stats} topicName={topic} onRestart={() => setState('START')} onRetry={() => { setWords(shuffleArray(stats.incorrectWords)); setIdx(0); setStats(s => ({ ...s, incorrectWords: [] })); setState('PLAYING'); }} />}
            </div>
        </main>
    );
};

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
