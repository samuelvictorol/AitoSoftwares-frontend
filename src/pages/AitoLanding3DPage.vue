<template>
  <main
    class="landing-3d"
    :class="{ 'landing-3d--reduced-motion': prefersReducedMotion }"
  >
    <AitoThreeScene
      :scroll-progress="scrollProgress"
      :reduced-motion="prefersReducedMotion"
    />

    <div class="landing-3d__atmosphere" aria-hidden="true"></div>
    <div class="landing-3d__noise" aria-hidden="true"></div>

    <header class="landing-3d__header">
      <router-link class="landing-3d__brand" to="/" aria-label="AitoSoftwares — início">
        <img src="/favicon.png" alt="" width="34" height="34" />
        <span>AITO<span>SOFTWARES</span></span>
      </router-link>

      <span class="landing-3d__edition">Experiência digital · 2026</span>
    </header>

    <nav class="landing-3d__progress" aria-label="Navegação entre seções">
      <button
        v-for="(section, index) in landing3dSections"
        :key="section.id"
        type="button"
        :class="{ 'is-active': activeSection === index }"
        :aria-label="`Ir para a seção ${index + 1}: ${section.title}`"
        :aria-current="activeSection === index ? 'step' : undefined"
        @click="scrollToSection(section.id)"
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
        :class="`landing-3d__section--${section.align}`"
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
          <p class="landing-3d__description">{{ section.description }}</p>

          <div
            v-if="section.cta || section.secondaryCta"
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
  </main>
</template>

<script setup>
import AitoThreeScene from 'components/landing3d/AitoThreeScene.vue'
import { useLandingScroll } from 'src/composables/useLandingScroll'
import { landing3dSections } from 'src/data/landing3dSections'

const {
  activeSection,
  prefersReducedMotion,
  scrollProgress,
  scrollToSection,
  sectionPosition
} = useLandingScroll(landing3dSections.length)

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

function sectionCopyStyle(index) {
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
</script>

<style scoped>
.landing-3d {
  --aito-teal: #089fa5;
  --aito-teal-secondary: #0ea794;
  --aito-green: #1cbd6b;
  --aito-ink: #05090c;
  --aito-muted: rgba(220, 232, 235, 0.68);
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

.landing-3d__edition {
  color: rgba(220, 232, 235, 0.45);
  font-size: 0.66rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
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
  backdrop-filter: blur(12px);
  transition: border-color 220ms ease, box-shadow 220ms ease, transform 220ms ease;
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
  .landing-3d__header {
    padding: 1.1rem 1.15rem;
  }

  .landing-3d__edition,
  .landing-3d__progress {
    display: none;
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
    background: radial-gradient(
      ellipse at top left,
      rgba(5, 9, 12, 0.97) 0%,
      rgba(5, 9, 12, 0.72) 48%,
      transparent 76%
    );
  }

  .landing-3d__section--center .landing-3d__copy::before {
    inset: -5rem -2rem;
    background: radial-gradient(
      ellipse at center,
      rgba(5, 9, 12, 0.95),
      rgba(5, 9, 12, 0.58) 52%,
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
}

@media (prefers-reduced-motion: reduce) {
  .landing-3d__copy,
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
