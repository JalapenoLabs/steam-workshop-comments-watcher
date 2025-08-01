// Copyright © 2025 JalapenoLabs

import chalk from 'chalk'
import 'dotenv/config'

import { httpUrlRegex, steamWorkshopIdRegex } from './regex'

export const POLL_INTERVAL_MS = process.env.POLL_INTERVAL_MS
  ? parseInt(process.env.POLL_INTERVAL_MS)
  : 360 * 5 // Defaults to 5 minutes

export const BLACKLIST_USERS: Record<string, boolean> = (process.env.BLACKLIST_USERS?.split(',') || [])
  .filter(Boolean)
  .reduce((acc, user) => {
    user = user.trim()
    acc[user] = true
    return acc
  }, {})

export const WEBHOOK_URL = process.env.WEBHOOK_URL?.trim()
const WORKSHOP_PAGES_RAW = process.env.WORKSHOP_PAGES?.split(',') || []

if (!WEBHOOK_URL) {
  throw new Error(
    `${chalk.magenta(WEBHOOK_URL)} is not set in the environment variables.
    
    Create a .env file in the root directory and make sure it contains a valid webhook URL:
    ${chalk.cyan('WEBHOOK_URL=https://discord.com/api/webhooks/...')}

    Or you can set it directly in your environment variables.

    Note: It doesn't have to be a Discord webhook, it can be any URL that accepts POST requests.
    However, the default implementation is designed for Discord webhooks.
    `.trim(),
  )
}

if (!httpUrlRegex.test(WEBHOOK_URL)) {
  throw new Error(
    `The webhook url: '${chalk.magenta(WEBHOOK_URL)}' is not a valid URL.
    `.trim(),
  )
}

if (!WORKSHOP_PAGES_RAW.length) {
  throw new Error(
    `No workshop pages are set in the environment variables.
    Create a .env file in the root directory and make sure it contains valid workshop pages.
    ${chalk.cyan('WORKSHOP_PAGES=https://steamcommunity.com/...,https://steamcommunity.com/...')}

    OR you can pass the workshop page 10 digit ids directly in the environment variables.
    ${chalk.cyan('WORKSHOP_PAGES=1234567890,0987654321')}

    Note: Multiple workshop pages or ids are supported, they just need to be separated by commas.
    `.trim(),
  )
}

const NORMALIZED_WORKSHOP_PAGES = []
for (let page of WORKSHOP_PAGES_RAW) {
  page = page.trim()

  if (!page) {
    continue
  }

  if (httpUrlRegex.test(page)) {
    NORMALIZED_WORKSHOP_PAGES.push(page)
  }
  else if (steamWorkshopIdRegex.test(page)) {
    NORMALIZED_WORKSHOP_PAGES.push(`https://steamcommunity.com/sharedfiles/filedetails/?id=${page}`)
  }
  else {
    throw new Error(
      `The workshop page: '${chalk.magenta(page)}' is not a valid URL or ID.
      `.trim(),
    )
  }
}

export const WORKSHOP_PAGES = NORMALIZED_WORKSHOP_PAGES
