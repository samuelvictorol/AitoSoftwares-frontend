import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

export function useLandingScroll(sectionCount = 1) {
  const scrollProgress = ref(0)
  const viewportHeight = ref(0)
  const prefersReducedMotion = ref(false)

  let mediaQuery
  let measurementFrame = 0

  const measure = () => {
    measurementFrame = 0

    const scrollableHeight = Math.max(
      document.documentElement.scrollHeight - window.innerHeight,
      1
    )

    viewportHeight.value = window.innerHeight
    scrollProgress.value = clamp(window.scrollY / scrollableHeight, 0, 1)
  }

  const scheduleMeasurement = () => {
    if (measurementFrame) return
    measurementFrame = window.requestAnimationFrame(measure)
  }

  const updateMotionPreference = (event) => {
    prefersReducedMotion.value = event.matches
  }

  onMounted(() => {
    mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    prefersReducedMotion.value = mediaQuery.matches

    window.addEventListener('scroll', scheduleMeasurement, { passive: true })
    window.addEventListener('resize', scheduleMeasurement, { passive: true })
    mediaQuery.addEventListener?.('change', updateMotionPreference)

    measure()
  })

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', scheduleMeasurement)
    window.removeEventListener('resize', scheduleMeasurement)
    mediaQuery?.removeEventListener?.('change', updateMotionPreference)

    if (measurementFrame) {
      window.cancelAnimationFrame(measurementFrame)
    }
  })

  const sectionPosition = computed(
    () => scrollProgress.value * Math.max(sectionCount - 1, 0)
  )

  const activeSection = computed(() =>
    clamp(Math.round(sectionPosition.value), 0, Math.max(sectionCount - 1, 0))
  )

  return {
    activeSection,
    prefersReducedMotion,
    scrollProgress,
    sectionPosition,
    viewportHeight
  }
}

