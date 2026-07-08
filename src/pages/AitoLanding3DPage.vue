<template>
  <main
    class="landing-3d"
    :class="{
      'landing-3d--reduced-motion': prefersReducedMotion,
      'landing-3d--intro-loading': !introRevealing,
      'landing-3d--intro-complete': introRevealing
    }"
    :style="landingPageStyle"
  >
    <AitoThreeScene
      :scroll-progress="scrollProgress"
      :reduced-motion="prefersReducedMotion"
      :section-count="landing3dSections.length"
      :dance-active="surpriseUnlocked"
      @ready="handleSceneReady"
    />

    <AitoLoadingGate
      v-if="!introComplete"
      :ready="sceneReady"
      :reduced-motion="prefersReducedMotion"
      @reveal="handleIntroReveal"
      @complete="handleIntroComplete"
    />

    <div class="landing-3d__atmosphere" aria-hidden="true"></div>
    <div class="landing-3d__noise" aria-hidden="true"></div>

    <header class="landing-3d__header">
      <router-link class="landing-3d__brand" to="/" aria-label="AitoSoftwares — início">
        <img src="/favicon.png" alt="" width="34" height="34" />
        <span>AITO<span>SOFTWARES</span></span>
      </router-link>

      <router-link class="landing-3d__about-link" to="/sobre">
        <span>Quem somos</span>
        <span aria-hidden="true">→</span>
      </router-link>
    </header>

    <nav class="landing-3d__progress" aria-label="Navegação entre seções">
      <button
        v-for="(section, index) in landing3dSections"
        :key="section.id"
        type="button"
        :class="{ 'is-active': activeSection === index }"
        :disabled="section.dance && !surpriseUnlocked"
        :aria-label="`Ir para a seção ${index + 1}: ${section.title}`"
        :aria-current="activeSection === index ? 'step' : undefined"
        @click="handleSectionNav(section)"
      >
        <span></span>
      </button>
    </nav>

    <div class="landing-3d__content">
      <section
        v-for="(section, index) in landing3dSections"
        :id="section.id"
        :key="section.id"
        class="landing-3d__section"
        :class="[
          `landing-3d__section--${section.align}`,
          { 'landing-3d__section--dance': section.dance }
        ]"
        data-landing-3d-section
        :aria-labelledby="`${section.id}-title`"
      >
        <div
          class="landing-3d__copy"
          :class="{ 'is-active': activeSection === index }"
          :style="sectionCopyStyle(index)"
        >
          <p class="landing-3d__eyebrow">{{ section.eyebrow }}</p>
          <h1
            v-if="index === 0"
            :id="`${section.id}-title`"
            class="landing-3d__title"
          >
            {{ section.title }}
          </h1>
          <h2
            v-else
            :id="`${section.id}-title`"
            class="landing-3d__title"
          >
            {{ section.title }}
          </h2>
          <p v-if="section.description" class="landing-3d__description">{{ section.description }}</p>

          <div
            v-if="section.cta || section.secondaryCta || section.surpriseCta"
            class="landing-3d__actions"
          >
            <a
              v-if="section.cta"
              class="landing-3d__cta landing-3d__cta--primary"
              :href="section.cta.href"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>{{ section.cta.label }}</span>
              <span aria-hidden="true">↗</span>
            </a>

            <router-link
              v-if="section.secondaryCta"
              class="landing-3d__cta landing-3d__cta--secondary"
              :to="section.secondaryCta.to"
            >
              <span>{{ section.secondaryCta.label }}</span>
              <span aria-hidden="true">→</span>
            </router-link>

            <button
              v-if="section.surpriseCta"
              type="button"
              class="landing-3d__cta landing-3d__cta--surprise"
              @click="handleSurpriseClick(section.surpriseCta.targetId)"
            >
              <span class="text-bold">{{ section.surpriseCta.label }}</span>
              <span class="material-icons" aria-hidden="true">auto_awesome</span>
            </button>
          </div>

          <div v-if="section.dance" class="landing-3d__dance-panel">
            <p class="landing-3d__speech-bubble">
              {{ section.speech }}
            </p>

            <button
              type="button"
              class="landing-3d__audio-toggle"
              :class="{ 'is-active': danceActive }"
              :aria-pressed="danceActive"
              :aria-label="danceActive ? 'Desativar modo dança' : 'Ativar modo dança'"
              @click="handleDanceToggle"
            >
              <span class="material-icons" aria-hidden="true">
                {{ danceActive ? 'volume_up' : 'volume_off' }}
              </span>
            </button>

            <button
              type="button"
              class="landing-3d__credits-toggle"
              aria-label="Ver creditos da musica e animacao"
              @click="creditsDialogOpen = true"
            >
              ?
            </button>
          </div>
        </div>

        <div
          v-if="index === 0"
          class="landing-3d__scroll-cue"
          aria-hidden="true"
        >
          <span>Explore</span>
          <i></i>
        </div>
      </section>
    </div>

    <p class="landing-3d__counter" aria-live="polite">
      <span>{{ String(activeSection + 1).padStart(2, '0') }}</span>
      <i></i>
      <span>{{ String(landing3dSections.length).padStart(2, '0') }}</span>
    </p>

    <q-dialog v-model="creditsDialogOpen">
      <q-card class="landing-3d__credits-card">
        <q-card-section class="landing-3d__credits-head">
          <p>Créditos</p>
          <button
            type="button"
            class="landing-3d__credits-close"
            aria-label="Fechar creditos"
            @click="creditsDialogOpen = false"
          >
            <span class="material-icons" aria-hidden="true">close</span>
          </button>
        </q-card-section>

        <q-card-section class="landing-3d__credits-body">
          <p>
            Beat e Masterização por:
            <a
              href="https://www.instagram.com/prodniell/"
              target="_blank"
              rel="noopener noreferrer"
            >
              @prodniell
            </a>
          </p>
          <p>
            Guitarra e Animação por:
            <a
              href="https://www.instagram.com/samuelvictorol/"
              target="_blank"
              rel="noopener noreferrer"
            >
              @samuelvictorol
            </a>
          </p>
        </q-card-section>
      </q-card>
    </q-dialog>
  </main>
</template>

<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import AitoLoadingGate from 'components/landing3d/AitoLoadingGate.vue'
import AitoThreeScene from 'components/landing3d/AitoThreeScene.vue'
import { useLandingScroll } from 'src/composables/useLandingScroll'
import { landing3dSections } from 'src/data/landing3dSections'

const bundledDanceAudioUrls = import.meta.glob('../3d-models/*.mp3', {
  eager: true,
  query: '?url',
  import: 'default'
})

const {
  activeSection,
  prefersReducedMotion,
  scrollProgress,
  scrollToSection,
  sectionPosition
} = useLandingScroll(landing3dSections.length)

const sceneReady = ref(false)
const introRevealing = ref(false)
const introComplete = ref(false)
const danceActive = ref(false)
const surpriseUnlocked = ref(false)
const creditsDialogOpen = ref(false)

const landingPageStyle = computed(() => ({
  minHeight: `${landing3dSections.length * 100}vh`
}))

const danceAudioUrl = Object.entries(bundledDanceAudioUrls).find(([path]) =>
  path.replaceAll('\\', '/').endsWith('/3d-models/dance.mp3')
)?.[1]

const surpriseSectionIndex = computed(() =>
  landing3dSections.findIndex((section) => section.dance)
)

const fallbackSectionId = computed(() => {
  const surpriseIndex = surpriseSectionIndex.value
  return landing3dSections[Math.max(surpriseIndex - 1, 0)]?.id ?? landing3dSections[0]?.id
})

let danceAudio = null

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

function ensureDanceAudio() {
  if (!danceAudioUrl) return null
  if (danceAudio) return danceAudio

  danceAudio = new Audio(danceAudioUrl)
  danceAudio.loop = true
  danceAudio.preload = 'auto'
  danceAudio.volume = 0.74

  return danceAudio
}

async function setAudioMode(shouldPlay, options = {}) {
  danceActive.value = shouldPlay
  const audio = ensureDanceAudio()

  if (!audio) return

  if (!shouldPlay) {
    audio.pause()
    return
  }

  try {
    if (options.restart) audio.currentTime = 0
    await audio.play()
  } catch (error) {
    console.warn('[Landing 3D] O audio da danca ainda nao pode ser reproduzido.', error)
  }
}

function handleDanceToggle() {
  void setAudioMode(!danceActive.value)
}

function handleSurpriseClick(targetId) {
  surpriseUnlocked.value = true
  void setAudioMode(true, { restart: true })
  scrollToSection(targetId)
}

function handleSectionNav(section) {
  if (section.dance && !surpriseUnlocked.value) return
  scrollToSection(section.id)
}

function handleSceneReady() {
  sceneReady.value = true
}

function handleIntroReveal() {
  introRevealing.value = true
}

function handleIntroComplete() {
  introComplete.value = true
}

watch(activeSection, (sectionIndex) => {
  const surpriseIndex = surpriseSectionIndex.value

  if (
    surpriseIndex >= 0 &&
    sectionIndex >= surpriseIndex &&
    !surpriseUnlocked.value
  ) {
    window.requestAnimationFrame(() => {
      scrollToSection(fallbackSectionId.value)
    })
  }
})

function sectionCopyStyle(index) {
  if (window.innerWidth < 768) {
    return {
      opacity: activeSection.value === index ? 1 : 0.22,
      transform: activeSection.value === index ? 'none' : 'translate3d(0, 10px, 0)'
    }
  }

  if (prefersReducedMotion.value) {
    return {
      opacity: activeSection.value === index ? 1 : 0.42,
      transform: 'none'
    }
  }

  const distance = Math.abs(sectionPosition.value - index)
  const opacity = clamp(1 - distance * 0.72, 0.18, 1)
  const offset = clamp(distance * 22, 0, 28)

  return {
    opacity,
    transform: `translate3d(0, ${offset}px, 0)`
  }
}

onBeforeUnmount(() => {
  if (!danceAudio) return

  danceAudio.pause()
  danceAudio.removeAttribute('src')
  danceAudio.load()
  danceAudio = null
})
</script>

<style scoped>
.landing-3d {
  --aito-teal: #13BC9D;
  --aito-teal-secondary: #12AD89;
  --aito-green: #57d6be;
  --aito-ink: #05090c;
  --aito-muted: rgba(220, 232, 235, 0.979);
  position: relative;
  min-height: 900vh;
  overflow: clip;
  color: #f6f7fb;
  background:
    radial-gradient(circle at 18% 8%, rgba(8, 159, 165, 0.14), transparent 34rem),
    radial-gradient(circle at 82% 66%, rgba(28, 189, 107, 0.07), transparent 32rem),
    var(--aito-ink);
  isolation: isolate;
}

.landing-3d__header,
.landing-3d__content,
.landing-3d__progress,
.landing-3d__counter {
  transition:
    opacity 900ms cubic-bezier(0.2, 0.8, 0.2, 1),
    transform 900ms cubic-bezier(0.2, 0.8, 0.2, 1),
    filter 900ms cubic-bezier(0.2, 0.8, 0.2, 1);
}

.landing-3d--intro-loading .landing-3d__header,
.landing-3d--intro-loading .landing-3d__content,
.landing-3d--intro-loading .landing-3d__progress,
.landing-3d--intro-loading .landing-3d__counter {
  opacity: 0;
  filter: blur(12px);
  pointer-events: none;
  transform: translate3d(0, 18px, 0);
}

.landing-3d--intro-complete .landing-3d__header,
.landing-3d--intro-complete .landing-3d__content,
.landing-3d--intro-complete .landing-3d__progress,
.landing-3d--intro-complete .landing-3d__counter {
  opacity: 1;
  filter: blur(0);
  transform: translate3d(0, 0, 0);
}

.landing-3d__atmosphere,
.landing-3d__noise {
  position: fixed;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}

.landing-3d__atmosphere {
  background:
    linear-gradient(90deg, rgba(5, 9, 12, 0.42), transparent 40%, rgba(5, 9, 12, 0.2)),
    radial-gradient(circle at 50% 50%, transparent 35%, rgba(1, 4, 6, 0.58) 100%);
}

.landing-3d__noise {
  opacity: 0.035;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.8'/%3E%3C/svg%3E");
}

.landing-3d__header {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 5;
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  padding: clamp(1.25rem, 3vw, 2.5rem) clamp(1.25rem, 5vw, 5rem);
  pointer-events: none;
}

.landing-3d__brand {
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
  color: #f6f7fb;
  font-family: "Tomorrow", system-ui, sans-serif;
  font-size: 0.82rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-decoration: none;
  pointer-events: auto;
}

.landing-3d__brand img {
  display: block;
  object-fit: contain;
  filter: drop-shadow(0 0 16px rgba(8, 159, 165, 0.32));
}

.landing-3d__brand > span > span {
  color: var(--aito-teal);
}

.landing-3d__about-link {
  display: inline-flex;
  min-height: 2.75rem;
  padding: 0.28rem 0.32rem 0.28rem 1rem;
  align-items: center;
  gap: 0.76rem;
  border: 1px solid rgba(19, 188, 157, 0.44);
  border-radius: 999px;
  color: #f6fffd;
  background: rgba(5, 20, 24, 0.74);
  box-shadow: 0 14px 44px rgba(18, 173, 137, 0.16);
  font-size: 0.74rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-decoration: none;
  text-transform: uppercase;
  pointer-events: auto;
  backdrop-filter: blur(14px);
  transition: border-color 220ms ease, box-shadow 220ms ease, transform 220ms ease;
}

.landing-3d__about-link span:last-child {
  display: grid;
  width: 2.1rem;
  height: 2.1rem;
  border-radius: 50%;
  place-items: center;
  color: #03110f;
  background: linear-gradient(135deg, var(--aito-teal), var(--aito-teal-secondary));
  font-size: 0.98rem;
  transition: transform 220ms ease;
}

.landing-3d__about-link:hover,
.landing-3d__about-link:focus-visible {
  border-color: var(--aito-teal);
  outline: none;
  box-shadow: 0 18px 58px rgba(19, 188, 157, 0.26);
  transform: translateY(-2px);
}

.landing-3d__about-link:hover span:last-child {
  transform: translateX(2px);
}

.landing-3d__content {
  position: relative;
  z-index: 2;
}

.landing-3d__section {
  position: relative;
  display: grid;
  width: min(100%, 1440px);
  min-height: 100vh;
  min-height: 100svh;
  margin: 0 auto;
  padding: clamp(7rem, 12vh, 9rem) clamp(1.25rem, 7vw, 7rem);
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-items: center;
  scroll-snap-align: start;
  scroll-snap-stop: always;
}

.landing-3d__copy {
  position: relative;
  width: min(100%, 34rem);
  padding-block: 2rem;
  transition: opacity 180ms linear, transform 180ms linear;
  will-change: opacity, transform;
}

.landing-3d__copy::before {
  position: absolute;
  z-index: -1;
  inset: -5rem -4rem;
  content: "";
  background: radial-gradient(
    ellipse at center,
    rgba(5, 9, 12, 0.92) 0%,
    rgba(5, 9, 12, 0.54) 48%,
    transparent 74%
  );
  pointer-events: none;
}

.landing-3d__section--left .landing-3d__copy {
  grid-column: 1;
}

.landing-3d__section--right .landing-3d__copy {
  grid-column: 2;
  justify-self: end;
}

.landing-3d__section--center .landing-3d__copy {
  width: min(100%, 47rem);
  grid-column: 1 / -1;
  justify-self: center;
  text-align: center;
}

.landing-3d__section--center .landing-3d__copy::before {
  inset: -7rem -10rem;
}

.landing-3d__eyebrow {
  display: flex;
  margin: 0 0 1.4rem;
  align-items: center;
  gap: 0.8rem;
  color: var(--aito-teal);
  font-size: clamp(0.68rem, 1vw, 0.78rem);
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.landing-3d__eyebrow::before {
  width: 2.2rem;
  height: 1px;
  content: "";
  background: linear-gradient(90deg, var(--aito-green), transparent);
}

.landing-3d__section--center .landing-3d__eyebrow {
  justify-content: center;
}

.landing-3d__title {
  max-width: 13ch;
  margin: 0;
  font-family: "Tomorrow", "Montserrat", system-ui, sans-serif;
  font-size: clamp(2.5rem, 5.2vw, 5.5rem);
  font-weight: 500;
  letter-spacing: -0.045em;
  line-height: 0.98;
  text-wrap: balance;
}

.landing-3d__section--center .landing-3d__title {
  max-width: 16ch;
  margin-inline: auto;
}

.landing-3d__description {
  max-width: 32rem;
  margin: clamp(1.4rem, 3vw, 2rem) 0 0;
  color: var(--aito-muted);
  font-size: clamp(0.95rem, 1.35vw, 1.12rem);
  font-weight: 400;
  backdrop-filter: blur(12px);
  line-height: 1.75;
  text-wrap: pretty;
}

.landing-3d__section--center .landing-3d__description {
  margin-inline: auto;
}

.landing-3d__actions {
  display: flex;
  margin-top: 2.2rem;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  flex-wrap: wrap;
}

.landing-3d__cta {
  display: inline-flex;
  min-height: 3.8rem;
  padding: 0.3rem 0.35rem 0.3rem 1.45rem;
  align-items: center;
  gap: 1.25rem;
  border: 1px solid rgba(8, 159, 165, 0.52);
  border-radius: 999px;
  color: #f6f7fb;
  background: rgba(5, 20, 24, 0.72);
  box-shadow: 0 16px 50px rgba(8, 159, 165, 0.16);
  font-size: 0.86rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-decoration: none;
  cursor: pointer;
  backdrop-filter: blur(12px);
  transition: border-color 220ms ease, box-shadow 220ms ease, transform 220ms ease;
}

button.landing-3d__cta {
  font: inherit;
}

.landing-3d__cta--primary span:last-child {
  display: grid;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  place-items: center;
  color: #041013;
  background: linear-gradient(135deg, var(--aito-green), var(--aito-teal-secondary));
  font-size: 1.1rem;
  transition: transform 220ms ease;
}

.landing-3d__cta:hover,
.landing-3d__cta:focus-visible {
  border-color: var(--aito-green);
  outline: none;
  box-shadow: 0 18px 60px rgba(28, 189, 107, 0.22);
  transform: translateY(-2px);
}

.landing-3d__cta--primary:hover span:last-child {
  transform: rotate(45deg);
}

.landing-3d__cta--secondary {
  padding-right: 0.35rem;
  border-color: rgba(14, 167, 148, 0.38);
  background: rgba(5, 16, 19, 0.52);
  box-shadow: none;
}

.landing-3d__cta--secondary span:last-child {
  display: grid;
  width: 3rem;
  height: 3rem;
  border: 1px solid rgba(14, 167, 148, 0.4);
  border-radius: 50%;
  place-items: center;
  color: var(--aito-green);
  background: rgba(8, 159, 165, 0.09);
  font-size: 1.1rem;
  transition: color 220ms ease, background 220ms ease, transform 220ms ease;
}

.landing-3d__cta--secondary:hover span:last-child {
  color: #041013;
  background: var(--aito-green);
  transform: translateX(2px);
}

.landing-3d__cta--surprise {
  width: min(100%, 18rem);
  max-width: 18rem;
  margin-inline: auto;
  flex-basis: 100%;
  justify-content: center;
  border-color: rgba(19, 188, 157, 0.78);
  color: #031211;
  background: linear-gradient(135deg, var(--aito-teal), var(--aito-teal-secondary));
  box-shadow: 0 18px 58px rgba(19, 188, 157, 0.28);
}

.landing-3d__cta--surprise span:last-child {
  display: grid;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  place-items: center;
  color: #dffff8;
  background: rgba(2, 13, 13, 0.72);
  font-size: 1.2rem;
  transition: transform 220ms ease, background 220ms ease;
}

.landing-3d__cta--surprise:hover span:last-child,
.landing-3d__cta--surprise:focus-visible span:last-child {
  background: rgba(2, 13, 13, 0.9);
  transform: rotate(18deg) scale(1.05);
}

.landing-3d__section--dance {
  align-items: end;
  padding-bottom: clamp(2rem, 5vh, 4rem);
}

.landing-3d__section--dance .landing-3d__copy {
  width: min(100%, 34rem);
  padding-bottom: 0;
  align-self: end;
}

.landing-3d__section--dance .landing-3d__copy::before {
  inset: -4rem -5rem -5rem;
  background: radial-gradient(
    ellipse at center,
    rgba(5, 22, 24, 0.82) 0%,
    rgba(5, 9, 12, 0.5) 52%,
    transparent 78%
  );
}

.landing-3d__section--dance .landing-3d__title {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

.landing-3d__section--dance .landing-3d__eyebrow {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

.landing-3d__dance-panel {
  display: flex;
  margin-top: 0;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.landing-3d__speech-bubble {
  position: relative;
  max-width: min(100%, 25rem);
  margin: 0;
  padding: 1rem 1.15rem;
  border: 1px solid rgba(19, 188, 157, 0.48);
  border-radius: 1.15rem;
  color: #effffb;
  background:
    linear-gradient(135deg, rgba(19, 188, 157, 0.22), rgba(18, 173, 137, 0.08)),
    rgba(3, 17, 19, 0.76);
  box-shadow:
    0 18px 54px rgba(0, 0, 0, 0.34),
    inset 0 1px 0 rgba(255, 255, 255, 0.12);
  font-size: clamp(0.96rem, 1.6vw, 1.16rem);
  font-weight: 800;
  line-height: 1.35;
  backdrop-filter: blur(16px);
}

.landing-3d__speech-bubble::after {
  position: absolute;
  right: 2.1rem;
  top: -0.64rem;
  width: 1.1rem;
  height: 1.1rem;
  border-top: 1px solid rgba(19, 188, 157, 0.42);
  border-left: 1px solid rgba(19, 188, 157, 0.42);
  content: "";
  background: rgba(4, 24, 25, 0.9);
  transform: rotate(45deg);
}

.landing-3d__audio-toggle {
  display: grid;
  width: 3.65rem;
  height: 3.65rem;
  padding: 0;
  border: 1px solid rgba(19, 188, 157, 0.48);
  border-radius: 50%;
  place-items: center;
  color: #041013;
  background: linear-gradient(135deg, var(--aito-teal), var(--aito-teal-secondary));
  box-shadow: 0 18px 52px rgba(19, 188, 157, 0.24);
  cursor: pointer;
  transition: transform 220ms ease, box-shadow 220ms ease, filter 220ms ease;
}

.landing-3d__audio-toggle .material-icons {
  font-size: 1.55rem;
}

.landing-3d__audio-toggle:hover,
.landing-3d__audio-toggle:focus-visible {
  outline: none;
  filter: saturate(1.16);
  box-shadow: 0 20px 64px rgba(19, 188, 157, 0.32);
  transform: translateY(-2px);
}

.landing-3d__audio-toggle.is-active {
  color: #dffff8;
  background:
    radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.32), transparent 32%),
    linear-gradient(135deg, rgba(19, 188, 157, 0.96), rgba(7, 70, 68, 0.95));
}

.landing-3d__credits-toggle {
  display: grid;
  width: 2.45rem;
  height: 2.45rem;
  padding: 0;
  border: 1px solid rgba(19, 188, 157, 0.4);
  border-radius: 50%;
  place-items: center;
  color: #dffff8;
  background: rgba(3, 17, 19, 0.74);
  box-shadow: 0 14px 42px rgba(0, 0, 0, 0.24);
  font: inherit;
  font-size: 1rem;
  font-weight: 900;
  cursor: pointer;
  backdrop-filter: blur(14px);
  transition: transform 220ms ease, border-color 220ms ease, background 220ms ease;
}

.landing-3d__credits-toggle:hover,
.landing-3d__credits-toggle:focus-visible {
  border-color: var(--aito-teal);
  outline: none;
  background: rgba(19, 188, 157, 0.18);
  transform: translateY(-2px);
}

.landing-3d__credits-card {
  width: min(92vw, 28rem);
  border: 1px solid rgba(19, 188, 157, 0.38);
  border-radius: 1rem;
  color: #effffb;
  background:
    radial-gradient(circle at 18% 0%, rgba(19, 188, 157, 0.2), transparent 15rem),
    linear-gradient(145deg, rgba(3, 20, 23, 0.98), rgba(1, 9, 11, 0.98));
  box-shadow: 0 28px 90px rgba(0, 0, 0, 0.5);
  overflow: hidden;
}

.landing-3d__credits-head {
  display: flex;
  padding: 1.15rem 1.2rem 0.5rem;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.landing-3d__credits-head p {
  margin: 0;
  color: #ffffff;
  font-family: "Tomorrow", "Montserrat", system-ui, sans-serif;
  font-size: 1rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.landing-3d__credits-close {
  display: grid;
  width: 2.4rem;
  height: 2.4rem;
  padding: 0;
  border: 1px solid rgba(19, 188, 157, 0.28);
  border-radius: 50%;
  place-items: center;
  color: #dffff8;
  background: rgba(255, 255, 255, 0.04);
  cursor: pointer;
}

.landing-3d__credits-close .material-icons {
  font-size: 1.2rem;
}

.landing-3d__credits-close:hover,
.landing-3d__credits-close:focus-visible {
  outline: none;
  background: rgba(19, 188, 157, 0.16);
}

.landing-3d__credits-body {
  display: grid;
  padding: 0.55rem 1.2rem 1.35rem;
  gap: 0.85rem;
}

.landing-3d__credits-body p {
  margin: 0;
  color: rgba(239, 255, 251, 0.82);
  font-size: 0.96rem;
  line-height: 1.55;
}

.landing-3d__credits-body a {
  color: var(--aito-teal);
  font-weight: 900;
  text-decoration: none;
}

.landing-3d__credits-body a:hover,
.landing-3d__credits-body a:focus-visible {
  color: #57d6be;
  outline: none;
  text-decoration: underline;
}

.landing-3d__scroll-cue {
  position: absolute;
  bottom: clamp(1.5rem, 4vh, 3rem);
  left: clamp(1.25rem, 7vw, 7rem);
  display: flex;
  align-items: center;
  gap: 0.9rem;
  color: rgba(220, 232, 235, 0.42);
  font-size: 0.64rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.landing-3d__scroll-cue i {
  position: relative;
  display: block;
  width: 3.5rem;
  height: 1px;
  overflow: hidden;
  background: rgba(220, 232, 235, 0.15);
}

.landing-3d__scroll-cue i::after {
  position: absolute;
  inset: 0;
  content: "";
  background: linear-gradient(90deg, transparent, var(--aito-teal), transparent);
  animation: scroll-cue 1.8s ease-in-out infinite;
}

.landing-3d__progress {
  position: fixed;
  top: 50%;
  right: clamp(1rem, 2.5vw, 2.5rem);
  z-index: 5;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  transform: translateY(-50%);
}

.landing-3d__progress button {
  display: grid;
  width: 1.5rem;
  height: 1.5rem;
  padding: 0;
  border: 0;
  place-items: center;
  background: transparent;
  cursor: pointer;
}

.landing-3d__progress button span {
  display: block;
  width: 3px;
  height: 3px;
  border-radius: 99px;
  background: rgba(220, 232, 235, 0.32);
  transition: width 220ms ease, height 220ms ease, background 220ms ease;
}

.landing-3d__progress button.is-active span {
  width: 5px;
  height: 1.5rem;
  background: linear-gradient(var(--aito-green), var(--aito-teal));
}

.landing-3d__progress button:focus-visible {
  border-radius: 99px;
  outline: 1px solid var(--aito-teal);
}

.landing-3d__progress button:disabled {
  cursor: not-allowed;
  opacity: 0.28;
}

.landing-3d__counter {
  position: fixed;
  right: clamp(1.25rem, 5vw, 5rem);
  bottom: clamp(1.25rem, 3vw, 2.5rem);
  z-index: 5;
  display: flex;
  margin: 0;
  align-items: center;
  gap: 0.65rem;
  color: rgba(220, 232, 235, 0.42);
  font-family: "Tomorrow", system-ui, sans-serif;
  font-size: 0.62rem;
  letter-spacing: 0.12em;
}

.landing-3d__counter span:first-child {
  color: var(--aito-teal);
}

.landing-3d__counter i {
  width: 1.7rem;
  height: 1px;
  background: rgba(220, 232, 235, 0.2);
}

@keyframes scroll-cue {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(100%);
  }
}

@media (max-width: 767px) {
  .landing-3d__atmosphere {
    background:
      linear-gradient(90deg, rgba(5, 9, 12, 0.18), transparent 48%, rgba(5, 9, 12, 0.12)),
      radial-gradient(circle at 50% 50%, transparent 46%, rgba(1, 4, 6, 0.34) 100%);
  }

  .landing-3d__header {
    padding: 1.1rem 1.15rem;
  }

  .landing-3d__progress {
    display: none;
  }

  .landing-3d__about-link {
    min-height: 2.45rem;
    padding-left: 0.86rem;
    gap: 0.56rem;
    font-size: 0.64rem;
    letter-spacing: 0.05em;
  }

  .landing-3d__about-link span:last-child {
    width: 1.86rem;
    height: 1.86rem;
  }

  .landing-3d__section {
    padding: 6.5rem 1.25rem 5rem;
    grid-template-columns: 1fr;
    align-items: start;
  }

  .landing-3d__copy,
  .landing-3d__section--left .landing-3d__copy,
  .landing-3d__section--right .landing-3d__copy {
    width: 100%;
    padding-top: clamp(1rem, 7vh, 4rem);
    grid-column: 1;
    justify-self: start;
  }

  .landing-3d__section--center {
    align-items: center;
  }

  .landing-3d__section--center .landing-3d__copy {
    padding-top: 0;
  }

  .landing-3d__copy::before {
    inset: -3rem -2rem -4rem;
    opacity: 0.68;
    background: radial-gradient(
      ellipse at top left,
      rgba(5, 9, 12, 0.82) 0%,
      rgba(5, 9, 12, 0.48) 48%,
      transparent 76%
    );
  }

  .landing-3d__section--center .landing-3d__copy::before {
    inset: -5rem -2rem;
    opacity: 0.62;
    background: radial-gradient(
      ellipse at center,
      rgba(5, 9, 12, 0.78),
      rgba(5, 9, 12, 0.42) 52%,
      transparent 78%
    );
  }

  .landing-3d__title {
    max-width: 12ch;
    font-size: clamp(2.25rem, 12vw, 4rem);
  }

  .landing-3d__description {
    max-width: 26rem;
    font-size: 0.94rem;
    backdrop-filter: none;
    line-height: 1.65;
  }

  .landing-3d__scroll-cue {
    bottom: 1.5rem;
    left: 1.25rem;
  }

  .landing-3d__counter {
    right: 1.2rem;
    bottom: 1.2rem;
  }

  .landing-3d__actions {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
  }

  .landing-3d__cta {
    width: 100%;
    justify-content: space-between;
  }

  .landing-3d__cta--surprise {
    width: 100%;
    max-width: none;
    flex-basis: auto;
  }

  .landing-3d__section--dance {
    align-items: end;
    padding-bottom: 4.5rem;
  }

  .landing-3d__section--dance .landing-3d__copy {
    width: 100%;
    padding-bottom: 0;
  }

  .landing-3d__section--dance .landing-3d__title {
    font-size: clamp(1.75rem, 8vw, 2.55rem);
  }

  .landing-3d__dance-panel {
    align-items: flex-end;
    gap: 0.8rem;
  }

  .landing-3d__speech-bubble {
    flex: 1 1 13rem;
    padding: 0.9rem 1rem;
    font-size: 0.94rem;
  }

  .landing-3d__audio-toggle {
    width: 3.25rem;
    height: 3.25rem;
    flex: 0 0 auto;
  }

  .landing-3d__credits-toggle {
    width: 2.45rem;
    height: 2.45rem;
    flex: 0 0 auto;
  }
}

@media (prefers-reduced-motion: reduce) {
  .landing-3d__copy,
  .landing-3d__header,
  .landing-3d__content,
  .landing-3d__counter,
  .landing-3d__about-link,
  .landing-3d__cta,
  .landing-3d__cta span:last-child,
  .landing-3d__progress button span {
    transition-duration: 0.01ms;
  }

  .landing-3d__scroll-cue i::after {
    animation: none;
  }
}
</style>

<style>
html.landing-3d-scroll,
body.landing-3d-scroll {
  scroll-behavior: smooth;
  scroll-snap-type: y mandatory;
  overscroll-behavior-y: none;
}

@media (prefers-reduced-motion: reduce) {
  html.landing-3d-scroll,
  body.landing-3d-scroll {
    scroll-behavior: auto;
  }
}
</style>
