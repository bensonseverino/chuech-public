/*
 * Per-page head metadata (SEO spec Step 3). React 19 hoists <title>, <meta>
 * and <link rel="canonical"> rendered inside a component into <head>, so no
 * Helmet dependency and no imperative DOM mutation is needed. The route table
 * supplies the baseline; pages can pass CMS-derived values as overrides.
 */
import { SITE } from './site'
import { getSeoRoute } from './routes'

type SeoProps = {
  path: string
  title?: string
  description?: string
  image?: string
  type?: 'website' | 'article'
  noindex?: boolean
}

export default function Seo({
  path,
  title,
  description,
  image,
  type = 'website',
  noindex = false,
}: SeoProps) {
  const route = getSeoRoute(path)
  const pageTitle = title ?? route?.title ?? SITE.name
  const pageDescription = description ?? route?.description ?? SITE.description
  const canonicalPath = path === '/' ? '' : path.replace(/\/+$/, '')
  const pageUrl = `${SITE.url}${canonicalPath}`
  const ogImage = image ?? SITE.ogImage

  return (
    <>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      {!noindex && <link rel="canonical" href={pageUrl} />}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={SITE.name} />
      <meta property="og:locale" content={SITE.locale} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={ogImage} />
      <meta
        name="robots"
        content={
          noindex
            ? 'noindex,nofollow'
            : 'index,follow,max-image-preview:large,max-snippet:-1'
        }
      />
    </>
  )
}
