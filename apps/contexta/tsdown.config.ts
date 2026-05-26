import { defineCliTsdownConfig } from '@docwarden/tsdown-config/cli'

export default defineCliTsdownConfig({
  neverBundle: ['@docwarden/cli-kit'],
  tsconfig: '../../packages/tsconfig/build.json',
})
