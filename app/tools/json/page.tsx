import JsonFormatter from "@/components/json/JsonFormatter"
import BackToTools from "@/components/common/BackToTools"

export default function Page() {
  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 bg-zinc-100 dark:bg-zinc-950">
      <div className="max-w-5xl mx-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl py-8 px-4 md:p-8 shadow-lg space-y-6">

        <BackToTools />

        <h1 className="text-3xl font-semibold text-center">
          JSON Formatter
        </h1>

        <p className="text-center text-zinc-500 dark:text-zinc-400">
          Format, validate and generate TypeScript from JSON
        </p>

        <JsonFormatter />

      </div>
    </div>
  )
}
