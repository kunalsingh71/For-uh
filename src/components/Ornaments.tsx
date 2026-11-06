import { useId, useMemo, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/utils/cn";

/* ------------------------------------------------------------------ */
/*  Diya — the little clay lamp that carries the whole story          */
/* ------------------------------------------------------------------ */
export function Diya({
  size = 110,
  className,
  lit = true,
  glow = true,
}: {
  size?: number;
  className?: string;
  lit?: boolean;
  glow?: boolean;
}) {
  const uid = useId().replace(/[:]/g, "");
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 140 140"
      className={cn("overflow-visible", className)}
      aria-hidden="true"
      role="presentation"
    >
      <defs>
        <radialGradient id={`${uid}-halo`}>
          <stop offset="0%" stopColor="#ffd692" stopOpacity="0.85" />
          <stop offset="45%" stopColor="#ff9a3d" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#ff8a2a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${uid}-bowl`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#b0763a" />
          <stop offset="42%" stopColor="#8a4f27" />
          <stop offset="100%" stopColor="#4a2413" />
        </linearGradient>
        <linearGradient id={`${uid}-rim`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffe7b1" />
          <stop offset="45%" stopColor="#e6b464" />
          <stop offset="100%" stopColor="#a2702f" />
        </linearGradient>
        <linearGradient id={`${uid}-flame`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#ff5a1f" />
          <stop offset="55%" stopColor="#ffab3d" />
          <stop offset="100%" stopColor="#fff2c4" />
        </linearGradient>
        <filter id={`${uid}-soft`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>

      {glow && (
        <ellipse
          cx="70"
          cy="72"
          rx="62"
          ry="58"
          fill={`url(#${uid}-halo)`}
          className="animate-glow"
          style={{ transformOrigin: "70px 72px" }}
        />
      )}

      {lit && (
        <g className="flame" style={{ transformOrigin: "70px 78px" }}>
          <path
            d="M70 22c10 15 17 26 17 36 0 11-7.6 19-17 19s-17-8-17-19c0-10 7-21 17-36Z"
            fill={`url(#${uid}-flame)`}
            filter={`url(#${uid}-soft)`}
            opacity="0.9"
          />
          <path
            d="M70 27c7.5 12 12.5 21 12.5 29.5 0 8.6-5.6 14.5-12.5 14.5s-12.5-5.9-12.5-14.5C57.5 48 62.5 39 70 27Z"
            fill={`url(#${uid}-flame)`}
          />
          <path
            d="M70 44c3.6 6.3 6 11 6 15.6 0 4.8-2.7 8.4-6 8.4s-6-3.6-6-8.4c0-4.6 2.4-9.3 6-15.6Z"
            fill="#fff8dd"
            opacity="0.95"
          />
        </g>
      )}

      <path d="M68 72h4v10h-4z" fill="#2c1608" />
      <ellipse cx="70" cy="112" rx="27" ry="6" fill="#2a1408" opacity="0.75" />
      <path
        d="M18 76c3 16 22 26 52 26s49-10 52-26c-13 6-30 9-52 9s-39-3-52-9Z"
        fill={`url(#${uid}-bowl)`}
      />
      <path
        d="M20 75c4 5 24 10 50 10s46-5 50-10"
        stroke={`url(#${uid}-rim)`}
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />
      <ellipse cx="70" cy="75" rx="50" ry="9" fill="#4a2413" />
      <ellipse cx="70" cy="75" rx="50" ry="9" fill="none" stroke={`url(#${uid}-rim)`} strokeWidth="2.2" />
      <g fill="#ffd48a" opacity="0.85">
        <circle cx="38" cy="78" r="1.5" />
        <circle cx="54" cy="81" r="1.5" />
        <circle cx="70" cy="82" r="1.5" />
        <circle cx="86" cy="81" r="1.5" />
        <circle cx="102" cy="78" r="1.5" />
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Marigold garland                                                  */
/* ------------------------------------------------------------------ */
export function Garland({ className, mirrored = false }: { className?: string; mirrored?: boolean }) {
  const flowers = useMemo(() => {
    const out: { x: number; y: number; s: number; hue: number }[] = [];
    for (let i = 0; i <= 46; i += 1) {
      const t = i / 46;
      // two sagging swags across the top
      const x = t * 1200;
      const y =
        18 +
        Math.abs(Math.sin(t * Math.PI * 2)) * 34 +
        Math.sin(t * Math.PI * 4) * 6;
      const s = 7 + Math.sin(i * 1.7) * 2.2 + (i % 3 === 0 ? 2 : 0);
      const hue = i % 4 === 0 ? 6 : i % 3 === 0 ? 26 : 42;
      out.push({ x, y, s, hue });
    }
    return out;
  }, []);

  return (
    <svg
      viewBox="0 0 1200 120"
      preserveAspectRatio="xMidYMin slice"
      className={cn("h-[74px] w-full md:h-[104px]", className)}
      aria-hidden="true"
    >
      <path
        d="M0 8 C 200 64 400 64 600 22 C 800 64 1000 64 1200 8"
        fill="none"
        stroke="rgba(201,152,72,0.55)"
        strokeWidth="1.4"
        transform={mirrored ? "scale(-1,1) translate(-1200,0)" : undefined}
      />
      {flowers.map((f, i) => (
        <g key={i} transform={`translate(${f.x} ${f.y})`} opacity={0.95}>
          <line x1="0" y1="-9" x2="0" y2="-2" stroke="rgba(196,145,63,0.5)" strokeWidth="1" />
          <circle cx="0" cy="0" r={f.s} fill={`hsl(${f.hue} 88% 54%)`} opacity="0.9" />
          {[0, 60, 120, 180, 240, 300].map((angle) => (
            <ellipse
              key={angle}
              cx="0"
              cy={-f.s * 0.62}
              rx={f.s * 0.44}
              ry={f.s * 0.58}
              fill={`hsl(${f.hue + 6} 92% 63%)`}
              transform={`rotate(${angle})`}
              opacity="0.92"
            />
          ))}
          <circle cx="0" cy="0" r={f.s * 0.3} fill={`hsl(${f.hue + 14} 95% 78%)`} />
        </g>
      ))}
      {[70, 300, 520, 780, 1010, 1150].map((x, i) => (
        <g key={x} transform={`translate(${x} ${34 + (i % 2) * 12}) rotate(${i * 26})`} opacity="0.85">
          <ellipse cx="0" cy="0" rx="6" ry="13" fill="#8a7238" />
          <ellipse cx="0" cy="0" rx="3" ry="10" fill="#b79a51" opacity="0.7" />
        </g>
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Hanging lantern                                                   */
/* ------------------------------------------------------------------ */
export function Lantern({ className, delay = 0 }: { className?: string; delay?: number }) {
  const uid = useId().replace(/[:]/g, "");
  return (
    <svg
      viewBox="0 0 100 230"
      className={cn("animate-sway", className)}
      style={{ animationDelay: `${delay}s` }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${uid}-glass`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8a2130" />
          <stop offset="48%" stopColor="#d4392f" />
          <stop offset="100%" stopColor="#6c1320" />
        </linearGradient>
        <radialGradient id={`${uid}-lamp`}>
          <stop offset="0%" stopColor="#ffe6a8" />
          <stop offset="55%" stopColor="#ffab43" />
          <stop offset="100%" stopColor="#ff7a1f" stopOpacity="0.1" />
        </radialGradient>
        <filter id={`${uid}-blur`}>
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>
      <line x1="50" y1="0" x2="50" y2="44" stroke="rgba(221,183,110,0.55)" strokeWidth="1.2" />
      <ellipse cx="50" cy="106" rx="46" ry="48" fill={`url(#${uid}-lamp)`} filter={`url(#${uid}-blur)`} opacity="0.4" />
      <rect x="34" y="42" width="32" height="7" rx="2" fill="#c99a4c" />
      <path d="M28 50h44l8 20-8 54H28l-8-54Z" fill={`url(#${uid}-glass)`} stroke="#f0c579" strokeWidth="1.6" />
      <path d="M28 50h44l8 20-8 54H28l-8-54Z" fill="url(#none)" />
      <g stroke="rgba(255,219,150,0.5)" strokeWidth="1">
        <path d="M30 62h40M26 78h48M26 96h48M28 114h44M32 124h36" />
        <path d="M50 50v74M36 52v72M64 52v72" />
      </g>
      <ellipse cx="50" cy="92" rx="13" ry="16" fill="#ffd98a" opacity="0.55" />
      <rect x="32" y="122" width="36" height="7" rx="2" fill="#c99a4c" />
      <path d="M50 129v14" stroke="#e0b369" strokeWidth="1.6" />
      <path d="M50 143l3 12-3 7-3-7Z" fill="#e0b369" />
      <g stroke="#f3ce86" strokeWidth="1.1">
        <path d="M44 143v16M56 143v16" />
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Rangoli — a semi circle mandala for the ground                    */
/* ------------------------------------------------------------------ */
export function Rangoli({ className }: { className?: string }) {
  const petals = Array.from({ length: 18 }, (_, i) => i);
  const dots = Array.from({ length: 44 }, (_, i) => i);
  return (
    <svg viewBox="0 0 600 300" className={cn(className)} aria-hidden="true">
      <defs>
        <radialGradient id="rangoli-glow">
          <stop offset="0%" stopColor="#ffb459" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#ff9a3d" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="300" cy="300" rx="280" ry="130" fill="url(#rangoli-glow)" />
      {[80, 118, 160, 205, 246].map((r, i) => (
        <circle
          key={r}
          cx="300"
          cy="300"
          r={r}
          fill="none"
          stroke={i % 2 === 0 ? "rgba(243,201,120,0.5)" : "rgba(255,143,63,0.35)"}
          strokeWidth={i === 0 ? 2 : 1.2}
          strokeDasharray={i % 2 === 0 ? "0" : "3 9"}
        />
      ))}
      {petals.map((i) => {
        const angle = (i / petals.length) * Math.PI - Math.PI;
        const x = 300 + Math.cos(angle) * 160;
        const y = 300 + Math.sin(angle) * 160;
        return (
          <g key={i} transform={`translate(${x} ${y}) rotate(${(i / petals.length) * 360})`}>
            <ellipse cx="0" cy="0" rx="15" ry="36" fill="none" stroke="rgba(255,166,80,0.45)" strokeWidth="1.3" />
            <ellipse cx="0" cy="0" rx="6" ry="24" fill="rgba(209,80,107,0.24)" />
            <circle cx="0" cy="0" r="2.4" fill="#ffd79b" opacity="0.9" />
          </g>
        );
      })}
      {dots.map((i) => {
        const angle = (i / dots.length) * Math.PI - Math.PI;
        const r = 224 + (i % 2) * 14;
        return (
          <circle
            key={i}
            cx={300 + Math.cos(angle) * r}
            cy={300 + Math.sin(angle) * r}
            r={i % 3 === 0 ? 2.6 : 1.7}
            fill={i % 3 === 0 ? "#ffd79b" : "#ff9a4d"}
            opacity="0.7"
          />
        );
      })}
      {Array.from({ length: 10 }, (_, i) => {
        const angle = (i / 10) * Math.PI - Math.PI;
        return (
          <g key={`inner-${i}`} transform={`translate(${300 + Math.cos(angle) * 82} ${300 + Math.sin(angle) * 82})`}>
            <path d="M0-10 Q8 0 0 10 Q-8 0 0-10Z" fill="rgba(243,201,120,0.4)" />
          </g>
        );
      })}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Small ornaments                                                   */
/* ------------------------------------------------------------------ */
export function FlowerDivider({ className, label }: { className?: string; label?: ReactNode }) {
  return (
    <div className={cn("flex items-center justify-center gap-4", className)} aria-hidden="true">
      <span className="hairline w-14 sm:w-24" />
      <span className="flex items-center gap-2 text-gold/70">
        <svg width="34" height="16" viewBox="0 0 40 18" fill="none">
          <path d="M20 9c4-7 9-7 9-7s0 7-7.5 8C22 10 22 12 20 16c-2-4-2-6-3.5-6C9 9 9 2 9 2s5 0 9 7Z" fill="currentColor" opacity="0.55" />
          <circle cx="20" cy="9" r="2.2" fill="#ffe6b2" />
        </svg>
        {label ? <span className="eyebrow whitespace-nowrap">{label}</span> : <span className="text-gold/50 text-xs">✦</span>}
        <svg width="34" height="16" viewBox="0 0 40 18" fill="none" className="-scale-x-100">
          <path d="M20 9c4-7 9-7 9-7s0 7-7.5 8C22 10 22 12 20 16c-2-4-2-6-3.5-6C9 9 9 2 9 2s5 0 9 7Z" fill="currentColor" opacity="0.55" />
          <circle cx="20" cy="9" r="2.2" fill="#ffe6b2" />
        </svg>
      </span>
      <span className="hairline w-14 sm:w-24" />
    </div>
  );
}

export function CornerFlourish({ className, flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={cn("text-gold/45", className)}
      style={flip ? { transform: "scale(-1,-1)" } : undefined}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      aria-hidden="true"
    >
      <path d="M4 116V50C4 25 25 4 50 4h66" opacity="0.6" />
      <path d="M12 116V54C12 31 31 12 54 12h62" opacity="0.35" />
      <path d="M4 50c22 0 38-16 38-38 0 16 8 28 24 30-12 4-18 12-20 24-6-14-18-18-42-16Z" opacity="0.5" />
      <circle cx="26" cy="26" r="3" fill="currentColor" stroke="none" opacity="0.7" />
      <path d="M40 82c10-4 16-12 18-24" opacity="0.4" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Ambient particles (CSS, cheap, no canvas needed)                  */
/* ------------------------------------------------------------------ */
function seeded(i: number) {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

export function FloatingGlow({
  count = 16,
  className,
  tone = "gold",
}: {
  count?: number;
  className?: string;
  tone?: "gold" | "ember";
}) {
  const specks = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: `${seeded(i + 1) * 100}%`,
        top: `${seeded(i + 7) * 100}%`,
        size: 2 + seeded(i + 13) * 4,
        delay: seeded(i + 21) * 9,
        duration: 7 + seeded(i + 31) * 9,
        dx: `${(seeded(i + 41) - 0.5) * 90}px`,
        opacity: 0.25 + seeded(i + 51) * 0.55,
        blur: seeded(i + 61) > 0.7 ? 1.5 : 0,
      })),
    [count]
  );
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden="true">
      {specks.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={
            {
              left: s.left,
              top: s.top,
              width: s.size,
              height: s.size,
              opacity: s.opacity,
              filter: s.blur ? `blur(${s.blur}px)` : undefined,
              background:
                tone === "gold"
                  ? "radial-gradient(circle, #fff5d6 0%, #ffc56d 45%, rgba(255,150,50,0) 72%)"
                  : "radial-gradient(circle, #ffe0b0 0%, #ff7a4f 50%, rgba(255,90,50,0) 75%)",
              boxShadow: "0 0 8px rgba(255,196,110,0.65)",
              animation: `driftUp ${s.duration}s ease-in-out ${s.delay}s infinite`,
              ["--dx" as string]: s.dx,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

export function FallingGold({ count = 22, className }: { count?: number; className?: string }) {
  const flakes = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: `${seeded(i + 3) * 100}%`,
        size: 2 + seeded(i + 11) * 4,
        delay: seeded(i + 19) * 18,
        duration: 12 + seeded(i + 27) * 14,
        dx: `${(seeded(i + 35) - 0.5) * 120}px`,
        tone: seeded(i + 43),
      })),
    [count]
  );
  return (
    <div className={cn("pointer-events-none fixed inset-0 z-10 overflow-hidden", className)} aria-hidden="true">
      {flakes.map((f, i) => (
        <span
          key={i}
          className="absolute top-0 rounded-full"
          style={
            {
              left: f.left,
              width: f.size,
              height: f.size * 1.6,
              background:
                f.tone > 0.6
                  ? "linear-gradient(#fff6dc,#f0b45e)"
                  : "linear-gradient(#ffd9a0,#c98f3f)",
              boxShadow: "0 0 6px rgba(255,205,130,0.7)",
              animation: `sparkFall ${f.duration}s linear ${f.delay}s infinite`,
              ["--dx" as string]: f.dx,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

export function Stars({ count = 46, className }: { count?: number; className?: string }) {
  const stars = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: `${seeded(i + 2) * 100}%`,
        top: `${seeded(i + 9) * 82}%`,
        size: 1 + seeded(i + 17) * 2.2,
        delay: seeded(i + 23) * 5,
        duration: 3 + seeded(i + 29) * 5,
        bright: seeded(i + 37) > 0.72,
      })),
    [count]
  );
  return (
    <div className={cn("pointer-events-none absolute inset-0", className)} aria-hidden="true">
      {stars.map((s, i) => (
        <span
          key={i}
          className="animate-twinkle absolute rounded-full bg-[#fff3d6]"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
            boxShadow: s.bright ? "0 0 6px 1px rgba(255,232,190,0.8)" : "0 0 3px rgba(255,232,190,0.5)",
          }}
        />
      ))}
    </div>
  );
}

export function Moon({ className }: { className?: string }) {
  const uid = useId().replace(/[:]/g, "");
  return (
    <svg viewBox="0 0 220 220" className={className} aria-hidden="true">
      <defs>
        <radialGradient id={`${uid}-moon`}>
          <stop offset="0%" stopColor="#fffbea" />
          <stop offset="55%" stopColor="#f5e5c0" />
          <stop offset="100%" stopColor="#d9bf95" />
        </radialGradient>
        <radialGradient id={`${uid}-moonGlow`}>
          <stop offset="0%" stopColor="#fff0c7" stopOpacity="0.5" />
          <stop offset="60%" stopColor="#ffe0a3" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#ffdca0" stopOpacity="0" />
        </radialGradient>
        <filter id={`${uid}-f`}>
          <feGaussianBlur stdDeviation="7" />
        </filter>
      </defs>
      <circle cx="110" cy="110" r="108" fill={`url(#${uid}-moonGlow)`} className="animate-glow" style={{ transformOrigin: "center" }} />
      <circle cx="110" cy="110" r="62" fill={`url(#${uid}-moon)`} filter={`url(#${uid}-f)`} opacity="0.55" />
      <circle cx="110" cy="110" r="54" fill={`url(#${uid}-moon)`} />
      <g fill="#c9ab7f" opacity="0.35">
        <ellipse cx="94" cy="92" rx="11" ry="9" />
        <ellipse cx="126" cy="118" rx="14" ry="11" />
        <ellipse cx="106" cy="135" rx="7" ry="6" />
        <ellipse cx="133" cy="88" rx="5" ry="4" />
      </g>
    </svg>
  );
}
