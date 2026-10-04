import Container from '../primitives/Container'
import CardMedia from '../primitives/CardMedia'
import LongArrowLink from '../primitives/LongArrowLink'
import { INSIGHTS, ARTICLES } from '../../content/home'
import { asset } from '../../content/assets'

/**
 * "What's happening?" (remaining-sections spec §5.7): dark panel as
 * LatestWork; 1 col mobile / 2 md / 4 xl; date, title, excerpt, category
 * chips, Read article.
 */
export default function Insights() {
  return (
    <section id="blog" aria-label={INSIGHTS.heading} className="scroll-mt-24 py-[var(--space-50)] lg:py-[var(--space-80)]">
      <Container>
        <div className="rounded-panel bg-obsidian p-[25px] text-white md:p-[var(--space-40)]">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <h2 className="clamp-h2 font-bold tracking-[-0.019em] text-white">{INSIGHTS.heading}</h2>
            <LongArrowLink tone="dark" href={INSIGHTS.viewAll.href} className="shrink-0">
              {INSIGHTS.viewAll.label}
            </LongArrowLink>
          </div>

          <ul className="mt-[var(--space-25)] grid grid-cols-1 gap-[var(--space-25)] md:grid-cols-2 xl:grid-cols-4">
            {ARTICLES.map((article) => (
              <li key={article.title}>
                <a
                  href={article.href}
                  className="group flex h-full flex-col rounded-media bg-black text-white transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <CardMedia src={asset(article.image)} ratio="16/10" rounded="card" className="rounded-b-none" />
                  <div className="flex grow flex-col p-[var(--space-25)]">
                    <p className="text-[13px] leading-[1.2] font-medium text-white/70">{article.dateLabel}</p>
                    <h3 className="mt-2 text-[clamp(18px,2vw,28px)] leading-[1.25] font-medium text-white">
                      {article.title}
                    </h3>
                    <p className="mt-2 line-clamp-3 text-[16px] leading-[24px] text-white/70">{article.excerpt}</p>
                    <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Categories">
                      {article.categories.map((category) => (
                        <li
                          key={category}
                          className="rounded-pill bg-white/10 px-3 py-1 text-[13px] leading-[1.2] font-medium text-white"
                        >
                          {category}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-auto pt-4">
                      <LongArrowLink tone="dark" as="span">
                        Read article
                      </LongArrowLink>
                    </div>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  )
}
