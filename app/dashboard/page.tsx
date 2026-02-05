import type { Metadata } from "next"
import { tools } from "@/lib/tools"
import { ComingSoonCard } from "@/components/dashboard/ComingSoonCard"
import { ToolCard } from "@/components/dashboard/ToolCard"

export const metadata: Metadata = {
  title: "Tools | Dev Utility Hub",
  description:
    "Browse all developer utilities available in Dev Utility Hub, including SRI hashes, CSS helpers, JSON formatting, and JWT validation.",
}

export default function Dashboard() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1
          id="tools-title"
          className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white"
        >
          Tools
        </h1>
        <p className="mt-1 text-zinc-500 dark:text-zinc-400">
          All developer utilities in one place
        </p>
      </div>

      <section
        aria-labelledby="tools-title"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
        <ComingSoonCard />
      </section>
    </div>
  )
}
