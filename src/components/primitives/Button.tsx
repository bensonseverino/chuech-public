import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router'

type ButtonProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children' | 'href'> & {
  variant?: 'mint' | 'dark' | 'ghost-dark'
  children: ReactNode
  /** Internal path — renders a router `<Link>`. */
  to?: string
  /** External / `mailto:` / `tel:` target — renders an `<a>`. */
  href?: string
}

const VARIANTS: Record<NonNullable<ButtonProps['variant']>, string> = {
  mint: 'bg-primary text-obsidian hover:shadow-glow-md focus-visible:outline-obsidian',
  dark: 'bg-black text-white hover:text-primary focus-visible:outline-primary',
  'ghost-dark':
    'border border-white/30 bg-transparent text-white hover:border-primary hover:text-primary focus-visible:outline-primary',
}

/**
 * CTA button (remaining-sections spec §3): rounded-button, 14px/500, 44px min
 * tap height, standard transitions. Internal CTAs (`to`) render a router
 * `<Link>`; `mailto:`/`tel:`/external targets (`href`) stay real anchors
 * (services spec §3.2).
 */
export default function Button({
  variant = 'mint',
  children,
  className = '',
  to,
  href,
  ...rest
}: ButtonProps) {
  const classes = `inline-flex min-h-[44px] items-center justify-center rounded-button px-6 text-[14px] font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 ${VARIANTS[variant]} ${className}`

  if (to !== undefined && href === undefined) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    )
  }

  return (
    <a href={href} className={classes} {...rest}>
      {children}
    </a>
  )
}
