import { Fragment } from 'react'
import { Link } from 'react-router'
import LongArrow from './LongArrow'
import type { Keyword } from '../../content/home'
import './RevealRow.css'

type RevealRowProps = {
  href: string
  title: string
  description: string
  /** Joined at render with a bullet + non-breaking space so wrapped lines start with a bullet (§4.4). */
  keywords: Keyword[]
  /** Resolved local image URL. */
  image: string
  /** object-position for the crop (faces in frame). */
  focus?: string
}

/**
 * Hover-reveal row (services spec §3.3/§5): media wipes in from the left and
 * pushes the text right, description cross-fades into the keywords, the
 * "More Info" label fades in and the arrow nudges 7px — all on the standard
 * 0.35s easing, only where the `hoverable` media condition holds. Touch and
 * smaller widths get the all-visible stacked layout. One link per row: the
 * title, stretched over the whole row.
 *
 * A keyword may be an object with an `href`: it renders as a real inline
 * `<Link>` sitting above the row link (`relative z-[1]`) so it stays clickable
 * and is underlined (services spec §5.1).
 */
export default function RevealRow({
  href,
  title,
  description,
  keywords,
  image,
  focus,
}: RevealRowProps) {
  return (
    <li className="svc-row">
      <div className="svc-grid">
        <div className="svc-media" aria-hidden="true">
          <img src={image} alt="" loading="lazy" decoding="async" style={{ objectPosition: focus ?? 'center 20%' }} />
        </div>

        <div className="svc-body">
          <h3 className="svc-title">
            <Link
              to={href}
              className="rounded-button after:absolute after:inset-0 focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-obsidian"
            >
              {title}
            </Link>
            <span aria-hidden="true" className="svc-dot" />
          </h3>

          <div className="svc-swap">
            <p className="svc-desc">{description}</p>
            <p className="svc-keys">
              {keywords.map((keyword, index) => (
                <Fragment key={index}>
                  {index > 0 && ' •\u00A0'}
                  {typeof keyword === 'string' ? (
                    keyword
                  ) : (
                    <Link
                      to={keyword.href}
                      className="relative z-[1] underline decoration-1 underline-offset-4 transition-[text-decoration-thickness] hover:decoration-2 focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-obsidian"
                    >
                      {keyword.label}
                    </Link>
                  )}
                </Fragment>
              ))}
            </p>
          </div>
        </div>

        <span className="svc-cta" aria-hidden="true">
          <span className="svc-cta-label">More Info</span>
          <LongArrow className="svc-arrow" />
        </span>
      </div>
    </li>
  )
}
