/** 한글 조사 처리 — "폰으로", "나이트로" 처럼 받침에 맞는 조사를 고른다. */

const HANGUL_START = 0xac00;
const HANGUL_END = 0xd7a3;
const RIEUL = 8;

function finalConsonant(word: string): number | null {
  if (!word) return null;
  const code = word.charCodeAt(word.length - 1);
  if (code < HANGUL_START || code > HANGUL_END) return null;
  return (code - HANGUL_START) % 28;
}

/** 으로 / 로 */
export function euro(word: string): string {
  const final = finalConsonant(word);
  const needsEu = final !== null && final !== 0 && final !== RIEUL;
  return `${word}${needsEu ? '으로' : '로'}`;
}

/** 을 / 를 */
export function eul(word: string): string {
  const final = finalConsonant(word);
  return `${word}${final !== null && final !== 0 ? '을' : '를'}`;
}
