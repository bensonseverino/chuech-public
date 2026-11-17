/*
 * The bundled fallback case study (cms-projects-spec.md §9.11): when the API is
 * unreachable, `/work/eventotron` still renders from this copy of the seed
 * content instead of a 404 or an error state. This is the ONLY project with a
 * bundled fallback — every other slug gets the site's 404 page.
 */
import { asset } from './assets'
import type { ProjectDetailData } from '../cms/projects'

function slotImage(slot: string, alt: string, width = 1600, height = 900) {
  return {
    url: asset(slot),
    srcSet: '',
    width,
    height,
    alt,
    focalX: 50,
    focalY: 50,
  }
}

export const EVENTOTRON_FALLBACK: ProjectDetailData = {
  id: 'fallback-eventotron',
  slug: 'eventotron',
  title: 'Eventotron',
  image: slotImage('work-eventotron', 'Eventotron branding'),
  categories: [{ slug: 'branding', label: 'Branding' }],
  hero: {
    type: 'image',
    image: slotImage('work-eventotron', 'Eventotron branding'),
    lead: 'A bold new brand and website for the platform powering live events.',
    body: 'Eventotron helps festivals, venues, producers and promoters simplify the work behind the scenes – bringing event registration, artist communication, ticketing, payments and settlements into one place.',
  },
  introHtml:
    '<p>We created a <mark data-highlight>new identity</mark> designed to feel as <mark data-highlight>energetic and creative</mark> as the industry itself. At the centre of the brand is the <mark data-highlight>raised ‘O’</mark> – a simple visual device representing <mark data-highlight>movement, momentum and events</mark> that stand out.</p>',
  feature: {
    heading: 'Get Your Event On',
    text: 'The idea was carried through a bold typographic style, bright colour palette and the new “Get Your Event On” strapline, before being brought to life across a completely new website.',
    image: slotImage('work-eventotron', 'The Eventotron logo lockup on yellow'),
  },
  gallery: [
    slotImage('work-eventotron', 'Lavender “IT’S ON” card'),
    slotImage('work-eventotron', 'Black colour-palette card'),
    slotImage('work-eventotron', 'Orange “60,000” stat card'),
    slotImage('work-eventotron', '“Get Your Event On” photo'),
    slotImage('work-eventotron', 'Collage grid'),
    slotImage('work-eventotron', 'Yellow logo lockup variant'),
  ],
  testimonial: {
    quote:
      'Marino really understood what we wanted Eventotron to become. They took the time to understand the platform, our audience and the personality behind the brand, then turned that into an identity and website that feels completely right for us. The new brand is bold, fun and distinctive, and we’re really pleased with how everything has come together.',
    author: 'Holly',
    company: 'Eventotron',
  },
  related: [],
  seo: {
    title: 'Eventotron | Chuech Studio',
    description:
      'A bold new brand and website for the platform powering live events.',
  },
  publishedAt: '1970-01-01T00:00:00.000Z',
}
