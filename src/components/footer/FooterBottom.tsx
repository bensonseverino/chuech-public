import { TransitionLink } from '@/components/TransitionLink'
import chuechLogo from '../../assets/marino/chuech-logo2.svg'

/**
 * Bottom row — logo (left) + legal line (right) (footer spec §2.6).
 */
export default function FooterBottom({
  tradingName,
  legalLine,
}: {
  tradingName: string
  legalLine: string
}) {
  const year = new Date().getFullYear()
  const filled = legalLine
    .replace('{year}', String(year))
    .replace('{tradingName}', tradingName)

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      {/* Logo */}
      <TransitionLink
        to="/"
        className="w-[7.75rem] sm:w-[7.5rem] lg:w-[9.75rem] mx-auto sm:mx-0"
        aria-label={`${tradingName} home`}
      >
        <img
          src={chuechLogo}
          alt=""
          className="h-auto w-full invert transition-opacity hover:opacity-80"
        />
      </TransitionLink>

      {/* Legal line */}
      <p className="text-[0.85rem] leading-[1.2] font-medium text-white/70 sm:text-[0.95rem] sm:text-right">
        {filled}
      </p>
    </div>
  )
}