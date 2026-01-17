
export interface WordItem {
  english: string;
  vietnamese: string;
}

export interface Letter {
  char: string;
  id: number;
  used: boolean;
}

export enum GameState {
  START = 'START',
  PLAYING = 'PLAYING',
  FINISHED = 'FINISHED'
}

export interface UserStats {
  score: number;
  correctCount: number;
  incorrectCount: number;
  incorrectWords: WordItem[];
}

export interface VoiceSettings {
  voiceURI: string;
  readingRate: number;
  spellingRate: number;
}
