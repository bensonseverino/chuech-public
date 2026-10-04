import type { ReactNode } from 'react'
import { ArrowRightIcon } from '../icons'

type ArrowLinkProps = {
  /** Required for anchors; omit when rendering a non-interactive span. */
  href?: string
  children: ReactNode
  tone?: 'light' | 'dark'
  /** Render a non-interactive span (used inside a whole-card link). */
  as?: 'a' | 'span'
  className?: string
  'aria-label'?: string
}

/**
 * Text link with the nav hover treatment (remaining-sections spec §3):
 * `silver` 35% pill background plus a mint circular arrow chip that fills and
 * nudges right on hover. Light/dark focus rings.
 */
export default function ArrowLink({
  href,
  children,
  tone = 'light',
  as = 'a',
  className = '',
  'aria-label': ariaLabel,
}: ArrowLinkProps) {
  const linkClass = `group/link inline-flex items-center gap-2 rounded-button px-4 py-2 text-[14px] font-medium transition-colors ${
    tone === 'light'
      ? 'text-obsidian hover:bg-silver/35 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-obsidian'
      : 'text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
  } ${className}`

  if (as === 'span') {
    return (
      <span className={linkClass} aria-hidden="true">
        {children}
        <Chip />
      </span>
    )
  }

  return (
    <a href={href} aria-label={ariaLabel} className={linkClass}>
      {children}
      <Chip />
    </a>
  )
}

function Chip() {
  return (
    <span
      aria-hidden="true"
      className="grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full bg-primary text-obsidian opacity-60 transition-[opacity,transform] group-hover/link:opacity-100 group-hover/link:translate-x-0.5"
    >
      <ArrowRightIcon className="h-3 w-3" />
    </span>
  )
}
