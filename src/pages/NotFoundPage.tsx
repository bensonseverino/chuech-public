import Container from '../components/primitives/Container'
import Button from '../components/primitives/Button'
import { ROUTES } from '../routes'
import { useMetaDescription, usePageTitle } from '../hooks/usePageTitle'

/**
 * Catch-all page (services spec §3): header + footer come from `RootLayout`;
 * this is a short message and a link home.
 */
export default function NotFoundPage() {
  usePageTitle('Page not found | Chuech Studio')
  useMetaDescription(
    'The page you were looking for could not be found. Return to the Chuech Studio homepage to keep exploring.',
  )

  return (
    <section className="flex min-h-[60vh] items-center py-[var(--space-80)]">
      <Container>
        <p className="text-[13px] font-medium tracking-wide text-obsidian/60 uppercase">Error 404</p>
        <h1 className="mt-4 text-[clamp(40px,8vw,90px)] leading-[1.05] font-semibold tracking-[-0.0163em] text-obsidian">
          Page not found
        </h1>
        <p className="mt-5 max-w-[46ch] text-[16px] leading-[1.5] text-obsidian/80">
          The page you&rsquo;re looking for doesn&rsquo;t exist yet. Head back to the homepage to
          keep exploring.
        </p>
        <div className="mt-8">
          <Button variant="mint" to={ROUTES.home}>
            Back to home
          </Button>
        </div>
      </Container>
    </section>
  )
}
