export type RuntimeErrorKind = 'config' | 'parse' | 'runtime'

export class IsomorphConfigError extends Error {
  readonly _tag = 'IsomorphConfigError' as const
  readonly kind = 'config' as const

  constructor(options: { readonly message: string }) {
    super(options.message)
    this.name = 'IsomorphConfigError'
  }
}

export class IsomorphParseError extends Error {
  readonly _tag = 'IsomorphParseError' as const
  readonly kind = 'parse' as const

  constructor(options: { readonly message: string }) {
    super(options.message)
    this.name = 'IsomorphParseError'
  }
}

export class IsomorphRuntimeError extends Error {
  readonly _tag = 'IsomorphRuntimeError' as const
  readonly kind = 'runtime' as const

  constructor(options: { readonly message: string }) {
    super(options.message)
    this.name = 'IsomorphRuntimeError'
  }
}

export type IsomorphError = IsomorphConfigError | IsomorphParseError | IsomorphRuntimeError

export function isIsomorphError(error: unknown): error is IsomorphError {
  return error instanceof IsomorphConfigError
    || error instanceof IsomorphParseError
    || error instanceof IsomorphRuntimeError
}

export function toIsomorphError(error: unknown): IsomorphError {
  if (isIsomorphError(error)) {
    return error
  }
  if (error instanceof Error) {
    return new IsomorphRuntimeError({ message: error.message })
  }
  return new IsomorphRuntimeError({ message: String(error) })
}

export function formatUnknownCause(cause: unknown): string {
  if (cause instanceof Error) {
    return cause.message
  }
  return String(cause)
}
