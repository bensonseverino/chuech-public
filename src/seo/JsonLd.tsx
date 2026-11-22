/*
 * Renders schema.org JSON-LD (SEO spec Step 4). Arrays become one @graph so a
 * page can describe several entities (e.g. Service + BreadcrumbList) in a
 * single script. `<` is escaped so JSON content can never close the script tag.
 */
type JsonValue = Record<string, unknown>

export default function JsonLd({ data }: { data: JsonValue | JsonValue[] }) {
  const payload: JsonValue = Array.isArray(data)
    ? { '@context': 'https://schema.org', '@graph': data }
    : { '@context': 'https://schema.org', ...data }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload).replace(/</g, '\\u003c') }}
    />
  )
}
