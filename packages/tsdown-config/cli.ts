import { defineConfig } from 'tsdown'

const effectExternals = [
  '@effect/cli',
  '@effect/platform',
  '@effect/platform-node',
  '@effect/printer',
  '@effect/printer-ansi',
  'effect',
] as const

export interface CliTsdownConfigOptions {
  readonly tsconfig: string
  readonly neverBundle?: ReadonlyArray<string>
}

export function defineCliTsdownConfig(options: CliTsdownConfigOptions): ReturnType<typeof defineConfig> {
  return defineConfig({
    entry: 'src/index.ts',
    outDir: 'dist',
    format: 'esm',
    fixedExtension: false,
    dts: true,
    deps: {
      neverBundle: [
        ...(options.neverBundle ?? []),
        ...effectExternals,
      ],
    },
    tsconfig: options.tsconfig,
  })
}
