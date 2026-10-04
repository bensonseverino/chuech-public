import type { CSSProperties } from 'react'
import MediaFrame from './primitives/MediaFrame'

type MediaPillProps = {
  src: string
  alt?: string
  className?: string
  style?: CSSProperties
}

/**
 * Hero frame adapter over the shared MediaFrame primitive (remaining-sections
 * §3). Radius/glow/overflow come from the primitive; the desktop composition
 * keeps passing unit sizing through `style`.
 */
export default function MediaPill({ src, alt = '', className = '', style }: MediaPillProps) {
  return <MediaFrame src={src} alt={alt} className={className} style={style} />
}
