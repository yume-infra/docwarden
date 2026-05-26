#!/usr/bin/env node

import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const manifestPath = join(root, 'repos/effect-source.json')

function fail(message) {
  console.error(`Effect source verification failed: ${message}`)
  process.exitCode = 1
}

const readJson = path => JSON.parse(readFileSync(path, 'utf8'))

function git(args, options = {}) {
  const result = spawnSync('git', args, {
    cwd: root,
    encoding: 'utf8',
    ...options,
  })

  if (result.status !== 0 && options.allowFailure !== true) {
    throw new Error(result.stderr.trim() || `git ${args.join(' ')} failed`)
  }

  return result
}

const manifest = readJson(manifestPath)
const sourceDir = join(root, manifest.directory)

if (!existsSync(sourceDir)) {
  fail(`${manifest.directory} is missing`)
}

if (existsSync(join(sourceDir, '.git'))) {
  fail(`${manifest.directory} must be a squashed subtree, not a nested git checkout`)
}

if (existsSync(join(root, '.gitmodules'))) {
  const gitmodules = readFileSync(join(root, '.gitmodules'), 'utf8')
  if (gitmodules.includes(manifest.directory)) {
    fail(`${manifest.directory} must not be registered as a git submodule`)
  }
}

const indexEntries = git(['ls-files', '--stage', '--', manifest.directory]).stdout
if (indexEntries.split('\n').some(line => line.startsWith('160000 '))) {
  fail(`${manifest.directory} is a gitlink; expected tracked subtree files`)
}

const subtreeLog = git([
  'log',
  '--format=%B',
  '--grep',
  `git-subtree-dir: ${manifest.directory}`,
  '-n',
  '1',
], { allowFailure: true }).stdout

if (!subtreeLog.includes(`git-subtree-dir: ${manifest.directory}`)) {
  fail(`missing git-subtree-dir trailer for ${manifest.directory}`)
}
else if (!subtreeLog.includes(`git-subtree-split: ${manifest.commit}`)) {
  fail(`git-subtree-split does not match ${manifest.commit}`)
}

for (const [packageName, version] of Object.entries(manifest.packages)) {
  const packagePath = packageName === 'effect'
    ? 'packages/effect/package.json'
    : `packages/${packageName.replace('@effect/', '')}/package.json`
  const packageJson = readJson(join(sourceDir, packagePath))

  if (packageJson.name !== packageName) {
    fail(`${packagePath} has name ${packageJson.name}, expected ${packageName}`)
  }

  if (packageJson.version !== version) {
    fail(`${packageName} has version ${packageJson.version}, expected ${version}`)
  }
}

const importSearch = git([
  'grep',
  '-n',
  '-E',
  'from [\'"][^\'"]*repos/effect|import\\([\'"][^\'"]*repos/effect',
  '--',
  'apps',
  'packages',
  'scripts',
], { allowFailure: true })

if (importSearch.status === 0) {
  fail(`application code imports from ${manifest.directory}:\n${importSearch.stdout.trim()}`)
}

if (process.exitCode !== 1) {
  console.log(`Effect source reference verified: ${manifest.repository} ${manifest.ref} ${manifest.commit}`)
}
