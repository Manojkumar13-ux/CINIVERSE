"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Star, Bookmark, MoreVertical, Play, Share2 } from "lucide-react"
import { type Movie, getTitle, getYear, getImageUrl, type MediaType } from "@/lib/tmdb"
import { useWatchlist } from "@/hooks/use-watchlist"

interface MediaCardProps {
  item: Movie
  mediaType?: MediaType
}

export function MediaCard({ item, mediaType }: MediaCardProps) {
  const [showMenu, setShowMenu] = useState(false)
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist()
  const [inWatchlist, setInWatchlist] = useState(false)

  const type = mediaType || item.media_type || "movie"
  const href = `/${type === "tv" ? "tv" : "movie"}/${item.id}`

  // Check if in watchlist on mount
  useEffect(() => {
    setInWatchlist(isInWatchlist(item.id, type))
  }, [item.id, type, isInWatchlist])

  const accentColor = type === "tv" ? "blue" : type === "anime" ? "pink" : "purple"
  const accentClass = {
    blue: "border-blue-500/50 shadow-blue-500/20",
    pink: "border-pink-500/50 shadow-pink-500/20",
    purple: "border-purple-500/50 shadow-purple-500/20",
  }[accentColor]

  const handleWatchlistToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    if (inWatchlist) {
      removeFromWatchlist(item.id, type)
      setInWatchlist(false)
    } else {
      addToWatchlist(item, type)
      setInWatchlist(true)
    }
    setShowMenu(false)
  }

  return (
    <div className="group relative">
      <Link href={href} className="block">
        <div
          className={`relative aspect-[2/3] rounded-xl overflow-hidden bg-muted border-2 border-transparent hover:${accentClass} transition-all duration-300 hover-lift`}
        >
          {/* Poster Image */}
          <Image
            src={getImageUrl(item.poster_path, "w342") || "/placeholder.svg"}
            alt={getTitle(item)}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            loading="lazy"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Type Badge (Top Right) */}
          <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-black/60 backdrop-blur-sm text-xs font-medium text-white">
            {type === "tv" ? "TV" : type === "anime" ? "Anime" : "Movie"}
          </div>

          {/* Rating Badge (Top Left) */}
          {item.vote_average > 0 && (
            <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-full bg-black/60 backdrop-blur-sm">
              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
              <span className="text-xs font-medium text-white">{item.vote_average.toFixed(1)}</span>
            </div>
          )}

          {/* Hover Content */}
          <div className="absolute inset-x-0 bottom-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <h3 className="font-semibold text-white text-sm line-clamp-2 mb-1">{getTitle(item)}</h3>
            <p className="text-xs text-gray-300">{getYear(item)}</p>
          </div>
        </div>
      </Link>

      {/* Action Menu */}
      <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-1.5 rounded-full bg-black/60 backdrop-blur-sm hover:bg-black/80 transition-colors"
          aria-label="More actions"
        >
          <MoreVertical className="w-4 h-4 text-white" />
        </button>

        {showMenu && (
          <div className="absolute top-full right-0 mt-1 w-48 glass rounded-xl overflow-hidden shadow-xl">
            <Link href={href} className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 transition-colors text-sm">
              <Play className="w-4 h-4" />
              View Details
            </Link>
            <button
              onClick={handleWatchlistToggle}
              className="w-full flex items-center gap-2 px-4 py-2 hover:bg-white/10 transition-colors text-sm"
            >
              <Bookmark className={`w-4 h-4 ${inWatchlist ? "fill-current" : ""}`} />
              {inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
            </button>
            <button className="w-full flex items-center gap-2 px-4 py-2 hover:bg-white/10 transition-colors text-sm">
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
