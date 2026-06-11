import { discoverByGenre, getGenres } from "@/lib/api"
import { MediaCard } from "./media-card"
import { Pagination } from "./pagination"
import Link from "next/link"

interface GenreResultsProps {
  genreId: number
  type: "movie" | "tv"
  page: number
}

export async function GenreResults({ genreId, type, page }: GenreResultsProps) {
  const [data, genresData] = await Promise.all([discoverByGenre(genreId, type, page), getGenres(type)])

  const genre = genresData.genres.find((g) => g.id === genreId)

  if (!genre) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="text-6xl">🎬</div>
        <h2 className="text-2xl font-serif font-bold">Genre Not Found</h2>
        <p className="text-muted-foreground text-center max-w-md">
          The genre you're looking for doesn't exist or has been removed.
        </p>
        <Link
          href="/genres"
          className="px-6 py-3 bg-accent text-white rounded-full font-medium hover:bg-accent/90 transition-colors"
        >
          Browse All Genres
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-3xl md:text-4xl font-serif font-bold">{genre.name}</h1>
        <p className="text-muted-foreground">
          Found {data.total_results.toLocaleString()} {type === "movie" ? "movies" : "TV shows"}
        </p>

        {/* Type Toggle */}
        <div className="flex items-center gap-2">
          <Link
            href={`/genres/${genreId}?type=movie`}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              type === "movie" ? "bg-accent text-white" : "glass hover:bg-white/20"
            }`}
          >
            Movies
          </Link>
          <Link
            href={`/genres/${genreId}?type=tv`}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              type === "tv" ? "bg-accent text-white" : "glass hover:bg-white/20"
            }`}
          >
            TV Series
          </Link>
        </div>
      </div>

      {/* Results Grid */}
      {data.results.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">No results found for this genre</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {data.results.map((item) => (
            <MediaCard key={item.id} item={item} mediaType={type} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {data.total_pages > 1 && (
        <Pagination currentPage={page} totalPages={data.total_pages} baseUrl={`/genres/${genreId}?type=${type}`} />
      )}
    </div>
  )
}
