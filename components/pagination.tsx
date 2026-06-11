import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  baseUrl: string
}

export function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
  const maxPages = Math.min(totalPages, 500) // TMDb limit
  const showPages = 5

  // Calculate page range to show
  let startPage = Math.max(1, currentPage - Math.floor(showPages / 2))
  const endPage = Math.min(maxPages, startPage + showPages - 1)

  if (endPage - startPage < showPages - 1) {
    startPage = Math.max(1, endPage - showPages + 1)
  }

  const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i)

  const getPageUrl = (page: number) => {
    const separator = baseUrl.includes("?") ? "&" : "?"
    return `${baseUrl}${separator}page=${page}`
  }

  return (
    <nav className="flex items-center justify-center gap-2 flex-wrap" aria-label="Pagination">
      {/* Previous */}
      {currentPage > 1 ? (
        <Link
          href={getPageUrl(currentPage - 1)}
          className="p-2 glass rounded-lg hover:bg-white/20 transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
      ) : (
        <div className="p-2 glass rounded-lg opacity-30 cursor-not-allowed">
          <ChevronLeft className="w-5 h-5" />
        </div>
      )}

      {/* First page */}
      {startPage > 1 && (
        <>
          <Link
            href={getPageUrl(1)}
            className="min-w-[40px] h-10 flex items-center justify-center glass rounded-lg hover:bg-white/20 transition-colors text-sm font-medium"
          >
            1
          </Link>
          {startPage > 2 && <span className="px-2 text-muted-foreground">...</span>}
        </>
      )}

      {/* Page numbers */}
      {pages.map((page) => (
        <Link
          key={page}
          href={getPageUrl(page)}
          className={`min-w-[40px] h-10 flex items-center justify-center rounded-lg transition-colors text-sm font-medium ${
            page === currentPage ? "bg-accent text-white" : "glass hover:bg-white/20"
          }`}
          aria-current={page === currentPage ? "page" : undefined}
        >
          {page}
        </Link>
      ))}

      {/* Last page */}
      {endPage < maxPages && (
        <>
          {endPage < maxPages - 1 && <span className="px-2 text-muted-foreground">...</span>}
          <Link
            href={getPageUrl(maxPages)}
            className="min-w-[40px] h-10 flex items-center justify-center glass rounded-lg hover:bg-white/20 transition-colors text-sm font-medium"
          >
            {maxPages}
          </Link>
        </>
      )}

      {/* Next */}
      {currentPage < maxPages ? (
        <Link
          href={getPageUrl(currentPage + 1)}
          className="p-2 glass rounded-lg hover:bg-white/20 transition-colors"
          aria-label="Next page"
        >
          <ChevronRight className="w-5 h-5" />
        </Link>
      ) : (
        <div className="p-2 glass rounded-lg opacity-30 cursor-not-allowed">
          <ChevronRight className="w-5 h-5" />
        </div>
      )}
    </nav>
  )
}
