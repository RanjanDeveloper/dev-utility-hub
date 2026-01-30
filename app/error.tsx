// app/error.tsx
"use client"

export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-6 text-center">
      <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white">
        Something went wrong
      </h2>

      <p className="mt-3 text-zinc-600 dark:text-zinc-400">
        {error.message || "An unexpected error occurred"}
      </p>

      <button
        onClick={reset}
        className="mt-6 rounded-md bg-zinc-900 dark:bg-white px-6 py-2 text-white dark:text-black text-sm font-medium hover:opacity-90"
      >
        Try again
      </button>
    </div>
  )
}
