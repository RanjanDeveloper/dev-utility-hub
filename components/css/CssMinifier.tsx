"use client"

import { useMemo, useState } from "react"
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

const INDENT = "  "

type Mode = "minify" | "unminify"

type Analysis = {
  errors: string[]
  warnings: string[]
}

const stripNonImportantComments = (css: string) =>
  css.replace(/\/\*([\s\S]*?)\*\//g, (comment) =>
    comment.startsWith("/*!") ? comment : "",
  )

const splitSelectorList = (selectors: string) => {
  const results: string[] = []
  let current = ""
  let parenDepth = 0
  let bracketDepth = 0

  for (const char of selectors) {
    if (char === "(") parenDepth += 1
    if (char === ")") parenDepth = Math.max(parenDepth - 1, 0)
    if (char === "[") bracketDepth += 1
    if (char === "]") bracketDepth = Math.max(bracketDepth - 1, 0)

    if (char === "," && parenDepth === 0 && bracketDepth === 0) {
      if (current.trim()) {
        results.push(current.trim())
      }
      current = ""
      continue
    }

    current += char
  }

  if (current.trim()) {
    results.push(current.trim())
  }

  return results
}

const splitSelectorGroups = (css: string) => {
  return css.replace(/([^{}]+)\{([^}]*)\}/g, (match, selector, body) => {
    const trimmedSelector = selector.trim()
    if (!trimmedSelector || trimmedSelector.startsWith("@")) {
      return match
    }

    const selectors = splitSelectorList(trimmedSelector)
    if (selectors.length <= 1) {
      return match
    }

    return selectors.map((item) => `${item}{${body}}`).join("")
  })
}

const minifyCss = (css: string) => {
  let output = stripNonImportantComments(css)
  output = output.replace(/\s+/g, " ")
  output = output.replace(/\s*([{}:;,>~])\s*/g, "$1")
  output = output.replace(/;}/g, "}")
  return output.trim()
}

const unminifyCss = (css: string) => {
  let output = ""
  let indentLevel = 0
  let inString: string | null = null
  let inComment = false

  const appendIndent = () => {
    output += INDENT.repeat(Math.max(indentLevel, 0))
  }

  for (let index = 0; index < css.length; index += 1) {
    const char = css[index]
    const nextChar = css[index + 1]

    if (inComment) {
      output += char
      if (char === "*" && nextChar === "/") {
        output += "/"
        index += 1
        inComment = false
      }
      continue
    }

    if (inString) {
      output += char
      if (char === inString && css[index - 1] !== "\\") {
        inString = null
      }
      continue
    }

    if (char === "/" && nextChar === "*") {
      output += "/*"
      index += 1
      inComment = true
      continue
    }

    if (char === "\"" || char === "'") {
      inString = char
      output += char
      continue
    }

    if (char === "{") {
      output = output.trimEnd()
      output += " {\n"
      indentLevel += 1
      appendIndent()
      continue
    }

    if (char === "}") {
      output = output.trimEnd()
      output += "\n"
      indentLevel = Math.max(indentLevel - 1, 0)
      appendIndent()
      output += "}\n"
      appendIndent()
      continue
    }

    if (char === ";") {
      output = output.trimEnd()
      output += ";\n"
      appendIndent()
      continue
    }

    if (char === "\n" || char === "\r" || char === "\t") {
      if (!output.endsWith(" ") && !output.endsWith("\n")) {
        output += " "
      }
      continue
    }

    output += char
  }

  return output.trim()
}

const checkBraceBalance = (css: string) => {
  let depth = 0
  let inString: string | null = null
  let inComment = false

  for (let index = 0; index < css.length; index += 1) {
    const char = css[index]
    const nextChar = css[index + 1]

    if (inComment) {
      if (char === "*" && nextChar === "/") {
        index += 1
        inComment = false
      }
      continue
    }

    if (inString) {
      if (char === inString && css[index - 1] !== "\\") {
        inString = null
      }
      continue
    }

    if (char === "/" && nextChar === "*") {
      inComment = true
      index += 1
      continue
    }

    if (char === "\"" || char === "'") {
      inString = char
      continue
    }

    if (char === "{") {
      depth += 1
    } else if (char === "}") {
      depth -= 1
      if (depth < 0) {
        return "Extra closing brace detected."
      }
    }
  }

  if (depth > 0) {
    return "Missing closing brace detected."
  }

  return null
}

const extractRules = (css: string) => {
  const rules: Array<{ selector: string; body: string }> = []
  const sanitized = css.replace(/\/\*[\s\S]*?\*\//g, "")
  const ruleRegex = /([^{}]+)\{([^}]*)\}/g
  let match: RegExpExecArray | null

  while ((match = ruleRegex.exec(sanitized)) !== null) {
    const selector = match[1].trim()
    const body = match[2].trim()
    if (!selector || selector.startsWith("@")) {
      continue
    }
    rules.push({ selector, body })
  }

  return rules
}

const analyzeCss = (css: string): Analysis => {
  const errors: string[] = []
  const warnings: string[] = []

  const braceError = checkBraceBalance(css)
  if (braceError) {
    errors.push(braceError)
  }

  const rules = extractRules(css)

  for (const rule of rules) {
    const declarations = rule.body.split(";").map((item) => item.trim())
    const seen = new Set<string>()

    for (const decl of declarations) {
      if (!decl) {
        continue
      }
      if (!decl.includes(":")) {
        errors.push(`Invalid declaration in selector: ${rule.selector}`)
        continue
      }

      const [property] = decl.split(":")
      const propName = property.trim()
      if (propName && seen.has(propName)) {
        warnings.push(`Duplicate property "${propName}" in ${rule.selector}`)
      }
      if (propName) {
        seen.add(propName)
      }
    }

    const selectorList = splitSelectorList(rule.selector)
    for (const selector of selectorList) {
      if (selector.includes("*")) {
        warnings.push(`Universal selector used: ${selector}`)
      }

      const depth = selector
        .split(/\s+|>|\+|~/)
        .filter(Boolean).length
      if (depth >= 5) {
        warnings.push(`Deep selector (${depth} levels): ${selector}`)
      }
    }
  }

  const importantCount = (css.match(/!important\b/g) || []).length
  if (importantCount >= 6) {
    warnings.push(`High !important usage: ${importantCount} occurrences.`)
  }

  return { errors, warnings }
}

export default function CssMinifier() {
  const [input, setInput] = useState("")
  const [mode, setMode] = useState<Mode>("minify")
  const [splitSelectors, setSplitSelectors] = useState(false)
  const [showDiff, setShowDiff] = useState(true)
  const [output, setOutput] = useState("")
  const [analysis, setAnalysis] = useState<Analysis>({ errors: [], warnings: [] })

  const isEmpty = input.trim().length === 0

  const onProcess = () => {
    const workingInput = splitSelectors ? splitSelectorGroups(input) : input
    const nextOutput =
      mode === "minify" ? minifyCss(workingInput) : unminifyCss(workingInput)

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
    return {
      inputSize: input.length,
      outputSize: output.length,
    }
  }, [input, output])

  return (
    <div className="space-y-6">
      <Card className="p-4 bg-zinc-50 dark:bg-zinc-950 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="css-input">CSS input</Label>
          <textarea
            id="css-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Paste your CSS here..."
            className="w-full min-h-40 rounded-md border border-zinc-200 dark:border-zinc-800 bg-transparent px-3 py-2 font-mono text-sm focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-4">
          <div className="grid gap-3 sm:grid-cols-[220px_1fr] sm:items-center">
            <Label>Mode</Label>
            <Select value={mode} onValueChange={(value) => setMode(value as Mode)}>
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
                id="split-selectors"
                checked={splitSelectors}
                onCheckedChange={(value) => setSplitSelectors(!!value)}
              />
              <Label htmlFor="split-selectors">Split grouped selectors</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="diff-view"
                checked={showDiff}
                onCheckedChange={(value) => setShowDiff(!!value)}
              />
              <Label htmlFor="diff-view">Show diff view</Label>
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

        {stats && (
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            Input size: {stats.inputSize} chars · Output size: {stats.outputSize} chars
          </div>
        )}
      </Card>

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

      {analysis.warnings.length > 0 && (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200 space-y-1">
          <div className="font-semibold">Smell warnings</div>
          <ul className="list-disc pl-4">
            {analysis.warnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        </div>
      )}

      {output && showDiff && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <div className="text-sm font-semibold text-zinc-700 dark:text-zinc-200 mb-2">
              Original
            </div>
            <pre className="text-xs whitespace-pre-wrap font-mono text-zinc-600 dark:text-zinc-300">
              {input}
            </pre>
          </Card>

          <Card className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <div className="text-sm font-semibold text-zinc-700 dark:text-zinc-200 mb-2">
              Processed
            </div>
            <pre className="text-xs whitespace-pre-wrap font-mono text-zinc-600 dark:text-zinc-300">
              {output}
            </pre>
          </Card>
        </div>
      )}

      {output && !showDiff && (
        <Card className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          <div className="text-sm font-semibold text-zinc-700 dark:text-zinc-200 mb-2">
            Output
          </div>
          <pre className="text-xs whitespace-pre-wrap font-mono text-zinc-600 dark:text-zinc-300">
            {output}
          </pre>
        </Card>
      )}
    </div>
  )
}
