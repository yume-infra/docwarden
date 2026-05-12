import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: 'src/index.ts',
  outDir: 'dist',
  format: 'esm',
  fixedExtension: false,
  dts: true,
  deps: {
    neverBundle: ['@docwarden/cli-kit'],
  },
  tsconfig: 'tsconfig.json',
})
