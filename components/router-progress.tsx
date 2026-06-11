"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"

export function RouterProgress() {
  const pathname = usePathname()
  const search = useSearchParams()
  const [active, setActive] = useState(false)
  const timeoutRef = useRef<number | null>(null)
  const lastKeyRef = useRef<string>("")

  useEffect(() => {
    const key = pathname + "?" + search.toString()
    if (lastKeyRef.current === "") {
      lastKeyRef.current = key
      return
    }
    // start
    setActive(true)
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
    // complete after small delay
    timeoutRef.current = window.setTimeout(() => {
      setActive(false)
    }, 500)
    lastKeyRef.current = key
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
    }
  }, [pathname, search])

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-[70] h-0.5 bg-accent transition-opacity duration-200 ${
        active ? "opacity-100" : "opacity-0"
      }`}
      style={{
        boxShadow: "0 0 24px rgba(185,28,28,0.6)",
      }}
    />
  )
}
