/*
 * Insights seed outlines (SEO spec Step 7). These are DRAFTS — titles and
 * outlines only, no finished articles. They are never published on the site,
 * added to the sitemap or prerendered. The owner fills them in the CMS, where
 * the `posts` collection supplies status, dates, author, body and SEO fields.
 * TODO(owner): add the `posts` collection to the CMS and assign a real author
 * with a bio before publishing any article.
 */
export type PostView = {
  slug: string
  title: string
  excerpt: string
  /** Markdown-ish body: `##` headings + plain paragraphs. */
  body: string
  author: string
  category: string
  image?: string
  publishedAt: string
  updatedAt?: string
  seoTitle?: string
  seoDescription?: string
  relatedService?: string
  status: 'draft' | 'published'
}

export const DRAFT_POSTS: PostView[] = [
  {
    slug: 'how-much-does-a-website-cost-in-kenya',
    title: 'How much does a website cost in Kenya',
    excerpt: 'A plain guide to what shapes a website quote and how to compare proposals.',
    body: [
      '## What goes into a website quote',
      '- Number of pages and templates',
      '- Design and content work',
      '- Features such as booking, payments or a CMS',
      '## Questions to ask before you compare prices',
      '- What is included after launch?',
      '- Who owns the files and the domain?',
      '## How Chuech studio scopes a project',
      '- We start with a short call and a written scope.',
    ].join('\n'),
    author: '',
    category: 'Web design',
    publishedAt: '',
    relatedService: '/web-design',
    status: 'draft',
  },
  {
    slug: 'how-to-choose-a-web-design-agency',
    title: 'How to choose a web design agency',
    excerpt: 'What to look for in an agency, from process and portfolio to support after launch.',
    body: [
      '## Start with the work you can see',
      '- Look for relevant projects, not just pretty pictures',
      '## Ask how the project runs',
      '- Who writes the content?',
      '- What happens after launch?',
      '## Red flags in a proposal',
      '- Vague scope and no named contact',
    ].join('\n'),
    author: '',
    category: 'Web design',
    publishedAt: '',
    relatedService: '/web-design',
    status: 'draft',
  },
  {
    slug: 'seo-checklist-for-a-new-business-website',
    title: 'SEO checklist for a new business website',
    excerpt: 'The search basics to settle before a new site goes live.',
    body: [
      '## Before launch',
      '- One clear topic per page',
      '- Titles, descriptions and a sensible URL structure',
      '## After launch',
      '- Submit the sitemap and check indexing',
      '- Write answers to the questions customers ask',
    ].join('\n'),
    author: '',
    category: 'SEO',
    publishedAt: '',
    relatedService: '/seo-manchester',
    status: 'draft',
  },
  {
    slug: 'social-media-marketing-plan-for-a-small-business',
    title: 'Social media marketing plan for a small business',
    excerpt: 'A simple way to choose channels, plan posts and measure what works.',
    body: [
      '## Choose two channels first',
      '- Go where your customers already are',
      '## Build a small, repeatable plan',
      '- A weekly theme and a simple content mix',
      '## Review the numbers',
      '- Track saves, enquiries and sales, not just likes',
    ].join('\n'),
    author: '',
    category: 'Marketing',
    publishedAt: '',
    status: 'draft',
  },
  {
    slug: 'google-ads-vs-seo-where-to-spend-first',
    title: 'Google Ads vs SEO: where to spend first',
    excerpt: 'How to decide between paid visibility and long-term search work.',
    body: [
      '## What paid search gives you',
      '- Fast visibility and clear cost per enquiry',
      '## What SEO gives you',
      '- Traffic that keeps coming after the work is done',
      '## A sensible order',
      '- Fix the site first, then test paid, then invest in content',
    ].join('\n'),
    author: '',
    category: 'PPC',
    publishedAt: '',
    relatedService: '/ppc',
    status: 'draft',
  },
  {
    slug: 'what-to-put-on-a-business-website-homepage',
    title: 'What to put on a business website homepage',
    excerpt: 'The few things every homepage needs so visitors know what to do next.',
    body: [
      '## Say what you do, plainly',
      '- One sentence near the top',
      '## Show proof',
      '- Work, clients or a short customer quote',
      '## Make the next step obvious',
      '- One clear contact action',
    ].join('\n'),
    author: '',
    category: 'Web design',
    publishedAt: '',
    relatedService: '/web-design',
    status: 'draft',
  },
]

/** Published posts only. CMS data replaces this list when the posts endpoint
 *  exists; drafts above stay invisible until the owner publishes them. */
export function publishedPosts(cmsPosts?: PostView[] | null): PostView[] {
  const source = Array.isArray(cmsPosts) && cmsPosts.length ? cmsPosts : DRAFT_POSTS
  return source.filter((post) => post.status === 'published' && post.slug && post.title)
}
