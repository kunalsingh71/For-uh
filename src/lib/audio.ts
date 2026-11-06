/**
 * A tiny, dependency-free sound studio built on the Web Audio API.
 * Everything here is synthesised in the browser: no external audio files,
 * no autoplay, no paid APIs. Sound only ever starts after a tap.
 */

type AnyCtx = AudioContext & { _unlocked?: boolean };

const MELODY: (string | null)[] = [
  "E4", "A4", "C5", "B4", "A4", "G4", "A4", null,
  "C5", "E5", "D5", "C5", "B4", "A4", "B4", null,
  "A4", "C5", "B4", "G4", "A4", "E4", null, null,
  "G4", "A4", "C5", "D5", "C5", "B4", "A4", null,
];

const CHORDS: (string[] | null)[] = [
  ["A3", "C4", "E4"],
  null,
  null,
  null,
  ["F3", "A3", "C4"],
  null,
  null,
  null,
  ["C4", "E4", "G4"],
  null,
  null,
  null,
  ["G3", "B3", "D4"],
  null,
  null,
  null,
];

const SEMITONES: Record<string, number> = {
  C: 0, "C#": 1, Db: 1, D: 2, "D#": 3, Eb: 3, E: 4, F: 5,
  "F#": 6, Gb: 6, G: 7, "G#": 8, Ab: 8, A: 9, "A#": 10, Bb: 10, B: 11,
};

function noteToHz(note: string): number {
  const match = /^([A-G][b#]?)(-?\d)$/.exec(note);
  if (!match) return 440;
  const semitone = SEMITONES[match[1]];
  const octave = Number(match[2]);
  return 440 * Math.pow(2, (semitone - 9) / 12 + (octave - 4));
}

export class SoundStudio {
  private ctx: AnyCtx | null = null;
  private master: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private musicGain: GainNode | null = null;
  private scheduler: number | null = null;
  private step = 0;
  private nextNoteTime = 0;
  muted = false;
  playing = false;

  unlock(): AudioContext | null {
    if (typeof window === "undefined") return null;
    try {
      const AudioCtor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtor) return null;
      if (!this.ctx) {
        this.ctx = new AudioCtor() as AnyCtx;
        this.master = this.ctx.createGain();
        this.master.gain.value = this.muted ? 0 : 0.7;
        this.analyser = this.ctx.createAnalyser();
        this.analyser.fftSize = 128;
        this.analyser.smoothingTimeConstant = 0.82;
        this.master.connect(this.analyser);
        this.analyser.connect(this.ctx.destination);
      }
      if (this.ctx.state === "suspended") void this.ctx.resume();
      return this.ctx;
    } catch {
      return null;
    }
  }

  setMuted(value: boolean) {
    this.muted = value;
    if (this.ctx && this.master) {
      this.master.gain.setTargetAtTime(value ? 0 : 0.7, this.ctx.currentTime, 0.08);
    }
  }

  getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }

  private noiseBuffer(ctx: AudioContext, seconds: number) {
    const length = Math.floor(ctx.sampleRate * seconds);
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i += 1) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / length);
    }
    return buffer;
  }

  private env(ctx: AudioContext, destination: AudioNode, peak: number, attack: number, decay: number) {
    const gain = ctx.createGain();
    const t = ctx.currentTime;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(Math.max(peak, 0.0002), t + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
    gain.connect(destination);
    return gain;
  }

  /** Deep, warm cracker boom with a low thump. */
  boom(intensity = 1) {
    const ctx = this.unlock();
    if (!ctx || !this.master) return;
    const source = ctx.createBufferSource();
    source.buffer = this.noiseBuffer(ctx, 1.1);
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1200, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.7);
    source.connect(filter);
    filter.connect(this.env(ctx, this.master, 0.42 * intensity, 0.008, 0.85));
    source.start();

    const thump = ctx.createOscillator();
    thump.type = "sine";
    thump.frequency.setValueAtTime(120, ctx.currentTime);
    thump.frequency.exponentialRampToValueAtTime(38, ctx.currentTime + 0.4);
    thump.connect(this.env(ctx, this.master, 0.5 * intensity, 0.006, 0.5));
    thump.start();
    thump.stop(ctx.currentTime + 0.7);
  }

  /** Dry sparkly crackle used by anaar / chakri / phuljhari. */
  crackle(seconds = 0.9, tone = 2400) {
    const ctx = this.unlock();
    if (!ctx || !this.master) return;
    const count = Math.max(4, Math.floor(seconds * 22));
    for (let i = 0; i < count; i += 1) {
      const delay = Math.random() * seconds * 0.85;
      const osc = ctx.createOscillator();
      osc.type = "triangle";
      osc.frequency.value = tone * (0.55 + Math.random() * 1.4);
      const gain = ctx.createGain();
      const t = ctx.currentTime + delay;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.035 + Math.random() * 0.05, t + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
      osc.connect(gain);
      gain.connect(this.master);
      osc.start(t);
      osc.stop(t + 0.08);
    }
  }

  /** Rising whoosh for a skyshot. */
  launch() {
    const ctx = this.unlock();
    if (!ctx || !this.master) return;
    const osc = ctx.createOscillator();
    osc.type = "sine";
    const t = ctx.currentTime;
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.exponentialRampToValueAtTime(950, t + 0.85);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.08, t + 0.18);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.95);
    osc.connect(gain);
    gain.connect(this.master);
    osc.start(t);
    osc.stop(t + 1);

    const noise = ctx.createBufferSource();
    noise.buffer = this.noiseBuffer(ctx, 0.9);
    const hp = ctx.createBiquadFilter();
    hp.type = "bandpass";
    hp.frequency.value = 1400;
    hp.Q.value = 0.8;
    noise.connect(hp);
    hp.connect(this.env(ctx, this.master, 0.05, 0.25, 0.6));
    noise.start();
  }

  /** Soft temple bell, used for interface moments. */
  chime(base = 660) {
    const ctx = this.unlock();
    const master = this.master;
    if (!ctx || !master) return;
    [1, 1.5, 2.02].forEach((ratio, index) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = base * ratio;
      const gain = ctx.createGain();
      const t = ctx.currentTime + index * 0.045;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.06 / (index + 1), t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.4);
      osc.connect(gain);
      gain.connect(master);
      osc.start(t);
      osc.stop(t + 1.5);
    });
  }

  // ----------------------------- music -----------------------------

  private playNote(ctx: AudioContext, destination: AudioNode, hz: number, time: number, length: number, level: number, type: OscillatorType) {
    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.value = hz;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 1750;
    filter.Q.value = 0.6;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(level, time + 0.09);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + length);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(destination);
    osc.start(time);
    osc.stop(time + length + 0.08);
  }

  private schedule = () => {
    const ctx = this.ctx;
    if (!ctx || !this.musicGain || !this.playing) return;
    const beat = 0.62;
    while (this.nextNoteTime < ctx.currentTime + 1.4) {
      const index = this.step % 32;
      const note = MELODY[index];
      if (note) {
        this.playNote(ctx, this.musicGain, noteToHz(note), this.nextNoteTime, 2.4, 0.2, "triangle");
        if (index % 4 === 0) {
          this.playNote(ctx, this.musicGain, noteToHz(note) * 2, this.nextNoteTime + 0.02, 1.6, 0.045, "sine");
        }
      }
      const chord = CHORDS[this.step % 16];
      if (chord) {
        chord.forEach((name, voice) => {
          this.playNote(ctx, this.musicGain!, noteToHz(name), this.nextNoteTime + voice * 0.03, beat * 7.4, 0.055, "sine");
        });
      }
      this.nextNoteTime += beat;
      this.step += 1;
    }
  };

  async startMusic() {
    const ctx = this.unlock();
    if (!ctx || !this.master) return false;
    if (this.playing) return true;
    const master = this.master;
    this.musicGain = ctx.createGain();
    this.musicGain.gain.setValueAtTime(0.0001, ctx.currentTime);
    this.musicGain.gain.exponentialRampToValueAtTime(0.9, ctx.currentTime + 2.2);

    const delay = ctx.createDelay(1.2);
    delay.delayTime.value = 0.42;
    const feedback = ctx.createGain();
    feedback.gain.value = 0.25;
    const wet = ctx.createGain();
    wet.gain.value = 0.3;
    this.musicGain.connect(delay);
    delay.connect(feedback);
    feedback.connect(delay);
    delay.connect(wet);
    wet.connect(master);
    this.musicGain.connect(master);

    this.playing = true;
    this.step = 0;
    this.nextNoteTime = ctx.currentTime + 0.15;
    this.schedule();
    this.scheduler = window.setInterval(this.schedule, 260);
    if (ctx.state === "suspended") await ctx.resume();
    return true;
  }

  stopMusic() {
    if (!this.ctx || !this.musicGain) {
      this.playing = false;
      return;
    }
    const gain = this.musicGain;
    gain.gain.cancelScheduledValues(this.ctx.currentTime);
    gain.gain.setTargetAtTime(0.0001, this.ctx.currentTime, 0.25);
    this.playing = false;
    if (this.scheduler) {
      window.clearInterval(this.scheduler);
      this.scheduler = null;
    }
    window.setTimeout(() => {
      try {
        gain.disconnect();
      } catch {
        /* noop */
      }
    }, 900);
    this.musicGain = null;
  }
}

export const studio = new SoundStudio();

export function vibrate(pattern: number | number[]) {
  try {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(pattern);
    }
  } catch {
    /* vibration is a nice-to-have */
  }
}
