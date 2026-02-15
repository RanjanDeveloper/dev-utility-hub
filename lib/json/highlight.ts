import { highlightCode as sharedHighlightCode } from "@/lib/highlight"

type HighlightRequest = {
  code: string
  lang: "jsonc" | "ts"
}

export async function highlightCode(
  code: string,
  lang: HighlightRequest["lang"],
): Promise<string> {
  return sharedHighlightCode(code, lang)
}
