/*
 * Asset slots (remaining-sections spec §2.4). Every entry is a labelled local
 * placeholder: TODO(asset) — swap the file for the real one, same slot name.
 */
import workPh from '../assets/marino/work-ph.svg'
import heroTeam from '../assets/marino/hero-team.svg'
import heroTerminal from '../assets/marino/hero-terminal.svg'
import contactThumb from '../assets/marino/contact-thumb.svg'
import serviceBranding from '../assets/marino/service-branding.svg'
import serviceWebDesign from '../assets/marino/service-web-design.svg'
import serviceSeo from '../assets/marino/service-seo.svg'
import servicePpc from '../assets/marino/service-ppc.svg'
import blackbird from '../assets/marino/blackbird.svg'
import blackbirdLogo from '../assets/marino/blackbird-logo.svg'
import stats1 from '../assets/marino/stats-1.svg'
import stats2 from '../assets/marino/stats-2.svg'
import stats3 from '../assets/marino/stats-3.svg'
import pillGif1 from '../assets/med/pill-1.gif'
import pillGif2 from '../assets/med/pill-1b.gif'
import pillStill1 from '../assets/med/pill-3.gif'
import pillStill2 from '../assets/med/pill-4.gif'
import pillStill3 from '../assets/med/pill-5.gif'
import pillStill4 from '../assets/med/pill-6.gif'
import pillContact from '../assets/med/pill-contact.gif'

const SLOTS: Record<string, string> = {
  'work-ph': workPh,
  /* TODO(asset): named work-card slots all point at the shared placeholder
     until the real photos land — swap the slot, not the markup. */
  'work-latakoo': workPh,
  'work-vislink': workPh,
  'work-wr-partners': workPh,
  'work-office-insight': workPh,
  'work-eventotron': workPh,
  'work-portswigger': workPh,
  'work-blackbird': workPh,
  'work-star-laundry': workPh,
  'work-a1s-group': workPh,
  'work-confirm-testing': workPh,
  'work-modern-garden-rooms': workPh,
  'work-spatial': workPh,
  'work-ice-signs': workPh,
  /* TODO(asset): work page hero photo — 16:9 shot of the team at a table.
     Reuses the hero-team placeholder until the real work-hero.jpg lands. */
  'work-hero': heroTeam,
  /* Home hero frames (the CMS resolves these from the media library once the
     payload lands; these are the first-paint fallbacks). */
  'hero-team': heroTeam,
  'hero-terminal': heroTerminal,
  'contact-thumb': contactThumb,
  /* TODO(asset): web-design page photos — `web-design-feature.jpg` (two men on
     an orange sofa) and `web-design-why.jpg` (the team around a table with
     plants). Both reuse the hero-team placeholder until the real files land;
     swap the file, not the slot. */
  'web-design-feature': heroTeam,
  'web-design-why': heroTeam,
  /* TODO(asset): seo page photos — `seo-middle-1200x990.jpg` (6:5, feature
     panel) and `about-us-top-right-1200x675.jpg` (16:9, campaign panel) on the
     live page. Both are decorative there, so they reuse the hero-team
     placeholder until the real files land. */
  'seo-feature': heroTeam,
  'seo-why': heroTeam,
  /* TODO(asset): branding page photos — `branding-feature.jpg` (a smiling man
     with arms crossed in a black t-shirt, portrait crop) and
     `branding-why.jpg` (people around a table in front of a wall with a bee
     logo, 16:9). Both reuse the hero-team placeholder until the real files
     land; swap the file, not the slot. */
  'branding-feature': heroTeam,
  'branding-why': heroTeam,
  /* TODO(asset): services page hero photo — 16:9 team shot (4 people at a
     table with plants). Reuses the hero-team placeholder until the real
     services-hero.jpg lands; swap the file, not the slot. */
  'services-hero': heroTeam,
  'service-branding': serviceBranding,
  'service-web-design': serviceWebDesign,
  'service-seo': serviceSeo,
  'service-ppc': servicePpc,
  blackbird,
  'blackbird-logo': blackbirdLogo,
  'stats-1': stats1,
  'stats-2': stats2,
  'stats-3': stats3,
  /* Floating hero/experience pills. The two hero GIFs + the contact GIF are
     the originals; the four still-image pills (hero frame 3 + the three
     experience frames) now carry the new sticker-sheet GIFs. */
  'pill-1': pillGif1,
  'pill-2': pillGif2,
  'pill-3': pillStill1,
  'pill-4': pillStill2,
  'pill-5': pillStill3,
  'pill-6': pillStill4,
  /* Contact-row thumbnail: the supplied team GIF beside the email/phone. */
  'pill-contact': pillContact,
}

/** Resolve a content asset slot to its imported local URL. */
export function asset(slot: string): string {
  const url = SLOTS[slot]
  if (!url) throw new Error(`Unknown asset slot: ${slot}`)
  return url
}

/**
 * A CMS media URL or a local asset slot. The CMS resolves media to absolute
 * URLs (or `/media/...` when served same-origin); fallback content passes slot
 * names. Keeping both behind one helper means a component never has to know
 * where its image came from.
 */
export function imageSrc(value: string): string {
  return value.startsWith('/') || value.startsWith('http') || value.startsWith('data:')
    ? value
    : asset(value)
}

/* The two supplied GIFs always lead the hero; the four new GIFs fill the four
   still-image pills (hero frame 3 + the three experience frames). */
const HERO_GIF_SLOTS = ['pill-1', 'pill-2'] as const
const STILL_PILL_SLOTS = ['pill-3', 'pill-4', 'pill-5', 'pill-6'] as const

function shuffled<T>(items: readonly T[]): T[] {
  const out = [...items]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

/**
 * The four still-image pills: one shuffle decides everything, once per page
 * load. Slot 0 lands in the hero's third frame; the remaining three fill the
 * experience frames. Every GIF shows exactly once, re-renders cannot reshuffle
 * the pills mid-animation, and the hidden/exported branches share the order.
 */
const shuffledStills = shuffled(STILL_PILL_SLOTS).map(asset)
export const HERO_STILL_SLOT = shuffledStills[0]
export const EXPERIENCE_PILL_SRCS: readonly [string, string, string] = [
  shuffledStills[1],
  shuffledStills[2],
  shuffledStills[3],
]

/**
 * Hero frames: both GIFs, then one of the four new GIFs. Computed once per
 * page load so the hidden mobile and desktop hero branches share the same
 * three sources.
 */
export const HERO_PILL_SRCS: readonly [string, string, string] = [
  asset(HERO_GIF_SLOTS[0]),
  asset(HERO_GIF_SLOTS[1]),
  HERO_STILL_SLOT,
]
