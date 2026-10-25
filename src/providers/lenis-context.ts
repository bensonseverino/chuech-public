import { createContext, useContext } from 'react'
import type Lenis from 'lenis'

/**
 * The app's single Lenis instance (smooth-scroll spec §4), owned by
 * `SmoothScrollProvider`. Lives in its own module so the provider file only
 * exports components (fast-refresh rule).
 */
export const LenisContext = createContext<Lenis | null>(null)

export const useLenis = () => useContext(LenisContext)
