"use client"

import type { Movie } from "./tmdb"

const WATCHLIST_KEY = "cineverse_watchlist"

export interface WatchlistItem {
  id: number
  title: string
  poster_path: string | null
  media_type: "movie" | "tv" | "anime"
  vote_average: number
  release_date?: string
  first_air_date?: string
  addedAt: number
}

// Get watchlist from localStorage
export function getWatchlist(): WatchlistItem[] {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem(WATCHLIST_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

// Save watchlist to localStorage
function saveWatchlist(items: WatchlistItem[]): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(items))
    // Dispatch custom event for real-time updates
    window.dispatchEvent(new CustomEvent("watchlistUpdated"))
  } catch (error) {
    console.error("Failed to save watchlist:", error)
  }
}

// Add item to watchlist
export function addToWatchlist(item: Movie, mediaType: "movie" | "tv" | "anime"): boolean {
  const watchlist = getWatchlist()

  // Check if already in watchlist
  if (watchlist.some((w) => w.id === item.id && w.media_type === mediaType)) {
    return false
  }

  const newItem: WatchlistItem = {
    id: item.id,
    title: item.title || item.name || "",
    poster_path: item.poster_path,
    media_type: mediaType,
    vote_average: item.vote_average,
    release_date: item.release_date,
    first_air_date: item.first_air_date,
    addedAt: Date.now(),
  }

  watchlist.unshift(newItem) // Add to beginning
  saveWatchlist(watchlist)
  return true
}

// Remove item from watchlist
export function removeFromWatchlist(id: number, mediaType: "movie" | "tv" | "anime"): boolean {
  const watchlist = getWatchlist()
  const filtered = watchlist.filter((item) => !(item.id === id && item.media_type === mediaType))

  if (filtered.length === watchlist.length) {
    return false // Item not found
  }

  saveWatchlist(filtered)
  return true
}

// Check if item is in watchlist
export function isInWatchlist(id: number, mediaType: "movie" | "tv" | "anime"): boolean {
  const watchlist = getWatchlist()
  return watchlist.some((item) => item.id === id && item.media_type === mediaType)
}

// Get watchlist count
export function getWatchlistCount(): number {
  return getWatchlist().length
}

// Clear entire watchlist
export function clearWatchlist(): void {
  saveWatchlist([])
}

// Export watchlist as JSON
export function exportWatchlist(): string {
  return JSON.stringify(getWatchlist(), null, 2)
}

// Import watchlist from JSON
export function importWatchlist(jsonString: string): boolean {
  try {
    const items = JSON.parse(jsonString)
    if (Array.isArray(items)) {
      saveWatchlist(items)
      return true
    }
    return false
  } catch {
    return false
  }
}
