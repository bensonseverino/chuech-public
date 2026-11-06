import PageHero from '@/components/PageHero'
import { asset } from '@/content/assets'
import { about, ABOUT_IMAGES } from '@/data/about'

/**
 * About page hero (about spec §4.1). Reuses the shared `PageHero` grid: the
 * breadcrumb badge, the page's one `<h1>`, the two floating mint pills, the
 * small 16:9 image and the email + phone line are all its existing layout —
 * only the copy differs.
 */
export default function AboutHero() {
  const { heading, intro, email, phone } = about

  // PageHero maps Pill A to the top-right cluster (above the image at md+, the
  // h1's top edge on mobile) and Pill B beside the intro paragraph — exactly the
  // spec's "Proudly from…" and "Est…" placements.
  const pills: [string, string] = [about.heroPills.top, about.heroPills.left]

  return (
    <PageHero
      label={about.breadcrumb}
      title={heading}
      pills={pills}
      /* TODO: replace with the real Chuech studio photo (about spec §3). */
      image={{ src: asset(ABOUT_IMAGES.hero.src), alt: ABOUT_IMAGES.hero.alt }}
      description={intro}
      contact={{
        email: { label: email, href: `mailto:${email}` },
        phone: { label: phone, href: `tel:${phone.replace(/\s/g, '')}` },
      }}
      /* Mobile keeps the image (full width below the intro — spec §4.1). */
      showImageOnMobile
      pillAAnchor="above"
    />
  )
}