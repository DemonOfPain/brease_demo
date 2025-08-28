export const createBuilderContentSync = (newValues: Record<string, any>) => {
  const syncArray = Object.entries(newValues).map(([, entry]) => ({
    id: entry.id,
    value: entry.value
  }))
  return syncArray
}
