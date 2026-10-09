import { useEffect, useRef, type CSSProperties } from 'react'

type MediaFrameProps = {
  src: string
  poster?: string
  /** '' (default) marks the media decorative; a real alt makes it meaningful. */
  alt?: string
  glow?: 'md' | 'lg'
  /**
   * Rounded-corner token(s) for `--radius-*`. Each bare token is prefixed with
   * `rounded-`, and responsive variants are allowed: `card md:media`
   * (15px under 768px, 20px above). Default `media` keeps the hero frames as-is.
   */
  radius?: string
  /**
   * Adds a faint mint circle (~2.45x the frame width, `rounded-full`,
   * `shadow-glow-lg`, soft-edged) centred behind the frame (experience spec §5.4).
   * When set, the caller's className/style size the wrapper and the frame fills it.
   */
  halo?: boolean
  /** Above-the-fold media: eager load + high fetch priority (services spec §7). */
  priority?: boolean
  className?: string
  style?: CSSProperties
}

/** `card md:media` -> `rounded-card md:rounded-media` (bare tokens gain `rounded-`). */
function radiusClass(radius: string) {
  return radius
    .split(/\s+/)
    .filter(Boolean)
    .map((token) => {
      const i = token.indexOf(':')
      return i === -1 ? `rounded-${token}` : `${token.slice(0, i + 1)}rounded-${token.slice(i + 1)}`
    })
    .join(' ')
}

/** Mint circle behind a halo frame: no hard edge, glow carried by shadow-glow-lg. */
const HALO_STYLE: CSSProperties = {
  width: '245%',
  aspectRatio: '1',
  background:
    'radial-gradient(circle, color-mix(in srgb, var(--color-primary) 45%, transparent), transparent 70%)',
}

/**
 * Rounded media frame with mint glow (remaining-sections spec §3):
 *  - video: muted looping, plays only while intersecting, paused with poster
 *    under reduced motion, `preload="metadata"`
 *  - image: lazy + async decode
 * Inline-block so callers can place it in a headline row and size it via style.
 */
export default function MediaFrame({
  src,
  poster,
  alt = '',
  glow = 'md',
  radius = 'media',
  halo = false,
  priority = false,
  className = '',
  style,
}: MediaFrameProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const isVideo = /\.(mp4|webm|mov)(\?|#|$)/i.test(src)
  const decorative = alt === ''

  useEffect(() => {
    if (!isVideo) return
    const video = videoRef.current
    if (!video) return
    // Reduced motion: stay paused on the poster frame.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {})
        } else {
          video.pause()
        }
      },
      { threshold: 0.25 },
    )
    observer.observe(video)
    return () => observer.disconnect()
  }, [isVideo])

  const frame = (
    <span
      aria-hidden={decorative || undefined}
      className={[
        'relative shrink-0 overflow-hidden',
        // With a halo the frame fills its wrapper; otherwise it is a 16:9 box.
        halo ? 'block h-full w-full' : 'inline-block aspect-[16/9]',
        radiusClass(radius),
        glow === 'lg' ? 'shadow-glow-lg' : 'shadow-glow-md',
        halo ? '' : className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={halo ? undefined : style}
    >
      {isVideo ? (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <img
          src={src}
          alt={alt}
          draggable={false}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          fetchPriority={priority ? 'high' : 'auto'}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
    </span>
  )

  if (!halo) return frame

  return (
    <span className={`relative inline-block ${className}`} style={style}>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-glow-lg"
        style={HALO_STYLE}
      />
      {frame}
    </span>
  )
}
