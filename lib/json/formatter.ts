export type Json =
  | string
  | number
  | boolean
  | null
  | Json[]
  | { [key: string]: Json }

export function formatJson(input: string): string {
  const parsed: Json = JSON.parse(input)
  return JSON.stringify(parsed, null, 2)
}

export function minifyJson(input: string): string {
  const parsed: Json = JSON.parse(input)
  return JSON.stringify(parsed)
}

export function validateJson(
  input: string
): { valid: true } | { valid: false; message: string } {
  try {
    JSON.parse(input)
    return { valid: true }
  } catch (err) {
    return {
      valid: false,
      message: err instanceof Error ? err.message : "Invalid JSON",
    }
  }
}
