<template>
  <canvas
    ref="canvasElement"
    class="aito-three-scene"
    aria-hidden="true"
  ></canvas>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { landing3dModels } from 'src/data/landing3dModels'

const props = defineProps({
  scrollProgress: {
    type: Number,
    default: 0
  },
  reducedMotion: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['ready'])

const canvasElement = ref(null)

const bundledModelUrls = import.meta.glob('../../3d-models/*.glb', {
  eager: true,
  query: '?url',
  import: 'default'
})

const BRAND_TEAL = 0x089fa5
const BRAND_TEAL_SECONDARY = 0x0ea794
const BRAND_GREEN = 0x1cbd6b
const BRAND_NAVY = 0x0b1220

const STATE_DEFAULTS = {
  x: 0,
  y: 0,
  z: 0,
  rx: 0,
  ry: 0,
  rz: 0,
  scale: 1,
  opacity: 1
}

const MODEL_KEYFRAMES = {
  logo: [
    { section: 0, x: 2.35, y: 0.05, ry: -0.35, rz: -0.08, scale: 1, opacity: 1 },
    { section: 1, x: -2.35, y: -0.72, rx: 0.3, ry: 1.05, rz: 0.16, scale: 0.92, opacity: 1 },
    { section: 2, x: -4.2, y: -1.7, rx: 0.65, ry: 1.7, scale: 0.62, opacity: 0 }
  ],
  obj2: [
    { section: 0, x: 4.3, y: 0.3, ry: -0.8, scale: 0.48, opacity: 0 },
    { section: 1, x: 4.3, y: 0.3, ry: -0.8, scale: 0.48, opacity: 0 },
    { section: 2, x: 2.4, y: 0.02, rx: -0.15, ry: 0.25, scale: 1, opacity: 1 },
    { section: 3, x: -2.35, y: -0.1, rx: 0.38, ry: 1.35, rz: -0.15, scale: 0.94, opacity: 1 },
    { section: 4, x: -4.1, y: -0.9, rx: 0.7, ry: 2.1, rz: -0.35, scale: 0.65, opacity: 0 }
  ],
  obj3: [
    { section: 0, x: 4.4, y: 0.1, scale: 0.5, opacity: 0 },
    { section: 3, x: 4.4, y: 0.1, scale: 0.5, opacity: 0 },
    { section: 4, x: 2.35, y: 0.05, rx: 0.2, ry: -0.45, scale: 1, opacity: 1 },
    { section: 5, x: -2.35, y: -0.2, rx: -0.4, ry: 0.9, rz: 0.2, scale: 0.95, opacity: 1 },
    { section: 6, x: -4.2, y: -0.8, rx: -0.7, ry: 1.5, scale: 0.65, opacity: 0 }
  ],
  obj4: [
    { section: 0, x: 4.5, y: 0.2, scale: 0.48, opacity: 0 },
    { section: 5, x: 4.5, y: 0.2, scale: 0.48, opacity: 0 },
    { section: 6, x: 2.35, y: 0.05, rx: -0.25, ry: 0.25, scale: 1, opacity: 1 },
    { section: 7, x: -2.3, y: -0.15, rx: 0.3, ry: 1.15, rz: -0.2, scale: 0.94, opacity: 1 },
    { section: 8, x: 0, y: 0.35, z: -0.4, rx: 0.05, ry: 2.1, rz: 0, scale: 0.72, opacity: 1 }
  ]
}

let scene
let camera
let renderer
let animationFrame = 0
let destroyed = false
let smoothProgress = 0
let starField
let modelEntries = {}
let lastFrameTime = 0
let readyEmitted = false

const pointerTarget = new THREE.Vector2()
const pointerCurrent = new THREE.Vector2()

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)
const lerp = (start, end, amount) => start + (end - start) * amount
const easeInOut = (value) => value * value * (3 - 2 * value)

function resolveModelUrl(fileName) {
  const match = Object.entries(bundledModelUrls).find(([path]) =>
    path.replaceAll('\\', '/').endsWith(`/3d-models/${fileName}`)
  )

  return match?.[1]
}

function prepareMaterials(root, cloneMaterials = true) {
  root.traverse((child) => {
    if (!child.isMesh || !child.material) return

    const sourceMaterials = Array.isArray(child.material)
      ? child.material
      : [child.material]
    const materials = sourceMaterials.map((material) =>
      cloneMaterials ? material.clone() : material
    )

    materials.forEach((material) => {
      material.transparent = true
      material.userData.baseOpacity = material.opacity
      material.needsUpdate = true
    })

    child.material = Array.isArray(child.material) ? materials : materials[0]
  })
}

function setObjectOpacity(root, opacity) {
  root.visible = opacity > 0.004

  root.traverse((child) => {
    if (!child.isMesh || !child.material) return

    const materials = Array.isArray(child.material) ? child.material : [child.material]
    materials.forEach((material) => {
      const baseOpacity = material.userData.baseOpacity ?? 1
      material.opacity = baseOpacity * opacity
      material.depthWrite = opacity > 0.92
    })
  })
}

function brandMaterial(color, options = {}) {
  const material = new THREE.MeshStandardMaterial({
    color,
    metalness: options.metalness ?? 0.55,
    roughness: options.roughness ?? 0.25,
    emissive: options.emissive ?? color,
    emissiveIntensity: options.emissiveIntensity ?? 0.08,
    transparent: true,
    opacity: options.opacity ?? 1,
    wireframe: options.wireframe ?? false,
    side: THREE.DoubleSide
  })

  material.userData.baseOpacity = material.opacity
  return material
}

function createCloudFallback() {
  const group = new THREE.Group()
  const teal = brandMaterial(BRAND_TEAL, { roughness: 0.18 })
  const tealLight = brandMaterial(BRAND_GREEN, {
    metalness: 0.35,
    roughness: 0.3,
    emissiveIntensity: 0.12
  })

  const lobes = [
    { radius: 0.72, position: [-0.62, -0.08, 0] },
    { radius: 0.9, position: [0.08, 0.25, 0.05] },
    { radius: 0.67, position: [0.78, -0.06, -0.02] },
    { radius: 0.58, position: [0.05, -0.48, 0.08] }
  ]

  lobes.forEach(({ radius, position }, index) => {
    const mesh = new THREE.Mesh(
      new THREE.IcosahedronGeometry(radius, 3),
      index === 3 ? tealLight : teal
    )
    mesh.position.set(...position)
    group.add(mesh)
  })

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(1.52, 0.025, 10, 120),
    brandMaterial(BRAND_GREEN, {
      metalness: 0.2,
      emissiveIntensity: 0.45,
      opacity: 0.72
    })
  )
  ring.rotation.x = Math.PI / 2.8
  ring.rotation.y = Math.PI / 7
  group.add(ring)

  return group
}

function createTorusKnotFallback() {
  const group = new THREE.Group()
  const knot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.94, 0.22, 180, 24, 2, 3),
    brandMaterial(BRAND_TEAL, {
      metalness: 0.78,
      roughness: 0.16,
      emissiveIntensity: 0.12
    })
  )
  group.add(knot)

  const wire = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1.02, 0.025, 150, 8, 2, 3),
    brandMaterial(BRAND_GREEN, {
      metalness: 0.25,
      emissiveIntensity: 0.6,
      opacity: 0.65
    })
  )
  group.add(wire)

  return group
}

function createIcosahedronFallback() {
  const group = new THREE.Group()
  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.82, 2),
    brandMaterial(BRAND_NAVY, {
      metalness: 0.7,
      roughness: 0.18,
      emissive: BRAND_TEAL_SECONDARY,
      emissiveIntensity: 0.18
    })
  )
  group.add(core)

  const shell = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.24, 1),
    brandMaterial(BRAND_GREEN, {
      metalness: 0.2,
      roughness: 0.18,
      emissiveIntensity: 0.5,
      opacity: 0.58,
      wireframe: true
    })
  )
  shell.rotation.set(0.3, 0.3, 0.1)
  group.add(shell)

  return group
}

function createOrbitalFallback() {
  const group = new THREE.Group()
  const core = new THREE.Mesh(
    new THREE.SphereGeometry(0.68, 48, 48),
    brandMaterial(BRAND_TEAL, {
      metalness: 0.7,
      roughness: 0.14,
      emissiveIntensity: 0.24
    })
  )
  group.add(core)

  const ringMaterial = brandMaterial(BRAND_GREEN, {
    metalness: 0.3,
    roughness: 0.18,
    emissiveIntensity: 0.62,
    opacity: 0.74
  })

  ;[
    [1.28, 0, 0],
    [1.5, Math.PI / 2.6, Math.PI / 5],
    [1.74, Math.PI / 1.9, -Math.PI / 4]
  ].forEach(([radius, x, y]) => {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(radius, 0.025, 10, 140),
      ringMaterial
    )
    ring.rotation.set(x, y, 0)
    group.add(ring)
  })

  return group
}

function createFallback(type) {
  if (type === 'torus-knot') return createTorusKnotFallback()
  if (type === 'icosahedron') return createIcosahedronFallback()
  if (type === 'orbital') return createOrbitalFallback()
  return createCloudFallback()
}

function normalizeModel(model) {
  const bounds = new THREE.Box3().setFromObject(model)
  const size = bounds.getSize(new THREE.Vector3())
  const center = bounds.getCenter(new THREE.Vector3())
  const largestAxis = Math.max(size.x, size.y, size.z)
  const container = new THREE.Group()

  model.position.sub(center)
  container.add(model)

  if (Number.isFinite(largestAxis) && largestAxis > 0) {
    container.scale.setScalar(2.65 / largestAxis)
  }

  return container
}

function createModelRoots() {
  Object.entries(landing3dModels).forEach(([key, config]) => {
    const root = new THREE.Group()
    const fallback = createFallback(config.fallback)
    prepareMaterials(fallback, false)
    root.add(fallback)
    scene.add(root)

    modelEntries[key] = {
      root,
      content: fallback,
      mixer: null,
      mixerRoot: null
    }
  })
}

function clearModelAnimation(entry) {
  if (!entry?.mixer) return

  entry.mixer.stopAllAction()
  if (entry.mixerRoot) entry.mixer.uncacheRoot(entry.mixerRoot)
  entry.mixer = null
  entry.mixerRoot = null
}

function playModelAnimations(entry, mixerRoot, clips) {
  if (!clips?.length) return

  const mixer = new THREE.AnimationMixer(mixerRoot)
  clips.forEach((clip) => {
    mixer.clipAction(clip).reset().play()
  })

  entry.mixer = mixer
  entry.mixerRoot = mixerRoot
}

function loadModels() {
  const loader = new GLTFLoader()

  return Promise.all(Object.entries(landing3dModels).map(([key, config]) => {
    const url = resolveModelUrl(config.fileName)

    if (!url) {
      console.warn(
        `[Landing 3D] Modelo "${config.fileName}" não encontrado em src/3d-models. ` +
        `Usando fallback visual para "${key}".`
      )
      return Promise.resolve({ key, status: 'fallback' })
    }

    return new Promise((resolve) => {
      loader.load(
        url,
        (gltf) => {
          if (destroyed) {
            disposeObject(gltf.scene)
            resolve({ key, status: 'disposed' })
            return
          }

          prepareMaterials(gltf.scene)
          const normalizedModel = normalizeModel(gltf.scene)
          const entry = modelEntries[key]

          clearModelAnimation(entry)
          disposeObject(entry.content)
          entry.root.clear()
          entry.root.add(normalizedModel)
          entry.content = normalizedModel
          playModelAnimations(entry, gltf.scene, gltf.animations)
          resolve({ key, status: 'loaded' })
        },
        undefined,
        (error) => {
          console.warn(
            `[Landing 3D] Não foi possível carregar "${config.fileName}". ` +
            `O fallback de "${key}" continuará ativo.`,
            error
          )
          resolve({ key, status: 'fallback' })
        }
      )
    })
  }))
}

function emitSceneReady() {
  if (readyEmitted) return
  readyEmitted = true
  emit('ready')
}

function createStarLayer(count, size, opacity, spread, color) {
  const positions = new Float32Array(count * 3)

  for (let index = 0; index < count; index += 1) {
    const stride = index * 3
    positions[stride] = (Math.random() - 0.5) * spread
    positions[stride + 1] = (Math.random() - 0.5) * spread * 0.7
    positions[stride + 2] = -Math.random() * 22 + 5
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

  const material = new THREE.PointsMaterial({
    color,
    size,
    sizeAttenuation: true,
    transparent: true,
    opacity,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  })

  return new THREE.Points(geometry, material)
}

function createStarField() {
  const group = new THREE.Group()
  group.add(createStarLayer(620, 0.025, 0.42, 32, 0xb8c9cc))
  group.add(createStarLayer(260, 0.045, 0.58, 28, BRAND_TEAL_SECONDARY))
  group.add(createStarLayer(90, 0.072, 0.68, 24, BRAND_GREEN))
  return group
}

function createLights() {
  const ambient = new THREE.AmbientLight(0xdce8e9, 1.05)
  scene.add(ambient)

  const directional = new THREE.DirectionalLight(0xf2f7f7, 2.8)
  directional.position.set(4, 5, 7)
  scene.add(directional)

  const tealLight = new THREE.PointLight(BRAND_TEAL, 30, 13, 2)
  tealLight.position.set(3.8, 1.5, 3.5)
  scene.add(tealLight)

  const tealFillLight = new THREE.PointLight(BRAND_TEAL_SECONDARY, 22, 12, 2)
  tealFillLight.position.set(-3.5, -1.8, 2.8)
  scene.add(tealFillLight)
}

function sampleKeyframes(keyframes, sectionPosition) {
  if (sectionPosition <= keyframes[0].section) {
    return { ...STATE_DEFAULTS, ...keyframes[0] }
  }

  const last = keyframes[keyframes.length - 1]
  if (sectionPosition >= last.section) {
    return { ...STATE_DEFAULTS, ...last }
  }

  const rightIndex = keyframes.findIndex(
    (keyframe) => keyframe.section >= sectionPosition
  )
  const from = { ...STATE_DEFAULTS, ...keyframes[rightIndex - 1] }
  const to = { ...STATE_DEFAULTS, ...keyframes[rightIndex] }
  const range = Math.max(to.section - from.section, 0.0001)
  const amount = easeInOut(clamp((sectionPosition - from.section) / range, 0, 1))
  const result = {}

  Object.keys(STATE_DEFAULTS).forEach((property) => {
    result[property] = lerp(from[property], to[property], amount)
  })

  return result
}

function updateModels(sectionPosition, elapsedTime) {
  const isMobile = window.innerWidth < 768
  const horizontalScale = isMobile ? 0.28 : 1
  const verticalScale = isMobile ? 0.54 : 1
  const mobileYOffset = isMobile ? -0.72 : 0
  const modelScale = isMobile ? 0.7 : window.innerWidth < 1100 ? 0.84 : 1
  const rotationFactor = props.reducedMotion ? 0.22 : 1
  const idleFactor = props.reducedMotion ? 0.06 : 1

  Object.entries(modelEntries).forEach(([key, entry], index) => {
    if (entry.mixer) {
      entry.mixer.timeScale = props.reducedMotion ? 0.45 : 1
    }

    const state = sampleKeyframes(MODEL_KEYFRAMES[key], sectionPosition)
    const idleRotation = elapsedTime * (0.075 + index * 0.012) * idleFactor

    entry.root.position.set(
      state.x * horizontalScale,
      state.y * verticalScale + mobileYOffset,
      state.z
    )
    entry.root.rotation.set(
      state.rx * rotationFactor,
      state.ry * rotationFactor + idleRotation,
      state.rz * rotationFactor
    )
    entry.root.scale.setScalar(state.scale * modelScale)
    setObjectOpacity(entry.root, state.opacity)
  })
}

function updateScene(elapsedTime, deltaTime) {
  const smoothing = props.reducedMotion ? 0.16 : 0.075
  smoothProgress = lerp(smoothProgress, props.scrollProgress, smoothing)
  const sectionPosition = smoothProgress * 8

  pointerCurrent.lerp(pointerTarget, props.reducedMotion ? 0.03 : 0.055)

  camera.position.x = pointerCurrent.x * (props.reducedMotion ? 0.025 : 0.16)
  camera.position.y = pointerCurrent.y * (props.reducedMotion ? 0.02 : 0.1)
  camera.lookAt(0, 0, 0)

  starField.rotation.y += deltaTime * (props.reducedMotion ? 0.0008 : 0.004)
  starField.rotation.x = pointerCurrent.y * 0.018
  starField.position.y = -smoothProgress * (props.reducedMotion ? 0.25 : 1.35)
  starField.position.x = pointerCurrent.x * -0.22

  Object.values(modelEntries).forEach((entry) => {
    entry.mixer?.update(deltaTime)
  })

  updateModels(sectionPosition, elapsedTime)
}

function renderFrame(time) {
  if (destroyed || !renderer) return

  const deltaTime = Math.min((time - lastFrameTime) / 1000, 0.05)
  lastFrameTime = time
  updateScene(time / 1000, deltaTime)
  renderer.render(scene, camera)
  animationFrame = window.requestAnimationFrame(renderFrame)
}

function handleResize() {
  if (!renderer || !camera) return

  const width = window.innerWidth
  const height = window.innerHeight
  camera.aspect = width / Math.max(height, 1)
  camera.position.z = width < 768 ? 9.4 : width < 1100 ? 9 : 8.4
  camera.updateProjectionMatrix()

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.setSize(width, height, false)
}

function handlePointerMove(event) {
  pointerTarget.set(
    (event.clientX / window.innerWidth) * 2 - 1,
    -((event.clientY / window.innerHeight) * 2 - 1)
  )
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

function initializeScene() {
  scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2(0x05090c, 0.028)

  camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100)
  camera.position.set(0, 0, 8.4)

  renderer = new THREE.WebGLRenderer({
    canvas: canvasElement.value,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  })
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.03
  renderer.setClearColor(0x000000, 0)

  starField = createStarField()
  scene.add(starField)
  createLights()
  createModelRoots()
  loadModels()
    .then(() => {
      window.requestAnimationFrame(() => {
        if (!destroyed) emitSceneReady()
      })
    })
    .catch((error) => {
      console.warn('[Landing 3D] Houve uma falha ao preparar os objetos 3D.', error)
      emitSceneReady()
    })
  handleResize()
}

onMounted(() => {
  try {
    initializeScene()
  } catch (error) {
    console.warn(
      '[Landing 3D] WebGL não pôde ser inicializado. O conteúdo HTML continuará disponível.',
      error
    )
    window.setTimeout(emitSceneReady, 300)
    return
  }

  window.addEventListener('resize', handleResize, { passive: true })
  window.addEventListener('pointermove', handlePointerMove, { passive: true })
  animationFrame = window.requestAnimationFrame(renderFrame)
})

onBeforeUnmount(() => {
  destroyed = true
  window.cancelAnimationFrame(animationFrame)
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('pointermove', handlePointerMove)

  Object.values(modelEntries).forEach(clearModelAnimation)
  disposeObject(scene)
  renderer?.renderLists?.dispose()
  renderer?.dispose()
  renderer?.forceContextLoss()

  scene = null
  camera = null
  renderer = null
  starField = null
  modelEntries = {}
})
</script>

<style scoped>
.aito-three-scene {
  position: fixed;
  inset: 0;
  z-index: 0;
  display: block;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
