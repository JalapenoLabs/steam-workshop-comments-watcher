FROM node:24-alpine3.21

WORKDIR /app

RUN apt update -y \
  && apt install -y \
  build-essential

# Configs
COPY package.json .
COPY tsconfig.json .
COPY yarn.lock .

# Source
COPY src/ ./src

# Install dependencies
RUN yarn install

# Default command
CMD ["yarn", "start"]
