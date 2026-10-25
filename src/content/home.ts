/*
 * Home page content, typed (remaining-sections spec §8 step 4).
 * Copy adapted for Chuech Studio from the original reference site (marino.co.uk).
 * Assets referenced here are labelled local placeholders: TODO(asset).
 */
import { ROUTES } from '../routes'

export type RichSegment = string | { label: string; href: string }

/* ------------------------------------------------------------------ */
/* Routes                                                              */
/* ------------------------------------------------------------------ */
/* The canonical table lives in `src/routes.ts`; re-exported here so the
   existing `ROUTES` imports across the components keep working. */
export { ROUTES }

/* ------------------------------------------------------------------ */
/* 5.1 Intro statement                                                 */
/* ------------------------------------------------------------------ */

export const INTRO = {
  /** Button under the statement. */
  cta: { label: 'About Us', href: ROUTES.aboutUs },
} as const

/** Hero description, in the CMS inline grammar (bold runs). */
export const HERO_DESCRIPTION =
  'We design and build **purposeful websites** that make brands **clearer, stronger, and easier to choose**, backed by a team that cares about the details.'

/**
 * The Home intro statement. The highlights are applied to `text` when the CMS
 * API cannot be reached, so the local fallback renders exactly like the live
 * (CMS) version.
 */
export const INTRO_STATEMENT = {
  text:
    'Our team is made up of bold creatives, sharp strategists, and technical pros who care deeply about what they do. No egos, no fluff \u2013 just hard work, smart thinking, and a genuine commitment to our clients\u2019 success. We treat every brand and budget like it\u2019s our own, always deliver on promises, and never lock clients into contracts.',
  highlights: [
    'bold',
    'creatives,',
    'sharp strategists,',
    'technical pros',
    'genuine commitment',
    'clients\u2019 success.',
    'always deliver on promises,',
  ],
  cta: INTRO.cta,
} as const

/* ------------------------------------------------------------------ */
/* 5.2 Latest work                                                     */
/* ------------------------------------------------------------------ */

/* The project cards themselves now live in `content/projects.ts` so the Home
   panel and the `/work` grid share one source (work page spec §6). */
export const LATEST_WORK = {
  heading: 'Our latest work',
  intro:
    'Chuech Studio is a Nairobi based web design agency creating purposeful websites for brands that want to stand out and grow.',
  viewAll: { label: 'View all work', href: ROUTES.work },
} as const

/* ------------------------------------------------------------------ */
/* 5.3 Testimonials (quote slider inside the latest-work panel)        */
/* ------------------------------------------------------------------ */

export type Testimonial = {
  quote: string
  name: string
  company: string
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote: '“Absolutely fantastic team to work with!”',
    name: 'Atem Eyong',
    company: 'Hard Rock Cafe',
  },
  {
    quote: '“If you are looking for a superb, competent, and fast creative partner, this is it.”',
    name: 'Joe Weagraff',
    company: 'Hitachi',
  },
  {
    quote: '“The quality was excellent, and communication throughout was clear and professional. I highly recommend Chuech Studio.”',
    name: 'Abbie Booth',
    company: 'Istobal',
  },
  {
    quote: '“Chuech Studio helped us achieve the top position for ‘garden rooms’. I’m more than happy to recommend them and can provide a reference.”',
    name: 'Mike Jackson',
    company: 'Modern Garden Rooms',
  },
  {
    quote: '“We’ve worked with Chuech Studio for 5 years. Their digital marketing expertise has consistently driven awareness, interest, and leads.”',
    name: 'Adrian Lambert',
    company: 'Blackbird',
  },
  {
    quote: '“We’re thrilled with the SEO audit and implementations! It’s exciting to see our targeted keywords making their way to page one.”',
    name: 'Chris Cheadle',
    company: 'Northern Dough Co',
  },
]

/* ------------------------------------------------------------------ */
/* 5.4 Services (hover-reveal rows — marino-services-section §7)       */
/* ------------------------------------------------------------------ */

export const SERVICES_HEADING = 'Our Services'

/** A keyword chip; the object form renders as an inline link (services spec §5.1). */
export type Keyword = string | { label: string; href: string }

export type Service = {
  /** Route segment: `/${slug}/` matches the live route. */
  slug: string
  title: string
  description: string
  keywords: Keyword[]
  image: string
  /** object-position for the crop (faces in frame). */
  focus?: string
}

/* TODO(asset): service images — replace with the real service photos. */
export const SERVICES: Service[] = [
  {
    slug: 'branding',
    title: 'Branding',
    description:
      'Distinctive brands built with clarity, character, and lasting commercial impact.',
    keywords: ['Strategy', 'Design', 'Brand Guidelines', 'Tone of Voice', 'Repositioning'],
    image: 'service-branding',
    focus: '70% 25%',
  },
  {
    slug: 'web-design',
    title: 'Web Design',
    description:
      'Beautifully built websites designed to engage, convert, and perform at scale.',
    keywords: ['UX & UI Design', 'Conversion-Focused Design', 'Landing Pages', 'Website Development'],
    image: 'service-web-design',
    focus: '35% 25%',
  },
  {
    slug: 'seo-manchester',
    title: 'SEO',
    description:
      'SEO built for modern search – helping brands show up across Google, AI answers, and recommendations.',
    keywords: ['Technical SEO', 'On-Page SEO', 'Content Strategy', 'Local SEO', 'AI SEO', 'Digital PR', 'Link Building'],
    image: 'service-seo',
  },
  {
    slug: 'ppc-manchester',
    title: 'PPC',
    description:
      'Paid media managed with precision to deliver efficient growth and measurable returns.',
    keywords: ['Google Ads', 'Shopping Campaigns', 'Remarketing', 'Conversion Tracking', 'Display Advertising'],
    image: 'service-ppc',
  },
]

/* ------------------------------------------------------------------ */
/* 5.5 Stats band                                                      */
/* ------------------------------------------------------------------ */

export const TICKER_ITEMS = [
  'Digital experiences, thoughtfully made',
  'Purposeful websites, built to perform',
  'Brands made clearer and stronger',
  'Design with care, built for growth',
] as const

/** Screen-reader sentence for the ticker (duplicates are aria-hidden). */
export const TICKER_SR =
  'Digital experiences, thoughtfully made. Purposeful websites, built to perform. Brands made clearer and stronger. Design with care, built for growth.'

export const STATS_LINES = ['Thoughtful by design', 'Built for growth'] as const

/* ------------------------------------------------------------------ */
/* 5.6 Brief CTA                                                       */
/* ------------------------------------------------------------------ */

export const BRIEF_CTA = {
  text: 'Tell us what you\u2019re building',
  button: { label: 'Start a project', href: ROUTES.contact },
} as const

/* ------------------------------------------------------------------ */
/* 5.5 Experience section (marino-experience-section, replaces 5.5 + 5.6) */
/* ------------------------------------------------------------------ */

/** Giant marquee phrases, in order (experience spec §10). */
export const EXPERIENCE_MARQUEE = [
  'Digital experiences, thoughtfully made',
  'Purposeful websites, built to perform',
] as const

/** Floating pill labels; also the two legacy desktop display lines. */
export const EXPERIENCE_PILLS = ['Thoughtful by design', 'Built for growth'] as const

/** Screen-reader sentence: the stage itself is aria-hidden (experience spec §11). */
export const EXPERIENCE_SR =
  'Digital experiences, thoughtfully made. Purposeful websites, built to perform. Thoughtful by design. Built for growth.'

/* ------------------------------------------------------------------ */
/* 5.8 Case study                                                      */
/* ------------------------------------------------------------------ */

export const CASE_STUDY = {
  heading: 'Design that drives results',
  stat: '400%',
  statLabel: 'Revenue growth',
  blurb:
    'Blackbird, an AIM-listed SaaS developer, achieved 400% revenue growth and $3.9M ARR through brand, web, and inbound marketing, generating 1,000+ MQLs, $1.8M pipeline and 650% growth in web traffic.',
  cta: { label: 'View Work', href: ROUTES.work },
  testimonial: {
    quote:
      '“We\u2019ve worked with the team for 5 years. Their digital marketing expertise has consistently driven awareness, interest, and leads.”',
    name: 'Adrian Lambert',
    company: 'Blackbird',
  },
} as const

/* ------------------------------------------------------------------ */
/* 5.9 FAQ + founder block                                             */
/* ------------------------------------------------------------------ */

export const FAQ = {
  heading: 'Frequently asked questions',
  intro:
    'An independent web design studio in Nairobi, Kenya, building brands, websites, and marketing that improve the bottom line.',
} as const

export type FaqItem = {
  question: string
  answer: RichSegment[]
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'What services does Chuech Studio offer?',
    answer: [
      'Chuech Studio offers all manner of digital marketing services that, when integrated, help to sustainably grow a business\u2019s online presence. Our core services include paid and organic channels such as ',
      { label: 'PPC', href: ROUTES.ppc },
      ' and ',
      { label: 'SEO', href: ROUTES.seo },
      '. We can also undertake video campaigns and help businesses carve out a distinct identity with our ',
      { label: 'branding', href: ROUTES.branding },
      ' work. We like to combine all these channels into one integrated strategy so that they can support each other, which ultimately means businesses can generate strong visibility and measurable commercial growth.',
    ],
  },
  {
    question: 'How does Chuech Studio build marketing strategies?',
    answer: [
      'Every strategy starts by understanding your business, its goals, challenges, and how audiences in your industry behave online. We examine how your customers interact online before identifying which channels are most likely to influence their decisions. Once that\u2019s decided, we build campaigns around measurable commercial objectives and then refine them as more performance data becomes available.',
    ],
  },
  {
    question: 'What makes Chuech Studio different from other agencies?',
    answer: [
      'At Chuech Studio, we aren\u2019t interested in vanity metrics that make a lot of noise but don\u2019t increase your business revenue. Instead, we focus on commercially grounded marketing strategies that are built around outcomes which matter to your business. As well as that, you can expect transparent communication and collaboration from experts in all digital marketing channels. Clients working with Chuech Studio benefit from working with experienced marketers who understand how the core marketing channels \u2013 SEO, PPC, content, and web design \u2013 all influence each other.',
    ],
  },
  {
    question: 'Do you offer both SEO and PPC services?',
    answer: [
      'Yes. Chuech Studio offers comprehensive ',
      { label: 'SEO', href: ROUTES.seo },
      ' and ',
      { label: 'PPC', href: ROUTES.ppc },
      ' services either as standalone solutions or as part of wider integrated campaigns. SEO is the foundation that helps businesses build long-term organic search visibility, while PPC generates immediate exposure through targeted ads. A combination of both is often the most effective method for creating a strong digital presence while also capturing immediate demand.',
    ],
  },
  {
    question: 'Can Chuech Studio help improve lead generation?',
    answer: [
      'Absolutely. Our marketing strategies are all built around improving visibility among relevant audiences while encouraging users to take meaningful action, such as filling out an enquiry form or purchasing a product. We help businesses create more opportunities for enquiries, sales, and long-term growth by combining targeted traffic generation with messaging that convinces audiences to convert.',
    ],
  },
  {
    question: 'Can Chuech Studio support long-term business growth?',
    answer: [
      'Yes, our focus is on building sustainable marketing ecosystems that generate visibility that turns into leads and revenue over time. Rather than relying entirely on short-term tactics, our strategies evolve alongside your business and support long-term commercial objectives.',
    ],
  },
]

export const FOUNDER_BLOCK = {
  heading: 'Work directly with the Chuech Studio team',
  paragraphs: [
    [
      'Chuech Studio is an independent web design studio based in Nairobi, Kenya, with a focus on purposeful design and thoughtful digital experiences.',
    ],
    [
      'In essence, marketing activity should always support the business outcomes that create significant transformation rather than generate impressive-looking numbers on a dashboard.',
    ],
    [
      'We work directly with businesses that need a clear, considered digital presence. This could include a new website, a brand refresh, or guidance on how to prioritise what comes next. Clients work with our team on the strategy and design, and we bring in specialists where a project needs them.',
    ],
  ] as RichSegment[][],
  cta: { label: 'Start a conversation', href: ROUTES.contact },
} as const

/* ------------------------------------------------------------------ */
/* Client logo strip                                                   */
/* ------------------------------------------------------------------ */

/** Marquee order as seen in the reference (change spec §4). */
export const CLIENTS = [
  'emap',
  'WR Partners',
  'Hard Rock Cafe',
  'ISTOBAL',
  'LEONARDO Hotels',
  'HITACHI',
  'Haines Watts',
  'VISLINK',
  'AP NUT',
] as const

/* ------------------------------------------------------------------ */
/* 5.10 Footer                                                         */
/* ------------------------------------------------------------------ */

export const FOOTER = {
  statement: [
    'Chuech Studio is a Nairobi based web design agency helping brands grow with thoughtful, purposeful ',
    { label: 'Branding', href: ROUTES.branding },
    ', ',
    { label: 'Web Design', href: ROUTES.webDesign },
    ', ',
    { label: 'SEO', href: ROUTES.seo },
    ', ',
    { label: 'PPC', href: ROUTES.ppc },
    ', and ',
    'Video',
    '.',
  ] as RichSegment[],
  getInTouch: 'Get in Touch',
  email: { label: 'hello@chuechstudio.co.ke', href: 'mailto:hello@chuechstudio.co.ke' },
  phone: { label: '+254 117 954 929', href: 'tel:+254117954929' },
  address: 'Nairobi, Kenya',
  contact: { label: 'Contact', href: ROUTES.contact },
  links: [
    { label: 'Services', href: ROUTES.services },
    { label: 'Work', href: ROUTES.work },
    { label: 'About', href: ROUTES.aboutUs },
    { label: 'Culture', href: ROUTES.culture },
    { label: 'Testimonials', href: ROUTES.testimonials },
    { label: 'Privacy Policy', href: ROUTES.privacyPolicy },
    { label: 'Terms & Conditions', href: ROUTES.termsConditions },
  ],
  legal: '\u00a9 2026 Chuech Studio. All rights reserved.',
} as const
