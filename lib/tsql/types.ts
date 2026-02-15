export type TokenType =
  | "word"
  | "number"
  | "symbol"
  | "string"
  | "bracket"
  | "comment-line"
  | "comment-block"
  | "newline"
  | "whitespace"

export type Token = {
  type: TokenType
  value: string
}

export type KeywordCase = "upper" | "lower"

export type TsqlFormatOptions = {
  indentSize: 2 | 4
  keywordCase: KeywordCase
  advancedAlignment: boolean
  compactMode: boolean
  alignEquals: boolean
}

export const defaultTsqlOptions: TsqlFormatOptions = {
  indentSize: 4,
  keywordCase: "upper",
  advancedAlignment: true,
  compactMode: false,
  alignEquals: true,
}
