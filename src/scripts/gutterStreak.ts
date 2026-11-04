import {
  createStreakGrid,
  fillTargets,
  isSloshSettled,
  LEVEL_SURFACE,
  scrollProgress,
  stepSlosh,
  type Slosh,
  type StreakGrid,
} from '../lib/streak'

/*
 * Gutter streak
 *
 * The empty margins beside the content column hold a contribution-graph-style grid that
 * fills from the bottom up as the page scrolls down, like a glass filling up. While the page
 * moves, the surface tips and then sloshes back level; newly lit cells flash a shade darker.
 * Nothing runs while the page is still. With prefers-reduced-motion the fill follows the
 * scroll position without any animation.
 */

// ── Tuning ──────────────────────────────────────────────────────────────────
const CELL_SIZE = 14 // px per grid cell
const BLOCK_SIZE = 10 // px of the rounded square drawn inside each cell
const BLOCK_RADIUS = 2
const EDGE_GAP = 8 // px between the content column (and header) and the grid
const MIN_CELLS = 4 // gutters with fewer columns than this stay empty
const RISE_HALF_LIFE_MS = 60 // cells light up quickly…
const FALL_HALF_LIFE_MS = 260 // …and fade out slowly
const POP_BOOST = 0.35 // how much darker a cell flashes when it lights up
const POP_MS = 450
const VELOCITY_SMOOTHING = 0.25 // weight of the latest frame in the scroll speed
const STILL_VELOCITY = 1 // px/s below which the page counts as still
const OPACITY_STEPS = 16 // cells are drawn in batches that share an opacity
const FRAME_INTERVAL_MS = 1000 / 30 // the motion is gentle, 30fps is plenty
const MAX_STEP_MS = 100 // after a pause (hidden tab, covered window) resume instead of jumping ahead
const MAX_PIXEL_RATIO = 2
const RESIZE_DEBOUNCE_MS = 150

type Side = 'left' | 'right'

type Palette = {
  /** Empty cells */
  block: string
  /** Lit cells, drawn at up to `liveOpacity` */
  live: string
  liveOpacity: number
}

type Bounds = {
  left: number
  top: number
  width: number
  height: number
}

type Gutter = {
  side: Side
  context: CanvasRenderingContext2D
  /** Empty grid, painted once per layout or theme change */
  backdrop: HTMLCanvasElement
  bounds: Bounds
  pixelRatio: number
  grid: StreakGrid
  /** What each cell should show right now */
  targets: Float32Array
  /** What each cell shows, easing towards its target */
  shown: Float32Array
  previousTargets: Float32Array
  poppedAt: Float64Array
}

const SIDES: Side[] = ['left', 'right']

const PALETTES: Record<'light' | 'dark', Palette> = {
  light: { block: 'rgba(10, 10, 10, 0.035)', live: '#059669', liveOpacity: 0.55 },
  dark: { block: 'rgba(250, 250, 250, 0.03)', live: '#34d399', liveOpacity: 0.5 },
}

const currentPalette = () =>
  document.documentElement.classList.contains('dark') ? PALETTES.dark : PALETTES.light

const currentProgress = () =>
  scrollProgress(window.scrollY, document.documentElement.scrollHeight, window.innerHeight)

// ── Geometry ────────────────────────────────────────────────────────────────
// Column 0 sits next to the content column on both sides, so the grids mirror each other.

const BLOCK_OFFSET = (CELL_SIZE - BLOCK_SIZE) / 2

const blockLeft = (gutter: Gutter, col: number) => {
  if (gutter.side === 'right') return EDGE_GAP + col * CELL_SIZE + BLOCK_OFFSET
  return gutter.bounds.width - EDGE_GAP - (col + 1) * CELL_SIZE + BLOCK_OFFSET
}

const blockTop = (row: number) => EDGE_GAP + row * CELL_SIZE + BLOCK_OFFSET

const addBlock = (context: CanvasRenderingContext2D, gutter: Gutter, index: number) => {
  const { cols } = gutter.grid
  context.roundRect(
    blockLeft(gutter, index % cols),
    blockTop(Math.floor(index / cols)),
    BLOCK_SIZE,
    BLOCK_SIZE,
    BLOCK_RADIUS,
  )
}

// ── Drawing ─────────────────────────────────────────────────────────────────

const paintBackdrop = (gutter: Gutter, palette: Palette) => {
  const context = gutter.backdrop.getContext('2d')
  if (!context) return

  context.setTransform(gutter.pixelRatio, 0, 0, gutter.pixelRatio, 0, 0)
  context.clearRect(0, 0, gutter.bounds.width, gutter.bounds.height)
  context.fillStyle = palette.block
  context.beginPath()
  for (let index = 0; index < gutter.shown.length; index++) addBlock(context, gutter, index)
  context.fill()
}

const drawGutter = (gutter: Gutter, palette: Palette) => {
  const { context, bounds } = gutter
  context.globalAlpha = 1
  context.clearRect(0, 0, bounds.width, bounds.height)
  context.drawImage(gutter.backdrop, 0, 0, bounds.width, bounds.height)

  // One path per opacity step: a handful of fills instead of one per cell
  const batches: number[][] = Array.from({ length: OPACITY_STEPS }, () => [])
  gutter.shown.forEach((intensity, index) => {
    const step = Math.min(OPACITY_STEPS, Math.round(intensity * OPACITY_STEPS))
    if (step > 0) batches[step - 1].push(index)
  })

  context.fillStyle = palette.live
  batches.forEach((indices, step) => {
    if (indices.length === 0) return
    context.globalAlpha = ((step + 1) / OPACITY_STEPS) * palette.liveOpacity
    context.beginPath()
    indices.forEach((index) => addBlock(context, gutter, index))
    context.fill()
  })
}

// ── Easing ──────────────────────────────────────────────────────────────────

/** Eases every cell towards its target, plus a fading flash for cells that just lit up. Returns whether anything is still changing. */
const ease = (gutter: Gutter, now: number, step: number) => {
  const rise = 1 - 0.5 ** (step / RISE_HALF_LIFE_MS)
  const fall = 1 - 0.5 ** (step / FALL_HALF_LIFE_MS)
  let isChanging = false

  gutter.targets.forEach((target, index) => {
    if (target > gutter.previousTargets[index]) gutter.poppedAt[index] = now
    gutter.previousTargets[index] = target

    const popLeft = Math.max(0, 1 - (now - gutter.poppedAt[index]) / POP_MS)
    const goal = target === 0 ? 0 : Math.min(1, target + POP_BOOST * popLeft * popLeft)
    const shown = gutter.shown[index]
    if (shown === goal) return

    const eased = shown + (goal - shown) * (goal > shown ? rise : fall)
    gutter.shown[index] = Math.abs(goal - eased) < 0.01 ? goal : eased
    isChanging = true
  })

  return isChanging
}

// ── Setup ───────────────────────────────────────────────────────────────────

const createGutter = (side: Side, canvas: HTMLCanvasElement, bounds: Bounds): Gutter | null => {
  const cols = Math.floor((bounds.width - EDGE_GAP) / CELL_SIZE)
  const rows = Math.floor((bounds.height - EDGE_GAP) / CELL_SIZE)
  const context = canvas.getContext('2d')
  const isTooSmall = cols < MIN_CELLS || rows < MIN_CELLS
  canvas.hidden = isTooSmall || !context
  if (isTooSmall || !context) return null

  const pixelRatio = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO)
  const backdrop = document.createElement('canvas')
  Object.assign(canvas.style, {
    left: `${bounds.left}px`,
    top: `${bounds.top}px`,
    width: `${bounds.width}px`,
    height: `${bounds.height}px`,
  })
  canvas.width = Math.round(bounds.width * pixelRatio)
  canvas.height = Math.round(bounds.height * pixelRatio)
  backdrop.width = canvas.width
  backdrop.height = canvas.height
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)

  return {
    side,
    context,
    backdrop,
    bounds,
    pixelRatio,
    grid: createStreakGrid(cols, rows),
    targets: new Float32Array(cols * rows),
    shown: new Float32Array(cols * rows),
    previousTargets: new Float32Array(cols * rows),
    poppedAt: new Float64Array(cols * rows).fill(Number.NEGATIVE_INFINITY),
  }
}

export const startGutterStreak = () => {
  const column = document.querySelector<HTMLElement>('[data-gutter-column]')
  const header = document.querySelector<HTMLElement>('header')
  const leftCanvas = document.querySelector<HTMLCanvasElement>('canvas[data-gutter="left"]')
  const rightCanvas = document.querySelector<HTMLCanvasElement>('canvas[data-gutter="right"]')
  if (!column || !leftCanvas || !rightCanvas) return

  const canvases: Record<Side, HTMLCanvasElement> = { left: leftCanvas, right: rightCanvas }
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  let gutters: Gutter[] = []
  let frameId = 0
  let lastFrameAt = 0
  let resizeTimer = 0
  // Animation time: advances only while frames are drawn, so pauses never cause jumps
  let clock = 0
  // Both sides share one surface, mirrored around the content column
  let slosh: Slosh = LEVEL_SURFACE
  let lastScrollTop = window.scrollY
  let scrollVelocity = 0

  const measure = (): Record<Side, Bounds> => {
    const columnRect = column.getBoundingClientRect()
    const top = Math.ceil(header?.getBoundingClientRect().bottom ?? 0)
    const height = window.innerHeight - top
    const columnRight = Math.ceil(columnRect.right)
    return {
      left: { left: 0, top, width: Math.floor(columnRect.left), height },
      right: { left: columnRight, top, width: document.documentElement.clientWidth - columnRight, height },
    }
  }

  /** Shows the current scroll position straight away, without easing or sloshing */
  const drawStill = () => {
    const progress = currentProgress()
    const palette = currentPalette()
    gutters.forEach((gutter) => {
      fillTargets(gutter.grid, progress, 0, gutter.targets)
      gutter.shown.set(gutter.targets)
      gutter.previousTargets.set(gutter.targets)
      drawGutter(gutter, palette)
    })
  }

  const trackScrollVelocity = (step: number) => {
    const scrollTop = window.scrollY
    scrollVelocity += (((scrollTop - lastScrollTop) / step) * 1000 - scrollVelocity) * VELOCITY_SMOOTHING
    lastScrollTop = scrollTop
  }

  const tick = (now: number) => {
    frameId = 0
    const elapsed = now - lastFrameAt
    if (elapsed < FRAME_INTERVAL_MS) {
      frameId = requestAnimationFrame(tick)
      return
    }

    lastFrameAt = now
    const step = Math.min(elapsed, MAX_STEP_MS)
    clock += step
    trackScrollVelocity(step)
    slosh = stepSlosh(slosh, scrollVelocity, step / 1000)

    const progress = currentProgress()
    const palette = currentPalette()
    let isMoving = !isSloshSettled(slosh) || Math.abs(scrollVelocity) > STILL_VELOCITY
    gutters.forEach((gutter) => {
      fillTargets(gutter.grid, progress, slosh.tilt, gutter.targets)
      if (ease(gutter, clock, step)) isMoving = true
      drawGutter(gutter, palette)
    })

    // Sleep once everything has settled; the next scroll wakes the loop again
    if (!isMoving) {
      slosh = LEVEL_SURFACE
      scrollVelocity = 0
      return
    }
    frameId = requestAnimationFrame(tick)
  }

  const wake = () => {
    if (frameId !== 0 || gutters.length === 0) return
    lastFrameAt = performance.now()
    frameId = requestAnimationFrame(tick)
  }

  const layout = () => {
    cancelAnimationFrame(frameId)
    frameId = 0
    const bounds = measure()
    gutters = SIDES.map((side) => createGutter(side, canvases[side], bounds[side])).filter(
      (gutter): gutter is Gutter => gutter !== null,
    )

    const palette = currentPalette()
    gutters.forEach((gutter) => paintBackdrop(gutter, palette))
    lastScrollTop = window.scrollY
    drawStill()
  }

  const queueStillDraw = () => {
    if (frameId !== 0) return
    frameId = requestAnimationFrame(() => {
      frameId = 0
      drawStill()
    })
  }

  const handleScroll = () => {
    if (reducedMotion.matches) {
      queueStillDraw()
      return
    }
    wake()
  }

  const handleResize = () => {
    window.clearTimeout(resizeTimer)
    resizeTimer = window.setTimeout(layout, RESIZE_DEBOUNCE_MS)
  }

  const handleThemeChange = () => {
    const palette = currentPalette()
    gutters.forEach((gutter) => {
      paintBackdrop(gutter, palette)
      drawGutter(gutter, palette)
    })
  }

  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('resize', handleResize)
  reducedMotion.addEventListener('change', layout)
  new MutationObserver(handleThemeChange).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  })

  layout()
}
