import type { Block, LegalTextOptions } from './LegalText'
import { LEGAL_PARAGRAPH_CLASS, renderLegalText } from './LegalText'
import { LEGAL_TEXT } from './LegalDetailsTable'

type LegalSectionProps = {
  /** 1-based section number; anchors as `{idPrefix}-{index}`. */
  index: number
  title: string
  /** Terms-style straight paragraphs. */
  paragraphs?: string[]
  /** Privacy-style blocks (privacy spec §5) — `<p>` paragraphs and `<ul>` lists. */
  blocks?: Block[]
  fillText?: (text: string) => string
  idPrefix?: string
  /** Internal-page wordings to linkify (see `renderLegalText`). */
  extraLinks?: { text: string; to: string }[]
  /** Merge extra classes (e.g. no top margin on the first section). */
  className?: string
}

/**
 * One numbered legal section (terms spec §3; privacy spec §3): bold heading
 * (~2rem above, 0.75rem below), then filled paragraphs — or `p`/`ul` blocks
 * — at the legal reading size, ~1rem apart. Paragraphs keep their `\n`
 * breaks in one `<p>`; the bulleted list uses semantic `<ul>`/`<li>` with
 * small solid disc bullets, ~1.1rem left indent, ~0.35rem between items
 * (privacy spec §5).
 */
export default function LegalSection({
  index,
  title,
  paragraphs,
  blocks,
  fillText,
  idPrefix = 'terms',
  className = '',
  extraLinks,
}: LegalSectionProps) {
  const options: LegalTextOptions = { fillText, extraLinks }

  const bodyBlocks: Block[] =
    blocks ?? (paragraphs ?? []).map((text) => ({ type: 'p', text }) as Block)

  return (
    <section id={`${idPrefix}-${index}`} className={`mt-[2rem] ${className}`}>
      <h2 className={`${LEGAL_TEXT} mb-[0.75rem] font-bold text-obsidian`}>{title}</h2>
      <div className="flex flex-col gap-[1rem]">
        {bodyBlocks.map((block, i) =>
          block.type === 'ul' ? (
            <ul
              key={i}
              className={`${LEGAL_TEXT} flex list-disc flex-col gap-[0.35rem] pl-[1.1rem] text-obsidian`}
            >
              {block.items.map((item, j) => (
                <li key={j} className="min-w-0">
                  {renderLegalText(item, options)}
                </li>
              ))}
            </ul>
          ) : (
            /* Legal paragraphs render as plain, instantly readable text — no
               reveal animation (terms spec §9; privacy spec §9). */
            <p key={i} className={LEGAL_PARAGRAPH_CLASS}>
              {renderLegalText(block.text, options)}
            </p>
          ),
        )}
      </div>
    </section>
  )
}
