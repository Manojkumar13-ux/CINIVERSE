"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Film, Tv, Sparkles, Bookmark, Menu, X, Search } from "lucide-react"
import { SearchBar } from "./search-bar"
import { useWatchlist } from "@/hooks/use-watchlist"
import { SearchOverlay } from "./search-overlay" // new overlay

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false) //
  const { count } = useWatchlist()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "glass py-3" : "py-6"}`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-2">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Film className="w-8 h-8 text-accent transition-transform group-hover:scale-110" />
              <div className="absolute inset-0 bg-accent/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-2xl font-serif font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              CineVerse
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8 flex-1 justify-center">
            <Link href="/" className="text-sm font-medium hover:text-accent transition-colors">
              Home
            </Link>
            <Link
              href="/movies"
              className="flex items-center gap-2 text-sm font-medium hover:text-accent transition-colors"
            >
              <Film className="w-4 h-4" />
              Movies
            </Link>
            <Link
              href="/tv"
              className="flex items-center gap-2 text-sm font-medium hover:text-accent transition-colors"
            >
              <Tv className="w-4 h-4" />
              TV Series
            </Link>
            <Link
              href="/anime"
              className="flex items-center gap-2 text-sm font-medium hover:text-accent transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Anime
            </Link>
            <Link href="/genres" className="text-sm font-medium hover:text-accent transition-colors">
              Genres
            </Link>
          </div>

          {/* Search & Actions - Desktop */}
          <div className="hidden lg:flex items-center gap-4">
            <SearchBar />
            <Link
              href="/watchlist"
              className="relative p-2 hover:bg-accent/10 rounded-full transition-colors"
              aria-label="Watchlist"
            >
              <Bookmark className="w-5 h-5" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-accent text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {count > 99 ? "99+" : count}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Actions */}
          <div className="lg:hidden flex items-center gap-1">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 hover:bg-accent/10 rounded-lg transition-colors"
              aria-label="Open search"
            >
              <Search className="w-6 h-6" />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 hover:bg-accent/10 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 glass rounded-2xl p-6 space-y-4">
            <div className="flex flex-col gap-3 pt-2">
              <Link
                href="/"
                className="text-sm font-medium hover:text-accent transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/movies"
                className="flex items-center gap-2 text-sm font-medium hover:text-accent transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Film className="w-4 h-4" />
                Movies
              </Link>
              <Link
                href="/tv"
                className="flex items-center gap-2 text-sm font-medium hover:text-accent transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Tv className="w-4 h-4" />
                TV Series
              </Link>
              <Link
                href="/anime"
                className="flex items-center gap-2 text-sm font-medium hover:text-accent transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Sparkles className="w-4 h-4" />
                Anime
              </Link>
              <Link
                href="/genres"
                className="text-sm font-medium hover:text-accent transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Genres
              </Link>
              <Link
                href="/watchlist"
                className="flex items-center gap-2 text-sm font-medium hover:text-accent transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Bookmark className="w-4 h-4" />
                Watchlist {count > 0 && `(${count})`}
              </Link>
            </div>
          </div>
        )}
      </div>

      <SearchOverlay open={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </nav>
  )
}
