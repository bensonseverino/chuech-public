import { createContext, useContext } from 'react'

/**
 * Route-change channel for the two-panel wipe (smooth-scroll spec §6).
 * Separate module so `PageTransitionProvider.tsx` only exports components
 * (fast-refresh rule); the provider supplies the value, the link components
 * and any page consume it via `usePageTransition`.
 */
type Ctx = { go: (to: string) => void }

export const TransitionContext = createContext<Ctx>({ go: () => {} })

export const usePageTransition = () => useContext(TransitionContext)
