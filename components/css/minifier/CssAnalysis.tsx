"use client"

import type { Analysis } from "@/components/css/minifier/utils"

type CssAnalysisProps = {
  analysis: Analysis
  showWarnings: boolean
}

export default function CssAnalysis({ analysis, showWarnings }: CssAnalysisProps) {
  return (
    <div className="space-y-4">
      {analysis.errors.length > 0 && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300 space-y-1">
          <div className="font-semibold">Errors detected</div>
          <ul className="list-disc pl-4">
            {analysis.errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {showWarnings && analysis.warnings.length > 0 && (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200 space-y-1">
          <div className="font-semibold">Smell warnings</div>
          <ul className="list-disc pl-4 max-h-40 overflow-y-auto pr-2">
            {analysis.warnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
