import { useEffect } from 'react'

/**
 * Per-route page title (services spec §3.3). `react-helmet` is not installed,
 * so this 6-line hook sets `document.title` and restores nothing on unmount
 * (each route sets its own title).
 */
export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = title
  }, [title])
}
