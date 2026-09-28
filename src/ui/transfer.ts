import type { Progress } from './storage';

/**
 * 진행 기록을 다른 기기로 옮기기 위한 짧은 코드.
 * 서버 없이 복사·붙여넣기로 옮긴다. 형식: KC1.<base64url(JSON)>.<검사합>
 */

const PREFIX = 'KC1';

function checksum(text: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(36);
}

function toBase64Url(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(text: string): string {
  const padded = text.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (text.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function encodeProgress(progress: Progress): string {
  const payload = toBase64Url(
    JSON.stringify({
      l: progress.lessons,
      p: progress.puzzles,
      i: progress.puzzleIndex ?? 0,
      t: progress.puzzleTarget ?? 450,
    }),
  );
  return `${PREFIX}.${payload}.${checksum(payload)}`;
}

/** 코드를 읽는다. 형식이 틀리거나 검사합이 안 맞으면 null. */
export function decodeProgress(code: string): Progress | null {
  const parts = code.trim().split('.');
  if (parts.length !== 3 || parts[0] !== PREFIX) return null;
  const [, payload, sum] = parts;
  if (!payload || checksum(payload) !== sum) return null;
  try {
    const raw = JSON.parse(fromBase64Url(payload)) as { l?: unknown; p?: unknown; i?: unknown; t?: unknown };
    const strings = (v: unknown): string[] => (Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : []);
    return {
      lessons: strings(raw.l),
      puzzles: strings(raw.p),
      puzzleIndex: typeof raw.i === 'number' ? raw.i : 0,
      puzzleTarget: typeof raw.t === 'number' ? raw.t : 450,
    };
  } catch {
    return null;
  }
}

/** 두 기기의 기록을 합친다: 푼 문제는 합집합, 목표 난이도는 높은 쪽, 위치는 가져온 쪽. */
export function mergeProgress(current: Progress, incoming: Progress): Progress {
  return {
    lessons: Array.from(new Set([...current.lessons, ...incoming.lessons])),
    puzzles: Array.from(new Set([...current.puzzles, ...incoming.puzzles])),
    puzzleIndex: incoming.puzzleIndex ?? current.puzzleIndex ?? 0,
    puzzleTarget: Math.max(current.puzzleTarget ?? 450, incoming.puzzleTarget ?? 450),
  };
}
