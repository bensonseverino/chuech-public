import { useEffect, type RefObject } from 'react'
import { gsap } from '../lib/motion'
import { polarToCartesian, computePupilOffset } from '../lib/eyes'
import { eyesConfig } from '../components/not-found/eyes.config'

type EyeMetrics = {
  /** Eye centre in viewport pixels. */
  centerX: number
  centerY: number
  /** Eye + pupil radii and the resulting max travel, viewport pixels. */
  radius: number
  pupilRadius: number
  maxTravel: number
}

/** Per-pupil setters: smooth `quickTo` pair, or direct sets when reduced. */
type PupilMover = { to: (x: number, y: number) => void }

export type EyeTrackingOptions = {
  /** Wrapper holding exactly two eye elements (each marked `data-eye`). */
  eyesRef: RefObject<HTMLElement | null>
  /** One ref per pupil, order matching the eyes. */
  pupilRefs: RefObject<HTMLElement | null>[]
  /** Look-at target on hover/focus (the home-button wrapper). */
  buttonRef: RefObject<HTMLElement | null>
  /** Enter this effect only once the entrance animation has finished. */
  enabled: boolean
  /** `true` → no easing, no idle wandering, no blink (404 spec §4.7). */
  reducedMotion: boolean
}

/**
 * Pointer/touch tracking, idle wandering, blink and look-at-button for the
 * googly eyes (404 spec §4). GSAP transforms only — `translate3d` on the
 * pupils, `scaleY` for blinks — with all eye geometry cached on mount and on
 * resize/scroll so the pointer handler never reads the DOM. Every tween,
 * timer, listener and observer is torn down by the effect cleanup.
 */
export function useEyeTracking({ eyesRef, pupilRefs, buttonRef, enabled, reducedMotion }: EyeTrackingOptions) {
  useEffect(() => {
    if (!enabled || !eyesRef.current) return

    const eyes = [...(eyesRef.current.querySelectorAll<HTMLElement>('[data-eye]') ?? [])]
    const pupils = pupilRefs.map((ref) => ref.current)
    const button = buttonRef.current
    if (eyes.length !== 2 || pupils.some((pupil) => !pupil) || !button) return

    const metrics: (EyeMetrics | null)[] = [null, null]
    const state = {
      /** Last pointer/touch point (viewport px); null before any input. */
      target: null as { x: number; y: number } | null,
      /** Pupil travel as a share (0..1+) of max travel, for blink gating. */
      travelShare: [0, 0] as [number, number],
    }

    /* Per-pupil followers: eased quickTo (smooth mode) or direct set. */
    const movers: PupilMover[] = pupils.map((pupil) => {
      if (reducedMotion) {
        return { to: (x, y) => gsap.set(pupil!, { x, y }) }
      }
      const xTo = gsap.quickTo(pupil!, 'x', {
        duration: eyesConfig.tracking.duration,
        ease: eyesConfig.tracking.ease,
      })
      const yTo = gsap.quickTo(pupil!, 'y', {
        duration: eyesConfig.tracking.duration,
        ease: eyesConfig.tracking.ease,
      })
      return { to: (x, y) => { xTo(x); yTo(y) } }
    })

    /** Cold path: cache centre/radii per eye off its bounding rect. */
    const measure = () => {
      eyes.forEach((eye, index) => {
        const rect = eye.getBoundingClientRect()
        const radius = rect.width / 2
        const pupilRadius = radius * eyesConfig.pupilRatio
        metrics[index] = {
          centerX: rect.left + radius,
          centerY: rect.top + rect.height / 2,
          radius,
          pupilRadius,
          maxTravel: (radius - pupilRadius) * eyesConfig.travelFactor,
        }
      })
    }

    /** Drive both pupils toward one viewport-space point. */
    const applyTarget = (target: { x: number; y: number }, remember: boolean) => {
      if (remember) state.target = { x: target.x, y: target.y }
      metrics.forEach((metric, index) => {
        if (!metric) return
        const offset = computePupilOffset({
          eyeCenter: { x: metric.centerX, y: metric.centerY },
          eyeRadius: metric.radius,
          pupilRadius: metric.pupilRadius,
          target,
          travel: eyesConfig.travelFactor,
        })
        state.travelShare[index] = Math.hypot(offset.x, offset.y) / Math.max(metric.maxTravel, 1)
        movers[index].to(offset.x, offset.y)
      })
    }

    const lookAtButton = () => {
      const rect = button.getBoundingClientRect()
      if (!rect) return
      applyTarget({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }, false)
    }

    /** Sit the pupils at the configured rest position. */
    const applyRest = () => {
      const rest = window.innerWidth >= 640 ? eyesConfig.rest.desktop : eyesConfig.rest.mobile
      metrics.forEach((metric, index) => {
        if (!metric) return
        movers[index].to(rest.x * metric.maxTravel, rest.y * metric.maxTravel)
        state.travelShare[index] = eyesConfig.tracking.idle.reach
      })
    }

    /* ---- Idle wandering (smooth mode only) ---- */

    const timers = new Set<number>()
    const addTimer = (fn: () => void, delay: number) => {
      const id = window.setTimeout(() => {
        timers.delete(id)
        fn()
      }, delay)
      timers.add(id)
    }

    /** One idle glance: a random in-range point — or the button sometimes. */
    const wander = () => {
      const buttonRect = button.getBoundingClientRect()
      if (buttonRect && Math.random() < 0.3) {
        lookAtButton()
        return
      }
      metrics.forEach((metric, index) => {
        if (!metric) return
        const angle = Math.random() * Math.PI * 2
        const reach = eyesConfig.tracking.idle.reach * metric.maxTravel
        const offset = polarToCartesian(angle, reach)
        movers[index].to(offset.x, offset.y)
        state.travelShare[index] = eyesConfig.tracking.idle.reach
      })
    }

    let idleLoopTimer: number | null = null
    const idleLoop = () => {
      if (idleLoopTimer !== null) return
      const tick = () => {
        wander()
        idleLoopTimer = window.setTimeout(tick, 1000 * (eyesConfig.tracking.idle.min + Math.random() * (eyesConfig.tracking.idle.max - eyesConfig.tracking.idle.min)))
      }
      tick()
    }
    const stopIdleLoop = () => {
      if (idleLoopTimer !== null) {
        window.clearTimeout(idleLoopTimer)
        idleLoopTimer = null
      }
    }

    /** After ~2.5s without input the pupils start wandering. */
    let countdownTimer: number | null = null
    const startIdleCountdown = (returnAfter: number) => {
      if (countdownTimer !== null) window.clearTimeout(countdownTimer)
      countdownTimer = window.setTimeout(() => {
        countdownTimer = null
        idleLoop()
      }, 1000 * returnAfter)
    }

    /* ---- Blink (smooth mode only) ---- */
    const scheduleBlink = () => {
      addTimer(() => {
        const busy = state.travelShare.some((share) => share > eyesConfig.blink.maxMidTravel)
        if (!busy) {
          eyes.forEach((eye) => {
            gsap.to(eye, {
              scaleY: eyesConfig.blink.squash,
              duration: eyesConfig.blink.duration / 2,
              ease: 'power1.in',
              yoyo: true,
              repeat: 1,
              transformOrigin: 'center',
            })
          })
        }
        scheduleBlink()
      }, 1000 * (eyesConfig.blink.min + Math.random() * (eyesConfig.blink.max - eyesConfig.blink.min)))
    }

    /* ---- Input handlers ---- */
    const onPointerMove = (event: PointerEvent) => {
      stopIdleLoop()
      startIdleCountdown(eyesConfig.tracking.idle.startAfter)
      applyTarget({ x: event.clientX, y: event.clientY }, true)
    }
    const onTouch = (event: TouchEvent) => {
      const touch = event.touches[0]
      if (!touch) return
      stopIdleLoop()
      startIdleCountdown(eyesConfig.tracking.idle.returnAfterTouch)
      applyTarget({ x: touch.clientX, y: touch.clientY }, true)
    }
    const onEnterButton = () => lookAtButton()
    const onLeaveButton = () => {
      if (state.target) applyTarget(state.target, false)
      else startIdleCountdown(eyesConfig.tracking.idle.startAfter)
    }
    /* Refresh cached geometry and resume the last look. */
    const reflow = () => {
      measure()
      if (state.target) applyTarget(state.target, false)
      else { applyRest(); idleLoop() }
    }
    const resizeObserver = new ResizeObserver(reflow)
    const onScroll = () => measure()

    /* ---- Start ---- */
    measure()
    applyRest()
    if (!reducedMotion) {
      startIdleCountdown(eyesConfig.tracking.idle.startAfter)
      scheduleBlink()
    }

    const observe = eyesRef.current
    resizeObserver.observe(observe)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('touchstart', onTouch, { passive: true })
    window.addEventListener('touchmove', onTouch, { passive: true })
    button.addEventListener('pointerenter', onEnterButton)
    button.addEventListener('focusin', onEnterButton)
    button.addEventListener('pointerleave', onLeaveButton)
    button.addEventListener('focusout', onLeaveButton)

    /* ---- Tear down everything ---- */
    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('touchstart', onTouch)
      window.removeEventListener('touchmove', onTouch)
      button.removeEventListener('pointerenter', onEnterButton)
      button.removeEventListener('focusin', onEnterButton)
      button.removeEventListener('pointerleave', onLeaveButton)
      button.removeEventListener('focusout', onLeaveButton)
      timers.forEach((timer) => window.clearTimeout(timer))
      if (countdownTimer !== null) window.clearTimeout(countdownTimer)
      if (idleLoopTimer !== null) window.clearTimeout(idleLoopTimer)
      pupils.forEach((pupil) => {
        if (!pupil) return
        gsap.killTweensOf(pupil)
        gsap.set(pupil, { clearProps: 'transform' })
      })
      eyes.forEach((eye) => gsap.killTweensOf(eye))
    }
  }, [eyesRef, pupilRefs, buttonRef, enabled, reducedMotion])
}
