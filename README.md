# Steam Workshop Comments Watcher

Don't get notified when people comment on your Steam Workshop items?
Yeah, not sure why Steam doesn't provide this feature, but you can use this watcher to get notified about new comments on your Workshop pages.

It's simple, you give it a webhook (a Discord channel webhook is recommended) and give it a list of Workshop pages to watch.
It will then poll these pages for new comments and send a POST request to the webhook with the

# Installation

1. Clone the repository:
```bash
git clone git@github.com:JalapenoLabs/steam-workshop-comments-watcher.git
cd steam-workshop-comments-watcher
```
2. Install dependencies:
```bash
yarn install
```
3. Create a `.env` file in the root, and enter the following into the provided template:
```
# Webhook URL to call when new comments are found.s
WEBHOOK_URL=
# Comma separated list of each Steam Workshop URL OR Steam Worskhop ID to watch.
WORKSHOP_PAGES=
# Comma separated list of user ids OR usernames to ignore when checking for new comments.
BLACKLIST_USERS=
# 15 minutes (measured in milliseconds) is the default
POLL_INTERVAL_MS=1800000
```
4. Start the watcher:
```bash
yarn start
```

# Environment Variables

# Docker support
If you're familiar with Docker, there is a sample docker-compose.yml and Dockerfile available in the repository.
You can use these to run the watcher in a containerized environment.

Watch Steam Workshop urls for new comments and callback a webhook on changes. Uses polling and web crawling.
