export type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue }

type TSMap = Record<string, string>

export function generateTypes(obj: unknown): string {
  if (typeof obj !== "object" || obj === null) {
    throw new Error("Input must be a JSON object")
  }

  const types: TSMap = {}

  function walk(value: JSONValue, name: string): string {
    if (Array.isArray(value)) {
      const inner = value.length
        ? walk(value[0], name + "Item")
        : "unknown"
      return `${inner}[]`
    }

    if (value !== null && typeof value === "object") {
      const interfaceName = capitalize(name)

      if (types[interfaceName]) return interfaceName

      const fields = Object.entries(value)
        .map(([key, val]) => {
          const type = walk(val, key)
          return `  ${key}: ${type}`
        })
        .join("\n")

      types[interfaceName] =
        `export interface ${interfaceName} {\n${fields}\n}`

      return interfaceName
    }

    if (typeof value === "string") return "string"
    if (typeof value === "number") return "number"
    if (typeof value === "boolean") return "boolean"
    if (value === null) return "null"

    return "unknown"
  }

  walk(obj as JSONValue, "Root")

  return Object.values(types).join("\n\n")
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}
