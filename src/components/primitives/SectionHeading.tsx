import type { ReactNode } from 'react'
import SectionBadge from './SectionBadge'

/**
 * Shared "title role" type scale (web-design spec §4.3): 28px/500 on mobile,
 * 33px/500 from 768px up, line-height 1.15, tracking -0.02em. Panels and form
 * card headings reuse it so the scale lives in one place.
 */
export const TITLE_ROLE =
  'text-[28px] leading-[1.15] font-medium tracking-[-0.02em] md:text-[33px]'

type DotColor = 'obsidian' | 'secondary'

type SectionHeadingProps = {
  children: ReactNode
  /**
   * `light` = the white `shadow-soft` badge pill (Our Services).
   * `dark` = white dot + title for dark panels (latest-work spec §4).
   */
  tone?: 'light' | 'dark'
  as?: 'h1' | 'h2' | 'h3' | 'div' | 'p'
  /** Lets a panel point `aria-labelledby` at its title. */
  id?: string
  /** Light tone only: classes for the badge's arrow-line icon. */
  iconClassName?: string
  className?: string
  /**
   * `dot` = solid dot + title for light backgrounds (web-design spec §5.1):
   * the dot colour follows the text colour unless `dotColor` says otherwise.
   */
  variant?: 'dot'
  /** Dot colour when `variant="dot"`; default matches the title colour. */
  dotColor?: DotColor
  /**
   * Dot placement when `variant="dot"`: `start` (leading) or `end` (trailing,
   * right-aligned — the FAQ heading, spec §5.8).
   */
  align?: 'start' | 'end'
  /** Max width of the title text, in `em` (resolved against the title size). */
  maxWidth?: string
  /** Gap between dot and title; default 12px. */
  dotGap?: string
  /** Dot size classes; default 22px square. The hero h1 passes 25px (§5.1). */
  dotSizeClass?: string
}

/**
 * Section title primitive (latest-work spec §4; web-design spec §2): a wrapper
 * over `SectionBadge` for light panels, a dot heading for dark panels and the
 * new `variant="dot"` dot heading for light panels. The dot hangs into the
 * gutter at lg by giving the caller's `className` a negative inline margin.
 */
export default function SectionHeading({
  children,
  tone = 'light',
  as: Tag = 'h2',
  id,
  iconClassName,
  className = '',
  variant,
  dotColor = 'obsidian',
  align = 'start',
  maxWidth,
  dotGap = '12px',
  dotSizeClass = 'h-[22px] w-[22px]',
}: SectionHeadingProps) {
  if (variant === 'dot') {
    const trailing = align === 'end'
    return (
      <Tag
        id={id}
        className={`flex items-center ${
          trailing ? 'flex-row-reverse' : ''
        } ${dotColor === 'secondary' ? 'text-white' : 'text-obsidian'} ${className}`}
        style={{ gap: dotGap }}
      >
        <span
          aria-hidden="true"
          className={`shrink-0 rounded-full ${
            dotColor === 'secondary' ? 'bg-secondary' : 'bg-black'
          } ${dotSizeClass}`}
        />
        <span
          className="min-w-0"
          style={maxWidth ? { maxWidth: `${maxWidth}em` } : undefined}
        >
          {children}
        </span>
      </Tag>
    )
  }

  if (tone === 'light') {
    return (
      <SectionBadge as="h2" id={id} iconClassName={iconClassName} className={className}>
        {children}
      </SectionBadge>
    )
  }

  return (
    <Tag id={id} className={`flex items-center text-white ${className}`}>
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
