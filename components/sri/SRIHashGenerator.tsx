"use client"

import { useState } from "react"
import { Algorithm, SRIResult } from "@/types/sri"
import SRIForm from "./SRIForm"
import HashCard from "./HashCard"
import HashSkeleton from "./HashSkeleton"
import { buildSnippet } from "@/lib/sri"
import BackToTools from "@/components/common/BackToTools"

export default function SRIHashGenerator() {
  const [url, setUrl] = useState("")
  const [algorithm, setAlgorithm] = useState<Algorithm>("sha384")
  const [result, setResult] = useState<SRIResult | null>(null)
  const [highlighted, setHighlighted] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const onAlgorithmChange = (algo: Algorithm) => {
    setAlgorithm(algo)
    setResult(null)
    setHighlighted(null)
    setError(null)
  }
  const generate = async () => {
    if (!url.trim()) {
      setError("Please enter a CDN URL")
      return
    }

    setLoading(true)
    setResult(null)
    setHighlighted(null)
    setError(null)

    try {
      const res = await fetch("/api/sri", {
        method: "POST",
        body: JSON.stringify({ url, algorithm }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Failed to generate SRI")
        setLoading(false)
        return
      }

      setResult(data)

      const snippet = buildSnippet(url, data.value)

      try {
        const highlightRes = await fetch("/api/highlight", {
          method: "POST",
          body: JSON.stringify({ code: snippet }),
        })

        const highlightData = await highlightRes.json()
        setHighlighted(highlightData.html || null)
      } catch {
        setHighlighted(null)
      }
    } catch {
      setError("Network error")
    }

    setLoading(false)
  }

  return (
    <div
      className="max-w-5xl mx-auto p-8 rounded-xl border shadow-sm space-y-6
  bg-white dark:bg-zinc-900
  border-zinc-200 dark:border-zinc-800"
    >
      <BackToTools />

      <h1 className="text-3xl font-semibold text-center">SRI Hash Generator</h1>

      <SRIForm
        url={url}
        setUrl={setUrl}
        algorithm={algorithm}
        onAlgorithmChange={onAlgorithmChange}
        loading={loading}
        onGenerate={generate}
      />

      <hr className="border-zinc-200" />

      <div className="min-h-50 flex items-center justify-center transition-all ">
        {loading && <HashSkeleton />}
        {!loading && error && (
          <div className="rounded-md border border-red-300 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {!loading && !error && !result && (
          <div className="text-zinc-400 dark:text-zinc-500 text-sm">
            Paste a CDN URL and click Generate to get the SRI tag
          </div>
        )}
        {!loading && result && (
          <HashCard
            algo={result.algorithm.toUpperCase()}
            url={url}
            value={result.value}
            highlighted={highlighted}
            copied={copied}
            onCopy={(t) => {
              navigator.clipboard.writeText(t)
              setCopied(true)
              setTimeout(() => setCopied(false), 1500)
            }}
          />
        )}
      </div>
    </div>
  )
}
