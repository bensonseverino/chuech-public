import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'

type FloatPillProps = Omit<HTMLAttributes<HTMLSpanElement>, 'style'> & {
  children: ReactNode
  /** Loop variant — a and b run mirrored paths so pills never drift in sync. */
  variant?: 'a' | 'b'
  tone?: 'mint' | 'lavender'
  /**
   * `lg` (default) is the hero pill: 17px label, 3.3em tall.
   * `sm` is the compact pill (experience spec §4): 13px label on mobile,
   * 14px on tablet, 42px tall, 18px/24px side padding.
   */
  size?: 'lg' | 'sm'
  /**
   * When true, omit the default size/padding classes so a caller (the hero)
   * can supply its own frozen geometry via className/style.
   */
  harness?: boolean
  style?: CSSProperties
}

const PRESET: Record<'lg' | 'sm', string> = {
  lg: 'px-[1.77em] h-[3.3em] text-[17px]',
  sm: 'px-[18px] md:px-[24px] h-[42px] text-[13px] md:text-[14px]',
}

/**
 * Decorative mint/lavender pill that drifts 2–3px on an eased, transform-only
 * loop (remaining-sections spec §3). Positioning/display and any unit sizing
 * come from the caller via className/style. Decorative only: aria-hidden.
 */
export default function FloatPill({
  children,
  variant = 'a',
  tone = 'mint',
  size = 'lg',
  harness = false,
  className = '',
  style,
  ...rest
}: FloatPillProps) {
  return (
    <span
      aria-hidden="true"
      {...rest}
      className={[
        'float-pill inline-flex items-center whitespace-nowrap rounded-pill font-medium text-obsidian shadow-glow-sm',
        !harness && PRESET[size],
        tone === 'mint' ? 'bg-primary' : 'bg-secondary',
        variant === 'a' ? 'animate-float-a' : 'animate-float-b',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={style}
    >
      {children}
    </span>
  )
}
