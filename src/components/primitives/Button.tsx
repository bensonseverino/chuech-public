import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { TransitionLink } from '@/components/TransitionLink'

type ButtonProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children' | 'href'> & {
  variant?: 'mint' | 'dark' | 'ghost-dark'
  /** Optional size variant (footer spec §2.4). Defaults to the standard CTA size. */
  size?: 'default' | 'footer'
  children: ReactNode
  /** Internal path — renders a router `<TransitionLink>`. */
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
 * `<TransitionLink>`; `mailto:`/`tel:`/external targets (`href`) stay real anchors
 * (services spec §3.2).
 */
export default function Button({
  variant = 'mint',
  size = 'default',
  children,
  className = '',
  to,
  href,
  ...rest
}: ButtonProps) {
  const sizeClasses =
    size === 'footer'
      ? 'min-h-[2.75rem] sm:min-h-[2.4rem] lg:min-h-[2.9rem] w-[7.8rem] sm:w-[6.8rem] lg:w-[9.25rem] px-4 sm:px-5 lg:px-7 text-[0.9rem]'
      : 'min-h-[44px] px-6 text-[14px]'

  const classes = `inline-flex items-center justify-center rounded-button font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 ${VARIANTS[variant]} ${sizeClasses} ${className}`

  if (to !== undefined && href === undefined) {
    return (
      <TransitionLink to={to} className={classes} {...rest}>
        {children}
      </TransitionLink>
    )
  }

  return (
    <a href={href} className={classes} {...rest}>
      {children}
    </a>
  )
}
