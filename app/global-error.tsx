// app/global-error.tsx
"use client"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <html>
      <body className="min-h-screen flex items-center justify-center bg-zinc-950 text-white px-6 text-center">
        <div>
          <h1 className="text-3xl font-semibold">Application crashed</h1>
          <p className="mt-3 text-zinc-400">
            {error.message || "Something broke at the app level"}
          </p>

          <button
            onClick={reset}
            className="mt-6 rounded-md bg-white text-black px-6 py-2 text-sm font-medium"
          >
            Reload app
          </button>
        </div>
      </body>
    </html>
  )
}
