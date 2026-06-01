import { CvData } from './cv';

export interface TranslationResult {
  translated: CvData;
  tokensUsed: number;
  promptTokens?: number;
  completionTokens?: number;
}

export interface TranslationStatus {
  tokensUsed: number | null;
  elapsedTime: number | null;
  payloadSize: number | null;
  charCount: number | null;
  model: string;
  promptTokens: number | null;
  completionTokens: number | null;
  mode: TranslationStatusMode | null;
}

export interface TranslationError {
  message: string;
  canRetry: boolean;
  canUseFallback: boolean;
}

export type TranslationMode = 'ai' | 'mock';
export type TranslationStatusMode = TranslationMode | 'cache';

export interface TranslationCache {
  [key: string]: CvData;
}
