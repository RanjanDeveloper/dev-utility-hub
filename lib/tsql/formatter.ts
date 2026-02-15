import { formatKeyword } from "./keywords"
import { tokenizeTsql } from "./tokenizer"
import { defaultTsqlOptions, type TsqlFormatOptions } from "./types"

const CLAUSE_BREAKS = new Set([
  "SELECT",
  "FROM",
  "WHERE",
  "GROUP",
  "ORDER",
  "HAVING",
  "JOIN",
  "INNER",
  "LEFT",
  "RIGHT",
  "FULL",
  "CROSS",
  "ON",
  "VALUES",
  "SET",
])

function splitTopLevel(input: string, separator: string): string[] {
  const items: string[] = []
  let depth = 0
  let buffer = ""

  for (let i = 0; i < input.length; i += 1) {
    const char = input[i]
    const next = input[i + 1]

    if (char === "'" && input[i - 1] !== "\\") {
      buffer += char
      i += 1
      while (i < input.length) {
        buffer += input[i]
        if (input[i] === "'" && input[i + 1] !== "'") {
          break
        }
        if (input[i] === "'" && input[i + 1] === "'") {
          i += 1
          buffer += input[i]
        }
        i += 1
      }
      continue
    }

    if (char === "-" && next === "-") {
      buffer += char
      buffer += next
      i += 2
      while (i < input.length && input[i] !== "\n") {
        buffer += input[i]
        i += 1
      }
      if (i < input.length) {
        buffer += input[i]
      }
      continue
    }

    if (char === "/" && next === "*") {
      buffer += char
      buffer += next
      i += 2
      while (i < input.length - 1) {
        buffer += input[i]
        if (input[i] === "*" && input[i + 1] === "/") {
          i += 1
          buffer += input[i]
          break
        }
        i += 1
      }
      continue
    }

    if (char === "(") {
      depth += 1
    } else if (char === ")" && depth > 0) {
      depth -= 1
    }

    if (char === separator && depth === 0) {
      items.push(buffer.trim())
      buffer = ""
      continue
    }

    buffer += char
  }

  if (buffer.trim()) {
    items.push(buffer.trim())
  }

  return items
}

function splitStatements(input: string): string[] {
  return splitTopLevel(input, ";")
}

function normalizeKeywordCase(input: string, options: TsqlFormatOptions): string {
  const tokens = tokenizeTsql(input)
  return tokens
    .map((token) => {
      if (token.type !== "word") {
        return token.value
      }

      return formatKeyword(token.value, options.keywordCase)
    })
    .join("")
}

function getIndent(level: number, options: TsqlFormatOptions): string {
  return " ".repeat(Math.max(0, level) * options.indentSize)
}

function formatDeclareBlock(statement: string, options: TsqlFormatOptions): string {
  const payload = statement.replace(/^DECLARE\s+/i, "").trim()
  const declarations = splitTopLevel(payload, ",")

  const parsed = declarations.map((entry) => {
    const match = entry.match(/^(@[A-Za-z0-9_#$]+)\s+([A-Za-z0-9_\[\]]+(?:\s*\([^)]*\))?)(?:\s*=\s*(.*))?$/i)
    if (!match) {
      return { raw: entry }
    }

    const [, variable, dataType, assignment] = match
    return {
      variable,
      dataType,
      assignment: assignment?.trim() ?? null,
    }
  })

  if (!options.advancedAlignment) {
    return [
      "DECLARE",
      ...parsed.map((item, idx) => {
        if ("raw" in item) {
          return `${getIndent(1, options)}${item.raw}${idx === parsed.length - 1 ? "" : ","}`
        }
        const assign = item.assignment ? ` = ${item.assignment}` : ""
        return `${getIndent(1, options)}${item.variable} ${item.dataType}${assign}${idx === parsed.length - 1 ? "" : ","}`
      }),
    ].join("\n")
  }

  const varWidth = parsed.reduce((max, item) => {
    if ("raw" in item) return max
    return Math.max(max, item.variable.length)
  }, 0)

  const typeWidth = parsed.reduce((max, item) => {
    if ("raw" in item) return max
    return Math.max(max, item.dataType.length)
  }, 0)

  return [
    "DECLARE",
    ...parsed.map((item, idx) => {
      if ("raw" in item) {
        return `${getIndent(1, options)}${item.raw}${idx === parsed.length - 1 ? "" : ","}`
      }

      const variable = item.variable.padEnd(varWidth)
      const dataType = item.dataType.padEnd(typeWidth)
      let assignment = ""

      if (item.assignment) {
        assignment = options.alignEquals
          ? ` = ${item.assignment}`
          : ` ${"="} ${item.assignment}`
      }

      return `${getIndent(1, options)}${variable} ${dataType}${assignment}${idx === parsed.length - 1 ? "" : ","}`
    }),
  ].join("\n")
}

function formatProcedureParameters(statement: string, options: TsqlFormatOptions): string {
  const openIndex = statement.indexOf("(")
  const closeIndex = statement.lastIndexOf(")")

  if (openIndex < 0 || closeIndex < 0 || closeIndex <= openIndex) {
    return statement
  }

  const before = statement.slice(0, openIndex).trim()
  const inner = statement.slice(openIndex + 1, closeIndex)
  const after = statement.slice(closeIndex + 1).trim()

  const params = splitTopLevel(inner, ",")
  const parsed = params.map((param) => {
    const match = param.trim().match(/^(@[A-Za-z0-9_#$]+)\s+([^=]+?)(?:\s*=\s*(.*))?$/)
    if (!match) {
      return { raw: param.trim() }
    }

    return {
      name: match[1],
      dataType: match[2].trim(),
      defaultValue: match[3]?.trim() ?? null,
    }
  })

  const nameWidth = parsed.reduce((max, item) => ("raw" in item ? max : Math.max(max, item.name.length)), 0)
  const typeWidth = parsed.reduce((max, item) => ("raw" in item ? max : Math.max(max, item.dataType.length)), 0)

  const lines = parsed.map((item, index) => {
    if ("raw" in item) {
      return `${getIndent(1, options)}${item.raw}${index === parsed.length - 1 ? "" : ","}`
    }

    const name = options.advancedAlignment ? item.name.padEnd(nameWidth) : item.name
    const dataType = options.advancedAlignment ? item.dataType.padEnd(typeWidth) : item.dataType
    const defaultPart = item.defaultValue
      ? options.alignEquals
        ? ` = ${item.defaultValue}`
        : ` ${"="} ${item.defaultValue}`
      : ""

    return `${getIndent(1, options)}${name} ${dataType}${defaultPart}${index === parsed.length - 1 ? "" : ","}`
  })

  return `${before}\n(\n${lines.join("\n")}\n)${after ? `\n${after}` : ""}`
}

function formatInsertStatement(statement: string, options: TsqlFormatOptions): string {
  const match = statement.match(/^(INSERT\s+INTO\s+[\s\S]+?)\(([^)]*)\)\s*VALUES\s*\(([^)]*)\)([\s\S]*)$/i)
  if (!match) {
    return statement
  }

  const [, header, columnsRaw, valuesRaw, tail] = match
  const columns = splitTopLevel(columnsRaw, ",")
  const values = splitTopLevel(valuesRaw, ",")

  const formattedColumns = columns.map(
    (column, index) => `${getIndent(1, options)}${column.trim()}${index === columns.length - 1 ? "" : ","}`,
  )

  const formattedValues = values.map(
    (value, index) => `${getIndent(1, options)}${value.trim()}${index === values.length - 1 ? "" : ","}`,
  )

  return [
    header.trim(),
    "(",
    ...formattedColumns,
    ")",
    "VALUES",
    "(",
    ...formattedValues,
    ")",
    tail.trim(),
  ]
    .filter(Boolean)
    .join("\n")
}

function parseSelectColumns(columnsPart: string): string[] {
  return splitTopLevel(columnsPart, ",").map((entry) => entry.trim())
}

function formatSelectStatement(statement: string, options: TsqlFormatOptions): string {
  const fromIndex = statement.search(/\bFROM\b/i)
  if (fromIndex === -1) {
    return statement
  }

  const selectPart = statement.slice(0, fromIndex).trim()
  const rest = statement.slice(fromIndex).trim()
  const columnSegment = selectPart.replace(/^SELECT\s+/i, "")
  const columns = parseSelectColumns(columnSegment)

  const parsedColumns = columns.map((column) => {
    const aliasMatch = column.match(/^(.*?)(?:\s+AS\s+)([A-Za-z_\[\]@][\w\[\]@#$]*)$/i)
    if (!aliasMatch) {
      return { expression: column, alias: null as string | null }
    }

    return {
      expression: aliasMatch[1].trim(),
      alias: aliasMatch[2].trim(),
    }
  })

  const expressionWidth = options.advancedAlignment
    ? parsedColumns.reduce((max, item) => Math.max(max, item.expression.length), 0)
    : 0

  const lines = parsedColumns.map((item, index) => {
    const expression = options.advancedAlignment
      ? item.expression.padEnd(expressionWidth)
      : item.expression
    const alias = item.alias ? ` AS ${item.alias}` : ""
    return `${getIndent(1, options)}${expression}${alias}${index === parsedColumns.length - 1 ? "" : ","}`
  })

  const formattedRest = formatClauses(rest, options)

  return ["SELECT", ...lines, formattedRest].filter(Boolean).join("\n")
}

function formatClauses(input: string, options: TsqlFormatOptions): string {
  const tokens = tokenizeTsql(input)
  const lines: string[] = []
  let current = ""
  let indent = 0

  const pushCurrent = () => {
    const trimmed = current.trim()
    if (trimmed) {
      lines.push(`${getIndent(indent, options)}${trimmed}`)
      current = ""
    }
  }

  for (const token of tokens) {
    if (token.type === "comment-line" || token.type === "comment-block") {
      pushCurrent()
      lines.push(`${getIndent(indent, options)}${token.value}`)
      continue
    }

    if (token.type === "newline") {
      continue
    }

    if (token.type === "word") {
      const keyword = formatKeyword(token.value, options.keywordCase)
      const upper = keyword.toUpperCase()

      if (upper === "BEGIN") {
        pushCurrent()
        lines.push(`${getIndent(indent, options)}${keyword}`)
        indent += 1
        continue
      }

      if (upper === "END") {
        pushCurrent()
        indent = Math.max(0, indent - 1)
        lines.push(`${getIndent(indent, options)}${keyword}`)
        continue
      }

      if (upper === "AND" || upper === "OR") {
        pushCurrent()
        current = `${keyword} `
        continue
      }

      if (CLAUSE_BREAKS.has(upper)) {
        pushCurrent()
        current = `${keyword} `
        continue
      }

      current += `${keyword} `
      continue
    }

    if (token.type === "whitespace") {
      if (!current.endsWith(" ")) {
        current += " "
      }
      continue
    }

    if (token.type === "symbol") {
      if (token.value === ",") {
        current = current.trimEnd()
        current += ","
        pushCurrent()
      } else if (token.value === "(") {
        current = `${current.trimEnd()} (`
      } else if (token.value === ")") {
        current = `${current.trimEnd()}) `
      } else if (token.value === "=") {
        current = `${current.trimEnd()} = `
      } else {
        current += token.value
      }
      continue
    }

    current += `${token.value} `
  }

  pushCurrent()

  if (options.compactMode) {
    return lines.join("\n")
  }

  return lines.join("\n")
}

function formatStatement(statement: string, options: TsqlFormatOptions): string {
  const normalized = normalizeKeywordCase(statement.trim(), options)

  if (/^DECLARE\b/i.test(normalized)) {
    return formatDeclareBlock(normalized, options)
  }

  if (/^(CREATE|ALTER)\s+PROC(?:EDURE)?\b/i.test(normalized) && normalized.includes("(")) {
    return formatProcedureParameters(normalized, options)
  }

  if (/^INSERT\s+INTO\b/i.test(normalized)) {
    return formatInsertStatement(normalized, options)
  }

  if (/^SELECT\b/i.test(normalized)) {
    return formatSelectStatement(normalized, options)
  }

  return formatClauses(normalized, options)
}

export function formatTsql(input: string, options?: Partial<TsqlFormatOptions>): string {
  const merged = { ...defaultTsqlOptions, ...options }
  const statements = splitStatements(input)

  return statements
    .map((statement) => formatStatement(statement, merged).replace(/[ \t]+$/gm, ""))
    .filter(Boolean)
    .join(merged.compactMode ? "\n" : "\n\n")
    .trim()
}
