import LegalHero from '@/components/LegalHero'
import LegalCard from '@/components/LegalCard'
import LegalDetailsTable from '@/components/LegalDetailsTable'
import LegalSection from '@/components/LegalSection'
import { renderLegalText } from '@/components/LegalText'
import { intro, sections } from '@/data/terms'
import { usePageTitle, useMetaDescription } from '@/hooks/usePageTitle'
import { LEGAL_TEXT } from '@/components/LegalDetailsTable'
import { ROUTES } from '@/routes'

/**
 * `/terms-conditions` (terms spec §1): nav (RootLayout) → hero (breadcrumb
 * "Terms & Conditions", the one `<h1>` "Our Terms", email + phone line) → the
 * white card (details table, intro, 21 numbered sections) → Get in Touch +
 * footer (RootLayout). No nav item is active; no mint pills, no image, no
 * forms — and the legal copy renders plainly, with only the hero load
 * stagger and a single fade on the card itself (terms spec §9).
 */
export default function TermsPage() {
  usePageTitle('Terms & Conditions | Chuech studio')
  useMetaDescription('Read the terms and conditions for using the Chuech studio website and our services.')

  /*
   * Plain-text "Privacy Policy" mentions (intro + section 14) are transition
   * links now that `/privacy-policy` exists (privacy spec §8 step 6).
   * Cookie Policy has no live page and stays plain text.
   */
  const extraLinks = [{ text: 'Privacy Policy', to: ROUTES.privacyPolicy }]

  return (
    <>
      {/*
        Hero (terms spec §2), shared with the Privacy Policy page.
      */}
      <LegalHero badge="Terms & Conditions" heading="Our Terms" />

      {/*
        Content card (terms spec §3), shared with the Privacy Policy page.
      */}
      <LegalCard label="Chuech studio terms and conditions">
        <LegalDetailsTable />

        <p className={`${LEGAL_TEXT} mt-[2rem] text-obsidian`}>
          {renderLegalText(intro, { extraLinks })}
        </p>

        {sections.map((section, index) => (
          <LegalSection
            key={section.title}
            index={index + 1}
            title={section.title}
            paragraphs={section.paragraphs}
            extraLinks={extraLinks}
            className={index === 0 ? '!mt-0' : undefined}
          />
        ))}
      </LegalCard>
    </>
  )
}
