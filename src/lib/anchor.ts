import { NAV_OFFSET } from './motion'

/**
 * Effective `offset` for `lenis.scrollTo(element)`.
 *
 * Lenis (1.3.x) already subtracts the target's own `scroll-margin-top` before
 * applying the caller's offset, and this site's anchor targets carry
 * `scroll-mt-24` (= 96px = NAV_OFFSET). Passing `-NAV_OFFSET` on top of that
 * would land twice as high, so the margin is cancelled out and exactly one
 * NAV_OFFSET of clearance remains — with or without `scroll-mt-*` on the
 * target (smooth-scroll spec §5 / §12 "offset correct").
 */
export function anchorOffset(el: Element): number {
  const margin = Number.parseFloat(window.getComputedStyle(el).scrollMarginTop)
  return (Number.isNaN(margin) ? 0 : margin) - NAV_OFFSET
}
