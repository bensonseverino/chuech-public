import type { ReactNode } from 'react'
import { Link } from 'react-router'

type OutlineChipProps = {
  children: ReactNode
  /**
   * `dark` (default) is the white outline for dark photo surfaces (latest-work
   * spec §4). `light` is the obsidian outline for the light service links
   * (work page spec §5.3).
   */
  tone?: 'dark' | 'light'
  /**
   * `sm` (default) is the 22/28px tag chip on the project cards. `lg` is the
   * 45px pill used by the work page service links.
   */
  size?: 'sm' | 'lg'
  /** Internal route — makes the chip a router `<Link>` (interactive). */
  to?: string
  /** External / mailto target — makes the chip a plain anchor. */
  href?: string
  className?: string
}

const SIZE: Record<'sm' | 'lg', string> = {
  sm: 'h-[22px] px-[13px] text-[10px] font-semibold md:h-[28px] md:px-[15px] md:text-[12px]',
  lg: 'h-[45px] min-w-[125px] justify-center px-[25px] text-[12px] font-medium lg:min-w-[140px]',
}

/**
 * Outlined tag/category chip (latest-work spec §4; work page spec §5.3). The
 * default (`tone="dark" size="sm"`, no `to`/`href`) renders a non-interactive
 * `<span>` exactly as the project cards expect; passing `to`/`href` makes it an
 * interactive link with the mint hover fill.
 */
export default function OutlineChip({
  children,
  tone = 'dark',
  size = 'sm',
  to,
  href,
  className = '',
}: OutlineChipProps) {
  const interactive = to !== undefined || href !== undefined

  const classes = [
    'inline-flex items-center rounded-pill border leading-none whitespace-nowrap',
    SIZE[size],
    tone === 'dark' ? 'border-white text-white' : 'border-obsidian text-obsidian',
    interactive
      ? 'transition-colors hover:bg-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-obsidian'
      : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  if (to !== undefined) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    )
  }
  if (href !== undefined) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    )
  }
  return <span className={classes}>{children}</span>
}
