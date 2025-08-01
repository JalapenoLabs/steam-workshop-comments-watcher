// Copyright © 2025 JalapenoLabs

import type { WorkshopComment } from './types'

import { LocalStorage } from 'node-localstorage'

export const localStorage = new LocalStorage('./.cache')

export function saveLatestComment(workshopUrl: string, comment: WorkshopComment): void {
  localStorage.setItem(`latestComment:${workshopUrl}`, JSON.stringify(comment))
}

export function getLatestComment(workshopUrl: string): WorkshopComment | null {
  const comment = localStorage.getItem(`latestComment:${workshopUrl}`)
  return comment ? JSON.parse(comment) : null
}
