"use client"

import { useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[v0] Application error:", error)
  }, [error])

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="glass-card rounded-3xl p-12 text-center max-w-2xl mx-auto">
          <div className="text-6xl mb-6">⚠️</div>
          <h2 className="text-3xl font-bold mb-4">Something Went Wrong</h2>
          <p className="text-muted-foreground mb-2">
            We encountered an error while loading this page. This might be due to:
          </p>
          <ul className="text-left text-muted-foreground mb-6 space-y-2 max-w-md mx-auto">
            <li>• Missing or invalid TMDB_API_KEY environment variable</li>
            <li>• Network connectivity issues</li>
            <li>• TMDb API rate limiting</li>
          </ul>
          {error.digest && (
            <p className="text-sm text-muted-foreground mb-6">
              Error ID: <code className="bg-muted px-2 py-1 rounded">{error.digest}</code>
            </p>
          )}
          <div className="flex gap-4 justify-center">
            <button
              onClick={reset}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-opacity"
            >
              Try Again
            </button>
            <a href="/" className="px-6 py-3 glass-card rounded-full hover:bg-white/10 transition-colors inline-block">
              Go Home
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
