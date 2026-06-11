"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Play, Bookmark, Share2, Star, Clock, Calendar, X } from "lucide-react"
import type { Movie, MediaType } from "@/lib/tmdb"
import { getTitle, getYear, getImageUrl, formatRuntime } from "@/lib/tmdb"
import { useWatchlist } from "@/hooks/use-watchlist"
import { EpisodesPanel } from "./episodes-panel"
import { MediaCard } from "./media-card"

interface MediaDetailProps {
  item: Movie
  mediaType: MediaType
}

export function MediaDetail({ item, mediaType }: MediaDetailProps) {
  const [showTrailer, setShowTrailer] = useState(false)
  const [activeTab, setActiveTab] = useState<"description" | "cast">("description")
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist()
  const [inWatchlist, setInWatchlist] = useState(false)

  useEffect(() => {
    setInWatchlist(isInWatchlist(item.id, mediaType))
  }, [item.id, mediaType, isInWatchlist])

  const trailer = item.videos?.results.find((v) => v.type === "Trailer" && v.site === "YouTube")

  const cast = item.credits?.cast.slice(0, 10) || []

  const director = item.credits?.crew.find((c) => c.job === "Director")

  const relatedItems = [
    ...(item.similar?.results.slice(0, 6) || []),
    ...(item.recommendations?.results.slice(0, 6) || []),
  ].slice(0, 12)

  const handleWatchlistToggle = () => {
    if (inWatchlist) {
      removeFromWatchlist(item.id, mediaType)
      setInWatchlist(false)
    } else {
      addToWatchlist(item, mediaType)
      setInWatchlist(true)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: getTitle(item),
          text: item.overview,
          url: window.location.href,
        })
      } catch {
        // ignore
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert("Link copied to clipboard!")
    }
  }

  return (
    <div className="relative overflow-hidden">
      <div className="relative h-[55vh] min-h-[420px] md:h-[60vh] md:min-h-[500px] max-h-[720px]">
        <div className="absolute inset-0">
          <Image
            src={getImageUrl(item.backdrop_path, "w1280") || "/placeholder.svg"}
            alt={getTitle(item)}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent" />
        </div>

        <div className="relative h-full container mx-auto px-4 flex items-end pb-8 pt-16 md:pt-0">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 w-full items-center md:items-end">
            <div className="flex-shrink-0">
              <div className="relative w-40 sm:w-52 md:w-64 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl glass mx-auto">
                <Image
                  src={getImageUrl(item.poster_path, "w500") || "/placeholder.svg"}
                  alt={getTitle(item)}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 176px, 256px"
                  priority
                />
              </div>
            </div>

            <div className="flex-1 space-y-4 text-center md:text-left">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-balance">
                {getTitle(item)}
              </h1>

              <div className="flex items-center justify-center md:justify-start gap-4 flex-wrap">
                <span className="px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-medium">
                  {mediaType === "tv" ? "TV Series" : mediaType === "anime" ? "Anime" : "Movie"}
                </span>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{getYear(item)}</span>
                </div>
                {!!item.runtime && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{formatRuntime(item.runtime)}</span>
                  </div>
                )}
                {item.vote_average > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-medium">{item.vote_average.toFixed(1)}</span>
                    <span className="text-xs text-muted-foreground">({item.vote_count.toLocaleString()} votes)</span>
                  </div>
                )}
              </div>

              {item.genres && item.genres.length > 0 && (
                <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
                  {item.genres.map((genre) => (
                    <Link
                      key={genre.id}
                      href={`/genres/${genre.id}`}
                      className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-xs font-medium transition-colors"
                    >
                      {genre.name}
                    </Link>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-center md:justify-start gap-3 flex-wrap">
                {trailer && (
                  <button
                    onClick={() => setShowTrailer(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-full font-medium hover:bg-accent/90 transition-colors"
                  >
                    <Play className="w-4 h-4" />
                    Watch Trailer
                  </button>
                )}
                <button
                  onClick={handleWatchlistToggle}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-colors ${
                    inWatchlist ? "bg-accent text-white" : "glass hover:bg-white/20"
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${inWatchlist ? "fill-current" : ""}`} />
                  {inWatchlist ? "Saved" : "Save"}
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-6 py-3 glass rounded-full font-medium hover:bg-white/20 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        <section className="mx-auto max-w-4xl space-y-4">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <button
              onClick={() => setActiveTab("description")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === "description" ? "bg-accent text-white" : "glass hover:bg-white/10"
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab("cast")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === "cast" ? "bg-accent text-white" : "glass hover:bg-white/10"
              }`}
            >
              Cast
            </button>
          </div>

          {activeTab === "description" && (
            <div className="space-y-3">
              <h2 className="text-xl font-serif font-bold">Overview</h2>
              <p className="text-muted-foreground leading-relaxed text-pretty">{item.overview}</p>
              {(director || cast.length > 0) && (
                <div className="text-sm space-y-1">
                  {director && (
                    <p>
                      <span className="text-muted-foreground">Director:</span>{" "}
                      <span className="font-medium">{director.name}</span>
                    </p>
                  )}
                  {cast.length > 0 && (
                    <p className="text-pretty">
                      <span className="text-muted-foreground">Cast:</span>{" "}
                      <span className="font-medium">
                        {cast
                          .slice(0, 6)
                          .map((c) => c.name)
                          .join(", ")}
                        {cast.length > 6 ? "…" : ""}
                      </span>
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === "cast" && (
            <div className="space-y-3">
              <h2 className="text-xl font-serif font-bold">Cast</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {cast.map((person) => (
                  <div key={person.id} className="space-y-2">
                    <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-muted">
                      <Image
                        src={getImageUrl(person.profile_path, "w185") || "/placeholder.svg"}
                        alt={person.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
                        loading="lazy"
                      />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium line-clamp-2">{person.name}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">{person.character}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {mediaType === "tv" && (
          <section className="space-y-3">
            <h2 className="text-xl font-serif font-bold">Episodes</h2>
            <EpisodesPanel tvId={item.id} seasons={item.seasons} />
          </section>
        )}

        {relatedItems.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-xl font-serif font-bold">You May Like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {relatedItems.map((rel) => (
                <div key={rel.id} className="w-full">
                  <MediaCard item={rel} mediaType={mediaType} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {showTrailer && trailer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden">
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
              aria-label="Close trailer"
            >
              <X className="w-6 h-6 text-white" />
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
              title={trailer.name}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>
      )}
    </div>
  )
}
