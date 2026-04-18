import type { PitchClass, ChordQuality } from "../domain/music.types";
import { pitchToAudioKey, pitchToMajorContextKey } from "../domain/music.rules";

/**
 * AudioService manages playback of context (chord cadence + arpeggio)
 * and individual note audio files served from /public/audios/.
 *
 * Implements a JIT (Just-In-Time) preload cache: audio files for the upcoming
 * question are pre-fetched into HTMLAudioElement objects while the user is
 * still listening to the current exercise. When their turn arrives, playback
 * starts immediately from the already-decoded buffer — no network latency.
 *
 * All public play methods return a Promise that resolves when the audio
 * finishes playing, allowing callers to auto-advance exercise steps.
 */
export class AudioService {
  private currentAudio: HTMLAudioElement | null = null;

  /**
   * Cache: URL → pre-created HTMLAudioElement.
   * Built up via preload() and consumed by play().
   */
  private cache = new Map<string, HTMLAudioElement>();

  // ---------------------------------------------------------------------------
  // Core playback
  // ---------------------------------------------------------------------------

  /** Stops any currently playing audio immediately. */
  stop(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
  }

  /**
   * Plays the audio at `src`.
   * If the URL is already in cache, reuses the pre-loaded element (zero latency).
   * Otherwise creates a new Audio element on the fly.
   */
  private play(src: string): Promise<void> {
    this.stop();

    // Retrieve from cache or create a fresh element
    const audio = this.cache.get(src) ?? new Audio(src);

    // Always start from the beginning (handles replays and cache hits)
    audio.currentTime = 0;
    this.currentAudio = audio;

    return new Promise<void>((resolve) => {
      const onEnded = () => {
        cleanup();
        this.currentAudio = null;
        resolve();
      };

      const onError = (e: Event) => {
        cleanup();
        this.currentAudio = null;
        console.error("[AudioService] Failed to load:", src, e);
        resolve(); // resolve so the UI can still advance
      };

      const cleanup = () => {
        audio.removeEventListener("ended", onEnded);
        audio.removeEventListener("error", onError);
      };

      audio.addEventListener("ended", onEnded);
      audio.addEventListener("error", onError);

      audio.play().catch((err) => {
        cleanup();
        console.error("[AudioService] play() rejected:", err);
        resolve();
      });
    });
  }

  // ---------------------------------------------------------------------------
  // JIT preloading
  // ---------------------------------------------------------------------------

  /**
   * Silently pre-fetches a list of audio URLs into HTMLAudioElement objects
   * and stores them in the cache. Safe to call multiple times with the same URLs.
   *
   * The browser starts downloading immediately; by the time playback is
   * requested the content is already decoded in memory.
   */
  preload(urls: string[]): void {
    for (const url of urls) {
      if (this.cache.has(url)) continue; // already cached, skip
      const audio = new Audio(url);
      // Preload metadata + enough data to start playing without waiting
      audio.preload = "auto";
      this.cache.set(url, audio);
    }
  }

  // ---------------------------------------------------------------------------
  // Public helpers to build URLs (used by the hook to call preload)
  // ---------------------------------------------------------------------------

  contextUrl(root: PitchClass, quality: ChordQuality): string {
    return quality === "major"
      ? `/audios/major/${pitchToMajorContextKey(root)}_context.wav`
      : `/audios/minor/${pitchToAudioKey(root)}_min_context.wav`;
  }

  noteUrl(pitch: PitchClass): string {
    return `/audios/notes/${pitchToAudioKey(pitch)}.wav`;
  }

  // ---------------------------------------------------------------------------
  // Public play methods
  // ---------------------------------------------------------------------------

  /**
   * Plays the cadence + arpeggio for a given chord.
   * Major: /audios/major/{key}_context.wav  (flat keys for Ds/Gs/As)
   * Minor: /audios/minor/{key}_min_context.wav  (sharp keys)
   */
  playContext(root: PitchClass, quality: ChordQuality): Promise<void> {
    return this.play(this.contextUrl(root, quality));
  }

  /**
   * Plays a single isolated note.
   * /audios/notes/{key}.wav
   */
  playNote(pitch: PitchClass): Promise<void> {
    return this.play(this.noteUrl(pitch));
  }
}

/** Singleton instance shared across the exercise session. */
export const audioService = new AudioService();
