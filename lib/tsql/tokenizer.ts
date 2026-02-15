import type { Token } from "./types"

function isAlpha(char: string): boolean {
  return /[a-z_@#$]/i.test(char)
}

function isAlphaNumeric(char: string): boolean {
  return /[a-z0-9_@#$]/i.test(char)
}

function isDigit(char: string): boolean {
  return /[0-9]/.test(char)
}

export function tokenizeTsql(input: string): Token[] {
  const tokens: Token[] = []
  let index = 0

  while (index < input.length) {
    const char = input[index]
    const next = input[index + 1]

    if (char === "\n") {
      tokens.push({ type: "newline", value: "\n" })
      index += 1
      continue
    }

    if (char === "\r" && next === "\n") {
      tokens.push({ type: "newline", value: "\n" })
      index += 2
      continue
    }

    if (/\s/.test(char)) {
      let end = index + 1
      while (end < input.length && /[ \t\f\v]/.test(input[end])) {
        end += 1
      }
      tokens.push({ type: "whitespace", value: input.slice(index, end) })
      index = end
      continue
    }

    if (char === "-" && next === "-") {
      let end = index + 2
      while (end < input.length && input[end] !== "\n") {
        end += 1
      }
      tokens.push({ type: "comment-line", value: input.slice(index, end) })
      index = end
      continue
    }

    if (char === "/" && next === "*") {
      let end = index + 2
      while (end < input.length - 1) {
        if (input[end] === "*" && input[end + 1] === "/") {
          end += 2
          break
        }
        end += 1
      }
      tokens.push({ type: "comment-block", value: input.slice(index, end) })
      index = end
      continue
    }

    if (char === "'") {
      let end = index + 1
      while (end < input.length) {
        if (input[end] === "'" && input[end + 1] === "'") {
          end += 2
          continue
        }
        if (input[end] === "'") {
          end += 1
          break
        }
        end += 1
      }
      tokens.push({ type: "string", value: input.slice(index, end) })
      index = end
      continue
    }

    if (char === "[") {
      let end = index + 1
      while (end < input.length && input[end] !== "]") {
        end += 1
      }
      end = Math.min(end + 1, input.length)
      tokens.push({ type: "bracket", value: input.slice(index, end) })
      index = end
      continue
    }

    if (isAlpha(char)) {
      let end = index + 1
      while (end < input.length && isAlphaNumeric(input[end])) {
        end += 1
      }
      tokens.push({ type: "word", value: input.slice(index, end) })
      index = end
      continue
    }

    if (isDigit(char)) {
      let end = index + 1
      while (end < input.length && /[0-9.]/.test(input[end])) {
        end += 1
      }
      tokens.push({ type: "number", value: input.slice(index, end) })
      index = end
      continue
    }

    tokens.push({ type: "symbol", value: char })
    index += 1
  }

  return tokens
}
