import { Suspense } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { MediaCard } from "@/components/media-card"
import { Pagination } from "@/components/pagination"
import { discoverAnime } from "@/lib/api"
import { ContentFilters } from "@/components/content-filters"

export const dynamic = "force-dynamic"

async function AnimeContent({ page, lang, q }: { page: number; lang?: string; q?: string }) {
  const data = await discoverAnime(page, {
    originalLanguage: lang || undefined,
    minRating: q ? Number(q) : undefined,
  })

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-serif font-bold">Popular Anime</h1>
        <p className="text-muted-foreground">Discover the most popular anime series right now</p>
      </div>
      <ContentFilters /> {/* Added filters */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {data.results.map((item) => (
          <MediaCard key={item.id} item={item} mediaType="anime" />
        ))}
      </div>
      {data.total_pages > 1 && <Pagination currentPage={page} totalPages={data.total_pages} baseUrl="/anime" />}
    </div>
  )
}

export default function AnimePage({ searchParams }: { searchParams: { page?: string; lang?: string; q?: string } }) {
  const page = Number.parseInt(searchParams.page || "1", 10)
  const lang = searchParams.lang || ""
  const q = searchParams.q || ""

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
          <AnimeContent page={page} lang={lang} q={q} />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
