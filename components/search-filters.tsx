"use client"

import { useState } from "react"
import { Filter, X } from "lucide-react"

export function SearchFilters() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedType, setSelectedType] = useState<string>("all")
  const [selectedYear, setSelectedYear] = useState<string>("all")

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i)

  return (
    <div className="space-y-4">
      {/* Filter Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 glass rounded-full hover:bg-white/20 transition-colors"
      >
        <Filter className="w-4 h-4" />
        <span className="text-sm font-medium">Filters</span>
        {(selectedType !== "all" || selectedYear !== "all") && <span className="w-2 h-2 bg-accent rounded-full" />}
      </button>

      {/* Filter Panel */}
      {isOpen && (
        <div className="glass rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Filter Results</h3>
            <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Media Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Media Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-2 bg-background/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
              >
                <option value="all">All Types</option>
                <option value="movie">Movies</option>
                <option value="tv">TV Series</option>
                <option value="anime">Anime</option>
              </select>
            </div>

            {/* Year */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Release Year</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-4 py-2 bg-background/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
              >
                <option value="all">All Years</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setSelectedType("all")
                setSelectedYear("all")
              }}
              className="px-4 py-2 text-sm font-medium hover:bg-white/10 rounded-lg transition-colors"
            >
              Clear All
            </button>
            <button className="px-6 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/90 transition-colors">
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
