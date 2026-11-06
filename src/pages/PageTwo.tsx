import { useEffect, useRef, useState } from "react";
import { Diya, FallingGold, FlowerDivider, Moon, Stars } from "@/components/Ornaments";
import { ArrowIcon, HeartIcon, SparkIcon } from "@/components/Shell";
import { cn } from "@/utils/cn";

type SoundName = "boom" | "launch" | "crackle";

const LETTER: string[] = [
  "Haan, ye Diwali pehle jaisi nahi hai.",
  "Maybe ye pehle se bahut achhi ho aapke liye.",
  "Aasha karta hoon tum aur tumhari family ki bonding wapas sahi ho jaaye.",
  "Abki baar koi umeed nahi rakhunga, na kisi reply ki aur na hi is baat ki ki tumne ye message padha bhi ho.",
  "I miss you a lot, Ita... Kanna... Kaju... IkkU.",
  "Dhyan rakhna apna. Aur jo har saal nahi kar paayi, koshish karna ki ab woh sab kar sako. Khush rehna.",
  "Maine samajh liya hai ki tum apni life mein aage badh chuki ho. Tumhe bahut kuch achieve karna hai. Shayad life ke goals bhi ab dheere-dheere clear ho jayenge.",
  "Chor, ye sab... Happy Diwali to you and your family.",
  "Bahut dhyan rakhna apna.",
];

export function PageTwo({
  onGoHeart,
  onBack,
  onSound,
}: {
  onGoHeart: () => void;
  onBack: () => void;
  onSound: (name: SoundName) => void;
}) {
  const [opened, setOpened] = useState(false);
  const [visible, setVisible] = useState(0);
  const letterRef = useRef<HTMLDivElement | null>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    return () => timers.current.forEach((t) => window.clearTimeout(t));
  }, []);

  const openLetter = () => {
    setOpened(true);
    onSound("crackle");
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    LETTER.forEach((_, index) => {
      timers.current.push(window.setTimeout(() => setVisible(index + 1), 280 + index * 480));
    });
    window.setTimeout(() => {
      letterRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 260);
  };

  return (
    <div className="relative overflow-hidden">
      <FallingGold count={16} className="z-0 opacity-70" />
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_50%_-10%,#2b1b48_0%,#150e27_34%,#0a0616_68%,#06030d_100%)]" />
      <Stars count={72} className="-z-10 opacity-80" />
      <Moon className="pointer-events-none absolute right-[4%] top-24 -z-10 h-32 w-32 opacity-60 sm:h-44 sm:w-44" />

      {/* ============================ OPENING ============================ */}
      <section className="relative px-5 pb-10 pt-28 sm:pt-36">
        <div className="mx-auto max-w-3xl text-center">
          <button type="button" onClick={onBack} className="ghost-button mb-10 !px-4 !py-2 !text-[9px]">
            <ArrowIcon dir="left" className="h-3.5 w-3.5" /> back to the celebration
          </button>

          <div className="flex items-center justify-center gap-3">
            <span className="hairline w-10" />
            <p className="eyebrow text-gold/60">page two · something from my heart</p>
            <span className="hairline w-10" />
          </div>

          <h1 className="mt-6 font-display text-[2.1rem] leading-[1.12] tracking-[-0.01em] text-cream sm:text-[3rem] lg:text-[3.5rem]">
            <span className="text-gold-gradient">Haan, ye Diwali</span>
            <br />
            <span className="italic text-cream/85">pehle jaisi nahi hai...</span>
          </h1>
          <p className="mx-auto mt-5 max-w-lg font-hand text-2xl leading-snug text-cream/50 sm:text-[1.75rem]">
            Some things are easier to write when the sky is quiet. So I turned the fireworks down, and left one diya on.
          </p>

          <div className="relative mx-auto mt-10 w-fit">
            <div className="absolute inset-0 -z-10 scale-[1.8] rounded-full bg-[radial-gradient(circle,rgba(255,178,92,0.25),transparent_65%)] blur-2xl" />
            <div className="animate-float">
              <Diya size={130} />
            </div>
            <span className="absolute -left-16 top-1/2 hidden -translate-y-1/2 rotate-180 text-[8px] uppercase tracking-[0.36em] text-gold/35 [writing-mode:vertical-rl] sm:block">
              one flame, kept burning
            </span>
            <span className="absolute -right-16 top-1/2 hidden -translate-y-1/2 text-[8px] uppercase tracking-[0.36em] text-gold/35 [writing-mode:vertical-rl] sm:block">
              dipped in gold · sealed with love
            </span>
          </div>
        </div>
      </section>

      {/* ============================= LETTER ============================= */}
      <section className="relative px-4 pb-16 pt-4 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <div className="reveal relative">
            {!opened ? (
              <div className="paper relative overflow-hidden rounded-sm p-1.5 sm:p-2">
                <div className="relative flex min-h-[380px] flex-col items-center justify-center overflow-hidden rounded-[2px] border border-[#b2915c]/40 px-6 py-14 text-center sm:min-h-[430px]">
                  <div className="pointer-events-none absolute inset-0 opacity-[0.16] [background-image:repeating-linear-gradient(45deg,#7a542e_0,#7a542e_1px,transparent_0,transparent_9px)]" />
                  <span className="pointer-events-none absolute left-1/2 top-6 -translate-x-1/2 text-[10px] tracking-[0.5em] text-[#8a6538]/60">✦ ✦ ✦</span>
                  <div className="pointer-events-none absolute inset-4 border border-[#a9814b]/25" />
                  <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-[#c89c5d]/15 blur-2xl" />
                  <div className="pointer-events-none absolute -bottom-12 -right-8 h-44 w-44 rounded-full bg-[#c89c5d]/15 blur-2xl" />

                  <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-[#a9814b]/40 bg-[#e8d5b0]/40">
                    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#8b5d2c" strokeWidth="1.3">
                      <rect x="3" y="5.5" width="18" height="13" rx="1.2" />
                      <path d="m3.5 7 8.5 6.4L20.5 7" />
                    </svg>
                  </div>
                  <p className="mt-6 text-[9px] uppercase tracking-[0.36em] text-[#8a6538]">sealed · for one person only</p>
                  <p className="mt-3 font-hand text-[2rem] leading-tight text-[#422b18] sm:text-[2.4rem]">
                    To Miss Kashyap,
                  </p>
                  <p className="mt-1 font-display text-sm italic text-[#6b4a2c]">written quietly, after the fireworks</p>
                  <button
                    type="button"
                    onClick={openLetter}
                    className="mt-8 inline-flex items-center gap-2.5 rounded-full bg-[#5b2a1e] px-7 py-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#f9e9cc] shadow-[0_12px_28px_-14px_rgba(60,25,15,0.9)] transition-transform hover:-translate-y-0.5 hover:bg-[#6d3324]"
                  >
                    <HeartIcon className="h-3.5 w-3.5 text-[#e6a37c]" /> open the letter
                  </button>
                  <p className="mt-4 text-[9px] uppercase tracking-[0.22em] text-[#8a6538]/70">no reply needed · ever</p>

                  <div className="absolute -right-6 -top-6 h-24 w-24 rotate-12 opacity-80">
                    <svg viewBox="0 0 120 120" className="h-full w-full">
                      <circle cx="60" cy="60" r="52" fill="none" stroke="#8b5d2c" strokeWidth="1" opacity="0.35" />
                      <circle cx="60" cy="60" r="44" fill="none" stroke="#8b5d2c" strokeWidth="0.6" strokeDasharray="2 4" opacity="0.4" />
                      <text x="60" y="56" textAnchor="middle" fontSize="7.5" fill="#7c5730" letterSpacing="2" opacity="0.75">
                        DIWALI
                      </text>
                      <text x="60" y="68" textAnchor="middle" fontSize="6" fill="#7c5730" letterSpacing="1.6" opacity="0.6">
                        FROM THE HEART
                      </text>
                    </svg>
                  </div>
                </div>
              </div>
            ) : (
              <div
                ref={letterRef}
                className="paper relative overflow-hidden rounded-sm p-1.5 sm:p-2"
                style={{ animation: "fadeUp 1s cubic-bezier(0.16,1,0.3,1) both" }}
              >
                <div className="paper-line relative overflow-hidden rounded-[2px] border border-[#b2915c]/40 px-6 py-9 sm:px-12 sm:py-12">
                  <div className="pointer-events-none absolute inset-2 border border-[#a9814b]/25" />
                  <div className="pointer-events-none absolute -left-8 -top-8 h-32 w-32 rounded-full bg-[#c89c5d]/20 blur-2xl" />
                  <div className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-[#c89c5d]/20 blur-2xl" />

                  <div className="relative flex flex-wrap items-start justify-between gap-4 border-b border-[#8e673a]/25 pb-5">
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.3em] text-[#8a6538]">a letter, unedited</p>
                      <p className="mt-1 font-display text-lg italic text-[#4a2f1b] sm:text-xl">For Miss Kashyap</p>
                    </div>
                    <div className="text-right">
                      <p className="font-hand text-lg text-[#6b4a2c]">Diwali night</p>
                      <p className="text-[8px] uppercase tracking-[0.22em] text-[#8a6538]/80">this year · this sky</p>
                    </div>
                  </div>

                  <div className="relative mt-6 space-y-[18px] sm:space-y-[22px]">
                    {LETTER.map((paragraph, index) => (
                      <p
                        key={paragraph}
                        className={cn(
                          "font-hand text-[1.45rem] leading-[1.55] text-[#432c1b] transition-all duration-700 sm:text-[1.7rem]",
                          index === 0 && "text-[1.7rem] font-semibold sm:text-[2rem]",
                          index === 4 && "font-semibold text-[#7a2c35]",
                          index === 8 && "font-semibold",
                          index < visible ? "translate-y-0 opacity-100 blur-0" : "translate-y-2 opacity-0 blur-[2px]"
                        )}
                        style={{ transitionDelay: `${Math.min(index * 60, 300)}ms` }}
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  <div className="relative mt-8 flex flex-wrap items-end justify-between gap-6 border-t border-[#8e673a]/25 pt-6">
                    <div>
                      <p className="text-[8px] uppercase tracking-[0.28em] text-[#8a6538]">always, quietly</p>
                      <p className="mt-1 font-script text-[1.9rem] leading-none text-[#5b2a1e] sm:text-[2.2rem]">
                        someone who remembers
                      </p>
                    </div>
                    <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#7c2f30] shadow-[inset_0_2px_6px_rgba(255,180,150,0.3),0_8px_18px_-8px_rgba(70,20,20,0.8)]">
                      <div className="absolute inset-1 rounded-full border border-[#d99d78]/40" />
                      <HeartIcon className="h-6 w-6 animate-heart text-[#f3c6a8]" />
                    </div>
                  </div>

                  <p className="relative mt-6 text-center font-hand text-lg text-[#7c5730]/70">
                    no pressure to reply · bas padh lena
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className={cn("mt-10 text-center transition-all duration-1000", opened ? "opacity-100" : "opacity-60")}>
            <FlowerDivider label={opened ? "read it slowly, no hurry" : "the seal is yours to break"} />
            <div className="mx-auto mt-8 flex max-w-md items-center justify-center gap-3">
              <div className="relative flex h-12 w-12 items-center justify-center rounded-full border border-rosewood/40 bg-rosewood/10">
                <HeartIcon className="h-5 w-5 animate-heart text-rosewood" />
                <span className="absolute inset-0 animate-ping rounded-full border border-rosewood/20" style={{ animationDuration: "4s" }} />
              </div>
              <p className="max-w-[240px] text-left text-[11px] leading-relaxed text-cream/45">
                Some words don&apos;t need an answer. They just needed to be said, on a night like this.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================= NEXT ============================== */}
      <section className="relative overflow-hidden px-5 pb-24 pt-6 text-center">
        <div className="absolute left-1/2 top-10 -z-10 h-64 w-[min(700px,90vw)] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(209,80,107,0.16),transparent_70%)] blur-2xl" />
        <div className="mx-auto max-w-xl">
          <div className="flex justify-center gap-3 text-gold/50">
            <SparkIcon className="h-3.5 w-3.5" />
            <SparkIcon className="h-2.5 w-2.5" />
            <SparkIcon className="h-3.5 w-3.5" />
          </div>
          <p className="mt-5 font-display text-2xl italic leading-snug text-cream/70 sm:text-[1.8rem]">
            There was one more thing I kept at the bottom of the page.
          </p>
          <button type="button" onClick={onGoHeart} className="gold-button group mt-8">
            On the next page, something more <HeartIcon className="h-4 w-4 text-[#7a1f2b]" />
            <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
          <p className="mt-4 text-[9px] uppercase tracking-[0.26em] text-cream/30">one song · one confession · one quiet moon</p>
        </div>
      </section>
    </div>
  );
}
