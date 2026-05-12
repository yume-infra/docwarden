import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: 'src/index.ts',
  outDir: 'dist',
  format: 'esm',
  fixedExtension: false,
  dts: true,
  deps: {
    neverBundle: [
      '@effect/cli',
      '@effect/platform',
      '@effect/platform-node',
      '@effect/printer',
      '@effect/printer-ansi',
      'effect',
    ],
  },
  tsconfig: 'tsconfig.json',
})
