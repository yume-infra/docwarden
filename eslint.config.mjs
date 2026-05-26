import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: [
    '**/.turbo/**',
    '**/dist/**',
    '**/node_modules/**',
    '.antigravitycli/**',
    '.contexta/**',
    '.docwarden/**',
    'docs/**',
    'repos/**',
  ],
  lib: true,
  typescript: true,
})
