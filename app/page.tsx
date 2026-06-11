import { Suspense } from "react"
import { Navbar } from "@/components/navbar"
import { HeroCarousel } from "@/components/hero-carousel"
import { MediaCarousel } from "@/components/media-carousel"
import { Footer } from "@/components/footer"
import { getTrending, discoverMovies, discoverTV, discoverAnime } from "@/lib/api"

export const dynamic = "force-dynamic"

async function HomeContent() {
  try {
    const [trendingData, moviesData, tvData, animeData] = await Promise.all([
      getTrending("all", "week"),
      discoverMovies(1, "popularity.desc"),
      discoverTV(1, "popularity.desc"),
      discoverAnime(1),
    ])

    const heroItems = trendingData.results.slice(0, 5)

    return (
      <>
        <section className="container mx-auto px-4 pt-24 pb-8">
          <HeroCarousel items={heroItems} />
        </section>
        <section className="container mx-auto px-4 space-y-8 pb-8">
          <MediaCarousel title="Trending This Week" items={trendingData.results.slice(5, 25)} />
          <MediaCarousel title="Popular Movies" items={moviesData.results} mediaType="movie" />
          <MediaCarousel title="Popular TV Series" items={tvData.results} mediaType="tv" />
          <MediaCarousel title="Popular Anime" items={animeData.results} mediaType="anime" />
        </section>
      </>
    )
  } catch (error) {
    console.error("[v0] Error loading home page:", error)
    return (
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="glass-card rounded-3xl p-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Unable to Load Content</h2>
          <p className="text-muted-foreground mb-6">
            There was an error loading the movie data. Please check the server logs for more details.
          </p>
        </div>
      </div>
    )
  }
}

function LoadingSkeleton() {
  return (
    <div className="container mx-auto px-4 pt-24 pb-12 space-y-12">
      <div className="w-full h-[70vh] min-h-[500px] max-h-[800px] rounded-3xl skeleton" />
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="space-y-4">
          <div className="h-8 w-64 skeleton rounded-lg" />
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3, 4, 5, 6].map((j) => (
              <div key={j} className="flex-shrink-0 w-48 aspect-[2/3] skeleton rounded-xl" />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Suspense fallback={<LoadingSkeleton />}>
          <HomeContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
