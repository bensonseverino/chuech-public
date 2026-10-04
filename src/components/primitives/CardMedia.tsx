import type { CSSProperties, ReactNode } from 'react'
import HoverZoom from './HoverZoom'

type CardMediaProps = {
  src: string
  alt?: string
  /** Tailwind aspect utility value, e.g. '16/10'. */
  ratio?: string
  rounded?: 'media' | 'card'
  className?: string
  style?: CSSProperties
  /** Optional overlay rendered above the image (e.g. a FloatPill badge). */
  children?: ReactNode
}

/**
 * Grid-card image frame (remaining-sections spec §3): overflow-hidden rounded
 * frame, no glow, with the shared HoverZoom behaviour. The card root carries
 * `group`; this fills it with a lazy image.
 */
export default function CardMedia({
  src,
  alt = '',
  ratio = '16/10',
  rounded = 'media',
  className = '',
  style,
  children,
}: CardMediaProps) {
  return (
    <span
      className={`relative block overflow-hidden ${
        rounded === 'card' ? 'rounded-card' : 'rounded-media'
      } ${className}`}
      style={{ aspectRatio: ratio, ...style }}
    >
      <HoverZoom src={src} alt={alt} className="absolute inset-0" />
      {children}
    </span>
  )
}
