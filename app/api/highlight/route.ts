import { NextResponse } from "next/server"
import { createHighlighter } from "shiki"

let highlighter: Awaited<ReturnType<typeof createHighlighter>> | null = null

export async function POST(req: Request) {
  const { code, lang = "html", theme = "github-light" } = await req.json()

  if (!highlighter) {
    highlighter = await createHighlighter({
      themes: ["github-light", "github-dark"],
      langs: ["html", "jsonc", "js", "ts", "css"],
    })
  }

  const html = highlighter.codeToHtml(code, {
    lang,
    theme,
  })

  return NextResponse.json({ html })
}
