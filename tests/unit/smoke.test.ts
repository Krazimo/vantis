import { describe, it, expect } from 'vitest'
import { cn } from '../../src/lib/utils'

describe('cn', () => {
  it('concatenates classes', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('merges conflicting Tailwind classes (tailwind-merge)', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4')
  })
})
