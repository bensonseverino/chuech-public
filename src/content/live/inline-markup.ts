/*
 * RichInline grammar (spec §2.3) — parsing and conversion helpers only.
 * The React renderer lives in `inline.tsx`; keeping this file free of JSX is
 * what lets the project's fast-refresh rule apply to the component.
 *
 *   **bold**        → a semibold run
 *   ==highlight==   → the lavender pill
 *   [text](/path)   → an internal link (https:// for external)
 *
 * Straight port of `packages/content-schema/src/rich-inline.ts`, so the public
 * site and the CMS preview parse text identically. No HTML is ever parsed or
 * emitted: unknown markup stays literal.
 */

export type InlineNode =
  | { type: 'text'; value: string }
  | { type: 'bold'; value: string }
  | { type: 'highlight'; value: string }
  | { type: 'link'; value: string; to: string }

export type InlineParagraph = InlineNode[]

const LINK_PATTERN = /\[([^\]]+)\]\(([^)\s]+)\)/g

/** Parse one inline field into paragraphs (blank line = new paragraph). */
export function parseInline(source: string): InlineParagraph[] {
  return source
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0)
    .map(parseParagraph)
}

export function parseParagraph(paragraph: string): InlineParagraph {
  const nodes: InlineNode[] = []
  let rest = paragraph

  while (rest.length > 0) {
    const next = findNextMarker(rest)

    if (!next) {
      nodes.push({ type: 'text', value: rest })
      break
    }

    if (next.index > 0) {
      nodes.push({ type: 'text', value: rest.slice(0, next.index) })
    }

    nodes.push(next.node)
    rest = rest.slice(next.index + next.length)
  }

  return mergeAdjacentText(nodes)
}

type Match = { index: number; length: number; node: InlineNode }

function findNextMarker(source: string): Match | null {
  const candidates: Match[] = []

  const link = findLink(source)
  if (link) candidates.push(link)

  const bold = findDelimited(source, '**', (value) => ({ type: 'bold', value }))
  if (bold) candidates.push(bold)

  const highlight = findDelimited(source, '==', (value) => ({ type: 'highlight', value }))
  if (highlight) candidates.push(highlight)

  if (candidates.length === 0) return null

  return candidates.reduce((best, current) => {
    if (current.index < best.index) return current
    if (current.index === best.index && current.length > best.length) return current
    return best
  })
}

function findLink(source: string): Match | null {
  LINK_PATTERN.lastIndex = 0
  const match = LINK_PATTERN.exec(source)
  if (!match) return null

  const [full, label, to] = match
  if (label === undefined || to === undefined || label.trim().length === 0) return null

  return {
    index: match.index,
    length: full.length,
    node: { type: 'link', value: label, to },
  }
}

function findDelimited(
  source: string,
  delimiter: string,
  build: (value: string) => InlineNode,
): Match | null {
  const start = source.indexOf(delimiter)
  if (start === -1) return null

  const contentStart = start + delimiter.length
  const end = source.indexOf(delimiter, contentStart)
  if (end === -1) return null

  const value = source.slice(contentStart, end)
  if (value.length === 0) return null

  return {
    index: start,
    length: delimiter.length * 2 + value.length,
    node: build(value),
  }
}

function mergeAdjacentText(nodes: InlineNode[]): InlineNode[] {
  const merged: InlineNode[] = []

  for (const node of nodes) {
    const previous = merged[merged.length - 1]
    if (node.type === 'text' && previous?.type === 'text') {
      previous.value += node.value
      continue
    }
    merged.push(node)
  }

  return merged
}

/** The plain-text form — used for list previews and metadata fallbacks. */
export function toPlainText(source: string): string {
  return parseInline(source)
    .map((paragraph) => paragraph.map((node) => node.value).join(''))
    .join('\n\n')
}

/**
 * Convert the site's legacy `RichSegment[]` (a string or `{ label, href }`) to
 * the inline grammar, so local fallback content and CMS content share one
 * renderer.
 */
export function fromSegments(
  segments: readonly (string | { label: string; href: string })[],
): string {
  return segments
    .map((segment) => (typeof segment === 'string' ? segment : `[${segment.label}](${segment.href})`))
    .join('')
}

/** Wrap known phrases in `==…==` (the local fallback stores highlights apart). */
export function markHighlights(text: string, highlights: readonly string[]): string {
  let value = text
  for (const phrase of highlights) value = value.split(phrase).join(`==${phrase}==`)
  return value
}

/** Coordinates of the first highlighted run (the Home intro's decorative dot). */
export function firstMarkPosition(
  paragraphs: InlineParagraph[],
): { paragraph: number; index: number } | null {
  for (const [paragraph, nodes] of paragraphs.entries()) {
    for (const [index, node] of nodes.entries()) {
      if (node.type === 'highlight') return { paragraph, index }
    }
  }
  return null
}
