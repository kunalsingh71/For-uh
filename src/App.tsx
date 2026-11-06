import { useCallback, useEffect, useRef, useState } from "react";
import { LoadingScreen, PageVeil, SiteHeader, type PageId } from "@/components/Shell";
import { studio, vibrate } from "@/lib/audio";
import { prefersReducedMotion, useReveal } from "@/lib/useReveal";
import { PageOne } from "@/pages/PageOne";
import { PageThree } from "@/pages/PageThree";
import { PageTwo } from "@/pages/PageTwo";

type SoundName = "boom" | "launch" | "crackle";

const VEIL_LABEL: Record<PageId, string> = {
  celebration: "turning the lights back up…",
  letter: "the sky goes quiet…",
  heart: "one last thing, softly…",
};

export default function App() {
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState<PageId>("celebration");
  const [veil, setVeil] = useState<PageId | null>(null);
  const [soundOn, setSoundOn] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const timers = useRef<number[]>([]);

  useReveal(page);

  /* loading ritual — no one enters before the diyas are lit */
  useEffect(() => {
    let cancelled = false;
    const minimum = new Promise<void>((resolve) => {
      timers.current.push(window.setTimeout(resolve, 1750));
    });
    const fonts = "fonts" in document ? (document as Document & { fonts: FontFaceSet }).fonts.ready.catch(() => undefined) : Promise.resolve();
    Promise.all([minimum, fonts]).then(() => {
      if (!cancelled) setLoading(false);
    });
    return () => {
      cancelled = true;
      timers.current.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  useEffect(() => {
    const initial = prefersReducedMotion();
    if (initial) setReducedMotion(true);
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (event: MediaQueryListEvent) => setReducedMotion(event.matches);
    media.addEventListener?.("change", onChange);
    return () => media.removeEventListener?.("change", onChange);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("reduce-motion", reducedMotion);
    studio.setMuted(!soundOn);
  }, [soundOn, reducedMotion]);

  useEffect(() => {
    return () => {
      studio.stopMusic();
      vibrate(0);
    };
  }, []);

  const handleSound = useCallback(
    (name: SoundName) => {
      if (soundOn) {
        if (name === "boom") studio.boom(1);
        else if (name === "launch") studio.launch();
        else studio.crackle(0.85);
      }
      if (reducedMotion) return;
      if (name === "boom") vibrate([40, 28, 70]);
      else if (name === "launch") vibrate([12, 40, 18]);
      else vibrate(10);
    },
    [soundOn, reducedMotion]
  );

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    studio.setMuted(!next);
    if (next) {
      studio.unlock();
      studio.chime(620);
    }
  };

  const toggleMotion = () => {
    setReducedMotion((v) => {
      const next = !v;
      if (next) studio.stopMusic();
      return next;
    });
  };

  const goTo = useCallback(
    (next: PageId, anchor?: string) => {
      if (next === page) {
        if (anchor) {
          const el = document.getElementById(anchor);
          if (el) el.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
        } else {
          window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
        }
        return;
      }
      if (veil) return;
      if (next !== "heart" && studio.playing) studio.stopMusic();
      setVeil(next);
      document.body.classList.add("no-scroll");
      timers.current.push(
        window.setTimeout(() => {
          setPage(next);
          window.scrollTo(0, 0);
        }, 620)
      );
      timers.current.push(
        window.setTimeout(() => {
          setVeil(null);
          document.body.classList.remove("no-scroll");
          if (anchor) {
            document.getElementById(anchor)?.scrollIntoView({ behavior: "auto", block: "start" });
          }
        }, 1320)
      );
    },
    [page, reducedMotion, veil]
  );

  return (
    <div className="vignette relative min-h-screen overflow-x-hidden bg-night-950 text-cream">
      <LoadingScreen done={!loading} />
      <SiteHeader
        page={page}
        onNavigate={goTo}
        soundOn={soundOn}
        onToggleSound={toggleSound}
        reducedMotion={reducedMotion}
        onToggleMotion={toggleMotion}
      />

      <PageVeil tone={veil ? (veil === "celebration" ? "gold" : "dark") : null} label={veil ? VEIL_LABEL[veil] : ""} />

      <main className={loading ? "pointer-events-none opacity-0" : "opacity-100 transition-opacity duration-700"}>
        {page === "celebration" && (
          <PageOne onGoLetter={() => goTo("letter")} onSound={handleSound} reducedMotion={reducedMotion} />
        )}
        {page === "letter" && (
          <PageTwo onGoHeart={() => goTo("heart")} onBack={() => goTo("celebration")} onSound={handleSound} />
        )}
        {page === "heart" && (
          <PageThree
            onBack={() => goTo("letter")}
            onReplay={() => goTo("celebration")}
            onSound={handleSound}
            soundOn={soundOn}
          />
        )}
      </main>

      {/* quiet companion note for reduced motion */}
      {reducedMotion && (
        <div className="pointer-events-none fixed bottom-4 left-1/2 z-40 -translate-x-1/2">
          <div className="glass rounded-full px-4 py-2">
            <p className="text-[8px] uppercase tracking-[0.24em] text-gold/60">
              gentle mode · animations softened
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
