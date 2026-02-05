const INDENT = "  "

export type Analysis = {
  errors: string[]
  warnings: string[]
}

const stripNonImportantComments = (css: string) =>
  css.replace(/\/\*([\s\S]*?)\*\//g, (comment) =>
    comment.startsWith("/*!") ? comment : "",
  )

export const splitSelectorList = (selectors: string) => {
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

export const minifyCss = (css: string) => {
  let output = stripNonImportantComments(css)
  output = output.replace(/\s+/g, " ")
  output = output.replace(/\s*([{}:;,>~])\s*/g, "$1")
  output = output.replace(/;}/g, "}")
  return output.trim()
}

export const unminifyCss = (css: string) => {
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

export const analyzeCss = (css: string): Analysis => {
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

export const getByteSize = (value: string) =>
  new TextEncoder().encode(value).length

export const formatKb = (bytes: number) => `${(bytes / 1024).toFixed(2)} KB`
