/*
 * Privacy Policy content (privacy spec §5). Every company fact that is not
 * already shared with the Terms/contact data stays a visible TODO placeholder
 * — do NOT invent locations, laws, regulators or retention periods. Leave
 * every TODO in place until the owner fills it in, and have a qualified
 * lawyer in the relevant jurisdiction review the wording before the site goes
 * live (this draft is a template, not legal advice).
 */
import type { Block } from '../components/LegalText'

/*
 * Shared company facts are imported (not duplicated) from the Terms data and
 * the site-wide contact data (privacy spec §5).
 */
import { contact } from './contact'
import { company as legalCompany } from './terms'
import { fillTokens } from './fill'

export const privacyCompany = {
  tradingName: legalCompany.tradingName,
  legalName: legalCompany.legalName,
  address: legalCompany.address,
  email: contact.email,
  phone: contact.phone,
  website: legalCompany.website,
  effectiveDate: legalCompany.effectiveDate,
  lastUpdated: legalCompany.lastUpdated,
  baseLocation: 'TODO city, country', // used in "Who we are"
  homeCountry: 'TODO country', // used in international transfers
  dataLaw: legalCompany.dataLaw,
  regulator: 'TODO the data protection authority / regulator (name it)',
  retention: {
    enquiries: 'TODO e.g. up to 24 months',
    clientProject: 'TODO e.g. up to 10 years after the end of the client relationship',
    marketing: 'until you unsubscribe or withdraw consent',
    analytics: 'in line with the settings of the relevant platform or tool',
  },
} as const

/*
 * `fill()` replaces every `{token}` with the matching value; the retention
 * tokens {retentionEnquiries} etc. map to `privacyCompany.retention.*`.
 */
const FILL_VALUES: Readonly<Record<string, string>> = {
  tradingName: privacyCompany.tradingName,
  legalName: privacyCompany.legalName,
  address: privacyCompany.address,
  email: privacyCompany.email,
  phone: privacyCompany.phone,
  website: privacyCompany.website,
  effectiveDate: privacyCompany.effectiveDate,
  lastUpdated: privacyCompany.lastUpdated,
  baseLocation: privacyCompany.baseLocation,
  homeCountry: privacyCompany.homeCountry,
  dataLaw: privacyCompany.dataLaw,
  regulator: privacyCompany.regulator,
  retentionEnquiries: privacyCompany.retention.enquiries,
  retentionClientProject: privacyCompany.retention.clientProject,
  retentionMarketing: privacyCompany.retention.marketing,
  retentionAnalytics: privacyCompany.retention.analytics,
}

export function fill(text: string): string {
  return fillTokens(text, FILL_VALUES, 'privacy')
}

/* One-time dev report of the facts the owner still has to supply. */
if (import.meta.env.DEV) {
  const pending = Object.entries(FILL_VALUES)
    .filter(([, value]) => value.startsWith('TODO'))
    .map(([key]) => key)
  if (pending.length > 0) {
    console.warn(
      `[privacy] TODO placeholders are still visible and must be filled in before launch: ${pending.join(', ')}`,
    )
  }
}

export const intro =
  'This policy explains how {tradingName} collects, uses, stores and protects personal data when you visit the website, contact the studio, enquire about services, or otherwise interact with the business.'

export const sections: { title: string; blocks: Block[] }[] = [
  {
    title: '1. Who we are',
    blocks: [
      { type: 'p', text: '{tradingName} is a creative and digital studio based in {baseLocation}.' },
      {
        type: 'p',
        text: 'Data controller: {legalName}\nWebsite: {website}\nEmail: {email}\nPhone: {phone}\nAddress: {address}',
      },
      {
        type: 'p',
        text: 'For the purposes of {dataLaw}, {legalName} is the data controller of the personal data described in this policy.',
      },
    ],
  },
  {
    title: '2. The information we collect',
    blocks: [
      {
        type: 'p',
        text: 'We may collect, use, store and transfer different types of personal data, including identity data such as your name; contact data such as your email address, phone number, company name and job title; enquiry data submitted through contact forms, callback forms or project enquiries; communications data such as emails, messages, call notes or meeting details; technical data such as IP address, browser type, operating system, device information and website usage data; marketing data such as your preferences in receiving marketing communications from us; analytics data such as pages viewed, time on site, click behaviour and referral source; and client data where necessary to deliver services to our clients.',
      },
      {
        type: 'p',
        text: 'We do not intentionally collect special category (sensitive) personal data through our website unless it is explicitly provided to us and needed for a legitimate business purpose.',
      },
    ],
  },
  {
    title: '3. How we collect your data',
    blocks: [
      {
        type: 'p',
        text: 'We collect personal data in a number of ways, including when you fill in a contact or callback form on our website, request a quote or proposal, email or call us directly, sign up to receive marketing communications, interact with our website through cookies and analytics tools, engage us to provide services, or communicate with us through social media or third-party platforms.',
      },
      { type: 'p', text: 'Some technical and usage data is collected automatically when you use our website.' },
    ],
  },
  {
    title: '4. How we use your personal data',
    blocks: [
      {
        type: 'p',
        text: 'We use your personal data to respond to enquiries and provide information about our services; prepare proposals, quotations and project scopes; provide branding, web design, video and related creative and digital services; manage our client relationships and ongoing service delivery; improve our website, services and user experience; monitor website performance and marketing effectiveness; send relevant marketing communications where permitted by law; comply with legal and regulatory obligations; and establish, exercise or defend legal claims.',
      },
      // TODO: align this list with the services Chuech Studio actually offers (same list as the Services page).
    ],
  },
  {
    title: '5. Our lawful bases for processing',
    blocks: [
      {
        type: 'p',
        text: 'Under {dataLaw}, we must have a lawful basis for processing your personal data. Depending on the circumstances, we may rely on consent, where you have opted in to receive marketing communications or accepted non-essential cookies; contract, where processing is necessary to take steps before entering into a contract or to perform a contract with you; legitimate interests, where processing is necessary for our legitimate business interests provided those interests are not overridden by your rights and freedoms; and legal obligation, where we need to comply with a legal or regulatory requirement.',
      },
      { type: 'p', text: 'Where we rely on consent, you can withdraw it at any time.' },
      // TODO (lawyer): confirm the lawful bases match the applicable law.
    ],
  },
  {
    title: '6. Marketing communications',
    blocks: [
      {
        type: 'p',
        text: 'We may send you marketing communications about our services where you have requested information from us, opted in, or where we are otherwise permitted to do so under applicable law.',
      },
      {
        type: 'p',
        text: 'You can unsubscribe from marketing emails at any time by clicking the unsubscribe link in our emails or by contacting us directly.',
      },
    ],
  },
  {
    title: '7. Cookies and similar technologies',
    blocks: [
      {
        type: 'p',
        text: 'Our website may use cookies and similar technologies to make the site work properly, analyse performance, improve user experience and support marketing activity. These may include strictly necessary cookies, analytics cookies, functionality cookies, and advertising or targeting cookies.',
      },
      {
        type: 'p',
        text: 'Where required, we will ask for your consent before placing non-essential cookies on your device. You can manage your cookie preferences through our cookie banner or your browser settings.',
      },
    ],
  },
  {
    title: '8. Who we share your data with',
    blocks: [
      {
        type: 'p',
        text: 'We may share your personal data with trusted third parties where necessary for business operations and service delivery, including website hosting providers, CRM systems, analytics providers, email marketing platforms, cloud storage and collaboration tools, payment providers, legal, accounting or professional advisers, and trusted contractors or service providers working on our behalf.',
      },
      { type: 'p', text: 'We require third parties to respect the security of your personal data and to process it in accordance with the law.' },
    ],
  },
  {
    title: '9. International transfers',
    blocks: [
      {
        type: 'p',
        text: 'Some of our third-party providers may store or process personal data outside {homeCountry}. Where this happens, we will take appropriate steps to ensure your data is protected and transferred lawfully.',
      },
    ],
  },
  {
    title: '10. How long we keep your data',
    blocks: [
      {
        type: 'p',
        text: 'We only keep personal data for as long as necessary for the purposes for which it was collected, including to satisfy legal, regulatory, tax, accounting or reporting requirements.',
      },
      { type: 'p', text: 'Typical retention periods may include:' },
      {
        type: 'ul',
        items: [
          'enquiry data: {retentionEnquiries}',
          'client and project data: {retentionClientProject}',
          'marketing data: {retentionMarketing}',
          'analytics and cookie data: {retentionAnalytics}',
        ],
      },
      { type: 'p', text: 'We may retain data for longer where necessary to comply with legal obligations or resolve disputes.' },
    ],
  },
  {
    title: '11. Your data protection rights',
    blocks: [
      {
        type: 'p',
        text: 'Under {dataLaw}, you may have the right to request access to your personal data, request correction of inaccurate or incomplete data, request erasure of your personal data, object to processing, request restriction of processing, request transfer of your personal data, withdraw consent where processing is based on consent, and complain to {regulator}.',
      },
      { type: 'p', text: 'To exercise any of these rights, please contact us using the details above.' },
    ],
  },
  {
    title: '12. Data security',
    blocks: [
      {
        type: 'p',
        text: 'We take appropriate technical and organisational measures to protect personal data against unauthorised access, loss, misuse, alteration or disclosure.',
      },
      {
        type: 'p',
        text: 'However, no method of transmission over the internet is completely secure, and we cannot guarantee absolute security.',
      },
    ],
  },
  {
    title: '13. Third-party links',
    blocks: [
      {
        type: 'p',
        text: 'Our website may contain links to third-party websites. If you follow a link to another website, that site will have its own privacy policy and we are not responsible for its content or practices.',
      },
    ],
  },
  {
    title: '14. Children’s privacy',
    blocks: [
      {
        type: 'p',
        text: 'Our website and services are not intended for children, and we do not knowingly collect personal data from children through our website.',
      },
    ],
  },
  {
    title: '15. Changes to this Privacy Policy',
    blocks: [
      {
        type: 'p',
        text: 'We may update this Privacy Policy from time to time to reflect changes in our services, legal obligations or how we process personal data. Any updates will be posted on this page, and the “Last updated” date will be revised.',
      },
    ],
  },
  {
    title: '16. Contact us',
    blocks: [
      { type: 'p', text: 'If you have any questions about this Privacy Policy or how we handle your personal data, please contact:' },
      { type: 'p', text: '{legalName}\n{address}\nEmail: {email}\nPhone: {phone}' },
      {
        type: 'p',
        text: 'If you are unhappy with how we handle your personal data, you also have the right to complain to {regulator}.',
      },
    ],
  },
]
