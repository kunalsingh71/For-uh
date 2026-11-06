import { useCallback, useEffect, useRef, useState } from "react";
import { ParticleCanvas } from "@/components/ParticleCanvas";
import { ParticleScene, type CrackerKind } from "@/lib/particles";
import { cn } from "@/utils/cn";

const CRACKERS: {
  kind: CrackerKind;
  name: string;
  hindi: string;
  note: string;
}[] = [
  { kind: "bomb", name: "Digital Bomb", hindi: "अनार बम", note: "Lit fuse. Three seconds of suspense." },
  { kind: "skyshot", name: "Skyshot", hindi: "आसमानी", note: "A rocket that writes in the sky." },
  { kind: "anaar", name: "Anaar", hindi: "अनार", note: "A golden fountain, all at once." },
  { kind: "chakri", name: "Chakri", hindi: "चकरी", note: "A whirling circle of light." },
  { kind: "phuljhari", name: "Phuljhari", hindi: "फुलझड़ी", note: "The sparkler we never outgrow." },
];

function CrackerGlyph({ kind, className }: { kind: CrackerKind; className?: string }) {
  const common = { fill: "none", stroke: "currentColor", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (kind === "bomb")
    return (
      <svg viewBox="0 0 48 48" className={className} {...common} strokeWidth="1.6">
        <path d="M22 33c-7 0-12-4.5-12-10.5S15.5 12 22.5 12 35 16.5 35 22.5 29 33 22 33Z" fill="rgba(255,143,63,0.18)" />
        <path d="M27 14c2-5 7-5 7-5s0 5-4 6" />
        <path d="M31 10c2-1 4-3 3-5-3 0-5 2-5 4" fill="rgba(255,201,120,0.5)" />
        <path d="M12 22h20M22 12v21" opacity="0.4" />
        <circle cx="21" cy="23" r="1.3" fill="currentColor" />
      </svg>
    );
  if (kind === "skyshot")
    return (
      <svg viewBox="0 0 48 48" className={className} {...common} strokeWidth="1.6">
        <path d="M24 6c5 4 7 10 7 16l-7 7-7-7c0-6 2-12 7-16Z" fill="rgba(243,201,120,0.16)" />
        <circle cx="24" cy="19" r="3" />
        <path d="M17 23l-5 7 7-2M31 23l5 7-7-2M24 29v7" />
        <path d="M21 39c1 2 2 3 3 5 1-2 2-3 3-5" stroke="rgba(255,143,63,0.9)" />
      </svg>
    );
  if (kind === "anaar")
    return (
      <svg viewBox="0 0 48 48" className={className} {...common} strokeWidth="1.6">
        <path d="M18 40V27l-3-6 9-4 9 4-3 6v13Z" fill="rgba(209,80,107,0.22)" />
        <path d="M23 17c-1-5 2-8 4-11 2 4 4 7 2 11" stroke="rgba(255,201,120,0.8)" />
        <path d="M15 12l-3-5M9 20l-5-1M37 12l3-5M43 20l5-1" stroke="rgba(243,201,120,0.55)" />
        <circle cx="24" cy="8" r="1.4" fill="currentColor" />
        <path d="M18 31h15M17 35h17" opacity="0.55" />
      </svg>
    );
  if (kind === "chakri")
    return (
      <svg viewBox="0 0 48 48" className={className} {...common} strokeWidth="1.6">
        <ellipse cx="24" cy="27" rx="17" ry="8" fill="rgba(255,143,63,0.14)" />
        <path d="M24 27a3 3 0 1 0 3-3 6 6 0 1 0-6 6 9 9 0 1 0 9-9 12 12 0 1 0-12 12" />
        <path d="M7 20c1-3 4-5 7-6M41 20c-1-3-4-5-7-6" stroke="rgba(243,201,120,0.65)" />
        <circle cx="24" cy="27" r="1.6" fill="currentColor" />
      </svg>
    );
  return (
    <svg viewBox="0 0 48 48" className={className} {...common} strokeWidth="1.6">
      <path d="M14 42L30 10" />
      <path d="M12 42l4 0 16-32-4-1Z" fill="rgba(243,201,120,0.14)" stroke="none" />
      <g stroke="rgba(255,201,120,0.85)">
        <path d="M31 4v-3M37 8l3-2M39 14h3M26 3l-1-2M43 22l3 1M30 22l2 3" />
      </g>
      <circle cx="33" cy="9" r="1.8" fill="currentColor" />
    </svg>
  );
}

export function CrackerStage({
  reducedMotion,
  onSound,
}: {
  reducedMotion: boolean;
  onSound: (name: "boom" | "launch" | "crackle") => void;
}) {
  const sceneRef = useRef<ParticleScene | null>(null);
  const [active, setActive] = useState<CrackerKind | null>(null);
  const [count, setCount] = useState(3);
  const [taps, setTaps] = useState(0);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      timers.current.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  const ignite = useCallback(
    (kind: CrackerKind) => {
      sceneRef.current?.ignite(kind);
      setActive(kind);
      setTaps((t) => t + 1);
      timers.current.forEach((t) => window.clearTimeout(t));
      timers.current = [];
      if (kind === "bomb") {
        setCount(3);
        [700, 1400].forEach((delay, i) => {
          timers.current.push(window.setTimeout(() => setCount(2 - i), delay));
        });
        timers.current.push(window.setTimeout(() => setCount(0), 2100));
      }
    },
    []
  );

  const handlePointer = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const scene = sceneRef.current;
    if (!scene) return;
    const hit = scene.hitTest(x, y);
    if (hit) ignite(hit);
    else scene.fireSky(x, y);
  };

  return (
    <div id="crackers" className="relative mx-auto max-w-6xl scroll-mt-24 px-4 sm:px-6">
      <div className="reveal gold-frame grain relative overflow-hidden rounded-[1.6rem] bg-[#0a0618] shadow-[0_40px_120px_-60px_rgba(0,0,0,0.9)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(83,49,120,0.5),transparent_60%)]" />
        <div
          className="relative h-[300px] cursor-crosshair touch-manipulation sm:h-[380px] lg:h-[440px]"
          onPointerDown={handlePointer}
          role="application"
          aria-label="Interactive firecracker playground. Tap the objects to light them."
        >
          <ParticleCanvas
            sceneRef={sceneRef}
            mode="stage"
            reducedMotion={reducedMotion}
            onSound={onSound}
            className="absolute inset-0"
            ariaLabel="A night scene with a bomb, skyshot, anaar, chakri and phuljhari waiting to be lit"
          />
          <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-4 sm:p-5">
            <div className="glass rounded-full px-3.5 py-1.5">
              <p className="eyebrow !text-[9px] !tracking-[0.24em] text-gold-soft/80">The Playground · tap anything</p>
            </div>
            <div className="glass hidden items-center gap-2 rounded-full px-3 py-1.5 sm:flex">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-saffron opacity-70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold" />
              </span>
              <span className="eyebrow !text-[9px] !tracking-[0.24em] text-gold-soft/75">{taps} lights lit</span>
            </div>
          </div>

          {active === "bomb" && count > 0 && (
            <div className="pointer-events-none absolute bottom-[22%] left-[20%] -translate-x-1/2 text-center">
              <div className="font-display text-4xl font-semibold text-gold-soft drop-shadow-[0_0_18px_rgba(255,170,80,0.8)] sm:text-5xl">
                {count}
              </div>
              <p className="eyebrow mt-1 !text-[8px] text-saffron/90">fuse lit</p>
            </div>
          )}

          <div className="pointer-events-none absolute inset-x-0 bottom-3 text-center">
            <p className="font-hand text-lg text-gold-soft/70 sm:text-xl">
              go on — light one. it&apos;s Diwali, after all.
            </p>
          </div>
        </div>

        <div className="relative border-t border-gold/15 bg-[#0d0820]/80 px-3 py-4 sm:px-5 sm:py-5">
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
            {CRACKERS.map((c) => (
              <button
                key={c.kind}
                type="button"
                onClick={() => ignite(c.kind)}
                aria-pressed={active === c.kind}
                className={cn(
                  "group relative flex items-center gap-3 overflow-hidden rounded-xl border px-3 py-2.5 text-left transition-all duration-300",
                  active === c.kind
                    ? "border-gold/60 bg-gold/10 shadow-[0_0_28px_-9px_rgba(243,201,120,0.7)]"
                    : "border-white/8 bg-white/[0.025] hover:border-gold/40 hover:bg-white/[0.05]",
                  c.kind === "skyshot" && "col-span-2 sm:col-span-1"
                )}
              >
                <span
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors",
                    active === c.kind
                      ? "border-gold/60 bg-gold/15 text-gold-soft"
                      : "border-gold/25 bg-night-800 text-gold/80"
                  )}
                >
                  <CrackerGlyph kind={c.kind} className="h-6 w-6" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[11px] font-semibold tracking-wide text-cream/90">
                    {c.name}
                  </span>
                  <span className="block truncate font-display text-[12px] italic text-gold/60">{c.note}</span>
                </span>
              </button>
            ))}
          </div>
          <div className="mt-3 flex flex-col items-center justify-between gap-3 sm:flex-row">
            <p className="font-hand text-base text-cream/55 sm:text-lg">
              {active
                ? taps > 1
                  ? "“Arre, bas bhi karo… okay, one more.” — someone, probably you"
                  : "“Listen. That one was for you.”"
                : "“Every light in this little sky was chosen for you.”"}
            </p>
            <button
              type="button"
              onClick={() => sceneRef.current?.igniteAll()}
              className="ghost-button !py-2 !text-[10px]"
            >
              <span aria-hidden="true">✦</span> Light everything at once
            </button>
          </div>
        </div>
      </div>

      <div className="reveal mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[10px] uppercase tracking-[0.22em] text-cream/35">
        <span className="flex items-center gap-2">
          <span className="h-1 w-1 rounded-full bg-gold/70" /> Tap the objects inside the scene
        </span>
        <span className="flex items-center gap-2">
          <span className="h-1 w-1 rounded-full bg-gold/70" /> Sound &amp; vibration respect your settings
        </span>
        <span className="hidden items-center gap-2 sm:flex">
          <span className="h-1 w-1 rounded-full bg-gold/70" /> Tap the empty sky for a skyshot
        </span>
      </div>
    </div>
  );
}
