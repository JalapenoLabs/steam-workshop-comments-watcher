// Copyright © 2025 JalapenoLabs

import type { WorkshopComment } from './types'

// Core
import { saveLatestComment, getLatestComment } from './storage'

export function getNewComments(workshopUrl: string, comments: WorkshopComment[]): WorkshopComment[] {
  const latestComment = getLatestComment(workshopUrl)

  // If no latest comment is stored, save the first comment and return all comments
  if (!latestComment) {
    if (comments.length) {
      saveLatestComment(workshopUrl, comments[0])
    }
    return comments
  }

  // Filter out comments that are older than the latest stored comment
  const newComments = comments.filter((comment) => {
    return new Date(comment.timestamp) > new Date(latestComment.timestamp)
  })

  // // Save the most recent comment from the new comments
  if (newComments.length > 0) {
    saveLatestComment(workshopUrl, newComments[0])
  }

  return newComments
}
