import type { CSSProperties } from 'react'

type HoverZoomProps = {
  src: string
  alt?: string
  className?: string
  style?: CSSProperties
}

/**
 * Lazy image that scales to 1.04 on card hover (remaining-sections spec §3).
 * Trigger it by giving the card root the `group` class. The card supplies the
 * `overflow-hidden` rounded frame (CardMedia); this renders just the image.
 */
export default function HoverZoom({ src, alt = '', className = '', style }: HoverZoomProps) {
  return (
    <img
      src={src}
      alt={alt}
      draggable={false}
      loading="lazy"
      decoding="async"
      style={style}
      className={`h-full w-full object-cover transition-transform group-hover:scale-[1.04] ${className}`}
    />
  )
}
