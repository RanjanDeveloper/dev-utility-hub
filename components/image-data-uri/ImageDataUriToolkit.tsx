"use client"

import Image from "next/image"
import { useMemo, useState } from "react"
import { Download, FileImage, ImageIcon, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import SectionCard from "@/components/common/SectionCard"
import CopyButton from "@/components/common/CopyButton"
import {
  base64ToText,
  base64ToUint8Array,
  buildDataUri,
  detectMimeFromBase64,
  estimateBase64Size,
  parseDataUri,
  sanitizeBase64,
  textToBase64,
} from "@/lib/base64"

const readFileAsDataUri = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error("Failed to read file"))
    reader.readAsDataURL(file)
  })

const downloadTextFile = (content: string, filename: string) => {
  const blob = new Blob([content], { type: "text/plain" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

const downloadImageFile = (bytes: Uint8Array, mime: string, filename: string) => {
  const buffer = Uint8Array.from(bytes).buffer
  const blob = new Blob([buffer], { type: mime })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

const mimeToExtension = (mime: string) => {
  if (mime.includes("png")) return "png"
  if (mime.includes("jpeg")) return "jpg"
  if (mime.includes("gif")) return "gif"
  if (mime.includes("webp")) return "webp"
  if (mime.includes("svg")) return "svg"
  return "img"
}

export default function ImageDataUriToolkit() {
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageDataUri, setImageDataUri] = useState("")
  const [imageBase64, setImageBase64] = useState("")
  const [stripPrefix, setStripPrefix] = useState(true)
  const [imageError, setImageError] = useState("")
  const [dragActive, setDragActive] = useState(false)

  const [base64Input, setBase64Input] = useState("")
  const [base64Preview, setBase64Preview] = useState("")
  const [base64Mime, setBase64Mime] = useState("")
  const [base64Error, setBase64Error] = useState("")

  const [textInput, setTextInput] = useState("")
  const [textEncoded, setTextEncoded] = useState("")
  const [textDecoded, setTextDecoded] = useState("")
  const [textDecodeInput, setTextDecodeInput] = useState("")
  const [textDecodeError, setTextDecodeError] = useState("")

  const [dataUriInput, setDataUriInput] = useState("")
  const [dataUriError, setDataUriError] = useState("")
  const [dataUriPreview, setDataUriPreview] = useState("")
  const [dataUriParsed, setDataUriParsed] = useState<
    | {
        mime: string
        base64: string
        size: number
      }
    | undefined
  >(undefined)

  const imageBase64Display = useMemo(() => {
    if (!imageBase64) return ""
    return stripPrefix ? imageBase64 : imageDataUri
  }, [imageBase64, imageDataUri, stripPrefix])

  const handleImageFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setImageError("Please upload a valid image file.")
      return
    }

    try {
      const dataUri = await readFileAsDataUri(file)
      const parsed = parseDataUri(dataUri)
      setImageFile(file)
      setImageDataUri(dataUri)
      setImageBase64(parsed?.base64 ?? "")
      setImageError("")
    } catch {
      setImageError("Unable to read the image. Please try another file.")
    }
  }

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      await handleImageFile(file)
    }
  }

  const onDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setDragActive(false)
    const file = event.dataTransfer.files?.[0]
    if (file) {
      await handleImageFile(file)
    }
  }

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setDragActive(true)
  }

  const onDragLeave = () => setDragActive(false)

  const onBase64InputChange = (value: string) => {
    setBase64Input(value)
    setBase64Error("")

    if (!value.trim()) {
      setBase64Preview("")
      setBase64Mime("")
      return
    }

    const parsed = parseDataUri(value)
    const normalized = parsed ? parsed.base64 : sanitizeBase64(value)
    const mime = parsed?.mime ?? detectMimeFromBase64(normalized) ?? "image/png"

    try {
      base64ToUint8Array(normalized)
      setBase64Preview(buildDataUri(mime, normalized))
      setBase64Mime(mime)
    } catch {
      setBase64Preview("")
      setBase64Mime("")
      setBase64Error("This Base64 string is invalid. Please check the input.")
    }
  }

  const onEncodeText = () => {
    const encoded = textToBase64(textInput)
    setTextEncoded(encoded)
    setTextDecodeInput(encoded)
  }

  const onDecodeText = () => {
    setTextDecodeError("")
    try {
      setTextDecoded(base64ToText(textDecodeInput.trim()))
    } catch {
      setTextDecoded("")
      setTextDecodeError("Unable to decode Base64. Please verify the input.")
    }
  }

  const onParseDataUri = () => {
    const parsed = parseDataUri(dataUriInput)

    if (!parsed) {
      setDataUriParsed(undefined)
      setDataUriError("Please enter a valid data URI.")
      return
    }

    setDataUriError("")
    setDataUriParsed({
      mime: parsed.mime,
      base64: parsed.base64,
      size: estimateBase64Size(parsed.base64),
    })
  }

  const onPreviewDataUri = () => {
    const parsed = parseDataUri(dataUriInput)
    if (!parsed) {
      setDataUriError("Please enter a valid data URI to preview.")
      setDataUriPreview("")
      return
    }

    setDataUriPreview(buildDataUri(parsed.mime, parsed.base64))
    setDataUriError("")
  }

  return (
    <div className="space-y-6">
      <SectionCard
        title="Image → Data URI"
        description="Upload an image to generate a shareable data URI string."
      >
        <div
          className={`border border-dashed rounded-lg p-6 text-center transition ${
            dragActive
              ? "border-zinc-900 bg-zinc-100 dark:border-zinc-200 dark:bg-zinc-800/40"
              : "border-zinc-200 dark:border-zinc-800"
          }`}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
        >
          <div className="flex flex-col items-center gap-3">
            <div className="rounded-full bg-zinc-100 dark:bg-zinc-800 p-3">
              <Upload className="h-5 w-5 text-zinc-600 dark:text-zinc-200" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Drag & drop an image</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                or use the file picker to select one.
              </p>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={onFileChange}
              className="text-sm"
            />
          </div>
        </div>

        {imageError && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
            {imageError}
          </div>
        )}

        {imageDataUri && (
          <div className="grid gap-4 lg:grid-cols-[1fr_240px]">
            <div className="space-y-3">
              <Label>Data URI</Label>
              <textarea
                value={imageDataUri}
                readOnly
                className="min-h-32 w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-transparent px-3 py-2 text-xs font-mono"
              />
              <div className="flex flex-wrap gap-2">
                <CopyButton value={imageDataUri} label="Copy Data URI" />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    downloadTextFile(imageDataUri, "image-data-uri.txt")
                  }
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download .txt
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Preview</Label>
              <div className="rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 p-3 flex items-center justify-center">
                <Image
                  src={imageDataUri}
                  alt={imageFile?.name ?? "Uploaded preview"}
                  width={240}
                  height={180}
                  className="max-h-48 w-auto object-contain"
                  unoptimized
                />
              </div>
            </div>
          </div>
        )}
      </SectionCard>

      <SectionCard
        title="Image → Base64"
        description="Convert the uploaded image into a raw Base64 string."
        action={
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={stripPrefix}
              onChange={(event) => setStripPrefix(event.target.checked)}
            />
            Remove data URI prefix
          </label>
        }
      >
        <div className="space-y-3">
          <Label>Base64 Output</Label>
          <textarea
            value={imageBase64Display}
            readOnly
            placeholder="Upload an image above to generate Base64."
            className="min-h-32 w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-transparent px-3 py-2 text-xs font-mono"
          />
          <div className="flex flex-wrap gap-2">
            {imageBase64Display && (
              <CopyButton
                value={imageBase64Display}
                label="Copy Base64"
                className="flex items-center gap-2"
                variant="outline"
              />
            )}
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() =>
                downloadTextFile(imageBase64Display, "image-base64.txt")
              }
              className="flex items-center gap-2"
              disabled={!imageBase64Display}
            >
              <Download className="h-4 w-4" />
              Download .txt
            </Button>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Base64 → Image"
        description="Paste Base64 data to reconstruct and preview the image."
      >
        <div className="grid gap-4 lg:grid-cols-[1fr_240px]">
          <div className="space-y-3">
            <Label htmlFor="base64-input">Base64 Input</Label>
            <textarea
              id="base64-input"
              value={base64Input}
              onChange={(event) => onBase64InputChange(event.target.value)}
              placeholder="Paste Base64 or data URI here..."
              className="min-h-32 w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-transparent px-3 py-2 text-xs font-mono"
            />
            {base64Error && (
              <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
                {base64Error}
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {base64Input && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const parsed = parseDataUri(base64Input)
                    const normalized = parsed
                      ? parsed.base64
                      : sanitizeBase64(base64Input)
                    if (normalized && base64Mime) {
                      try {
                        downloadImageFile(
                          base64ToUint8Array(normalized),
                          base64Mime,
                          `reconstructed.${mimeToExtension(base64Mime)}`,
                        )
                      } catch {
                        setBase64Error(
                          "Unable to download this image. Please verify the Base64 string.",
                        )
                      }
                    }
                  }}
                  className="flex items-center gap-2"
                  disabled={!base64Preview}
                >
                  <Download className="h-4 w-4" />
                  Download image
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Preview</Label>
            <div className="rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 p-3 flex items-center justify-center min-h-40">
              {base64Preview ? (
                <Image
                  src={base64Preview}
                  alt="Base64 preview"
                  width={240}
                  height={180}
                  className="max-h-48 w-auto object-contain"
                  unoptimized
                />
              ) : (
                <div className="text-xs text-zinc-500 dark:text-zinc-400 flex flex-col items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Paste Base64 to render preview.
                </div>
              )}
            </div>
            {base64Mime && (
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Detected MIME: {base64Mime}
              </p>
            )}
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Text → Base64 Encode"
        description="Encode plain text into Base64 (UTF-8)."
      >
        <div className="space-y-3">
          <Label htmlFor="text-input">Text Input</Label>
          <textarea
            id="text-input"
            value={textInput}
            onChange={(event) => setTextInput(event.target.value)}
            placeholder="Type or paste text to encode..."
            className="min-h-28 w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-transparent px-3 py-2 text-sm"
          />
          <Button type="button" onClick={onEncodeText} disabled={!textInput}>
            Encode to Base64
          </Button>
          <div className="space-y-2">
            <Label>Encoded Output</Label>
            <textarea
              value={textEncoded}
              readOnly
              placeholder="Encoded Base64 appears here."
              className="min-h-24 w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-transparent px-3 py-2 text-xs font-mono"
            />
            {textEncoded && (
              <CopyButton value={textEncoded} label="Copy encoded text" />
            )}
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Base64 → Text Decode"
        description="Decode Base64 content back into UTF-8 text."
      >
        <div className="space-y-3">
          <Label htmlFor="base64-text-input">Base64 Input</Label>
          <textarea
            id="base64-text-input"
            value={textDecodeInput}
            onChange={(event) => setTextDecodeInput(event.target.value)}
            placeholder="Paste Base64 to decode..."
            className="min-h-28 w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-transparent px-3 py-2 text-xs font-mono"
          />
          <Button
            type="button"
            onClick={onDecodeText}
            disabled={!textDecodeInput}
          >
            Decode to Text
          </Button>
          {textDecodeError && (
            <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
              {textDecodeError}
            </div>
          )}
          <div className="space-y-2">
            <Label>Decoded Output</Label>
            <textarea
              value={textDecoded}
              readOnly
              placeholder="Decoded text appears here."
              className="min-h-24 w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-transparent px-3 py-2 text-sm"
            />
            {textDecoded && (
              <CopyButton value={textDecoded} label="Copy decoded text" />
            )}
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Data URI → Extract"
        description="Extract the MIME type, raw Base64, and file size from a data URI."
      >
        <div className="space-y-3">
          <Label htmlFor="data-uri-input">Data URI Input</Label>
          <textarea
            id="data-uri-input"
            value={dataUriInput}
            onChange={(event) => {
              setDataUriInput(event.target.value)
              setDataUriParsed(undefined)
              setDataUriPreview("")
              setDataUriError("")
            }}
            placeholder="Paste a data URI here..."
            className="min-h-28 w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-transparent px-3 py-2 text-xs font-mono"
          />
          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={onParseDataUri}>
              Extract details
            </Button>
            <Button type="button" variant="outline" onClick={onPreviewDataUri}>
              Preview image
            </Button>
          </div>
          {dataUriError && (
            <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
              {dataUriError}
            </div>
          )}
        </div>

        {dataUriParsed && (
          <div className="grid gap-4 lg:grid-cols-[1fr_240px]">
            <div className="space-y-3">
              <div className="space-y-1">
                <Label>MIME Type</Label>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm text-zinc-700 dark:text-zinc-200">
                    {dataUriParsed.mime}
                  </p>
                  <CopyButton
                    value={dataUriParsed.mime}
                    label="Copy MIME"
                    variant="outline"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label>Base64 Content</Label>
                <textarea
                  value={dataUriParsed.base64}
                  readOnly
                  className="min-h-24 w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-transparent px-3 py-2 text-xs font-mono"
                />
                <CopyButton
                  value={dataUriParsed.base64}
                  label="Copy Base64"
                />
              </div>
              <div className="space-y-1">
                <Label>Estimated Size</Label>
                <p className="text-sm text-zinc-600 dark:text-zinc-300">
                  {dataUriParsed.size.toLocaleString()} bytes
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Preview</Label>
              <div className="rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 p-3 flex items-center justify-center min-h-40">
                {dataUriPreview ? (
                  <Image
                    src={dataUriPreview}
                    alt="Data URI preview"
                    width={240}
                    height={180}
                    className="max-h-48 w-auto object-contain"
                    unoptimized
                  />
                ) : (
                  <div className="text-xs text-zinc-500 dark:text-zinc-400 flex flex-col items-center gap-2">
                    <FileImage className="h-5 w-5" />
                    Use preview to render the image.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </SectionCard>
    </div>
  )
}
