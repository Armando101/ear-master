import type { PitchClass, ChordQuality } from "../domain/music.types";
import { pitchToAudioKey, pitchToMajorContextKey } from "../domain/music.rules";

// ---------------------------------------------------------------------------
// AudioService — Polyphonic Voice Architecture
// ---------------------------------------------------------------------------
//
// Two independent playback layers:
//
//  1. CONTEXT  (monophonic): One exclusive slot for chord cadences/arpeggios.
//     Starting a new context immediately stops the previous one.
//
//  2. NOTE VOICES (polyphonic): A dynamic Set of short-lived HTMLAudioElement
//     clones, one per note in the melodic sequence.
//     Each clone is spawned from a preloaded master element, so it starts
//     playing in the same tick with zero network latency.
//     When a clone finishes it removes itself from the Set automatically.
//
// JIT Preload Cache:
//     preload(urls) silently creates master Audio elements and stores them.
//     These masters are NEVER played directly — only cloned.
//     Clones inherit the decoded data (or fetch from browser cache instantly).
//
// ---------------------------------------------------------------------------

export class AudioService {
  // ── Cache ─────────────────────────────────────────────────────────────────

  /**
   * Master cache: URL → preloaded HTMLAudioElement.
   * Masters are never played; they serve as clone sources.
   */
  private cache = new Map<string, HTMLAudioElement>();

  // ── Layers ────────────────────────────────────────────────────────────────

  /** Exclusive slot for the chord cadence/arpeggio (monophonic). */
  private contextVoice: HTMLAudioElement | null = null;

  /**
   * Active note clones (polyphonic).
   * Each entry is a live clone produced from a cache master.
   * Entries remove themselves on "ended" or "error".
   */
  private noteVoices = new Set<HTMLAudioElement>();

  // ── Preloading ────────────────────────────────────────────────────────────

  /**
   * Silently pre-fetches a list of URLs into master Audio elements.
   * Safe to call multiple times — already-cached URLs are skipped.
   */
  preload(urls: string[]): void {
    for (const url of urls) {
      if (this.cache.has(url)) continue;
      const master = new Audio(url);
      master.preload = "auto"; // tell the browser to buffer aggressively
      this.cache.set(url, master);
    }
  }

  // ── URL helpers ───────────────────────────────────────────────────────────

  contextUrl(root: PitchClass, quality: ChordQuality): string {
    return quality === "major"
      ? `/audios/major/${pitchToMajorContextKey(root)}_context.wav`
      : `/audios/minor/${pitchToAudioKey(root)}_min_context.wav`;
  }

  noteUrl(pitch: PitchClass): string {
    return `/audios/notes/${pitchToAudioKey(pitch)}.wav`;
  }

  // ── Global stop ───────────────────────────────────────────────────────────

  /**
   * Immediately stops ALL audio:
   * the context voice and every active note voice.
   */
  stop(): void {
    this._stopContext();
    for (const voice of this.noteVoices) {
      voice.pause();
    }
    this.noteVoices.clear();
  }

  // ── Context layer (monophonic) ────────────────────────────────────────────

  private _stopContext(): void {
    if (this.contextVoice) {
      this.contextVoice.pause();
      this.contextVoice.currentTime = 0;
      this.contextVoice = null;
    }
  }

  /**
   * Plays the chord cadence + arpeggio exclusively.
   * Any previously playing context is stopped first.
   * Returns a Promise that resolves when the audio finishes.
   */
  playContext(root: PitchClass, quality: ChordQuality): Promise<void> {
    this._stopContext();
    const src = this.contextUrl(root, quality);

    // Clone from cache master (or create a fresh element as fallback).
    // Cloning inherits the src attribute and browser-cached data.
    const master = this.cache.get(src) ?? new Audio(src);
    const voice = master.cloneNode(false) as HTMLAudioElement;
    // Ensure src is set — cloneNode copies attributes but let's be explicit:
    if (!voice.src) voice.src = src;

    this.contextVoice = voice;

    return new Promise<void>((resolve) => {
      const cleanup = () => {
        voice.removeEventListener("ended", onEnded);
        voice.removeEventListener("error", onError);
        if (this.contextVoice === voice) this.contextVoice = null;
      };
      const onEnded = () => { cleanup(); resolve(); };
      const onError = (e: Event) => {
        cleanup();
        console.error("[AudioService] Context error:", src, e);
        resolve();
      };
      voice.addEventListener("ended", onEnded);
      voice.addEventListener("error", onError);
      voice.play().catch((err) => {
        cleanup();
        console.error("[AudioService] Context play() rejected:", err);
        resolve();
      });
    });
  }

  // ── Note layer (polyphonic) ───────────────────────────────────────────────

  /**
   * Plays a single note via a fresh voice clone.
   *
   * ─ The clone is spawned from the preloaded master in the cache, so it
   *   starts playing with zero JS-level latency.
   * ─ The previous note's natural decay (tail) can still ring as the next
   *   clone fires — no hard cuts between sequential notes.
   * ─ The clone lives in `noteVoices` until it finishes and removes itself.
   *
   * Returns a Promise that resolves when this note's playback ends,
   * allowing callers to `await` sequential note chains.
   */
  playNote(pitch: PitchClass): Promise<void> {
    const src = this.noteUrl(pitch);
    const master = this.cache.get(src) ?? new Audio(src);
    const voice = master.cloneNode(false) as HTMLAudioElement;
    if (!voice.src) voice.src = src;

    this.noteVoices.add(voice);

    return new Promise<void>((resolve) => {
      const cleanup = () => {
        voice.removeEventListener("ended", onEnded);
        voice.removeEventListener("error", onError);
        this.noteVoices.delete(voice);
      };
      const onEnded = () => { cleanup(); resolve(); };
      const onError = (e: Event) => {
        cleanup();
        console.error("[AudioService] Note error:", src, e);
        resolve();
      };
      voice.addEventListener("ended", onEnded);
      voice.addEventListener("error", onError);
      voice.play().catch((err) => {
        cleanup();
        console.error("[AudioService] Note play() rejected:", err);
        resolve();
      });
    });
  }
}

/** Singleton instance shared across the exercise session. */
export const audioService = new AudioService();
