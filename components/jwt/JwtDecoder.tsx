"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import VirtualCode from "@/components/VirtualCode"
import {
  decodeJwt,
  formatEpoch,
  formatJson,
  getNumericClaim,
  splitJwt,
  verifyHmacSignature,
} from "@/lib/jwt"
import { highlightCode } from "@/lib/json"
import { CheckCircle, Copy, ShieldAlert } from "lucide-react"

type ValidationState = {
  errors: string[]
  warnings: string[]
  signatureValid: boolean | null
}

const MAX_HIGHLIGHT_SIZE = 300_000

export default function JwtDecoder() {
  const [token, setToken] = useState("")
  const [secret, setSecret] = useState("")
  const [algorithm, setAlgorithm] = useState<"HS256" | "HS384" | "HS512">(
    "HS256",
  )
  const [verifySignature, setVerifySignature] = useState(false)
  const [headerOutput, setHeaderOutput] = useState<string | null>(null)
  const [payloadOutput, setPayloadOutput] = useState<string | null>(null)
  const [headerHighlight, setHeaderHighlight] = useState<string | null>(null)
  const [payloadHighlight, setPayloadHighlight] = useState<string | null>(null)
  const [validation, setValidation] = useState<ValidationState | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState<"header" | "payload" | null>(null)

  const resetOutputs = () => {
    setHeaderOutput(null)
    setPayloadOutput(null)
    setHeaderHighlight(null)
    setPayloadHighlight(null)
    setValidation(null)
    setError(null)
    setCopied(null)
  }

  const onTokenChange = (value: string) => {
    setToken(value)
    resetOutputs()
  }

  const validateClaims = (payload: Record<string, unknown>) => {
    const errors: string[] = []
    const warnings: string[] = []
    const now = Math.floor(Date.now() / 1000)

    const exp = getNumericClaim(payload, "exp")
    const nbf = getNumericClaim(payload, "nbf")
    const iat = getNumericClaim(payload, "iat")

    if (exp && exp < now) {
      errors.push(`Token expired at ${formatEpoch(exp)}.`)
    }
    if (nbf && nbf > now) {
      errors.push(`Token is not valid before ${formatEpoch(nbf)}.`)
    }
    if (iat && iat > now) {
      warnings.push(`Issued at ${formatEpoch(iat)} is in the future.`)
    }
    if (!exp) {
      warnings.push("No exp claim found.")
    }

    return { errors, warnings }
  }

  const onDecode = async () => {
    resetOutputs()

    try {
      const decoded = decodeJwt(token)
      const headerFormatted = formatJson(decoded.header)
      const payloadFormatted = formatJson(decoded.payload)

      setHeaderOutput(headerFormatted)
      setPayloadOutput(payloadFormatted)

      if (headerFormatted.length < MAX_HIGHLIGHT_SIZE) {
        const html = await highlightCode(headerFormatted, "jsonc")
        setHeaderHighlight(html)
      }

      if (payloadFormatted.length < MAX_HIGHLIGHT_SIZE) {
        const html = await highlightCode(payloadFormatted, "jsonc")
        setPayloadHighlight(html)
      }

      const claimResults = validateClaims(decoded.payload)
      const headerAlg =
        typeof decoded.header.alg === "string" ? decoded.header.alg : null
      const headerTyp =
        typeof decoded.header.typ === "string" ? decoded.header.typ : null
      if (headerTyp && headerTyp.toUpperCase() !== "JWT") {
        claimResults.warnings.push(`Header typ is set to ${headerTyp}.`)
      }
      if (verifySignature && headerAlg && headerAlg !== algorithm) {
        claimResults.warnings.push(
          `Header alg is ${headerAlg}, but verification is using ${algorithm}.`,
        )
      }
      let signatureValid: boolean | null = null

      if (verifySignature) {
        if (!secret.trim()) {
          claimResults.errors.push(
            "Signature verification requires a shared secret.",
          )
        } else {
          const parts = splitJwt(token.trim())
          signatureValid = await verifyHmacSignature({
            secret,
            signingInput: parts.signingInput,
            signature: parts.signature,
            algorithm,
          })

          if (!signatureValid) {
            claimResults.errors.push("Signature is invalid for this secret.")
          }
        }
      }

      setValidation({ ...claimResults, signatureValid })
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to decode JWT."
      setError(message)
    }
  }

  const onClear = () => {
    setToken("")
    setSecret("")
    setVerifySignature(false)
    resetOutputs()
  }

  const copyToClipboard = (value: string, target: "header" | "payload") => {
    navigator.clipboard.writeText(value)
    setCopied(target)
    setTimeout(() => setCopied(null), 1500)
  }

  const isEmpty = token.trim().length === 0

  return (
    <div className="space-y-6">
      <Card className="p-4 bg-zinc-50 dark:bg-zinc-950 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="jwt-input">JWT</Label>
          <textarea
            id="jwt-input"
            value={token}
            onChange={(event) => onTokenChange(event.target.value)}
            placeholder="Paste your JWT here..."
            className="w-full min-h-36 rounded-md border border-zinc-200 dark:border-zinc-800 bg-transparent px-3 py-2 font-mono text-sm focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-2">
              <Checkbox
                id="verify-signature"
                checked={verifySignature}
                onCheckedChange={(value) => setVerifySignature(!!value)}
              />
              <Label htmlFor="verify-signature">
                Verify signature (HMAC)
              </Label>
            </div>

            <Select
              value={algorithm}
              onValueChange={(value) =>
                setAlgorithm(value as "HS256" | "HS384" | "HS512")
              }
              disabled={!verifySignature}
            >
              <SelectTrigger className="w-full sm:w-40 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700">
                <SelectItem value="HS256">HS256</SelectItem>
                <SelectItem value="HS384">HS384</SelectItem>
                <SelectItem value="HS512">HS512</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="jwt-secret">Shared secret</Label>
            <Input
              id="jwt-secret"
              value={secret}
              onChange={(event) => setSecret(event.target.value)}
              placeholder="Enter shared secret for verification"
              disabled={!verifySignature}
              className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={onDecode} disabled={isEmpty}>
            Decode & Validate
          </Button>
          <Button variant="secondary" onClick={onClear} disabled={isEmpty}>
            Clear
          </Button>
        </div>
      </Card>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      )}

      {validation && (
        <Card className="p-4 bg-white dark:bg-zinc-900 space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-zinc-800 dark:text-zinc-200">
            {validation.errors.length === 0 ? (
              <CheckCircle className="h-4 w-4 text-emerald-500" />
            ) : (
              <ShieldAlert className="h-4 w-4 text-amber-500" />
            )}
            Validation summary
          </div>

          {validation.signatureValid !== null && (
            <div className="text-sm text-zinc-600 dark:text-zinc-300">
              Signature:{" "}
              <span
                className={
                  validation.signatureValid ? "text-emerald-500" : "text-red-500"
                }
              >
                {validation.signatureValid ? "valid" : "invalid"}
              </span>
            </div>
          )}

          {validation.errors.length > 0 && (
            <ul className="space-y-1 text-sm text-red-600 dark:text-red-400 list-disc list-inside">
              {validation.errors.map((message) => (
                <li key={message}>{message}</li>
              ))}
            </ul>
          )}

          {validation.warnings.length > 0 && (
            <ul className="space-y-1 text-sm text-amber-600 dark:text-amber-400 list-disc list-inside">
              {validation.warnings.map((message) => (
                <li key={message}>{message}</li>
              ))}
            </ul>
          )}
        </Card>
      )}

      {(headerOutput || payloadOutput) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-4 bg-zinc-50 dark:bg-zinc-950 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">
                Header
              </h2>
              {headerOutput && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => copyToClipboard(headerOutput, "header")}
                  className="flex items-center gap-2"
                >
                  <Copy className="h-4 w-4" />
                  {copied === "header" ? "Copied" : "Copy"}
                </Button>
              )}
            </div>
            {headerOutput && headerHighlight ? (
              <div
                className="shiki-base shiki-lines max-h-72 overflow-auto"
                dangerouslySetInnerHTML={{ __html: headerHighlight }}
              />
            ) : (
              headerOutput && <VirtualCode text={headerOutput} wrap />
            )}
          </Card>

          <Card className="p-4 bg-zinc-50 dark:bg-zinc-950 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">
                Payload
              </h2>
              {payloadOutput && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => copyToClipboard(payloadOutput, "payload")}
                  className="flex items-center gap-2"
                >
                  <Copy className="h-4 w-4" />
                  {copied === "payload" ? "Copied" : "Copy"}
                </Button>
              )}
            </div>
            {payloadOutput && payloadHighlight ? (
              <div
                className="shiki-base shiki-lines max-h-72 overflow-auto"
                dangerouslySetInnerHTML={{ __html: payloadHighlight }}
              />
            ) : (
              payloadOutput && <VirtualCode text={payloadOutput} wrap />
            )}
          </Card>
        </div>
      )}
    </div>
  )
}
