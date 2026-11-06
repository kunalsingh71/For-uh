import { useEffect, useRef, type RefObject } from "react";
import { ParticleScene } from "@/lib/particles";
import { cn } from "@/utils/cn";

export function ParticleCanvas({
  sceneRef,
  mode = "sky",
  reducedMotion = false,
  onSound,
  className,
  ariaLabel,
}: {
  sceneRef?: RefObject<ParticleScene | null>;
  mode?: "sky" | "stage";
  reducedMotion?: boolean;
  onSound?: (name: "boom" | "launch" | "crackle") => void;
  className?: string;
  ariaLabel?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const soundRef = useRef(onSound);
  soundRef.current = onSound;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const quality = window.innerWidth < 640 ? 0.7 : window.innerWidth < 1024 ? 0.9 : 1;
    let scene: ParticleScene | null = null;
    try {
      scene = new ParticleScene(canvas, {
        mode,
        quality,
        reducedMotion,
        onSound: (name) => soundRef.current?.(name),
      });
    } catch {
      return;
    }
    if (sceneRef) sceneRef.current = scene;

    const onResize = () => scene?.resize();
    window.addEventListener("resize", onResize);

    let visible = true;
    let observer: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          const next = entries[0]?.isIntersecting ?? true;
          if (next && !visible) scene?.start();
          if (!next && visible) scene?.stop();
          visible = next;
        },
        { threshold: 0.02 }
      );
      observer.observe(canvas);
    }

    return () => {
      window.removeEventListener("resize", onResize);
      observer?.disconnect();
      scene?.destroy();
      if (sceneRef) sceneRef.current = null;
    };
  }, [mode, reducedMotion, sceneRef]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("pointer-events-none h-full w-full", className)}
      aria-label={ariaLabel}
      role="img"
    />
  );
}
