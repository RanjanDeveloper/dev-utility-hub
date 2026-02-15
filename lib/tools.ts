export type ToolIconKey =
  | "shield-check"
  | "key-round"
  | "braces"
  | "image"
  | "database"

export type ToolDefinition = {
  id: string
  name: string
  description: string
  icon: ToolIconKey
  path: string
}

export const tools: ToolDefinition[] = [
  {
    id: "sri",
    name: "SRI Hash Generator",
    description: "Generate SRI hashes for CDN resources",
    icon: "shield-check",
    path: "/tools/sri",
  },
  {
    id: "json",
    name: "JSON Formatter",
    description: "Format, validate and generate TypeScript from JSON",
    icon: "braces",
    path: "/tools/json",
  },
  {
    id: "image-data-uri",
    name: "Image ⇄ Data URI / Base64 Toolkit",
    description: "Convert images, Base64 strings, text, and data URIs",
    icon: "image",
    path: "/tools/image-data-uri",
  },
  {
    id: "tsql",
    name: "T-SQL Formatter",
    description: "Format SQL Server scripts with aligned enterprise styling",
    icon: "database",
    path: "/tools/tsql",
  },
  {
    id: "jwt",
    name: "JWT Decoder & Validator",
    description: "Decode JWTs and validate claims or signatures",
    icon: "key-round",
    path: "/tools/jwt",
  },
]
