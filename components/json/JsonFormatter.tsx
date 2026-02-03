"use client"

import { useState } from "react"
import {
  formatJson,
  minifyJson,
  validateJson,
  generateTypes,
  parseJsonError,
  highlightCode
} from "@/lib/json"

import JsonInput from "./JsonInput"
import JsonOutput from "./JsonOutput"
import JsonTypes from "./JsonTypes"

import { CheckCircle, XCircle } from "lucide-react"

export default function JsonFormatter() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [highlighted, setHighlighted] = useState<string | null>(null)
const [wrap, setWrap] = useState(false)

  const [types, setTypes] = useState<string | null>(null)
  const [highlightedTypes, setHighlightedTypes] = useState<string | null>(null)

  const [error, setError] = useState<ReturnType<typeof parseJsonError> | null>(
    null
  )
  const [valid, setValid] = useState<boolean | null>(null)
  const [copied, setCopied] = useState(false)

  /* ---------------- RESET ON INPUT CHANGE ---------------- */
  const onChange = (value: string) => {
    setInput(value)
    setOutput("")
    setHighlighted(null)
    setTypes(null)
    setHighlightedTypes(null)
    setError(null)
    setValid(null)
    setCopied(false)
  }
const MAX_HIGHLIGHT_SIZE = 300_000 // 300 KB
  /* ---------------- FORMAT ---------------- */
const onFormat = async () => {
  try {
    const formatted = formatJson(input)
    setOutput(formatted)
    setValid(null)
    setError(null)

    if (formatted.length < MAX_HIGHLIGHT_SIZE) {
      const html = await highlightCode(formatted, "jsonc")
      setHighlighted(html)
    } else {
      setHighlighted(null) // Use raw view
    }
  } catch (err) {
    setError(parseJsonError(err, input))
    setHighlighted(null)
  }
}

  /* ---------------- MINIFY ---------------- */
const onMinify = async () => {
  try {
    const min = minifyJson(input)
    setOutput(min)
    setValid(null)
    setError(null)

    if (min.length < MAX_HIGHLIGHT_SIZE) {
      const html = await highlightCode(min, "jsonc")
      setHighlighted(html)
    } else {
      setHighlighted(null)
    }
  } catch (err) {
    setError(parseJsonError(err, input))
    setHighlighted(null)
  }
}


  /* ---------------- VALIDATE ---------------- */
  const onValidate = () => {
    const res = validateJson(input)

    if (!res.valid) {
      setError(parseJsonError(new Error(res.message), input))
      setValid(false)
    } else {
      setError(null)
      setValid(true)
    }
  }

  /* ---------------- TYPESCRIPT TYPES ---------------- */
const onTypes = async () => {
  try {
    const ts = generateTypes(JSON.parse(input))
    setTypes(ts)
    setError(null)

    if (ts.length < MAX_HIGHLIGHT_SIZE) {
      const html = await highlightCode(ts, "ts")
      setHighlightedTypes(html)
    } else {
      setHighlightedTypes(null)
    }
  } catch (err) {
    setError(parseJsonError(err, input))
  }
}


  /* ---------------- UI ---------------- */
  return (
    <div className="space-y-6">
      <JsonInput
        value={input}
        onChange={onChange}
        onFormat={onFormat}
        onMinify={onMinify}
        onValidate={onValidate}
      />

      {/* ---------- ERROR ---------- */}
      {error && (
        <div
          className="
            flex items-start gap-2
            rounded-md border
            px-4 py-3 text-sm font-mono
            bg-red-50 text-red-800 border-red-200
            dark:bg-red-950/40 dark:text-red-300 dark:border-red-800
            max-w-full overflow-hidden
          "
        >
          <XCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="overflow-x-auto whitespace-pre-wrap leading-relaxed">
            {error.message}
            {error.line && (
              <>
                {"\n\n"}Line {error.line}, Column {error.column}
                {"\n"}
                {error.preview}
                {"\n"}
                {error.pointer}
              </>
            )}
          </div>
        </div>
      )}

      {/* ---------- VALID ---------- */}
      {valid && !error && (
        <div
          className="
            flex items-center gap-2
            rounded-md border
            px-4 py-3 text-sm font-medium
            bg-green-50 text-green-800 border-green-200
            dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-400/30
          "
        >
          <CheckCircle className="w-5 h-5" />
          JSON is valid
        </div>
      )}

      {/* ---------- OUTPUT ---------- */}
      {output && (
        <JsonOutput
          raw={output}
          html={highlighted}
          copied={copied}
          wrap={wrap}
  onToggleWrap={setWrap}
          onCopy={() => {
            navigator.clipboard.writeText(output)
            setCopied(true)
            setTimeout(() => setCopied(false), 1500)
          }}
          onTypes={onTypes}
        />
      )}

      {/* ---------- TYPES ---------- */}
      {types && (
        <JsonTypes
          types={types}
          html={highlightedTypes}
        />
      )}
    </div>
  )
}
