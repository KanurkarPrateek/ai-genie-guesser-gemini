
export enum GamePhase {
  CATEGORY_SELECT = 'CATEGORY_SELECT',
  ASKING = 'ASKING',
  GUESSING = 'GUESSING',
  REVEALING = 'REVEALING',
  WON = 'WON',
  LOST = 'LOST',
}

export enum Answer {
  YES = 'Yes',
  NO = 'No',
  PROBABLY = 'Probably',
  DONT_KNOW = "Don't Know",
}

export interface HistoryItem {
  question: string;
  answer: Answer | null;
}

export interface GeminiResponse {
    action: 'ask' | 'guess';
    payload: string;
    confidence: number;
    topGuess: string;
    reasoning: string;
}
