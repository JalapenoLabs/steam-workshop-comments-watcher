// Copyright © 2025 JalapenoLabs

import { createHash } from 'crypto'

/**
 * Recursively sorts the keys of an object (and any nested objects)
 * so that JSON stringification is deterministic
 */
function sortObject(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => sortObject(item))
  }

  if (value !== null && typeof value === 'object') {
    const sortedKeys = Object.keys(value as Record<string, unknown>).sort()
    const result: Record<string, unknown> = {}

    for (const key of sortedKeys) {
      // sort each property value as well
      result[key] = sortObject((value as Record<string, unknown>)[key])
    }

    return result
  }

  // primitives (string, number, boolean, null)
  return value
}

/**
 * Accepts any JSON-serializable object and returns a SHA-256 hash
 * of its canonical JSON representation
 */
export function hashJsonObject(data: unknown): string {
  // produce a deterministic JSON string with sorted keys
  const canonicalJson = JSON.stringify(sortObject(data))

  // create the SHA-256 hash
  const hash = createHash('sha256')
  hash.update(canonicalJson)

  // return the digest in hexadecimal form
  return hash.digest('hex')
}
