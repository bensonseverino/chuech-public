import { TransitionLink } from '@/components/TransitionLink'
import type { FooterLink } from '../../data/footer'

/**
 * Intro line (footer spec §2.1): centered paragraph with underlined service
 * links. The `text` template uses `{tradingName}` and `{services}` placeholders.
 * `{services}` is replaced by the linked service names from `services`.
 */
export default function FooterIntro({
  text,
  services,
  tradingName,
}: {
  text: string
  services: FooterLink[]
  tradingName: string
}) {
  // Split the template into parts around {services}
  const parts = text.split('{services}')
  const before = parts[0].replace('{tradingName}', tradingName)
  const after = parts[1] ?? ''

  return (
    <p className="max-w-[42rem] mx-auto text-[1.1rem] leading-[1.35] font-normal text-white text-center text-wrap-balance">
      {before}
      <span className="flex flex-wrap justify-center gap-x-[0.25rem] gap-y-[0.2rem]">
        {services.map((s, i) => (
          <TransitionLink
            key={s.href}
            to={s.href}
            className="relative text-white underline underline-offset-2 decoration-white/30 hover:decoration-white hover:text-primary transition-colors"
          >
            {s.label}
            {/* Comma/and between items */}
            {i < services.length - 2 && <span aria-hidden="true">, </span>}
            {i === services.length - 2 && <span aria-hidden="true"> and </span>}
          </TransitionLink>
        ))}
      </span>
      {after}
    </p>
  )
}