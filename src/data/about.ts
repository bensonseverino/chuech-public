/*
 * About page content (about spec §3). Single source of truth for all copy,
 * images and links. Every uncertain fact is marked TODO for the owner to replace.
 */
import { ROUTES } from '../routes'

/** Three hero/mission/photo-strip images. All are placeholder slots — swap in assets.ts. */
export const ABOUT_IMAGES = {
  hero: { src: 'hero-team', alt: 'Chuech studio team' },         // small hero image (16:9)
  mission: { src: 'hero-team', alt: 'Chuech studio mission' },   // large mission image (~16:10)
  photoStrip: [
    { src: 'work-ph', alt: 'Chuech studio photo 1' },            // 16:9
    { src: 'work-ph', alt: 'Chuech studio photo 2' },
    { src: 'work-ph', alt: 'Chuech studio photo 3' },
  ],
} as const

export const about = {
  /** Breadcrumb pill top-left under nav. */
  breadcrumb: 'About Us',

  /** Page <h1>. */
  heading: 'About Chuech studio',

  /** Hero mint pills. */
  heroPills: {
    /** Bottom-left of heading block ("Est TODO_YEAR"). */
    left: 'Est TODO_YEAR',
    /** Above hero image ("Proudly from TODO_CITY"). */
    top: 'Proudly from TODO_CITY',
  },

  /** Intro paragraph under heading. */
  intro:
    'A passion for launching and growing standout brands has seen Chuech studio build digital experiences from concept to launch. We pair bold creative with measurable strategy to help ambitious brands grow online. Could you be our next success story?',

  /** Contact line in hero (desktop/tablet only). Match contact.ts. */
  email: 'hello@chuechstudio.co.ke',
  phone: '+254 117 954 929',

  /** Mission section. */
  mission: {
    heading: 'Our mission? Help your business reach its online potential',
    body:
      'The digital landscape never stands still, and right now it can feel like a space that is evolving at lightning speed. Our aim, at Chuech studio, is to help brands of every size take the opportunity presented to them by these exciting new ways of marketing. This has been our belief ever since Chuech studio was founded and continues to this day.',
    linkLabel: 'Contact',
    linkHref: ROUTES.contact,
  },

  /** "Built by those who know…" card. */
  builtBy: {
    heading: 'Built by those who know how to make growth happen',
    form: { submitLabel: 'Request Call Back' },
    story:
      'Chuech studio was built on the belief that creative work should do more than make a brand look good online. It should help it grow. Our team brings design, motion, and strategy together under one roof, so every project is crafted with purpose and measured by results.',
    ctaHeading: 'Ready to go?',
    ctaBody:
      'We work with ambitious brands that want sharp strategy and bold creative. From first idea to final launch, we’re a studio built around momentum.',
    ctaLabel: 'Contact',
    ctaHref: ROUTES.contact,
  },

  /** Three-photo strip under the Built-by card. */
  photoStrip: ABOUT_IMAGES.photoStrip,

  /** Our Services card. */
  services: {
    heading: 'Our Services',
    body:
      'From our studio, we partner with brands across all sectors, delivering branding, bespoke websites, video, and digital campaigns that improve the bottom line.',
    /** Match the Services page / footer list exactly. TODO: keep in sync. */
    pills: ['Branding', 'Web Design', 'SEO', 'PPC', 'Video'],
  },

  /** Results / Work block. Projects + testimonials come from home-page data. */
  results: {
    heading: 'We let our results do the talking',
    body:
      'While most studios go on and on about how successful they are, we believe that our results are persuasive enough for you to consider working with us. Whether you work in e-commerce, finance, or tech, we have the approach, tools, and expertise to help you achieve your goals. See how we’ve helped these brands do just that.',
    linkLabel: 'Contact',
    linkHref: ROUTES.contact,
  },

  /** Stats marquee (reuses ExperienceSection component). */
  stats: {
    /** Giant scrolling text. */
    marqueeText: 'TODO_NUMBER verified 5 star reviews',
    /** Floating mint pill A. */
    pillA: 'Decades of experience',
    /** Floating mint pill B. */
    pillB: 'Clients in TODO countries',
    /** CTA under the marquee stage. */
    cta: { text: 'Send us a brief and we’ll talk', label: 'Contact Us', href: ROUTES.contact },
  },
} as const

/** Shape for the stats object passed to ExperienceSection. */
export type AboutStats = typeof about.stats