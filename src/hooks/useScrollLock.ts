import { useEffect } from 'react'
import { useLenis } from '@/providers/lenis-context'

export function useScrollLock(locked: boolean) {
  const lenis = useLenis()
  useEffect(() => {
    if (!locked) return
    if (lenis) lenis.stop()
    else document.body.style.overflow = 'hidden'
    return () => {
      if (lenis) lenis.start()
      else document.body.style.overflow = ''
    }
  }, [locked, lenis])
}
