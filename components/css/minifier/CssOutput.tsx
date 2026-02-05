"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

type CssOutputProps = {
  input: string
  output: string
  showDiff: boolean
}

export default function CssOutput({ input, output, showDiff }: CssOutputProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!output) {
      return
    }
    await navigator.clipboard.writeText(output)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1500)
  }

  const outputBlock = (
    <Card className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">
          Processed
        </div>
        <Button variant="secondary" size="sm" onClick={handleCopy}>
          {copied ? "Copied" : "Copy output"}
        </Button>
      </div>
      <pre className="text-xs whitespace-pre-wrap break-words font-mono text-zinc-600 dark:text-zinc-300 max-h-96 overflow-auto">
        {output}
      </pre>
    </Card>
  )

  if (showDiff) {
    return (
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          <div className="text-sm font-semibold text-zinc-700 dark:text-zinc-200 mb-2">
            Original
          </div>
          <pre className="text-xs whitespace-pre-wrap break-words font-mono text-zinc-600 dark:text-zinc-300 max-h-96 overflow-auto">
            {input}
          </pre>
        </Card>
        {outputBlock}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {outputBlock}
    </div>
  )
}
