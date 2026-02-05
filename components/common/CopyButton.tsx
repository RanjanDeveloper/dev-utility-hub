"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type CopyButtonProps = {
  value: string
  label?: string
  copiedLabel?: string
  className?: string
  variant?: "default" | "secondary" | "outline" | "ghost"
}

export default function CopyButton({
  value,
  label = "Copy",
  copiedLabel = "Copied",
  className,
  variant = "secondary",
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const onCopy = async () => {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <Button
      type="button"
      variant={variant}
      size="sm"
      onClick={onCopy}
      className={cn("flex items-center gap-2", className)}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4" />
          {copiedLabel}
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" />
          {label}
        </>
      )}
    </Button>
  )
}
