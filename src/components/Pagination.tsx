import { Link } from 'react-router'
import { ChevronIcon } from './icons'
import './Pagination.css'

/**
 * Pagination bar (work page spec §5.2): `‹ 1 2 3 ›` in a light pill. State lives
 * in the URL (`?page=N`) so it is shareable and Back/Forward work; prev/next are
 * links to the neighbouring page. Prev is disabled on page 1 and next on the
 * last page (silver fill, not focusable).
 */
export default function Pagination({
  page,
  totalPages,
}: {
  page: number
  totalPages: number
}) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  const prevDisabled = page <= 1
  const nextDisabled = page >= totalPages

  return (
    <nav aria-label="Work pagination" className="pagination">
      {prevDisabled ? (
        <span className="pagination-circle is-disabled" aria-disabled="true">
          <ChevronIcon className="pagination-icon rotate-180" />
        </span>
      ) : (
        <Link to={`?page=${page - 1}`} aria-label="Previous page" className="pagination-circle">
          <ChevronIcon className="pagination-icon rotate-180" />
        </Link>
      )}

      <ol className="pagination-numbers">
        {pages.map((n) => (
          <li key={n}>
            <Link
              to={`?page=${n}`}
              aria-current={n === page ? 'page' : undefined}
              className={`pagination-number${n === page ? ' is-current' : ''}`}
            >
              {n}
            </Link>
          </li>
        ))}
      </ol>

      {nextDisabled ? (
        <span className="pagination-circle is-disabled" aria-disabled="true">
          <ChevronIcon className="pagination-icon" />
        </span>
      ) : (
        <Link to={`?page=${page + 1}`} aria-label="Next page" className="pagination-circle">
          <ChevronIcon className="pagination-icon" />
        </Link>
      )}
    </nav>
  )
}
