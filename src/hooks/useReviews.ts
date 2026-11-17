import { useEffect, useState } from 'react'
import { fetchEnvelope } from '@/cms/content'

/**
 * Reviews hook (cms-forms-reviews-spec.md §12).
 *
 * Fetches visible reviews from the CMS with the same fallback-first pattern
 * as `useCms`: immediate hardcoded fallback, then live data on success.
 * No TanStack Query in this codebase — the `useCms` pattern is the convention.
 */
export interface Review {
  id: string
  quote: string
  author: string
  role?: string
  company?: string
  avatar?: string
  rating?: number
  source?: string
  sourceUrl?: string
  reviewedAt?: string
  featured: boolean
}

type ReviewOptions = {
  featured?: boolean
  limit?: number
}

const LOCAL_REVIEWS: Review[] = [
  { id: 'rev_atem-eyong', quote: 'Absolutely fantastic team to work with!', author: 'Atem Eyong', company: 'Hard Rock Cafe', featured: false },
  { id: 'rev_joe-weagraff', quote: 'If you are looking for a superb, competent, and fast creative partner, this is it.', author: 'Joe Weagraff', company: 'Hitachi', featured: false },
  { id: 'rev_abbie-booth', quote: 'The quality was excellent, and communication throughout was clear and professional. I highly recommend Chuech Studio.', author: 'Abbie Booth', company: 'Istobal', featured: false },
  { id: 'rev_mike-jackson', quote: "Chuech Studio helped us achieve the top position for \u2018garden rooms\u2019. I\u2019m more than happy to recommend them and can provide a reference.", author: 'Mike Jackson', company: 'Modern Garden Rooms', featured: false },
  { id: 'rev_adrian-lambert', quote: "We\u2019ve worked with the team for 5 years. Their digital marketing expertise has consistently driven awareness, interest, and leads.", author: 'Adrian Lambert', company: 'Blackbird', featured: false },
  { id: 'rev_chris-cheadle', quote: "We\u2019re thrilled with the SEO audit and implementations! It\u2019s exciting to see our targeted keywords making their way to page one.", author: 'Chris Cheadle', company: 'Northern Dough Co', featured: false },
  { id: 'rev_project_eventotron', quote: 'Marino really understood what we wanted Eventotron to become. They took the time to understand the platform, our audience and the personality behind the brand, then turned that into an identity and website that feels completely right for us. The new brand is bold, fun and distinctive, and we\u2019re really pleased with how everything has come together.', author: 'Holly', company: 'Eventotron', featured: false },
]

function apiPath(opts: ReviewOptions): string {
  const params = new URLSearchParams()
  if (opts.featured) params.set('featured', '1')
  if (opts.limit) params.set('limit', String(opts.limit))
  return `/api/public/reviews?${params.toString()}`
}

export function useReviews(opts: ReviewOptions = {}): { data: Review[]; version: number | null } {
  const [state, setState] = useState<{ data: Review[]; version: number | null }>({
    data: LOCAL_REVIEWS,
    version: null,
  })

  useEffect(() => {
    let cancelled = false
    void (async () => {
      const envelope = await fetchEnvelope<{ reviews: Review[]; nextCursor?: number }>(apiPath(opts))
      if (!cancelled && envelope) setState({ data: envelope.data.reviews, version: envelope.version })
    })()
    return () => {
      cancelled = true
    }
  }, [opts.featured, opts.limit])

  return state
}