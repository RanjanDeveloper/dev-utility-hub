import Link from "next/link"

export default function AppFooter() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 mt-16">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-zinc-500 dark:text-zinc-400">
        
        <div>© {new Date().getFullYear()} Dev Utility Hub</div>

        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="hover:text-zinc-700 dark:hover:text-zinc-200 transition"
          >
            Tools
          </Link>

          <Link
            href="https://github.com/YOUR_REPO"
            target="_blank"
            className="hover:text-zinc-700 dark:hover:text-zinc-200 transition"
          >
            GitHub
          </Link>
        </div>

      </div>
    </footer>
  )
}
