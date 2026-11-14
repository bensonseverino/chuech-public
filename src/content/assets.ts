/*
 * Asset slots (remaining-sections spec §2.4). Every entry is a labelled local
 * placeholder: TODO(asset) — swap the file for the real one, same slot name.
 */
import workPh from '../assets/marino/work-ph.svg'
import heroTeam from '../assets/marino/hero-team.svg'
import heroTerminal from '../assets/marino/hero-terminal.svg'
import contactThumb from '../assets/marino/contact-thumb.svg'
import serviceBranding from '../assets/marino/service-branding.webp'
import serviceWebDesign from '../assets/marino/service-web-design.webp'
import serviceSeo from '../assets/marino/service-seo.webp'
import servicePpc from '../assets/marino/service-ppc.webp'
import brandingFeature from '../assets/marino/branding-feature.webp'
import brandingWhy from '../assets/marino/branding-why.jpg'
import webDesignFeature from '../assets/marino/web-design-feature.jpg'
import webDesignWhy from '../assets/marino/web-design-why.jpg'
import seoFeature from '../assets/marino/seo-feature.jpg'
import seoWhy from '../assets/marino/seo-why.jpg'
import ppcFeature from '../assets/marino/ppc-feature.jpg'
import ppcWhy from '../assets/marino/ppc-why.jpg'
import aboutHero from '../assets/marino/about-hero.jpg'
import aboutMission from '../assets/marino/about-mission.jpg'
import servicesHero from '../assets/marino/services-hero.jpg'
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
  /* Web-design page photos — `web-design-feature.jpg` (the Verve Creative
     portfolio collage) and `web-design-why.jpg` (the dark desk with code
     screens + coffee). Both swapped in file-for-file. */
  'web-design-feature': webDesignFeature,
  'web-design-why': webDesignWhy,
  /* SEO page photos — `seo-feature.jpg` (the Search Console performance
     closeup) and `seo-why.jpg` (the Analytics dashboard laptop with the
     Kenya-flag mug coaster). Both swapped in file-for-file. */
  'seo-feature': seoFeature,
  'seo-why': seoWhy,
  /* Branding page photos — `branding-feature.webp` (the Smash tennis brand
     collage) and `branding-why.jpg` (the team around a table with color
     swatches, 16:9). Swapped in place, per the swap-the-file-not-the-slot
     convention. */
  'branding-feature': brandingFeature,
  'branding-why': brandingWhy,
  /* PPC page photos — `ppc-feature.jpg` (the LinkedIn Ads Campaign Manager
     closeup) and `ppc-why.jpg` (the sprint/kanban dashboard with pencil).
     Both swapped in file-for-file. */
  'ppc-feature': ppcFeature,
  'ppc-why': ppcWhy,
  /* About page photos — `about-hero.jpg` (the hand-drawn "Sucking → Not
     Sucking, The Past → The Future" chart) and `about-mission.jpg` (two
     people sketching wireframes, Kenya-flag sticker on the laptop). Both
     swapped in file-for-file. */
  'about-hero': aboutHero,
  'about-mission': aboutMission,
  /* Services page hero photo — `services-hero.jpg` (the Scrabble "GROWTH"
     tiles photo, 16:9). Swapped in file-for-file. */
  'services-hero': servicesHero,
  'service-branding': serviceBranding,
  'service-web-design': serviceWebDesign,
  'service-seo': serviceSeo,
  'service-ppc': servicePpc,
  blackbird,
  'blackbird-logo': blackbirdLogo,
  'stats-1': stats1,
  'stats-2': stats2,
  'stats-3': stats3,
  /* Media pill GIFs — the two hero originals, the four sticker-sheet GIFs and
     the contact thumb. All seven live in one daily-rotating pool (§assets). */
  'pill-1': pillGif1,
  'pill-2': pillGif2,
  'pill-3': pillStill1,
  'pill-4': pillStill2,
  'pill-5': pillStill3,
  'pill-6': pillStill4,
  /* Contact-row thumbnail slot: joins the daily pill pool. */
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

/* Every pill GIF — the two hero originals, the four sticker-sheet GIFs and
   the contact thumbnail — live in one pool. One daily shuffle assigns all
   seven across the site's seven pill frames (2 hero + 1 hero-third + 3
   experience + 1 contact): the arrangement holds for the local calendar day
   and rotates to a fresh mix at midnight. */
const GIF_SLOTS = [
  'pill-1',
  'pill-2',
  'pill-3',
  'pill-4',
  'pill-5',
  'pill-6',
  'pill-contact',
] as const

/** Seed from the local calendar date so the shuffle changes once per day. */
function dailySeed(): number {
  const d = new Date()
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate()
}

/** Deterministic Fisher-Yates (mulberry32 PRNG) for reproducible daily mixes. */
function seededShuffle<T>(items: readonly T[], seed: number): T[] {
  const out = [...items]
  let s = seed >>> 0
  for (let i = out.length - 1; i > 0; i--) {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    const rand = ((t ^ (t >>> 14)) >>> 0) / 4294967296
    const j = Math.floor(rand * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

/* Resolved once per module load: seven different GIFs, one per pill frame. */
const dailyPills = seededShuffle(GIF_SLOTS, dailySeed()).map(asset)

/**
 * Hero frames: three of the day's seven GIFs, leading the headline. Computed
 * once per page load so the hidden mobile and desktop hero branches share the
 * same three sources and re-renders cannot reshuffle the pills mid-animation.
 */
export const HERO_PILL_SRCS: readonly [string, string, string] = [
  dailyPills[0],
  dailyPills[1],
  dailyPills[2],
]

/**
 * Experience frames: three more of the day's GIFs. Mobile shows the first
 * two; tablet/desktop show all three.
 */
export const EXPERIENCE_PILL_SRCS: readonly [string, string, string] = [
  dailyPills[3],
  dailyPills[4],
  dailyPills[5],
]

/**
 * Contact-row thumbnail: the last of the day's GIFs, so the thumbnail joins
 * the daily rotation instead of staying fixed.
 */
export const CONTACT_THUMB = dailyPills[6]
