function Chevron({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-4 w-4"
    >
      <path d={direction === 'left' ? 'M14.5 5 8 12l6.5 7' : 'M9.5 5 16 12l-6.5 7'} />
    </svg>
  )
}

export type CarouselControlsProps = {
  /** Zero-based active index. */
  index: number
  total: number
  onPrev: () => void
  onNext: () => void
  /**
   * Prev button fill: `secondary-on-mobile` is lavender below md and mint
   * above (latest-work spec §5.6); `primary` is mint at every width.
   */
  prevTone?: 'primary' | 'secondary-on-mobile'
  /** Label announced to screen readers when the slide changes. */
  label?: string
  className?: string
}

const BUTTON =
  'grid h-8 w-8 shrink-0 place-items-center rounded-full text-obsidian transition hover:shadow-glow-md focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-primary lg:h-6 lg:w-6'

/**
 * `‹ 1 / 6 ›` slider controls (latest-work spec §5.6): round mint buttons, a
 * white counter and a polite live region. Keyboard users drive the slider with
 * the arrow keys on the surrounding region; these are real buttons.
 */
export default function CarouselControls({
  index,
  total,
  onPrev,
  onNext,
  prevTone = 'primary',
  label = 'Testimonial',
  className = '',
}: CarouselControlsProps) {
  const prevFill =
    prevTone === 'secondary-on-mobile' ? 'bg-secondary md:bg-primary' : 'bg-primary'

  return (
    <div className={`flex items-center gap-3 md:gap-5 lg:gap-[14px] ${className}`}>
      <button type="button" aria-label="Previous testimonial" onClick={onPrev} className={`${BUTTON} ${prevFill}`}>
        <Chevron direction="left" />
      </button>
      <span
        aria-hidden="true"
        className="text-[18px] leading-none text-white md:text-[22px] lg:text-[17px]"
      >
        {index + 1} / {total}
      </span>
      <button type="button" aria-label="Next testimonial" onClick={onNext} className={`${BUTTON} bg-primary`}>
        <Chevron direction="right" />
      </button>
      <span className="sr-only" aria-live="polite">
        {label} {index + 1} of {total}
      </span>
    </div>
  )
}
