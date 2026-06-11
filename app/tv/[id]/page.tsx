import { Suspense } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { MediaDetail } from "@/components/media-detail"
import { getTVDetails } from "@/lib/api"
import { getTitle } from "@/lib/tmdb"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const tv = await getTVDetails(Number.parseInt(params.id))
    return {
      title: `${getTitle(tv)} - CineVerse`,
      description: tv.overview,
    }
  } catch {
    return {
      title: "TV Show - CineVerse",
    }
  }
}

export default async function TVPage({ params }: { params: { id: string } }) {
  const tv = await getTVDetails(Number.parseInt(params.id))

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Suspense fallback={<div className="h-screen skeleton" />}>
          <MediaDetail item={tv} mediaType="tv" />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
