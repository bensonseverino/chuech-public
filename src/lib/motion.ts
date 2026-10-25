import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(ScrollTrigger, useGSAP)

ScrollTrigger.config({ ignoreMobileResize: true })

export const EASE = {
  out: "power3.out",
  inOut: "power3.inOut",
  expo: "expo.out",
} as const

export const DUR = { fast: 0.4, base: 0.8, slow: 1.2 } as const

/** Same curve for CSS hovers/transitions so GSAP and CSS feel identical */
export const CSS_EASE = "cubic-bezier(0.22, 1, 0.36, 1)"

/** Height of the sticky nav, used as the offset for anchor scrolling.
 *  Match the real nav height (read it from the existing nav/CSS variable if one exists). */
export const NAV_OFFSET = 96

export { gsap, ScrollTrigger, useGSAP }
