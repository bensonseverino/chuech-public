import { useEffect, useMemo, useRef, useState } from 'react'
import { Video } from '@imagekit/react'
import {
  IK_ENDPOINT,
  posterUrl,
  videoTransformation,
  videoWidthForViewport,
} from '@/lib/videos'
import { getVideoForSlot } from '@/lib/useVideoAssignment'

type LazyVideoProps = {
  /** Stable slot id — the same placeholder always gets the same clip. */
  slotId: string
  /** True only for the hero: mounts and starts at once, no observer delay. */
  priority?: boolean
  /** Pass-through so the existing placeholder keeps its exact box. */
  className?: string
  /** How close the placeholder must be before the clip is fetched. */
  rootMargin?: string
}

/** At most this many clips play at once (spec §5); the farthest pauses. */
const MAX_PLAYING = 3

/** Module-level registry of the clips this component currently drives. */
const playing = new Set<HTMLVideoElement>()

function viewportDistance(el: HTMLElement) {
  const rect = el.getBoundingClientRect()
  return Math.abs(rect.top + rect.height / 2 - window.innerHeight / 2)
}

/** Start a clip, pausing the one furthest from the viewport if over the cap. */
function playTracked(video: HTMLVideoElement) {
  playing.add(video)
  if (playing.size > MAX_PLAYING) {
    const candidates = [...playing]
      .filter((el) => el !== video && !el.paused)
      .sort((a, b) => viewportDistance(b) - viewportDistance(a))
    while (playing.size > MAX_PLAYING && candidates.length > 0) {
      const farthest = candidates.shift()
      if (farthest) {
        farthest.pause()
        playing.delete(farthest)
      }
    }
  }
  // Autoplay policy rejections are expected (muted usually passes) — ignore.
  void video.play().catch(() => {})
}

function pauseTracked(video: HTMLVideoElement) {
  playing.delete(video)
  video.pause()
}

const POSTER_IMG = 'absolute inset-0 h-full w-full object-cover'

/**
 * The single video component for the site (imagekit-videos spec §3).
 *
 * Poster first, clip only when it is needed: a poster `<img>` always sits under
 * the video, the `<Video>` mounts once the wrapper is within `rootMargin`, and
 * it fades in over the poster on `canplay`. Off-screen clips pause and resume
 * on return, at most three play at once, and reduced-motion / Save-Data
 * visitors get the poster only. Decorative throughout (`aria-hidden`), so the
 * text layered above keeps carrying the meaning.
 */
export default function LazyVideo({
  slotId,
  priority = false,
  className = '',
  rootMargin = '200px',
}: LazyVideoProps) {
  const video = getVideoForSlot(slotId)
  const wrapperRef = useRef<HTMLSpanElement>(null)
  const [mounted, setMounted] = useState(
    () => priority || (typeof window !== 'undefined' && typeof IntersectionObserver === 'undefined'),
  )
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)

  // Read once: the app is client-rendered, but guard for pre-rendering too.
  const [posterOnly] = useState(() => {
    if (typeof window === 'undefined') return false
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }
    ).connection
    const slow =
      connection?.saveData === true ||
      connection?.effectiveType === 'slow-2g' ||
      connection?.effectiveType === '2g'
    return reduce || slow
  })

  const [rendition] = useState(() =>
    typeof window === 'undefined' ? 1280 : videoWidthForViewport(),
  )
  const poster = useMemo(() => posterUrl(video), [video])

  // The hero poster is the first thing seen: warm it before it is parsed.
  // Two hero instances (mobile + desktop) share one poster, so the link is
  // only added when the head does not already hold that exact URL.
  useEffect(() => {
    if (!priority || posterOnly) return
    const existing = [...document.querySelectorAll('link[rel="preload"][as="image"]')]
    if (existing.some((link) => link.getAttribute('href') === poster)) return
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = poster
    document.head.appendChild(link)
    return () => link.remove()
  }, [priority, posterOnly, poster])

  // Mount near the viewport, play in it, pause out of it.
  useEffect(() => {
    if (posterOnly) return
    const wrapper = wrapperRef.current
    if (!wrapper) return
    const element = () => wrapper.querySelector('video')

    // No observer support: the state initialiser already mounted the clip.
    if (typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMounted(true)
          const el = element()
          if (el) playTracked(el)
        } else {
          const el = element()
          if (el) pauseTracked(el)
        }
      },
      { rootMargin, threshold: 0.01 },
    )
    observer.observe(wrapper)
    return () => {
      observer.disconnect()
      const el = element()
      if (el) pauseTracked(el)
    }
  }, [posterOnly, rootMargin])

  // A clip that mounted on the previous tick is not in the observer callback yet.
  useEffect(() => {
    if (!mounted) return
    const el = wrapperRef.current?.querySelector('video')
    if (!el) return
    // React's `muted` attribute is unreliable; the property is what autoplay reads.
    el.muted = true
    el.defaultMuted = true
    if (el.paused) playTracked(el)
  }, [mounted])

  return (
    <span
      ref={wrapperRef}
      aria-hidden="true"
      className={`relative block overflow-hidden bg-obsidian ${className}`}
    >
      <img
        src={poster}
        alt=""
        draggable={false}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
        className={POSTER_IMG}
      />
      {mounted && !posterOnly && !failed && (
        <Video
          urlEndpoint={IK_ENDPOINT}
          src={video.src}
          transformation={videoTransformation(rendition)}
          poster={poster}
          muted
          playsInline
          loop
          autoPlay={priority}
          preload={priority ? 'metadata' : 'none'}
          disablePictureInPicture
          controlsList="nodownload"
          tabIndex={-1}
          onCanPlay={() => setReady(true)}
          onLoadedData={() => setReady(true)}
          onError={() => setFailed(true)}
          className={`h-full w-full object-cover transition-opacity duration-[400ms] ease-smooth ${
            ready ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </span>
  )
}
