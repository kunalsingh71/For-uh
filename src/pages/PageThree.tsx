import { useCallback, useEffect, useRef, useState } from "react";
import { Diya, FallingGold, FlowerDivider, Moon, Stars } from "@/components/Ornaments";
import { ParticleCanvas } from "@/components/ParticleCanvas";
import { ArrowIcon, HeartIcon, SparkIcon } from "@/components/Shell";
import { studio } from "@/lib/audio";
import type { ParticleScene } from "@/lib/particles";
import { useReveal } from "@/lib/useReveal";
import { cn } from "@/utils/cn";

const CONFESSION = [
  "Apka mann hai, aap message karo ya na karo. Mera ab aap par na koi zor hai aur na hi koi haq.",
  "Shayad main selfish ho gaya tha. Main ye bhool gaya tha ki main hamesha se kya chahta tha.",
  "Maine hamesha sab kuch isliye kiya tha taaki tum khush raho, tumhe koi pareshani na ho.",
  "Ab main bas tumhari khushi chahta hoon.",
  "Tumhe life mein jo karna hai karo, apne saare dreams achieve karo. Mujhe sach mein bahut khushi hogi jab tum apni life mein bahut khush hogi aur tumhe koi gam nahi hoga.",
  "Bas ek baat kehna chahta hoon: tumhari khushi mere liye hamesha important rahegi.",
  "Meri taraf se sabko Happy Diwali.",
  "Apna bahut dhyan rakhna.",
];

const TRACK_LENGTH = 134;

function MusicPlayer({ soundOn }: { soundOn: boolean }) {
  const [playing, setPlaying] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [pending, setPending] = useState(false);
  const bars = useRef<(HTMLSpanElement | null)[]>([]);
  const raf = useRef(0);

  useEffect(() => {
    return () => {
      cancelAnimationFrame(raf.current);
      if (studio.playing) studio.stopMusic();
    };
  }, []);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => setSeconds((s) => (s + 1) % TRACK_LENGTH), 1000);
    return () => window.clearInterval(id);
  }, [playing]);

  useEffect(() => {
    const analyser = studio.getAnalyser();
    if (!playing || !analyser) return;
    const data = new Uint8Array(analyser.frequencyBinCount);
    const tick = () => {
      analyser.getByteFrequencyData(data);
      bars.current.forEach((bar, i) => {
        if (!bar) return;
        const value = data[(i * 2 + 3) % data.length] / 255;
        bar.style.transform = `scaleY(${0.14 + Math.min(1, value * 1.7) * 0.9})`;
        bar.style.opacity = `${0.35 + value * 0.65}`;
      });
      raf.current = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf.current);
  }, [playing]);

  const toggle = async () => {
    if (pending) return;
    setPending(true);
    if (playing) {
      studio.stopMusic();
      setPlaying(false);
      bars.current.forEach((bar, i) => {
        if (bar) {
          bar.style.transform = `scaleY(${0.18 + ((i * 7) % 5) * 0.06})`;
          bar.style.opacity = "0.4";
        }
      });
    } else {
      const ok = await studio.startMusic();
      setPlaying(ok);
      if (ok) studio.setMuted(!soundOn);
    }
    setPending(false);
  };

  const progress = (seconds / TRACK_LENGTH) * 100;
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <div className="reveal glass relative mx-auto mt-10 max-w-xl overflow-hidden rounded-[1.4rem] p-4 sm:p-5">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(255,143,63,0.14),transparent_60%)]" />
      <div className="relative flex items-center gap-4">
        <button
          type="button"
          onClick={toggle}
          className="group relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-gold/50 bg-[linear-gradient(160deg,#f9dc9e,#e0ad55)] text-[#3b2209] shadow-[0_16px_34px_-16px_rgba(243,201,120,0.8)] transition-transform hover:scale-[1.04]"
          aria-label={playing ? "Pause the instrumental" : "Play the instrumental"}
          aria-pressed={playing}
        >
          <span className="absolute inset-0 rounded-full border border-gold/40 opacity-0 transition-all duration-500 group-hover:scale-125 group-hover:opacity-100" />
          {playing ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4.5" width="4" height="15" rx="1.2" />
              <rect x="14" y="4.5" width="4" height="15" rx="1.2" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="ml-0.5">
              <path d="M8 5.2c0-.9 1-1.4 1.7-1l10 6.8c.7.5.7 1.5 0 2l-10 6.8c-.7.4-1.7-.1-1.7-1V5.2Z" />
            </svg>
          )}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate font-display text-lg leading-tight text-cream/90 sm:text-xl">
                Mai Phir Bhi Tumko Chahunga
              </p>
              <p className="mt-0.5 text-[9px] uppercase tracking-[0.22em] text-gold/50">
                a soft instrumental · made in-browser
              </p>
            </div>
            <span className={cn("shrink-0 text-[10px] tabular-nums tracking-wider", playing ? "text-gold/80" : "text-cream/35")}>
              {mm}:{ss}
            </span>
          </div>

          <div className="mt-3 flex h-8 items-end gap-[3px]" aria-hidden="true">
            {Array.from({ length: 32 }).map((_, i) => (
              <span
                key={i}
                ref={(el) => {
                  bars.current[i] = el;
                }}
                className={cn(
                  "h-full flex-1 origin-bottom rounded-full bg-gradient-to-t from-gold-deep/50 via-gold/80 to-gold-soft transition-transform duration-100",
                  !playing && "opacity-40"
                )}
                style={{
                  transform: `scaleY(${playing ? 0.2 : 0.18 + ((i * 7) % 5) * 0.06})`,
                  animation: !playing ? `barDance ${1.8 + (i % 6) * 0.24}s ease-in-out ${i * 0.05}s infinite` : undefined,
                }}
              />
            ))}
          </div>

          <div className="mt-2 flex items-center gap-3">
            <div className="h-[2px] flex-1 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-saffron via-gold to-gold-soft transition-all duration-1000"
                style={{ width: `${Math.max(progress, playing ? 1 : 0)}%` }}
              />
            </div>
            <span className="text-[8px] uppercase tracking-[0.2em] text-cream/30">loops gently</span>
          </div>
        </div>

        <span className="hidden h-10 w-10 items-center justify-center rounded-lg border border-gold/20 bg-[#1a1029] sm:flex">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.3" className="text-gold/70">
            <path d="M9 18V6l10-2v12" />
            <circle cx="6.5" cy="18" r="2.5" />
            <circle cx="16.5" cy="16" r="2.5" />
          </svg>
        </span>
      </div>
      <p className="relative mt-3 text-center text-[9px] uppercase tracking-[0.2em] text-cream/30">
        {!soundOn && playing
          ? "sound is muted · tap the speaker at the top to hear it"
          : playing
            ? "playing softly · press pause whenever you like"
            : "no autoplay · press play when you're ready"}
      </p>
    </div>
  );
}

export function PageThree({
  onBack,
  onReplay,
  onSound,
  soundOn,
}: {
  onBack: () => void;
  onReplay: () => void;
  onSound: (name: "boom" | "launch" | "crackle") => void;
  soundOn: boolean;
}) {
  const [revealed, setRevealed] = useState(false);
  const sceneRef = useRef<ParticleScene | null>(null);
  const pageRef = useRef<HTMLDivElement | null>(null);
  useReveal(revealed ? "heart-open" : "heart-closed");

  const sendHeart = useCallback(
    (x: number, y: number) => {
      sceneRef.current?.burst(x, y, { hue: 338, hue2: 42, pattern: "heart", count: 90, speed: 3.8 });
      onSound("boom");
    },
    [onSound]
  );

  const onSectionPointer = (event: React.PointerEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest("button, a")) return;
    sendHeart(event.clientX, event.clientY);
  };

  const fireHearts = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    sendHeart(window.innerWidth / 2, window.innerHeight * 0.32);
  };

  return (
    <div ref={pageRef} onPointerDown={onSectionPointer} className="relative overflow-hidden">
      <div className="pointer-events-none fixed inset-0 z-0">
        <ParticleCanvas sceneRef={sceneRef} onSound={onSound} className="h-full w-full" ariaLabel="A quiet sky that blooms with heart-shaped fireworks when you touch it" />
      </div>
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_50%_0%,#1b1430_0%,#0d0919_40%,#06030d_78%)]" />
      <Stars count={80} className="-z-10 opacity-70" />
      <Moon className="pointer-events-none absolute left-1/2 top-16 -z-10 h-40 w-40 -translate-x-1/2 opacity-90 sm:left-[12%] sm:top-24 sm:h-52 sm:w-52 sm:translate-x-0" />
      <FallingGold count={12} className="z-0 opacity-50" />

      {/* ============================== SONG ============================== */}
      <section className="relative z-10 px-5 pb-16 pt-28 sm:pt-36">
        <div className="mx-auto max-w-3xl text-center">
          <button type="button" onClick={onBack} className="ghost-button mb-12 !px-4 !py-2 !text-[9px]">
            <ArrowIcon dir="left" className="h-3.5 w-3.5" /> back to the letter
          </button>

          <div className="flex items-center justify-center gap-3">
            <span className="hairline w-10" />
            <p className="eyebrow text-gold/60">page three · the last little bit</p>
            <span className="hairline w-10" />
          </div>

          <p className="mt-7 font-display text-xl italic tracking-wide text-cream/50 sm:text-[1.4rem]">I would like to say...</p>
          <h1 className="mt-2 font-script text-[clamp(2.6rem,8vw,4.8rem)] leading-[1.05]">
            <span className="text-gold-gradient drop-shadow-[0_0_36px_rgba(243,201,120,0.25)]">Mai Phir Bhi</span>
            <br />
            <span className="text-gold-gradient">Tumko Chahunga</span>{" "}
            <span className="inline-block align-middle text-[0.55em] text-rosewood animate-heart">❤</span>
          </h1>
          <p className="mx-auto mt-5 max-w-md text-[12px] leading-relaxed text-cream/40 sm:text-[13px]">
            Press play if you&apos;d like a little music. It isn&apos;t the original song — just a quiet melody that felt close
            enough to the feeling.
          </p>

          <MusicPlayer soundOn={soundOn} />

          <p className="mt-5 font-hand text-xl text-gold-soft/50">
            headphones on, lights low, nothing else to do for the next three minutes.
          </p>
        </div>
      </section>

      {/* ============================ CONFESSION ========================== */}
      <section className="relative z-10 px-5 py-16 sm:py-24">
        <div className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(180deg,transparent,rgba(24,10,30,0.35)_40%,rgba(10,5,18,0.55))]" />
        <div className="absolute left-1/2 top-10 -z-10 h-72 w-[min(760px,90vw)] -translate-x-1/2 bg-[radial-gradient(ellipse,rgba(209,80,107,0.18),transparent_70%)] blur-3xl" />

        <div className="mx-auto max-w-3xl text-center">
          <div className="reveal flex items-center justify-center gap-3">
            <span className="hairline w-10" />
            <HeartIcon className="h-3 w-3 text-rosewood" />
            <span className="hairline w-10" />
          </div>

          <h2 className="reveal mt-8 font-display text-[clamp(1.9rem,5.6vw,3.4rem)] font-medium leading-[1.12] tracking-[0.01em]">
            <span className="text-gold-gradient">I LOVE YOU</span>
            <span className="mx-2 text-cream/40 sm:mx-3">&amp;</span>
            <span className="text-gold-gradient">I MISS YOU A LOT,</span>
            <br />
            <span className="mt-2 block font-script text-[clamp(2.4rem,8vw,4.9rem)] leading-none text-cream">
              Miss Kashyap.
            </span>
          </h2>

          <button
            type="button"
            onClick={fireHearts}
            className="reveal mx-auto mt-8 flex h-14 w-14 items-center justify-center rounded-full border border-rosewood/40 bg-rosewood/10 transition-transform hover:scale-110"
            aria-label="Send a heart into the sky"
          >
            <HeartIcon className="h-6 w-6 animate-heart text-rosewood" />
          </button>
          <p className="mt-3 text-[8px] uppercase tracking-[0.28em] text-cream/25">tap the heart, or anywhere, for a sky full of them</p>

          {!revealed ? (
            <div className="mt-12">
              <button type="button" onClick={() => { setRevealed(true); onSound("crackle"); }} className="ghost-button">
                <SparkIcon className="h-3.5 w-3.5" /> say the rest, softly
              </button>
            </div>
          ) : (
            <div className="mt-12 text-left">
              <div className="reveal gold-frame relative overflow-hidden rounded-[1.4rem] bg-[linear-gradient(165deg,rgba(33,19,53,0.85),rgba(14,8,25,0.9))] px-6 py-8 sm:px-10 sm:py-10">
                <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-gold/60 via-gold/20 to-transparent" />
                <FlowerDivider label="from the heart · unfiltered" className="mb-8" />
                <div className="space-y-5">
                  {CONFESSION.map((paragraph, index) => (
                    <p
                      key={paragraph}
                      className={cn(
                        "reveal font-display text-[1.1rem] leading-[1.75] text-cream/75 sm:text-[1.22rem]",
                        index === 7 && "font-semibold italic text-gold-soft/90",
                        index === 3 && "text-[1.3rem] italic text-cream/95 sm:text-[1.4rem]"
                      )}
                      style={{ transitionDelay: `${index * 110}ms` }}
                    >
                      <span className="mr-3 align-top font-sans text-[9px] tracking-widest text-gold/40">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {paragraph}
                    </p>
                  ))}
                </div>
                <div className="mt-8 flex items-center justify-between border-t border-gold/10 pt-5">
                  <p className="text-[8px] uppercase tracking-[0.24em] text-cream/25">no reply needed, truly</p>
                  <HeartIcon className="h-3.5 w-3.5 text-rosewood/70" />
                </div>
              </div>
            </div>
          )}

          <div className="reveal mt-16">
            <FlowerDivider label="and now, the last light" />
          </div>
        </div>
      </section>

      {/* ============================= ENDING ============================= */}
      <section className="relative z-10 px-5 pb-24 pt-6 sm:pb-28">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[420px] bg-[radial-gradient(ellipse_at_50%_100%,rgba(255,143,63,0.18),transparent_65%)]" />
        <div className="mx-auto max-w-3xl text-center">
          <p className="reveal mx-auto max-w-lg font-display text-xl italic leading-relaxed text-cream/50 sm:text-[1.5rem]">
            Some feelings don&apos;t need a reply. Some wishes are simply made from the heart.
          </p>

          <div className="reveal relative mx-auto mt-14 w-fit">
            <div className="absolute inset-0 -z-10 scale-[2] rounded-full bg-[radial-gradient(circle,rgba(255,178,92,0.3),transparent_62%)] blur-2xl" />
            <div className="relative">
              <Diya size={150} />
            </div>
            <div className="absolute -inset-10 -z-10 rounded-full border border-gold/10" />
            <div className="absolute -inset-20 -z-10 rounded-full border border-dashed border-gold/[0.07]" />
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <span
                key={i}
                className="absolute h-1 w-1 rounded-full bg-gold/70"
                style={{
                  left: `${-30 + i * 34}px`,
                  bottom: `${40 + (i % 3) * 22}px`,
                  animation: `driftUp ${4 + i * 0.7}s ease-in-out ${i * 0.8}s infinite`,
                  ["--dx" as string]: `${(i % 2 ? 1 : -1) * 18}px`,
                }}
              />
            ))}
          </div>

          <p className="reveal mt-12 font-display text-lg uppercase tracking-[0.32em] text-cream/35">Happy Diwali,</p>
          <h2 className="reveal mt-3 font-script text-[clamp(2.7rem,9vw,5.4rem)] leading-[1.05]">
            <span className="text-shimmer">Miss Kashyap.</span> <span className="text-rosewood">❤️</span>
          </h2>

          <div className="reveal mx-auto mt-8 h-px w-40 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
          <p className="reveal mx-auto mt-7 max-w-md font-hand text-2xl leading-snug text-gold-soft/60 sm:text-[1.7rem]">
            May your year be gentler than this year was. May your home always have one diya left burning.
          </p>

          <div className="reveal mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button type="button" onClick={onReplay} className="gold-button !px-6 !py-3 !text-[10px]">
              <SparkIcon className="h-3.5 w-3.5" /> celebrate again
            </button>
            <button type="button" onClick={onBack} className="ghost-button !py-3">
              <HeartIcon className="h-3 w-3 text-rosewood" /> read the letter once more
            </button>
          </div>

          <div className="reveal mt-16 flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 text-gold/50">
              <span className="h-px w-8 bg-gold/30" />
              <SparkIcon className="h-3 w-3" />
              <span className="h-px w-8 bg-gold/30" />
            </div>
            <p className="text-[8px] uppercase tracking-[0.32em] text-cream/25">
              written by hand · lit by one diya · sent with love
            </p>
            <p className="font-display text-sm italic text-cream/30">from someone who will always wish you light.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
