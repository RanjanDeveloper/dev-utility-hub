"use client"

import { Virtuoso } from "react-virtuoso"
import { useMemo } from "react"
import { cn } from "@/lib/utils"

type Props = {
  text: string
  wrap: boolean
}

export default function VirtualCode({ text, wrap }: Props) {
  const lines = useMemo(() => text.split("\n"), [text])

  return (
    <div className={cn(
    "h-125 rounded-md shiki-base",
    wrap ? "shiki-wrap" : "shiki-scroll"
  )}>
      <Virtuoso
        totalCount={lines.length}
        itemContent={(index) => (
          <pre
              className="shiki-line"
            >
            {lines[index]}
          </pre>
        )}
      />
    </div>
  )
}
