import { ko } from './ko';
import { en } from './en';

export type Locale = 'ko' | 'en';
export type Messages = typeof ko;

/** 언어 선택 버튼에 보여줄 목록 (각 언어 이름은 그 언어로 표기) */
export const LOCALES: { code: Locale; label: string }[] = [
  { code: 'ko', label: '한국어' },
  { code: 'en', label: 'English' },
];

/** 데이터 파일에서 언어별 값을 함께 담을 때 쓰는 모양 */
export interface Localized<T = string> {
  ko: T;
  en: T;
}

const STORAGE_KEY = 'kids-chess.locale.v1';
const dictionaries: Record<Locale, Messages> = { ko, en };

function detectLocale(): Locale {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'ko' || saved === 'en') return saved;
  } catch {
    // 저장소를 못 읽으면 브라우저 언어로 결정한다.
  }
  const language = typeof navigator !== 'undefined' ? navigator.language : 'ko';
  return language.toLowerCase().startsWith('ko') ? 'ko' : 'en';
}

let current: Locale = detectLocale();

export function getLocale(): Locale {
  return current;
}

export function setLocale(locale: Locale): void {
  current = locale;
  try {
    localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    // 저장이 막혀 있어도 이번 세션에는 적용된다.
  }
  if (typeof document !== 'undefined') document.documentElement.lang = locale;
}

type Args<K extends keyof Messages> = Messages[K] extends (...args: infer A) => string ? A : [];

/** 현재 언어의 문구를 돌려준다. 함수형 문구는 인자를 받는다. */
export function t<K extends keyof Messages>(key: K, ...args: Args<K>): string {
  const value = dictionaries[current][key];
  if (typeof value === 'function') {
    return (value as (...a: unknown[]) => string)(...args);
  }
  return value;
}

/** { ko, en } 묶음에서 현재 언어의 값을 고른다. */
export function L<T>(value: Localized<T>): T {
  return value[current];
}
