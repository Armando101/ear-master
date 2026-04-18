import type { ExerciseConfig } from "../domain/training.types";
import type { ExerciseQuestion, ChordQuality } from "../domain/music.types";
import {
  getAvailableIntervals,
  pickRandomRoot,
  pickTargetInterval,
  generateMelodicSequence,
  pickMelodicSequenceLength,
} from "../domain/music.rules";

/**
 * The session engine generates one ExerciseQuestion per exercise.
 *
 * First iteration scope: only "major" and "minor" triads are supported.
 * Any other triad types in the config are silently ignored.
 */

const SUPPORTED_QUALITIES: ChordQuality[] = ["major", "minor"];

function resolveQualities(config: ExerciseConfig): ChordQuality[] {
  const selected = config.triads.filter((t): t is ChordQuality =>
    SUPPORTED_QUALITIES.includes(t as ChordQuality)
  );
  return selected.length > 0 ? selected : SUPPORTED_QUALITIES;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Generates a single exercise question based on the current session config.
 */
export function generateQuestion(config: ExerciseConfig): ExerciseQuestion {
  const qualities = resolveQualities(config);
  const quality = pickRandom(qualities);
  const root = pickRandomRoot();
  const availableIntervals = getAvailableIntervals(quality, config.targetNotes);

  const targetIntervals = config.melodicSequence
    ? generateMelodicSequence(availableIntervals, pickMelodicSequenceLength())
    : [pickTargetInterval(availableIntervals)];

  return {
    chord: { root, quality },
    targetIntervals,
    availableIntervals,
  };
}
