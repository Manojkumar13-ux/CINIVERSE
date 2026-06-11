import Link from "next/link"
import { Film, Sparkles, Heart, Laugh, Ghost, Rocket, Drama, Swords, Music } from "lucide-react"

interface Genre {
  id: number
  name: string
}

interface GenreGridProps {
  genres: Genre[]
}

// Map genre names to icons
const genreIcons: Record<string, any> = {
  Action: Swords,
  Adventure: Rocket,
  Animation: Sparkles,
  Comedy: Laugh,
  Crime: Ghost,
  Drama: Drama,
  Family: Heart,
  Fantasy: Sparkles,
  Horror: Ghost,
  Music: Music,
  Romance: Heart,
  "Science Fiction": Rocket,
  Thriller: Ghost,
  War: Swords,
  Western: Swords,
}

export function GenreGrid({ genres }: GenreGridProps) {
  const getIcon = (name: string) => {
    const Icon = genreIcons[name] || Film
    return Icon
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {genres.map((genre) => {
        const Icon = getIcon(genre.name)
        return (
          <Link
            key={genre.id}
            href={`/genres/${genre.id}`}
            className="group relative glass rounded-2xl p-6 hover:bg-white/20 transition-all hover-lift"
          >
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="p-4 rounded-full bg-accent/10 group-hover:bg-accent/20 transition-colors">
                <Icon className="w-8 h-8 text-accent" />
              </div>
              <h3 className="font-semibold text-lg">{genre.name}</h3>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
