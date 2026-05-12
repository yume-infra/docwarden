import process from 'node:process'
import { Command, Options } from '@effect/cli'
import { NodeContext, NodeRuntime } from '@effect/platform-node'
import { Console, Effect } from 'effect'

export interface CliMetadata {
  readonly name: string
  readonly version: string
}

export interface GreetingCommandOptions {
  readonly commandName: string
  readonly defaultName?: string
  readonly optionDescription?: string
}

export function createNameOption(
  defaultName = 'world',
  description = 'Name to greet',
) {
  return Options.text('name').pipe(
    Options.withDefault(defaultName),
    Options.withDescription(description),
  )
}

export function renderGreeting(name: string): string {
  return `Hello, ${name}!`
}

export function createGreetingCommand(options: GreetingCommandOptions) {
  const name = createNameOption(
    options.defaultName,
    options.optionDescription,
  )

  return Command.make(
    options.commandName,
    { name },
    ({ name }) => Console.log(renderGreeting(name)),
  )
}

export function runCli<Name extends string, E, A>(
  command: Command.Command<Name, never, E, A>,
  metadata: CliMetadata,
  argv: ReadonlyArray<string> = process.argv,
): void {
  const cli = Command.run(command, {
    name: metadata.name,
    version: metadata.version,
  })

  NodeRuntime.runMain(
    cli(argv).pipe(Effect.provide(NodeContext.layer)),
  )
}
