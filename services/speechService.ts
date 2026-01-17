
// Khai báo một mảng để giữ tham chiếu đến các utterance hiện tại, tránh bị Garbage Collected làm mất sự kiện onend/onerror
let activeUtterances: SpeechSynthesisUtterance[] = [];

export const speak = (
  text: string, 
  rate: number = 1.0, 
  voiceURI?: string,
  lang: string = 'en-US'
) => {
  if (!('speechSynthesis' in window)) return;
  
  window.speechSynthesis.cancel();
  activeUtterances = [];

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = Math.max(0.5, Math.min(3.0, rate));
  
  if (voiceURI) {
    const voices = window.speechSynthesis.getVoices();
    const selectedVoice = voices.find(v => v.voiceURI === voiceURI);
    if (selectedVoice) utterance.voice = selectedVoice;
  }

  activeUtterances.push(utterance);
  utterance.onend = () => {
    activeUtterances = activeUtterances.filter(u => u !== utterance);
  };
  
  window.speechSynthesis.speak(utterance);
};

export const spellAndSpeak = (
  word: string, 
  rate: number = 1.0,
  voiceURI: string | undefined,
  onLetter: (index: number | null) => void, 
  onEnd: () => void
) => {
  if (!('speechSynthesis' in window)) {
    onEnd();
    return;
  }

  window.speechSynthesis.cancel();
  activeUtterances = [];
  
  const voices = window.speechSynthesis.getVoices();
  const selectedVoice = voiceURI ? voices.find(v => v.voiceURI === voiceURI) : null;

  // Tìm các vị trí hiển thị của các chữ cái (bỏ qua dấu cách và gạch ngang)
  const letterVisualIndices: number[] = [];
  word.split('').forEach((char, index) => {
    if (char.trim() !== '' && char !== '-') {
      letterVisualIndices.push(index);
    }
  });
  
  const lettersToSpell = word.replace(/[\s-]/g, '').split('');
  let audioLetterIndex = 0;
  let isFinished = false;
  
  // Cơ chế bảo vệ thời gian thực
  const safetyTimer = setTimeout(() => {
    if (!isFinished) {
      console.warn("Speech spellAndSpeak safety timeout");
      isFinished = true;
      window.speechSynthesis.cancel();
      onEnd();
    }
  }, lettersToSpell.length * 1000 + 3000);

  const cleanup = () => {
    if (isFinished) return;
    isFinished = true;
    clearTimeout(safetyTimer);
    activeUtterances = [];
    onEnd();
  };

  const speakNextLetter = () => {
    if (isFinished) return;

    if (audioLetterIndex < lettersToSpell.length) {
      const visualIndex = letterVisualIndices[audioLetterIndex];
      onLetter(visualIndex);
      
      const utterance = new SpeechSynthesisUtterance(lettersToSpell[audioLetterIndex]);
      utterance.lang = 'en-US';
      utterance.rate = Math.max(1.0, Math.min(4.0, rate * 2.8));
      if (selectedVoice) utterance.voice = selectedVoice;
      
      activeUtterances.push(utterance);

      utterance.onend = () => {
        activeUtterances = activeUtterances.filter(u => u !== utterance);
        audioLetterIndex++;
        setTimeout(speakNextLetter, 50 / rate);
      };
      
      utterance.onerror = (e) => {
        console.warn("Spell letter error:", e.error);
        activeUtterances = activeUtterances.filter(u => u !== utterance);
        if (e.error === 'interrupted' || e.error === 'canceled') {
          isFinished = true;
          return;
        }
        audioLetterIndex++;
        setTimeout(speakNextLetter, 10);
      };

      window.speechSynthesis.speak(utterance);
    } else {
      onLetter(null);
      const fullWordUtterance = new SpeechSynthesisUtterance(word);
      fullWordUtterance.lang = 'en-US';
      fullWordUtterance.rate = Math.max(0.5, Math.min(3.0, rate));
      if (selectedVoice) fullWordUtterance.voice = selectedVoice;
      
      activeUtterances.push(fullWordUtterance);
      fullWordUtterance.onend = cleanup;
      fullWordUtterance.onerror = cleanup;

      setTimeout(() => {
        if (!isFinished) window.speechSynthesis.speak(fullWordUtterance);
      }, 200);
    }
  };

  if (lettersToSpell.length === 0) {
    cleanup();
  } else {
    speakNextLetter();
  }
};
