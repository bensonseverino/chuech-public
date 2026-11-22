import { useParams } from 'react-router'
import Container from '../components/primitives/Container'
import Button from '../components/primitives/Button'
import { Reveal } from '../components/ui/Reveal'
import { TransitionLink } from '../components/TransitionLink'
import Inline from '../content/live/inline'
import { useInsight } from '../content/live/posts'
import Seo from '../seo/Seo'
import JsonLd from '../seo/JsonLd'
import { article, breadcrumbs } from '../seo/structured-data'
import NotFoundPage from './NotFoundPage'

const slugify = (text: string) =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

type Block = { type: 'heading' | 'paragraph' | 'list'; text: string; items?: string[] }

/** Small renderer for the CMS body format: `##` headings, `-` list items,
 *  everything else a paragraph. Copy stays real HTML text. */
function parseBody(body: string): Block[] {
  const blocks: Block[] = []
  let list: string[] = []
  const flush = () => {
    if (list.length) {
      blocks.push({ type: 'list', text: '', items: list })
      list = []
    }
  }
  for (const line of body.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed) continue
    if (trimmed.startsWith('- ')) {
      list.push(trimmed.slice(2))
      continue
    }
    flush()
    if (trimmed.startsWith('## ')) blocks.push({ type: 'heading', text: trimmed.slice(3) })
    else blocks.push({ type: 'paragraph', text: trimmed })
  }
  flush()
  return blocks
}

/** `/insights/:slug` (SEO spec Step 7): published post template — one h1,
 *  author/date, summary, table of contents on long posts, body, related
 *  service links and a contact CTA. Drafts and unknown slugs render the 404. */
export default function InsightPage() {
  const { slug = '' } = useParams()
  const post = useInsight(slug)
  if (!post) return <NotFoundPage />

  const blocks = parseBody(post.body)
  const headings = blocks.filter((block) => block.type === 'heading')
  const path = `/insights/${post.slug}`
  const author = post.author || 'Chuech studio'

  return (
    <>
      <Seo
        path={path}
        title={post.seoTitle ?? post.title}
        description={post.seoDescription ?? post.excerpt}
        type="article"
      />
      <JsonLd
        data={[
          article({
            title: post.title,
            description: post.seoDescription ?? post.excerpt,
            image: post.image,
            publishedAt: post.publishedAt,
            author,
          }),
          breadcrumbs(path, post.title)!,
        ]}
      />
      <article className="py-[var(--space-50)] lg:py-[var(--space-80)]">
        <Container>
          <p className="text-[14px] font-medium tracking-wide text-obsidian/60 uppercase">
            {post.category || 'Insights'}
          </p>
          <h1 className="mt-4 text-[clamp(36px,6vw,64px)] leading-tight font-semibold tracking-[-0.02em] text-obsidian">
            {post.title}
          </h1>
          <p className="mt-4 text-[15px] text-obsidian/70">
            By {author}
            {post.publishedAt ? ` · ${post.publishedAt.slice(0, 10)}` : ''}
            {post.updatedAt ? ` · updated ${post.updatedAt.slice(0, 10)}` : ''}
          </p>
          <p className="mt-8 max-w-[880px] text-[clamp(19px,16px+0.6vw,24px)] leading-relaxed font-medium text-obsidian">
            {post.excerpt}
          </p>

          {headings.length > 3 ? (
            <nav aria-label="Table of contents" className="mt-10 border-y border-silver py-6">
              <h2 className="text-[18px] font-semibold text-obsidian">On this page</h2>
              <ul className="mt-3 grid gap-2">
                {headings.map((heading) => (
                  <li key={heading.text}>
                    <a className="underline" href={`#${slugify(heading.text)}`}>
                      {heading.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}

          <div className="mt-10 max-w-[880px]">
            {blocks.map((block, index) => {
              if (block.type === 'heading') {
                return (
                  <h2
                    key={index}
                    id={slugify(block.text)}
                    className="mt-10 mb-4 text-[clamp(24px,20px+0.8vw,34px)] font-semibold text-obsidian"
                  >
                    {block.text}
                  </h2>
                )
              }
              if (block.type === 'list') {
                return (
                  <ul key={index} className="mt-4 list-disc pl-6 leading-relaxed text-obsidian/85">
                    {block.items?.map((item) => (
                      <li key={item}>
                        <Inline text={item} />
                      </li>
                    ))}
                  </ul>
                )
              }
              return (
                <p key={index} className="mt-4 leading-relaxed text-obsidian/85">
                  <Inline text={block.text} />
                </p>
              )
            })}
          </div>

          <Reveal as="section" aria-label="Related services" className="mt-12 max-w-[880px]">
            <h2 className="text-[22px] font-semibold text-obsidian">Related services</h2>
            <ul className="mt-4 flex flex-wrap gap-4">
              {post.relatedService ? (
                <li>
                  <TransitionLink
                    to={post.relatedService}
                    className="text-obsidian underline underline-offset-4"
                  >
                    Read about the service this article covers
                  </TransitionLink>
                </li>
              ) : null}
              <li>
                <TransitionLink to="/insights" className="text-obsidian underline underline-offset-4">
                  More insights
                </TransitionLink>
              </li>
            </ul>
            <div className="mt-8">
              <Button variant="dark" to="/contact">
                Talk to Chuech studio
              </Button>
            </div>
          </Reveal>
        </Container>
      </article>
    </>
  )
}
