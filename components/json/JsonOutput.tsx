"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Copy, Check } from "lucide-react"
import VirtualCode from "@/components/VirtualCode"
type Props = {
  html: string | null
  raw: string
  wrap: boolean
  onToggleWrap: (v: boolean) => void
  onCopy: () => void
  onTypes: () => void
  copied: boolean
}

export default function JsonOutput({
  html,
  raw,
  wrap,
  onToggleWrap,
  onCopy,
  onTypes,
  copied,
}: Props) {
  return (
    <Card className="p-4 bg-zinc-50 dark:bg-zinc-950 space-y-4">
      {/* OUTPUT */}
      <div className="rounded-md  text-sm">
        {html ? (
         <div className="max-h-75 overflow-auto">
           <div
            className={`shiki p-3 ${wrap ? "wrap" : ""}`}
            dangerouslySetInnerHTML={{ __html: html }}
          />
         </div>
        ) : (
          <VirtualCode text={raw} wrap={wrap}/>
        )}
      </div>

      {/* ACTION BAR */}
      <div className="flex items-center justify-between gap-3">
        {/* LEFT: Actions */}
        <div className="flex items-center gap-2">
          <Button onClick={onCopy} className="flex items-center gap-2">
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy
              </>
            )}
          </Button>

          <Button
            variant="secondary"
            onClick={onTypes}
            className="flex items-center gap-2"
          >
            TS Types
          </Button>
        </div>

        {/* RIGHT: View preference */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Checkbox
            id="wrap-lines"
            checked={wrap}
            onCheckedChange={(v) => onToggleWrap(!!v)}
          />
          <Label htmlFor="wrap-lines" className="cursor-pointer select-none">
            Wrap lines
          </Label>
        </div>
      </div>
    </Card>
  )
}
