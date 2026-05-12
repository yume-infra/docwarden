import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: [
    '**/.turbo/**',
    '**/dist/**',
    '.contexta/**',
    '.docwarden/**',
    'docs/**',
  ],
})
