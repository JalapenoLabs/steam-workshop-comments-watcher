// Copyright © 2025 JalapenoLabs

import type { WorkshopComment, WebhookPayload, SteamWorkshopDetails } from './types'

// Core
import ky from 'ky'
import chalk from 'chalk'
import moment from 'moment'
import { WEBHOOK_URL } from './env'

const isDiscordWebhook = WEBHOOK_URL.startsWith('https://discord.com/api/webhooks/')

export async function publishToWebhook(
  comment: WorkshopComment,
  workshop: SteamWorkshopDetails,
) {
  if (!comment) {
    return
  }

  const time = moment(comment.timestamp)
  const timestampFormatted = time.format('MMM Do h:mma')

  const fromContent = isDiscordWebhook
    ? ''
    : `**${comment.userDisplayName}** ${time.fromNow()}`

  const body: WebhookPayload = {
    avatar_url: comment.avatarUrl,
    username: comment.userDisplayName || comment.username,
    content: `
${fromContent}
[${workshop.game} / ${workshop.fileName}](${workshop.url}) - ${timestampFormatted}
> ${comment.content}
    `.trim(),
    flags: 4,
  }

  console.log(
    chalk.cyan(`
${chalk.cyan(workshop.url)} ${chalk.gray(`(${workshop.game} / ${workshop.fileName})`)} ${chalk.gray(timestampFormatted)}
${chalk.gray('>')} ${chalk.white(comment.content)}
  `.trim() + '\n',
    ),
  )

  if (!isDiscordWebhook) {
    body.comment = comment
  }

  let text: string | undefined
  try {
    const request = await ky.post(WEBHOOK_URL, {
      json: body,
      retry: {
        limit: 3,
        methods: [ 'post' ],
        statusCodes: [ 429, 500, 502, 503, 504 ],
      },
      timeout: 10_000,
      throwHttpErrors: false,
    })

    text = await request.text()

    if (!request.ok) {
      throw new Error(
        `${chalk.redBright(request.statusText)} (${chalk.red(request.status)}): ${chalk.yellow(text)}`,
      )
    }

    if (isDiscordWebhook) {
      console.log(
        chalk.green(`Sent webhook to Discord: ${request.status} ${request.statusText}`),
      )
    }
    else {
      console.log(
        chalk.green(`Sent webhook: ${request.status} ${request.statusText}`),
      )
    }
  }
  catch (error) {
    if (error instanceof Error) {
      console.error(
        chalk.red(`Failed to publish comment to webhook: ${error.message}`),
      )
    }
    else {
      console.error(error)
    }
  }
}
