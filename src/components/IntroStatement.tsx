import type { ReactNode } from 'react'
import Container from './primitives/Container'
import Button from './primitives/Button'
import { INTRO } from '../content/home'

/* Full intro copy transcribed from the live page (§5.1). Lavender `secondary`
   pills hug the highlighted phrases; a small black dot sits after "bold".
   Type: intro statement row of the §2.3 scale. */

function Mark({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-pill mx-0.5 inline bg-secondary px-2 [box-decoration-break:clone]">
      {children}
    </span>
  )
}

/** The Home statement: rendered when no `text` prop is given (Home is unchanged). */
function HomeIntro() {
  return (
    <>
      Our team is made up of <Mark>bold</Mark>
      <span
        aria-hidden="true"
        className="mx-1.5 inline-block h-2 w-2 rounded-full bg-black align-middle"
      />
      <Mark>creatives,</Mark> <Mark>sharp strategists,</Mark> and <Mark>technical pros</Mark>{' '}
      who care deeply about what they do. No egos, no fluff &ndash; just hard work, smart
      thinking, and a <Mark>genuine commitment</Mark> to our <Mark>clients&rsquo; success.</Mark>{' '}
      We treat every brand and budget like it&rsquo;s our own,{' '}
      <Mark>always deliver on promises,</Mark> and never lock clients into contracts.
    </>
  )
}

/**
 * Wraps each occurrence of a highlighted phrase in a lavender `Mark` pill
 * (services spec §5.2). A phrase may span a line break; each fragment keeps
 * its pill shape via `box-decoration-break: clone`.
 */
function renderHighlights(text: string, highlights: string[]): ReactNode[] {
  // Text segments stay plain strings so later phrases can still be matched;
  // only the pill itself is an element (and carries a key).
  let nodes: ReactNode[] = [text]

  highlights.forEach((phrase, highlightIndex) => {
    const next: ReactNode[] = []
    nodes.forEach((node) => {
      if (typeof node !== 'string') {
        next.push(node)
        return
      }
      node.split(phrase).forEach((part, partIndex) => {
        if (partIndex > 0) next.push(<Mark key={`h${highlightIndex}-${next.length}`}>{phrase}</Mark>)
        if (part) next.push(part)
      })
    })
    nodes = next
  })

  return nodes
}

type IntroStatementProps = {
  /**
   * Statement text when the caller wants different copy (page variant). When
   * omitted the Home statement is rendered verbatim.
   */
  text?: string
  /** Phrases to wrap in lavender pills (used with `text`). */
  highlights?: string[]
  /** Trailing CTA; `null` hides it (services page has none). Defaults to Home's. */
  cta?: { label: string; href: string } | null
}

export default function IntroStatement({
  text,
  highlights = [],
  cta = INTRO.cta,
}: IntroStatementProps) {
  const body =
    text !== undefined
      ? highlights.length > 0
        ? renderHighlights(text, highlights)
        : text
      : <HomeIntro />

  return (
    <section aria-label="About the team" className="py-[var(--space-50)] lg:py-[var(--space-80)]">
      <Container>
        <div className="mx-auto flex max-w-[1000px] flex-col items-center gap-[var(--space-25)]">
          <p className="text-center text-[clamp(18px,calc(14px+1.45vw),33px)] leading-[1.5] font-medium tracking-[-1px] text-obsidian">
            {body}
          </p>
          {cta ? (
            <Button variant="dark" to={cta.href}>
              {cta.label}
            </Button>
          ) : null}
        </div>
      </Container>
    </section>
  )
}
