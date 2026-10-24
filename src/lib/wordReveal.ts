/*
 * Pure word-reveal maths for highlighted text (highlight-scroll-reveal spec §2).
 *
 * Kept separate from the component so the constants and the two functions can
 * be unit-tested and so nothing about the timing drifts when the component is
 * adapted. `HighlightReveal` must keep using these exact values.
 */

/** Opacity every word starts at before its fade-in begins. */
const START_OPACITY = 0.15
/** Portion of progress over which word start times are spread. */
const SPREAD = 0.8
/** Portion of progress each word takes to fade in. */
const WORD_DURATION = 0.2

export interface WordProgressRange {
  start: number
  end: number
}

export function getWordProgressRange(index: number, count: number): WordProgressRange {
  const start = count <= 1 ? 0 : (index / (count - 1)) * SPREAD
  return { start, end: Math.min(1, start + WORD_DURATION) }
}

export function getWordOpacity(
  progress: number,
  { start, end }: WordProgressRange,
  startOpacity = START_OPACITY,
): number {
  if (progress <= start) return startOpacity
  if (progress >= end) return 1
  const wordProgress = (progress - start) / (end - start)
  return startOpacity + (1 - startOpacity) * wordProgress
}
