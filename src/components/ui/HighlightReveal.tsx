import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  useMotionValue,
  animate,
  type MotionValue,
} from 'motion/react'
import {
  Fragment,
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  type ElementType,
  type ReactElement,
  type ReactNode,
} from 'react'
import { getWordOpacity, getWordProgressRange } from '../../lib/wordReveal'

/** `useScroll`'s `offset` option, reused for this component's `offset` prop. */
export type ScrollOffset = NonNullable<Parameters<typeof useScroll>[0]>['offset']

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

/** Total word count across a subtree, in reading order. */
function countWords(node: ReactNode): number {
  if (typeof node === 'string') return node.split(/\s+/).filter(Boolean).length
  if (Array.isArray(node)) return node.reduce((n: number, c) => n + countWords(c), 0)
  if (isValidElement(node)) return countWords((node.props as { children?: ReactNode }).children)
  return 0
}

/** Flattened text of a subtree — the single, unanimated screen-reader copy. */
function plainText(node: ReactNode): string {
  if (typeof node === 'string') return node
  if (Array.isArray(node)) return node.map(plainText).join('')
  if (isValidElement(node)) return plainText((node.props as { children?: ReactNode }).children)
  return ''
}

/* ------------------------------------------------------------------ */
/* Rendering                                                           */
/* ------------------------------------------------------------------ */

function Word({
  children,
  progress,
  index,
  count,
}: {
  children: string
  progress: MotionValue<number>
  index: number
  count: number
}) {
  const range = getWordProgressRange(index, count)
  const opacity = useTransform(progress, (v) => getWordOpacity(v, range))
  return <motion.span style={{ opacity }}>{children}</motion.span>
}

/**
 * Walks the children and replaces every word of text with a `<Word>`.
 * Whitespace is passed through untouched (so line breaking is unchanged) and
 * non-text nodes are kept as-is — recursed into so their text reveals too.
 */
function renderWords(
  node: ReactNode,
  progress: MotionValue<number>,
  count: number,
  counter: { i: number },
): ReactNode {
  if (typeof node === 'string') {
    return node.split(/(\s+)/).map((part, k) => {
      if (!part) return null
      if (/^\s+$/.test(part)) return part
      const index = counter.i++
      return (
        <Word key={k} progress={progress} index={index} count={count}>
          {part}
        </Word>
      )
    })
  }

  if (Array.isArray(node)) {
    return node.map((c, k) => (
      <Fragment key={k}>{renderWords(c, progress, count, counter)}</Fragment>
    ))
  }

  if (isValidElement(node)) {
    const el = node as ReactElement<{ children?: ReactNode }>
    return cloneElement(el, undefined, renderWords(el.props.children, progress, count, counter))
  }

  return node
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export interface HighlightRevealProps {
  children: ReactNode
  /** Wrapper element. Defaults to the inline `span`; use `as="mark"` for `<mark>`. */
  as?: ElementType
  /** The EXISTING highlight classes — this component adds no styling of its own. */
  className?: string
  /** Scroll range the reveal runs over. Tune long segments with a taller end. */
  offset?: ScrollOffset
  /**
   * `"scroll"` (default) drives the reveal from the element's own position.
   * `"load"` animates 0 → 1 over ~1.2s on mount instead — use it for anything
   * that is visible at scroll position 0, which would otherwise sit dim.
   */
  mode?: 'scroll' | 'load'
}

/**
 * Scroll-driven word-by-word reveal for **highlighted** text.
 *
 * Only opacity moves (15% → 100%), so there is no layout shift and line
 * wrapping is identical to the static site. The highlight background/padding
 * lives on this wrapper and is never faded. Reduced motion renders the plain
 * children untouched; screen readers get one `sr-only` copy of the text.
 */
export default function HighlightReveal({
  children,
  as: Tag = 'span',
  className,
  offset = ['start 0.9', 'end 0.5'],
  mode = 'scroll',
}: HighlightRevealProps) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset })
  const loadProgress = useMotionValue(0)

  useEffect(() => {
    if (mode !== 'load' || reduced) return
    const controls = animate(loadProgress, 1, { duration: 1.2, ease: 'easeOut' })
    return () => controls.stop()
  }, [mode, reduced, loadProgress])

  if (reduced) return <Tag className={className}>{children}</Tag>

  const progress = mode === 'load' ? loadProgress : scrollYProgress
  const count = countWords(children)

  return (
    <Tag ref={ref} className={className}>
      <span className="sr-only">{plainText(children)}</span>
      <span aria-hidden="true">{renderWords(children, progress, count, { i: 0 })}</span>
    </Tag>
  )
}
