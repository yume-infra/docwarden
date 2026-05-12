#!/usr/bin/env node

import { createGreetingCommand, runCli } from '@docwarden/cli-kit'

export { renderGreeting } from '@docwarden/cli-kit'

const metadata = {
  name: 'docwarden',
  version: '0.0.0',
} as const

const command = createGreetingCommand({
  commandName: metadata.name,
})

runCli(command, metadata)
