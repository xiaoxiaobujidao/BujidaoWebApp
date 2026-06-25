import { onMounted, onUnmounted, ref, type Ref } from 'vue'
import type { ThemeId } from '@violet-rose/themes/types'

export interface Petal {
  x: number
  y: number
  size: number
  speedY: number
  speedX: number
  rotation: number
  rotationSpeed: number
  opacity: number
  swayPhase: number
  swayAmplitude: number
  color: string
}

const PETAL_COLORS = [
  'rgba(206, 147, 216, 0.9)',
  'rgba(186, 104, 200, 0.85)',
  'rgba(171, 71, 188, 0.8)',
  'rgba(142, 36, 170, 0.75)',
  'rgba(123, 31, 162, 0.7)',
]

const VEIN_COLOR = 'rgba(106, 27, 154, 0.3)'

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min)
}

function createPetal(width: number, height: number, _theme: ThemeId, spawnAbove = true): Petal {
  const isMobile = width < 768
  const [minSize, maxSize] = isMobile ? ([8, 18] as const) : ([10, 22] as const)
  const size = randomBetween(minSize, maxSize)

  return {
    x: randomBetween(0, width),
    y: spawnAbove ? randomBetween(-height * 0.2, 0) : randomBetween(0, height),
    size,
    speedY: randomBetween(0.5, 1.6) / (size * 0.08),
    speedX: randomBetween(-0.25, 0.25),
    rotation: randomBetween(0, Math.PI * 2),
    rotationSpeed: randomBetween(-0.018, 0.018),
    opacity: randomBetween(0.55, 0.95),
    swayPhase: randomBetween(0, Math.PI * 2),
    swayAmplitude: randomBetween(0.4, 1.1),
    color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)]!,
  }
}

function drawRosePetal(ctx: CanvasRenderingContext2D, petal: Petal) {
  const w = petal.size
  const h = petal.size * 0.85

  ctx.beginPath()
  ctx.moveTo(0, h * 0.45)
  ctx.bezierCurveTo(w * 0.55, -h * 0.35, w * 0.95, h * 0.15, 0, h)
  ctx.bezierCurveTo(-w * 0.95, h * 0.15, -w * 0.55, -h * 0.35, 0, h * 0.45)
  ctx.closePath()
  ctx.fillStyle = petal.color
  ctx.fill()

  ctx.beginPath()
  ctx.moveTo(0, h * 0.1)
  ctx.quadraticCurveTo(w * 0.15, h * 0.5, 0, h * 0.85)
  ctx.strokeStyle = VEIN_COLOR
  ctx.lineWidth = 0.6
  ctx.stroke()
}

function drawPetal(ctx: CanvasRenderingContext2D, petal: Petal) {
  ctx.save()
  ctx.translate(petal.x, petal.y)
  ctx.rotate(petal.rotation)
  ctx.globalAlpha = petal.opacity
  drawRosePetal(ctx, petal)
  ctx.restore()
}

export function useFallingPetals(canvasRef: Ref<HTMLCanvasElement | null>, theme: ThemeId) {
  const petalCount = ref(40)
  let animationId = 0
  let petals: Petal[] = []
  let width = 0
  let height = 0
  let frame = 0

  function resize() {
    const canvas = canvasRef.value
    if (!canvas) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const rect = canvas.getBoundingClientRect()
    width = rect.width
    height = rect.height

    canvas.width = width * dpr
    canvas.height = height * dpr

    const ctx = canvas.getContext('2d')
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const isMobile = width < 768
    petalCount.value = isMobile ? 26 : 44

    if (petals.length === 0) {
      petals = Array.from({ length: petalCount.value }, () =>
        createPetal(width, height, theme, false),
      )
    } else {
      petals = petals.slice(0, petalCount.value)
      while (petals.length < petalCount.value) {
        petals.push(createPetal(width, height, theme))
      }
    }
  }

  function update() {
    frame++
    for (const petal of petals) {
      petal.y += petal.speedY
      petal.x +=
        petal.speedX + Math.sin(frame * 0.02 + petal.swayPhase) * petal.swayAmplitude * 0.15
      petal.rotation += petal.rotationSpeed

      if (petal.y > height + petal.size * 2) {
        Object.assign(petal, createPetal(width, height, theme, true))
        petal.y = -petal.size * 2
      }
      if (petal.x < -petal.size * 2) petal.x = width + petal.size
      if (petal.x > width + petal.size * 2) petal.x = -petal.size
    }
  }

  function render() {
    const canvas = canvasRef.value
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, width, height)
    for (const petal of petals) {
      drawPetal(ctx, petal)
    }
  }

  function tick() {
    update()
    render()
    animationId = requestAnimationFrame(tick)
  }

  function start() {
    resize()
    cancelAnimationFrame(animationId)
    animationId = requestAnimationFrame(tick)
  }

  function stop() {
    cancelAnimationFrame(animationId)
  }

  onMounted(() => {
    start()
    window.addEventListener('resize', resize)
  })

  onUnmounted(() => {
    stop()
    window.removeEventListener('resize', resize)
  })

  return { start, stop, resize }
}
