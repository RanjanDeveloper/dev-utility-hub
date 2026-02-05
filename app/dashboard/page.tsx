import { tools } from "@/lib/tools"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import {
  ShieldCheck,
  Wrench,
  Plus,
  LucideIcon,
  KeyRound,
  Paintbrush,
} from "lucide-react"

const icons: Record<string, LucideIcon> = {
  "shield-check": ShieldCheck,
  "key-round": KeyRound,
  paintbrush: Paintbrush,
}

export default function Dashboard() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Tools
        </h1>
        <p className="mt-1 text-zinc-500 dark:text-zinc-400">
          All developer utilities in one place
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => {
          const Icon = icons[tool.icon] || Wrench

          return (
            <Link href={tool.path} key={tool.id}>
              <Card
                className="p-6 cursor-pointer transition
    bg-white dark:bg-zinc-900
    border border-zinc-200 dark:border-zinc-800
    shadow-sm hover:shadow-md
    hover:-translate-y-1
    dark:hover:border-zinc-700"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-md bg-zinc-100">
                    <Icon className="h-6 w-6 text-zinc-700" />
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                      {tool.name}
                    </h2>
                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 ">
                      {tool.description}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          )
        })}

        <Card
          className="
    p-6 cursor-default transition
    bg-white dark:bg-zinc-900
    border border-dashed border-zinc-200 dark:border-zinc-700
    shadow-sm
    text-zinc-500 dark:text-zinc-400
    flex items-center justify-center
    min-h-24
  "
        >
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-md bg-zinc-100 dark:bg-zinc-800">
              <Plus className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
            </div>

            <div>
              <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                More tools coming
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-500">
                Stay tuned
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
