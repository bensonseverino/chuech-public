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
 * second copy aria-hidden, pauses on hover/focus-within, static under
 * reduced motion (animation disabled on `.marquee-track`).
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

  return (
    <div
      className={[
        'group overflow-hidden',
        bleed ? 'mx-[calc(50%_-_50vw)] w-screen' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div
        ref={trackRef}
        className="marquee-track flex w-max animate-marquee items-center group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]"
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
