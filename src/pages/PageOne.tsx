import { useCallback, useEffect, useRef, useState } from "react";
import { ChildrenScene, FamilyScene } from "@/components/Characters";
import { CrackerStage } from "@/components/CrackerStage";
import {
  Diya,
  FallingGold,
  FloatingGlow,
  FlowerDivider,
  Garland,
  Lantern,
  Moon,
  Rangoli,
  Stars,
} from "@/components/Ornaments";
import { ParticleCanvas } from "@/components/ParticleCanvas";
import { ArrowIcon, HeartIcon, SectionHeading, SparkIcon } from "@/components/Shell";
import type { ParticleScene } from "@/lib/particles";
import { cn } from "@/utils/cn";

const QUOTES = [
  "May your home always shine brighter than a thousand diyas.",
  "May every diya bring a new reason to smile.",
  "May this Diwali bring you everything your heart wishes for.",
  "Sometimes, the best gift is simply seeing someone happy.",
];

type SoundName = "boom" | "launch" | "crackle";

export function PageOne({
  onGoLetter,
  onSound,
  reducedMotion,
}: {
  onGoLetter: () => void;
  onSound: (name: SoundName) => void;
  reducedMotion: boolean;
}) {
  const sceneRef = useRef<ParticleScene | null>(null);
  const [started, setStarted] = useState(false);
  const [quote, setQuote] = useState(0);
  const [sparklerTaps, setSparklerTaps] = useState(0);
  const heroRef = useRef<HTMLElement | null>(null);
  const moonWrap = useRef<HTMLDivElement | null>(null);
  const rangoliWrap = useRef<HTMLDivElement | null>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    return () => timers.current.forEach((t) => window.clearTimeout(t));
  }, []);

  /* a slow parallax, so the night has depth */
  useEffect(() => {
    if (reducedMotion) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        if (moonWrap.current) moonWrap.current.style.transform = `translate3d(0, ${y * 0.16}px, 0)`;
        if (rangoliWrap.current) rangoliWrap.current.style.transform = `translate3d(-50%, ${y * -0.05}px, 0)`;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [reducedMotion]);

  useEffect(() => {
    const id = window.setInterval(() => setQuote((q) => (q + 1) % QUOTES.length), 6800);
    return () => window.clearInterval(id);
  }, []);

  const celebrate = useCallback(() => {
    if (started) {
      sceneRef.current?.celebrationRound();
      return;
    }
    setStarted(true);
    onSound("crackle");
    const scene = sceneRef.current;
    if (!scene) return;
    if (reducedMotion) {
      scene.burst(window.innerWidth * 0.5, window.innerHeight * 0.35, { count: 40, speed: 2.4 });
      return;
    }
    onSound("launch");
    scene.launch(window.innerWidth * 0.5, window.innerHeight * 0.22, { count: 150, hue: 42, pattern: "double" });
    const sequence: { delay: number; hue: number; pattern: "peony" | "ring" | "heart" | "willow" | "palm" }[] = [
      { delay: 220, hue: 330, pattern: "ring" },
      { delay: 520, hue: 24, pattern: "willow" },
      { delay: 860, hue: 190, pattern: "heart" },
      { delay: 1200, hue: 282, pattern: "palm" },
      { delay: 1600, hue: 42, pattern: "peony" },
    ];
    sequence.forEach((item) => {
      timers.current.push(
        window.setTimeout(() => {
          scene.burst(window.innerWidth * (0.2 + Math.random() * 0.6), window.innerHeight * (0.12 + Math.random() * 0.3), {
            hue: item.hue,
            pattern: item.pattern,
            count: 90,
            speed: 4.4,
          });
        }, item.delay)
      );
    });
    timers.current.push(window.setTimeout(() => onSound("boom"), 900));
    if (!reducedMotion) {
      for (let i = 0; i < 6; i += 1) {
        timers.current.push(
          window.setTimeout(() => sceneRef.current?.celebrationRound(), 2200 + i * 1500)
        );
      }
    }
  }, [started, onSound, reducedMotion]);

  const onHeroPointer = (event: React.PointerEvent<HTMLElement>) => {
    if (!started) return;
    if ((event.target as HTMLElement).closest("button, a")) return;
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;
    sceneRef.current?.fireSky(event.clientX - rect.left, event.clientY - rect.top);
    onSound("crackle");
  };

  const tapIllustration = (kind: "children" | "family") => {
    setSparklerTaps((n) => n + 1);
    sceneRef.current?.burst(
      window.innerWidth * (kind === "children" ? 0.3 : 0.7),
      window.innerHeight * 0.3,
      { hue: kind === "children" ? 42 : 330, pattern: "heart", count: 56, speed: 3.2 }
    );
    onSound(kind === "children" ? "launch" : "crackle");
  };

  return (
    <div className="relative">
      <FallingGold count={14} />

      {/* ============================== HERO ============================== */}
      <section
        id="celebration"
        ref={heroRef}
        onPointerDown={onHeroPointer}
        className="relative isolate flex min-h-[100svh] flex-col items-center justify-center overflow-hidden pb-28 pt-28 sm:pb-24"
      >
        {/* backdrop */}
        <div className="absolute inset-0 -z-30 bg-[radial-gradient(ellipse_at_50%_-10%,#42205f_0%,#20103a_32%,#0d071d_66%,#07040f_100%)]" />
        <div className="absolute inset-0 -z-20 opacity-90 [background-image:radial-gradient(circle_at_18%_24%,rgba(255,178,92,0.12),transparent_32%),radial-gradient(circle_at_82%_32%,rgba(209,80,107,0.14),transparent_36%),radial-gradient(circle_at_50%_96%,rgba(255,143,63,0.22),transparent_48%)]" />
        <Stars count={64} className="-z-10" />
        <div
          ref={moonWrap}
          className="pointer-events-none absolute -right-10 top-16 -z-10 h-40 w-40 opacity-70 will-change-transform sm:right-6 sm:top-20 sm:h-52 sm:w-52 lg:right-24 lg:h-64 lg:w-64"
        >
          <Moon className="h-full w-full" />
        </div>
        <FloatingGlow count={12} className="-z-10" />

        <div className="absolute inset-x-0 top-0 z-20">
          <Garland className="opacity-90" />
        </div>
        <Lantern className="pointer-events-none absolute -left-2 top-0 z-10 hidden w-16 opacity-80 sm:block lg:left-10 lg:w-20" delay={0.4} />
        <Lantern className="pointer-events-none absolute -right-2 top-0 z-10 hidden w-14 opacity-70 sm:block lg:right-14 lg:w-[72px]" delay={1.4} />

        {/* fireworks canvas */}
        <div className="absolute inset-0 -z-10">
          <ParticleCanvas sceneRef={sceneRef} reducedMotion={reducedMotion} onSound={onSound} className="h-full w-full" />
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-5 text-center">
          <div className="animate-rise flex items-center gap-3 rounded-full border border-gold/20 bg-[#100a1e]/60 px-4 py-2 backdrop-blur-md">
            <SparkIcon className="h-3.5 w-3.5 text-gold/80" />
            <p className="eyebrow !text-[8px] !tracking-[0.32em] text-gold/75 sm:!text-[9px]">
              Deepavali · a festival of lights
            </p>
            <span className="h-1 w-1 rounded-full bg-gold/50" />
            <p className="eyebrow !text-[8px] !tracking-[0.32em] text-gold/55 sm:!text-[9px]">for someone rare</p>
          </div>

          <p
            className="animate-rise mt-6 font-display text-lg italic tracking-[0.1em] text-gold-soft/70 sm:text-xl"
            style={{ animationDelay: "90ms" }}
          >
            शुभ दीपावली
          </p>

          <h1 className="animate-rise relative mt-2" style={{ animationDelay: "150ms" }}>
            <span className="mb-1 flex items-center justify-center gap-3 text-gold/60">
              <span className="text-base sm:text-xl" aria-hidden="true">✦</span>
              <span className="eyebrow !text-[9px] !tracking-[0.44em] text-gold/60 sm:!text-[10px]">the sky is yours tonight</span>
              <span className="text-base sm:text-xl" aria-hidden="true">✦</span>
            </span>
            <span className="mt-2 block font-display text-[clamp(3.1rem,12vw,8.4rem)] font-medium leading-[0.88] tracking-[-0.015em]">
              <span className="text-shimmer drop-shadow-[0_0_40px_rgba(243,201,120,0.25)]">Happy</span>{" "}
              <span className="text-gold-gradient">Diwali</span>
            </span>
            <span className="mx-auto mt-4 block max-w-md font-script text-2xl text-gold-soft/80 sm:text-[2rem]">
              let there be light
            </span>
          </h1>

          <p
            className="animate-rise mt-6 max-w-xl text-[13px] leading-[1.85] text-cream/60 sm:text-[15px]"
            style={{ animationDelay: "260ms" }}
          >
            May this festival of lights fill your life with endless happiness, love, peace and beautiful beginnings.
          </p>

          <div className="animate-rise mt-8 flex flex-col items-center gap-4" style={{ animationDelay: "340ms" }}>
            <button type="button" onClick={celebrate} className="gold-button group">
              <span className="text-[15px] leading-none" aria-hidden="true">🎆</span>
              {started ? "More fireworks, please" : "Tap to celebrate Diwali"}
              <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <p className="flex flex-wrap items-center justify-center gap-2 text-[9px] uppercase tracking-[0.22em] text-cream/35">
              <span>{started ? "the sky is awake" : "tap the sky after the first burst"}</span>
              <span className="h-1 w-1 rounded-full bg-gold/50" />
              <span>sound &amp; sparkles only, no cards required</span>
            </p>
          </div>

          <div className="mt-10 flex h-8 items-end justify-center gap-1.5 opacity-70" aria-hidden="true">
            {[0, 1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className="w-1 rounded-full bg-gradient-to-t from-gold/10 to-gold/70"
                style={{
                  height: `${8 + ((i * 7) % 22)}px`,
                  animation: `glowPulse ${1.6 + i * 0.3}s ease-in-out ${i * 0.2}s infinite`,
                }}
              />
            ))}
          </div>
        </div>

        {/* base */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-56 sm:h-64">
          <div className="absolute inset-0 bg-gradient-to-t from-[#07040f] via-[#0b0517]/70 to-transparent" />
          <div
            ref={rangoliWrap}
            className="absolute bottom-[-6%] left-1/2 h-[260px] w-[760px] max-w-none -translate-x-1/2 opacity-55 will-change-transform sm:h-[300px]"
          >
            <Rangoli className="h-full w-full" />
          </div>
          <div className="absolute inset-x-0 bottom-14 flex items-end justify-center gap-5 sm:gap-10">
            {[54, 42, 66, 42, 54].map((size, i) => (
              <div key={i} className="animate-float" style={{ animationDelay: `${i * 0.6}s` }}>
                <Diya size={size} />
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-3 left-1/2 z-10 -translate-x-1/2">
          <div className="flex flex-col items-center gap-1">
            <span className="text-[8px] uppercase tracking-[0.36em] text-cream/30">scroll, slowly</span>
            <span className="relative h-6 w-px overflow-hidden bg-gradient-to-b from-gold/50 to-transparent">
              <span className="absolute inset-x-0 top-0 h-2 bg-gold-soft" style={{ animation: "sparkFall 2.6s ease-in-out infinite" }} />
            </span>
          </div>
        </div>

        <span className="absolute left-4 top-1/2 hidden -translate-y-1/2 rotate-180 text-[8px] uppercase tracking-[0.44em] text-gold/30 [writing-mode:vertical-rl] lg:block">
          mitthi ke diye · aasman ki roshni
        </span>
        <span className="absolute right-4 top-1/2 hidden -translate-y-1/2 text-[8px] uppercase tracking-[0.44em] text-gold/30 [writing-mode:vertical-rl] lg:block">
          an evening made of light · 2026
        </span>
      </section>

      {/* ========================= INTERACTIVE NIGHT ===================== */}
      <section className="relative py-16 sm:py-24">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,#07040f_0%,#100823_35%,#150b2a_60%,#0a0616_100%)]" />
        <div className="absolute left-1/2 top-16 -z-10 h-72 w-[min(900px,90vw)] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(255,143,63,0.14),transparent_70%)] blur-2xl" />
        <div className="mb-10 px-5">
          <SectionHeading
            index="i."
            eyebrow="the firecracker garden"
            title={
              <>
                Light up the night,
                <br className="hidden sm:block" /> one little cracker at a time.
              </>
            }
            description={
              <>
                Every Diwali has its own soundtrack: the fuse, the hush, the boom, then laughter. Here, you get to be the one
                holding the match. Tap an object inside the scene — the bomb, the rocket, the fountain, the spinner, the sparkler.
              </>
            }
          />
        </div>
        <CrackerStage reducedMotion={reducedMotion} onSound={onSound} />
      </section>

      {/* ============================ CHARACTERS ========================== */}
      <section className="relative overflow-hidden py-16 sm:py-24">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,#0a0616_0%,#150c28_40%,#100a20_100%)]" />
        <FloatingGlow count={10} className="-z-10 opacity-70" />
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <SectionHeading
            index="ii."
            eyebrow="the people in the light"
            title={<>The best part of Diwali is never the fireworks.</>}
            description="It's the someone standing next to you, sparkler in hand, laughing at nothing in particular. It's the family that gathers, the sweets that get shared, the diyas that get lit twice because the wind had other plans."
          />

          <div className="mt-12 grid gap-5 lg:grid-cols-12">
            <button
              type="button"
              onClick={() => tapIllustration("children")}
              className="group reveal gold-frame relative overflow-hidden rounded-[1.5rem] text-left lg:col-span-7"
              aria-label="Tap the children for another firework"
            >
              <div className="relative aspect-[4/3] w-full sm:aspect-[16/11]">
                <ChildrenScene className="absolute inset-0 h-full w-full transition-transform duration-[1200ms] ease-out group-hover:scale-[1.025]" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0616] via-[#0a0616]/10 to-transparent" />
                <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-gold/25 bg-black/25 px-3 py-1.5 backdrop-blur-sm">
                  <SparkIcon className="h-3 w-3 text-gold-soft" />
                  <span className="eyebrow !text-[8px] !tracking-[0.22em] text-gold-soft/80">phuljhari season</span>
                </div>
                <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-3 p-5 sm:p-6">
                  <div>
                    <p className="font-display text-[1.6rem] italic leading-tight text-cream sm:text-3xl">Chhoti chhoti khushiyan</p>
                    <p className="mt-1 text-[11px] leading-relaxed text-cream/55 sm:text-xs">
                      Two sparklers, one sky, and absolutely nowhere else to be.
                    </p>
                  </div>
                  <span className="flex items-center gap-2 rounded-full border border-gold/25 bg-white/5 px-3 py-1.5 text-[8px] uppercase tracking-[0.18em] text-gold-soft/80 transition-colors group-hover:border-gold/60 group-hover:bg-gold/15">
                    tap for a firework <ArrowIcon className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </button>

            <div className="reveal flex flex-col gap-5 lg:col-span-5" style={{ transitionDelay: "100ms" }}>
              <div className="gold-frame relative flex-1 overflow-hidden rounded-[1.5rem] bg-[#100a20] p-6 sm:p-7">
                <span className="pointer-events-none absolute -right-3 -top-8 font-display text-[9rem] leading-none text-gold/[0.07]">
                  ”
                </span>
                <p className="eyebrow text-gold/60">a small truth</p>
                <p className="mt-4 font-display text-2xl leading-snug text-cream/90 sm:text-[1.75rem]">
                  Diwali doesn&apos;t arrive in the sky. It arrives in the voice of someone calling you for sweets.
                </p>
                <FlowerDivider className="mt-6 justify-start" />
                <div className="mt-6 flex items-center gap-4">
                  <Diya size={58} />
                  <div>
                    <p className="font-hand text-xl text-gold-soft/85">every diya is a little promise</p>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-cream/35">
                      of warmth, of return, of light
                    </p>
                  </div>
                </div>
              </div>
              <div className="reveal grid grid-cols-3 gap-2.5" style={{ transitionDelay: "180ms" }}>
                {[
                  ["1,00,000+", "diyas in Varanasi"],
                  ["5", "crackers to light"],
                  ["1", "person in mind"],
                ].map(([big, small]) => (
                  <div key={small} className="rounded-xl border border-gold/15 bg-white/[0.03] px-3 py-3 text-center">
                    <p className="font-display text-lg text-gold-soft sm:text-xl">{big}</p>
                    <p className="mt-1 text-[8px] uppercase leading-tight tracking-[0.14em] text-cream/40">{small}</p>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => tapIllustration("family")}
              className="group reveal gold-frame relative overflow-hidden rounded-[1.5rem] text-left lg:col-span-12"
              aria-label="Tap the family for a burst of light"
            >
              <div className="relative aspect-[4/3] w-full sm:aspect-[16/10] lg:aspect-[16/9]">
                <FamilyScene className="absolute inset-0 h-full w-full transition-transform duration-[1200ms] ease-out group-hover:scale-[1.02]" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0616] via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-4 p-5 sm:p-7">
                  <div className="max-w-md">
                    <p className="eyebrow !text-[8px] text-gold/70">ghar aur mithai</p>
                    <p className="mt-2 font-display text-[1.6rem] italic leading-tight text-cream sm:text-[2rem]">
                      A family, a rangoli, and a plate of kaju katli that never quite reached the table.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="hidden -space-x-2 sm:flex">
                      {["Ma", "Papa", "Chhotu"].map((label, i) => (
                        <span
                          key={label}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/30 bg-[#1b1130] text-[8px] uppercase tracking-widest text-gold-soft/70"
                          style={{ zIndex: 3 - i }}
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                    <span className="flex items-center gap-2 rounded-full border border-gold/25 bg-white/5 px-3 py-1.5 text-[8px] uppercase tracking-[0.18em] text-gold-soft/80 transition-colors group-hover:border-gold/60 group-hover:bg-gold/15">
                      {sparklerTaps > 0 ? `${sparklerTaps} bursts sent` : "tap for sweets & sparkles"} <HeartIcon className="h-3 w-3 text-rosewood" />
                    </span>
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* ============================== QUOTES ============================ */}
      <section className="relative overflow-hidden border-y border-gold/10 bg-[#0c0718] py-16 sm:py-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(66,32,95,0.4),transparent_70%)]" />
        <Stars count={26} className="opacity-60" />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <span className="font-display text-6xl leading-none text-gold/25">“</span>
          <div className="relative mt-[-18px] min-h-[160px] sm:min-h-[150px]">
            {QUOTES.map((text, index) => (
              <p
                key={text}
                aria-hidden={index !== quote}
                className={cn(
                  "absolute inset-x-0 top-0 font-display text-[1.55rem] italic leading-[1.35] text-cream/85 transition-all duration-1000 sm:text-[2.1rem]",
                  index === quote ? "translate-y-0 opacity-100 blur-0" : "pointer-events-none translate-y-2 opacity-0 blur-[2px]"
                )}
              >
                {text}
              </p>
            ))}
          </div>
          <FlowerDivider className="mt-4" />
          <div className="mt-6 flex items-center justify-center gap-2">
            {QUOTES.map((q, i) => (
              <button
                key={q}
                type="button"
                onClick={() => setQuote(i)}
                aria-label={`Quote ${i + 1}`}
                aria-pressed={i === quote}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-500",
                  i === quote ? "w-7 bg-gold" : "w-1.5 bg-white/20 hover:bg-white/40"
                )}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ============================= MESSAGE ============================ */}
      <section className="relative overflow-hidden py-16 sm:py-24">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,#0a0616_0%,#160d28_50%,#0a0514_100%)]" />
        <div className="absolute bottom-0 left-1/2 -z-10 h-[420px] w-[min(1000px,100vw)] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_bottom,rgba(255,143,63,0.24),rgba(255,143,63,0.04)_45%,transparent_70%)]" />
        <div className="mx-auto max-w-4xl px-5">
          <SectionHeading
            index="iii."
            eyebrow="the wish, written properly"
            title="For you, with all the light I could find."
          />

          <div className="reveal gold-frame grain relative mt-10 overflow-hidden rounded-[2rem] bg-[linear-gradient(160deg,#1d1029_0%,#2a1330_38%,#170c22_100%)] px-6 py-10 text-center sm:px-12 sm:py-14">
            <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center opacity-90">
              <Garland className="h-[56px] opacity-80" mirrored />
            </div>
            <div className="absolute inset-x-8 top-6 flex items-center justify-between">
              <span className="h-px flex-1 bg-gradient-to-r from-transparent to-gold/40" />
              <SparkIcon className="mx-3 h-4 w-4 text-gold/70" />
              <span className="h-px flex-1 bg-gradient-to-l from-transparent to-gold/40" />
            </div>

            <div className="mx-auto mt-10 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 -z-10 scale-150 rounded-full bg-[radial-gradient(circle,rgba(255,178,92,0.3),transparent_65%)] blur-2xl" />
                <Diya size={84} />
              </div>
            </div>

            <p className="mt-8 font-display text-[1.7rem] leading-tight text-gold-soft sm:text-[2.3rem]">
              Wishing you a very Happy Diwali!
            </p>
            <FlowerDivider className="mt-5" />
            <div className="mx-auto mt-7 max-w-2xl space-y-4 text-[13.5px] leading-[1.95] text-cream/70 sm:text-[15px]">
              <p>
                May this festival bring you more happiness. May you find everything you wish for, achieve all your dreams, and
                may God always bless you.
              </p>
              <p className="font-display text-lg italic text-cream/85 sm:text-xl">
                May your life always be filled with light, love and happiness.
              </p>
            </div>
            <p className="mt-8 font-hand text-2xl text-gold/80 sm:text-[1.7rem]">— with warmth, and a little more light</p>
            <div className="mx-auto mt-8 grid max-w-md grid-cols-3 gap-2">
              {["love", "peace", "beginnings"].map((word) => (
                <div key={word} className="rounded-full border border-gold/15 bg-white/[0.03] py-2">
                  <span className="text-[8px] uppercase tracking-[0.28em] text-gold/60">{word}</span>
                </div>
              ))}
            </div>
          </div>

          {/* transition */}
          <div className="reveal mt-16 text-center">
            <div className="mx-auto mb-6 flex items-center justify-center gap-3">
              <span className="hairline w-12 sm:w-20" />
              <HeartIcon className="h-3.5 w-3.5 animate-heart text-rosewood" />
              <span className="hairline w-12 sm:w-20" />
            </div>
            <p className="mx-auto max-w-md font-display text-xl italic text-cream/60 sm:text-2xl">
              And now, if you&apos;ll let me, the sky can go quiet for a moment.
            </p>
            <button type="button" onClick={onGoLetter} className="gold-button group mt-8">
              <HeartIcon className="h-4 w-4" />
              There is something more I want to say
              <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <p className="mt-4 text-[9px] uppercase tracking-[0.26em] text-cream/30">
              a quieter page · a single diya · something from the heart
            </p>
          </div>
        </div>
      </section>

      {/* ============================== FOOTER ============================ */}
      <footer className="relative overflow-hidden border-t border-gold/10 bg-[#06030c] pb-10 pt-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-5 text-center">
          <div className="flex items-center gap-3">
            <Diya size={40} />
            <span className="font-display text-xl italic text-cream/70">a diwali made of light</span>
          </div>
          <p className="max-w-md font-hand text-xl text-cream/45">
            Made by hand, with too many sparkles and one very specific person in mind.
          </p>
          <div className="flex items-center gap-4 text-[8px] uppercase tracking-[0.3em] text-cream/25">
            <span>Happy Diwali</span>
            <span className="h-1 w-1 rounded-full bg-gold/40" />
            <span>Miss Kashyap</span>
            <span className="h-1 w-1 rounded-full bg-gold/40" />
            <span>2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
