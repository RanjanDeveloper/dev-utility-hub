type HighlightRequest = {
  code: string
  lang: "jsonc" | "ts"
}

export async function highlightCode(
  code: string,
  lang: HighlightRequest["lang"]
): Promise<string> {
  const payload: HighlightRequest = { code, lang }

  const res = await fetch("/api/highlight", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })

  const data: { html: string } = await res.json()
  return data.html
}
