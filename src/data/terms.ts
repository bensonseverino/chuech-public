/*
 * Terms & Conditions content (terms-page spec §5). All company facts that are
 * not already on the site are TODO placeholders — do NOT invent addresses,
 * dates, domains or governing law. Leave every TODO visible until the owner
 * fills them in, and have the wording reviewed by a qualified lawyer before
 * the site goes live (this draft is a template, not legal advice).
 */
import { contact } from './contact'

/*
 * Email and phone are shared data (matched to `contact.ts`), not duplicated —
 * the draft template's `.com` address was explicitly marked "match contact.ts".
 */
export const company = {
  tradingName: 'Chuech studio',
  legalName: 'TODO legal company name',
  address: 'TODO registered address',
  email: contact.email,
  phone: contact.phone,
  website: 'https://TODO-domain',
  effectiveDate: 'TODO',
  lastUpdated: 'TODO',
  /* No company registration number or VAT/tax number is shown on this page. */
  registrationLine: 'TODO e.g. a company registered in [country].',
  governingLaw: 'TODO the law of [jurisdiction]',
  courts: 'TODO the courts of [jurisdiction]',
  dataLaw: 'TODO the data protection laws that apply to us (name them)',
} as const

const TOKEN_RE = /\{(\w+)\}/g

/**
 * Fills every `{token}` in a paragraph with the matching `company` value
 * (terms spec §5). A token with no matching key is left as-is and reported in
 * dev rather than silently dropping.
 */
export function fill(text: string): string {
  return text.replace(TOKEN_RE, (token, key: string) => {
    const value = (company as Readonly<Record<string, string>>)[key]
    if (value === undefined) {
      if (import.meta.env.DEV) {
        console.warn(`[terms] paragraph references unknown token {${key}}`)
      }
      return token
    }
    return value
  })
}

/* One-time dev report of the company facts the owner still has to supply. */
if (import.meta.env.DEV) {
  const pending = Object.entries(company)
    .filter(([, value]) => value.startsWith('TODO'))
    .map(([key]) => key)
  if (pending.length > 0) {
    console.warn(
      `[terms] TODO placeholders are still visible and must be filled in before launch: ${pending.join(', ')}`,
    )
  }
}

export const intro =
  'These Terms & Conditions govern your use of the {tradingName} website and set out the basis on which {legalName} may provide services. Please read them alongside our Privacy Policy and Cookie Policy.'

export const sections: { title: string; paragraphs: string[] }[] = [
  {
    title: '1. About these Terms',
    paragraphs: [
      'These Terms & Conditions apply to your use of the {tradingName} website at {website} and to any related pages, content, forms, downloads and communications available through it.',
      'By using this website you agree to these Terms. If you do not agree, please do not use the website.',
      'If we enter into a separate written proposal, statement of work, service agreement or contract with you, that separate agreement takes priority over these website terms wherever the two conflict.',
    ],
  },
  {
    title: '2. Who we are',
    paragraphs: [
      '{tradingName} is the trading name of {legalName}. {registrationLine} Our registered address is {address}. You can contact us at {email} or on {phone}.',
    ],
  },
  {
    title: '3. Use of this website',
    paragraphs: [
      'You agree to use this website only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else’s use and enjoyment of it.',
      'You must not misuse the website by knowingly introducing viruses, trojans, worms, logic bombs or any other malicious or technologically harmful material.',
      'You must not attempt to gain unauthorised access to the website, the server it is hosted on, or any server, computer or database connected to it.',
      'We may suspend, restrict or withdraw access to all or part of the website at any time where reasonably necessary for maintenance, security, operational or legal reasons.',
    ],
  },
  {
    title: '4. Website content and information',
    paragraphs: [
      'We work to keep the information on this website accurate, current and useful. It is provided for general information only and should not be treated as professional, legal, financial or commercial advice.',
      'We do not guarantee that the content will always be up to date, complete, accurate, or free from errors or omissions.',
      'Any reliance you place on information published here is at your own risk. Please take independent advice before making business, legal, financial or technical decisions.',
    ],
  },
  {
    title: '5. Intellectual property',
    paragraphs: [
      'Unless stated otherwise, all intellectual property rights in this website and its content — including text, branding, graphics, images, video, layout, code and design elements — are owned by or licensed to {legalName}.',
      'You may view, download and print pages from the website for your own internal business use, as long as you do not modify the material, remove any notices, or use it in a misleading or unlawful way.',
      'You must not reproduce, copy, republish, distribute, adapt, scrape, frame or commercially exploit any website content without our prior written consent.',
    ],
  },
  {
    title: '6. Enquiries, proposals and no automatic contract',
    paragraphs: [
      'Sending an enquiry, booking a call, requesting a quote or otherwise contacting us through the website does not create a binding contract between you and {legalName}.',
      'Any services offered by {tradingName} — including branding, web design, video production, strategy, consultancy or related support — are subject to a separate agreement covering scope, timing and fees.',
      'Unless expressly agreed otherwise in writing, no contract for services exists until both parties have agreed the relevant scope of work and commercial terms.',
    ],
  },
  {
    title: '7. Service-specific terms',
    paragraphs: [
      'Where we provide services, the deliverables, milestones, timelines, fees and approval process will be set out in a proposal, scope of work, quotation, purchase order or other written agreement.',
      'We may use trusted third-party platforms, tools, software, hosting providers, analytics providers or subcontractors where reasonably necessary to provide our services.',
      'Estimated timings are indicative unless expressly agreed as fixed deadlines. Delays caused by missing information, late approvals, platform access issues, client-side changes, third-party systems or events outside our reasonable control may result in timeline changes.',
      'We reserve the right to adjust recommendations, technical approach or delivery method where reasonably required to meet the agreed objectives or respond to changes in law, platform rules or technology.',
    ],
  },
  {
    title: '8. Fees, payment and expenses',
    paragraphs: [
      'Unless otherwise agreed in writing, all fees, retainers, production costs, software charges, third-party fees and expenses are payable in accordance with the proposal or invoice terms we issue.',
      'Unless stated otherwise, quotations and fees are exclusive of any applicable tax and third-party costs.',
      'We may suspend work, withhold deliverables, pause activity or delay launch where invoices remain unpaid beyond the due date.',
      'Where a project involves third-party budgets — such as advertising spend, media, printing, freelancers, travel, accommodation, paid tools or licences — these may be charged separately unless expressly included in writing.',
    ],
  },
  {
    title: '9. Client responsibilities',
    paragraphs: [
      'To help us deliver effectively, clients are expected to provide accurate information, timely feedback, approvals, content, platform access and decision-makers where required.',
      'You are responsible for ensuring that the materials, data, copy, images, trademarks, permissions and instructions you supply to us can lawfully be used.',
      'We are not responsible for delays, rework or additional cost arising from incomplete briefs, inaccurate information, changes in scope, or failure to provide approvals or assets when required.',
    ],
  },
  {
    title: '10. Marketing performance and results',
    paragraphs: [
      '{tradingName} provides strategic, creative, technical and media services designed to improve commercial performance. However, unless expressly agreed in writing, we do not guarantee specific rankings, leads, sales volumes, search visibility, ad performance, media coverage, revenue outcomes or returns on ad spend.',
      'Performance can be influenced by many factors outside our control, including market conditions, competition, algorithms, platform rules, user behaviour, budgets, client-side changes, seasonality, technical constraints and third-party systems.',
    ],
  },
  {
    title: '11. Creative projects and digital deliverables',
    paragraphs: [
      'Where we create websites, landing pages, creative assets, branding, copy, video or other deliverables, ownership and licence rights will be governed by the relevant proposal or contract.',
      'Unless otherwise agreed in writing, full intellectual property rights in final deliverables created specifically for a client transfer only once all relevant fees have been paid in full.',
      'We may retain ownership of pre-existing materials, know-how, frameworks, templates, code libraries, methods, processes and reusable components used in delivering our services.',
    ],
  },
  {
    title: '12. Third-party websites and platforms',
    paragraphs: [
      'This website may contain links to third-party websites, software, services or content. Those links are provided for convenience only.',
      'We do not control third-party websites and are not responsible for their content, security, availability, terms, privacy practices or services.',
      'If your work with {tradingName} involves third-party platforms such as advertising networks, analytics tools, CRMs, email platforms, website hosts or social media channels, your use of those platforms may also be subject to their own terms and policies.',
    ],
  },
  {
    title: '13. Confidentiality',
    paragraphs: [
      'Where we receive confidential information in the course of an enquiry or project, we will take reasonable steps to keep it confidential and use it only for legitimate business purposes connected with that enquiry or project.',
      'This does not apply to information that is already public, was lawfully known to us before disclosure, is lawfully received from a third party, or must be disclosed by law or regulatory requirement.',
    ],
  },
  {
    title: '14. Data protection',
    paragraphs: [
      'We process personal data in accordance with {dataLaw}.',
      'Further information about how we collect and use personal data is set out in our Privacy Policy and Cookie Policy.',
    ],
  },
  {
    title: '15. Liability',
    paragraphs: [
      'Nothing in these Terms & Conditions excludes or limits liability for fraud, fraudulent misrepresentation, death or personal injury caused by negligence, or any other liability that cannot lawfully be excluded or limited.',
      'To the fullest extent permitted by law, {legalName} excludes all implied warranties, representations and conditions relating to this website and its content.',
      'To the fullest extent permitted by law, we will not be liable for any indirect or consequential loss, loss of profits, loss of revenue, loss of business, loss of goodwill, loss of opportunity, or loss of anticipated savings arising out of or in connection with your use of, or inability to use, this website.',
      'Where liability cannot be excluded, our liability will be limited to the extent permitted by law and, in relation to services, will be subject to the liability provisions agreed in the relevant client contract or proposal.',
    ],
  },
  {
    title: '16. Indemnity',
    paragraphs: [
      'You agree to indemnify and hold harmless {legalName}, its directors, employees, contractors and affiliates against losses, claims, liabilities, damages, costs and expenses arising from your misuse of the website, your breach of these Terms & Conditions, or your infringement of the rights of any third party.',
    ],
  },
  {
    title: '17. Website availability and security',
    paragraphs: [
      'We do not guarantee that the website will always be available, uninterrupted, secure, or free from bugs or viruses.',
      'You are responsible for using your own virus protection software and for ensuring that any devices, systems or networks you use to access the website are appropriately secured.',
    ],
  },
  {
    title: '18. Changes to these Terms',
    paragraphs: [
      'We may update these Terms & Conditions from time to time to reflect changes to our business, website, legal obligations or services.',
      'Any updated version will be posted on this page with a revised last-updated date. By continuing to use the website after changes are published, you agree to the updated Terms & Conditions.',
    ],
  },
  {
    title: '19. Severance and waiver',
    paragraphs: [
      'If any provision of these Terms & Conditions is found to be invalid, unlawful or unenforceable, the remaining provisions will stay in full force and effect.',
      'If we do not enforce any right or provision at any time, that does not mean we waive that right or provision in the future.',
    ],
  },
  {
    title: '20. Governing law and jurisdiction',
    paragraphs: [
      'These Terms & Conditions, and any dispute or claim arising out of or in connection with them, their subject matter, or your use of the website, are governed by {governingLaw}.',
      '{courts} will have exclusive jurisdiction, except where applicable law gives consumers the right to bring proceedings elsewhere.',
    ],
  },
  {
    title: '21. Contact details',
    paragraphs: [
      'If you have any questions about these Terms & Conditions, please contact:',
      '{legalName}\n{address}\n{email}\n{phone}',
    ],
  },
]
