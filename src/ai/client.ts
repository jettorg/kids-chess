import type { Position } from '../engine/types';
import { toFen } from '../engine/position';
import { chooseMove, suggestMove, type AiLevel } from './ai';
import type { AiRequest, AiResponse, MoveRef } from './worker';

/**
 * 앱에서 쓰는 컴퓨터 상대 창구. Web Worker 가 있으면 거기서, 없으면
 * (테스트 환경이나 아주 오래된 브라우저) 메인 스레드에서 탐색한다.
 */
export class AiClient {
  private worker: Worker | null = null;
  private seq = 0;
  private pending = new Map<number, (move: MoveRef | null) => void>();

  constructor() {
    try {
      if (typeof Worker !== 'undefined') {
        this.worker = new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' });
        this.worker.onmessage = (event: MessageEvent<AiResponse>) => {
          const resolve = this.pending.get(event.data.id);
          if (!resolve) return;
          this.pending.delete(event.data.id);
          resolve(event.data.move);
        };
        this.worker.onerror = () => {
          // Worker 가 죽으면 이후 요청은 메인 스레드에서 처리한다.
          this.worker = null;
          for (const [id] of this.pending) this.pending.delete(id);
        };
      }
    } catch {
      this.worker = null;
    }
  }

  get usesWorker(): boolean {
    return this.worker !== null;
  }

  private request(kind: AiRequest['kind'], pos: Position, level?: AiLevel): Promise<MoveRef | null> {
    const id = ++this.seq;
    if (!this.worker) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const move = kind === 'choose' ? chooseMove(pos, { level: level ?? 1 }) : suggestMove(pos);
          resolve(move ? { from: move.from, to: move.to, ...(move.promotion ? { promotion: move.promotion } : {}) } : null);
        }, 0);
      });
    }
    return new Promise((resolve) => {
      this.pending.set(id, resolve);
      this.worker!.postMessage({ id, kind, fen: toFen(pos), ...(level ? { level } : {}) } satisfies AiRequest);
    });
  }

  choose(pos: Position, level: AiLevel): Promise<MoveRef | null> {
    return this.request('choose', pos, level);
  }

  suggest(pos: Position): Promise<MoveRef | null> {
    return this.request('suggest', pos);
  }
}
