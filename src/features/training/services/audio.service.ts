import type { PitchClass, ChordQuality } from "../domain/music.types";
import { pitchToAudioKey, pitchToMajorContextKey } from "../domain/music.rules";

/**
 * AudioService manages playback of context (chord cadence + arpeggio)
 * and individual note audio files served from /public/audios/.
 *
 * All methods return a Promise that resolves when the audio has finished playing,
 * allowing callers to auto-advance steps.
 */
export class AudioService {
  private currentAudio: HTMLAudioElement | null = null;

  /** Stops any currently playing audio. */
  stop(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
  }

  private play(src: string): Promise<void> {
    this.stop();

    return new Promise<void>((resolve, reject) => {
      const audio = new Audio(src);
      this.currentAudio = audio;

      audio.addEventListener("ended", () => {
        this.currentAudio = null;
        resolve();
      });

      audio.addEventListener("error", (e) => {
        this.currentAudio = null;
        // Resolve instead of reject so the UI can still advance on broken files
        console.error("[AudioService] Failed to load:", src, e);
        resolve();
      });

      audio.play().catch((err) => {
        console.error("[AudioService] play() rejected:", err);
        resolve();
      });
    });
  }

  /**
   * Plays the cadence + arpeggio for a given chord.
   * Major: /audios/major/{key}_context.wav  (uses flat keys for Ds/Gs/As)
   * Minor: /audios/minor/{key}_min_context.wav  (uses sharp keys)
   */
  playContext(root: PitchClass, quality: ChordQuality): Promise<void> {
    const src =
      quality === "major"
        ? `/audios/major/${pitchToMajorContextKey(root)}_context.wav`
        : `/audios/minor/${pitchToAudioKey(root)}_min_context.wav`;
    return this.play(src);
  }

  /**
   * Plays a single isolated note.
   * /audios/notes/{key}.wav
   */
  playNote(pitch: PitchClass): Promise<void> {
    const key = pitchToAudioKey(pitch);
    const src = `/audios/notes/${key}.wav`;
    return this.play(src);
  }
}

/** Singleton instance shared across the exercise session. */
export const audioService = new AudioService();
