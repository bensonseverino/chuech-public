import type { ReactNode } from 'react'
import { company, fill } from '../data/terms'
import { LEGAL_LINK, LEGAL_TEXT } from './LegalDetailsTable'

const EMAIL = company.email
const PHONE = company.phone

/**
 * `{email}` and `{phone}` tokens (terms spec §5 notes) render as real
 * `mailto:` / `tel:` links once `fill()` has resolved them, using the site's
 * underline treatment — everything else (Privacy/Cookie Policy mentions,
 * which have no live pages yet) stays plain text.
 */
/* Both values go into a RegExp, so escape them (the phone starts with `+`). */
function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const CONTACT_LINK_RE = new RegExp(`(${escapeRegExp(EMAIL)}|${escapeRegExp(PHONE)})`, 'g')

function toContactParts(text: string): ReactNode[] {
  return text.split(CONTACT_LINK_RE).map((part, index) => {
    /* split() with one capture group alternates plain / captured pieces. */
    if (index % 2 === 1) {
      return (
        <a
          key={index}
          href={part === EMAIL ? `mailto:${EMAIL}` : `tel:${PHONE.replace(/\s/g, '')}`}
          className={LEGAL_LINK}
        >
          {part}
        </a>
      )
    }
    return part
  })
}

type LegalSectionProps = {
  /** 1-based section number; anchors as `id="terms-{index}"`. */
  index: number
  title: string
  paragraphs: string[]
  /** Merge extra classes (e.g. no top margin on the first section). */
  className?: string
}

/**
 * One numbered section (terms spec §3): bold heading (~2rem above, 0.75rem
 * below), then filled paragraphs at the legal reading size, ~1rem apart.
 * Paragraphs that contain `\n` (the section-21 contact block) keep their line
 * breaks via `white-space: pre-line` — one `<p>`, not several.
 */
export default function LegalSection({ index, title, paragraphs, className = '' }: LegalSectionProps) {
  return (
    <section id={`terms-${index}`} className={`mt-[2rem] ${className}`}>
      <h2 className={`${LEGAL_TEXT} mb-[0.75rem] font-bold text-obsidian`}>{title}</h2>
      <div className="flex flex-col gap-[1rem]">
        {paragraphs.map((paragraph, i) => (
          /* Legal paragraphs render as plain, instantly readable text — no
             reveal animation (terms spec §9). `min-w-0` keeps long unbroken
             strings (like the TODO domain) from forcing the card wider. */
          <p key={i} className={`${LEGAL_TEXT} min-w-0 whitespace-pre-line text-obsidian`}>
            {toContactParts(fill(paragraph))}
          </p>
        ))}
      </div>
    </section>
  )
}
