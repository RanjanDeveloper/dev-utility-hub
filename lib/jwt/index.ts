export type JwtParts = {
  header: string
  payload: string
  signature: string
  signingInput: string
}

export type JwtDecodeResult = {
  headerJson: string
  payloadJson: string
  header: Record<string, unknown>
  payload: Record<string, unknown>
}

const textDecoder = new TextDecoder()
const textEncoder = new TextEncoder()

export function splitJwt(token: string): JwtParts {
  const parts = token.split(".")
  if (parts.length !== 3) {
    throw new Error("JWT must have three dot-separated parts")
  }

  const [header, payload, signature] = parts
  if (!header || !payload) {
    throw new Error("JWT header and payload are required")
  }

  return {
    header,
    payload,
    signature,
    signingInput: `${header}.${payload}`,
  }
}

export function decodeBase64Url(base64Url: string): string {
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=")
  const binary = atob(padded)
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
  return textDecoder.decode(bytes)
}

export function parseJsonPayload(input: string): Record<string, unknown> {
  const value = JSON.parse(input) as Record<string, unknown>
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("JWT payload must be a JSON object")
  }
  return value
}

export function decodeJwt(token: string): JwtDecodeResult {
  const { header, payload } = splitJwt(token.trim())
  const headerJson = decodeBase64Url(header)
  const payloadJson = decodeBase64Url(payload)

  return {
    headerJson,
    payloadJson,
    header: parseJsonPayload(headerJson),
    payload: parseJsonPayload(payloadJson),
  }
}

export function base64UrlEncode(data: Uint8Array): string {
  const binary = String.fromCharCode(...data)
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "")
}

export async function verifyHmacSignature({
  secret,
  signingInput,
  signature,
  algorithm,
}: {
  secret: string
  signingInput: string
  signature: string
  algorithm: "HS256" | "HS384" | "HS512"
}): Promise<boolean> {
  if (!globalThis.crypto?.subtle) {
    throw new Error("Web Crypto API is not available in this environment")
  }

  const hash =
    algorithm === "HS256"
      ? "SHA-256"
      : algorithm === "HS384"
        ? "SHA-384"
        : "SHA-512"

  const key = await globalThis.crypto.subtle.importKey(
    "raw",
    textEncoder.encode(secret),
    { name: "HMAC", hash: { name: hash } },
    false,
    ["sign"],
  )
  const mac = await globalThis.crypto.subtle.sign(
    "HMAC",
    key,
    textEncoder.encode(signingInput),
  )

  const encoded = base64UrlEncode(new Uint8Array(mac))
  return encoded === signature
}

export function formatJson(value: Record<string, unknown>): string {
  return JSON.stringify(value, null, 2)
}

export function getNumericClaim(
  payload: Record<string, unknown>,
  name: string,
): number | null {
  const value = payload[name]
  if (typeof value === "number" && Number.isFinite(value)) {
    return value
  }
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) {
      return parsed
    }
  }
  return null
}

export function formatEpoch(epochSeconds: number): string {
  const date = new Date(epochSeconds * 1000)
  return date.toISOString()
}
