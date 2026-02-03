import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function BackToTools() {
  return (
    <Link
      href="/dashboard"
      className="inline-flex items-center gap-2 text-sm font-medium
        text-zinc-500 dark:text-zinc-400
        hover:text-zinc-800 dark:hover:text-zinc-200
        transition-colors"
    >
      <ArrowLeft className="h-4 w-4" />
      Back to Tools
    </Link>
  )
}
