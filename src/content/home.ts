/*
 * Home page content, typed (remaining-sections spec §8 step 4).
 * All COPY below was transcribed from the live page (marino.co.uk).
 * Assets referenced here are labelled local placeholders: TODO(asset).
 */

export type RichSegment = string | { label: string; href: string }

/* ------------------------------------------------------------------ */
/* Routes                                                              */
/* ------------------------------------------------------------------ */

export const ROUTES = {
  home: '/',
  branding: '/branding/',
  webDesign: '/web-design/',
  seo: '/seo-manchester/',
  aiSeo: '/ai-seo/',
  ppc: '/ppc-manchester/',
  video: '/video-production/',
  services: '/services/',
  work: '/work/',
  aboutUs: '/about-us/',
  culture: '/culture/',
  blog: '/blog/',
  testimonials: '/testimonials/',
  contact: '/contact/',
  seoConsultant: '/seo-consultant/',
  privacyPolicy: '/privacy-policy/',
  termsConditions: '/terms-conditions/',
} as const

/* ------------------------------------------------------------------ */
/* 5.1 Intro statement                                                 */
/* ------------------------------------------------------------------ */

export const INTRO = {
  /** Button under the statement. */
  cta: { label: 'About Us', href: ROUTES.aboutUs },
} as const

/* ------------------------------------------------------------------ */
/* 5.2 Latest work                                                     */
/* ------------------------------------------------------------------ */

export const LATEST_WORK = {
  heading: 'Our latest work',
  intro:
    'Marino is a Manchester based digital marketing agency built for brands that want serious growth.',
  viewAll: { label: 'View all work', href: ROUTES.work },
} as const

/** Which column a card sits in at md+ (DOM order is right column first). */
export type WorkColumn = 'left' | 'right'

export type WorkProject = {
  /** Route segment: `/work/${slug}/` matches the live route. */
  slug: string
  title: string
  column: WorkColumn
  tags: string[]
  image: string
  /** object-position for the crop. */
  focus?: string
}

/* TODO(asset): work card photos — replace each slot with the real image. */
export const WORK_PROJECTS: WorkProject[] = [
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
]

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
    quote: '“The quality was excellent, and communication throughout was clear and professional. I highly recommend Marino.”',
    name: 'Abbie Booth',
    company: 'Istobal',
  },
  {
    quote: '“Marino helped us achieve the top position for ‘garden rooms’. I’m more than happy to recommend them and can provide a reference.”',
    name: 'Mike Jackson',
    company: 'Modern Garden Rooms',
  },
  {
    quote: '“We’ve worked with Marino for 5 years. Their digital marketing expertise has consistently driven awareness, interest, and leads.”',
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

export type Service = {
  /** Route segment: `/${slug}/` matches the live route. */
  slug: string
  title: string
  description: string
  keywords: string[]
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
  {
    slug: 'video-production',
    title: 'Video',
    description:
      'Cinematic video content created to elevate brands and move audiences to action.',
    keywords: ['Brand Videos', 'Testimonial Videos', 'Event Videos', 'Social Content', 'Product Videos'],
    image: 'service-video',
  },
]

/* ------------------------------------------------------------------ */
/* 5.5 Stats band                                                      */
/* ------------------------------------------------------------------ */

export const TICKER_ITEMS = [
  '100 verified 5 star reviews',
  'Clients in 30 countries',
  'Decade of experience',
  'Generated £100 million in revenue',
] as const

/** Screen-reader sentence for the ticker (duplicates are aria-hidden). */
export const TICKER_SR = '100 verified 5 star reviews. Clients in 30 countries. A decade of experience. £100 million in revenue generated.'

export const STATS_LINES = ['Decades of experience', 'Clients in 30 countries'] as const

/* ------------------------------------------------------------------ */
/* 5.6 Brief CTA                                                       */
/* ------------------------------------------------------------------ */

export const BRIEF_CTA = {
  text: 'Send us a brief and we\u2019ll talk',
  button: { label: 'Contact Us', href: ROUTES.contact },
} as const

/* ------------------------------------------------------------------ */
/* 5.5 Experience section (marino-experience-section, replaces 5.5 + 5.6) */
/* ------------------------------------------------------------------ */

/** Giant marquee phrases, in order (experience spec §10). */
export const EXPERIENCE_MARQUEE = [
  '100 verified 5 star reviews',
  'Generated £100 million in revenue',
] as const

/** Floating pill labels; also the two legacy desktop display lines. */
export const EXPERIENCE_PILLS = ['Decades of experience', 'Clients in 30 countries'] as const

/** Screen-reader sentence: the stage itself is aria-hidden (experience spec §11). */
export const EXPERIENCE_SR =
  '100 verified 5 star reviews. Generated £100 million in revenue. Decades of experience. Clients in 30 countries.'

/* ------------------------------------------------------------------ */
/* 5.7 Insights                                                        */
/* ------------------------------------------------------------------ */

export const INSIGHTS = {
  heading: 'What\u2019s happening?',
  viewAll: { label: 'View all articles', href: ROUTES.blog },
} as const

export type InsightArticle = {
  title: string
  /** Live format: 'Month . Year'. */
  dateLabel: string
  href: string
  excerpt: string
  categories: string[]
  image: string
}

/* TODO(asset): article thumbnails — replace with the real card images. */
export const ARTICLES: InsightArticle[] = [
  {
    title: 'Marino appointed as SEO agency for MUSE',
    dateLabel: 'July . 2026',
    href: '/seo/marino-appointed-as-seo-agency-for-muse/',
    excerpt:
      'We\u2019re excited to announce that Marino has been appointed as the SEO agency for MUSE, the global talent and creative agency.',
    categories: ['SEO'],
    image: 'article-ph',
  },
  {
    title: 'What Vislink\u2019s progress says about getting the foundations right',
    dateLabel: 'July . 2026',
    href: '/branding/what-vislinks-progress-says-about-getting-the-foundations-right/',
    excerpt:
      'Seeing Mickey share Vislink\u2019s latest numbers is a great moment and they are the kind of numbers worth paying attention to.',
    categories: ['Branding', 'Web Design', 'SEO', 'PPC', 'Video'],
    image: 'article-ph',
  },
  {
    title: 'From £3m to £17m: the digital side of BBS Law\u2019s growth',
    dateLabel: 'June . 2026',
    href: '/seo/from-3m-to-17m-the-digital-side-of-bbs-laws-growth/',
    excerpt: 'Seeing BBS Law\u2019s growth story picked up by Legal Futures is great to see.',
    categories: ['Web Design', 'SEO', 'PPC'],
    image: 'article-ph',
  },
  {
    title: 'What A1S proves about long-term SEO',
    dateLabel: 'May . 2026',
    href: '/seo/what-a1s-proves-about-long-term-seo/',
    excerpt:
      'Big congratulations to the A1S team on the acquisition by Bergman & Beving. It is a brilliant result, and a well-earned one.',
    categories: ['Web Design', 'SEO', 'PPC'],
    image: 'article-ph',
  },
]

/* ------------------------------------------------------------------ */
/* 5.8 Case study                                                      */
/* ------------------------------------------------------------------ */

export const CASE_STUDY = {
  heading: 'Marino: The results driven agency',
  stat: '400%',
  statLabel: 'Revenue growth',
  blurb:
    'Blackbird, an AIM-listed SaaS developer, achieved 400% revenue growth and $3.9M ARR through brand, web, and inbound marketing, generating 1,000+ MQLs, $1.8M pipeline and 650% growth in web traffic.',
  cta: { label: 'View Work', href: ROUTES.work },
  testimonial: {
    quote:
      '“We\u2019ve worked with Marino for 5 years. Their digital marketing expertise has consistently driven awareness, interest, and leads.”',
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
    'An independent agency in Manchester, founded in 2015, building brands, websites, and marketing that improve the bottom line.',
} as const

export type FaqItem = {
  question: string
  answer: RichSegment[]
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'What digital marketing services does Marino offer?',
    answer: [
      'Marino offers all manner of digital marketing services that, when integrated, help to sustainably grow a business\u2019s online presence. Our core services include paid and organic channels such as ',
      { label: 'PPC', href: ROUTES.ppc },
      ' and ',
      { label: 'SEO', href: ROUTES.seo },
      '. We can also undertake ',
      { label: 'video', href: ROUTES.video },
      ' campaigns and help businesses carve out a distinct identity with our ',
      { label: 'branding', href: ROUTES.branding },
      ' work. We like to combine all these channels into one integrated strategy so that they can support each other, which ultimately means businesses can generate strong visibility and measurable commercial growth.',
    ],
  },
  {
    question: 'How does Marino build marketing strategies?',
    answer: [
      'Every strategy starts by understanding your business, its goals, challenges, and how audiences in your industry behave online. We examine how your customers interact online before identifying which channels are most likely to influence their decisions. Once that\u2019s decided, we build campaigns around measurable commercial objectives and then refine them as more performance data becomes available.',
    ],
  },
  {
    question: 'What makes Marino different from other agencies?',
    answer: [
      'At Marino, we aren\u2019t interested in vanity metrics that make a lot of noise but don\u2019t increase your business revenue. Instead, we focus on commercially grounded marketing strategies that are built around outcomes which matter to your business. As well as that, you can expect transparent communication and collaboration from experts in all digital marketing channels. Clients working with Marino benefit from working with experienced marketers who understand how the core marketing channels \u2013 SEO, PPC, content, and web design \u2013 all influence each other.',
    ],
  },
  {
    question: 'Do you offer both SEO and PPC services?',
    answer: [
      'Yes. Marino offers comprehensive ',
      { label: 'SEO', href: ROUTES.seo },
      ' and ',
      { label: 'PPC', href: ROUTES.ppc },
      ' services either as standalone solutions or as part of wider integrated campaigns. SEO is the foundation that helps businesses build long-term organic search visibility, while PPC generates immediate exposure through targeted ads. A combination of both is often the most effective method for creating a strong digital presence while also capturing immediate demand.',
    ],
  },
  {
    question: 'Can Marino help improve lead generation?',
    answer: [
      'Absolutely. Our marketing strategies are all built around improving visibility among relevant audiences while encouraging users to take meaningful action, such as filling out an enquiry form or purchasing a product. We help businesses create more opportunities for enquiries, sales, and long-term growth by combining targeted traffic generation with messaging that convinces audiences to convert.',
    ],
  },
  {
    question: 'Can Marino support long-term business growth?',
    answer: [
      'Yes, our focus is on building sustainable marketing ecosystems that generate visibility that turns into leads and revenue over time. Rather than relying entirely on short-term tactics, our strategies evolve alongside your business and support long-term commercial objectives.',
    ],
  },
]

export const FOUNDER_BLOCK = {
  heading: 'Work directly with Marino founder Toni Marino',
  paragraphs: [
    [
      'Marino was founded by Toni Marino, an ',
      { label: 'SEO consultant', href: ROUTES.seoConsultant },
      ' with over 15 years of experience helping businesses improve their online visibility. His commercially focused approach continues to shape how he and the wider agency works today.',
    ],
    [
      'In essence, marketing activity should always support the business outcomes that create significant transformation rather than generate impressive-looking numbers on a dashboard.',
    ],
    [
      'Toni works directly with businesses who need senior SEO guidance. This could include diagnosing a ranking decline, reviewing an existing strategy, or helping an internal team simply decide what to prioritise next. Clients work with Toni on the diagnosis and the strategy but should ongoing implementation be required, the wider Marino team of specialists can be brought onboard.',
    ],
  ] as RichSegment[][],
  cta: { label: 'Work directly with Toni', href: ROUTES.seoConsultant },
} as const

/* ------------------------------------------------------------------ */
/* 5.10 Footer                                                         */
/* ------------------------------------------------------------------ */

export const FOOTER = {
  statement: [
    'Marino is a Manchester based digital marketing agency helping brands grow with smart, results-focused ',
    { label: 'Branding', href: ROUTES.branding },
    ', ',
    { label: 'Web Design', href: ROUTES.webDesign },
    ', ',
    { label: 'SEO', href: ROUTES.seo },
    ', ',
    { label: 'PPC', href: ROUTES.ppc },
    ', and ',
    { label: 'Video', href: ROUTES.video },
    '.',
  ] as RichSegment[],
  getInTouch: 'Get in Touch',
  email: { label: 'hello@marino.co.uk', href: 'mailto:hello@marino.co.uk' },
  phone: { label: '0161 660 6263', href: 'tel:01616606263' },
  address: '1 St Peter\u2019s Sq, Manchester, M2 3DE',
  contact: { label: 'Contact', href: ROUTES.contact },
  links: [
    { label: 'Services', href: ROUTES.services },
    { label: 'Work', href: ROUTES.work },
    { label: 'About', href: ROUTES.aboutUs },
    { label: 'Culture', href: ROUTES.culture },
    { label: 'Blog', href: ROUTES.blog },
    { label: 'Testimonials', href: ROUTES.testimonials },
    { label: 'Privacy Policy', href: ROUTES.privacyPolicy },
    { label: 'Terms & Conditions', href: ROUTES.termsConditions },
  ],
  legal: 'Reg No. 11701108. Vat No. 371580590.',
} as const
