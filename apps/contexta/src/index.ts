#!/usr/bin/env node

import * as NodeRuntime from '@effect/platform-node/NodeRuntime'
import * as NodeServices from '@effect/platform-node/NodeServices'
import * as Console from 'effect/Console'
import * as Effect from 'effect/Effect'
import * as Command from 'effect/unstable/cli/Command'

const command = Command.make('contexta', {}, () =>
  Console.log('contexta CLI'))

const main = Command.run(command, {
  version: '0.0.0',
}).pipe(
  Effect.provide(NodeServices.layer),
)

NodeRuntime.runMain(main)
