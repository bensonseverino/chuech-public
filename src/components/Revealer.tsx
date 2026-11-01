import { useRef } from 'react'
import { useRevealer } from '@/hooks/useRevealer'

/**
 * Full-viewport obsidian panel that covers an incoming page and then retracts
 * upward (page-transition spec §4).
 *
 * Mounted once in `RootLayout` and keyed by pathname, so it remounts — and
 * replays — on every route change. `pointer-events-none` is required so the
 * overlay never blocks clicks while it is retracting, and the inline
 * `scaleY(1)` keeps the page covered from the first paint, before JS runs.
 *
 * z-index comes from `--z-revealer` (index.css): above every page section,
 * below the sticky glass nav (`z-50`) and the logo header (`z-40`). The nav's
 * own z-index is untouched.
 */
export default function Revealer() {
  const ref = useRef<HTMLDivElement>(null)
  useRevealer(ref)

  return (
    <div
      ref={ref}
      className="revealer pointer-events-none fixed inset-0 h-screen w-screen bg-obsidian"
      style={{
        zIndex: 'var(--z-revealer, 30)',
        transformOrigin: 'top center',
        transform: 'scaleY(1)', // covered by default, so there is no flash before JS runs
      }}
      aria-hidden="true"
    />
  )
}
