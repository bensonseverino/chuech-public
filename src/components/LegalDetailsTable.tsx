import { company } from '../data/terms'

/**
 * The site's light inline-link treatment (RichText/FAQ): primary underline,
 * opacity hover, obsidian focus ring. Used for the mailto/tel values in the
 * details table and the contact blocks inside the legal text.
 */
export const LEGAL_LINK =
  'text-obsidian underline decoration-primary underline-offset-4 transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-obsidian'

/** Body copy + heading size scale for the legal page (terms spec §6). */
export const LEGAL_TEXT =
  'text-[0.95rem] leading-[1.55] md:text-[0.85rem] lg:text-[0.8rem]'

type DetailRow = {
  label: string
  value: string
  href?: string
}

/**
 * Company details table (terms spec §4): a semantic 2-column table with 1px
 * mid-grey borders, square corners, no zebra striping. Labels are
 * `<th scope="row">` at ~35% width (38% on mobile), where they may wrap.
 * Stays a real table on mobile (no card conversion) and — per spec — has no
 * Company number or VAT number row.
 */
export default function LegalDetailsTable() {
  const rows: DetailRow[] = [
    { label: 'Company', value: company.legalName },
    { label: 'Address', value: company.address },
    { label: 'Email', value: company.email, href: `mailto:${company.email}` },
    { label: 'Phone', value: company.phone, href: `tel:${company.phone.replace(/\s/g, '')}` },
    { label: 'Effective date', value: company.effectiveDate },
    { label: 'Last updated', value: company.lastUpdated },
  ]

  return (
    <table className={`w-full ${LEGAL_TEXT}`}>
      <tbody>
        {rows.map((row) => (
          <tr key={row.label}>
            <th
              scope="row"
              className="w-[38%] border border-[#bdbdbd] px-[0.9rem] py-[0.6rem] text-left align-top font-medium text-obsidian md:w-[35%]"
            >
              {row.label}
            </th>
            <td className="border border-[#bdbdbd] px-[0.9rem] py-[0.6rem] align-top text-obsidian">
              {row.href ? (
                <a href={row.href} className={LEGAL_LINK}>
                  {row.value}
                </a>
              ) : (
                row.value
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
