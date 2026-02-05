"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Mode = "minify" | "unminify"

type CssInputCardProps = {
  input: string
  mode: Mode
  showDiff: boolean
  showWarnings: boolean
  isEmpty: boolean
  onInputChange: (value: string) => void
  onModeChange: (value: Mode) => void
  onShowDiffChange: (value: boolean) => void
  onShowWarningsChange: (value: boolean) => void
  onProcess: () => void
  onClear: () => void
}

export default function CssInputCard({
  input,
  mode,
  showDiff,
  showWarnings,
  isEmpty,
  onInputChange,
  onModeChange,
  onShowDiffChange,
  onShowWarningsChange,
  onProcess,
  onClear,
}: CssInputCardProps) {
  return (
    <Card className="p-4 bg-zinc-50 dark:bg-zinc-950 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="css-input">CSS input</Label>
        <textarea
          id="css-input"
          value={input}
          onChange={(event) => onInputChange(event.target.value)}
          placeholder="Paste your CSS here..."
          className="w-full min-h-40 rounded-md border border-zinc-200 dark:border-zinc-800 bg-transparent px-3 py-2 font-mono text-sm focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-4">
        <div className="grid gap-3 sm:grid-cols-[220px_1fr] sm:items-center">
          <Label>Mode</Label>
          <Select value={mode} onValueChange={(value) => onModeChange(value as Mode)}>
            <SelectTrigger className="w-full sm:w-56 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700">
              <SelectItem value="minify">Minify</SelectItem>
              <SelectItem value="unminify">Unminify</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-2">
            <Checkbox
              id="diff-view"
              checked={showDiff}
              onCheckedChange={(value) => onShowDiffChange(!!value)}
            />
            <Label htmlFor="diff-view">Show diff view</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="show-warnings"
              checked={showWarnings}
              onCheckedChange={(value) => onShowWarningsChange(!!value)}
            />
            <Label htmlFor="show-warnings">Show warnings</Label>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button onClick={onProcess} disabled={isEmpty}>
          Process CSS
        </Button>
        <Button variant="secondary" onClick={onClear} disabled={isEmpty}>
          Clear
        </Button>
      </div>
    </Card>
  )
}
