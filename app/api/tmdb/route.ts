import { type NextRequest, NextResponse } from "next/server"
import { TMDB_BASE_URL, getTMDBApiKey } from "@/lib/tmdb"

// Rate limiting (simple in-memory store)
const requestCounts = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT = 40 // requests per window
const RATE_WINDOW = 10000 // 10 seconds

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const record = requestCounts.get(ip)

  if (!record || now > record.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + RATE_WINDOW })
    return true
  }

  if (record.count >= RATE_LIMIT) {
    return false
  }

  record.count++
  return true
}

export async function GET(request: NextRequest) {
  // Resolve API key at request time
  const TMDB_API_KEY = getTMDBApiKey()
  if (!TMDB_API_KEY) {
    console.error("[v0] TMDB_API_KEY environment variable is not set")
    return NextResponse.json(
      { error: "TMDb API key is not configured. Please add TMDB_API_KEY to your environment variables." },
      { status: 500 },
    )
  }

  // Get client IP for rate limiting
  const ip = request.headers.get("x-forwarded-for") || "unknown"

  // Check rate limit
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Rate limit exceeded. Please try again later." }, { status: 429 })
  }

  // Get query parameters
  const { searchParams } = new URL(request.url)
  const endpoint = searchParams.get("endpoint")

  if (!endpoint) {
    return NextResponse.json({ error: "Endpoint parameter is required" }, { status: 400 })
  }

  // Remove endpoint from params and forward the rest
  searchParams.delete("endpoint")
  const queryString = searchParams.toString()

  try {
    // Build TMDb URL
    const tmdbUrl = `${TMDB_BASE_URL}${endpoint}?api_key=${TMDB_API_KEY}${queryString ? `&${queryString}` : ""}`

    console.log("[v0] Fetching from TMDb:", endpoint)

    // Fetch from TMDb with timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout

    const response = await fetch(tmdbUrl, {
      signal: controller.signal,
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      console.error("[v0] TMDb API error:", response.status, response.statusText)
      throw new Error(`TMDb API error: ${response.status}`)
    }

    const data = await response.json()

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
      },
    })
  } catch (error: any) {
    console.error("[v0] TMDb API Error:", error)

    if (error.name === "AbortError") {
      return NextResponse.json({ error: "Request timeout. Please try again." }, { status: 504 })
    }

    return NextResponse.json({ error: "Failed to fetch data from TMDb" }, { status: 500 })
  }
}
