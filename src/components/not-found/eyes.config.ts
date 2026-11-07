/**
 * All googly-eyes tunables in one place (404 spec §6) — sizes, ratios,
 * offsets, rest vectors, timings, easings. The responsive eye/gap sizes must
 * mirror `GooglyEyes.css` (CSS cannot read this file); if you change a size
 * or the pupil ratio here, change it there too.
 */
export const eyesConfig = {
  /** Diameter = this share of the eye diameter. */
  pupilRatio: 0.43,
  /** Right eye sits lower than the left by this share of the eye diameter. */
  rightEyeOffset: 0.1,
  /** How far into the free ring the pupil may slide (404 spec §4.1). */
  travelFactor: 0.85,
  /** Rest position before any input, normalised −1..1 per axis (404 spec §3). */
  rest: {
    /** Desktop: looking up and slightly right, as in the reference. */
    desktop: { x: 0.35, y: -0.55 },
    /** Mobile (touch-first): looking down-right. */
    mobile: { x: 0.25, y: 0.3 },
  } as { desktop: { x: number; y: number }; mobile: { x: number; y: number } },

  tracking: {
    /** `gsap.quickTo` duration + ease for smooth pupil following. */
    duration: 0.35,
    ease: 'power3.out',
    /** Idle wandering (404 spec §4.2). */
    idle: {
      /** Input idles for this long before wandering starts (seconds). */
      startAfter: 2.5,
      /** New glance every min..max seconds while idle. */
      min: 2,
      max: 4,
      /** Glance distance as a share of max travel. */
      reach: 0.6,
      /** Return to idle wandering this long after the last touch (seconds). */
      returnAfterTouch: 2,
    },
  },

  blink: {
    min: 3,
    max: 7,
    /** Squashed scaleY at the closed point. */
    squash: 0.08,
    /** Total open→closed→open time per blink (seconds). */
    duration: 0.16,
    /** Skip a blink when the pupils are mid-travel beyond this share. */
    maxMidTravel: 0.8,
  },

  entrance: {
    duration: 0.6,
    fromScale: 0.6,
    /** Right eye is staggered behind the left (seconds). */
    rightDelay: 0.08,
  },

  /** Hero entrance for heading + button (site's fade + rise, light stagger). */
  heroLoad: { duration: 0.8, rise: 40, stagger: 0.07 },
} as const
