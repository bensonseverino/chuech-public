import { useEffect, useState, type ReactNode } from "react"
import Lenis from "lenis"
import { gsap, ScrollTrigger } from "@/lib/motion"
import { anchorOffset } from "@/lib/anchor"
import { LenisContext } from "./lenis-context"

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null)

  useEffect(() => {
    history.scrollRestoration = "manual"

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    // Keep ScrollTrigger accurate when content height changes (fonts, images, CMS content)
    let t: number | undefined
    const refresh = () => {
      window.clearTimeout(t)
      t = window.setTimeout(() => ScrollTrigger.refresh(), 200)
    }
    const ro = new ResizeObserver(refresh)
    ro.observe(document.body)
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
    window.addEventListener("load", refresh)

    if (reduced) {
      return () => {
        ro.disconnect()
        window.removeEventListener("load", refresh)
        window.clearTimeout(t)
      }
    }

    const instance = new Lenis({
      autoRaf: false,                       // GSAP ticker drives it
      duration: 1.15,
      easing: (x: number) => Math.min(1, 1.001 - Math.pow(2, -10 * x)),
      smoothWheel: true,
      wheelMultiplier: 1,
      syncTouch: false,                     // native touch scrolling
    })

    instance.on("scroll", ScrollTrigger.update)

    const tick = (time: number) => instance.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    // Smooth in-page anchor links that React Router did not already handle
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = (e.target as HTMLElement).closest?.('a[href*="#"]') as HTMLAnchorElement | null
      if (!a) return
      const url = new URL(a.href, window.location.href)
      if (url.origin !== window.location.origin || url.pathname !== window.location.pathname || !url.hash) return
      let el: Element | null
      try { el = document.querySelector(url.hash) } catch { return }
      if (!el) return
      e.preventDefault()
      history.pushState(null, "", url.hash)
      instance.scrollTo(el as HTMLElement, { offset: anchorOffset(el), duration: 1.4 })
    }
    document.addEventListener("click", onClick)

    // Lenis is an external system created on mount; publishing it to context
    // requires one state update (the standard "subscribe on mount" pattern).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLenis(instance)

    return () => {
      document.removeEventListener("click", onClick)
      gsap.ticker.remove(tick)
      instance.destroy()
      setLenis(null)
      ro.disconnect()
      window.removeEventListener("load", refresh)
      window.clearTimeout(t)
    }
  }, [])

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
}
