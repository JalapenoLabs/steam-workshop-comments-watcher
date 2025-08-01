// Copyright © 2025 JalapenoLabs

export type SteamWorkshopDetails = {
  game: string
  fileName: string
  url: string
}

export type WorkshopComment = {
  id?: string
  avatarUrl?: string
  userDisplayName?: string
  userId?: string
  username: string
  content: string
  timestamp?: Date
}

export type AllowedMentions = {
  /** which mention types to allow */
  parse?: ('everyone' | 'users' | 'roles')[]
  /** specific role IDs to allow pinging */
  roles?: string[]
  /** specific user IDs to allow pinging */
  users?: string[]
}

export type DiscordWebhookPayload = {
  /** simple message contents (up to 2000 characters) */
  content?: string
  /** enable text-to-speech for this message */
  tts?: boolean
  /** override the default username of the webhook */
  username?: string
  /** override the default avatar of the webhook */
  avatar_url?: string
  /** rich embed objects (up to 10 per message) */
  embeds?: Record<string, unknown>[]
  /** controls which mentions (users/roles/@everyone) are actually notified */
  allowed_mentions?: AllowedMentions
  /** name of a new thread to create (for forum channels) */
  thread_name?: string
  /** thread ID to send this message into (unarchives if needed) */
  thread_id?: string
  /** interactive message components (buttons, selects, etc.) */
  components?: Record<string, unknown>[]
  /** sticker IDs to send with the message */
  sticker_ids?: string[]
  /** message flags (e.g. suppress embeds) */
  flags?: number
}

export type WebhookPayload = DiscordWebhookPayload & {
  comment?: WorkshopComment
}
