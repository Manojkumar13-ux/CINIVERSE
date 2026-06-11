import { Suspense } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { MediaDetail } from "@/components/media-detail"
import { getMovieDetails } from "@/lib/api"
import { getTitle } from "@/lib/tmdb"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const movie = await getMovieDetails(Number.parseInt(params.id))
    return {
      title: `${getTitle(movie)} - CineVerse`,
      description: movie.overview,
    }
  } catch {
    return {
      title: "Movie - CineVerse",
    }
  }
}

export default async function MoviePage({ params }: { params: { id: string } }) {
  const movie = await getMovieDetails(Number.parseInt(params.id))

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Suspense fallback={<div className="h-screen skeleton" />}>
          <MediaDetail item={movie} mediaType="movie" />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
