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

/**
 * Per-route meta description (web-design spec §3). Updates the tag in
 * `index.html` when there is one and creates it otherwise.
 */
export function useMetaDescription(description: string) {
  useEffect(() => {
    let tag = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (!tag) {
      tag = document.createElement('meta')
      tag.name = 'description'
      document.head.appendChild(tag)
    }
    tag.content = description
  }, [description])
}
