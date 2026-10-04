import type { ReactNode } from 'react'

type DarkPanelProps = {
  children: ReactNode
  className?: string
}

/**
 * Pure-black panel shell (latest-work spec §4): full-bleed with 30px corners on
 * mobile, 50px at md+, and inset to `77.36u` (the hero column plus its padding)
 * and centred at lg. The caller owns the inner layout.
 */
export default function DarkPanel({ children, className = '' }: DarkPanelProps) {
  return (
    <div
      className={`rounded-[30px] bg-black px-[25px] pt-[50px] pb-[70px] text-white md:rounded-[50px] md:px-[30px] md:py-[62px] lg:mx-auto lg:w-[calc(var(--u)*77.36)] lg:px-[calc(var(--u)*3.4)] lg:py-[calc(var(--u)*4.93)] ${className}`}
    >
      {children}
    </div>
  )
}
