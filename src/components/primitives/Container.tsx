import type { ReactNode } from 'react'

/**
 * Content column shared by every section (remaining-sections spec §2.4):
 * matches the hero/header column so all edges align at lg+.
 */
export default function Container({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`mx-auto px-4 md:px-8 lg:w-[calc(var(--u)*70.56)] lg:px-0 ${className}`}>
      {children}
    </div>
  )
}
