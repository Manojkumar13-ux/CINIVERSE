import { searchMulti } from "@/lib/api"
import { MediaCard } from "./media-card"
import { SearchFilters } from "./search-filters"
import { Pagination } from "./pagination"

interface SearchResultsProps {
  query: string
  page: number
}

export async function SearchResults({ query, page }: SearchResultsProps) {
  if (!query.trim()) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="text-6xl">🔍</div>
        <h2 className="text-2xl font-serif font-bold">Start Searching</h2>
        <p className="text-muted-foreground text-center max-w-md">
          Use the search bar above to discover movies, TV shows, anime, and more.
        </p>
      </div>
    )
  }

  const data = await searchMulti(query, page)

  if (!data.results.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="text-6xl">😕</div>
        <h2 className="text-2xl font-serif font-bold">No Results Found</h2>
        <p className="text-muted-foreground text-center max-w-md">
          We couldn't find anything matching "{query}". Try different keywords or check your spelling.
        </p>
      </div>
    )
  }

  // Filter out people from results
  const mediaResults = data.results.filter((item) => item.media_type !== "person")

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-serif font-bold">Search Results for "{query}"</h1>
        <p className="text-muted-foreground">Found {data.total_results.toLocaleString()} results</p>
      </div>

      {/* Filters */}
      <SearchFilters />

      {/* Results Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {mediaResults.map((item) => (
          <MediaCard key={`${item.media_type}-${item.id}`} item={item} />
        ))}
      </div>

      {/* Pagination */}
      {data.total_pages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={data.total_pages}
          baseUrl={`/search?q=${encodeURIComponent(query)}`}
        />
      )}
    </div>
  )
}
