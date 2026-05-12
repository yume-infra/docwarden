import { chmod, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import process from 'node:process'
import { pathToFileURL } from 'node:url'

const [, , target = 'dist/index.js'] = process.argv
const entry = pathToFileURL(resolve(target))
const shebang = '#!/usr/bin/env node\n'
const source = await readFile(entry, 'utf8')

if (!source.startsWith(shebang)) {
  await writeFile(entry, `${shebang}${source.replace(/^#!.*\n/u, '')}`)
}

await chmod(entry, 0o755)
