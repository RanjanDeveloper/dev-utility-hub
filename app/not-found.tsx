// app/not-found.tsx
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 text-center px-6">
      <h1 className="text-6xl font-bold text-zinc-900 dark:text-white">404</h1>
      <p className="mt-4 text-zinc-600 dark:text-zinc-400">
        The page you are looking for doesn’t exist.
      </p>

      <Link
        href="/dashboard"
        className="mt-6 rounded-md bg-zinc-900 dark:bg-white px-6 py-2 text-white dark:text-black text-sm font-medium hover:opacity-90"
      >
        Go to Tools
      </Link>
    </div>
  )
}
