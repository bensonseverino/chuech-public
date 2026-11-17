/*
 * Render the intro statement's restricted HTML (cms-projects-spec.md §4):
 * `p, br, strong, em, a[href], mark[data-highlight]` only — the server
 * sanitises to exactly this allow-list at write time.
 *
 * The markup is parsed to React elements (never `dangerouslySetInnerHTML`) and
 * every `mark[data-highlight]` becomes the shared `HighlightReveal` with the
 * existing lavender highlight classes, so a CMS-authored highlight is
 * pixel-identical to a hardcoded `==…==` one.
 */
import { Fragment, type ReactNode } from 'react'
import { TransitionLink } from '@/components/TransitionLink'
import HighlightReveal from '../../components/ui/HighlightReveal'

const HIGHLIGHT_CLASSES = 'rounded-pill mx-0.5 inline bg-secondary px-2 [box-decoration-break:clone]'

const LINK_CLASSES =
  'underline decoration-primary underline-offset-4 transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-obsidian'

/** One restricted inline tag or a run of text. */
type Token =
  | { type: 'text'; value: string }
  | { type: 'br' }
  | { type: 'mark'; value: string }
  | { type: 'strong'; value: string }
  | { type: 'em'; value: string }
  | { type: 'link'; href: string; value: string }

const INLINE_RE =
  /<br\s*\/?>|<mark data-highlight>([\s\S]*?)<\/mark>|<strong>([\s\S]*?)<\/strong>|<em>([\s\S]*?)<\/em>|<a href="([^"]*?)">([\s\S]*?)<\/a>/g

function tokenizeInline(html: string): Token[] {
  const tokens: Token[] = []
  let last = 0
  for (const match of html.matchAll(INLINE_RE)) {
    const start = match.index ?? 0
    if (start > last) tokens.push({ type: 'text', value: html.slice(last, start) })
    if (match[0].startsWith('<br')) tokens.push({ type: 'br' })
    else if (match[1] !== undefined) tokens.push({ type: 'mark', value: match[1] })
    else if (match[2] !== undefined) tokens.push({ type: 'strong', value: match[2] })
    else if (match[3] !== undefined) tokens.push({ type: 'em', value: match[3] })
    else if (match[4] !== undefined) tokens.push({ type: 'link', href: match[4], value: match[5] ?? '' })
    last = start + match[0].length
  }
  if (last < html.length) tokens.push({ type: 'text', value: html.slice(last) })
  return tokens
}

function renderInline(tokens: Token[], reveal: RevealMode): ReactNode[] {
  return tokens.map((token, index) => {
    switch (token.type) {
      case 'br':
        return <br key={index} />
      case 'mark':
        return (
          <HighlightReveal key={index} as="mark" mode={reveal} className={HIGHLIGHT_CLASSES}>
            {token.value}
          </HighlightReveal>
        )
      case 'strong':
        return (
          <strong key={index} className="font-semibold">
            {token.value}
          </strong>
        )
      case 'em':
        return <em key={index}>{token.value}</em>
      case 'link':
        return token.href.startsWith('/') ? (
          <TransitionLink key={index} to={token.href} className={LINK_CLASSES}>
            {token.value}
          </TransitionLink>
        ) : (
          <a key={index} href={token.href} className={LINK_CLASSES}>
            {token.value}
          </a>
        )
      default:
        return <Fragment key={index}>{token.value}</Fragment>
    }
  })
}

export type RevealMode = 'scroll' | 'load'

const PARAGRAPH_RE = /<p>([\s\S]*?)<\/p>/g

/**
 * Render the sanitized intro HTML. Each `<p>` is a paragraph; anything outside
 * one (the sanitizer guarantees there is none) is dropped.
 */
export default function IntroHtml({ html, reveal = 'scroll' }: { html: string; reveal?: RevealMode }) {
  const paragraphs = [...html.matchAll(PARAGRAPH_RE)].map((match) => match[1])

  if (paragraphs.length === 0) return null

  return (
    <>
      {paragraphs.map((paragraph, index) => (
        <p key={index}>{renderInline(tokenizeInline(paragraph), reveal)}</p>
      ))}
    </>
  )
}
