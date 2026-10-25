import Container from './primitives/Container'
import { Reveal } from './ui/Reveal'
import Button from './primitives/Button'
import Inline from '../content/live/inline'
import type { LinkView } from '../content/live/types'

type IntroStatementProps = {
  /** Statement text in the CMS inline grammar (`==highlight==`, `**bold**`). */
  text: string
  /** Trailing CTA; `null` hides it (the services page has none). */
  cta: LinkView | null
  /** Home places a small obsidian dot after the first highlighted phrase. */
  dotAfterFirstMark?: boolean
}

/**
 * About-the-team statement (remaining-sections spec §5.1; services spec §5.2):
 * lavender pills hug the highlighted phrases, and the whole run is centred with
 * an optional trailing button. The copy comes from `_home.introStatement` (or
 * `_services.introStatement`) and is parsed by the shared inline renderer.
 */
export default function IntroStatement({
  text,
  cta,
  dotAfterFirstMark = false,
}: IntroStatementProps) {
  return (
    <Reveal
      as="section"
      aria-label="About the team"
      className="py-[var(--space-50)] lg:py-[var(--space-80)]"
      /* The statement's marks drive their own opacity (HighlightReveal), so
         only the y-motion runs here — smooth-scroll spec §7. */
      fade={false}
    >
      <Container>
        <div className="mx-auto flex max-w-[1000px] flex-col items-center gap-[var(--space-25)]">
          <p className="text-center text-[clamp(18px,calc(14px+1.45vw),33px)] leading-[1.5] font-medium tracking-[-1px] text-obsidian">
            <Inline text={text} dotAfterFirstMark={dotAfterFirstMark} />
          </p>
          {cta ? (
            <Button variant="dark" to={cta.to}>
              {cta.label}
            </Button>
          ) : null}
        </div>
      </Container>
    </Reveal>
  )
}
