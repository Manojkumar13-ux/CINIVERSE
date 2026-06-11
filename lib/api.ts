import type { Movie, TMDbResponse } from "./tmdb"
import { TMDB_BASE_URL, getTMDBApiKey } from "./tmdb"

const isServer = typeof window === "undefined"

// Base fetch function with retry logic
async function fetchWithRetry(url: string, retries = 3, backoff = 300): Promise<Response> {
  try {
    const response = await fetch(url, {
      next: isServer ? { revalidate: 3600 } : undefined,
    })

    if (response.status === 429 && retries > 0) {
      // Rate limited - exponential backoff
      await new Promise((resolve) => setTimeout(resolve, backoff))
      return fetchWithRetry(url, retries - 1, backoff * 2)
    }

    return response
  } catch (error) {
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, backoff))
      return fetchWithRetry(url, retries - 1, backoff * 2)
    }
    throw error
  }
}

async function tmdbFetch<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  console.log("[v0] Fetching from TMDb:", endpoint)

  if (isServer) {
    // Server-side: call TMDb directly
    const apiKey = getTMDBApiKey()
    if (!apiKey) {
      throw new Error("TMDB_API_KEY is not configured")
    }

    const searchParams = new URLSearchParams({
      api_key: apiKey,
      ...params,
    })

    const url = `${TMDB_BASE_URL}${endpoint}?${searchParams.toString()}`
    const response = await fetchWithRetry(url)

    if (!response.ok) {
      const error = await response.json().catch(() => ({ status_message: "Unknown error" }))
      throw new Error(error.status_message || `TMDb API error: ${response.status}`)
    }

    return response.json()
  } else {
    // Client-side: use our proxy
    const searchParams = new URLSearchParams({
      endpoint,
      ...params,
    })

    const response = await fetchWithRetry(`/api/tmdb?${searchParams.toString()}`)

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Unknown error" }))
      throw new Error(error.error || "Failed to fetch from TMDb")
    }

    return response.json()
  }
}

type DiscoverOpts = {
  originalLanguage?: string
  minRating?: number
}

// Discover movies
export async function discoverMovies(
  page = 1,
  sortBy = "popularity.desc",
  opts: DiscoverOpts = {},
): Promise<TMDbResponse<Movie>> {
  const params: Record<string, string> = {
    page: String(page),
    sort_by: sortBy,
    include_adult: "false",
  }
  if (opts.originalLanguage) params["with_original_language"] = opts.originalLanguage
  if (opts.minRating) params["vote_average.gte"] = String(opts.minRating)
  return tmdbFetch<TMDbResponse<Movie>>("/discover/movie", params)
}

// Discover TV shows
export async function discoverTV(
  page = 1,
  sortBy = "popularity.desc",
  opts: DiscoverOpts = {},
): Promise<TMDbResponse<Movie>> {
  const params: Record<string, string> = {
    page: String(page),
    sort_by: sortBy,
    include_adult: "false",
  }
  if (opts.originalLanguage) params["with_original_language"] = opts.originalLanguage
  if (opts.minRating) params["vote_average.gte"] = String(opts.minRating)
  return tmdbFetch<TMDbResponse<Movie>>("/discover/tv", params)
}

// Discover anime (using keywords and genres)
export async function discoverAnime(page = 1, opts: DiscoverOpts = {}): Promise<TMDbResponse<Movie>> {
  const params: Record<string, string> = {
    page: String(page),
    with_genres: "16",
    with_origin_country: "JP",
    sort_by: "popularity.desc",
    include_adult: "false",
  }
  if (opts.originalLanguage) params["with_original_language"] = opts.originalLanguage
  if (opts.minRating) params["vote_average.gte"] = String(opts.minRating)
  return tmdbFetch<TMDbResponse<Movie>>("/discover/tv", params)
}

// Trending (all media types)
export async function getTrending(
  mediaType: "all" | "movie" | "tv" = "all",
  timeWindow: "day" | "week" = "week",
): Promise<TMDbResponse<Movie>> {
  return tmdbFetch<TMDbResponse<Movie>>(`/trending/${mediaType}/${timeWindow}`, {})
}

// Search multi (movies, TV, people)
export async function searchMulti(query: string, page = 1): Promise<TMDbResponse<Movie>> {
  return tmdbFetch<TMDbResponse<Movie>>("/search/multi", {
    query,
    page: page.toString(),
    include_adult: "false",
  })
}

// Get movie details
export async function getMovieDetails(id: number): Promise<Movie> {
  return tmdbFetch<Movie>(`/movie/${id}`, {
    append_to_response: "videos,credits,images,similar,recommendations",
  })
}

// Get TV details
export async function getTVDetails(id: number): Promise<Movie> {
  return tmdbFetch<Movie>(`/tv/${id}`, {
    append_to_response: "videos,credits,images,similar,recommendations",
  })
}

// Get genres
export async function getGenres(
  type: "movie" | "tv" = "movie",
): Promise<{ genres: Array<{ id: number; name: string }> }> {
  return tmdbFetch<{ genres: Array<{ id: number; name: string }> }>(`/genre/${type}/list`, {})
}

// Discover by genre
export async function discoverByGenre(
  genreId: number,
  type: "movie" | "tv" = "movie",
  page = 1,
): Promise<TMDbResponse<Movie>> {
  return tmdbFetch<TMDbResponse<Movie>>(`/discover/${type}`, {
    with_genres: genreId.toString(),
    page: page.toString(),
    sort_by: "popularity.desc",
    include_adult: "false",
  })
}
