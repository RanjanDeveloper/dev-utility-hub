export type JsonParseError = {
  message: string
  line?: number
  column?: number
  preview?: string
  pointer?: string
}

export function parseJsonError(
  e: unknown,
  input: string
): JsonParseError {
  const message =
    e instanceof Error && typeof e.message === "string"
      ? e.message
      : "Invalid JSON"

  const match = message.match(/position\s+(\d+)/)
  if (!match) {
    return { message }
  }

  const pos = Number(match[1])
  const p = getErrorPointer(input, pos)

  return {
    message,
    line: p.line,
    column: p.col,
    preview: p.textLine,
    pointer: p.pointer,
  }
}

function getErrorPointer(json: string, pos: number) {
  const before = json.slice(0, pos)
  const lines = before.split("\n")

  const line = lines.length
  const col = lines[lines.length - 1].length + 1
  const textLine = json.split("\n")[line - 1] || ""

  return {
    line,
    col,
    textLine,
    pointer: " ".repeat(col - 1) + "^",
  }
}
