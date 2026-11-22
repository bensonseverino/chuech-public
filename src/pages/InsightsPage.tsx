import PageHero from '../components/PageHero'
import Container from '../components/primitives/Container'
import { Reveal } from '../components/ui/Reveal'
import { TransitionLink } from '../components/TransitionLink'
import Inline from '../content/live/inline'
import { useInsights } from '../content/live/posts'
import { asset } from '../content/assets'
import Seo from '../seo/Seo'
import JsonLd from '../seo/JsonLd'
import { breadcrumbs } from '../seo/structured-data'

/** `/insights` (SEO spec Step 7): list of published posts. No posts are
 *  published until the CMS `posts` collection exists and the owner fills one.
 *  The layout reuses PageHero + the shared Container/Reveal primitives. */
export default function InsightsPage() {
  const posts = useInsights()

  return (
    <>
      <Seo path="/insights" />
      <JsonLd data={breadcrumbs('/insights')!} />
      <PageHero
        label="Insights"
        title="Practical notes on design, search and marketing"
        pills={['From our team', 'Kenya']}
        image={{ src: asset('services-hero') }}
        description={
          <Inline
            text="Short, useful guides from the Chuech studio team on websites, branding, SEO and paid advertising. Written for businesses in Kenya and beyond."
            reveal="load"
          />
        }
      />
      <Reveal
        as="section"
        aria-label="Articles"
        className="py-[var(--space-50)] lg:py-[var(--space-80)]"
      >
        <Container>
          <h2 className="clamp-h2 font-bold tracking-[-0.019em] text-obsidian">Latest insights</h2>
          {posts.length === 0 ? (
            <p className="mt-6 max-w-[720px] text-[17px] leading-relaxed text-obsidian/80">
              We are preparing our first articles. In the meantime, you can read about our
              services or see recent work. To ask us a question, email{' '}
              <a className="underline" href="mailto:hello@chuechstudio.co.ke">
                hello@chuechstudio.co.ke
              </a>
              .
            </p>
          ) : (
            <ul className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <li key={post.slug} className="min-w-0">
                  <article>
                    <h3 className="text-[22px] leading-tight font-semibold text-obsidian">
                      <TransitionLink to={`/insights/${post.slug}`} className="hover:underline">
                        {post.title}
                      </TransitionLink>
                    </h3>
                    <p className="mt-3 text-[16px] leading-relaxed text-obsidian/80">{post.excerpt}</p>
                    <p className="mt-3 text-[14px] text-obsidian/60">
                      {post.category}
                      {post.publishedAt ? ` · ${post.publishedAt.slice(0, 10)}` : ''}
                    </p>
                  </article>
                </li>
              ))}
            </ul>
          )}
        </Container>
      </Reveal>
    </>
  )
}
