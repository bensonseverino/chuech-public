import OutlineChip from '../primitives/OutlineChip'
import { ROUTES } from '../../routes'

const LINKS = [
  { label: 'Branding', to: ROUTES.branding },
  { label: 'Web Design', to: ROUTES.webDesign },
  { label: 'SEO', to: ROUTES.seo },
  { label: 'PPC', to: ROUTES.ppc },
  { label: 'Video', to: ROUTES.video },
] as const

/**
 * "View our work by service" (work page spec §5.3): a centred heading and five
 * outline pill links (the same `OutlineChip`, `tone="light" size="lg"`). The row
 * is one line at md+ and wraps centred on mobile.
 */
export default function ServiceLinks() {
  return (
    <section className="px-4 pt-[40px] pb-[62px] md:px-8 md:pt-[50px] lg:pt-[70px] lg:pb-[90px]">
      <h2 className="text-center text-[28px] leading-[1.2] font-normal text-obsidian md:text-[33px]">
        View our work by service
      </h2>
      <ul className="mt-[25px] flex flex-wrap justify-center gap-[10px]">
        {LINKS.map((link) => (
          <li key={link.label}>
            <OutlineChip to={link.to} tone="light" size="lg">
              {link.label}
            </OutlineChip>
          </li>
        ))}
      </ul>
    </section>
  )
}
