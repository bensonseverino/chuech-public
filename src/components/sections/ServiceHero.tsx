import type { CSSProperties } from 'react'
import Container from '../primitives/Container'
import SectionBadge from '../primitives/SectionBadge'
import SectionHeading, { TITLE_ROLE } from '../primitives/SectionHeading'
import OutlineChip from '../primitives/OutlineChip'
import ContactForm from '../ContactForm'
import type { ServicePageContent } from '../../content/services/web-design'
import './ServiceHero.css'

/** Heading with the lavender pill hugging its highlighted phrase (spec §5.1). */
function FormHeading({ heading, highlight }: { heading: string; highlight?: string }) {
  if (!highlight || !heading.includes(highlight)) return <>{heading}</>

  const [before, after] = heading.split(highlight)
  return (
    <>
      {before}
      {/* `clone` keeps a pill on each line if the phrase ever has to wrap on a
          very narrow card; it never breaks at the reference widths. */}
      <span className="rounded-pill bg-secondary px-[0.4em] py-[0.08em] [box-decoration-break:clone]">
        {highlight}
      </span>
      {after}
    </>
  )
}

/**
 * Service hero (web-design spec §5.1): badge, dot h1, tag chips, intro and the
 * consultation form card. One column on mobile (content first, then the card);
 * two columns from md, sized in units at lg with both tops aligned.
 *
 * `hero.titleMaxWidth` opts into the capped title break (web-design uses
 * 8.2em); without it the title wraps naturally against the column.
 */
export default function ServiceHero({ hero }: { hero: ServicePageContent['hero'] }) {
  const capped = hero.titleMaxWidth !== undefined

  return (
    <section aria-label={hero.label}>
      <Container className="pt-5 md:pt-10 lg:pt-[calc(var(--u)*3.51)]">
        <div className="grid gap-[50px] md:grid-cols-2 md:items-start md:gap-[35px] lg:grid-cols-[calc(var(--u)*25.9)_calc(var(--u)*40.5)] lg:gap-[calc(var(--u)*3.5)]">
          {/* --- Left column --- */}
          <div className="min-w-0">
            <SectionBadge
              as="p"
              iconClassName="h-3.5 w-[37px]"
              className="gap-2 px-5 py-3 text-[13px] leading-[1.5] font-medium text-obsidian"
            >
              {hero.label}
            </SectionBadge>

            {/* The cap lives on the h1 so its `em` resolves against the title
                size; the wrapper only carries the value and the gutter shift. */}
            <div
              className="mt-[25px] lg:-ml-[47px]"
              style={
                capped
                  ? ({ '--hero-title-max': `${hero.titleMaxWidth}em` } as CSSProperties)
                  : undefined
              }
            >
              <SectionHeading
                as="h1"
                variant="dot"
                dotSizeClass="h-[25px] w-[25px]"
                dotGap="22px"
                className={`service-hero-title ${
                  capped ? 'service-hero-title--capped' : ''
                } text-[clamp(33px,19.4px_+_2.77vw,53px)] leading-[1.05] font-bold tracking-[-0.019em] text-black`}
              >
                {hero.title}
              </SectionHeading>
            </div>

            <ul className="mt-[25px] flex flex-wrap gap-[10px]">
              {hero.tags.map((tag) => (
                <li key={tag}>
                  <OutlineChip tone="light" size="sm">
                    {tag}
                  </OutlineChip>
                </li>
              ))}
            </ul>

            <p className="mt-[25px] text-[16px] leading-[24px] text-obsidian">{hero.intro}</p>
          </div>

          {/* --- Form card --- */}
          <div className="rounded-panel bg-white px-[35px] py-[35px] shadow-soft">
            {hero.form.heading ? (
              <h2 className={`${TITLE_ROLE} text-obsidian`}>
                <FormHeading heading={hero.form.heading} highlight={hero.form.highlight} />
              </h2>
            ) : null}
            <div className="mt-[25px]">
              <ContactForm
                fields={hero.form.fields}
                submitLabel={hero.form.submitLabel}
                source={hero.form.source}
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
