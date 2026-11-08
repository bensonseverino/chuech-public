import { TransitionLink } from '@/components/TransitionLink'
import { ChevronIcon } from '../icons'
import type { FooterLink } from '../../data/footer'

/**
 * Individual footer link with mint arrow icon (footer spec §2.5).
 */
function FooterLinkItem({ link }: { link: FooterLink }) {
  return (
    <li>
      <TransitionLink
        to={link.href}
        className="group inline-flex min-h-[44px] items-center gap-[0.75rem] text-[1.1rem] leading-[1.3] font-medium text-white hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        style={{ touchAction: 'manipulation' }}
      >
        <ChevronIcon
          className="h-[0.9rem] w-[0.9rem] shrink-0 text-primary transition-transform duration-200 ease-out origin-center group-hover:translate-x-1 motion-reduce:transition-none"
        />
        <span>{link.label}</span>
      </TransitionLink>
    </li>
  )
}

/**
 * Link grid — column-flow grid (footer spec §2.5):
 * - Desktop: 3 columns × 2 rows
 * - Tablet: 3 columns × 2 rows
 * - Mobile: 2 columns × 3 rows
 *
 * Items are in the exact order specified; the grid auto-flows them down
 * each column first.
 */
export default function FooterLinks({ links }: { links: FooterLink[] }) {
  return (
    <nav aria-label="Footer">
      <ul
        className="grid grid-flow-col gap-x-6 gap-y-[0.85rem] sm:grid-cols-3 sm:grid-rows-2 md:grid-cols-3 md:grid-rows-2 grid-cols-2 grid-rows-3 md:gap-y-[0.85rem] gap-y-[1rem]"
        role="list"
      >
        {links.map((link) => (
          <FooterLinkItem key={link.href} link={link} />
        ))}
      </ul>
    </nav>
  )
}