import { EditorElementMatrixRow, EditorElementMatrixSlot, EditorItem } from '@/interface/editor'
import { toCamelCase } from './toCamelCase'

export const generateSlotKey = (
  item: EditorItem,
  element: EditorElementMatrixSlot['element']
): string => {
  const baseKey = `${toCamelCase(item.name)}${toCamelCase(element.name).charAt(0).toUpperCase()}${toCamelCase(element.name).slice(1)}`
  const existingKeys = item.elements.flatMap((row: EditorElementMatrixRow) =>
    row.map((slot: EditorElementMatrixSlot) => slot.key)
  )
  let key = baseKey
  let index = 1
  while (existingKeys.includes(key)) {
    key = `${baseKey}${index}`
    index++
  }
  return key
}
