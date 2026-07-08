<template>
  <q-layout view="hHh lpR fFf" class="aito-dance-layout">
    <q-page-container>
      <q-page class="aito-dance">
        <AitoThreeScene
          solo-dance
          :scroll-progress="1"
          :section-count="10"
          :reduced-motion="prefersReducedMotion"
          @ready="sceneReady = true"
        />

        <div class="aito-dance__atmosphere" aria-hidden="true"></div>
        <div class="aito-dance__noise" aria-hidden="true"></div>

        <header class="aito-dance__header">
          <router-link class="aito-dance__brand" to="/" aria-label="AitoSoftwares - inicio">
            <img src="/favicon.png" alt="" width="34" height="34" />
            <span>AITO<span>SOFTWARES</span></span>
          </router-link>

          <button type="button" class="aito-dance__back" @click="goBack">
            <span class="material-icons" aria-hidden="true">arrow_back</span>
            <span>Voltar</span>
          </button>
        </header>

        <section class="aito-dance__panel" :class="{ 'is-ready': sceneReady }">
          <p class="aito-dance__speech">
            Bom... Talvez isso faca voce fechar com a gente :)
          </p>

          <div class="aito-dance__controls" aria-label="Controles da surpresa">
            <button
              type="button"
              class="aito-dance__audio"
              :class="{ 'is-active': audioActive }"
              :aria-pressed="audioActive"
              :aria-label="audioActive ? 'Pausar musica' : 'Tocar musica'"
              @click="handleAudioToggle"
            >
              <span class="material-icons" aria-hidden="true">
                {{ audioActive ? 'volume_up' : 'volume_off' }}
              </span>
            </button>

            <button
              type="button"
              class="aito-dance__credits-toggle"
              aria-label="Ver creditos da musica e animacao"
              @click="creditsDialogOpen = true"
            >
              ?
            </button>
          </div>
        </section>

        <p class="aito-dance__counter" aria-live="polite">
          <span>10</span>
          <i></i>
          <span>10</span>
        </p>

        <q-dialog v-model="creditsDialogOpen">
          <q-card class="aito-dance__credits-card">
            <q-card-section class="aito-dance__credits-head">
              <p>Creditos</p>
              <button
                type="button"
                class="aito-dance__credits-close"
                aria-label="Fechar creditos"
                @click="creditsDialogOpen = false"
              >
                <span class="material-icons" aria-hidden="true">close</span>
              </button>
            </q-card-section>

            <q-card-section class="aito-dance__credits-body">
              <p>
                Beat instrumental e masterizacao por
                <a
                  href="https://www.instagram.com/prodniell/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @prodniell
                </a>.
              </p>
              <p>
                Guitarra e animacao por
                <a
                  href="https://www.instagram.com/samuelvictorol/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @samuelvictorol
                </a>.
              </p>
            </q-card-section>
          </q-card>
        </q-dialog>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import AitoThreeScene from 'components/landing3d/AitoThreeScene.vue'

const bundledDanceAudioUrls = import.meta.glob('../3d-models/*.mp3', {
  eager: true,
  query: '?url',
  import: 'default'
})

const router = useRouter()
const sceneReady = ref(false)
const audioActive = ref(false)
const creditsDialogOpen = ref(false)
const prefersReducedMotion = ref(false)

const danceAudioUrl = Object.entries(bundledDanceAudioUrls).find(([path]) =>
  path.replaceAll('\\', '/').endsWith('/3d-models/dance.mp3')
)?.[1]

let mediaQuery
let danceAudio = null

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
  const audio = ensureDanceAudio()

  if (!audio) {
    audioActive.value = false
    return
  }

  if (!shouldPlay) {
    audio.pause()
    audioActive.value = false
    return
  }

  try {
    if (options.restart) audio.currentTime = 0
    await audio.play()
    audioActive.value = true
  } catch (error) {
    audioActive.value = false
    console.warn('[Dance Page] O audio da danca ainda nao pode ser reproduzido.', error)
  }
}

function handleAudioToggle() {
  void setAudioMode(!audioActive.value)
}

function goBack() {
  void router.push('/')
}

function updateMotionPreference(event) {
  prefersReducedMotion.value = event.matches
}

onMounted(() => {
  mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  prefersReducedMotion.value = mediaQuery.matches
  mediaQuery.addEventListener?.('change', updateMotionPreference)

  window.requestAnimationFrame(() => {
    void setAudioMode(true, { restart: true })
  })
})

onBeforeUnmount(() => {
  mediaQuery?.removeEventListener?.('change', updateMotionPreference)

  if (!danceAudio) return

  danceAudio.pause()
  danceAudio.removeAttribute('src')
  danceAudio.load()
  danceAudio = null
})
</script>

<style scoped>
.aito-dance {
  --aito-teal: #13BC9D;
  --aito-teal-secondary: #12AD89;
  --aito-green: #57d6be;
  position: relative;
  min-height: 100vh;
  min-height: 100svh;
  overflow: hidden;
  color: #f6f7fb;
  background:
    radial-gradient(circle at 18% 8%, rgba(8, 159, 165, 0.14), transparent 34rem),
    radial-gradient(circle at 82% 66%, rgba(28, 189, 107, 0.07), transparent 32rem),
    #05090c;
  isolation: isolate;
}

.aito-dance__atmosphere,
.aito-dance__noise {
  position: fixed;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}

.aito-dance__atmosphere {
  background:
    linear-gradient(90deg, rgba(5, 9, 12, 0.22), transparent 48%, rgba(5, 9, 12, 0.14)),
    radial-gradient(circle at 50% 50%, transparent 44%, rgba(1, 4, 6, 0.38) 100%);
}

.aito-dance__noise {
  opacity: 0.035;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.8'/%3E%3C/svg%3E");
}

.aito-dance__header {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 5;
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  padding: clamp(1.1rem, 3vw, 2.35rem) clamp(1.1rem, 5vw, 5rem);
  pointer-events: none;
}

.aito-dance__brand,
.aito-dance__back {
  pointer-events: auto;
}

.aito-dance__brand {
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
  color: #f6f7fb;
  font-family: "Tomorrow", system-ui, sans-serif;
  font-size: 0.82rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-decoration: none;
}

.aito-dance__brand img {
  display: block;
  object-fit: contain;
  filter: drop-shadow(0 0 16px rgba(8, 159, 165, 0.32));
}

.aito-dance__brand > span > span {
  color: var(--aito-teal);
}

.aito-dance__back {
  display: inline-flex;
  min-height: 2.75rem;
  padding: 0.28rem 1rem 0.28rem 0.32rem;
  align-items: center;
  gap: 0.72rem;
  border: 1px solid rgba(19, 188, 157, 0.44);
  border-radius: 999px;
  color: #f6fffd;
  background: rgba(5, 20, 24, 0.74);
  box-shadow: 0 14px 44px rgba(18, 173, 137, 0.16);
  font: inherit;
  font-size: 0.74rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  backdrop-filter: blur(14px);
  transition: transform 220ms ease, border-color 220ms ease, box-shadow 220ms ease;
}

.aito-dance__back .material-icons {
  display: grid;
  width: 2.1rem;
  height: 2.1rem;
  border-radius: 50%;
  place-items: center;
  color: #03110f;
  background: linear-gradient(135deg, var(--aito-teal), var(--aito-teal-secondary));
  font-size: 1rem;
}

.aito-dance__back:hover,
.aito-dance__back:focus-visible {
  border-color: var(--aito-teal);
  outline: none;
  box-shadow: 0 18px 58px rgba(19, 188, 157, 0.26);
  transform: translateY(-2px);
}

.aito-dance__panel {
  position: fixed;
  right: clamp(1.25rem, 8vw, 7rem);
  bottom: clamp(2.6rem, 7vh, 4.4rem);
  left: clamp(1.25rem, 8vw, 7rem);
  z-index: 4;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  opacity: 0;
  transform: translate3d(0, 12px, 0);
  transition: opacity 420ms ease, transform 420ms ease;
  pointer-events: none;
}

.aito-dance__panel.is-ready {
  opacity: 1;
  transform: translate3d(0, 0, 0);
}

.aito-dance__speech,
.aito-dance__controls {
  pointer-events: auto;
}

.aito-dance__speech {
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
  text-align: center;
  backdrop-filter: blur(16px);
}

.aito-dance__speech::after {
  position: absolute;
  top: -0.64rem;
  right: 2.1rem;
  width: 1.1rem;
  height: 1.1rem;
  border-top: 1px solid rgba(19, 188, 157, 0.42);
  border-left: 1px solid rgba(19, 188, 157, 0.42);
  content: "";
  background: rgba(4, 24, 25, 0.9);
  transform: rotate(45deg);
}

.aito-dance__controls {
  display: flex;
  align-items: center;
  gap: 0.78rem;
}

.aito-dance__audio,
.aito-dance__credits-toggle {
  display: grid;
  padding: 0;
  border-radius: 50%;
  place-items: center;
  cursor: pointer;
  transition: transform 220ms ease, box-shadow 220ms ease, filter 220ms ease;
}

.aito-dance__audio {
  width: 3.65rem;
  height: 3.65rem;
  border: 1px solid rgba(19, 188, 157, 0.48);
  color: #041013;
  background: linear-gradient(135deg, var(--aito-teal), var(--aito-teal-secondary));
  box-shadow: 0 18px 52px rgba(19, 188, 157, 0.24);
}

.aito-dance__audio .material-icons {
  font-size: 1.55rem;
}

.aito-dance__audio.is-active {
  color: #dffff8;
  background:
    radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.32), transparent 32%),
    linear-gradient(135deg, rgba(19, 188, 157, 0.96), rgba(7, 70, 68, 0.95));
}

.aito-dance__credits-toggle {
  width: 2.45rem;
  height: 2.45rem;
  border: 1px solid rgba(19, 188, 157, 0.4);
  color: #dffff8;
  background: rgba(3, 17, 19, 0.74);
  box-shadow: 0 14px 42px rgba(0, 0, 0, 0.24);
  font: inherit;
  font-size: 1rem;
  font-weight: 900;
  backdrop-filter: blur(14px);
}

.aito-dance__audio:hover,
.aito-dance__audio:focus-visible,
.aito-dance__credits-toggle:hover,
.aito-dance__credits-toggle:focus-visible {
  outline: none;
  filter: saturate(1.16);
  transform: translateY(-2px);
}

.aito-dance__counter {
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

.aito-dance__counter span:first-child {
  color: var(--aito-teal);
}

.aito-dance__counter i {
  width: 1.7rem;
  height: 1px;
  background: rgba(220, 232, 235, 0.2);
}

.aito-dance__credits-card {
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

.aito-dance__credits-head {
  display: flex;
  padding: 1.15rem 1.2rem 0.5rem;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.aito-dance__credits-head p {
  margin: 0;
  color: #ffffff;
  font-family: "Tomorrow", "Montserrat", system-ui, sans-serif;
  font-size: 1rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.aito-dance__credits-close {
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

.aito-dance__credits-close .material-icons {
  font-size: 1.2rem;
}

.aito-dance__credits-body {
  display: grid;
  padding: 0.55rem 1.2rem 1.35rem;
  gap: 0.85rem;
}

.aito-dance__credits-body p {
  margin: 0;
  color: rgba(239, 255, 251, 0.82);
  font-size: 0.96rem;
  line-height: 1.55;
}

.aito-dance__credits-body a {
  color: var(--aito-teal);
  font-weight: 900;
  text-decoration: none;
}

.aito-dance__credits-body a:hover,
.aito-dance__credits-body a:focus-visible {
  color: #57d6be;
  outline: none;
  text-decoration: underline;
}

@media (max-width: 767px) {
  .aito-dance__header {
    padding: 1.1rem 1.15rem;
  }

  .aito-dance__brand {
    gap: 0.55rem;
    font-size: 0.7rem;
    letter-spacing: 0.06em;
  }

  .aito-dance__back {
    min-height: 2.45rem;
    padding-right: 0.86rem;
    gap: 0.56rem;
    font-size: 0.64rem;
    letter-spacing: 0.05em;
  }

  .aito-dance__back .material-icons {
    width: 1.86rem;
    height: 1.86rem;
  }

  .aito-dance__panel {
    right: 1.25rem;
    bottom: 4.2rem;
    left: 1.25rem;
    align-items: flex-end;
    gap: 0.8rem;
  }

  .aito-dance__speech {
    flex: 1 1 12rem;
    padding: 0.9rem 1rem;
    font-size: 0.94rem;
  }

  .aito-dance__controls {
    gap: 0.55rem;
  }

  .aito-dance__audio {
    width: 3.25rem;
    height: 3.25rem;
  }

  .aito-dance__credits-toggle {
    width: 2.45rem;
    height: 2.45rem;
  }

  .aito-dance__counter {
    right: 1.2rem;
    bottom: 1.2rem;
  }
}
</style>
