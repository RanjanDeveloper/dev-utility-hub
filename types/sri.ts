export type Algorithm = "sha256" | "sha384" | "sha512"

export type SRIResult = {
  algorithm: Algorithm
  value: string
}
