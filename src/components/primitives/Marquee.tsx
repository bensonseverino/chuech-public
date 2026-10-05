import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'

type MarqueeProps = {
  children: ReactNode
  /** Loop duration in seconds — the fallback when `speed` is not given. */
  seconds?: number
  /**
   * Track speed in px/second (experience spec §4). The duration is derived as
   * (half the track's scrollWidth) / speed and recomputed whenever the track
   * resizes (ResizeObserver).
   */
  speed?: number
  /** Span the full viewport width in addition to (instead of) the container. */
  bleed?: boolean
  /** Gap between items; also applied after the last item so the wrap is seamless. */
  gap?: string
  className?: string
}

/**
 * Seamless leftward marquee (remaining-sections spec §3): duplicated track,
 * second copy aria-hidden. Pauses while hovered, focused, or touched (a held
 * finger freezes it), and under reduced motion it becomes a static,
 * swipeable row instead of a frozen one (index.css).
 */
export default function Marquee({
  children,
  seconds = 40,
  speed,
  bleed = false,
  gap,
  className = '',
}: MarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const copyStyle: CSSProperties | undefined = gap ? { gap, paddingRight: gap } : undefined

  // `speed` drives the duration through the `--marquee-duration` custom
  // property so the loop distance (translateX(-50%)) stays pixel-exact. The
  // value is written straight to the DOM: no state, so no render loop.
  useEffect(() => {
    if (speed == null) return
    const track = trackRef.current
    if (!track) return
    const apply = () => {
      const half = track.scrollWidth / 2
      if (half > 0) track.style.setProperty('--marquee-duration', `${(half / speed).toFixed(3)}s`)
    }
    apply()
    const observer = new ResizeObserver(apply)
    observer.observe(track)
    return () => observer.disconnect()
  }, [speed])

  const trackStyle: CSSProperties | undefined =
    speed == null ? { ['--marquee-duration' as string]: `${seconds}s` } : undefined

  // Touch pause: hover has no meaning on touch screens and iOS Safari only
  // applies `:active` when a page has touch listeners, so the hold-to-pause is
  // done with pointer events. The state is written as an inline
  // `animation-play-state` so it also overrides the class-based hover pause.
  useEffect(() => {
    const frame = frameRef.current
    const track = trackRef.current
    if (!frame || !track) return
    // Count concurrent fingers so a second touch before the first release
    // keeps the strip frozen until both are lifted.
    let touching = 0
    const pause = (event: PointerEvent) => {
      if (event.pointerType !== 'touch') return
      touching += 1
      track.style.setProperty('animation-play-state', 'paused')
    }
    const resume = (event: PointerEvent) => {
      if (event.pointerType !== 'touch' || touching === 0) return
      touching -= 1
      if (touching === 0) track.style.removeProperty('animation-play-state')
    }
    frame.addEventListener('pointerdown', pause)
    window.addEventListener('pointerup', resume)
    window.addEventListener('pointercancel', resume)
    return () => {
      frame.removeEventListener('pointerdown', pause)
      window.removeEventListener('pointerup', resume)
      window.removeEventListener('pointercancel', resume)
      track.style.removeProperty('animation-play-state')
    }
  }, [])

  return (
    <div
      ref={frameRef}
      className={[
        'marquee-frame group no-scrollbar overflow-hidden',
        bleed ? 'mx-[calc(50%_-_50vw)] w-screen' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div
        ref={trackRef}
        className="marquee-track flex w-max animate-marquee items-center group-hover:[animation-play-state:paused] group-active:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]"
        style={trackStyle}
      >
        <div className="flex shrink-0 items-center" style={copyStyle}>
          {children}
        </div>
        <div className="flex shrink-0 items-center" aria-hidden="true" style={copyStyle}>
          {children}
        </div>
      </div>
    </div>
  )
}
