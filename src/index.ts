// Copyright © 2025 JalapenoLabs

/* eslint-disable no-async-promise-executor */

// Core
import chalk from 'chalk'
import { getSteamWorkshopComments } from './getSteamWorkshopComments'
import { getNewComments } from './getNewComments'
import { publishToWebhook } from './publishToWebhook'
import { singleThreadedInterval } from './singleThreadedInterval'
import { WORKSHOP_PAGES, POLL_INTERVAL_MS } from './env'

async function poll() {
  console.info('Starting Steam Workshop Comments Watcher...\n')

  let total: number = 0
  const promises: Promise<any>[] = []
  for (const workshopId of WORKSHOP_PAGES) {
    promises.push(
      new Promise(async (resolve) => {
        try {
          const [ comments, workshop ] = await getSteamWorkshopComments(workshopId)
          const newComments = getNewComments(workshopId, comments)

          if (!newComments.length) {
            console.debug(
              chalk.gray(`No new comments for ${workshop.game} @ ${workshop.fileName} (${workshop.url})`),
            )
            return
          }

          const webhookPromises: Promise<any>[] = []
          for (const comment of newComments) {
            webhookPromises.push(
              publishToWebhook(comment, workshop),
            )
            total++
          }

          await Promise.allSettled(webhookPromises)
        }
        finally {
          resolve(null)
        }
      }),
    )
  }

  await Promise.allSettled(promises)
  console.info(
    chalk.gray(`Parsed ${total} new comments\n`),
  )
}

singleThreadedInterval(
  () => poll(),
  POLL_INTERVAL_MS,
  true, // do initial run
)
