import { defineConfig } from 'tsdown'

const effectExternals = [
  '@effect/platform-node',
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
