import { useEffect } from 'react'
import { ScrollTrigger } from '@/lib/motion'

/**
 * Re-measure ScrollTriggers once a page's content dependency resolves
 * (smooth-scroll spec §10): CMS copy can change the page height after first
 * paint, which would otherwise leave triggers positioned against the fallback
 * layout. The provider's body ResizeObserver already covers size changes; this
 * is the explicit per-query refresh the spec asks for.
 *
 * Pass the page's content object — its identity changes exactly when the CMS
 * payload lands.
 */
export function useScrollRefresh(content: unknown) {
  useEffect(() => {
    ScrollTrigger.refresh()
  }, [content])
}
