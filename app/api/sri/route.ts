import { NextResponse } from "next/server"
import crypto from "crypto"

const ALLOWED = ["sha256", "sha384", "sha512"]

export async function POST(req: Request) {
  try {
    let body

    try {
      body = await req.json()
    } catch {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      )
    }

    const { url, algorithm } = body

    // 1️⃣ Validate URL
    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "Please enter a CDN URL" },
        { status: 400 }
      )
    }

    try {
      new URL(url)
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      )
    }

    // 2️⃣ Validate algorithm
    if (!ALLOWED.includes(algorithm)) {
      return NextResponse.json(
        { error: "Unsupported hash algorithm" },
        { status: 400 }
      )
    }

    // 3️⃣ Fetch CDN
    const res = await fetch(url)

    if (res.status === 404) {
      return NextResponse.json(
        { error: "File not found on CDN" },
        { status: 404 }
      )
    }

    if (!res.ok) {
      return NextResponse.json(
        { error: "CDN rejected the request" },
        { status: 502 }
      )
    }

    // 4️⃣ Hash
    const buffer = Buffer.from(await res.arrayBuffer())

    const hash = crypto
      .createHash(algorithm)
      .update(buffer)
      .digest("base64")

    return NextResponse.json({
      algorithm,
      value: `${algorithm}-${hash}`,
    })
  } catch {
    return NextResponse.json(
      { error: "SRI generation failed" },
      { status: 500 }
    )
  }
}
