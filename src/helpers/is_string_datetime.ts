import { DateTime } from 'luxon'

export function isStringDateTime(value: unknown): value is string {
  if (typeof value !== 'string') {
    return false
  }
  const date = DateTime.fromISO(value)
  return date.isValid && value.length >= 10 //minimal len value for a date (e.g:2024-06-01)
}
