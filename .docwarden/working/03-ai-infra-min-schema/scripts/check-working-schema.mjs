#!/usr/bin/env node

import { readdir, readFile, stat } from 'node:fs/promises'
import { basename, dirname, join, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const allowedFileStatuses = new Set(['draft', 'reviewing', 'accepted'])
const allowedWorkspaceStatuses = new Set(['active', 'paused', 'closed'])

const scriptDir = dirname(fileURLToPath(import.meta.url))
const defaultTarget = resolve(scriptDir, '..')
const targetDir = resolve(process.argv[2] ?? defaultTarget)

const errors = []
const notes = []

function parseFrontmatter(source, file) {
  if (!source.startsWith('---\n')) {
    errors.push(`${file}: missing frontmatter`)
    return {}
  }

  const end = source.indexOf('\n---\n', 4)
  if (end === -1) {
    errors.push(`${file}: unterminated frontmatter`)
    return {}
  }

  const frontmatter = source.slice(4, end)
  const values = {}

  for (const line of frontmatter.split('\n')) {
    const match = /^([A-Za-z_][A-Za-z0-9_-]*):\s*(.*)$/.exec(line)
    if (match) {
      values[match[1]] = match[2].trim()
    }
  }

  return values
}

async function fileExists(path) {
  try {
    const info = await stat(path)
    return info.isFile()
  }
  catch {
    return false
  }
}

async function listTopLevelMarkdownFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  return entries
    .filter(entry => entry.isFile() && entry.name.endsWith('.md'))
    .map(entry => entry.name)
    .sort()
}

if (!await fileExists(join(targetDir, 'roadmap.md'))) {
  errors.push('missing roadmap.md')
}

if (!await fileExists(join(targetDir, 'log.md'))) {
  errors.push('missing log.md')
}

const markdownFiles = await listTopLevelMarkdownFiles(targetDir)
const roadmapSource = await fileExists(join(targetDir, 'roadmap.md'))
  ? await readFile(join(targetDir, 'roadmap.md'), 'utf8')
  : ''

for (const file of markdownFiles) {
  const source = await readFile(join(targetDir, file), 'utf8')
  const frontmatter = parseFrontmatter(source, file)

  const status = frontmatter.status
  if (!status) {
    errors.push(`${file}: missing status`)
  }
  else if (!allowedFileStatuses.has(status)) {
    errors.push(`${file}: invalid status "${status}"`)
  }

  if (file === 'roadmap.md') {
    const workspaceStatus = frontmatter.workspace_status
    if (!workspaceStatus) {
      errors.push('roadmap.md: missing workspace_status')
    }
    else if (!allowedWorkspaceStatuses.has(workspaceStatus)) {
      errors.push(`roadmap.md: invalid workspace_status "${workspaceStatus}"`)
    }
  }
  else if ('workspace_status' in frontmatter) {
    errors.push(`${file}: workspace_status is only allowed in roadmap.md`)
  }

  if (roadmapSource && !roadmapSource.includes(`\`${file}\``)) {
    errors.push(`roadmap.md: file index does not mention ${file}`)
  }
}

notes.push(`checked ${markdownFiles.length} markdown files in ${targetDir}`)

for (const note of notes) {
  console.log(`note: ${note}`)
}

if (errors.length > 0) {
  for (const error of errors) {
    console.error(`error: ${error}`)
  }
  process.exitCode = 1
}
else {
  console.log('pass: working schema structure check passed')
}
