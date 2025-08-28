// Normal Case => camelCase
export function toCamelCase(text: string): string {
  const words = text.split(' ').filter((word) => word.length > 0)
  if (words.length === 0) return ''
  const firstWord = words[0].toLowerCase()
  const remainingWords = words.slice(1).map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  })
  return [firstWord, ...remainingWords].join('')
}
