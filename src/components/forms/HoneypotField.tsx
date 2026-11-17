/*
 * The honeypot field (cms-forms-reviews-spec.md §8.1). A real visitor never
 * sees or fills it; a bot that fills `website` gets a silent success and the
 * submission is never stored. Off-screen rather than `display:none` so
 * screen-reader-free bots still trip over it, and hidden from assistive tech.
 */
export default function HoneypotField({ inputRef }: { inputRef?: React.Ref<HTMLInputElement> }) {
  return (
    <div
      className="sr-only"
      aria-hidden="true"
      style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}
    >
      <label htmlFor="cf-website">Website</label>
      <input
        ref={inputRef}
        id="cf-website"
        name="website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
      />
    </div>
  )
}
