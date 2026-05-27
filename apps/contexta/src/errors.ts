export type RuntimeErrorKind = 'config' | 'parse' | 'runtime'

export class ContextaConfigError extends Error {
  readonly _tag = 'ContextaConfigError' as const
  readonly kind = 'config' as const
  readonly exitCode = 2 as const

  constructor(options: { readonly message: string }) {
    super(options.message)
    this.name = 'ContextaConfigError'
  }
}

export class ContextaParseError extends Error {
  readonly _tag = 'ContextaParseError' as const
  readonly kind = 'parse' as const
  readonly exitCode = 2 as const

  constructor(options: { readonly message: string }) {
    super(options.message)
    this.name = 'ContextaParseError'
  }
}

export class ContextaRuntimeError extends Error {
  readonly _tag = 'ContextaRuntimeError' as const
  readonly kind = 'runtime' as const
  readonly exitCode = 2 as const

  constructor(options: { readonly message: string }) {
    super(options.message)
    this.name = 'ContextaRuntimeError'
  }
}

export type ContextaError = ContextaConfigError | ContextaParseError | ContextaRuntimeError

export function isContextaError(error: unknown): error is ContextaError {
  return error instanceof ContextaConfigError
    || error instanceof ContextaParseError
    || error instanceof ContextaRuntimeError
}

export function toContextaError(error: unknown): ContextaError {
  if (isContextaError(error)) {
    return error
  }
  if (error instanceof Error) {
    return new ContextaRuntimeError({ message: error.message })
  }
  return new ContextaRuntimeError({ message: String(error) })
}

export function formatUnknownCause(cause: unknown): string {
  if (cause instanceof Error) {
    return cause.message
  }
  return String(cause)
}
