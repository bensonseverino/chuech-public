import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import ProjectHero from '../components/sections/ProjectHero'
import CallBackCard from '../components/sections/CallBackCard'
import SimilarWork from '../components/sections/SimilarWork'
import Container from '../components/primitives/Container'
import SectionHeading, { TITLE_ROLE } from '../components/primitives/SectionHeading'
import CmsImage from '../components/primitives/CmsImage'
import IntroHtml from '../content/live/intro-html'
import { useProject } from '../content/live/hooks'
import { EVENTOTRON_FALLBACK } from '../content/fallback-project'
import { useCmsPreviewData } from '../cms/preview'
import { useMetaDescription, usePageTitle, useSeoTags } from '../hooks/usePageTitle'
import { useScrollRefresh } from '../hooks/useScrollRefresh'
import NotFoundPage from './NotFoundPage'

/**
 * `/work/:slug` (cms-projects-spec.md §9.3): one case study, fetched by slug
 * and mapped onto the existing page sections and classes. Optional sections
 * (intro, feature, gallery, testimonial) are skipped entirely when their data
 * is empty — the empty-section rule (§2).
 *
 * Statuses (§9.4): a skeleton with the final layout's dimensions while loading;
 * the site's 404 page for unknown/draft slugs; a renamed slug redirects
 * (replace) to its new URL. With the API unreachable, `/work/eventotron` still
 * renders from the bundled fallback (§9.11).
 */
export default function ProjectPage() {
  const { slug = '' } = useParams()
  const result = useProject(slug.toLowerCase())
  const navigate = useNavigate()

  // Renamed slug: the API hands back the current URL; follow it (§9.4).
  useEffect(() => {
    if (result.state === 'redirect') navigate(result.to, { replace: true })
  }, [result, navigate])

  // API unreachable: only the bundled Eventotron copy renders as a fallback.
  const fetched = result.state === 'ok' ? result.project : null
  const project =
    !fetched && slug.toLowerCase() === EVENTOTRON_FALLBACK.slug
      ? EVENTOTRON_FALLBACK
      : fetched

  usePageTitle(project ? project.seo.title : 'Work | Chuech Studio')
  useMetaDescription(project ? project.seo.description : '')
  useSeoTags({
    title: project ? project.seo.title : '',
    description: project?.seo.description,
    image: project?.seo.ogImage?.url,
    path: `/work/${slug}`,
  })
  // Re-measure ScrollTriggers when the payload replaces the skeleton.
  useScrollRefresh(project)

  // The admin editor's live preview (§7.3): when the page is embedded with
  // ?cms-preview=1, its unsaved payload replaces the fetched one.
  const shown = useCmsPreviewData(project)

  if (result.state === 'redirect') return null
  if (result.state === 'loading' && !shown) return <ProjectSkeleton />
  if (!shown) return <NotFoundPage />

  const hasIntro = Boolean(shown.introHtml)
  const hasFeature = Boolean(shown.feature?.heading || shown.feature?.text)

  return (
    <article>
      <ProjectHero title={shown.title} categories={shown.categories} hero={shown.hero} />

      {hasIntro ? (
        <section aria-label="Introduction" className="py-[50px] md:py-[62px] lg:py-[80px]">
          <Container>
            <div className="mx-auto max-w-[880px] text-center text-[clamp(21px,15.3px+1.53vw,33px)] leading-[1.35] font-medium tracking-[-0.02em] text-obsidian">
              <IntroHtml html={shown.introHtml ?? ''} />
            </div>
          </Container>
        </section>
      ) : null}

      {hasFeature ? (
        <section aria-label={shown.feature?.heading || undefined} className="pb-[50px] md:pb-[62px] lg:pb-[80px]">
          <Container>
            <div className="grid gap-[25px] md:grid-cols-2 md:items-center md:gap-[30px] lg:gap-[calc(var(--u)*5)]">
              <div className="min-w-0">
                <SectionHeading variant="dot" className={`${TITLE_ROLE} text-obsidian`}>
                  {shown.feature?.heading}
                </SectionHeading>
                {shown.feature?.text ? (
                  <p className="mt-[25px] max-w-[440px] text-[16px] leading-[1.6] text-obsidian">
                    {shown.feature.text}
                  </p>
                ) : null}
              </div>
              {shown.feature?.image ? (
                <div className="min-w-0 overflow-hidden rounded-card-lg">
                  <CmsImage
                    asset={shown.feature.image}
                    sizes="(min-width: 768px) 65vw, 100vw"
                    className="aspect-[16/9]"
                  />
                </div>
              ) : null}
            </div>
          </Container>
        </section>
      ) : null}

      {shown.gallery.length > 0 ? (
        <section aria-label="Gallery" className="pb-[50px] md:pb-[62px] lg:pb-[80px]">
          <Container>
            <ul className="grid grid-cols-1 gap-[25px] md:grid-cols-3 md:gap-[30px]">
              {shown.gallery.map((image, index) => (
                <li key={`${image.url}-${index}`} className="overflow-hidden rounded-card-lg">
                  <CmsImage asset={image} sizes="(min-width: 768px) 33vw, 100vw" className="aspect-[16/9]" />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}

      <CallBackCard
        testimonial={shown.testimonial}
        context={{ projectSlug: shown.slug, projectTitle: shown.title }}
      />

      {shown.related.length > 0 ? <SimilarWork projects={shown.related} /> : null}
    </article>
  )
}

/**
 * The loading skeleton (cms-projects-spec.md §9.4): the same blocks as the real
 * layout — hero card, centred intro lines, feature split, gallery grid — so
 * nothing jumps when the payload lands.
 */
function ProjectSkeleton() {
  return (
    <article aria-busy="true" aria-label="Loading project">
      <section className="pt-[15px] md:pt-[25px]">
        <Container>
          <div className="aspect-[4/5] animate-pulse rounded-[30px] bg-fog sm:aspect-[16/10] md:aspect-[16/9] md:rounded-[50px]" />
        </Container>
      </section>
      <section className="py-[50px] md:py-[62px] lg:py-[80px]">
        <Container>
          <div className="mx-auto flex max-w-[880px] flex-col gap-[16px]">
            <div className="h-[28px] w-3/4 rounded-pill bg-fog md:mx-auto md:h-[33px]" />
            <div className="h-[28px] w-2/3 rounded-pill bg-fog md:mx-auto md:h-[33px]" />
          </div>
        </Container>
      </section>
      <section className="pb-[50px] md:pb-[62px] lg:pb-[80px]">
        <Container>
          <div className="grid gap-[25px] md:grid-cols-2 md:gap-[30px]">
            <div className="flex flex-col gap-[16px]">
              <div className="h-[33px] w-2/3 rounded-pill bg-fog" />
              <div className="h-[16px] w-full rounded-pill bg-fog" />
              <div className="h-[16px] w-4/5 rounded-pill bg-fog" />
            </div>
            <div className="aspect-[16/9] animate-pulse rounded-card-lg bg-fog" />
          </div>
        </Container>
      </section>
      <section className="pb-[50px] md:pb-[62px] lg:pb-[80px]">
        <Container>
          <ul className="grid grid-cols-1 gap-[25px] md:grid-cols-3 md:gap-[30px]">
            {[0, 1, 2].map((index) => (
              <li key={index} className="aspect-[16/9] animate-pulse rounded-card-lg bg-fog" />
            ))}
          </ul>
        </Container>
      </section>
    </article>
  )
}
