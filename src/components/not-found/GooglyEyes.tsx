import type { CSSProperties, RefObject } from 'react'
import { eyesConfig } from './eyes.config'
import './GooglyEyes.css'

type GooglyEyesProps = {
  /** Wrapper ref; also given to `useEyeTracking` (§4 spec). */
  eyesRef: RefObject<HTMLDivElement | null>
  pupilRefs: RefObject<HTMLSpanElement | null>[]
}

/**
 * Two decorative googly eyes (404 spec §3/§5): white sclerae, obsidian
 * pupils sized in CSS variables from `GooglyEyes.css`, the right eye sitting
 * 10% of the diameter lower. Size/gap live in CSS; the tracking behaviour in
 * `useEyeTracking`. Wrapper is `aria-hidden` — purely decorative. The eyes
 * sit at rest (config vectors) until the page enables tracking.
 */
export default function GooglyEyes({ eyesRef, pupilRefs }: GooglyEyesProps) {
  return (
    <div ref={eyesRef} aria-hidden="true" className="googly-eyes flex justify-center gap-[var(--eye-gap)]">
      {[0, 1].map((index) => (
        <span key={index} data-eye className="relative block rounded-full bg-white" style={{ width: 'var(--eye-size)', height: 'var(--eye-size)', marginTop: index === 1 ? `calc(var(--eye-size) * ${eyesConfig.rightEyeOffset})` : 0 } as CSSProperties}>
          <span
            ref={pupilRefs[index]}
            data-pupil
            className="absolute block rounded-full bg-obsidian"
            style={{
              width: 'var(--pupil-size)',
              height: 'var(--pupil-size)',
              left: 'calc(50% - var(--pupil-size) / 2)',
              top: 'calc(50% - var(--pupil-size) / 2)',
            }}
          />
        </span>
      ))}
    </div>
  )
}
