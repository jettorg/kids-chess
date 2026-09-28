import type { Color, PieceType } from '../engine/types';
import type { AiLevel } from '../ai/ai';

export type Opponent = 'human' | AiLevel;

export interface Settings {
  sound: boolean;
  coords: boolean;
  opponent: Opponent;
  playerColor: Color;
  flipped: boolean;
}

export interface Progress {
  lessons: string[];
  puzzles: string[];
  /** 마지막으로 보던 퍼즐 (다시 열면 이어서) */
  puzzleIndex?: number;
  /** 추천 문제를 고를 때 쓰는 목표 난이도. 풀면 올라가고 틀리면 내려간다. */
  puzzleTarget?: number;
}

export interface SavedGame {
  start?: string;
  moves?: { from: number; to: number; promotion?: PieceType }[];
}

export const SETTINGS_KEY = 'kids-chess.settings.v1';
export const PROGRESS_KEY = 'kids-chess.progress.v1';
export const SAVE_KEY = 'kids-chess.game.v1';

export const DEFAULT_SETTINGS: Settings = {
  sound: true,
  coords: true,
  opponent: 1,
  playerColor: 'w',
  flipped: false,
};

/** localStorage 에서 읽는다. 없거나 깨져 있으면 기본값. */
export function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return { ...fallback, ...(JSON.parse(raw) as T) };
  } catch {
    return fallback;
  }
}

/** localStorage 에 쓴다. 저장이 막혀 있어도 게임은 계속된다. */
export function save(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // 무시
  }
}
