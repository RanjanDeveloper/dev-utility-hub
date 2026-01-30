"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Algorithm } from "@/types/sri"

type Props = {
  url: string
  setUrl: (v: string) => void
  algorithm: Algorithm
  onAlgorithmChange: (v: Algorithm) => void
  loading: boolean
  onGenerate: () => void
}

export default function SRIForm({
  url,
  setUrl,
  algorithm,
  onAlgorithmChange,
  loading,
  onGenerate,
}: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        disabled={loading}
        placeholder="https://cdn.jsdelivr.net/..."
        className="
          bg-white dark:bg-zinc-900
          border-zinc-200 dark:border-zinc-700
          focus:border-zinc-400 dark:focus:border-zinc-500
          focus:ring-zinc-300 dark:focus:ring-zinc-700
        "
      />

      <Select
        value={algorithm}
        onValueChange={(v) => onAlgorithmChange(v as Algorithm)}
        disabled={loading}
      >
        <SelectTrigger
          className="
            w-full sm:w-40
            bg-white dark:bg-zinc-900
            border-zinc-200 dark:border-zinc-700
            focus:ring-zinc-300 dark:focus:ring-zinc-700 dark:hover:bg-zinc-900
          "
        >
          <SelectValue />
        </SelectTrigger>

        <SelectContent className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700">
          <SelectItem value="sha256">SHA-256</SelectItem>
          <SelectItem value="sha384">SHA-384 (Recommended)</SelectItem>
          <SelectItem value="sha512">SHA-512</SelectItem>
        </SelectContent>
      </Select>

      <Button
        className="w-full sm:w-auto"
        disabled={loading || !url.trim()}
        onClick={onGenerate}
      >
        {loading ? "Generating…" : "Generate"}
      </Button>
    </div>
  )
}
