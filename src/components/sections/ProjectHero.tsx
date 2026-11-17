import { useEffect, useRef, useState } from 'react'
import { TransitionLink } from '@/components/TransitionLink'
import Container from '../primitives/Container'
import OutlineChip from '../primitives/OutlineChip'
import LongArrow from '../primitives/LongArrow'
import CmsImage from '../primitives/CmsImage'
import type { ProjectDetailData } from '../../cms/projects'

type ProjectHeroProps = {
  title: string
  categories: { slug: string; label: string }[]
  hero: ProjectDetailData['hero']
}

/**
 * The case-study hero (cms-projects-spec.md §2.2): a full-width rounded image
 * (or video) card with the glass "Work" back pill top-left; the title and the
 * category pills bottom-left; the description (bold lead sentence + regular
 * body) bottom-right at md+, stacked underneath on tablet/mobile.
 *
 * The dark gradient overlay is part of the existing card design (the same
 * legibility scrim the project cards use). The hero image is eager and high
 * priority; an art-directed mobile crop rides in via `<picture>`.
 */
export default function ProjectHero({ title, categories, hero }: ProjectHeroProps) {
  return (
    <section aria-label={title} className="pt-[15px] md:pt-[25px]">
      <Container>
        <div className="relative isolate flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-[30px] bg-obsidian sm:aspect-[16/10] md:aspect-[16/9] md:rounded-[50px]">
          {hero.type === 'video' && hero.videoUrl ? (
            <HeroVideo url={hero.videoUrl} poster={hero.image} />
          ) : (
            <CmsImage
              asset={hero.image}
              mobile={hero.imageMobile}
              sizes="100vw"
              loading="eager"
              className="absolute inset-0 -z-20"
            />
          )}

          {/* Functional legibility scrim — the one documented gradient exception. */}
          <span
            aria-hidden="true"
            className="absolute inset-0 -z-10"
            style={{
              background:
                'linear-gradient(to bottom, rgb(0 0 0 / 0) 30%, rgb(0 0 0 / 0.6) 62%, #000 100%)',
            }}
          />

          {/* Back pill */}
          <TransitionLink
            to="/work"
            className="absolute top-[20px] left-[20px] inline-flex min-h-[44px] items-center gap-[10px] rounded-pill border border-white/20 bg-white/10 px-[20px] text-[14px] font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:top-[30px] md:left-[30px]"
          >
            <LongArrow weight="thin" className="w-[34px] rotate-180 md:w-[47px]" />
            Work
          </TransitionLink>

          {/* Bottom stack: title → pills → description (description right at md+). */}
          <div className="p-[25px] md:p-[30px] lg:p-[40px]">
            <div className="flex flex-col gap-[20px] md:flex-row md:items-end md:justify-between md:gap-[40px]">
              <div className="min-w-0">
                <h1 className="text-[clamp(33px,20px+2.6vw,56px)] leading-[1.05] font-medium tracking-[-0.02em] text-white">
                  {title}
                </h1>
                {categories.length > 0 ? (
                  <ul className="mt-[15px] flex flex-wrap gap-[6px] md:mt-[20px] md:gap-[10px]">
                    {categories.map((category) => (
                      <li key={category.slug}>
                        <OutlineChip>{category.label}</OutlineChip>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>

              {hero.lead || hero.body ? (
                <div className="max-w-[440px] md:shrink-0">
                  {hero.lead ? (
                    <p className="text-[16px] leading-[1.5] font-semibold text-white md:text-[18px]">
                      {hero.lead}
                    </p>
                  ) : null}
                  {hero.body ? (
                    <p className="mt-[10px] text-[14px] leading-[1.6] text-white/80 md:text-[15px]">
                      {hero.body}
                    </p>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

/**
 * The hero video (cms-projects-spec.md §6): muted, looping, playsInline,
 * started only when it scrolls into view, with the hero image as poster and —
 * under reduced motion — the poster only, never playback.
 */
function HeroVideo({ url, poster }: { url: string; poster: ProjectDetailData['hero']['image'] }) {
  const videoRef = useRef<HTMLVideoElement>(null)

  const [posterOnly] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    if (posterOnly) return
    const video = videoRef.current
    if (!video) return
    // React's `muted` attribute is unreliable; the property is what autoplay reads.
    video.muted = true

    if (typeof IntersectionObserver === 'undefined') {
      void video.play().catch(() => {})
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void video.play().catch(() => {})
        else video.pause()
      },
      { rootMargin: '200px', threshold: 0.01 },
    )
    observer.observe(video)
    return () => {
      observer.disconnect()
      video.pause()
    }
  }, [posterOnly])

  return (
    <div className="absolute inset-0 -z-20">
      <CmsImage
        asset={poster}
        mobile={poster}
        sizes="100vw"
        loading="eager"
        className="absolute inset-0"
      />
      {!posterOnly ? (
        <video
          ref={videoRef}
          src={url}
          muted
          loop
          playsInline
          autoPlay
          preload="none"
          disablePictureInPicture
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : null}
    </div>
  )
}
