/*
 * Project data (work page spec §6). Single source of truth: both the Home
 * "Our latest work" panel and the `/work` grid read from here, so titles, tags,
 * crops and photos are never duplicated.
 *
 * Order is the `/work` render order for page 1. Assets are labelled local
 * placeholders: TODO(asset) — swap the slot in `assets.ts`, not the markup.
 */

/** Which column a card sits in on the Home panel at md+ (DOM order is right column first). */
export type WorkColumn = 'left' | 'right'

export type Project = {
  /** Route segment: `/work/${slug}/` matches the live route. */
  slug: string
  title: string
  tags: string[]
  /** Asset slot resolved through `asset()` (see `content/assets.ts`). */
  image: string
  /** `object-position` for the crop. */
  focus?: string
  /** Home panel column at md+; only the four Home cards need it. */
  column?: WorkColumn
}

/* ------------------------------------------------------------------ */
/* Page 1 — real content                                               */
/* ------------------------------------------------------------------ */

/* TODO(asset): work card photos — swap each `work-*` slot for the real image. */
export const PROJECTS: Project[] = [
  {
    slug: 'wr-partners',
    title: 'WR Partners',
    column: 'right',
    tags: ['Branding', 'Web Design', 'SEO', 'PPC', 'Video'],
    image: 'work-wr-partners',
    focus: 'center 35%',
  },
  {
    slug: 'office-insight',
    title: 'Office Insight',
    column: 'right',
    tags: ['Web Design', 'SEO', 'PPC'],
    image: 'work-office-insight',
    focus: 'center',
  },
  {
    slug: 'latakoo',
    title: 'Latakoo',
    column: 'left',
    tags: ['Branding', 'Web Design', 'SEO', 'PPC'],
    image: 'work-latakoo',
    focus: '60% 40%',
  },
  {
    slug: 'vislink',
    title: 'Vislink',
    column: 'left',
    tags: ['Branding', 'Web Design', 'SEO', 'PPC', 'Video'],
    image: 'work-vislink',
    focus: '55% 45%',
  },
  {
    slug: 'eventotron',
    title: 'Eventotron',
    tags: ['Branding'],
    image: 'work-eventotron',
    focus: 'center 40%',
  },
  {
    slug: 'portswigger',
    title: 'PortSwigger',
    tags: ['Web Design', 'SEO'],
    image: 'work-portswigger',
    focus: 'center 35%',
  },
  {
    slug: 'blackbird',
    title: 'Blackbird',
    tags: ['Branding', 'Web Design', 'SEO', 'PPC', 'Video'],
    image: 'work-blackbird',
    focus: 'center 30%',
  },
  {
    slug: 'star-laundry',
    title: 'Star Laundry',
    tags: ['Branding', 'Web Design', 'SEO'],
    image: 'work-star-laundry',
    focus: 'center 40%',
  },
  {
    slug: 'a1s-group',
    title: 'A1S Group',
    tags: ['SEO'],
    image: 'work-a1s-group',
    focus: 'center 50%',
  },
  {
    slug: 'confirm-testing',
    title: 'Confirm Testing',
    tags: ['PPC'],
    image: 'work-confirm-testing',
    focus: 'center 35%',
  },
  {
    slug: 'modern-garden-rooms',
    title: 'Modern Garden Rooms & Offices',
    tags: ['Branding', 'Web Design', 'SEO', 'PPC', 'Video'],
    image: 'work-modern-garden-rooms',
    focus: 'center 45%',
  },
  {
    slug: 'spatial',
    title: 'Spatial',
    tags: ['Branding', 'Web Design', 'SEO'],
    image: 'work-spatial',
    focus: 'center 50%',
  },
  {
    slug: 'ice-signs',
    title: 'ICE Signs',
    tags: ['Branding', 'Web Design', 'SEO'],
    image: 'work-ice-signs',
    focus: 'center 40%',
  },

  /* ---------------------------------------------------------------- */
  /* TODO(content): pages 2–3 are NOT in the reference screenshots.    */
  /*                                                                   */
  /* These clearly-marked placeholders exist only so the pager can be   */
  /* built and exercised (13/page -> 3 pages). Replace each entry with  */
  /* the real project from the live site and delete this block; the     */
  /* pages/ranges all derive from PROJECTS, so nothing else changes.    */
  /* ---------------------------------------------------------------- */
  ...Array.from({ length: 14 }, (_, i): Project => ({
    slug: `todo-placeholder-${i + 14}`,
    title: 'TODO(content)',
    tags: [],
    image: 'work-ph',
  })),
]

/** Cards per page on `/work` (spec §5.2). */
export const WORK_PAGE_SIZE = 13
