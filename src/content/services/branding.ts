/*
 * `/branding` content (same shape as `web-design.ts`, so the generic
 * `ServicePage` template renders it unchanged).
 *
 * Every string marked COPY in the branding spec was transcribed from the live
 * page https://marino.co.uk/branding/ (read 2026-10-11), including the curly
 * apostrophes; the live `<title>` and meta description were verified against
 * the page source rather than the spec's placeholder.
 *
 * TODO(asset): the two photos are labelled local placeholders — the live page
 * uses `branding-feature.jpg` (a smiling man with arms crossed in a black
 * t-shirt, blurred green background, portrait crop) and `branding-why.jpg`
 * (people around a table in front of a wall with a bee logo, 16:9). Both slots
 * reuse the shared hero-team placeholder until the real files land.
 */
import { ROUTES } from '../../routes'
import type {
  ServiceFaqItem,
  ServiceFormContent,
  ServicePageContent,
} from './web-design'

/* ------------------------------------------------------------------ */
/* Hero                                                               */
/* ------------------------------------------------------------------ */

const HERO_FORM: ServiceFormContent = {
  heading: 'Request a free consultation today',
  highlight: 'free consultation',
  fields: [
    { name: 'name', label: 'Name*', required: true },
    { name: 'email', label: 'Email*', type: 'email', required: true },
    { name: 'phone', label: 'Phone', type: 'tel' },
    { name: 'message', label: 'Message', type: 'textarea' },
  ],
  submitLabel: 'Request Consultation',
  source: 'branding-hero',
}

/* ------------------------------------------------------------------ */
/* Dark pillars panel — same six items as the feature checklist        */
/* ------------------------------------------------------------------ */

const PILLARS = [
  {
    title: 'Brand strategy',
    body: 'A brand project without any sort of strategy is only going to have surface-level effects. We dig deep and help you find out who you are within your industry, which allows us to build messaging pillars based on this identity. The aim is to make you look and feel distinct from your competitors while still retaining the familiar traits that audiences may expect from a given industry.',
  },
  {
    title: 'Tone of voice',
    body: 'All the best companies have a strong verbal identity. It\u2019s unique to them and always seems to speak directly to the user. It\u2019s tricky, but with the help of our copywriters and brand experts, we\u2019ll create a framework so that everyone in your company can create content that feels accurate to your brand.',
  },
  {
    title: 'Digital brand identity design',
    body: 'Once out in the open, your brand will live among search results, landing pages, and adverts and in this digital environment, your visual identity needs to be able to stand out in these spaces. All aspects of your finished brand, from the typography through to the colour palettes, will consider your audience\u2019s experience and all future marketing campaigns.',
  },
  {
    title: 'Logos and visual identity',
    body: 'Logos and other visual assets need to be easily recognisable while being practical enough to be used as favicons or on official documentation. A bank of iconography will allow you to put your brand front and centre, no matter where it is.',
  },
  {
    title: 'Rebranding',
    body: 'For established brands, rebrands can be daunting, but they aren\u2019t about ripping everything up. They\u2019re about building on what\u2019s already there and meeting the new challenges and industry environment is facing. Our team will help refresh your identity in a way that protects your existing image while evolving it for changing audiences.',
  },
  {
    title: 'Performance-led branding',
    body: 'Your branding plays a vital part in how your business performs online, and with our integrated approach, which involves all relevant parties, including SEO and PPC experts, we ensure everything is tied back to how it can contribute to growing your bottom line.',
  },
]

/* ------------------------------------------------------------------ */
/* FAQ — 9 questions, live order                                      */
/* ------------------------------------------------------------------ */

const FAQ_ITEMS: ServiceFaqItem[] = [
  {
    question: 'What do branding services include?',
    answer: [
      'Our branding services can help you no matter the sort of services you require. Whether you\u2019re looking to establish your tone of voice or want to completely overhaul how you look and sound, we have the expertise on hand to help you.',
    ],
  },
  {
    question: 'Will my branding work across digital platforms?',
    answer: [
      'Yes, we build all brands with digital performance in mind. All the assets we create work consistently across any marketing campaign you have planned.',
    ],
  },
  {
    question: 'Do branding projects include messaging and copywriting?',
    answer: [
      'Yes, how your business sounds is a vital part of any brand, and consistent messaging is vital. Marino\u2019s team can help define messaging and tone of voice guidelines so that any brand language your business communicates is consistent across all marketing channels.',
    ],
  },
  {
    question: 'How long does a branding project take?',
    answer: [
      'This depends on how comprehensive a project you want to undertake. A total rebrand will take longer than creating a tone of voice doc, typically. Your brand is forever, so it\u2019s important to take the time to ensure you\u2019re happy with what\u2019s produced so that you can confidently use it going forward.',
    ],
  },
  {
    question: 'What\u2019s the difference between branding and logo design?',
    answer: [
      'Logo design forms just a part of branding. A strong brand includes great logos as well as a distinct tone of voice and eye-catching colour palettes. Branding helps shape how your audiences understand and remember your business.',
    ],
  },
  {
    question: 'Do you offer rebranding for established businesses?',
    answer: [
      'Yes, absolutely. Established businesses may feel their current identity is a bit stagnant or a reflection of a bygone era and want to modernise, which is something our branding services in Manchester can help with.',
    ],
  },
  {
    question: 'How do branding services support business growth?',
    answer: [
      'Strong branding helps customers recognise and trust businesses, which makes them more memorable, for all the right reasons. By having consistent branding across different marketing campaigns, businesses can strengthen their presence in their industry.',
    ],
  },
  {
    question: 'Can branding improve SEO and PPC performance?',
    answer: [
      'In many instances, yes. A refreshed brand is often more eye-catching, especially if there is a bold tone of voice in place that can be used to attract readers. Of course, dedicated SEO and PPC campaigns are still needed if you want to succeed from these channels. A brand project can\u2019t do it all, but it can certainly set you on your way.',
    ],
  },
  {
    question: 'Do you work with businesses outside Manchester?',
    answer: [
      'We do. We are proudly based in Manchester but have worked with businesses across the North and the rest of the UK.',
    ],
  },
]

/* ------------------------------------------------------------------ */
/* Page                                                               */
/* ------------------------------------------------------------------ */

export const BRANDING: ServicePageContent = {
  seo: {
    /* Verified against the live <title> (the spec's short form was a guess). */
    title: 'Branding Agency Manchester | Brand Strategy & Identity | Marino',
    description:
      'Marino is a Manchester branding agency creating distinctive brands, clear positioning, and identities built for growth.',
  },
  hero: {
    label: 'Branding Agency Manchester',
    /* Spec §3.1 asks for the break "Branding services / built for the /
       digital landscape" at 53px/700. The spec's flat 8.2em wraps to four
       lines in the live font (the same mismatch web-design.ts documents for
       its own caps); 8.37em is the centre of the 8.32–8.41em window that
       reproduces the documented three-line break. */
    titleMaxWidth: '8.37',
    title: 'Branding services built for the digital landscape',
    tags: ['Brand Strategy', 'Brand Identity', 'Brand Guidelines', 'Web Design'],
    intro:
      'Marino\u2019s strategic branding services help build the foundations needed so that your business can scale without losing what makes it distinctive. Our experts can help you carve out a brand new identity or refresh an existing one so that modern audiences see your business in the way it\u2019s intended to.',
    form: HERO_FORM,
  },
  feature: {
    heading: 'We build brands to perform',
    /* No heading cap (spec §4): the heading wraps naturally at every width. */
    lead: 'Branding defines how your business is perceived by your audience. It is a reflection of everything that makes it what it is, and for a growing business in Manchester and the rest of the UK operating in a congested market, clarity over who you are as an organisation can help you achieve the growth you deserve.',
    checklist: [
      'Brand strategy',
      'Tone of voice',
      'Digital brand identity design',
      'Logos and visual identity',
      'Rebranding',
      'Performance-led branding',
    ],
    body: 'The full-service nature of Marino allows us to execute brand strategies with web, SEO, and paid media in mind so that your chosen aesthetic isn\u2019t just some fluffy refresh but a project that is tied to commercial objectives. We act as a commercial partner who works to understand your business and its story to create a true reflection of who you are.',
    cta: { label: 'Contact', href: ROUTES.contact },
    image: 'branding-feature',
    /* TODO(asset): a smiling man with arms crossed in a black t-shirt on a
       blurred green background (portrait crop, face kept in frame). Reuses the
       shared hero-team placeholder until the real branding-feature.jpg lands. */
    imageAlt: 'A smiling member of the Marino team standing with his arms crossed',
  },
  projects: {
    heading: 'Some of our favourite branding projects',
    viewAll: { label: 'View all work', href: ROUTES.work },
    /* Spec §3.3: the shared order, filtered to Branding, first 8. Office
       Insight carries no Branding tag, so it never appears. */
    tag: 'Branding',
    limit: 8,
    regionLabel: 'Branding projects',
  },
  pillars: {
    label: 'Branding services',
    items: PILLARS,
    cta: { label: 'Contact Marino', href: ROUTES.contact },
  },
  why: {
    heading: 'Branding that\u2019s grounded in your commercial reality',
    /* Spec §3.5 asks for "Branding that's grounded / in your commercial
       reality" from 768px up. The spec's 11em wraps to three lines at 33px;
       12em sits inside the 11.73–12.66em window that gives the documented two
       lines. */
    headingMaxWidth: '12',
    body: 'A successful brand should make your business easier to trust and understand. Marino brand projects are shaped by the people who will be using the material across all manner of marketing campaigns. We build your identity with practical applications in mind rather than a simple presentation. Our work across all main marketing disciplines means we understand how branding decisions can affect your wider marketing ecosystem and aim to create an identity that feels familiar no matter where your audience encounters it.',
    cta: { label: 'Contact', href: ROUTES.contact },
    image: 'branding-why',
    /* TODO(asset): people around a table in front of a wall with a bee logo
       (16:9). Reuses the shared hero-team placeholder until the real
       branding-why.jpg lands. */
    imageAlt: 'The Marino team gathered around a table in front of a wall with a bee logo',
    form: {
      /* The live callback form has no visible heading. */
      fields: [
        { name: 'name', label: 'Name*', required: true },
        { name: 'phone', label: 'Phone*', type: 'tel', required: true },
        { name: 'email', label: 'Email', type: 'email' },
      ],
      submitLabel: 'Request Call Back',
      source: 'branding-callback',
    },
  },
  faq: {
    heading: 'Frequently asked questions',
    items: FAQ_ITEMS,
  },
}
