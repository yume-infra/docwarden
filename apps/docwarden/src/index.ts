#!/usr/bin/env node

import { realpathSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

import * as NodeRuntime from '@effect/platform-node/NodeRuntime'

import { main } from './cli.js'

export {
  main,
  version,
} from './cli.js'

function isMain(): boolean {
  const entry = process.argv[1]
  return entry !== undefined && realpathSync(path.resolve(entry)) === fileURLToPath(import.meta.url)
}

if (isMain()) {
  NodeRuntime.runMain(main)
}
