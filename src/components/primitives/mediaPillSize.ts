/**
 * The one size every floating media pill uses (hero + experience).
 *
 * Pills are always 16:9; only the width changes at the layout breakpoints:
 *  - phones: fluid `clamp(92px, 26vw, 123px)`
 *  - tablets: 134px
 *  - desktop: 9.07 design units (`--u`), the hero/experience spec width
 *
 * Keeping this in one place means a hero pill and a lower-page pill can never
 * drift to different dimensions.
 */
export const MEDIA_PILL_SIZE =
  'aspect-[16/9] w-[clamp(92px,26vw,123px)] md:w-[134px] lg:w-[calc(var(--u)*9.07)]'
