<template>
  <Transition name="aito-loader-fade" @after-leave="emit('complete')">
    <section
      v-if="visible"
      class="aito-loader"
      :class="{ 'is-ready': ready, 'is-starting': starting }"
      tabindex="0"
      aria-label="Loading AitoSoftwares"
      @keydown.enter.self.prevent="spinOnce"
      @keydown.space.self.prevent="spinOnce"
    >
      <canvas
        ref="canvasElement"
        class="aito-loader__canvas"
        @pointerdown.prevent="spinOnce"
      ></canvas>

      <div class="aito-loader__hud" aria-live="polite">
        <strong>AITO</strong>
        <i><b :style="{ transform: `scaleX(${progress})` }"></b></i>
      </div>

      <button
        v-if="ready && !starting"
        type="button"
        class="aito-loader__start"
        @click.stop="startExperience"
      >
        Iniciar
      </button>
    </section>
  </Transition>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import * as THREE from 'three'

const props = defineProps({
  ready: {
    type: Boolean,
    default: false
  },
  reducedMotion: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['reveal', 'complete'])

const canvasElement = ref(null)
const visible = ref(true)
const starting = ref(false)
const progress = ref(0.18)

const MIN_VISIBLE_TIME = 1500
const START_EXIT_DELAY = 520
const SPIN_DURATION = 860

let scene
let camera
let renderer
let objectRoot
let lightOrb
let animationFrame = 0
let destroyed = false
let exitTimer = 0
let startedAt = 0
let currentSpin = 0
let spinFrom = 0
let spinTo = 0
let spinStart = 0
let spinActive = false

const easeInOut = (value) => value * value * (3 - 2 * value)
const lerp = (start, end, amount) => start + (end - start) * amount

function aquaMaterial(color, options = {}) {
  return new THREE.MeshPhysicalMaterial({
    color,
    metalness: options.metalness ?? 0.16,
    roughness: options.roughness ?? 0.08,
    transmission: options.transmission ?? 0.36,
    thickness: options.thickness ?? 0.65,
    transparent: true,
    opacity: options.opacity ?? 0.78,
    clearcoat: 1,
    clearcoatRoughness: 0.08,
    emissive: options.emissive ?? color,
    emissiveIntensity: options.emissiveIntensity ?? 0.24,
    side: THREE.DoubleSide
  })
}

function createLoaderObject() {
  const group = new THREE.Group()

  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.02, 5),
    aquaMaterial(0x13bc9d, {
      opacity: 0.72,
      emissive: 0x0b6f63,
      emissiveIntensity: 0.22
    })
  )
  group.add(core)

  const inner = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.58, 0.085, 150, 18, 2, 5),
    aquaMaterial(0x12ad89, {
      metalness: 0.34,
      roughness: 0.12,
      transmission: 0.08,
      opacity: 0.82,
      emissiveIntensity: 0.5
    })
  )
  inner.rotation.set(0.45, -0.24, 0.12)
  group.add(inner)

  const ringMaterial = new THREE.MeshStandardMaterial({
    color: 0x13bc9d,
    metalness: 0.42,
    roughness: 0.16,
    emissive: 0x12ad89,
    emissiveIntensity: 0.45,
    transparent: true,
    opacity: 0.72
  })

  const ringAngles = [
    [1.42, Math.PI / 2.2, 0.16],
    [1.58, Math.PI / 2.8, -0.92],
    [1.74, Math.PI / 1.78, 0.64]
  ]

  ringAngles.forEach(([radius, x, y]) => {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(radius, 0.022, 10, 180),
      ringMaterial.clone()
    )
    ring.rotation.set(x, y, 0)
    group.add(ring)
  })

  const shell = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.34, 1),
    new THREE.MeshBasicMaterial({
      color: 0x13bc9d,
      wireframe: true,
      transparent: true,
      opacity: 0.18
    })
  )
  shell.rotation.set(0.22, 0.12, -0.08)
  group.add(shell)

  return group
}

function createScene() {
  scene = new THREE.Scene()

  camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100)
  camera.position.set(0, 0, 5.4)

  renderer = new THREE.WebGLRenderer({
    canvas: canvasElement.value,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  })
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.22
  renderer.setClearColor(0x000000, 0)

  objectRoot = createLoaderObject()
  scene.add(objectRoot)

  const ambient = new THREE.AmbientLight(0xdffaf7, 1.4)
  scene.add(ambient)

  const key = new THREE.DirectionalLight(0xffffff, 2.6)
  key.position.set(3.4, 4.2, 5.2)
  scene.add(key)

  lightOrb = new THREE.PointLight(0x13bc9d, 16, 8, 2)
  lightOrb.position.set(-2.2, -0.2, 2.5)
  scene.add(lightOrb)

  handleResize()
}

function handleResize() {
  if (!renderer || !camera) return

  const size = Math.min(window.innerWidth, window.innerHeight, 480)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.setSize(size, size, false)

  camera.aspect = 1
  camera.position.z = window.innerWidth < 640 ? 6.2 : 5.4
  camera.updateProjectionMatrix()
}

function spinOnce() {
  if (props.reducedMotion) {
    currentSpin += Math.PI * 2
    return
  }

  spinFrom = currentSpin
  spinTo = currentSpin + Math.PI * 2
  spinStart = performance.now()
  spinActive = true
}

function renderFrame(time) {
  if (destroyed || !renderer || !objectRoot) return

  if (spinActive) {
    const amount = Math.min((time - spinStart) / SPIN_DURATION, 1)
    currentSpin = lerp(spinFrom, spinTo, easeInOut(amount))
    spinActive = amount < 1
  }

  const idle = props.reducedMotion ? 0.00008 : 0.00034
  objectRoot.rotation.y = currentSpin + time * idle
  objectRoot.rotation.x = Math.sin(time * 0.0007) * (props.reducedMotion ? 0.035 : 0.12)
  objectRoot.rotation.z = Math.cos(time * 0.00055) * (props.reducedMotion ? 0.02 : 0.06)

  if (lightOrb) {
    lightOrb.position.x = Math.sin(time * 0.0012) * 2.2
    lightOrb.position.y = Math.cos(time * 0.0009) * 1.4
  }

  progress.value = props.ready
    ? lerp(progress.value, 1, 0.12)
    : Math.min(0.88, progress.value + 0.0025)

  renderer.render(scene, camera)
  animationFrame = window.requestAnimationFrame(renderFrame)
}

function startExperience() {
  if (!props.ready || exitTimer || !visible.value) return

  starting.value = true
  progress.value = 1
  spinOnce()
  const elapsed = performance.now() - startedAt
  const wait = Math.max(MIN_VISIBLE_TIME - elapsed, props.reducedMotion ? 60 : START_EXIT_DELAY)

  exitTimer = window.setTimeout(() => {
    emit('reveal')
    visible.value = false
  }, wait)
}

function disposeMaterial(material) {
  Object.values(material).forEach((value) => {
    if (value?.isTexture) value.dispose()
  })
  material.dispose()
}

function disposeObject(root) {
  root?.traverse((child) => {
    child.geometry?.dispose()

    if (Array.isArray(child.material)) {
      child.material.forEach(disposeMaterial)
    } else if (child.material) {
      disposeMaterial(child.material)
    }
  })
}

watch(
  () => props.ready,
  (isReady) => {
    if (isReady) progress.value = 1
  },
  { immediate: true }
)

onMounted(() => {
  startedAt = performance.now()

  try {
    createScene()
    animationFrame = window.requestAnimationFrame(renderFrame)
    window.addEventListener('resize', handleResize, { passive: true })
  } catch (error) {
    console.warn('[Landing Loader] WebGL não pôde ser inicializado.', error)
    if (props.ready) progress.value = 1
  }
})

onBeforeUnmount(() => {
  destroyed = true
  window.clearTimeout(exitTimer)
  window.cancelAnimationFrame(animationFrame)
  window.removeEventListener('resize', handleResize)

  disposeObject(scene)
  renderer?.renderLists?.dispose()
  renderer?.dispose()
  renderer?.forceContextLoss()

  scene = null
  camera = null
  renderer = null
  objectRoot = null
  lightOrb = null
})
</script>

<style scoped>
.aito-loader {
  position: fixed;
  inset: 0;
  z-index: 80;
  display: grid;
  place-items: center;
  overflow: hidden;
  color: #f5fffd;
  background: #000;
  cursor: pointer;
  isolation: isolate;
  touch-action: manipulation;
}

.aito-loader::before {
  position: absolute;
  inset: 0;
  z-index: -2;
  content: "";
  background:
    radial-gradient(circle at 50% 52%, rgba(19, 188, 157, 0.18), transparent 24rem),
    linear-gradient(180deg, #000 0%, #020706 100%);
}

.aito-loader::after {
  position: absolute;
  inset: 0;
  z-index: -1;
  content: "";
  opacity: 0.18;
  background:
    linear-gradient(rgba(19, 188, 157, 0.14) 1px, transparent 1px),
    linear-gradient(90deg, rgba(19, 188, 157, 0.11) 1px, transparent 1px);
  background-size: 72px 72px;
  mask-image: radial-gradient(circle at center, #000 0 36%, transparent 70%);
}

.aito-loader:focus-visible {
  outline: 1px solid rgba(19, 188, 157, 0.72);
  outline-offset: -10px;
}

.aito-loader__canvas {
  position: relative;
  z-index: 1;
  display: block;
  width: min(58vmin, 480px);
  height: min(58vmin, 480px);
  filter: drop-shadow(0 0 54px rgba(19, 188, 157, 0.28));
  cursor: grab;
}

.aito-loader__canvas:active {
  cursor: grabbing;
}

.aito-loader__hud {
  position: absolute;
  right: clamp(1rem, 4vw, 4rem);
  bottom: clamp(1rem, 2vw, 1.5rem);
  left: clamp(1rem, 4vw, 4rem);
  z-index: 2;
  display: grid;
  gap: 0.54rem;
  justify-items: center;
  color: rgba(229, 255, 250, 0.78);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-align: center;
  text-transform: uppercase;
}

.aito-loader__hud strong {
  color: #f8fffd;
  font-family: "Tomorrow", system-ui, sans-serif;
  font-size: clamp(0.9rem, 2vw, 1.22rem);
  letter-spacing: 0.22em;
}

.aito-loader__hud i {
  display: block;
  width: min(100%, 14rem);
  height: 2px;
  overflow: hidden;
  background: rgba(229, 255, 250, 0.12);
  border-radius: 99px;
}

.aito-loader__hud b {
  display: block;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #13bc9d, #12ad89);
  border-radius: inherit;
  box-shadow: 0 0 18px rgba(19, 188, 157, 0.7);
  transform-origin: left center;
  transition: transform 180ms ease;
}

.aito-loader__start {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 3;
  display: inline-flex;
  min-height: 3rem;
  padding: 0 1.7rem;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(214, 255, 249, 0.34);
  border-radius: 999px;
  color: #effffb;
  background:
    linear-gradient(135deg, rgba(19, 188, 157, 0.88), rgba(18, 173, 137, 0.72)),
    rgba(1, 12, 11, 0.72);
  box-shadow:
    0 18px 54px rgba(19, 188, 157, 0.32),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(16px) saturate(1.35);
  font: inherit;
  font-size: 0.72rem;
  font-weight: 900;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  cursor: pointer;
  transform: translate(-50%, -50%);
  transition: transform 220ms ease, box-shadow 220ms ease, opacity 220ms ease;
}

.aito-loader__start:hover,
.aito-loader__start:focus-visible {
  outline: none;
  box-shadow: 0 18px 54px rgba(19, 188, 157, 0.42);
  transform: translate(-50%, calc(-50% - 2px));
}

.aito-loader-fade-leave-active {
  transition:
    opacity 900ms cubic-bezier(0.2, 0.8, 0.2, 1),
    transform 900ms cubic-bezier(0.2, 0.8, 0.2, 1),
    filter 900ms cubic-bezier(0.2, 0.8, 0.2, 1);
}

.aito-loader-fade-leave-to {
  opacity: 0;
  filter: blur(14px);
  transform: scale(1.04);
}

@media (max-width: 640px) {
  .aito-loader__canvas {
    width: min(78vmin, 360px);
    height: min(78vmin, 360px);
  }

  .aito-loader__hud {
    bottom: 1.25rem;
    font-size: 0.61rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .aito-loader-fade-leave-active,
  .aito-loader__start,
  .aito-loader__hud b {
    transition-duration: 0.01ms;
  }
}
</style>
