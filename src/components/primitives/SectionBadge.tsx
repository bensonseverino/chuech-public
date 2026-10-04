import type { CSSProperties, ReactNode } from 'react'
import { LongArrowIcon } from '../icons'

type SectionBadgeProps = {
  /** Element to render — the services section uses `as="h2"`. */
  as?: 'div' | 'p' | 'h2'
  children: ReactNode
  /** Classes for the arrow-line icon (hero callers pass their frozen sizes). */
  iconClassName?: string
  className?: string
  style?: CSSProperties
}

/**
 * White `shadow-soft` pill with a thin arrow-line icon (services spec §3.1):
 * the same surface as the hero partner badge. The hero callers pass their
 * frozen sizing through className/style so placements stay identical; the
 * services section renders it as its `<h2>`.
 */
export default function SectionBadge({
  as: Tag = 'div',
  children,
  iconClassName = 'h-3.5 w-[37px] md:w-[54px]',
  className = '',
  style,
}: SectionBadgeProps) {
  return (
    <Tag
      className={`shadow-soft inline-flex max-w-full items-center rounded-pill bg-white ${className}`}
      style={style}
    >
      <LongArrowIcon className={`shrink-0 ${iconClassName}`} />
      {children}
    </Tag>
  )
}
