import { expect, test } from 'vitest'
import { escapeHtml } from './utils'

test('escapeHtml', () => {
  expect(escapeHtml('<div>')).toBe('&lt;div&gt;')
  expect(escapeHtml('<script>')).toBe('&lt;script&gt;')
  expect(escapeHtml('hello')).toBe('hello')
})
