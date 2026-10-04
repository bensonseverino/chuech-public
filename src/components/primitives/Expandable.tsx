import type { ReactNode } from 'react'

type ExpandableProps = {
  open: boolean
  id?: string
  children: ReactNode
  className?: string
}

/**
 * Height reveal via `grid-template-rows 0fr -> 1fr` on the standard easing
 * (remaining-sections spec §3). Content is `inert` while closed so links and
 * buttons inside are not tabbable. Used by the nav dropdown, FAQ accordion
 * and mobile menu.
 */
export default function Expandable({ open, id, children, className = '' }: ExpandableProps) {
  return (
    <div
      id={id}
      className={`grid transition-[grid-template-rows] ease-standard ${className}`}
      style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
    >
      <div className="overflow-hidden" inert={!open}>
        {children}
      </div>
    </div>
  )
}
