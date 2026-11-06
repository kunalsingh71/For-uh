import { useEffect, useState, type ReactNode } from "react";
import { Diya } from "@/components/Ornaments";
import { cn } from "@/utils/cn";

export type PageId = "celebration" | "letter" | "heart";

/* ------------------------------- icons ------------------------------- */
const iconProps = {
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function SoundIcon({ on }: { on: boolean }) {
  return on ? (
    <svg width="17" height="17" viewBox="0 0 24 24" {...iconProps}>
      <path d="M4 9v6h4l5 4V5L8 9H4Z" />
      <path d="M16.5 8.5a5 5 0 0 1 0 7M19.5 6a8.5 8.5 0 0 1 0 12" />
    </svg>
  ) : (
    <svg width="17" height="17" viewBox="0 0 24 24" {...iconProps}>
      <path d="M4 9v6h4l5 4V5L8 9H4Z" />
      <path d="m17 9 5 6M22 9l-5 6" />
    </svg>
  );
}

export function MotionIcon({ on }: { on: boolean }) {
  return on ? (
    <svg width="17" height="17" viewBox="0 0 24 24" {...iconProps}>
      <path d="M3 12h3l2.5-6 4 12L15 12h6" />
    </svg>
  ) : (
    <svg width="17" height="17" viewBox="0 0 24 24" {...iconProps}>
      <path d="M4 15c2.5 0 3-8 6-8s3.5 8 6 8 3-3 4-3" />
      <path d="M3 20h18" />
    </svg>
  );
}

export function HeartIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 21s-7.5-4.6-9.3-9.1C1.2 8 3.4 4.7 6.8 4.7c2 0 3.6 1.1 4.4 2.6l.8 1.5.8-1.5c.8-1.5 2.4-2.6 4.4-2.6 3.4 0 5.6 3.3 4.1 7.2C19.5 16.4 12 21 12 21Z" />
    </svg>
  );
}

export function ArrowIcon({ className, dir = "right" }: { className?: string; dir?: "right" | "down" | "left" }) {
  const rotation = dir === "down" ? "rotate-90" : dir === "left" ? "rotate-180" : "";
  return (
    <svg viewBox="0 0 24 24" className={cn(className, rotation)} {...iconProps} aria-hidden="true">
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  );
}

export function SparkIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <path d="M12 2c1 5 2.6 6.7 7.5 7.5C14.6 10.4 13 12 12 17c-1-5-2.6-6.6-7.5-7.5C9.4 8.7 11 7 12 2Z" fill="currentColor" fillOpacity="0.25" />
      <path d="M19 15.5c.5 2.3 1.2 3 3 3.4-1.8.4-2.5 1.1-3 3.3-.4-2.2-1.1-2.9-3-3.3 1.9-.4 2.6-1.1 3-3.4Z" fill="currentColor" fillOpacity="0.6" />
    </svg>
  );
}

/* ------------------------------- header ------------------------------ */
export function SiteHeader({
  page,
  onNavigate,
  soundOn,
  onToggleSound,
  reducedMotion,
  onToggleMotion,
}: {
  page: PageId;
  onNavigate: (page: PageId, anchor?: string) => void;
  soundOn: boolean;
  onToggleSound: () => void;
  reducedMotion: boolean;
  onToggleMotion: () => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const items: { label: string; page: PageId; anchor?: string }[] = [
    { label: "The celebration", page: "celebration", anchor: "celebration" },
    { label: "Firecrackers", page: "celebration", anchor: "crackers" },
    { label: "The letter", page: "letter" },
    { label: "From the heart", page: "heart" },
  ];

  const isActive = (item: (typeof items)[number]) => page === item.page && !item.anchor;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled ? "bg-[#07040f]/80 shadow-[0_1px_0_rgba(243,201,120,0.14)] backdrop-blur-xl" : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-4 px-4 sm:h-[74px] sm:px-7">
        <button
          type="button"
          onClick={() => onNavigate("celebration")}
          className="group flex items-center gap-2.5 text-left"
          aria-label="Go to the celebration"
        >
          <span className="relative flex h-9 w-9 items-center justify-center">
            <Diya size={34} glow={false} className="-mt-1" />
          </span>
          <span className="leading-none">
            <span className="block font-display text-[15px] italic tracking-wide text-cream/95 sm:text-base">
              a diwali made of light
            </span>
            <span className="mt-1 block text-[8px] font-semibold uppercase tracking-[0.34em] text-gold/55">
              for Miss Kashyap
            </span>
          </span>
        </button>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Sections">
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => {
                onNavigate(item.page, item.anchor);
                setMenuOpen(false);
              }}
              className={cn(
                "relative rounded-full px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] transition-colors",
                isActive(item) ? "text-gold-soft" : "text-cream/45 hover:text-cream/85"
              )}
            >
              {item.label}
              {isActive(item) && (
                <span className="absolute inset-x-3 -bottom-0.5 h-px bg-gradient-to-r from-transparent via-gold/80 to-transparent" />
              )}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={onToggleSound}
            className="icon-button"
            aria-pressed={soundOn}
            aria-label={soundOn ? "Mute sound" : "Enable sound"}
            title={soundOn ? "Sound is on" : "Sound is off"}
          >
            <SoundIcon on={soundOn} />
          </button>
          <button
            type="button"
            onClick={onToggleMotion}
            className={cn("icon-button", reducedMotion && "!border-saffron/40 !text-saffron")}
            aria-pressed={reducedMotion}
            aria-label={reducedMotion ? "Enable animations" : "Reduce animations"}
            title={reducedMotion ? "Gentle mode on" : "Reduce motion"}
          >
            <MotionIcon on={!reducedMotion} />
          </button>
          {page !== "letter" && (
            <button type="button" onClick={() => onNavigate("letter")} className="ghost-button ml-1 hidden !px-4 !py-2.5 !text-[9px] lg:inline-flex">
              Read the letter <ArrowIcon className="h-3.5 w-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="icon-button md:hidden"
            aria-expanded={menuOpen}
            aria-label="Open menu"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" {...iconProps}>
              {menuOpen ? <path d="m6 6 12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-gold/12 bg-[#08050f]/95 px-4 pb-4 pt-2 backdrop-blur-xl md:hidden">
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => {
                onNavigate(item.page, item.anchor);
                setMenuOpen(false);
              }}
              className="flex w-full items-center justify-between border-b border-white/5 py-3 text-left text-[11px] uppercase tracking-[0.24em] text-cream/70 last:border-0"
            >
              {item.label}
              <ArrowIcon className="h-4 w-4 text-gold/60" />
            </button>
          ))}
        </div>
      )}
    </header>
  );
}

/* ----------------------------- page loading --------------------------- */
export function LoadingScreen({ done }: { done: boolean }) {
  const [progress, setProgress] = useState(8);
  useEffect(() => {
    const timer = window.setInterval(() => {
      setProgress((p) => (p >= 96 ? 96 : p + Math.random() * 16));
    }, 180);
    if (done) setProgress(100);
    return () => window.clearInterval(timer);
  }, [done]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#07040f] transition-opacity duration-700",
        done ? "pointer-events-none opacity-0" : "opacity-100"
      )}
      aria-hidden={done}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,178,92,0.14),transparent_66%)]" />
        <div className="absolute left-1/2 top-[42%] h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/10 animate-[spinSlow_26s_linear_infinite]" />
        <div className="absolute left-1/2 top-[42%] h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-gold/10 animate-[spinSlow_40s_linear_infinite_reverse]" />
      </div>
      <div className="relative flex flex-col items-center">
        <Diya size={116} />
        <p className="mt-6 font-display text-2xl italic tracking-wide text-cream/85">lighting the diyas…</p>
        <p className="eyebrow mt-3 !text-[9px] !tracking-[0.4em] text-gold/55">a little festival, made for you</p>
        <div className="mt-7 h-[2px] w-44 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-saffron via-gold-soft to-gold transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

/* --------------------------- transition veil ------------------------- */
export function PageVeil({ tone, label }: { tone: "gold" | "dark" | null; label: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-0 z-[90] flex items-center justify-center transition-opacity duration-700",
        tone ? "opacity-100" : "opacity-0"
      )}
      aria-hidden="true"
    >
      <div
        className={cn(
          "absolute inset-0",
          tone === "gold"
            ? "bg-[radial-gradient(ellipse_at_center,#3a1c1e_0%,#0a0512_58%,#07040f_100%)]"
            : "bg-[#07040f]"
        )}
      />
      <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_30%_30%,rgba(243,201,120,0.16),transparent_40%),radial-gradient(circle_at_70%_70%,rgba(255,143,63,0.12),transparent_45%)]" />
      <div
        className={cn(
          "relative flex flex-col items-center transition-all duration-700",
          tone ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
        )}
      >
        <Diya size={72} />
        <p className="mt-4 font-display text-xl italic text-gold-soft/80">{label}</p>
        <div className="mt-4 flex items-center gap-2">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-1 w-1 rounded-full bg-gold/70"
              style={{ animation: `glowPulse 1.6s ease-in-out ${i * 0.24}s infinite` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------- section title -------------------------- */
export function SectionHeading({
  index,
  eyebrow,
  title,
  description,
  align = "center",
  children,
}: {
  index?: string;
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "center" | "left";
  children?: ReactNode;
}) {
  return (
    <div className={cn("reveal max-w-2xl", align === "center" ? "mx-auto text-center" : "text-left")}>
      <div className={cn("flex items-center gap-3", align === "center" && "justify-center")}>
        {index && <span className="font-display text-xs italic text-gold/40">{index}</span>}
        <span className="h-px w-8 bg-gold/40" />
        <p className="eyebrow text-gold/70">{eyebrow}</p>
      </div>
      <h2 className="mt-4 font-display text-[2rem] leading-[1.08] tracking-[-0.01em] text-cream sm:text-[2.6rem] lg:text-[3rem]">
        {title}
      </h2>
      {description && (
        <p className={cn("mt-4 text-sm leading-relaxed text-cream/50 sm:text-[15px]", align === "center" && "mx-auto max-w-xl")}>
          {description}
        </p>
      )}
      {children}
    </div>
  );
}
