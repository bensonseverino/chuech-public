/*
 * Shared `{token}` filler for the legal pages (terms spec §5; privacy spec
 * §5): every `{token}` is replaced by the matching value; a token with no
 * matching key is left as-is and reported in dev rather than silently dropped.
 */
export const TOKEN_RE = /\{(\w+)\}/g

export function fillTokens(
  text: string,
  values: Readonly<Record<string, string>>,
  source: string,
): string {
  return text.replace(TOKEN_RE, (token, key: string) => {
    const value = values[key]
    if (value === undefined) {
      if (import.meta.env.DEV) {
        console.warn(`[${source}] paragraph references unknown token {${key}}`)
      }
      return token
    }
    return value
  })
}
