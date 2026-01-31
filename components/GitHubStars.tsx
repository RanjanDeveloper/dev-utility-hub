import { getStars } from "@/lib/github"
import { Star } from "lucide-react"

export default async function GitHubStars() {
  const stars = await getStars()

  return (
    <span
      className="
        ml-2 inline-flex items-center gap-1
        rounded-full px-2 py-0.5 text-xs font-medium
        bg-zinc-100 text-zinc-700
        dark:bg-zinc-800 dark:text-zinc-200
        border border-zinc-200 dark:border-zinc-700
      "
    >
      <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
      {stars.toLocaleString()}
    </span>
  )
}
