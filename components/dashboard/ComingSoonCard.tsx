import { Plus } from "lucide-react"
import { Card } from "@/components/ui/card"

export function ComingSoonCard() {
  return (
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
  )
}
