type LongArrowProps = {
  className?: string
  /**
   * Stroke weight: `default` = 2px (light surfaces), `thin` = 1px
   * (latest-work spec §3: all arrows on dark backgrounds).
   */
  weight?: 'default' | 'thin'
}

/**
 * Long thin arrow for in-content links (services spec §3.2):
 * non-scaling stroke, straight shaft, open chevron head. Sized by the
 * caller (73px on tablet/mobile, `calc(var(--u)*6.05)` at desktop).
 */
export default function LongArrow({ className = '', weight = 'default' }: LongArrowProps) {
  return (
    <svg
      viewBox="0 0 150 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={weight === 'thin' ? 1 : 2}
      aria-hidden="true"
      className={className}
      preserveAspectRatio="none"
    >
      <path
        d="M0 10h148M138 1l10 9-10 9"
        vectorEffect="non-scaling-stroke"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
