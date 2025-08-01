// Copyright © 2025 JalapenoLabs

import type { WorkshopComment, SteamWorkshopDetails } from './types'

// Core
import chalk from 'chalk'
import ky from 'ky'
import moment from 'moment'
import * as cheerio from 'cheerio'

// Misc
import { BLACKLIST_USERS } from './env'

export async function getSteamWorkshopComments(
  workshopUrl: string,
): Promise<[
  WorkshopComment[] | null,
  SteamWorkshopDetails | null
]> {
  try {
    const response = await ky.get(workshopUrl, {
      retry: {
        limit: 3,
        methods: [ 'get' ],
        statusCodes: [ 429, 500, 502, 503, 504 ],
      },
      throwHttpErrors: true,
    })

    const text = await response.text()

    return [
      parseCommentsFromHtml(text),
      getWorkshopDetailsFromUrl(text, workshopUrl),
    ]
  }
  catch (error) {
    console.error(
      chalk.redBright('Error fetching comments for workshop:'),
      chalk.yellowBright(workshopUrl),
      '\n',
      chalk.red(error),
    )
  }

  return [ null, null ]
}

function getWorkshopDetailsFromUrl(html: string, url: string): SteamWorkshopDetails | null {
  const $ = cheerio.load(html)

  return {
    game: $('.apphub_AppName')?.text()?.trim() || '',
    fileName: $('.workshopItemTitle')?.text()?.trim() || '',
    url: url.trim(),
  }
}

function parseCommentsFromHtml(html: string): WorkshopComment[] {
  const $ = cheerio.load(html)
  const comments: WorkshopComment[] = []

  $('.commentthread_comment').each((_, el) => {
    const id = $(el).attr('id')

    if (!id) {
      return
    }

    const userDisplayName = $(el)
      .find('.commentthread_author_link bdi')?.text()?.trim()

    const username = $(el)
      .find('a[data-miniprofile]')?.attr('href')?.trim()?.replace('https://steamcommunity.com/id/', '')

    const content = $(el)
      .find('.commentthread_comment_text')?.text()?.trim()

    const avatarUrl = $(el)
      .find('img')?.attr('src')

    const userId = $(el)
      .find('a[data-miniprofile]')?.attr('data-miniprofile')

    const rawTs = $(el)
      .find('.commentthread_comment_timestamp')?.attr('title') ?? ''

    const timestamp = rawTs
      ? moment(rawTs, 'MMM D, YYYY @ h:mma')?.toDate()
      : null

    const isAuthor = $(el).find('.commentthread_workshop_authorbadge')?.text()?.toLowerCase()?.includes('author')

    if (isAuthor || BLACKLIST_USERS[userDisplayName] || BLACKLIST_USERS[username] || BLACKLIST_USERS[userId]) {
      return
    }

    comments.push({
      id,
      userId,
      username,
      userDisplayName,
      avatarUrl,
      content,
      timestamp,
    })
  })

  return comments
}
