import LegalHero from '@/components/LegalHero'
import LegalCard from '@/components/LegalCard'
import LegalDetailsTable, { type DetailRow, LEGAL_TEXT } from '@/components/LegalDetailsTable'
import LegalSection from '@/components/LegalSection'
import { renderLegalText } from '@/components/LegalText'
import { fill, intro, privacyCompany, sections } from '@/data/privacy'
import { usePageTitle, useMetaDescription } from '@/hooks/usePageTitle'

/**
 * `/privacy-policy` (privacy spec §1): nav (RootLayout) → hero (breadcrumb
 * "Privacy Policy", the one `<h1>` "Your Data", email + phone line) → the
 * white card (details table, intro, 16 numbered sections with the bulleted
 * retention list) → Get in Touch + footer (RootLayout). Same shared layout
 * as the Terms page — no nav item active, no forms/images/marquees, legal
 * copy never animates (privacy spec §9). No Company number or VAT number
 * anywhere (privacy spec §4).
 */
export default function PrivacyPolicyPage() {
  usePageTitle('Privacy Policy | Chuech studio')
  useMetaDescription('How Chuech studio collects, uses and protects your personal data.')

  /*
   * The table (privacy spec §4): six rows in this exact order — no Company
   * number or VAT number row.
   */
  const rows: DetailRow[] = [
    { label: 'Effective date', value: privacyCompany.effectiveDate },
    { label: 'Last updated', value: privacyCompany.lastUpdated },
    { label: 'Data controller', value: privacyCompany.legalName },
    { label: 'Website', value: privacyCompany.website, href: privacyCompany.website },
    { label: 'Contact email', value: privacyCompany.email, href: `mailto:${privacyCompany.email}` },
    {
      label: 'Phone',
      value: privacyCompany.phone,
      href: `tel:${privacyCompany.phone.replace(/\s/g, '')}`,
    },
  ]

  return (
    <>
      {/*
        Hero (privacy spec §2), shared with the Terms page: breadcrumb pill
        "Privacy Policy", heading "Your Data", email + phone line right-
        aligned on md+ and hidden on mobile.
      */}
      <LegalHero badge="Privacy Policy" heading="Your Data" />

      {/*
        Content card (privacy spec §3), shared with the Terms page.
      */}
      <LegalCard label="Chuech studio privacy policy">
        <LegalDetailsTable rows={rows} />

        <p className={`${LEGAL_TEXT} mt-[2rem] text-obsidian`}>{renderLegalText(intro, { fillText: fill })}</p>

        {sections.map((section, index) => (
          <LegalSection
            key={section.title}
            index={index + 1}
            title={section.title}
            blocks={section.blocks}
            fillText={fill}
            idPrefix="privacy"
            className={index === 0 ? '!mt-0' : undefined}
          />
        ))}
      </LegalCard>
    </>
  )
}
