export function slugifyString(str: string): string {
  return (
    '/' +
    str
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
      .replace(/\s+/g, '-') // Replace one or more spaces with a single hyphen
      .replace(/-+/g, '-') // Replace multiple consecutive hyphens with a single hyphen
      .replace(/^-|-$/g, '')
  ) // Remove leading and trailing hyphens
}
