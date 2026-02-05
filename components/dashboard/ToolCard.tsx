import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import { Braces, Image, KeyRound, Paintbrush, ShieldCheck } from "lucide-react"
import { Card } from "@/components/ui/card"
import type { ToolDefinition, ToolIconKey } from "@/lib/tools"

const iconMap: Record<ToolIconKey, LucideIcon> = {
  "shield-check": ShieldCheck,
  "key-round": KeyRound,
  paintbrush: Paintbrush,
  braces: Braces,
  image: Image,
}

type ToolCardProps = {
  tool: ToolDefinition
}

export function ToolCard({ tool }: ToolCardProps) {
  const Icon = iconMap[tool.icon]

  return (
    <Link href={tool.path} className="focus-visible:outline-none block h-full">
      <Card
        className="h-full p-6 cursor-pointer transition flex flex-col
    bg-white dark:bg-zinc-900
    border border-zinc-200 dark:border-zinc-800
    shadow-sm hover:shadow-md
    hover:-translate-y-1
    focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-zinc-400
    dark:focus-visible:ring-zinc-600 dark:focus-visible:ring-offset-zinc-950"
      >
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-md bg-zinc-100 dark:bg-zinc-800">
            <Icon className="h-6 w-6 text-zinc-700 dark:text-zinc-200" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {tool.name}
            </h2>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {tool.description}
            </p>
          </div>
        </div>
      </Card>
    </Link>
  )
}
