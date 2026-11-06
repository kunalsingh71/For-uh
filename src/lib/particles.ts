/**
 * Hand-built particle engine (canvas 2D, additive blending).
 * One scene class powers the hero sky and the interactive cracker stage.
 */

export type CrackerKind = "bomb" | "skyshot" | "anaar" | "chakri" | "phuljhari";

type Pattern = "peony" | "ring" | "willow" | "palm" | "heart" | "double";

type Particle = {
  x: number;
  y: number;
  px: number;
  py: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  size: number;
  hue: number;
  light: number;
  gravity: number;
  drag: number;
  kind: "streak" | "dot" | "ember";
  twinkle: number;
};

type Rocket = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetY: number;
  hue: number;
  pattern: Pattern;
  count: number;
  size: number;
};

export type BurstOptions = {
  hue?: number;
  hue2?: number;
  count?: number;
  speed?: number;
  pattern?: Pattern;
  gravity?: number;
  size?: number;
};

const PALETTE = [42, 24, 4, 338, 286, 192, 48, 16];

export class ParticleScene {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private dpr = 1;
  private width = 0;
  private height = 0;
  private particles: Particle[] = [];
  private rockets: Rocket[] = [];
  private raf = 0;
  private last = 0;
  private running = false;
  private quality: number;
  private timers: { at: number; fn: () => void }[] = [];
  private clock = 0;
  private shake = 0;
  private shuffle = 0;
  private fountains: { x: number; y: number; until: number; hue: number }[] = [];
  private sparklers: { x: number; y: number; until: number }[] = [];
  private chakris: { x: number; y: number; until: number; angle: number; speed: number }[] = [];
  private fuses: { x: number; y: number; until: number; explodeAt: number }[] = [];
  private flashes: { value: number }[] = [];
  private mode: "sky" | "stage";
  private onSound?: (name: "boom" | "launch" | "crackle") => void;
  private groundY = 0;
  private stageLayout = { bomb: [0, 0], skyshot: [0, 0], anaar: [0, 0], chakri: [0, 0], phuljhari: [0, 0] } as Record<CrackerKind, [number, number]>;
  private reduceMotion: boolean;
  private countdown = 0;

  constructor(
    canvas: HTMLCanvasElement,
    options: {
      mode?: "sky" | "stage";
      quality?: number;
      reducedMotion?: boolean;
      onSound?: (name: "boom" | "launch" | "crackle") => void;
    } = {}
  ) {
    this.canvas = canvas;
    const context = canvas.getContext("2d", { alpha: true });
    if (!context) throw new Error("Canvas 2D is unavailable");
    this.ctx = context;
    this.mode = options.mode ?? "sky";
    this.quality = options.quality ?? 1;
    this.reduceMotion = options.reducedMotion ?? false;
    this.onSound = options.onSound;
    this.resize();
    this.start();
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = Math.max(rect.width, 1);
    this.height = Math.max(rect.height, 1);
    this.canvas.width = Math.floor(this.width * this.dpr);
    this.canvas.height = Math.floor(this.height * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.groundY = this.height * 0.84;
    const gy = this.groundY;
    this.stageLayout = {
      bomb: [this.width * 0.2, gy - 18],
      anaar: [this.width * 0.4, gy - 12],
      chakri: [this.width * 0.58, gy - 8],
      phuljhari: [this.width * 0.8, gy - 92],
      skyshot: [this.width * 0.08, gy - 16],
    };
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.loop);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  destroy() {
    this.stop();
    this.particles = [];
    this.rockets = [];
    this.timers = [];
  }

  private later(ms: number, fn: () => void) {
    this.timers.push({ at: this.clock + ms, fn });
  }

  private add(p: Particle) {
    const cap = Math.round((this.width < 640 ? 620 : 1200) * (0.6 + this.quality * 0.4));
    if (this.particles.length > cap) this.particles.splice(0, this.particles.length - cap + 40);
    this.particles.push(p);
  }

  /* ---------------------------- emitters ---------------------------- */

  burst(x: number, y: number, options: BurstOptions = {}) {
    const {
      hue = PALETTE[Math.floor(Math.random() * PALETTE.length)],
      hue2 = (hue + 30 + Math.random() * 40) % 360,
      pattern = "peony",
      size = 1,
      gravity = 0.035,
    } = options;
    const q = this.quality;
    const base = options.count ?? (pattern === "palm" ? 46 : pattern === "heart" ? 70 : pattern === "ring" ? 64 : 96);
    const count = Math.round(base * q * (this.width < 640 ? 0.62 : 1));
    const speed = options.speed ?? (this.width < 640 ? 3.4 : 4.4);

    if (!this.reduceMotion) this.flashes.push({ value: 0.16 });

    for (let i = 0; i < count; i += 1) {
      let angle = (i / count) * Math.PI * 2;
      let vx: number;
      let vy: number;
      let life = 900 + Math.random() * 900;
      let g = gravity;
      let dot: Particle["kind"] = Math.random() > 0.75 ? "dot" : "streak";
      let color = i % 2 === 0 ? hue : hue2;

      if (pattern === "heart") {
        const t = (i / count) * Math.PI * 2;
        const hx = 16 * Math.pow(Math.sin(t), 3);
        const hy = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
        vx = (hx / 16) * speed;
        vy = (-hy / 16) * speed;
        color = i % 3 === 0 ? hue2 : hue;
        dot = "dot";
        life = 1500 + Math.random() * 700;
        g = 0.012;
      } else if (pattern === "ring") {
        const s = speed * (0.85 + Math.random() * 0.2);
        vx = Math.cos(angle) * s;
        vy = Math.sin(angle) * s;
        life = 1200 + Math.random() * 500;
      } else if (pattern === "palm") {
        angle = (i / 11) * Math.PI * 2 + 0.2;
        const s = speed * (0.9 + Math.random() * 0.6);
        vx = Math.cos(angle) * s;
        vy = Math.sin(angle) * s;
        life = 1800 + Math.random() * 900;
        g = 0.055;
      } else if (pattern === "willow") {
        angle = (i / count) * Math.PI * 2;
        const s = speed * (0.4 + Math.random() * 0.55);
        vx = Math.cos(angle) * s;
        vy = Math.sin(angle) * s;
        life = 2300 + Math.random() * 900;
        g = 0.05;
      } else if (pattern === "double") {
        const s = speed * (Math.random() < 0.5 ? 1 : 0.5);
        vx = Math.cos(angle) * s;
        vy = Math.sin(angle) * s;
        life = 1100 + Math.random() * 800;
      } else {
        const s = speed * (0.2 + Math.pow(Math.random(), 0.5));
        vx = Math.cos(angle) * s;
        vy = Math.sin(angle) * s;
      }

      this.add({
        x,
        y,
        px: x,
        py: y,
        vx,
        vy,
        life,
        max: life,
        size: (dot === "dot" ? 1.9 : 1.5) * size * (0.7 + Math.random() * 0.9),
        hue: color,
        light: 64 + Math.random() * 18,
        gravity: g,
        drag: 0.982,
        kind: dot,
        twinkle: 0.75 + Math.random() * 0.25,
      });
    }
  }

  launch(x: number, targetY: number, options: BurstOptions = {}) {
    const hue = options.hue ?? PALETTE[Math.floor(Math.random() * PALETTE.length)];
    this.rockets.push({
      x,
      y: this.mode === "stage" ? this.groundY - 26 : this.height + 8,
      vx: (Math.random() - 0.5) * 0.8,
      vy: -(this.height < 420 ? 5.6 : 7.2) - Math.random() * 1.2,
      targetY,
      hue,
      pattern: options.pattern ?? ["peony", "ring", "willow", "palm", "double"][Math.floor(Math.random() * 5)] as Pattern,
      count: options.count ?? 100,
      size: options.size ?? 1,
    });
    this.onSound?.("launch");
  }

  fountain(x: number, y: number, duration = 2400, hue = 44) {
    this.fountains.push({ x, y, until: performance.now() + duration, hue });
    this.onSound?.("crackle");
  }

  sparkler(x: number, y: number, duration = 2800) {
    this.sparklers.push({ x, y, until: performance.now() + duration });
    this.onSound?.("crackle");
  }

  chakri(x: number, y: number, duration = 2600) {
    this.chakris.push({ x, y, until: performance.now() + duration, angle: Math.random() * 6, speed: 0.22 });
    this.onSound?.("crackle");
  }

  /* --------------------------- interactions -------------------------- */

  hotspot(kind: CrackerKind): { x: number; y: number } {
    const [x, y] = this.stageLayout[kind];
    if (kind === "phuljhari") return { x: x + 16, y: y - 26 };
    if (kind === "bomb") return { x, y: y - 14 };
    return { x, y: y - 12 };
  }

  hitTest(x: number, y: number): CrackerKind | null {
    let best: CrackerKind | null = null;
    let bestDist = Infinity;
    (Object.keys(this.stageLayout) as CrackerKind[]).forEach((kind) => {
      const p = this.hotspot(kind);
      const d = Math.hypot(p.x - x, p.y - y);
      if (d < 56 && d < bestDist) {
        best = kind;
        bestDist = d;
      }
    });
    return best;
  }

  ignite(kind: CrackerKind) {
    if (this.mode !== "stage") {
      if (kind === "skyshot") {
        this.launch(this.width * (0.25 + Math.random() * 0.5), this.height * (0.16 + Math.random() * 0.26), {
          count: 130,
          size: 1.2,
        });
        this.onSound?.("launch");
      } else if (kind === "anaar") {
        this.fountain(this.width * 0.5, this.height * 0.7, 1800, 44);
      } else if (kind === "chakri") {
        this.chakri(this.width * 0.5, this.height * 0.7, 1500);
      } else if (kind === "phuljhari") {
        this.sparkler(this.width * 0.5, this.height * 0.45, 1600);
      } else {
        const hue = PALETTE[Math.floor(Math.random() * PALETTE.length)];
        this.burst(this.width * 0.5, this.height * 0.4, { hue, count: 110, pattern: "double" });
        this.onSound?.("boom");
      }
      return;
    }

    if (kind === "bomb") {
      // two-stage: burn fuse, then boom
      this.fuses = this.fuses.filter((f) => f.x !== this.stageLayout.bomb[0]);
      const at = performance.now() + 1500;
      this.fuses.push({ x: this.stageLayout.bomb[0], y: this.stageLayout.bomb[1], until: at, explodeAt: at });
      this.countdown = Date.now() + 1500;
      this.onSound?.("crackle");
      this.later(1500, () => {
        const [bx, by] = this.stageLayout.bomb;
        this.burst(bx, by - 18, { hue: 4, hue2: 42, count: 170, speed: 5.4, pattern: "peony" });
        this.burst(bx, by - 18, { hue: 44, count: 55, speed: 3, pattern: "ring" });
        this.flashes.push({ value: 0.85 });
        this.shake = 14;
        this.onSound?.("boom");
      });
    } else if (kind === "skyshot") {
      const [sx] = this.stageLayout.skyshot;
      this.launch(sx + 4, this.height * (0.14 + Math.random() * 0.16), {
        count: 140,
        size: 1.25,
        hue: [42, 330, 200, 24, 282][Math.floor(Math.random() * 5)],
      });
      this.later(1000, () => {
        this.flashes.push({ value: 0.2 });
        this.shake = 4;
        this.onSound?.("boom");
      });
    } else if (kind === "anaar") {
      const [ax, ay] = this.stageLayout.anaar;
      this.fountain(ax, ay - 34, 2500, 44);
    } else if (kind === "chakri") {
      const [cx, cy] = this.stageLayout.chakri;
      this.chakri(cx, cy - 6, 2800);
    } else {
      const [px, py] = this.stageLayout.phuljhari;
      this.sparkler(px + 16, py - 26, 3000);
    }
  }

  igniteAll() {
    this.ignite("skyshot");
    this.later(280, () => this.ignite("anaar"));
    this.later(500, () => this.ignite("chakri"));
    this.later(720, () => this.ignite("phuljhari"));
    this.later(1000, () => this.ignite("bomb"));
  }

  fireSky(x: number, y: number) {
    const hue = PALETTE[Math.floor(Math.random() * PALETTE.length)];
    const patterns: Pattern[] = ["peony", "ring", "willow", "double", "palm"];
    this.burst(x, y, {
      hue,
      pattern: patterns[Math.floor(Math.random() * patterns.length)],
      count: 90,
      speed: 4.2,
    });
  }

  celebrationRound() {
    const x = this.width * (0.15 + Math.random() * 0.7);
    this.launch(x, this.height * (0.12 + Math.random() * 0.3), { count: 120, size: 1.2 });
  }

  /* ------------------------------ loop ------------------------------ */

  private loop = (now: number) => {
    if (!this.running) return;
    const dt = Math.min(now - this.last, 40);
    this.last = now;
    this.clock += dt;
    const step = dt / 16.667;
    this.update(step, now);
    this.render();
    this.raf = requestAnimationFrame(this.loop);
  };

  private update(step: number, now: number) {
    this.shuffle += 1;
    const ctxWidth = this.width;

    // scheduled events
    for (let i = this.timers.length - 1; i >= 0; i -= 1) {
      if (this.clock >= this.timers[i].at) {
        const fn = this.timers[i].fn;
        this.timers.splice(i, 1);
        fn();
      }
    }

    // rockets
    for (let i = this.rockets.length - 1; i >= 0; i -= 1) {
      const r = this.rockets[i];
      r.x += r.vx * step;
      r.y += r.vy * step;
      r.vy += 0.028 * step;
      for (let t = 0; t < 2; t += 1) {
        this.add({
          x: r.x + (Math.random() - 0.5) * 2,
          y: r.y + 6,
          px: r.x,
          py: r.y,
          vx: (Math.random() - 0.5) * 0.6,
          vy: 0.8 + Math.random() * 0.8,
          life: 380 + Math.random() * 260,
          max: 640,
          size: 1.2,
          hue: 38,
          light: 78,
          gravity: 0.01,
          drag: 0.96,
          kind: "ember",
          twinkle: 1,
        });
      }
      if (r.y <= r.targetY || r.vy > -0.4) {
        this.burst(r.x, r.y, { hue: r.hue, pattern: r.pattern, count: r.count, size: r.size });
        this.onSound?.("boom");
        this.rockets.splice(i, 1);
      }
    }

    // fountains
    this.fountains = this.fountains.filter((f) => f.until > now);
    this.fountains.forEach((f) => {
      const amount = this.width < 640 ? 2 : 3;
      for (let i = 0; i < amount; i += 1) {
        const spread = (Math.random() - 0.5) * 1.6;
        const speed = 2.6 + Math.random() * 3.4;
        this.add({
          x: f.x,
          y: f.y,
          px: f.x,
          py: f.y,
          vx: spread,
          vy: -speed,
          life: 620 + Math.random() * 700,
          max: 1320,
          size: 1.5 + Math.random() * 1.3,
          hue: 34 + Math.random() * 22,
          light: 70 + Math.random() * 20,
          gravity: 0.055,
          drag: 0.995,
          kind: Math.random() > 0.65 ? "dot" : "ember",
          twinkle: 0.8 + Math.random() * 0.4,
        });
      }
    });

    // sparklers
    this.sparklers = this.sparklers.filter((s) => s.until > now);
    this.sparklers.forEach((s) => {
      const amount = this.width < 640 ? 3 : 5;
      for (let i = 0; i < amount; i += 1) {
        const a = Math.random() * Math.PI * 2;
        const speed = 0.4 + Math.random() * 2.6;
        this.add({
          x: s.x,
          y: s.y,
          px: s.x,
          py: s.y,
          vx: Math.cos(a) * speed,
          vy: Math.sin(a) * speed - 0.3,
          life: 300 + Math.random() * 700,
          max: 1000,
          size: 0.9 + Math.random() * 1.5,
          hue: 38 + Math.random() * 16,
          light: 78 + Math.random() * 18,
          gravity: 0.028,
          drag: 0.965,
          kind: "streak",
          twinkle: 0.8 + Math.random() * 0.5,
        });
      }
      if (Math.random() < 0.3) {
        this.add({
          x: s.x,
          y: s.y,
          px: s.x,
          py: s.y,
          vx: (Math.random() - 0.5) * 1.2,
          vy: -0.6 - Math.random() * 1.4,
          life: 500,
          max: 500,
          size: 0.7,
          hue: 48,
          light: 94,
          gravity: 0.01,
          drag: 0.94,
          kind: "dot",
          twinkle: 1,
        });
      }
    });

    // chakris
    this.chakris = this.chakris.filter((c) => c.until > now);
    this.chakris.forEach((c) => {
      c.speed = Math.min(0.62, c.speed + 0.0035 * step);
      c.angle += c.speed * step;
      const amount = this.width < 640 ? 2 : 4;
      const radius = 26;
      for (let i = 0; i < amount; i += 1) {
        const dir = i % 2 === 0 ? 1 : -1;
        const a = c.angle + Math.random() * 0.7 * dir;
        const px = c.x + Math.cos(a) * radius;
        const py = c.y + Math.sin(a) * radius * 0.52;
        this.add({
          x: px,
          y: py,
          px,
          py,
          vx: Math.cos(a) * 2.6 * dir + (Math.random() - 0.5),
          vy: Math.sin(a) * 1.5 * dir - Math.random() * 1.1,
          life: 380 + Math.random() * 480,
          max: 860,
          size: 1.1 + Math.random() * 1.2,
          hue: 28 + Math.random() * 30,
          light: 72 + Math.random() * 20,
          gravity: 0.02,
          drag: 0.97,
          kind: "streak",
          twinkle: 0.85,
        });
      }
    });

    // fuses
    this.fuses = this.fuses.filter((f) => f.until > now);
    this.fuses.forEach((f) => {
      const tipX = f.x + 12;
      const tipY = f.y - 30;
      for (let i = 0; i < 2; i += 1) {
        this.add({
          x: tipX,
          y: tipY,
          px: tipX,
          py: tipY,
          vx: (Math.random() - 0.5) * 2,
          vy: -Math.random() * 1.6,
          life: 320,
          max: 320,
          size: 1.2,
          hue: 44,
          light: 82,
          gravity: 0.02,
          drag: 0.97,
          kind: "dot",
          twinkle: 1,
        });
      }
    });

    // particles
    for (let i = this.particles.length - 1; i >= 0; i -= 1) {
      const p = this.particles[i];
      p.px = p.x;
      p.py = p.y;
      p.vx *= Math.pow(p.drag, step);
      p.vy = p.vy * Math.pow(p.drag, step) + p.gravity * step;
      p.x += p.vx * step;
      p.y += p.vy * step;
      p.life -= 16.667 * step;
      if (p.life <= 0 || p.y > this.height + 60 || p.x < -60 || p.x > ctxWidth + 60) {
        this.particles.splice(i, 1);
      }
    }

    this.flashes = this.flashes.filter((f) => {
      f.value -= 0.032 * step;
      return f.value > 0;
    });
    this.shake *= Math.pow(0.9, step);
    if (this.countdown && Date.now() > this.countdown + 300) this.countdown = 0;
  }

  private render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);
    ctx.save();
    if (this.shake > 0.4 && !this.reduceMotion) {
      ctx.translate((Math.random() - 0.5) * this.shake, (Math.random() - 0.5) * this.shake);
    }

    if (this.mode === "stage") this.drawStage();

    ctx.globalCompositeOperation = "lighter";
    for (const p of this.particles) {
      const alpha = Math.max(0, Math.min(1, p.life / p.max));
      const flicker = p.twinkle < 1 ? 0.55 + Math.abs(Math.sin((p.life + this.shuffle) * 0.15)) * 0.45 : 1;
      const a = alpha * alpha * flicker;
      if (p.kind === "dot") {
        ctx.fillStyle = `hsla(${p.hue}, 100%, ${p.light}%, ${a})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (0.5 + alpha * 0.7), 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.strokeStyle = `hsla(${p.hue}, 100%, ${p.light}%, ${a})`;
        ctx.lineWidth = p.size;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(p.px, p.py);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      }
    }

    // rockets
    for (const r of this.rockets) {
      ctx.fillStyle = "rgba(255,244,214,0.95)";
      ctx.beginPath();
      ctx.arc(r.x, r.y, 2.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(255,176,82,0.35)";
      ctx.beginPath();
      ctx.arc(r.x, r.y, 6, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalCompositeOperation = "source-over";

    if (this.mode === "stage") this.drawActiveEmitters();
    ctx.restore();

    // full screen flash
    for (const f of this.flashes) {
      if (f.value <= 0.02) continue;
      const grad = this.ctx.createRadialGradient(this.width / 2, this.height * 0.45, 10, this.width / 2, this.height * 0.45, this.width * 0.75);
      grad.addColorStop(0, `rgba(255,246,214,${f.value * 0.55})`);
      grad.addColorStop(0.6, `rgba(255,168,80,${f.value * 0.26})`);
      grad.addColorStop(1, "rgba(255,120,40,0)");
      this.ctx.fillStyle = grad;
      this.ctx.fillRect(0, 0, this.width, this.height);
    }
  }

  /* ------------------------- stage artwork ------------------------- */

  private drawStage() {
    const ctx = this.ctx;
    const w = this.width;
    const gy = this.groundY;

    // distant festive skyline
    ctx.fillStyle = "rgba(8,5,18,0.75)";
    ctx.beginPath();
    ctx.moveTo(0, gy);
    for (let i = 0; i < 18; i += 1) {
      const x = (i / 18) * w;
      const h = 14 + ((i * 37) % 44);
      ctx.lineTo(x, gy - h);
      ctx.lineTo(x + w / 36, gy - h);
      ctx.lineTo(x + w / 36, gy - h + 6);
    }
    ctx.lineTo(w, gy);
    ctx.closePath();
    ctx.fill();

    // domes on the skyline
    ctx.fillStyle = "rgba(10,6,20,0.85)";
    [0.16, 0.52, 0.86].forEach((pos) => {
      const cx = w * pos;
      const r = w < 640 ? 12 : 18;
      ctx.beginPath();
      ctx.arc(cx, gy - 24, r, Math.PI, 0);
      ctx.fill();
      ctx.fillRect(cx - r, gy - 26, r * 2, 26);
      ctx.fillRect(cx - 1, gy - 24 - r - 12, 2, 12);
    });

    // lit windows
    ctx.fillStyle = "rgba(255,196,110,0.55)";
    for (let i = 0; i < 22; i += 1) {
      const x = (i * 53) % w;
      const y = gy - 8 - ((i * 17) % 22);
      ctx.fillRect(x, y, 2.4, 2.4);
    }

    // ground
    const ground = ctx.createLinearGradient(0, gy, 0, this.height);
    ground.addColorStop(0, "rgba(46,26,58,0.85)");
    ground.addColorStop(1, "rgba(12,7,22,0.95)");
    ctx.fillStyle = ground;
    ctx.fillRect(0, gy, w, this.height - gy);
    ctx.strokeStyle = "rgba(243,201,120,0.3)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, gy);
    ctx.lineTo(w, gy);
    ctx.stroke();

    // chakri spiral on ground
    const ch = this.stageLayout.chakri;
    const ck = this.chakris.find((c) => c.until > performance.now());
    ctx.save();
    ctx.translate(ch[0], ch[1]);
    ctx.rotate(ck ? ck.angle : -0.3);
    ctx.scale(1, 0.45);
    const disc = ctx.createRadialGradient(0, 0, 2, 0, 0, 28);
    disc.addColorStop(0, "#ffd794");
    disc.addColorStop(0.55, "#b4552c");
    disc.addColorStop(1, "#4d1f1b");
    ctx.fillStyle = disc;
    ctx.beginPath();
    ctx.arc(0, 0, 27, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,226,168,0.85)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < 40; i += 1) {
      const a = i * 0.55;
      const r = i * 0.6;
      const x = Math.cos(a) * r;
      const y = Math.sin(a) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.restore();

    // anaar
    const an = this.stageLayout.anaar;
    ctx.save();
    ctx.translate(an[0], an[1]);
    const body = ctx.createLinearGradient(-16, 0, 16, 0);
    body.addColorStop(0, "#5b1c1d");
    body.addColorStop(0.45, "#c0392b");
    body.addColorStop(0.72, "#e8874f");
    body.addColorStop(1, "#5b1c1d");
    ctx.fillStyle = body;
    ctx.beginPath();
    ctx.moveTo(-16, 0);
    ctx.lineTo(16, 0);
    ctx.lineTo(12, -34);
    ctx.lineTo(-12, -34);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "rgba(243,201,120,0.85)";
    ctx.fillRect(-13, -26, 26, 3);
    ctx.fillRect(-15, -8, 30, 3);
    ctx.beginPath();
    ctx.ellipse(0, -34, 12, 4, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#3d2415";
    ctx.fill();
    ctx.strokeStyle = "rgba(255,211,138,0.75)";
    ctx.beginPath();
    ctx.arc(0, -34, 12, Math.PI, 0);
    ctx.stroke();
    ctx.restore();

    // bomb
    const bomb = this.stageLayout.bomb;
    const fuse = this.fuses.find((f) => f.until > 0 && f.explodeAt > performance.now());
    ctx.save();
    ctx.translate(bomb[0], bomb[1]);
    const ball = ctx.createRadialGradient(-6, -26, 2, 0, -18, 22);
    ball.addColorStop(0, "#8e3a3d");
    ball.addColorStop(0.55, "#4b1620");
    ball.addColorStop(1, "#1c0a10");
    ctx.fillStyle = ball;
    ctx.beginPath();
    ctx.arc(0, -18, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,196,110,0.35)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(0, -18, 18, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = "#d8b285";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(6, -33);
    ctx.quadraticCurveTo(18, -46, 12, -54);
    ctx.stroke();
    if (fuse) {
      const glow = ctx.createRadialGradient(12, -54, 0, 12, -54, 14);
      glow.addColorStop(0, "rgba(255,246,214,0.98)");
      glow.addColorStop(0.4, "rgba(255,168,60,0.6)");
      glow.addColorStop(1, "rgba(255,120,40,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(12, -54, 14, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // skyshot launcher
    const sky = this.stageLayout.skyshot;
    ctx.save();
    ctx.translate(sky[0], sky[1]);
    const tube = ctx.createLinearGradient(-10, 0, 10, 0);
    tube.addColorStop(0, "#2a2b3f");
    tube.addColorStop(0.45, "#7a6a52");
    tube.addColorStop(1, "#241f2c");
    ctx.fillStyle = tube;
    ctx.beginPath();
    ctx.moveTo(-9, 0);
    ctx.lineTo(9, 0);
    ctx.lineTo(7, -34);
    ctx.lineTo(-7, -34);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "rgba(243,201,120,0.6)";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.ellipse(0, -34, 7, 2.4, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // phuljhari
    const ph = this.stageLayout.phuljhari;
    ctx.save();
    ctx.translate(ph[0], ph[1]);
    ctx.rotate(0.24);
    const stick = ctx.createLinearGradient(0, 0, 0, 96);
    stick.addColorStop(0, "#d9b079");
    stick.addColorStop(1, "#6a4427");
    ctx.strokeStyle = stick;
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(14, -22);
    ctx.lineTo(0, 96);
    ctx.stroke();
    ctx.strokeStyle = "rgba(255,226,170,0.8)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(14, -22);
    ctx.lineTo(0, 96);
    ctx.stroke();
    ctx.restore();
  }

  private drawActiveEmitters() {
    const ctx = this.ctx;
    const now = performance.now();
    const glow = (x: number, y: number, radius: number, alpha: number) => {
      const g = ctx.createRadialGradient(x, y, 0, x, y, radius);
      g.addColorStop(0, `rgba(255,248,224,${alpha})`);
      g.addColorStop(0.35, `rgba(255,196,110,${alpha * 0.55})`);
      g.addColorStop(1, "rgba(255,140,50,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    };
    this.sparklers
      .filter((s) => s.until > now)
      .forEach((s) => glow(s.x, s.y, 32 + Math.random() * 8, 0.9));
    this.fountains
      .filter((f) => f.until > now)
      .forEach((f) => glow(f.x, f.y, 26, 0.55));
    this.chakris
      .filter((c) => c.until > now)
      .forEach((c) => glow(c.x, c.y, 34, 0.4));
  }
}
