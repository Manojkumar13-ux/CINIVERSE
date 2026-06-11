"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { ChevronDown, Loader2 } from "lucide-react"
import { getImageUrl } from "@/lib/tmdb"

interface Season {
  season_number: number
  name: string
  episode_count: number
  air_date?: string
  poster_path: string | null
}

interface Episode {
  id: number
  name: string
  still_path: string | null
  overview: string
  episode_number: number
  air_date?: string
  vote_average?: number
}

export function EpisodesPanel({ tvId, seasons }: { tvId: number; seasons?: Season[] }) {
  const validSeasons = (seasons || []).filter((s) => s.season_number > 0)
  const [season, setSeason] = useState<number>(validSeasons[0]?.season_number ?? 1)
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let active = true
    async function load() {
      try {
        setLoading(true)
        const params = new URLSearchParams({
          endpoint: `/tv/${tvId}/season/${season}`,
        })
        const res = await fetch(`/api/tmdb?${params.toString()}`)
        if (!res.ok) throw new Error("Failed to load episodes")
        const data = await res.json()
        if (!active) return
        setEpisodes(data.episodes || [])
      } catch {
        setEpisodes([])
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [tvId, season])

  if (validSeasons.length === 0) return null

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium">Season</label>
        <div className="relative">
          <select
            value={season}
            onChange={(e) => setSeason(Number(e.target.value))}
            className="appearance-none pr-10 pl-3 py-2 bg-background/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
          >
            {validSeasons.map((s) => (
              <option key={s.season_number} value={s.season_number}>
                {s.name || `Season ${s.season_number}`} ({s.episode_count})
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading episodes...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {episodes.map((ep) => (
            <div key={ep.id} className="glass rounded-xl overflow-hidden">
              <div className="relative aspect-video bg-muted">
                <Image
                  src={getImageUrl(ep.still_path, "w780") || "/placeholder.svg"}
                  alt={ep.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div className="p-4 space-y-1">
                <p className="text-sm font-semibold line-clamp-1">
                  {ep.episode_number}. {ep.name}
                </p>
                {ep.air_date && <p className="text-xs text-muted-foreground">{ep.air_date}</p>}
                <p className="text-xs text-muted-foreground line-clamp-2">{ep.overview || "No overview available."}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
