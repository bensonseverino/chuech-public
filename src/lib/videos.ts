import { buildSrc, type Transformation } from '@imagekit/react'

/**
 * ImageKit video registry (imagekit-videos spec §1).
 *
 * Paths are relative to the endpoint. The `?updatedAt=…` cache-busters from the
 * share links are intentionally dropped: only re-add one (`queryParameters`)
 * when a file is replaced in the dashboard and a stale version is served.
 *
 * The file names contain spaces; `buildSrc` percent-encodes them (`%20`), which
 * is verified by the URLs this module produces.
 */
export const IK_ENDPOINT = 'https://ik.imagekit.io/t29ybgsyj'

export type VideoAsset = { id: string; src: string; label: string }

export const VIDEOS: VideoAsset[] = [
  { id: 'club-scene', src: '/chuech studio/club scene.mp4', label: 'Club scene' },
  { id: 'skyline', src: '/chuech studio/skyline short.mp4', label: 'Skyline' },
  { id: 'city-2', src: '/chuech studio/city 2.mp4', label: 'City' },
  { id: 'run-club', src: '/chuech studio/run club.mp4', label: 'Run club' },
  { id: 'art-scene', src: '/chuech studio/artscne.mp4', label: 'Art scene' },
]

/** Poster rendition width. One size for every slot keeps thumbs ≈40 KB. */
const POSTER_WIDTH = 1280

/** Poster thumbnail for a video: ImageKit's `ik-thumbnail.jpg` frame. */
export function posterUrl(video: VideoAsset): string {
  return buildSrc({
    urlEndpoint: IK_ENDPOINT,
    src: `${video.src}/ik-thumbnail.jpg`,
    transformation: [{ width: POSTER_WIDTH }],
  })
}

/**
 * Delivery transformations (spec §5): strip the audio track (every video is
 * muted), let ImageKit pick the best format, and cap quality. `width` keeps
 * small screens off the 1080p master.
 */
export function videoTransformation(width: number): Transformation[] {
  return [{ width, audioCodec: 'none', format: 'auto', quality: 75 }]
}

/**
 * Video rendition width for the current viewport (spec §5): 720 on phones,
 * 1280 up to 1536px, 1920 above. Falls back to 1280 on the server.
 */
export function videoWidthForViewport(): number {
  if (typeof window === 'undefined') return 1280
  const width = window.innerWidth
  if (width < 768) return 720
  if (width < 1536) return 1280
  return 1920
}
