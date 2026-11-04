const HEX_COLOR = /^#?([0-9a-f]{6})$/i

/** Colours darker than this disappear on the dark theme's near-black surfaces */
const DARK_LUMINANCE_THRESHOLD = 0.1

const toLinearChannel = (channel: number) => {
  const value = channel / 255
  if (value <= 0.04045) return value / 12.92
  return ((value + 0.055) / 1.055) ** 2.4
}

/** WCAG relative luminance of a 6-digit hex colour: 0 for black, 1 for white */
export const relativeLuminance = (hex: string) => {
  const match = HEX_COLOR.exec(hex)
  if (!match) throw new Error(`Expected a 6-digit hex colour, got "${hex}"`)

  const value = Number.parseInt(match[1], 16)
  const red = toLinearChannel((value >> 16) & 0xff)
  const green = toLinearChannel((value >> 8) & 0xff)
  const blue = toLinearChannel(value & 0xff)
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue
}

export const isDarkColor = (hex: string) => relativeLuminance(hex) < DARK_LUMINANCE_THRESHOLD
