
import { Answer } from './types';

export const CATEGORIES: string[] = [
  'Person',
  'Object',
  'Animal',
  'Movie',
  'Fictional Character',
];

export const RESPONSE_OPTIONS: Answer[] = [
  Answer.YES,
  Answer.NO,
  Answer.PROBABLY,
  Answer.DONT_KNOW,
];

export const MAX_QUESTIONS = 20;
