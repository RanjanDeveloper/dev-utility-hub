"use client"

type CssStatsProps = {
  inputSize: number
  outputSize: number
  outputSizeKb: string
}

export default function CssStats({
  inputSize,
  outputSize,
  outputSizeKb,
}: CssStatsProps) {
  return (
    <div className="text-xs text-zinc-500 dark:text-zinc-400">
      Input size: {inputSize} chars · Output size: {outputSize} chars ({outputSizeKb})
    </div>
  )
}
