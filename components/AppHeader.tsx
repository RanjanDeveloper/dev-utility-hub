import Link from "next/link"
import { SiGithub } from "@icons-pack/react-simple-icons"
import ThemeToggle from "@/components/ThemeToggle"

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur border-b border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-950/70">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">

        {/* Brand */}
        <Link
          href="/dashboard"
          className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100"
        >
          Dev Utility{" "}
          <span className="text-blue-600 dark:text-blue-400">Hub</span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link
            href="https://github.com/RanjanDeveloper/dev-utility-hub"
            target="_blank"
            className="inline-flex items-center gap-2 rounded-md border
              border-zinc-200 dark:border-zinc-700
              px-3 py-1.5 text-sm
              bg-white/60 dark:bg-zinc-900/60
              text-zinc-700 dark:text-zinc-200
              hover:bg-white dark:hover:bg-zinc-800
              backdrop-blur transition"
          >
            <SiGithub className="h-4 w-4" />
            <span className="hidden sm:inline">Star</span>
          </Link>

          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
