import { useCallback, useEffect, useRef, useState } from 'react'

/* eslint-disable react-refresh/only-export-components -- the hook and its mount belong together (spec §8.1 names this one file) */

/*
 * Invisible Turnstile (cms-forms-reviews-spec.md §8.1).
 *
 * The Cloudflare script loads LAZILY — on first `arm()`, which forms call when
 * a visitor first focuses a field — so page load is never slowed. The widget
 * renders hidden (size="invisible"); `getToken()` resolves with a fresh token
 * and `reset()` discards a spent one. With no site key configured (local dev)
 * everything is a no-op so forms still work end to end (server-side bypass).
 *
 * Site key: VITE_TURNSTILE_SITE_KEY (Cloudflare's published test key locally).
 */

type TurnstileApi = {
  render: (el: HTMLElement, options: Record<string, unknown>) => string
  reset: (widgetId?: string) => void
  remove: (widgetId: string) => void
}

declare global {
  interface Window {
    turnstile?: TurnstileApi
  }
}

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
let scriptPromise: Promise<TurnstileApi> | null = null

/** Load the Turnstile script once, lazily, and resolve the API. */
function loadTurnstile(): Promise<TurnstileApi> {
  if (window.turnstile) return Promise.resolve(window.turnstile)
  if (scriptPromise) return scriptPromise

  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = SCRIPT_SRC
    script.async = true
    script.onload = () => {
      if (window.turnstile) resolve(window.turnstile)
      else reject(new Error('Turnstile loaded but the API is missing'))
    }
    script.onerror = () => {
      scriptPromise = null
      reject(new Error('Could not load Turnstile'))
    }
    document.head.appendChild(script)
  })
  return scriptPromise
}

export type TurnstileHandle = {
  /** Arm the widget (loads the script on the first call). */
  arm: () => void
  /** A fresh token, or undefined when no site key is configured. */
  getToken: () => Promise<string | undefined>
  /** Discard a spent token so the next submit gets a fresh one. */
  reset: () => void
  /** Give the hook the invisible mount point's DOM node. */
  setMount: (el: HTMLDivElement | null) => void
}

export function useTurnstile(): TurnstileHandle {
  const [holderEl, setHolderEl] = useState<HTMLDivElement | null>(null)
  const widgetId = useRef<string | null>(null)
  const pending = useRef<((token: string) => void) | null>(null)
  const [armed, setArmed] = useState(false)

  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined

  const arm = useCallback(() => setArmed(true), [])

  useEffect(() => {
    if (!armed || !siteKey || widgetId.current != null || !holderEl) return

    let cancelled = false
    loadTurnstile()
      .then((api) => {
        if (cancelled || !holderEl) return
        widgetId.current = api.render(holderEl, {
          sitekey: siteKey,
          size: 'invisible',
          callback: (token: string) => {
            const resolve = pending.current
            pending.current = null
            resolve?.(token)
          },
          'error-callback': () => {
            pending.current = null
          },
          'expired-callback': () => {
            pending.current = null
          },
        })
      })
      .catch((cause) => console.error('[forms] turnstile load failed', cause))

    return () => {
      cancelled = true
    }
  }, [armed, siteKey, holderEl])

  const getToken = useCallback(async () => {
    if (!siteKey) return undefined // not configured: the server's bypass applies
    if (widgetId.current == null) return undefined // never armed (script blocked)
    const api = await loadTurnstile()
    return new Promise<string>((resolve) => {
      pending.current = resolve
      api.reset(widgetId.current ?? undefined)
      // A managed widget that passes instantly fires `callback` after reset;
      // if nothing arrives within 10s, continue tokenless and let the server
      // decide rather than hanging the submit.
      setTimeout(() => {
        const waiting = pending.current
        pending.current = null
        waiting?.('')
      }, 10_000)
    })
  }, [siteKey])

  const reset = useCallback(() => {
    if (!window.turnstile || widgetId.current == null) return
    window.turnstile.reset(widgetId.current)
    pending.current = null
  }, [])

  return { arm, getToken, reset, setMount: setHolderEl }
}

/**
 * The invisible mount point a form renders so the hidden widget has a DOM
 * node. Renders nothing visible — the form's exact layout is untouched.
 */
export function TurnstileField({ handle }: { handle: TurnstileHandle }) {
  const mountRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    handle.setMount(mountRef.current)
    return () => handle.setMount(null)
  }, [handle])

  return <div ref={mountRef} aria-hidden="true" className="sr-only" />
}
