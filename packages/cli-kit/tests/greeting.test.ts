import { describe, expect, it } from 'vitest'
import { renderGreeting } from '../src/index.js'

describe('renderGreeting', () => {
  it('renders the addressed greeting', () => {
    expect(renderGreeting('Sayori')).toBe('Hello, Sayori!')
  })
})
