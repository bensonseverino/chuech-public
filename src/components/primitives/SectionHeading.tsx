import type { ReactNode } from 'react'
import SectionBadge from './SectionBadge'

type SectionHeadingProps = {
  children: ReactNode
  /**
   * `light` = the white `shadow-soft` badge pill (Our Services).
   * `dark` = white dot + title for dark panels (latest-work spec §4).
   */
  tone?: 'light' | 'dark'
  as?: 'h2' | 'h3' | 'div' | 'p'
  /** Light tone only: classes for the badge's arrow-line icon. */
  iconClassName?: string
  className?: string
}

/**
 * Section title primitive (latest-work spec §4): a wrapper over `SectionBadge`
 * so light and dark panels share one heading API. The dark tone hangs its dot
 * into the gutter at lg (the caller shifts it) and keeps the text aligned with
 * the card column.
 */
export default function SectionHeading({
  children,
  tone = 'light',
  as: Tag = 'h2',
  iconClassName,
  className = '',
}: SectionHeadingProps) {
  if (tone === 'light') {
    return (
      <SectionBadge as="h2" iconClassName={iconClassName} className={className}>
        {children}
      </SectionBadge>
    )
  }

  return (
    <Tag className={`flex items-center text-white ${className}`}>
      <span
        aria-hidden="true"
        className="h-4 w-4 shrink-0 rounded-full bg-white md:h-6 md:w-6 lg:h-5 lg:w-5"
      />
      <span className="ml-[10px] text-[clamp(21px,13px+2.09vw,33px)] leading-[1.1] font-medium tracking-[-0.02em] md:ml-[12px] lg:ml-[26px]">
        {children}
      </span>
    </Tag>
  )
}
