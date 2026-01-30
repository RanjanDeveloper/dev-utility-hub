import { NextResponse } from "next/server"
import { createHighlighter } from "shiki"

let highlighter: Awaited<ReturnType<typeof createHighlighter>> | null = null

export async function POST(req: Request) {
  const { code, theme } = await req.json()

  if (!highlighter) {
    highlighter = await createHighlighter({
      themes: ["github-light", "github-dark"],
      langs: ["html"],
    })
  }

  const html = highlighter.codeToHtml(code, {
    lang: "html",
    theme: theme || "github-light",
  })

  return NextResponse.json({ html })
}
