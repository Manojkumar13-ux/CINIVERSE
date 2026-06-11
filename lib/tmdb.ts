// TMDb API configuration and types
export const TMDB_BASE_URL = "https://api.themoviedb.org/3"
export const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p"

// Image size configurations
export const IMAGE_SIZES = {
  poster: {
    small: "w185",
    medium: "w342",
    large: "w500",
    xlarge: "w780",
    original: "original",
  },
  backdrop: {
    small: "w300",
    medium: "w780",
    large: "w1280",
    original: "original",
  },
  profile: {
    small: "w45",
    medium: "w185",
    large: "h632",
  },
}

// Types
export type MediaType = "movie" | "tv" | "anime"

export interface Genre {
  id: number
  name: string
}

export interface Video {
  id: string
  key: string
  name: string
  site: string
  type: string
  official: boolean
}

export interface Cast {
  id: number
  name: string
  character: string
  profile_path: string | null
  order: number
}

export interface Crew {
  id: number
  name: string
  job: string
  department: string
  profile_path: string | null
}

export interface Season {
  season_number: number
  name: string
  episode_count: number
  air_date?: string
  poster_path: string | null
}

export interface Movie {
  id: number
  title: string
  name?: string
  original_title?: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  first_air_date?: string
  vote_average: number
  vote_count: number
  popularity: number
  genre_ids: number[]
  genres?: Genre[]
  media_type?: MediaType
  runtime?: number
  videos?: { results: Video[] }
  credits?: { cast: Cast[]; crew: Crew[] }
  images?: { backdrops: any[]; posters: any[] }
  similar?: { results: Movie[] }
  recommendations?: { results: Movie[] }
  seasons?: Season[]
  number_of_seasons?: number
}

export interface TMDbResponse<T> {
  page: number
  results: T[]
  total_pages: number
  total_results: number
}

// Helper to get image URL with srcset
export function getImageUrl(path: string | null, size = "w500"): string {
  if (!path) return "/abstract-movie-poster.png"
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`
}

export function getImageSrcSet(path: string | null, type: "poster" | "backdrop" = "poster"): string {
  if (!path) return ""

  const sizes =
    type === "poster"
      ? [IMAGE_SIZES.poster.small, IMAGE_SIZES.poster.medium, IMAGE_SIZES.poster.large]
      : [IMAGE_SIZES.backdrop.small, IMAGE_SIZES.backdrop.medium, IMAGE_SIZES.backdrop.large]

  return sizes.map((size, index) => `${TMDB_IMAGE_BASE_URL}/${size}${path} ${(index + 1) * 500}w`).join(", ")
}

// Extract dominant color from poster (simplified - returns accent based on media type)
export function getAccentColor(mediaType?: MediaType): string {
  switch (mediaType) {
    case "tv":
      return "rgb(59, 130, 246)" // blue
    case "anime":
      return "rgb(236, 72, 153)" // pink
    default:
      return "rgb(168, 85, 247)" // purple
  }
}

// Get display title
export function getTitle(item: Movie): string {
  return item.title || item.name || item.original_title || "Untitled"
}

// Get release year
export function getYear(item: Movie): string {
  const date = item.release_date || item.first_air_date
  return date ? new Date(date).getFullYear().toString() : "TBA"
}

// Format runtime
export function formatRuntime(minutes?: number): string {
  if (!minutes) return "N/A"
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
}

export function getTMDBApiKey(): string {
  // Only accessed on the server (route handlers / server actions)
  return process.env.TMDB_API_KEY || ""
}
