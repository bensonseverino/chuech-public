/*
 * `/seo-manchester` content (same shape as `web-design.ts`, so the generic
 * `ServicePage` template renders it unchanged).
 *
 * The structure and service copy were adapted for Chuech Studio from the
 * original reference page https://marino.co.uk/seo-manchester/, keeping the
 * curly apostrophes.
 *
 * TODO(asset): the two photos are labelled local placeholders — the live page
 * uses `seo-middle-1200x990.jpg` (6:5, feature panel) and
 * `about-us-top-right-1200x675.jpg` (16:9, campaign panel). Both are decorative
 * on the live page (empty alt), so the slots keep an empty alt rather than
 * inventing a description of an image that is not in the workspace.
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
  source: 'seo-hero',
}

/* ------------------------------------------------------------------ */
/* Dark pillars panel                                                 */
/* ------------------------------------------------------------------ */

const PILLARS = [
  {
    title: 'Technical SEO',
    body: 'Technical SEO involves fixing and optimising a range of features that might not be visible to the customer, but can do real damage to your website and your bottom line if left to persist. Our SEO teams work in tandem with web designers to fix existing gaps and ensure a solid platform for future success.',
  },
  {
    title: 'Content Marketing',
    body: 'An SEO campaign is nothing without words. And at Chuech Studio, we take your website\u2019s words seriously. The compelling content we create, as well as attracting traffic from relevant audiences, encourages them to take action, be that inquiring or buying. Whatever content we create for you will fill your site with the persuasive buying signals needed in a busy market.',
  },
  {
    title: 'Authority Building',
    body: 'Being seen as trusted and authoritative is vital if you want the levels of online visibility that translate into revenue. We help you earn important third-party endorsements in the form of links and mentions through careful selection of targets and the creation of high-quality campaigns that industry publications and relevant sites can\u2019t help but be impressed by.',
  },
  {
    title: 'Local SEO',
    body: 'For many businesses, a lot of their audience will be on their doorstep, and local SEO campaigns for Nairobi businesses can help people get to know your organisation, whether they live in Westlands, Kilimani, or Karen. Whether it\u2019s through dedicated location pages or optimising Google Business Profiles, Chuech Studio\u2019s local SEO campaigns are always tied back to commercial outcomes.',
  },
  {
    title: 'Keyword Research',
    body: 'We carry out extensive research into your industry\u2019s search landscape to select terms that we can then target with engaging, relevant content. Behind each term is intent which we meet to ensure the highest chance of conversion. Targeting terms across the sales funnel, we make sure your brand is seen no matter where a customer is in the purchasing journey.',
  },
  {
    title: 'AI SEO',
    body: 'In recent years, AI search engines have transformed how people search and have meant businesses need to ensure their content not only targets terms but that it can be understood by ChatGPT, Perplexity, and Copilot. We\u2019ll help your business navigate this new evolution of search so that you feel the benefits, not the uncertainty, of it.',
  },
]

/* ------------------------------------------------------------------ */
/* FAQ — 16 questions, live order                                     */
/* ------------------------------------------------------------------ */

const FAQ_ITEMS: ServiceFaqItem[] = [
  {
    question: 'How long does SEO take to work?',
    answer: [
      'Every business version of SEO success will be different, but in general, this marketing channel is about long-term success while trying to find those more immediate wins along the way. Brands can expect to see an uptick in their sales or enquiries a few months after an SEO campaign has started.',
    ],
  },
  {
    question: 'What\u2019s included in your SEO services in Nairobi?',
    answer: [
      'Our Nairobi SEO services are the full package and include everything from initial audit to copywriting and monthly reporting. At Chuech Studio, we can take care of your entire organic performance campaign.',
    ],
  },
  {
    question: 'How do you prioritise SEO work?',
    answer: [
      'All our SEO work is prioritised based on the potential impact on your business to ensure that early work delivers meaningful improvements while still building a strong foundation for long-term growth.',
    ],
  },
  {
    question: 'Do you offer SEO audits as a standalone project?',
    answer: [
      'Yes, for businesses looking to get an accurate picture of what their current SEO looks like, our teams can carry out a thorough audit for you.',
    ],
  },
  {
    question: 'What makes your SEO approach different from other Nairobi agencies?',
    answer: [
      'With Chuech Studio, you\u2019ll always have complete visibility about what\u2019s being done, why it matters, and how it\u2019s going to contribute to your results. We focus on clarity and accountability from day one. We\u2019ll define and agree on a clear strategy based on your industry and competitors that is always tied back to commercial goals.',
    ],
  },
  {
    question: 'What actually makes SEO effective?',
    answer: [
      'Effective SEO is built on three core areas working together: technical foundations, content that matches search intent, and authority signals such as site links and mentions. Alongside three key tenets, your website needs to demonstrate experience, expertise, authority and trust (also known as E-E-A-T), which are all key factors in how search engines assess credibility.',
    ],
  },
  {
    question: 'How do you choose which keywords to target?',
    answer: [
      'When picking keywords, we prioritise intent over search volume alone. For instance, someone searching for \u201cSEO Agency Nairobi\u201d is likely looking to hire, whereas \u201cTechnical SEO Audit\u201d suggests a more informed user with a specific need. We build strategies that target terms across the funnel to capture users at different stages of their journey.',
    ],
  },
  {
    question: 'Does SEO work better alongside other marketing channels?',
    answer: [
      'Yes. SEO is at its most effective when it\u2019s aligned with your wider marketing initiatives, be that web design, PPC, or optimising your conversion rate. When these channels all work together, they amplify your business\u2019s performance, improving the overall return on investment.',
    ],
  },
  {
    question: 'What are Core Web Vitals and why do they matter?',
    answer: [
      'Core Web Vitals are a set of performance metrics used by Google to measure user experience, be that page speed, responsiveness, or visual stability. A high score indicates your site is healthy and will therefore be more competitive in search results.',
    ],
  },
  {
    question: 'Can you work with our in-house team or developer?',
    answer: ['Absolutely, all our SEO experts are used to working with in-house or fragmented teams.'],
  },
  {
    question: 'Do you provide local SEO for Nairobi?',
    answer: [
      'We are rooted in Nairobi and love helping our fellow local businesses succeed online.',
    ],
  },
  {
    question: 'Do SEO strategies differ for single-location vs multi-location businesses?',
    answer: [
      'Yes, they do. For instance, a business operating in one location may focus its entire website and digital presence on a given area, whereas those who operate in multiple regions or territories often require dedicated pages and strategies for each region.',
    ],
  },
  {
    question: 'Do you build links/do digital PR?',
    answer: ['Yes, link building and digital PR are two crucial elements of our SEO campaigns.'],
  },
  {
    question: 'Is link building still important for SEO?',
    answer: [
      'It does, but today, the quality of links matters far more than quantity. A small number of high-quality, relevant links from authoritative sites have far greater impact than hundreds of low-quality ones. At Chuech Studio, we focus on earning credible endorsements rather than using outdated, risky tactics.',
    ],
  },
  {
    question: 'How do you measure SEO success?',
    answer: [
      'We consult with you to discuss what success looks like so that all our work is geared toward that, rather than surface-level metrics which don\u2019t impact your revenue.',
    ],
  },
  {
    question: 'What does your SEO reporting include?',
    answer: [
      'Our reporting is centred around the stats and metrics that matter to your business. We connect activity to outcome and explain what\u2019s changed and what comes next rather than relying on vanity metrics.',
    ],
  },
]

/* ------------------------------------------------------------------ */
/* Page                                                               */
/* ------------------------------------------------------------------ */

export const SEO: ServicePageContent = {
  seo: {
    /* Chuech Studio page metadata. */
    title: 'SEO Nairobi | SEO Agency Nairobi | Chuech Studio',
    description:
      'Chuech Studio is a Nairobi SEO agency helping brands grow visibility across Google, AI answers, and search.',
  },
  hero: {
    label: 'SEO Nairobi',
    title: 'An SEO agency in Nairobi with impact',
    tags: ['Audits', 'Content', 'Technical', 'Link Building', 'AI', 'Digital PR'],
    intro:
      'The SEO services offered here at Chuech Studio are ideal for businesses looking for sustainable growth, not short-lived spikes. Through our tried and true strategies, which are created by some of the region\u2019s best SEO specialists, we help you generate qualified demand that brings in sustained online revenue.',
    form: HERO_FORM,
  },
  feature: {
    heading: 'SEO for Nairobi brands that move the commercial needle',
    lead: 'The search landscape across Nairobi is competitive, no matter what you\u2019re selling, which makes it all the more important that any brand looking to make an impact in their sector opts for a strategic approach that encompasses all facets of organic search.',
    checklist: [
      'Technical SEO',
      'Content Marketing',
      'Link Building',
      'Local SEO',
      'Core Web Vitals',
      'AI SEO',
    ],
    body: 'Our SEO services for Nairobi businesses encompass everything listed and come with well-defined expectations. And while you shouldn\u2019t expect organic search campaigns to transform your business overnight, you can expect them to be a predictable generator of leads when it\u2019s aligned with your website\u2019s conversion journey and other insights, which is exactly what our team does.',
    cta: { label: 'Contact', href: ROUTES.contact },
    image: 'seo-feature',
    imageAlt: '',
  },
  projects: {
    heading: 'Some of our favourite SEO projects',
    viewAll: { label: 'View all work', href: ROUTES.work },
    tag: 'SEO',
    /* The live page curates and orders these itself, and leads with Office
       Insight rather than the shared order's WR Partners. */
    slugs: ['office-insight', 'wr-partners', 'latakoo', 'vislink', 'portswigger', 'blackbird'],
    limit: 6,
    regionLabel: 'SEO projects',
  },
  pillars: {
    label: 'SEO services',
    items: PILLARS,
    cta: { label: 'Contact Chuech Studio', href: ROUTES.contact },
  },
  why: {
    heading: 'How we run your SEO campaigns',
    body: 'All the SEO work we do for your business is centred on your goals and priorities. We start by looking at your current digital presence and creating a prioritisation plan based on the data. We\u2019ll then address the immediate issues before putting in the foundations for long-term success, which will be different for every business. We don\u2019t stick to a rigid 5-step process like most agencies. Instead, our team prefers to operate against a rolling roadmap that can be adjusted should your business priorities change. We can also work alongside in-house teams if that\u2019s the sort of support your Nairobi business needs.',
    cta: { label: 'Contact', href: ROUTES.contact },
    image: 'seo-why',
    imageAlt: '',
    form: {
      /* The live callback form has no visible heading. */
      fields: [
        { name: 'name', label: 'Name*', required: true },
        { name: 'phone', label: 'Phone*', type: 'tel', required: true },
        { name: 'email', label: 'Email', type: 'email' },
      ],
      submitLabel: 'Request Call Back',
      source: 'seo-callback',
    },
  },
  faq: {
    heading: 'Frequently asked questions',
    items: FAQ_ITEMS,
  },
}
