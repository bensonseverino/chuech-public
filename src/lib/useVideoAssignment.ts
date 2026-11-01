import { VIDEOS, type VideoAsset } from './videos'

/**
 * Stable, no-repeat video assignment (imagekit-videos spec §2).
 *
 * The deck is shuffled once per page load (Fisher-Yates at module scope), then
 * handed out round-robin by slot id. Two placeholders therefore never share a
 * clip until all five have been used, and a placeholder keeps its clip across
 * re-renders, route changes and remounts — the module state outlives them all.
 * A new browser session re-shuffles.
 */
const shuffled: VideoAsset[] = [...VIDEOS]
for (let i = shuffled.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1))
  ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
}

const slots = new Map<string, VideoAsset>()
let cursor = 0

/** The clip for `slotId`; assigns the next one in the deck the first time. */
export function getVideoForSlot(slotId: string): VideoAsset {
  const existing = slots.get(slotId)
  if (existing) return existing
  const video = shuffled[cursor % shuffled.length]
  cursor++
  slots.set(slotId, video)
  return video
}
