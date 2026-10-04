import type { AnchorHTMLAttributes, ReactNode } from 'react'

type ButtonProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> & {
  variant?: 'mint' | 'dark' | 'ghost-dark'
  children: ReactNode
}

const VARIANTS: Record<NonNullable<ButtonProps['variant']>, string> = {
  mint: 'bg-primary text-obsidian hover:shadow-glow-md focus-visible:outline-obsidian',
  dark: 'bg-black text-white hover:text-primary focus-visible:outline-primary',
  'ghost-dark':
    'border border-white/30 bg-transparent text-white hover:border-primary hover:text-primary focus-visible:outline-primary',
}

/**
 * CTA button (remaining-sections spec §3): rounded-button, 14px/500, 44px min
 * tap height, standard transitions. Renders an anchor so every CTA is a real
 * link to a real route.
 */
export default function Button({
  variant = 'mint',
  children,
  className = '',
  ...rest
}: ButtonProps) {
  return (
    <a
      {...rest}
      className={`inline-flex min-h-[44px] items-center justify-center rounded-button px-6 text-[14px] font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 ${VARIANTS[variant]} ${className}`}
    >
      {children}
    </a>
  )
}
