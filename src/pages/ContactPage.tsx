import { usePageTitle, useMetaDescription } from '@/hooks/usePageTitle'
import { useHeroLoad } from '@/hooks/useHeroLoad'
import { contact } from '@/data/contact'
import ContactMap from '@/components/ContactMap'
import ContactPageForm from '@/components/ContactPageForm'
import Container from '@/components/primitives/Container'
import HighlightReveal from '@/components/ui/HighlightReveal'

const TEL_HREF = `tel:${contact.phone.replace(/\s/g, '')}`
const MAIL_HREF = `mailto:${contact.email}`

const DETAIL_LINK =
  'text-white underline decoration-white/60 underline-offset-[0.15em] transition-colors hover:text-primary hover:decoration-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary'

/**
 * `/contact` (contact spec §2–§5): giant "Let's Talk" hero, contact details, the
 * dark enquiry form and a full-bleed map. The header, footer, transition
 * revealer and Lenis stack all come from `RootLayout`, exactly as on every
 * other route.
 */
export default function ContactPage() {
  usePageTitle('Contact | Chuech studio')
  useMetaDescription('Get in touch with Chuech studio for a free consultation.')

  // Hero content is visible at scroll position 0, so it enters on load rather
  // than waiting for a scroll that may never happen (smooth-scroll §7).
  const heroRef = useHeroLoad<HTMLElement>()

  return (
    <>
      <section
        ref={heroRef}
        aria-labelledby="contact-heading"
        className="bg-obsidian pb-16 text-white sm:pb-20 lg:pb-24"
      >
        <Container className="pt-10 sm:pt-16 lg:pt-24">
          <div data-hero-block>
            <h1
              id="contact-heading"
              className="text-center text-[5rem] leading-[0.9] font-bold tracking-[-0.04em] text-white sm:text-[7rem] lg:text-[clamp(10rem,13vw,15.5rem)]"
            >
              {contact.heading}
            </h1>
          </div>

          <p
            data-hero-block
            className="mx-auto mt-6 max-w-[68rem] text-center text-[1.5rem] leading-[1.35] font-medium text-white sm:mt-8 sm:text-[1.35rem] lg:mt-12 lg:text-[1.75rem]"
          >
            {contact.subline.before}{' '}
            <HighlightReveal
              mode="load"
              className="rounded-pill bg-secondary px-[0.4em] py-[0.08em] whitespace-nowrap text-obsidian [box-decoration-break:clone]"
            >
              {contact.subline.highlight}
            </HighlightReveal>
          </p>

          <div
            data-hero-block
            className="mx-auto mt-10 flex flex-col items-center gap-3 text-center text-[1.5rem] leading-[1.3] sm:mt-12 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-5 sm:text-[1.25rem] lg:mt-16 lg:text-[1.75rem]"
          >
            <a href={MAIL_HREF} className={DETAIL_LINK}>
              {contact.email}
            </a>
            <a href={TEL_HREF} className={DETAIL_LINK}>
              {contact.phone}
            </a>
            <p className="text-white">{contact.address}</p>
          </div>
        </Container>

        <div className="mx-auto mt-12 w-full max-w-[1350px] px-8 sm:px-6 lg:mt-20 lg:w-[calc(var(--u)*70.56)] lg:max-w-none lg:px-0">
          <ContactPageForm />
        </div>
      </section>

      <ContactMap />
    </>
  )
}
