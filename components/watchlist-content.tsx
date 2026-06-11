"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Trash2, Download, Upload, Film, Tv, Sparkles, Star } from "lucide-react"
import { useWatchlist } from "@/hooks/use-watchlist"
import { getImageUrl } from "@/lib/tmdb"
import { exportWatchlist, importWatchlist, clearWatchlist } from "@/lib/watchlist"

export function WatchlistContent() {
  const { watchlist, removeFromWatchlist } = useWatchlist()
  const [filter, setFilter] = useState<"all" | "movie" | "tv" | "anime">("all")

  const filteredWatchlist = filter === "all" ? watchlist : watchlist.filter((item) => item.media_type === filter)

  const handleExport = () => {
    const json = exportWatchlist()
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `cineverse-watchlist-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "application/json"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
          const json = event.target?.result as string
          if (importWatchlist(json)) {
            window.location.reload()
          } else {
            alert("Failed to import watchlist. Invalid file format.")
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  const handleClearAll = () => {
    if (confirm("Are you sure you want to clear your entire watchlist? This cannot be undone.")) {
      clearWatchlist()
      window.location.reload()
    }
  }

  const getYear = (item: (typeof watchlist)[0]) => {
    const date = item.release_date || item.first_air_date
    return date ? new Date(date).getFullYear() : "TBA"
  }

  if (watchlist.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="text-6xl">📚</div>
        <h2 className="text-2xl font-serif font-bold">Your Watchlist is Empty</h2>
        <p className="text-muted-foreground text-center max-w-md">
          Start adding movies, TV shows, and anime to your watchlist to keep track of what you want to watch.
        </p>
        <Link
          href="/"
          className="px-6 py-3 bg-accent text-white rounded-full font-medium hover:bg-accent/90 transition-colors"
        >
          Browse Content
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold">My Watchlist</h1>
          <p className="text-muted-foreground mt-2">{watchlist.length} items saved</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 glass rounded-full text-sm font-medium hover:bg-white/20 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={handleImport}
            className="flex items-center gap-2 px-4 py-2 glass rounded-full text-sm font-medium hover:bg-white/20 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Import
          </button>
          <button
            onClick={handleClearAll}
            className="flex items-center gap-2 px-4 py-2 glass rounded-full text-sm font-medium hover:bg-destructive/20 text-destructive transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            filter === "all" ? "bg-accent text-white" : "glass hover:bg-white/20"
          }`}
        >
          All ({watchlist.length})
        </button>
        <button
          onClick={() => setFilter("movie")}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            filter === "movie" ? "bg-accent text-white" : "glass hover:bg-white/20"
          }`}
        >
          <Film className="w-4 h-4" />
          Movies ({watchlist.filter((i) => i.media_type === "movie").length})
        </button>
        <button
          onClick={() => setFilter("tv")}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            filter === "tv" ? "bg-accent text-white" : "glass hover:bg-white/20"
          }`}
        >
          <Tv className="w-4 h-4" />
          TV Series ({watchlist.filter((i) => i.media_type === "tv").length})
        </button>
        <button
          onClick={() => setFilter("anime")}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            filter === "anime" ? "bg-accent text-white" : "glass hover:bg-white/20"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Anime ({watchlist.filter((i) => i.media_type === "anime").length})
        </button>
      </div>

      {/* Watchlist Grid */}
      {filteredWatchlist.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">No items in this category</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredWatchlist.map((item) => (
            <div key={`${item.media_type}-${item.id}`} className="group relative">
              <Link href={`/${item.media_type === "tv" ? "tv" : "movie"}/${item.id}`} className="block">
                <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-muted hover-lift">
                  <Image
                    src={getImageUrl(item.poster_path, "w342") || "/placeholder.svg"}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    loading="lazy"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Type Badge */}
                  <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-black/60 backdrop-blur-sm text-xs font-medium text-white">
                    {item.media_type === "tv" ? "TV" : item.media_type === "anime" ? "Anime" : "Movie"}
                  </div>

                  {/* Rating */}
                  {item.vote_average > 0 && (
                    <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-full bg-black/60 backdrop-blur-sm">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      <span className="text-xs font-medium text-white">{item.vote_average.toFixed(1)}</span>
                    </div>
                  )}

                  {/* Info */}
                  <div className="absolute inset-x-0 bottom-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <h3 className="font-semibold text-white text-sm line-clamp-2 mb-1">{item.title}</h3>
                    <p className="text-xs text-gray-300">{getYear(item)}</p>
                  </div>
                </div>
              </Link>

              {/* Remove Button */}
              <button
                onClick={() => removeFromWatchlist(item.id, item.media_type)}
                className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-destructive/80 hover:bg-destructive text-white opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove from watchlist"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
