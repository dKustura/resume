import { describe, expect, it } from 'vitest'
import {
  createStreakGrid,
  fillTargets,
  isSloshSettled,
  LEVEL_INTENSITY,
  LEVEL_SURFACE,
  MAX_TILT,
  scrollProgress,
  stepSlosh,
  type Slosh,
  type StreakGrid,
} from './streak'

/** Deterministic random numbers (mulberry32) */
const seededRandom = (seed: number) => {
  let state = seed
  return () => {
    state = (state + 0x6d2b79f5) | 0
    let value = Math.imul(state ^ (state >>> 15), 1 | state)
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }
}

/** A grid without jitter or empty days: every cell is level 1 and fills exactly at its row */
const evenGrid = (cols: number, rows: number): StreakGrid => ({
  cols,
  rows,
  levels: new Float32Array(cols * rows).fill(LEVEL_INTENSITY[0]),
  fillHeights: Float32Array.from({ length: cols * rows }, (_, index) => rows - 1 - Math.floor(index / cols)),
})

const targetsFor = (grid: StreakGrid, progress: number, tilt = 0) => {
  const targets = new Float32Array(grid.cols * grid.rows)
  fillTargets(grid, progress, tilt, targets)
  return targets
}

const filledInColumn = (grid: StreakGrid, targets: Float32Array, col: number) =>
  Array.from({ length: grid.rows }, (_, row) => targets[row * grid.cols + col]).filter((target) => target > 0).length

const simulate = (slosh: Slosh, velocity: number, seconds: number, onStep?: (slosh: Slosh) => void) => {
  const step = 1 / 30
  let current = slosh
  for (let elapsed = 0; elapsed < seconds; elapsed += step) {
    current = stepSlosh(current, velocity, step)
    onStep?.(current)
  }
  return current
}

describe('scrollProgress', () => {
  it('runs from 0 at the top to 1 at the bottom', () => {
    expect(scrollProgress(0, 3000, 1000)).toBe(0)
    expect(scrollProgress(1000, 3000, 1000)).toBe(0.5)
    expect(scrollProgress(2000, 3000, 1000)).toBe(1)
  })

  it('stays within 0–1 when overscrolling', () => {
    expect(scrollProgress(-50, 3000, 1000)).toBe(0)
    expect(scrollProgress(2100, 3000, 1000)).toBe(1)
  })

  it('counts a page too short to scroll as fully read', () => {
    expect(scrollProgress(0, 800, 1000)).toBe(1)
  })
})

describe('createStreakGrid', () => {
  it('uses only contribution levels and empty days', () => {
    const grid = createStreakGrid(10, 20, seededRandom(1))
    // Levels are stored as 32-bit floats
    const allowed = [0, ...LEVEL_INTENSITY].map(Math.fround)
    expect(grid.levels.every((level) => allowed.includes(level))).toBe(true)
  })

  it('fills the bottom row first and the top row last', () => {
    const grid = createStreakGrid(10, 20, seededRandom(2))
    const bottomRow = grid.fillHeights.slice(19 * 10)
    const topRow = grid.fillHeights.slice(0, 10)
    expect(Math.max(...bottomRow)).toBeLessThan(Math.min(...topRow))
  })

  it('is reproducible with the same random source', () => {
    expect(createStreakGrid(6, 8, seededRandom(3))).toEqual(createStreakGrid(6, 8, seededRandom(3)))
  })
})

describe('fillTargets', () => {
  it('shows nothing at the top of the page', () => {
    const grid = createStreakGrid(8, 12, seededRandom(4))
    expect(targetsFor(grid, 0, MAX_TILT).every((target) => target === 0)).toBe(true)
  })

  it('shows every cell at its level at the bottom of the page', () => {
    const grid = createStreakGrid(8, 12, seededRandom(5))
    expect(targetsFor(grid, 1)).toEqual(grid.levels)
  })

  it('fills from the bottom up', () => {
    const grid = evenGrid(4, 10)
    const targets = targetsFor(grid, 0.5)
    expect([...targets.slice(0, 4)].every((target) => target === 0)).toBe(true)
    expect([...targets.slice(9 * 4)].every((target) => target > 0)).toBe(true)
  })

  it('raises the surface next to the content while tilted, and lowers it at the far edge', () => {
    const grid = evenGrid(6, 20)
    const level = filledInColumn(grid, targetsFor(grid, 0.5), 0)
    const tilted = targetsFor(grid, 0.5, 6)
    expect(filledInColumn(grid, tilted, 0)).toBeGreaterThan(level)
    expect(filledInColumn(grid, tilted, 5)).toBeLessThan(level)
  })
})

describe('stepSlosh', () => {
  it('tips the surface towards the content while scrolling down', () => {
    expect(simulate(LEVEL_SURFACE, 1000, 1).tilt).toBeGreaterThan(0)
    expect(simulate(LEVEL_SURFACE, -1000, 1).tilt).toBeLessThan(0)
  })

  it('never wants more than the maximum tilt, however fast the scroll', () => {
    const tilts: number[] = []
    simulate(LEVEL_SURFACE, 1_000_000, 10, (slosh) => tilts.push(slosh.tilt))
    expect(tilts.at(-1)).toBeCloseTo(MAX_TILT, 1)
  })

  it('sloshes past level once scrolling stops, then settles', () => {
    const tipped = simulate(LEVEL_SURFACE, 1000, 2)
    let lowest = tipped.tilt
    const settled = simulate(tipped, 0, 10, (slosh) => {
      lowest = Math.min(lowest, slosh.tilt)
    })
    expect(lowest).toBeLessThan(0)
    expect(isSloshSettled(settled)).toBe(true)
  })
})
