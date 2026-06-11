import { Suspense } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { GenreResults } from "@/components/genre-results"
import { getGenres } from "@/lib/api"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const [movieGenres, tvGenres] = await Promise.all([getGenres("movie"), getGenres("tv")])
    const allGenres = [...movieGenres.genres, ...tvGenres.genres]
    const genre = allGenres.find((g) => g.id === Number.parseInt(params.id))

    return {
      title: genre ? `${genre.name} - CineVerse` : "Genre - CineVerse",
      description: `Browse ${genre?.name || "genre"} movies and TV shows`,
    }
  } catch {
    return {
      title: "Genre - CineVerse",
    }
  }
}

export default function GenrePage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { type?: string; page?: string }
}) {
  const genreId = Number.parseInt(params.id)
  const type = (searchParams.type as "movie" | "tv") || "movie"
  const page = Number.parseInt(searchParams.page || "1", 10)

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <Suspense
          fallback={
            <div className="space-y-8">
              <div className="h-12 w-96 skeleton rounded-lg" />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {[...Array(20)].map((_, i) => (
                  <div key={i} className="aspect-[2/3] skeleton rounded-xl" />
                ))}
              </div>
            </div>
          }
        >
          <GenreResults genreId={genreId} type={type} page={page} />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
