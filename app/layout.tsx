import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { RouterProgress } from "@/components/router-progress"
import { Suspense } from "react"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

export const metadata: Metadata = {
  title: "CineVerse - Discover Movies, TV Shows & Anime",
  description: "A cinematic experience for discovering and exploring movies, TV series, and anime. Powered by TMDb.",
  keywords: ["movies", "tv shows", "anime", "streaming", "entertainment"],
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} dark`}>
      <body className="min-h-screen">
        <Suspense fallback={null}>
          <RouterProgress />
        </Suspense>
        {children}
      </body>
    </html>
  )
}
