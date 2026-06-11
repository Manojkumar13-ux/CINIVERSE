"use client"

import { useSearchParams, useRouter, usePathname } from "next/navigation"

const languages = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "ja", label: "Japanese" },
  { code: "ko", label: "Korean" },
  { code: "fr", label: "French" },
  { code: "es", label: "Spanish" },
]

const qualities = [
  { value: "", label: "All" },
  { value: "7", label: "7+" },
  { value: "8", label: "8+" },
  { value: "9", label: "9+" },
]

export function ContentFilters() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const lang = searchParams.get("lang") || ""
  const qual = searchParams.get("q") || ""

  function updateParam(key: string, value: string) {
    const sp = new URLSearchParams(searchParams)
    if (value) sp.set(key, value)
    else sp.delete(key)
    sp.set("page", "1") // reset pagination on filter change
    router.push(`${pathname}?${sp.toString()}`)
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="space-y-1">
        <label className="text-xs text-muted-foreground">Language</label>
        <select
          value={lang}
          onChange={(e) => updateParam("lang", e.target.value)}
          className="px-3 py-2 bg-background/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
        >
          <option value="">All</option>
          {languages.map((l) => (
            <option key={l.code} value={l.code}>
              {l.label}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-1">
        <label className="text-xs text-muted-foreground">Quality</label>
        <select
          value={qual}
          onChange={(e) => updateParam("q", e.target.value)}
          className="px-3 py-2 bg-background/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
        >
          {qualities.map((q) => (
            <option key={q.value} value={q.value}>
              {q.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
