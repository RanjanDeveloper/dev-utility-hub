"use client"

import { Virtuoso } from "react-virtuoso"
import { useMemo } from "react"

type Props = {
  text: string
  wrap: boolean
}

export default function VirtualCode({ text, wrap }: Props) {
  const lines = useMemo(() => text.split("\n"), [text])

  return (
    <div className="h-125 overflow-hidden  rounded-md">
      <Virtuoso
        totalCount={lines.length}
        itemContent={(index) => (
          <pre
              className={`flex-1 ${
                wrap ? "whitespace-pre-wrap break-all" : "whitespace-pre"
              }`}
            >
            {lines[index]}
          </pre>
        )}
      />
    </div>
  )
}
