import SectionBadge from './primitives/SectionBadge'

/**
 * Compact white pill under the header: arrow · agency name · Google Partner mark.
 * Refactored onto the shared SectionBadge primitive (services spec §3.1) with
 * the frozen sizing classes passed through — the look and position are unchanged.
 * TODO(asset): swap the text "Google" mark for the real Google Partner artwork
 * if/when a suitable asset is added to the project.
 */
export default function PartnerBadge() {
  return (
    <div className="flex justify-center md:justify-start">
      <SectionBadge
        as="p"
        iconClassName="h-3 w-6 md:h-3.5 md:w-7"
        className="gap-2 py-2 pr-3.5 pl-3 text-[10px] leading-[1.3] font-medium text-obsidian sm:text-[11px] md:gap-3.5 md:py-2.5 md:pr-6 md:pl-5 md:text-[13px]"
      >
        <span className="max-w-[6.75rem] text-center md:max-w-none md:text-left">
          Marino Web Design Agency
        </span>
        <span aria-hidden="true" className="h-4 w-px shrink-0 bg-silver md:h-5" />
        <span className="shrink-0 font-semibold whitespace-nowrap">
          Google&nbsp;Partner
        </span>
      </SectionBadge>
    </div>
  )
}
