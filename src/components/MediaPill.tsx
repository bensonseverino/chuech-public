import type { CSSProperties } from 'react'
import MediaFrame from './primitives/MediaFrame'
import { asset, imageSrc } from '../content/assets'

type MediaPillProps = {
  /** Asset slot name (resolved via `asset()`) or an already-resolved URL. */
  src: string
  /** When true the `src` is treated as a slot name and resolved via `asset()`. */
  asSlot?: boolean
  alt?: string
  className?: string
  style?: CSSProperties
  /** ImageKit slot id — when set the frame shows a clip instead of `src`. */
  slotId?: string
  /** Above-the-fold hero frame: mounts and plays immediately. */
  priority?: boolean
}

/**
 * Hero frame adapter over the shared MediaFrame primitive (remaining-sections
 * §3). Radius/glow/overflow come from the primitive; every caller sizes it with
 * the shared `MEDIA_PILL_SIZE` classes.
 *
 * `slotId` swaps the photo for an ImageKit clip inside the same frame
 * (imagekit-videos spec §4); geometry is untouched either way. When `src` is a
 * slot name and `asSlot` is true it is resolved through `asset()` so callers can
 * pass slot names (e.g. the randomly chosen pill slot) directly without first
 * calling `asset()` themselves.
 */
export default function MediaPill({
  src,
  asSlot = false,
  alt = '',
  className = '',
  style,
  slotId,
  priority = false,
}: MediaPillProps) {
  const resolved = asSlot ? asset(src) : imageSrc(src)
  return (
    <MediaFrame
      src={resolved}
      alt={alt}
      className={className}
      style={style}
      video={slotId ? { slotId, priority } : undefined}
    />
  )
}
