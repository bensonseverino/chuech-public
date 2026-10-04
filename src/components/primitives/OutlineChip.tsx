import type { ReactNode } from 'react'

/**
 * Outlined tag/category chip for dark surfaces (latest-work spec §4): 1px white
 * border, transparent fill — replaces the earlier `bg-white/10` filled chip.
 * 22px tall on mobile, 28px at md+.
 */
export default function OutlineChip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex h-[22px] items-center rounded-pill border border-white px-[13px] text-[10px] leading-none font-semibold text-white md:h-[28px] md:px-[15px] md:text-[12px]">
      {children}
    </span>
  )
}
