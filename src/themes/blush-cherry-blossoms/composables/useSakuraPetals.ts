import { onMounted, onUnmounted, ref, type Ref } from 'vue'

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
  'rgba(255, 183, 197, 0.85)',
  'rgba(255, 197, 208, 0.8)',
  'rgba(255, 160, 180, 0.75)',
  'rgba(255, 218, 224, 0.9)',
  'rgba(248, 187, 208, 0.8)',
]

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min)
}

function createPetal(width: number, height: number, spawnAbove = true): Petal {
  const isMobile = width < 768
  const size = randomBetween(isMobile ? 6 : 8, isMobile ? 14 : 20)

  return {
    x: randomBetween(0, width),
    y: spawnAbove ? randomBetween(-height * 0.2, 0) : randomBetween(0, height),
    size,
    speedY: randomBetween(0.6, 1.8) / (size * 0.08),
    speedX: randomBetween(-0.3, 0.3),
    rotation: randomBetween(0, Math.PI * 2),
    rotationSpeed: randomBetween(-0.02, 0.02),
    opacity: randomBetween(0.5, 0.95),
    swayPhase: randomBetween(0, Math.PI * 2),
    swayAmplitude: randomBetween(0.4, 1.2),
    color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)]!,
  }
}

function drawPetal(ctx: CanvasRenderingContext2D, petal: Petal) {
  ctx.save()
  ctx.translate(petal.x, petal.y)
  ctx.rotate(petal.rotation)
  ctx.globalAlpha = petal.opacity

  const w = petal.size
  const h = petal.size * 0.6

  ctx.beginPath()
  ctx.moveTo(0, -h)
  ctx.bezierCurveTo(w * 0.6, -h * 0.8, w * 0.8, h * 0.2, 0, h)
  ctx.bezierCurveTo(-w * 0.8, h * 0.2, -w * 0.6, -h * 0.8, 0, -h)
  ctx.closePath()

  ctx.fillStyle = petal.color
  ctx.fill()

  ctx.beginPath()
  ctx.moveTo(0, -h * 0.3)
  ctx.lineTo(0, h * 0.5)
  ctx.strokeStyle = 'rgba(255, 140, 160, 0.25)'
  ctx.lineWidth = 0.5
  ctx.stroke()

  ctx.restore()
}

export function useSakuraPetals(canvasRef: Ref<HTMLCanvasElement | null>) {
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
    petalCount.value = isMobile ? 28 : 48

    if (petals.length === 0) {
      petals = Array.from({ length: petalCount.value }, () => createPetal(width, height, false))
    } else {
      petals = petals.slice(0, petalCount.value)
      while (petals.length < petalCount.value) {
        petals.push(createPetal(width, height))
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
        Object.assign(petal, createPetal(width, height, true))
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
