/**
 * Pure geometry for the googly-eyes not-found page (404 spec §6) — no DOM
 * access, no state; the tracking hook calls these. All units are CSS pixels.
 */

export type Vec2 = { x: number; y: number }

export type EyeCenter = { x: number; y: number }

/** Explicit bounds clamp — clearer than inline Math.min/max chains. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/**
 * Polar → cartesian: a magnitude from a centre at `angleRadians` (0 = +x,
 * positive = towards +y, i.e. screen-down) gives the endpoint offset.
 */
export function polarToCartesian(angleRadians: number, radius: number): Vec2 {
  return { x: Math.cos(angleRadians) * radius, y: Math.sin(angleRadians) * radius }
}

/** Full geometry one pupil needs, all in CSS pixels (viewport space). */
export type PupilGeom = {
  eyeRadius: number
  pupilRadius: number
  target: { x: number; y: number }
}

/**
 * Pupil offset so the pupil "looks at" `target` (404 spec §4.1): straight
 * line from the eye's centre to the target, magnitude clamped to
 * `maxTravel = (eyeRadius − pupilRadius) × travel`. A target at the centre
 * gives `{0, 0}`; a far target slides the pupil to the edge along the same
 * direction, so two eyes converge naturally near/ between them.
 */
export function computePupilOffset({
  eyeCenter,
  eyeRadius,
  pupilRadius,
  target,
  travel = 0.85,
}: {
  eyeCenter: { x: number; y: number }
  eyeRadius: number
  pupilRadius: number
  target: { x: number; y: number }
  travel?: number
}): Vec2 {
  const maxTravel = Math.max(0, (eyeRadius - pupilRadius) * travel)
  const dx = target.x - eyeCenter.x
  const dy = target.y - eyeCenter.y
  const distance = Math.hypot(dx, dy)
  if (distance === 0 || maxTravel === 0) return { x: 0, y: 0 }
  const reach = Math.min(distance, maxTravel)
  return { x: (dx / distance) * reach, y: (dy / distance) * reach }
}
