import Link from "next/link"
import { Film, Tv, Sparkles } from "lucide-react"

export function HomeBento() {
  return (
    <section className="container mx-auto px-4 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <Link
          href="/movies"
          className="group relative overflow-hidden rounded-3xl p-6 md:p-8 glass hover-lift"
          aria-label="Browse Movies"
        >
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-[var(--color-movie-accent)]/20 rounded-full blur-3xl" />
          <Film className="w-8 h-8 text-[var(--color-movie-accent)] mb-3" />
          <h3 className="text-2xl font-serif font-bold mb-2">Movies</h3>
          <p className="text-sm text-muted-foreground mb-4">Blockbusters, indies, and award-winning cinema.</p>
          <span className="text-sm text-[var(--color-movie-accent)]">Explore →</span>
        </Link>

        <Link
          href="/tv"
          className="group relative overflow-hidden rounded-3xl p-6 md:p-8 glass hover-lift"
          aria-label="Browse TV Series"
        >
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-[var(--color-tv-accent)]/20 rounded-full blur-3xl" />
          <Tv className="w-8 h-8 text-[var(--color-tv-accent)] mb-3" />
          <h3 className="text-2xl font-serif font-bold mb-2">TV Series</h3>
          <p className="text-sm text-muted-foreground mb-4">Binge-worthy stories and timeless classics.</p>
          <span className="text-sm text-[var(--color-tv-accent)]">Explore →</span>
        </Link>

        <Link
          href="/anime"
          className="group relative overflow-hidden rounded-3xl p-6 md:p-8 glass hover-lift"
          aria-label="Browse Anime"
        >
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-[var(--color-anime-accent)]/20 rounded-full blur-3xl" />
          <Sparkles className="w-8 h-8 text-[var(--color-anime-accent)] mb-3" />
          <h3 className="text-2xl font-serif font-bold mb-2">Anime</h3>
          <p className="text-sm text-muted-foreground mb-4">From shonen epics to slice-of-life gems.</p>
          <span className="text-sm text-[var(--color-anime-accent)]">Explore →</span>
        </Link>
      </div>
    </section>
  )
}
