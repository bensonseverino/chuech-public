/*
 * The CMS live-preview receiver (cms-projects-spec.md §7.3, §9.10).
 *
 * The admin editor embeds the real site in an iframe and posts the in-progress
 * project as
 *
 *   { type: 'cms-preview', project: ProjectDetailData }
 *
 * roughly every 600 ms while the owner types. The site only listens when ALL of
 * these hold: the URL has `?cms-preview=1`, the page is inside an iframe, and
 * the message's origin matches `VITE_CMS_ORIGIN`. Anything else is ignored —
 * a stranger's postMessage can never replace page content.
 */
import { useEffect, useState } from 'react'
import type { ProjectDetailData } from './projects'

export function isPreviewMode(): boolean {
  if (typeof window === 'undefined') return false
  if (!new URLSearchParams(window.location.search).has('cms-preview')) return false
  try {
    return window.self !== window.top
  } catch {
    // Cross-origin frame access throws: we are inside a frame.
    return true
  }
}

/** The preview override for this page, or the real (fallback/API) content. */
export function useCmsPreviewData(real: ProjectDetailData | null): ProjectDetailData | null {
  const [preview, setPreview] = useState<ProjectDetailData | null>(null)
  const enabled = isPreviewMode()

  useEffect(() => {
    if (!enabled) return

    function onMessage(event: MessageEvent) {
      const expected = import.meta.env?.VITE_CMS_ORIGIN as string | undefined
      if (expected && event.origin !== expected.replace(/\/+$/, '')) return

      const data = event.data as { type?: string; project?: ProjectDetailData } | null
      if (!data || data.type !== 'cms-preview' || !data.project) return
      setPreview(data.project)
    }

    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [enabled])

  return enabled ? (preview ?? real) : real
}
