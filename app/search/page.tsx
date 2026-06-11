import { Suspense } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { SearchResults } from "@/components/search-results"
import { SearchBar } from "@/components/search-bar"
import { X, Search } from "lucide-react"
import Link from "next/link"

export default function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string; page?: string }
}) {
  const query = searchParams.q || ""
  const page = Number.parseInt(searchParams.page || "1", 10)

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Search className="w-5 h-5 text-muted-foreground" />
            <h1 className="text-lg font-semibold">Search</h1>
          </div>
          <Link href="/" aria-label="Close search" className="p-2 rounded-full hover:bg-accent/10 transition-colors">
            <X className="w-6 h-6" />
          </Link>
        </div>

        <div className="max-w-2xl">
          <SearchBar />
        </div>

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
          <SearchResults query={query} page={page} />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
