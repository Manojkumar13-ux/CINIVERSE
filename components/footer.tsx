import Link from "next/link"
import { Film } from "lucide-react"

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Film className="w-6 h-6 text-accent" />
              <span className="text-xl font-serif font-bold">CineVerse</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your cinematic gateway to discovering movies, TV shows, and anime. Powered by TMDb.
            </p>
          </div>

          {/* Browse */}
          <div>
            <h3 className="font-semibold mb-4">Browse</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/movies" className="text-muted-foreground hover:text-accent transition-colors">
                  Movies
                </Link>
              </li>
              <li>
                <Link href="/tv" className="text-muted-foreground hover:text-accent transition-colors">
                  TV Series
                </Link>
              </li>
              <li>
                <Link href="/anime" className="text-muted-foreground hover:text-accent transition-colors">
                  Anime
                </Link>
              </li>
              <li>
                <Link href="/genres" className="text-muted-foreground hover:text-accent transition-colors">
                  Genres
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="font-semibold mb-4">Account</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/watchlist" className="text-muted-foreground hover:text-accent transition-colors">
                  My Watchlist
                </Link>
              </li>
              <li>
                <Link href="/settings" className="text-muted-foreground hover:text-accent transition-colors">
                  Settings
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-accent transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-accent transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <a
                  href="https://www.themoviedb.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-accent transition-colors"
                >
                  TMDb API
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} CineVerse. All rights reserved. Data provided by{" "}
            <a
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              The Movie Database (TMDb)
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  )
}
