import type { PitchClass, ChordQuality, PitchNote } from "../domain/music.types";
import { pitchToAudioKey, pitchToNoteKey, pitchToMajorContextKey } from "../domain/music.rules";

// ---------------------------------------------------------------------------
// AudioService — Dual-layer architecture
// ---------------------------------------------------------------------------
//
//  CONTEXT layer  (HTMLAudioElement, monophonic)
//    Long cadence/arpeggio files. One exclusive slot; cloned from a preloaded
//    master so network latency is zero.
//
//  NOTE layer  (Web Audio API, gapless scheduling)
//    Short individual note files decoded into AudioBuffers.
//    All notes in a sequence are scheduled upfront at precise
//    AudioContext.currentTime offsets → zero JS-event-loop gap between notes.
//    Preloading = fetch() + decodeAudioData() (fire-and-forget).
//    playNoteSequence() awaits any still-in-flight decodes before scheduling.
//
// ---------------------------------------------------------------------------

export class AudioService {

  // ── Web Audio context (lazy) ───────────────────────────────────────────────

  private _ctx: AudioContext | null = null;

  private get ctx(): AudioContext {
    if (!this._ctx) {
      this._ctx = new (window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    return this._ctx;
  }

  // ── Note buffer cache (Web Audio API) ─────────────────────────────────────

  /** Decoded AudioBuffers, keyed by URL. */
  private bufferCache = new Map<string, AudioBuffer>();

  /**
   * In-flight fetch+decode promises.
   * Kept until the buffer is stored in bufferCache, then deleted.
   * playNoteSequence() awaits these if a URL is still loading.
   */
  private bufferLoading = new Map<string, Promise<void>>();

  // ── Context HTML cache (HTMLAudioElement) ──────────────────────────────────

  private htmlCache = new Map<string, HTMLAudioElement>();

  // ── Active playback handles ────────────────────────────────────────────────

  private contextVoice: HTMLAudioElement | null = null;
  private noteNodes: AudioBufferSourceNode[] = [];
  private noteResolve: (() => void) | null = null;

  // ── URL helpers ───────────────────────────────────────────────────────────

  contextUrl(root: PitchClass, octave: number, quality: ChordQuality): string {
    const key    = quality === "major" ? pitchToMajorContextKey(root) : pitchToAudioKey(root);
    const suffix = quality === "major" ? "_context.wav" : "_min_context.wav";
    const folder = quality === "major" ? "major" : "minor";
    return `/audios/${folder}/${key}${octave}${suffix}`;
  }

  noteUrl(note: PitchNote): string {
    return `/audios/notes/${pitchToNoteKey(note.pitch)}${note.octave}.wav`;
  }

  // ── Preloading ────────────────────────────────────────────────────────────

  /** Preload context files as HTMLAudioElement masters (clone-on-play). */
  preloadContext(urls: string[]): void {
    for (const url of urls) {
      if (this.htmlCache.has(url)) continue;
      const el = new Audio(url);
      el.preload = "auto";
      this.htmlCache.set(url, el);
    }
  }

  /**
   * Fire-and-forget fetch + decode of note files into AudioBuffers.
   * Safe to call multiple times — already-cached or in-flight URLs are skipped.
   */
  preloadNotes(urls: string[]): void {
    for (const url of urls) {
      if (this.bufferCache.has(url) || this.bufferLoading.has(url)) continue;

      const p = fetch(url)
        .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.arrayBuffer(); })
        .then((ab) => this.ctx.decodeAudioData(ab))
        .then((buf) => { this.bufferCache.set(url, buf); })
        .catch((err) => { console.error("[AudioService] Note preload failed:", url, err); })
        .finally(() => { this.bufferLoading.delete(url); });

      this.bufferLoading.set(url, p);
    }
  }

  // ── Global stop ───────────────────────────────────────────────────────────

  stop(): void {
    this._stopContext();
    this._stopNotes();
  }

  private _stopContext(): void {
    if (this.contextVoice) {
      this.contextVoice.pause();
      this.contextVoice.currentTime = 0;
      this.contextVoice = null;
    }
  }

  private _stopNotes(): void {
    for (const node of this.noteNodes) {
      try { node.stop(); } catch { /* already stopped */ }
    }
    this.noteNodes = [];
    if (this.noteResolve) { this.noteResolve(); this.noteResolve = null; }
  }

  // ── Context layer (HTMLAudioElement, monophonic) ──────────────────────────

  playContext(root: PitchClass, octave: number, quality: ChordQuality): Promise<void> {
    this._stopContext();
    const src    = this.contextUrl(root, octave, quality);
    const master = this.htmlCache.get(src) ?? new Audio(src);
    const voice  = master.cloneNode(false) as HTMLAudioElement;
    if (!voice.src) voice.src = src;
    this.contextVoice = voice;

    return new Promise<void>((resolve) => {
      const cleanup = () => {
        voice.removeEventListener("ended", onEnded);
        voice.removeEventListener("error", onError);
        if (this.contextVoice === voice) this.contextVoice = null;
      };
      const onEnded = () => { cleanup(); resolve(); };
      const onError = (e: Event) => { cleanup(); console.error("[AudioService] Context error:", src, e); resolve(); };
      voice.addEventListener("ended", onEnded);
      voice.addEventListener("error", onError);
      voice.play().catch((err) => { cleanup(); console.error("[AudioService] Context play() rejected:", err); resolve(); });
    });
  }

  // ── Note layer (Web Audio API, gapless scheduling) ────────────────────────

  /**
   * Plays a sequence of notes with zero gap between them.
   *
   * All AudioBufferSourceNodes are created and scheduled before the first
   * sample plays. The browser's audio thread executes each start time at
   * sample-accuracy — no JS round-trips between notes.
   *
   * If a buffer is still being decoded (preloadNotes in flight), we await it
   * before scheduling so playback is never skipped.
   */
  async playNoteSequence(notes: PitchNote[]): Promise<void> {
    this._stopNotes();
    if (notes.length === 0) return;

    // Await any in-flight decodes for the notes we're about to play
    const inFlight = notes
      .map((n) => this.bufferLoading.get(this.noteUrl(n)))
      .filter((p): p is Promise<void> => p !== undefined);
    if (inFlight.length > 0) await Promise.all(inFlight);

    // Resume AudioContext if suspended (required on mobile after inactivity)
    if (this.ctx.state === "suspended") await this.ctx.resume();

    return new Promise<void>((resolve) => {
      this.noteResolve = resolve;

      let startTime    = this.ctx.currentTime + 0.05; // 50 ms lead-in
      let pendingCount = notes.length;

      const onNodeEnded = (node: AudioBufferSourceNode) => {
        const idx = this.noteNodes.indexOf(node);
        if (idx !== -1) this.noteNodes.splice(idx, 1);
        pendingCount--;
        if (pendingCount <= 0) { this.noteResolve?.(); this.noteResolve = null; }
      };

      for (const note of notes) {
        const url    = this.noteUrl(note);
        const buffer = this.bufferCache.get(url);

        if (!buffer) {
          console.error("[AudioService] Buffer missing at play time:", url);
          pendingCount--;
          if (pendingCount <= 0) { resolve(); this.noteResolve = null; }
          continue;
        }

        const node = this.ctx.createBufferSource();
        node.buffer = buffer;
        node.connect(this.ctx.destination);
        node.start(startTime);
        node.onended = () => onNodeEnded(node);

        this.noteNodes.push(node);
        startTime += buffer.duration;
      }

      if (notes.length === 0) { resolve(); this.noteResolve = null; }
    });
  }
}

/** Singleton instance shared across the exercise session. */
export const audioService = new AudioService();
