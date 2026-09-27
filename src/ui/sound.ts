/** 오디오 파일 없이 WebAudio 로 만드는 효과음 */

type Kind = 'move' | 'capture' | 'check' | 'castle' | 'win' | 'nope' | 'star';

let context: AudioContext | null = null;
let enabled = true;

function ctx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!context) {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    context = new Ctor();
  }
  if (context.state === 'suspended') void context.resume();
  return context;
}

export function setSoundEnabled(value: boolean): void {
  enabled = value;
}

export function isSoundEnabled(): boolean {
  return enabled;
}

interface ToneOptions {
  freq: number;
  to?: number;
  start?: number;
  duration?: number;
  type?: OscillatorType;
  gain?: number;
}

function tone({ freq, to, start = 0, duration = 0.12, type = 'triangle', gain = 0.16 }: ToneOptions): void {
  const audio = ctx();
  if (!audio) return;
  const t0 = audio.currentTime + start;
  const osc = audio.createOscillator();
  const amp = audio.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (to && to !== freq) osc.frequency.exponentialRampToValueAtTime(to, t0 + duration);
  amp.gain.setValueAtTime(0.0001, t0);
  amp.gain.exponentialRampToValueAtTime(gain, t0 + 0.012);
  amp.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(amp).connect(audio.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.02);
}

export function play(kind: Kind): void {
  if (!enabled) return;
  switch (kind) {
    case 'move':
      tone({ freq: 620, to: 430, duration: 0.09, gain: 0.12 });
      break;
    case 'capture':
      tone({ freq: 240, to: 90, duration: 0.18, type: 'square', gain: 0.14 });
      tone({ freq: 700, to: 300, duration: 0.07, gain: 0.08 });
      break;
    case 'castle':
      tone({ freq: 400, duration: 0.07 });
      tone({ freq: 540, start: 0.08, duration: 0.09 });
      break;
    case 'check':
      tone({ freq: 880, duration: 0.11, type: 'sine', gain: 0.17 });
      tone({ freq: 1180, start: 0.1, duration: 0.14, type: 'sine', gain: 0.15 });
      break;
    case 'star':
      tone({ freq: 880, duration: 0.08, type: 'sine' });
      tone({ freq: 1320, start: 0.07, duration: 0.1, type: 'sine' });
      break;
    case 'win': {
      const notes = [523, 659, 784, 1046];
      notes.forEach((freq, i) => tone({ freq, start: i * 0.11, duration: 0.24, type: 'sine', gain: 0.16 }));
      break;
    }
    case 'nope':
      tone({ freq: 200, to: 150, duration: 0.14, type: 'sawtooth', gain: 0.09 });
      break;
  }
}
