/**
 * Mint tick list (web-design spec §5.2): a 22px `primary` circle holding an
 * obsidian check, then the 16px label. One column below 1024px; two
 * column-first columns of three at desktop (`grid-auto-flow: column`).
 */
export default function CheckList({
  items,
  className = '',
}: {
  items: string[]
  className?: string
}) {
  return (
    <ul
      className={`grid gap-y-[12px] lg:grid-flow-col lg:grid-rows-3 lg:justify-start lg:gap-x-[40px] lg:gap-y-[12px] ${className}`}
    >
      {items.map((item) => (
        <li key={item} className="flex items-center gap-[10px]">
          <span
            aria-hidden="true"
            className="grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full bg-primary"
          >
            <svg
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-3 w-3 text-obsidian"
            >
              <path d="M3 8.5 6.5 12 13 4.5" />
            </svg>
          </span>
          <span className="text-[16px] leading-[14px] text-obsidian">{item}</span>
        </li>
      ))}
    </ul>
  )
}
