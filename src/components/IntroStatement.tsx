import Container from './primitives/Container'
import Button from './primitives/Button'
import { INTRO } from '../content/home'

/* Full intro copy transcribed from the live page (§5.1). Lavender `secondary`
   pills hug the six highlighted phrases; a small black dot sits after "bold".
   Type: intro statement row of the §2.3 scale. */

function Mark({ children }: { children: string }) {
  return (
    <span className="rounded-pill mx-0.5 inline bg-secondary px-2 [box-decoration-break:clone]">
      {children}
    </span>
  )
}

export default function IntroStatement() {
  return (
    <section aria-label="About the team" className="py-[var(--space-50)] lg:py-[var(--space-80)]">
      <Container>
        <div className="mx-auto flex max-w-[1000px] flex-col items-center gap-[var(--space-25)]">
          <p className="text-center text-[clamp(18px,calc(14px+1.45vw),33px)] leading-[1.5] font-medium tracking-[-1px] text-obsidian">
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
          </p>
          <Button variant="dark" href={INTRO.cta.href}>
            {INTRO.cta.label}
          </Button>
        </div>
      </Container>
    </section>
  )
}
