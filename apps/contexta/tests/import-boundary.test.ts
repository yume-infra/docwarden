import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

const testRoot = path.dirname(fileURLToPath(import.meta.url))
const sourceRoot = path.resolve(testRoot, '../src')

async function readSource(file: string): Promise<string> {
  return fs.readFile(path.join(sourceRoot, file), 'utf8')
}

describe('contexta import boundaries', () => {
  it('keeps domain types independent from parser modules', async () => {
    const domain = await readSource('domain.ts')

    expect(domain).not.toContain('from \'./markdown.js\'')
  })

  it('keeps recognition authority independent from signal evaluation', async () => {
    const recognition = await readSource('recognition.ts')

    expect(recognition).not.toContain('from \'./signal.js\'')
  })

  it('keeps runtime as an aggregation layer instead of application orchestration', async () => {
    const runtime = await readSource('runtime.ts')

    expect(runtime).not.toContain('parseMarkdownSurface')
    expect(runtime).not.toContain('loadContextaModelEffect')
    expect(runtime).not.toContain('signalFromCandidate')
    expect(runtime).toContain('from \'./application/recognize.js\'')
    expect(runtime).toContain('from \'./application/lint.js\'')
  })

  it('keeps CLI exit code mapping out of contexta error types', async () => {
    const errors = await readSource('errors.ts')
    const cli = await readSource('cli.ts')

    expect(errors).not.toContain('exitCode')
    expect(cli).toContain('exitCodeForErrorKind')
  })

  it('keeps package root from exporting local model internals', async () => {
    const index = await readSource('index.ts')

    expect(index).not.toContain('ContextaModel')
    expect(index).not.toContain('ContextaDocument')
    expect(index).not.toContain('RecognitionRule')
    expect(index).not.toContain('SignalDefinition')
  })
})
