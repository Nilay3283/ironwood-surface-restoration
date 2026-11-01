/**
 * Procedural stone texture & interior scene engine.
 *
 * Generates realistic marble, travertine, limestone and granite surfaces on
 * <canvas>, then composes them into lit architectural "renders" used as
 * clearly-labelled demonstration imagery until real project photos are supplied.
 */

export type Material = 'calacatta' | 'statuario' | 'nero' | 'travertine' | 'limestone' | 'granite' | 'emperador';

type RGB = [number, number, number];

// ---------------------------------------------------------------- noise
function mulberry32(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeNoise(seed: number) {
  const rand = mulberry32(seed);
  const perm = new Uint8Array(512);
  const grad = new Float32Array(256);
  for (let i = 0; i < 256; i++) { perm[i] = i; grad[i] = rand(); }
  for (let i = 255; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [perm[i], perm[j]] = [perm[j], perm[i]]; }
  for (let i = 0; i < 256; i++) perm[i + 256] = perm[i];
  const v = (x: number, y: number) => grad[perm[(x & 255) + perm[y & 255]]];
  const noise = (x: number, y: number) => {
    const xi = Math.floor(x), yi = Math.floor(y);
    const xf = x - xi, yf = y - yi;
    const u = xf * xf * (3 - 2 * xf), w = yf * yf * (3 - 2 * yf);
    const a = v(xi, yi), b = v(xi + 1, yi), c = v(xi, yi + 1), d = v(xi + 1, yi + 1);
    return a + (b - a) * u + (c - a) * w + (a - b - c + d) * u * w;
  };
  const fbm = (x: number, y: number, oct = 5) => {
    let s = 0, amp = 0.5, f = 1, n = 0;
    for (let i = 0; i < oct; i++) { s += amp * noise(x * f, y * f); n += amp; amp *= 0.5; f *= 2.03; }
    return s / n;
  };
  const turb = (x: number, y: number, oct = 6) => {
    let s = 0, amp = 0.5, f = 1, n = 0;
    for (let i = 0; i < oct; i++) { s += amp * Math.abs(noise(x * f, y * f) * 2 - 1); n += amp; amp *= 0.5; f *= 2.01; }
    return s / n;
  };
  return { noise, fbm, turb, rand };
}

const mix = (a: RGB, b: RGB, t: number): RGB => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);

function canvas(w: number, h: number) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  return c;
}

// ---------------------------------------------------------------- materials
interface MarbleSpec { base: RGB; cloud: RGB; vein: RGB; vein2: RGB; freq: number; warp: number; sharp: number; angle: number }

const MARBLES: Record<string, MarbleSpec> = {
  calacatta: { base: [246, 243, 236], cloud: [228, 222, 210], vein: [150, 128, 96], vein2: [118, 112, 106], freq: 2.2, warp: 5.5, sharp: 10, angle: 0.65 },
  statuario: { base: [244, 244, 242], cloud: [226, 226, 226], vein: [96, 98, 104], vein2: [150, 150, 156], freq: 2.8, warp: 6.5, sharp: 14, angle: 0.4 },
  nero: { base: [22, 22, 24], cloud: [36, 35, 36], vein: [226, 222, 214], vein2: [176, 150, 108], freq: 2.4, warp: 6, sharp: 18, angle: 0.9 },
  emperador: { base: [92, 66, 48], cloud: [70, 50, 36], vein: [206, 178, 140], vein2: [132, 100, 74], freq: 3.4, warp: 7, sharp: 9, angle: 1.2 },
};

function marble(size: number, spec: MarbleSpec, seed: number) {
  const c = canvas(size, size);
  const ctx = c.getContext('2d')!;
  const img = ctx.createImageData(size, size);
  const { fbm, turb } = makeNoise(seed);
  const ca = Math.cos(spec.angle), sa = Math.sin(spec.angle);
  const s = 4 / size;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const nx = x * s, ny = y * s;
      const cloud = fbm(nx * 0.8 + 11, ny * 0.8 + 3, 4);
      let col = mix(spec.base, spec.cloud, clamp01((cloud - 0.35) * 2.2));
      const t = (nx * ca + ny * sa) * spec.freq + turb(nx * 0.9, ny * 0.9) * spec.warp;
      const v1 = Math.pow(1 - Math.abs(Math.sin(t)), spec.sharp);
      const t2 = (nx * sa - ny * ca) * spec.freq * 2.2 + turb(nx * 1.7 + 40, ny * 1.7) * spec.warp * 1.4;
      const v2 = Math.pow(1 - Math.abs(Math.sin(t2)), spec.sharp * 2.6) * 0.55;
      const veinMask = fbm(nx * 0.5 + 70, ny * 0.5, 3); // veins fade in and out
      col = mix(col, spec.vein2, clamp01(v2 * (0.4 + veinMask)));
      col = mix(col, spec.vein, clamp01(v1 * (0.25 + veinMask * 1.2)));
      const grain = (fbm(nx * 40, ny * 40, 2) - 0.5) * 6;
      const i = (y * size + x) * 4;
      img.data[i] = col[0] + grain; img.data[i + 1] = col[1] + grain; img.data[i + 2] = col[2] + grain; img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return c;
}

function travertine(size: number, seed: number) {
  const c = canvas(size, size);
  const ctx = c.getContext('2d')!;
  const img = ctx.createImageData(size, size);
  const { fbm, rand } = makeNoise(seed);
  const a: RGB = [222, 206, 182], b: RGB = [196, 176, 148], d: RGB = [238, 228, 210];
  const s = 4 / size;
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const nx = x * s, ny = y * s;
    const band = fbm(nx * 0.35, ny * 5 + fbm(nx * 2, ny * 2) * 1.6, 5);
    let col = mix(a, b, clamp01((band - 0.4) * 2.4));
    col = mix(col, d, clamp01((fbm(nx * 3 + 9, ny * 9, 3) - 0.62) * 3));
    const g = (fbm(nx * 50, ny * 50, 2) - 0.5) * 10;
    const i = (y * size + x) * 4;
    img.data[i] = col[0] + g; img.data[i + 1] = col[1] + g; img.data[i + 2] = col[2] + g; img.data[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  // characteristic elongated pits
  for (let k = 0; k < size * 0.9; k++) {
    const x = rand() * size, y = rand() * size, w = 1 + rand() * size * 0.02, h = 0.5 + rand() * 1.6;
    ctx.fillStyle = `rgba(120,96,66,${0.18 + rand() * 0.3})`;
    ctx.beginPath(); ctx.ellipse(x, y, w, h, 0, 0, Math.PI * 2); ctx.fill();
  }
  return c;
}

function limestone(size: number, seed: number) {
  const c = canvas(size, size);
  const ctx = c.getContext('2d')!;
  const img = ctx.createImageData(size, size);
  const { fbm, rand } = makeNoise(seed);
  const a: RGB = [226, 216, 196], b: RGB = [206, 194, 172];
  const s = 4 / size;
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const nx = x * s, ny = y * s;
    const col = mix(a, b, clamp01((fbm(nx * 1.2, ny * 1.2, 5) - 0.35) * 2));
    const g = (fbm(nx * 60, ny * 60, 2) - 0.5) * 14;
    const i = (y * size + x) * 4;
    img.data[i] = col[0] + g; img.data[i + 1] = col[1] + g; img.data[i + 2] = col[2] + g; img.data[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  for (let k = 0; k < size * 0.15; k++) {
    ctx.fillStyle = `rgba(150,130,100,${0.15 + rand() * 0.2})`;
    ctx.beginPath(); ctx.arc(rand() * size, rand() * size, 0.6 + rand() * 1.8, 0, Math.PI * 2); ctx.fill();
  }
  return c;
}

function granite(size: number, seed: number) {
  const c = canvas(size, size);
  const ctx = c.getContext('2d')!;
  const { rand } = makeNoise(seed);
  ctx.fillStyle = '#2a2826'; ctx.fillRect(0, 0, size, size);
  const pal = ['#0f0f10', '#4a4643', '#77706a', '#a39a90', '#1d1c1c', '#5d4a3c', '#c8bfb2'];
  const count = size * size * 0.09;
  for (let k = 0; k < count; k++) {
    const r = rand();
    ctx.fillStyle = pal[Math.floor(Math.pow(r, 1.4) * pal.length)];
    ctx.globalAlpha = 0.5 + rand() * 0.5;
    const sz = 0.6 + Math.pow(rand(), 3) * 3.4;
    ctx.beginPath(); ctx.ellipse(rand() * size, rand() * size, sz, sz * (0.5 + rand() * 0.6), rand() * 3, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;
  return c;
}

const matCache = new Map<string, HTMLCanvasElement>();

export function material(m: Material, size = 512, seed = 7): HTMLCanvasElement {
  const key = `${m}-${size}-${seed}`;
  const hit = matCache.get(key);
  if (hit) return hit;
  let c: HTMLCanvasElement;
  if (m === 'travertine') c = travertine(size, seed);
  else if (m === 'limestone') c = limestone(size, seed);
  else if (m === 'granite') c = granite(size, seed);
  else c = marble(size, MARBLES[m], seed);
  matCache.set(key, c);
  return c;
}

// ---------------------------------------------------------------- surface treatments
/** Large-format tile field: random crops of a material separated by grout joints. */
export function tileField(m: Material, w: number, h: number, cols: number, groutColor: string, groutPx = 3, seed = 3) {
  const c = canvas(w, h);
  const ctx = c.getContext('2d')!;
  const src = material(m, 512, seed);
  const { rand } = makeNoise(seed + 99);
  const tw = w / cols, rows = Math.ceil(h / tw);
  ctx.fillStyle = groutColor; ctx.fillRect(0, 0, w, h);
  for (let r = 0; r < rows; r++) for (let q = 0; q < cols; q++) {
    const cw = 160 + rand() * 260;
    const sx = rand() * (512 - cw), sy = rand() * (512 - cw);
    ctx.save();
    ctx.translate(q * tw + tw / 2, r * tw + tw / 2);
    if (rand() > 0.5) ctx.rotate(Math.PI / 2);
    ctx.drawImage(src, sx, sy, cw, cw, -tw / 2 + groutPx / 2, -tw / 2 + groutPx / 2, tw - groutPx, tw - groutPx);
    ctx.restore();
  }
  // subtle bevel highlight per tile
  ctx.globalAlpha = 0.18; ctx.strokeStyle = '#fff'; ctx.lineWidth = 1;
  for (let r = 0; r < rows; r++) for (let q = 0; q < cols; q++) ctx.strokeRect(q * tw + groutPx / 2 + 0.5, r * tw + groutPx / 2 + 0.5, tw - groutPx - 1, tw - groutPx - 1);
  ctx.globalAlpha = 1;
  return c;
}

/** Simulates years of wear: etching, scratches, dulled contrast, yellowing and soiled grout. */
export function weather(src: HTMLCanvasElement, opts: { grime?: number; scratches?: number; grid?: { cols: number; grout: number }; seed?: number } = {}) {
  const { grime = 0.6, scratches = 1, grid, seed = 21 } = opts;
  const tw = grid ? src.width / grid.cols : 0, half = grid ? grid.grout / 2 + 1 : 0;
  const w = src.width, h = src.height;
  const c = canvas(w, h);
  const ctx = c.getContext('2d')!;
  ctx.drawImage(src, 0, 0);
  const img = ctx.getImageData(0, 0, w, h);
  const { fbm, rand } = makeNoise(seed);
  const d = img.data;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = (y * w + x) * 4;
    const n = fbm(x / 140, y / 140, 4);
    let r = d[i], g = d[i + 1], b = d[i + 2];
    const lum = (r + g + b) / 3;
    // lose polish: compress contrast toward a muddy mid-tone
    r = lum + (r - lum) * 0.55; g = lum + (g - lum) * 0.55; b = lum + (b - lum) * 0.5;
    r = 128 + (r - 128) * 0.72; g = 128 + (g - 128) * 0.72; b = 128 + (b - 128) * 0.7;
    // yellowed film and blotches
    const blot = clamp01((n - 0.45) * 2.5) * grime;
    r = r * (0.9 - blot * 0.18) + 10; g = g * (0.88 - blot * 0.2) + 6; b = b * (0.8 - blot * 0.24);
    // grout joints soaked with soil
    if (grid) {
      const mx = x % tw, my = y % tw;
      if (mx < half || mx > tw - half || my < half || my > tw - half) {
        const k = 0.5 + fbm(x / 30, y / 30, 3) * 0.5;
        r = 92 * k + 18; g = 74 * k + 12; b = 52 * k + 6;
      }
    }
    d[i] = r; d[i + 1] = g; d[i + 2] = b;
  }
  ctx.putImageData(img, 0, 0);
  // etch rings & scratches
  ctx.strokeStyle = 'rgba(255,255,255,0.10)';
  for (let k = 0; k < 220 * scratches; k++) {
    ctx.lineWidth = 0.4 + rand() * 0.8;
    const x = rand() * w, y = rand() * h, len = 10 + rand() * 90, a = rand() * Math.PI;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + Math.cos(a) * len * 0.5 + rand() * 8, y + Math.sin(a) * len * 0.5, x + Math.cos(a) * len, y + Math.sin(a) * len); ctx.stroke();
  }
  for (let k = 0; k < 14 * scratches; k++) {
    const x = rand() * w, y = rand() * h, r = 8 + rand() * 30;
    const g = ctx.createRadialGradient(x, y, r * 0.6, x, y, r);
    g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(0.8, 'rgba(255,250,235,0.12)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  }
  return c;
}

/** Adds the reflective sheen of a freshly honed & polished surface. */
export function polish(src: HTMLCanvasElement, strength = 1) {
  const w = src.width, h = src.height;
  const c = canvas(w, h);
  const ctx = c.getContext('2d')!;
  ctx.drawImage(src, 0, 0);
  ctx.globalCompositeOperation = 'screen';
  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, 'rgba(255,255,255,0)');
  g.addColorStop(0.42, 'rgba(255,255,255,0)');
  g.addColorStop(0.5, `rgba(255,248,232,${0.22 * strength})`);
  g.addColorStop(0.58, 'rgba(255,255,255,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  const r = ctx.createRadialGradient(w * 0.3, h * 0.2, 0, w * 0.3, h * 0.2, w * 0.6);
  r.addColorStop(0, `rgba(255,244,220,${0.16 * strength})`); r.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = r; ctx.fillRect(0, 0, w, h);
  ctx.globalCompositeOperation = 'source-over';
  return c;
}

// ---------------------------------------------------------------- interior scenes
/** Perspective-correct textured plane facing the viewer (floors, counter tops). */
function plane(ctx: CanvasRenderingContext2D, tex: HTMLCanvasElement, o: { y0: number; y1: number; l0: number; r0: number; l1: number; r1: number; z0: number; z1: number; flip?: boolean }) {
  const { y0, y1, l0, r0, l1, r1, z0, z1 } = o;
  const th = tex.height, tw = tex.width;
  for (let y = Math.floor(y0); y < y1; y++) {
    const t = (y - y0) / (y1 - y0);
    const v = ((1 - t) * 0 / z0 + t * 1 / z1) / ((1 - t) / z0 + t / z1);
    const sy = Math.min(th - 1, Math.max(0, (o.flip ? 1 - v : v) * th));
    const l = l0 + (l1 - l0) * t, r = r0 + (r1 - r0) * t;
    ctx.drawImage(tex, 0, sy, tw, 1, l, y, r - l, 1.5);
  }
}

function cover(ctx: CanvasRenderingContext2D, tex: HTMLCanvasElement, x: number, y: number, w: number, h: number) {
  const s = Math.max(w / tex.width, h / tex.height);
  const sw = w / s, sh = h / s;
  ctx.drawImage(tex, (tex.width - sw) / 2, (tex.height - sh) / 2, sw, sh, x, y, w, h);
}

function spot(ctx: CanvasRenderingContext2D, x: number, y: number, len: number, spread: number, alpha: number) {
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  const g = ctx.createRadialGradient(x, y, 0, x, y + len * 0.4, len);
  g.addColorStop(0, `rgba(255,236,200,${alpha})`);
  g.addColorStop(0.35, `rgba(255,226,180,${alpha * 0.35})`);
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.moveTo(x - 3, y); ctx.lineTo(x + spread, y + len); ctx.lineTo(x - spread, y + len); ctx.closePath(); ctx.fill();
  ctx.fillStyle = `rgba(255,246,226,${Math.min(1, alpha * 2.2)})`;
  ctx.beginPath(); ctx.ellipse(x, y, 5, 2, 0, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

function vignette(ctx: CanvasRenderingContext2D, w: number, h: number, k = 0.75) {
  const g = ctx.createRadialGradient(w / 2, h * 0.45, Math.min(w, h) * 0.25, w / 2, h / 2, Math.max(w, h) * 0.78);
  g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,0,${k})`);
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
}

function panelJoints(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, n: number, vertical = true) {
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  for (let i = 1; i < n; i++) vertical ? ctx.fillRect(x + (w / n) * i, y, 1.2, h) : ctx.fillRect(x, y + (h / n) * i, w, 1.2);
}

export type SceneKind = 'foyer' | 'bath' | 'counter' | 'lobby' | 'hall' | 'detail' | 'grout' | 'slab';

export interface SceneOpts { kind: SceneKind; floor?: Material; wall?: Material; w?: number; h?: number; seed?: number; grout?: string; worn?: boolean }

/** Composes a lit architectural interior from procedural stone. */
export function scene(o: SceneOpts): HTMLCanvasElement {
  const w = o.w ?? 1200, h = o.h ?? 900, seed = o.seed ?? 5;
  const c = canvas(w, h);
  const ctx = c.getContext('2d')!;
  const floorMat = o.floor ?? 'calacatta', wallMat = o.wall ?? 'travertine';

  if (o.kind === 'detail' || o.kind === 'grout' || o.kind === 'slab') {
    // close material studies, raking light from the upper left
    const grid = { cols: 4, grout: Math.max(5, Math.round(w / 110)) };
    let tex: HTMLCanvasElement = o.kind === 'grout'
      ? tileField(floorMat, w, h, grid.cols, o.grout ?? '#d9d2c4', grid.grout, seed)
      : o.kind === 'slab' ? material(floorMat, 1024, seed) : material(floorMat, 512, seed);
    if (o.worn) tex = weather(tex, { grid: o.kind === 'grout' ? grid : undefined, seed });
    else tex = polish(tex, o.kind === 'grout' ? 0.5 : 1);
    cover(ctx, tex, 0, 0, w, h);
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, 'rgba(255,240,215,0.10)'); g.addColorStop(1, 'rgba(0,0,0,0.45)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    vignette(ctx, w, h, 0.4);
    return c;
  }

  const hz = h * (o.kind === 'counter' ? 0.42 : 0.56);
  // ---- wall
  ctx.fillStyle = '#0d0d0d'; ctx.fillRect(0, 0, w, h);
  const wallTex = material(wallMat, 512, seed + 1);
  cover(ctx, wallTex, 0, 0, w, hz);
  const panels = o.kind === 'lobby' ? 3 : o.kind === 'bath' ? 2 : 4;
  panelJoints(ctx, 0, 0, w, hz, panels, o.kind !== 'lobby');
  if (o.kind === 'lobby') panelJoints(ctx, 0, 0, w, hz, 4, true);
  // darken wall to set mood, then paint light
  ctx.fillStyle = wallMat === 'nero' ? 'rgba(0,0,0,0.25)' : 'rgba(10,8,6,0.5)'; ctx.fillRect(0, 0, w, hz);
  const ceil = ctx.createLinearGradient(0, 0, 0, hz * 0.35);
  ceil.addColorStop(0, 'rgba(0,0,0,0.85)'); ceil.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = ceil; ctx.fillRect(0, 0, w, hz * 0.35);

  if (o.kind === 'hall') {
    // pilasters with gold reveals
    for (let i = 0; i < 4; i++) {
      const px = w * (0.12 + i * 0.255);
      ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fillRect(px - 2, 0, 46, hz);
      ctx.fillStyle = 'rgba(182,154,104,0.8)'; ctx.fillRect(px + 44, 0, 1.5, hz);
    }
  }
  const lights = o.kind === 'bath' ? [0.3, 0.7] : o.kind === 'lobby' ? [0.2, 0.4, 0.6, 0.8] : [0.18, 0.5, 0.82];
  lights.forEach((lx) => spot(ctx, w * lx, hz * 0.04, hz * 1.05, w * 0.09, 0.55));

  if (o.kind === 'bath') {
    // backlit mirror & floating vanity
    const mx = w * 0.32, mw = w * 0.36, my = hz * 0.16, mh = hz * 0.5;
    const glow = ctx.createRadialGradient(mx + mw / 2, my + mh / 2, 10, mx + mw / 2, my + mh / 2, mw * 0.8);
    glow.addColorStop(0, 'rgba(255,230,190,0.35)'); glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow; ctx.fillRect(mx - mw * 0.5, my - mh * 0.5, mw * 2, mh * 2);
    ctx.fillStyle = 'rgba(30,30,32,0.9)'; ctx.fillRect(mx, my, mw, mh);
    ctx.strokeStyle = 'rgba(182,154,104,0.9)'; ctx.lineWidth = 2; ctx.strokeRect(mx, my, mw, mh);
    const vt = polish(material('calacatta', 512, seed + 4));
    plane(ctx, vt, { y0: hz * 0.78, y1: hz * 0.86, l0: w * 0.27, r0: w * 0.73, l1: w * 0.25, r1: w * 0.75, z0: 3, z1: 2 });
    ctx.fillStyle = '#e9e3d8'; ctx.fillRect(w * 0.25, hz * 0.86, w * 0.5, hz * 0.05);
    ctx.fillStyle = '#1a1714'; ctx.fillRect(w * 0.25, hz * 0.91, w * 0.5, hz * 0.14);
    ctx.fillStyle = 'rgba(182,154,104,0.7)'; ctx.fillRect(w * 0.25, hz * 0.975, w * 0.5, 1.5);
  }
  if (o.kind === 'lobby') {
    ctx.fillStyle = '#121110'; ctx.fillRect(w * 0.3, hz * 0.62, w * 0.4, hz * 0.38);
    ctx.fillStyle = 'rgba(182,154,104,0.85)'; ctx.fillRect(w * 0.3, hz * 0.62, w * 0.4, 2);
  }

  // ---- floor (or counter top)
  const worn = !!o.worn;
  let floorTex: HTMLCanvasElement = o.kind === 'counter'
    ? material(floorMat, 1024, seed + 2)
    : tileField(floorMat, 1024, 1024, 3, o.grout ?? (floorMat === 'nero' ? '#141414' : '#cfc6b6'), 3, seed + 2);
  floorTex = worn ? weather(floorTex, { seed }) : polish(floorTex, 0.6);

  if (o.kind === 'counter') {
    // backsplash tile above, slab counter with eased edge
    const bs = tileField('statuario', 1024, 512, 8, '#d8d4cc', 2, seed + 5);
    cover(ctx, bs, 0, 0, w, hz);
    ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fillRect(0, 0, w, hz);
    lights.forEach((lx) => spot(ctx, w * lx, 0, hz, w * 0.08, 0.5));
    plane(ctx, floorTex, { y0: hz, y1: h * 0.86, l0: -w * 0.2, r0: w * 1.2, l1: -w * 0.6, r1: w * 1.6, z0: 5, z1: 1 });
    // reflection of backsplash on polished top
    ctx.save(); ctx.globalAlpha = worn ? 0.06 : 0.22; ctx.translate(0, hz * 2); ctx.scale(1, -1);
    ctx.drawImage(c, 0, hz * 0.5, w, hz * 0.5, 0, hz * 0.5, w, hz * 0.5); ctx.restore();
    ctx.drawImage(material(floorMat, 1024, seed + 2), 0, 900, 1024, 60, 0, h * 0.86, w, h * 0.05);
    ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fillRect(0, h * 0.86, w, h * 0.05);
    ctx.fillStyle = '#0e0d0c'; ctx.fillRect(0, h * 0.91, w, h * 0.09);
  } else {
    plane(ctx, floorTex, { y0: hz, y1: h, l0: -w * 1.6, r0: w * 2.6, l1: -w * 0.15, r1: w * 1.15, z0: 9, z1: 1 });
    // polished reflection of the wall
    const refl = ctx.getImageData(0, 0, w, Math.floor(hz));
    const tmp = canvas(w, Math.floor(hz)); tmp.getContext('2d')!.putImageData(refl, 0, 0);
    ctx.save();
    ctx.globalAlpha = worn ? 0.05 : floorMat === 'nero' || floorMat === 'granite' ? 0.32 : 0.24;
    ctx.translate(0, hz * 2); ctx.scale(1, -1);
    ctx.drawImage(tmp, 0, 0, w, hz, 0, 0, w, hz);
    ctx.restore();
    const fade = ctx.createLinearGradient(0, hz, 0, h);
    fade.addColorStop(0, 'rgba(0,0,0,0.35)'); fade.addColorStop(0.3, 'rgba(0,0,0,0)'); fade.addColorStop(1, 'rgba(0,0,0,0.45)');
    ctx.fillStyle = fade; ctx.fillRect(0, hz, w, h - hz);
    // baseboard shadow line
    ctx.fillStyle = 'rgba(0,0,0,0.55)'; ctx.fillRect(0, hz - 2, w, 4);
  }
  vignette(ctx, w, h, 0.72);
  return c;
}

// ---------------------------------------------------------------- async cache → blob URLs
const urlCache = new Map<string, Promise<string>>();
let chain: Promise<unknown> = Promise.resolve();
const idle = () => new Promise<void>((r) => ('requestIdleCallback' in window ? (window as any).requestIdleCallback(() => r(), { timeout: 400 }) : setTimeout(r, 16)));

/** Queues generation so the main thread never renders more than one image per idle slice. */
export function sceneURL(o: SceneOpts): Promise<string> {
  const key = JSON.stringify(o);
  const hit = urlCache.get(key);
  if (hit) return hit;
  const p = (chain = chain.then(idle).then(
    () => new Promise<string>((resolve) => {
      const c = scene(o);
      c.toBlob((b) => resolve(b ? URL.createObjectURL(b) : c.toDataURL('image/jpeg', 0.86)), 'image/jpeg', 0.86);
    }),
  )) as Promise<string>;
  urlCache.set(key, p);
  return p;
}
