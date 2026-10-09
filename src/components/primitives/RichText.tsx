import { Link } from 'react-router'
import type { RichSegment } from '../../content/home'

type RichTextProps = {
  segments: RichSegment[]
  tone?: 'light' | 'dark'
}

/**
 * Renders typed rich-text segments; `{ label, href }` segments become inline
 * links with the FAQ treatment (primary underline). Used for the FAQ answers
 * (light) and the footer statement (dark, mint links) so the live-page inline
 * service links stay real links without storing raw HTML.
 */
export default function RichText({ segments, tone = 'light' }: RichTextProps) {
  return (
    <>
      {segments.map((segment, index) => {
        if (typeof segment === 'string') return <span key={index}>{segment}</span>

        const linkClass =
          tone === 'dark'
            ? 'text-primary underline decoration-primary underline-offset-4 transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
            : 'underline decoration-primary underline-offset-4 transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-obsidian'

        // Internal paths become router links; external/mailto stay anchors (§3.2).
        return segment.href.startsWith('/') ? (
          <Link key={index} to={segment.href} className={linkClass}>
            {segment.label}
          </Link>
        ) : (
          <a key={index} href={segment.href} className={linkClass}>
            {segment.label}
          </a>
        )
      })}
    </>
  )
}
