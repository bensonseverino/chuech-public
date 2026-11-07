import type { ReactNode } from 'react'
import Container from './primitives/Container'
import { Reveal } from './ui/Reveal'

type LegalCardProps = {
  /** Accessible label for the card ("Chuech studio <label>"). */
  label: string
  children: ReactNode
}

/**
 * Shared white content card for the legal pages (terms spec §3; privacy
 * spec §3): large radius (~1.75rem, ~1.25rem mobile), container width,
 * ~3.5rem/3rem inner padding on desktop, ~2rem tablet, ~1.25rem mobile,
 * starting ~1.5rem below the heading on mobile and ~2.5rem on desktop. Only
 * the card itself fades in — the legal copy inside renders plainly and never
 * animates (terms/privacy spec §9).
 */
export default function LegalCard({ label, children }: LegalCardProps) {
  return (
    <section className="bg-fog pb-[var(--space-100)] pt-[1.5rem] lg:pt-[2.5rem]">
      <Container>
        <Reveal
          aria-label={label}
          className="rounded-[1.25rem] bg-white p-[1.25rem] shadow-soft md:rounded-[1.75rem] md:p-[2rem] lg:px-[3.5rem] lg:py-[3rem]"
          y={24}
        >
          {children}
        </Reveal>
      </Container>
    </section>
  )
}
