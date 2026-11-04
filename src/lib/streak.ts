/**
 * The scroll streak behind the gutter animation: a contribution-graph-style grid that fills
 * from the bottom up as the page scrolls down. While the page moves, the surface tips like
 * liquid in a glass, then sloshes back level.
 * Cells are addressed by a flat index: index = row * cols + col, with row 0 at the top and
 * col 0 next to the content column.
 */

type Random = () => number

export type StreakGrid = {
  cols: number
  rows: number
  /** What each cell shows once filled; 0 for a day without commits */
  levels: Float32Array
  /** Height above the bottom row at which each cell fills, jittered for a ragged edge */
  fillHeights: Float32Array
}

export type Slosh = {
  /** Rows the surface next to the content sits above the far edge */
  tilt: number
  /** Rows per second */
  speed: number
}

/** GitHub-style levels 1–4, as a share of full opacity */
export const LEVEL_INTENSITY = [0.4, 0.6, 0.8, 1]

export const LEVEL_SURFACE: Slosh = { tilt: 0, speed: 0 }

const RAGGEDNESS = 2.5 // rows over which the filling edge is spread
const EMPTY_SHARE = 0.12 // days without commits, even inside the streak
export const MAX_TILT = 12 // rows
const TILT_PER_VELOCITY = 0.008 // rows of tilt per px/s of scrolling
const FULL_SLOSH_DEPTH = 4 // rows of fill needed before the surface tips all the way
const SLOSH_STIFFNESS = 30 // pull back towards level: higher = quicker sloshes
const SLOSH_DAMPING = 2 // lower = more sloshes before it settles
const SETTLED_THRESHOLD = 0.01

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

/** A random level, weighted towards the lighter ones like a real contribution graph */
export const randomLevel = (random: Random = Math.random) => {
  const roll = random()
  if (roll < 0.45) return LEVEL_INTENSITY[0]
  if (roll < 0.75) return LEVEL_INTENSITY[1]
  if (roll < 0.92) return LEVEL_INTENSITY[2]
  return LEVEL_INTENSITY[3]
}

export const createStreakGrid = (cols: number, rows: number, random: Random = Math.random): StreakGrid => ({
  cols,
  rows,
  levels: Float32Array.from({ length: cols * rows }, () => (random() < EMPTY_SHARE ? 0 : randomLevel(random))),
  fillHeights: Float32Array.from(
    { length: cols * rows },
    (_, index) => rows - 1 - Math.floor(index / cols) + random() * RAGGEDNESS,
  ),
})

/** 0 at the top of the page, 1 at the bottom (and for pages too short to scroll) */
export const scrollProgress = (scrollTop: number, pageHeight: number, viewportHeight: number) => {
  const scrollable = pageHeight - viewportHeight
  if (scrollable <= 0) return 1
  return clamp(scrollTop / scrollable, 0, 1)
}

/**
 * Moves the surface on by `seconds`: scrolling pushes it towards a tilt (scrolling down raises
 * the side next to the content) and a damped spring pulls it back level, overshooting a few times.
 */
export const stepSlosh = (slosh: Slosh, scrollVelocity: number, seconds: number): Slosh => {
  const wantedTilt = clamp(scrollVelocity * TILT_PER_VELOCITY, -MAX_TILT, MAX_TILT)
  const speed = slosh.speed + (SLOSH_STIFFNESS * (wantedTilt - slosh.tilt) - SLOSH_DAMPING * slosh.speed) * seconds
  return { tilt: slosh.tilt + speed * seconds, speed }
}

export const isSloshSettled = (slosh: Slosh) =>
  Math.abs(slosh.tilt) < SETTLED_THRESHOLD && Math.abs(slosh.speed) < SETTLED_THRESHOLD

/** Writes what each cell shows at the given scroll progress and surface tilt into `targets` */
export const fillTargets = (grid: StreakGrid, progress: number, tilt: number, targets: Float32Array) => {
  const depth = progress * (grid.rows + RAGGEDNESS)
  // A nearly empty glass has little to slosh
  const surfaceTilt = tilt * Math.min(1, depth / FULL_SLOSH_DEPTH)

  grid.fillHeights.forEach((fillHeight, index) => {
    // -0.5 next to the content, +0.5 at the far edge
    const across = (index % grid.cols) / Math.max(1, grid.cols - 1) - 0.5
    targets[index] = fillHeight < depth - surfaceTilt * across ? grid.levels[index] : 0
  })
}
