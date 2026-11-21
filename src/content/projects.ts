/*
 * Bundled project fallback (work page spec §6).
 *
 * The CMS is the source of truth for work: `/api/public/projects` returns only
 * rows with status = 'published'. This list exists solely so the site still
 * renders if that API is unreachable, so it must only contain projects that
 * are actually published. Dummy "TODO" rows and unpublished drafts were
 * removed — adding one here would put work back on the site without the CMS.
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

/** Only the project published in the CMS. New work is added there, not here. */
export const PROJECTS: Project[] = [
  {
    slug: 'eventotron',
    title: 'Eventotron',
    column: 'right',
    tags: ['Branding'],
    image: 'work-eventotron',
    focus: 'center 40%',
  },
]

/** Cards per page on `/work` (spec §5.2). */
export const WORK_PAGE_SIZE = 13
