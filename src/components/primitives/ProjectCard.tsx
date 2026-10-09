import { Link } from 'react-router'
import LongArrow from './LongArrow'
import OutlineChip from './OutlineChip'
import { asset } from '../../content/assets'

type ProjectCardProps = {
  slug: string
  title: string
  tags: string[]
  image: string
  /** object-position for the crop. */
  focus?: string
  /**
   * Fill the grid cell (work page §5.1): drop the card's own aspect ratio and
   * stretch to the row height instead. Default keeps the Home panel's aspect.
   */
  fill?: boolean
  className?: string
}

/**
 * Full-bleed photo card with a black legibility scrim (latest-work spec §5.4).
 * The whole card is one link target via a stretched title link; "View work" and
 * the arrow are decorative. The body stays in normal flow (the card is a
 * column flexbox that bottom-aligns it) so the stretched `::after` resolves
 * against the card, not the body.
 */
export default function ProjectCard({
  slug,
  title,
  tags,
  image,
  focus = 'center',
  fill = false,
  className = '',
}: ProjectCardProps) {
  // `fill` replaces the card's own aspect ratio with the grid row height.
  const shape = fill ? 'h-full' : 'aspect-[1.15] md:aspect-[1.16] lg:aspect-[1.3]'

  return (
    <article
      className={`group relative isolate flex ${shape} flex-col justify-end overflow-hidden rounded-[30px] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary ${className}`}
    >
      <img
        src={asset(image)}
        alt=""
        loading="lazy"
        decoding="async"
        style={{ objectPosition: focus }}
        className="absolute inset-0 -z-20 h-full w-full object-cover transition-transform ease-standard group-hover:scale-[1.04] group-focus-within:scale-[1.04]"
      />
      {/* Functional legibility scrim — the one documented gradient exception. */}
      <span
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background:
            'linear-gradient(to bottom, rgb(0 0 0 / 0) 30%, rgb(0 0 0 / 0.6) 62%, #000 100%)',
        }}
      />

      <div className="p-[25px] md:p-[30px] lg:p-[40px]">
        <h3 className="text-[clamp(21px,15.3px+1.53vw,33px)] leading-[1.1] font-medium text-white">
          <Link
            to={`/work/${slug}/`}
            className="after:absolute after:inset-0 focus-visible:outline-none"
          >
            {title}
          </Link>
        </h3>
        <span
          aria-hidden="true"
          className="mt-[8px] inline-flex items-center gap-[10px] text-[13px] leading-none text-white md:text-[17px] lg:text-[14px]"
        >
          View work
          <LongArrow
            weight="thin"
            className="w-[34px] shrink-0 transition-transform ease-standard group-hover:translate-x-[7px] group-focus-within:translate-x-[7px] md:w-[47px] lg:w-[32px]"
          />
        </span>
        <ul className="mt-[25px] flex flex-wrap gap-[6px] md:gap-[10px] lg:gap-[6px]">
          {tags.map((tag) => (
            <li key={tag}>
              <OutlineChip>{tag}</OutlineChip>
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}
