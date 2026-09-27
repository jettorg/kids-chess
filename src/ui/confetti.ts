/** 이겼을 때 터지는 색종이 효과 */

const COLORS = ['#ffd166', '#ef476f', '#06d6a0', '#118ab2', '#f78c6b', '#c77dff'];

interface Bit {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  spin: number;
  angle: number;
  color: string;
}

export function celebrate(host: HTMLElement, durationMs = 2600): void {
  if (typeof window === 'undefined') return;
  const canvas = document.createElement('canvas');
  canvas.className = 'confetti';
  host.appendChild(canvas);
  const g = canvas.getContext('2d');
  if (!g) {
    canvas.remove();
    return;
  }

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const resize = () => {
    canvas.width = host.clientWidth * dpr;
    canvas.height = host.clientHeight * dpr;
  };
  resize();

  const bits: Bit[] = Array.from({ length: 140 }, () => ({
    x: Math.random() * canvas.width,
    y: -Math.random() * canvas.height * 0.4,
    vx: (Math.random() - 0.5) * 2.4 * dpr,
    vy: (1.4 + Math.random() * 2.6) * dpr,
    size: (5 + Math.random() * 7) * dpr,
    spin: (Math.random() - 0.5) * 0.3,
    angle: Math.random() * Math.PI,
    color: COLORS[Math.floor(Math.random() * COLORS.length)]!,
  }));

  const started = performance.now();
  let raf = 0;

  const frame = (now: number) => {
    const elapsed = now - started;
    g.clearRect(0, 0, canvas.width, canvas.height);
    for (const bit of bits) {
      bit.x += bit.vx;
      bit.y += bit.vy;
      bit.vy += 0.03 * dpr;
      bit.angle += bit.spin;
      g.save();
      g.translate(bit.x, bit.y);
      g.rotate(bit.angle);
      g.fillStyle = bit.color;
      g.globalAlpha = Math.max(0, 1 - elapsed / durationMs);
      g.fillRect(-bit.size / 2, -bit.size / 4, bit.size, bit.size / 2);
      g.restore();
    }
    if (elapsed < durationMs) {
      raf = requestAnimationFrame(frame);
    } else {
      cancelAnimationFrame(raf);
      canvas.remove();
    }
  };
  raf = requestAnimationFrame(frame);
}
