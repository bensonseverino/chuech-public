import { useRef, type ElementType, type HTMLAttributes, type ReactNode } from 'react'
import { gsap, useGSAP, DUR, EASE } from '@/lib/motion'

interface RevealProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode
  as?: ElementType
  /** Everything else (`id`, `aria-*`, `style`, …) passes straight through, so
   *  swapping a section's root element for `Reveal` renders the exact same
   *  element with the exact same attributes. */
  y?: number // start offset in px (default 40)
  delay?: number
  fade?: boolean // set false when children already animate opacity (e.g. HighlightReveal)
  stagger?: number // if set, animate direct children one after another
  start?: string // ScrollTrigger start (default "top 88%")
}

/**
 * Scroll-in wrapper (smooth-scroll spec §7): animates only `transform` and
 * `opacity`, once per element, through `useGSAP` so ScrollTriggers are cleaned
 * up automatically. Skipped entirely under `prefers-reduced-motion`.
 *
 * `children` are wrapped as-is — the wrapper adds no classes, so the wrapped
 * element keeps its own layout, size and position.
 */
export function Reveal({
  children, as: Tag = 'div', className, y = 40, delay = 0, fade = true, stagger, start = 'top 88%', ...rest
}: RevealProps) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const targets = stagger ? Array.from(ref.current!.children) : ref.current
        gsap.from(targets, {
          y,
          ...(fade ? { opacity: 0 } : {}),
          duration: DUR.base,
          delay,
          ease: EASE.out,
          stagger: stagger ?? 0,
          scrollTrigger: { trigger: ref.current, start, once: true },
        })
      })
    },
    { scope: ref },
  )

  return <Tag ref={ref} className={className} {...rest}>{children}</Tag>
}
