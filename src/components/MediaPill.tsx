import type { CSSProperties } from 'react'
import MediaFrame from './primitives/MediaFrame'

type MediaPillProps = {
  src: string
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
 * §3). Radius/glow/overflow come from the primitive; the desktop composition
 * keeps passing unit sizing through `style`.
 *
 * `slotId` swaps the photo for an ImageKit clip inside the same frame
 * (imagekit-videos spec §4); geometry is untouched either way.
 */
export default function MediaPill({
  src,
  alt = '',
  className = '',
  style,
  slotId,
  priority = false,
}: MediaPillProps) {
  return (
    <MediaFrame
      src={src}
      alt={alt}
      className={className}
      style={style}
      video={slotId ? { slotId, priority } : undefined}
    />
  )
}
