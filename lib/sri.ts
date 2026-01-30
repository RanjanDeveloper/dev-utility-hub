export function detectResourceType(url: string) {
  const clean = url.split("?")[0].toLowerCase()

  if (clean.endsWith(".css")) return "css"
  if (clean.endsWith(".mjs")) return "module"
  if (clean.endsWith(".js")) return "script"
  if (clean.endsWith(".wasm")) return "wasm"
  if (clean.endsWith(".woff") || clean.endsWith(".woff2")) return "font"

  return "script"
}

export function buildSnippet(url: string, integrity: string) {
  const type = detectResourceType(url)

  switch (type) {
    case "css":
      return `<link rel="stylesheet" href="${url}" integrity="${integrity}" crossorigin="anonymous">`
    case "module":
      return `<script type="module" src="${url}" integrity="${integrity}" crossorigin="anonymous"></script>`
    case "wasm":
      return `<link rel="modulepreload" href="${url}" integrity="${integrity}" crossorigin="anonymous">`
    case "font":
      return `<link rel="preload" href="${url}" as="font" type="font/woff2" integrity="${integrity}" crossorigin="anonymous">`
    default:
      return `<script src="${url}" integrity="${integrity}" crossorigin="anonymous"></script>`
  }
}
