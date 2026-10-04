/*
 * Asset slots (remaining-sections spec §2.4). Every entry is a labelled local
 * placeholder: TODO(asset) — swap the file for the real one, same slot name.
 */
import workPh from '../assets/marino/work-ph.svg'
import articlePh from '../assets/marino/article-ph.svg'
import serviceBranding from '../assets/marino/service-branding.svg'
import serviceWebDesign from '../assets/marino/service-web-design.svg'
import serviceSeo from '../assets/marino/service-seo.svg'
import servicePpc from '../assets/marino/service-ppc.svg'
import serviceVideo from '../assets/marino/service-video.svg'
import blackbird from '../assets/marino/blackbird.svg'
import blackbirdLogo from '../assets/marino/blackbird-logo.svg'
import stats1 from '../assets/marino/stats-1.svg'
import stats2 from '../assets/marino/stats-2.svg'
import stats3 from '../assets/marino/stats-3.svg'

const SLOTS: Record<string, string> = {
  'work-ph': workPh,
  /* TODO(asset): four named work-card slots all point at the shared
     placeholder until the real photos land — swap the slot, not the markup. */
  'work-latakoo': workPh,
  'work-vislink': workPh,
  'work-wr-partners': workPh,
  'work-office-insight': workPh,
  'article-ph': articlePh,
  'service-branding': serviceBranding,
  'service-web-design': serviceWebDesign,
  'service-seo': serviceSeo,
  'service-ppc': servicePpc,
  'service-video': serviceVideo,
  blackbird,
  'blackbird-logo': blackbirdLogo,
  'stats-1': stats1,
  'stats-2': stats2,
  'stats-3': stats3,
}

/** Resolve a content asset slot to its imported local URL. */
export function asset(slot: string): string {
  const url = SLOTS[slot]
  if (!url) throw new Error(`Unknown asset slot: ${slot}`)
  return url
}
