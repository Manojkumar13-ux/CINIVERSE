"use client"

import { X, Search } from "lucide-react"
import { SearchBar } from "./search-bar"

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-md">
      <div className="container mx-auto px-4 pt-24 pb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Search CineVerse</span>
          </div>
          <button
            aria-label="Close search"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-accent/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <SearchBar />
      </div>
    </div>
  )
}
