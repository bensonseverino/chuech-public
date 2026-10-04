import type { CSSProperties, ReactNode } from 'react'
import LongArrow from './LongArrow'

type Tone = 'light' | 'dark' | 'mint'

type LongArrowLinkProps = {
  href?: string
  children: ReactNode
  /** `light` = obsidian on light surfaces, `dark` = white on dark, `mint` = primary. */
  tone?: Tone
  /** Render a non-interactive span (used inside a whole-row/card link). */
  as?: 'a' | 'span'
  /** 1px stroke — for arrows sitting on dark backgrounds (latest-work spec §4). */
  thin?: boolean
  /** Replaces the default arrow width classes (`73px` / `calc(var(--u)*6.05)`). */
  arrowClassName?: string
  /** Root gap between label and arrow; defaults to `gap-6`. */
  gapClassName?: string
  className?: string
  style?: CSSProperties
  'aria-label'?: string
}

const TONE_CLASS: Record<Tone, string> = {
  light:
    'text-obsidian focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-obsidian',
  dark: 'text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
  mint: 'text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
}

/**
 * The in-content link style (services spec §3.2): label + long thin arrow,
 * no pill background. Arrow: 73px with a 17px/700 label on tablet/mobile,
 * `calc(var(--u)*6.05)` with a 15px/700 label at desktop. On hover/focus the
 * arrow translates 7px right on the standard 0.35s easing. The mint-chip
 * ArrowLink stays for nav items only.
 */
export default function LongArrowLink({
  href,
  children,
  tone = 'light',
  as = 'a',
  thin = false,
  arrowClassName = 'w-[73px] lg:w-[calc(var(--u)*6.05)]',
  gapClassName = 'gap-6',
  className = '',
  style,
  'aria-label': ariaLabel,
}: LongArrowLinkProps) {
  const linkClass = `group/la inline-flex items-center ${gapClassName} text-[17px] font-bold transition-colors lg:text-[15px] ${TONE_CLASS[tone]} ${className}`

  const arrow = (
    <LongArrow
      weight={thin ? 'thin' : 'default'}
      className={`${arrowClassName} shrink-0 transition-transform ease-standard group-hover/la:translate-x-[7px] group-focus-visible/la:translate-x-[7px]`}
    />
  )

  if (as === 'span') {
    return (
      <span className={linkClass} style={style} aria-hidden="true">
        {children}
        {arrow}
      </span>
    )
  }

  return (
    <a href={href} aria-label={ariaLabel} className={linkClass} style={style}>
      {children}
      {arrow}
    </a>
  )
}
