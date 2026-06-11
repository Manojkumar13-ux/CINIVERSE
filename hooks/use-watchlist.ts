"use client"

import { useState, useEffect } from "react"
import {
  getWatchlist,
  addToWatchlist as addToWatchlistLib,
  removeFromWatchlist as removeFromWatchlistLib,
  isInWatchlist as isInWatchlistLib,
  getWatchlistCount,
  type WatchlistItem,
} from "@/lib/watchlist"
import type { Movie } from "@/lib/tmdb"

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([])
  const [count, setCount] = useState(0)

  // Load watchlist on mount
  useEffect(() => {
    setWatchlist(getWatchlist())
    setCount(getWatchlistCount())

    // Listen for watchlist updates
    const handleUpdate = () => {
      setWatchlist(getWatchlist())
      setCount(getWatchlistCount())
    }

    window.addEventListener("watchlistUpdated", handleUpdate)
    return () => window.removeEventListener("watchlistUpdated", handleUpdate)
  }, [])

  const addToWatchlist = (item: Movie, mediaType: "movie" | "tv" | "anime") => {
    const success = addToWatchlistLib(item, mediaType)
    if (success) {
      setWatchlist(getWatchlist())
      setCount(getWatchlistCount())
    }
    return success
  }

  const removeFromWatchlist = (id: number, mediaType: "movie" | "tv" | "anime") => {
    const success = removeFromWatchlistLib(id, mediaType)
    if (success) {
      setWatchlist(getWatchlist())
      setCount(getWatchlistCount())
    }
    return success
  }

  const isInWatchlist = (id: number, mediaType: "movie" | "tv" | "anime") => {
    return isInWatchlistLib(id, mediaType)
  }

  return {
    watchlist,
    count,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
  }
}
