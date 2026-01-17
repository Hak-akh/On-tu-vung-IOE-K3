
import { EMOJI_REGEX } from '../constants';
import { Letter } from '../types';

export const stripEmoji = (str: string): string => str.replace(EMOJI_REGEX, '').trim();
export const getEmoji = (str: string): string => (str.match(EMOJI_REGEX) || []).join('');

export const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const scramblePhrase = (phrase: string): Letter[][] => {
  let letterIdCounter = 0;
  const cleanPhrase = phrase.replace(/[^a-zA-Z\s-]/g, '');

  return cleanPhrase.split(' ').map(word => {
    if (!word) return [];
    let scrambledChars;
    do {
      scrambledChars = shuffleArray(word.split(''));
    } while (scrambledChars.join('') === word && word.length > 1);
    
    return scrambledChars.map(char => ({
      char,
      id: letterIdCounter++,
      used: false,
    }));
  }).filter(wordArray => wordArray.length > 0);
};
