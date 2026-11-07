import type { ReactNode } from 'react'
import { company, fill } from '../data/terms'
import { TransitionLink } from './TransitionLink'
import { LEGAL_LINK, LEGAL_TEXT } from './LegalDetailsTable'

/* Both values go into a RegExp, so escape them (the phone starts with `+`). */
function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const EMAIL = company.email
const PHONE = company.phone

/**
 * A legal-section body block (privacy spec §5): a paragraph — `\n` inside
 * renders as a line break via `white-space: pre-line` — or a semantic
 * bulleted list.
 */
export type Block = { type: 'p'; text: string } | { type: 'ul'; items: string[] }

export type LegalTextOptions = {
  /** Token filler to run before linkifying (Terms `fill()` by default). */
  fillText?: (text: string) => string
  /**
   * Keyword mentions that render as internal links through the page
   * transition (privacy spec §5/§8 — e.g. the Terms page turns plain-text
   * "Privacy Policy" mentions into links now that that page exists).
   */
  extraLinks?: { text: string; to: string }[]
}

/**
 * Renders one legal text string (terms spec §5 notes; privacy spec §5
 * notes): fills the tokens, then turns the `{email}`/`{phone}` values — and
 * any configured internal-page mentions — into real links with the site's
 * underline treatment. Everything else (Cookie Policy mentions, which have
 * no live page) stays plain text.
 */
export function renderLegalText(
  text: string,
  { fillText = fill, extraLinks = [] }: LegalTextOptions = {},
): ReactNode[] {
  const filled = fillText(text)

  const patterns = [
    { text: EMAIL, href: `mailto:${EMAIL}`, internal: false },
    { text: PHONE, href: `tel:${PHONE.replace(/\s/g, '')}`, internal: false },
    ...extraLinks.map((link) => ({ text: link.text, href: link.to, internal: true })),
  ]

  const patternRe = new RegExp(
    `(${patterns.map((pattern) => escapeRegExp(pattern.text)).join('|')})`,
    'g',
  )

  return filled
    .split(patternRe)
    .map((part, index) => {
      /* split() with one capture group alternates plain / captured pieces. */
      if (index % 2 !== 1) return part
      const pattern = patterns.find((candidate) => candidate.text === part)!
      if (pattern.internal) {
        return (
          <TransitionLink
            key={index}
            to={pattern.href}
            className={LEGAL_LINK}
          >
            {part}
          </TransitionLink>
        )
      }
      return (
        <a key={index} href={pattern.href} className={LEGAL_LINK}>
          {part}
        </a>
      )
    })
}

/** Class for one legal paragraph: pre-line breaks, no forced widening. */
export const LEGAL_PARAGRAPH_CLASS = `${LEGAL_TEXT} min-w-0 whitespace-pre-line text-obsidian`
