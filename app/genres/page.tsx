import { Suspense } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { GenreGrid } from "@/components/genre-grid"
import { getGenres } from "@/lib/api"

export const dynamic = "force-dynamic"

async function GenresContent() {
  const [movieGenres, tvGenres] = await Promise.all([getGenres("movie"), getGenres("tv")])

  // Combine and deduplicate genres
  const allGenres = [...movieGenres.genres, ...tvGenres.genres]
  const uniqueGenres = Array.from(new Map(allGenres.map((g) => [g.id, g])).values()).sort((a, b) =>
    a.name.localeCompare(b.name),
  )

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-serif font-bold">Browse by Genre</h1>
        <p className="text-muted-foreground">Discover movies and TV shows by your favorite genres</p>
      </div>

      <GenreGrid genres={uniqueGenres} />
    </div>
  )
}

export default function GenresPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <Suspense
          fallback={
            <div className="space-y-8">
              <div className="h-12 w-96 skeleton rounded-lg" />
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(16)].map((_, i) => (
                  <div key={i} className="h-32 skeleton rounded-2xl" />
                ))}
              </div>
            </div>
          }
        >
          <GenresContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
