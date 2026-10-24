import { Fragment } from 'react'
import { Link } from 'react-router'
import { firstMarkPosition, parseInline } from './inline-markup'
import HighlightReveal from '../../components/ui/HighlightReveal'

/** How a highlighted phrase reveals: with the scroll, or on mount (above the fold). */
export type RevealMode = 'scroll' | 'load'

/**
 * A highlighted phrase's lavender pill (remaining-sections spec §5.1), wrapped
 * in the shared word-reveal (highlight-scroll-reveal spec §3). The pill's own
 * classes stay exactly as they were; only the words inside fade.
 *
 * Every `highlight` mark from the CMS grammar (`==…==`) lands here, so this is
 * the single place the effect is wired into inline rich text — hardcoded
 * fallback copy and API copy take the same path (§4).
 */
function Mark({ children, reveal }: { children: string; reveal: RevealMode }) {
  return (
    <HighlightReveal
      mode={reveal}
      className="rounded-pill mx-0.5 inline bg-secondary px-2 [box-decoration-break:clone]"
    >
      {children}
    </HighlightReveal>
  )
}

type InlineProps = {
  text: string
  tone?: 'light' | 'dark'
  /**
   * Insert the small obsidian dot the Home intro design places after its first
   * highlighted phrase (services spec §5.2). Off by default.
   */
  dotAfterFirstMark?: boolean
  /**
   * Reveal mode for highlighted phrases in this field (highlight-scroll-reveal
   * spec §3.6): `"load"` for text visible at scroll position 0, which must
   * never sit dim waiting for a scroll that never comes.
   */
  reveal?: RevealMode
}

/**
 * Render one inline field (CMS or fallback). Paragraphs are separated by two
 * line breaks so the component is valid inside the `<p>` elements the sections
 * already use.
 */
export default function Inline({
  text,
  tone = 'light',
  dotAfterFirstMark = false,
  reveal = 'scroll',
}: InlineProps) {
  const paragraphs = parseInline(text)
  const firstMark = dotAfterFirstMark ? firstMarkPosition(paragraphs) : null

  const linkClass =
    tone === 'dark'
      ? 'text-primary underline decoration-primary underline-offset-4 transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
      : 'underline decoration-primary underline-offset-4 transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-obsidian'

  return (
    <>
      {paragraphs.map((nodes, paragraphIndex) => (
        <Fragment key={paragraphIndex}>
          {paragraphIndex > 0 ? (
            <>
              <br />
              <br />
            </>
          ) : null}
          {nodes.map((node, index) => {
            if (node.type === 'bold') {
              return (
                <strong key={index} className="font-semibold">
                  {node.value}
                </strong>
              )
            }

            if (node.type === 'highlight') {
              const first = firstMark?.paragraph === paragraphIndex && firstMark.index === index
              return (
                <Fragment key={index}>
                  <Mark reveal={reveal}>{node.value}</Mark>
                  {first ? (
                    <span
                      aria-hidden="true"
                      className="mx-1.5 inline-block h-2 w-2 rounded-full bg-black align-middle"
                    />
                  ) : null}
                </Fragment>
              )
            }

            if (node.type === 'link') {
              return node.to.startsWith('/') ? (
                <Link key={index} to={node.to} className={linkClass}>
                  {node.value}
                </Link>
              ) : (
                <a key={index} href={node.to} className={linkClass}>
                  {node.value}
                </a>
              )
            }

            return <Fragment key={index}>{node.value}</Fragment>
          })}
        </Fragment>
      ))}
    </>
  )
}
