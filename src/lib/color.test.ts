import { describe, expect, it } from 'vitest'
import { isDarkColor, relativeLuminance } from './color'

describe('relativeLuminance', () => {
  it('maps black to 0 and white to 1', () => {
    expect(relativeLuminance('000000')).toBe(0)
    expect(relativeLuminance('#FFFFFF')).toBeCloseTo(1)
  })

  it('rejects anything but 6-digit hex colours', () => {
    expect(() => relativeLuminance('fff')).toThrow()
    expect(() => relativeLuminance('blue')).toThrow()
  })
})

describe('isDarkColor', () => {
  it.each([
    ['Next.js', '000000', true],
    ['Express', '0A0A0A', true],
    ['.NET', '512BD4', true],
    ['Sentry', '362D59', true],
    ['Apollo', '311C87', true],
    ['Redux', '764ABC', false],
    ['React', '61DAFB', false],
    ['Cypress', '69D3A7', false],
  ])('%s (#%s) → %s', (_name, hex, expected) => {
    expect(isDarkColor(hex)).toBe(expected)
  })
})
