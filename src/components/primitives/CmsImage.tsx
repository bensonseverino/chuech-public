import type { ImageAsset } from '../../cms/projects'

type CmsImageProps = {
  asset: ImageAsset
  /** Optional art-directed crop, used below 768px (cms-projects-spec.md §6). */
  mobile?: ImageAsset
  /** The responsive `sizes` hint for this slot. */
  sizes: string
  /** The hero is eager/high priority; everything else lazy (§6). */
  loading?: 'eager' | 'lazy'
  className?: string
}

/**
 * The one `<img>` the CMS-driven pages render (cms-projects-spec.md §6):
 * `srcSet` from the uploaded WebP variants, `width`/`height` from the API so
 * nothing shifts, `object-position` from the focal point, lazy + async by
 * default, and an optional art-directed mobile crop via `<picture>`.
 */
export default function CmsImage({
  asset,
  mobile,
  sizes,
  loading = 'lazy',
  className = '',
}: CmsImageProps) {
  const style = { objectPosition: `${asset.focalX}% ${asset.focalY}%` }

  const img = (source: ImageAsset) => (
    <img
      src={source.url}
      srcSet={source.srcSet || undefined}
      sizes={sizes}
      width={source.width || undefined}
      height={source.height || undefined}
      alt={source.alt}
      loading={loading}
      decoding="async"
      fetchPriority={loading === 'eager' ? 'high' : undefined}
      style={style}
      className={`h-full w-full object-cover ${className}`}
    />
  )

  if (mobile) {
    return (
      <picture>
        <source
          media="(max-width: 767px)"
          srcSet={mobile.srcSet || mobile.url}
          sizes={sizes}
        />
        {img(asset)}
      </picture>
    )
  }

  return img(asset)
}
