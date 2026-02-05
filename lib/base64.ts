export type ParsedDataUri = {
  mime: string
  base64: string
}

const base64SignatureMap: Array<{ prefix: string; mime: string }> = [
  { prefix: "iVBOR", mime: "image/png" },
  { prefix: "/9j/", mime: "image/jpeg" },
  { prefix: "R0lGOD", mime: "image/gif" },
  { prefix: "UklGR", mime: "image/webp" },
  { prefix: "PHN2Zy", mime: "image/svg+xml" },
  { prefix: "PD94bW", mime: "image/svg+xml" },
]

export const sanitizeBase64 = (value: string) => value.replace(/\s/g, "")

export const parseDataUri = (value: string): ParsedDataUri | null => {
  const trimmed = value.trim()
  const match = /^data:([^;,]+);base64,([\s\S]*)$/.exec(trimmed)

  if (!match) {
    return null
  }

  return {
    mime: match[1],
    base64: sanitizeBase64(match[2]),
  }
}

export const detectMimeFromBase64 = (value: string): string | null => {
  const normalized = sanitizeBase64(value)

  for (const signature of base64SignatureMap) {
    if (normalized.startsWith(signature.prefix)) {
      return signature.mime
    }
  }

  return null
}

export const estimateBase64Size = (value: string) => {
  const normalized = sanitizeBase64(value)
  const padding = normalized.endsWith("==") ? 2 : normalized.endsWith("=") ? 1 : 0
  return Math.max(0, Math.floor((normalized.length * 3) / 4 - padding))
}

export const base64ToUint8Array = (value: string) => {
  const normalized = sanitizeBase64(value)
  const binary = atob(normalized)
  const bytes = new Uint8Array(binary.length)

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }

  return bytes
}

export const buildDataUri = (mime: string, base64: string) =>
  `data:${mime};base64,${base64}`

export const textToBase64 = (value: string) => {
  const bytes = new TextEncoder().encode(value)
  let binary = ""

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })

  return btoa(binary)
}

export const base64ToText = (value: string) => {
  const bytes = base64ToUint8Array(value)
  return new TextDecoder().decode(bytes)
}
