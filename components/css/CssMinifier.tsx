"use client"

import { useMemo, useState } from "react"
import CssAnalysis from "@/components/css/minifier/CssAnalysis"
import CssInputCard from "@/components/css/minifier/CssInputCard"
import CssOutput from "@/components/css/minifier/CssOutput"
import CssStats from "@/components/css/minifier/CssStats"
import {
  type Analysis,
  analyzeCss,
  formatKb,
  getByteSize,
  minifyCss,
  unminifyCss,
} from "@/components/css/minifier/utils"

type Mode = "minify" | "unminify"

export default function CssMinifier() {
  const [input, setInput] = useState("")
  const [mode, setMode] = useState<Mode>("minify")
  const [showDiff, setShowDiff] = useState(true)
  const [showWarnings, setShowWarnings] = useState(true)
  const [output, setOutput] = useState("")
  const [analysis, setAnalysis] = useState<Analysis>({ errors: [], warnings: [] })

  const isEmpty = input.trim().length === 0

  const onProcess = () => {
    const nextOutput = mode === "minify" ? minifyCss(input) : unminifyCss(input)

    setOutput(nextOutput)
    setAnalysis(analyzeCss(input))
  }

  const onClear = () => {
    setInput("")
    setOutput("")
    setAnalysis({ errors: [], warnings: [] })
  }

  const stats = useMemo(() => {
    if (!output) {
      return null
    }
    const outputBytes = getByteSize(output)
    return {
      inputSize: input.length,
      outputSize: output.length,
      outputSizeKb: formatKb(outputBytes),
    }
  }, [input, output])

  return (
    <div className="space-y-6">
      <CssInputCard
        input={input}
        mode={mode}
        showDiff={showDiff}
        showWarnings={showWarnings}
        isEmpty={isEmpty}
        onInputChange={setInput}
        onModeChange={setMode}
        onShowDiffChange={setShowDiff}
        onShowWarningsChange={setShowWarnings}
        onProcess={onProcess}
        onClear={onClear}
      />

      {stats && (
        <CssStats
          inputSize={stats.inputSize}
          outputSize={stats.outputSize}
          outputSizeKb={stats.outputSizeKb}
        />
      )}

      <CssAnalysis analysis={analysis} showWarnings={showWarnings} />

      {output && <CssOutput input={input} output={output} showDiff={showDiff} />}
    </div>
  )
}
