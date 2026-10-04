import type { CSSProperties, ReactNode } from 'react'
import FloatPill from './primitives/FloatPill'

type FloatingPillProps = {
  children: ReactNode
  className?: string
  style?: CSSProperties
  /** Drift loop variant — hero team pill uses 'a', revenue pill 'b'. */
  variant?: 'a' | 'b'
}

/**
 * Hero pill adapter over the shared FloatPill primitive (remaining-sections
 * §3). Keeps the frozen hero sizing (em padding + clamp text) via harness
 * mode; desktop callers keep passing unit sizing through `style` — inline
 * styles win over classes, so placement is untouched.
 */
export default function FloatingPill({
  children,
  className = '',
  style,
  variant = 'a',
}: FloatingPillProps) {
  return (
    <FloatPill
      variant={variant}
      harness
      className={`min-h-[3.8em] px-[1.6em] py-[0.7em] text-[clamp(9px,2.4vw,18px)] leading-[1.25] tracking-[0.01em] md:text-[clamp(10px,1.25vw,18px)] ${className}`}
      style={style}
    >
      {children}
    </FloatPill>
  )
}
