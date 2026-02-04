import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Check, Copy } from "lucide-react"
import { buildSnippet } from "@/lib/sri"

export default function HashCard({
  algo,
  url,
  value,
  highlighted,
  copied,
  onCopy,
}: {
  algo: string
  url: string
  value: string
  highlighted: string | null
  copied: boolean
  onCopy: (t: string) => void
}) {
  const snippet = buildSnippet(url, value)

  return (
    <Card className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3 transition-colors">
      {/* Header */}
      <div className="flex justify-between items-center">
        <Badge variant="secondary">{algo}</Badge>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="outline"
                onClick={() => onCopy(snippet)}
                className="dark:border-zinc-700 dark:hover:bg-zinc-800"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{copied ? "Copied!" : "Copy"}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Hint text */}
      <div className="text-sm text-zinc-500 dark:text-zinc-400">
        Copy & paste this into your HTML
      </div>

      {/* Code */}
      {highlighted ? (
        <div
          className="shiki-base no-line p-3 shiki-wrap"
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      ) : (
        <div className="shiki-base shiki-wrap p-3">
          <pre className="leading-6">{snippet}</pre>
        </div>
      )}
    </Card>
  )
}
