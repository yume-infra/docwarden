import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: [
      'apps/*/tests/**/*.{test,spec}.ts',
      'packages/*/tests/**/*.{test,spec}.ts',
    ],
    passWithNoTests: true,
  },
})
