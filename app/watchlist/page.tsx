"use client"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { WatchlistContent } from "@/components/watchlist-content"

export default function WatchlistPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <WatchlistContent />
      </main>
      <Footer />
    </div>
  )
}
