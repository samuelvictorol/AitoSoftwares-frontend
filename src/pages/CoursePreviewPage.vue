<template>
  <q-layout view="lHh Lpr lFf" class="course-preview">
    <q-page-container>
      <q-page class="course-preview__page">
        <div v-if="loading" class="course-preview__loading"><q-spinner color="teal-3" size="42px" /></div>
        <div v-else-if="course" class="course-preview__shell">
          <header class="course-preview__header">
            <router-link to="/cursos" class="course-preview__back"><q-icon name="mdi-arrow-left" /> Cursos</router-link>
            <router-link to="/" class="course-preview__brand">AITO<span>LEARN</span></router-link>
          </header>

          <section class="course-preview__hero">
            <div class="course-preview__hero-media">
              <img v-if="course.banner" :src="course.banner.url" :alt="course.title" />
              <div v-else class="course-preview__placeholder"><q-icon :name="course.logo ? 'mdi-image-outline' : 'mdi-school-outline'" size="56px" /><img v-if="course.logo" :src="course.logo.url" :alt="course.title" /></div>
            </div>
            <div class="course-preview__hero-copy">
              <p class="course-preview__eyebrow">AITOLEARN / PREVIEW</p>
              <h1>{{ course.title }}</h1>
              <p class="course-preview__description">{{ course.description }}</p>
              <div class="course-preview__facts">
                <span><q-icon name="mdi-clock-outline" /> {{ course.hours || 0 }} horas</span>
                <span><q-icon name="mdi-play-box-multiple-outline" /> {{ course.topicCount || 0 }} aulas</span>
                <span><q-icon :name="course.accessMode === 'early_access' ? 'mdi-timer-sand' : 'mdi-lock-open-outline'" /> {{ accessLabel }}</span>
                <strong>{{ money(course.price) }}</strong>
              </div>
              <div v-if="course.accessMode === 'early_access'" class="course-preview__early-note"><q-icon name="mdi-clock-fast" /> Acesso antecipado: os videos comecam a subir em breve e voce acompanha a trilha em tempo real.</div>
              <q-btn unelevated no-caps class="course-preview__button" :icon="owned ? 'mdi-school-outline' : 'mdi-lock-open-outline'" :label="owned ? 'Acessar curso' : course.price ? 'Comprar acesso' : 'Comecar gratis'" :loading="buying" @click="startCourse" />
            </div>
          </section>

          <section v-if="course.welcomeVideoUrl" class="course-preview__content">
            <div>
              <p class="course-preview__eyebrow">O que voce vai encontrar</p>
              <h2>Uma trilha para construir com contexto.</h2>
              <div class="course-preview__topics">
                <article v-for="topic in course.topics" :key="topic._id"><span>{{ String(topic.position + 1).padStart(2, '0') }}</span><strong>{{ topic.title }}</strong><q-icon name="mdi-lock-outline" /></article>
              </div>
            </div>
            <aside class="course-preview__video"><div class="course-preview__eyebrow">Aula de boas-vindas</div><iframe :src="course.welcomeVideoUrl" title="Video de boas-vindas" loading="lazy" allowfullscreen></iframe></aside>
          </section>
        </div>
        <div v-else class="course-preview__loading">Curso nao encontrado.</div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()
const course = ref(null)
const loading = ref(true)
const buying = ref(false)
const owned = ref(false)
const isUser = computed(() => Boolean(localStorage.getItem('aito_user_token')))
const accessLabel = computed(() => course.value?.accessMode === 'early_access' ? 'Acesso antecipado' : 'Acesso completo')

function headers () { return { headers: { Authorization: `Bearer ${localStorage.getItem('aito_user_token')}` } } }
function money (value) { return Number(value || 0) ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value)) : 'Gratuito' }

async function load () {
  try {
    const response = await api.get(`/courses/${route.params.slug}`)
    course.value = response.data.data
    api.post(`/courses/${route.params.slug}/view`, { sessionId: sessionStorage.getItem('aito_course_session') || '' }).catch(() => null)
    if (isUser.value) {
      const mine = await api.get('/courses/me', headers())
      owned.value = (mine.data.data || []).some((item) => String(item.course?.slug) === String(route.params.slug))
    }
  } catch (error) {
    course.value = null
  } finally {
    loading.value = false
  }
}

async function startCourse () {
  if (!isUser.value) { router.push('/app'); return }
  if (owned.value) { router.push(`/cursos/${route.params.slug}/aulas`); return }
  buying.value = true
  try {
    const response = await api.post(`/courses/${route.params.slug}/checkout`, {}, headers())
    if (response.data.data?.alreadyOwned || response.data.data?.free) { owned.value = true; router.push(`/cursos/${route.params.slug}/aulas`); return }
    window.location.href = response.data.data.checkoutUrl
  } catch (error) {
    $q.notify({ type: 'negative', message: error.response?.data?.message || 'Nao foi possivel iniciar o pagamento.' })
  } finally {
    buying.value = false
  }
}

onMounted(load)
</script>

<style scoped>
.course-preview{color:#effffb;background:#03090b}.course-preview__page{min-height:100vh;background:radial-gradient(circle at 80% 0,rgba(19,188,157,.16),transparent 30rem),#03090b}.course-preview__shell{width:min(1180px,calc(100% - 2rem));margin:auto;padding-bottom:4rem}.course-preview__header{display:flex;align-items:center;justify-content:space-between;padding:1rem 0;border-bottom:1px solid rgba(19,188,157,.2)}.course-preview__back,.course-preview__brand{color:#8fffee;text-decoration:none;font-size:.75rem}.course-preview__brand{font-weight:900;letter-spacing:.12em}.course-preview__brand span{color:#effffb}.course-preview__hero{display:grid;grid-template-columns:1.3fr 1fr;gap:2rem;align-items:center;padding:7vh 0 5vh}.course-preview__hero-media>img,.course-preview__placeholder{width:100%;aspect-ratio:16/9;object-fit:cover;border:1px solid rgba(19,188,157,.3);border-radius:.8rem;box-shadow:0 20px 70px rgba(0,0,0,.28)}.course-preview__placeholder{display:grid;place-items:center;gap:.8rem;color:#8fffee;background:linear-gradient(135deg,rgba(19,188,157,.18),rgba(3,16,18,.9))}.course-preview__placeholder img{max-width:38%;max-height:38%;object-fit:contain}.course-preview__hero-copy h1{margin:.6rem 0;font-size:clamp(2.5rem,5vw,5rem);line-height:.96;background:linear-gradient(135deg,#effffb,#13bc9d,#8fffee);background-clip:text;-webkit-background-clip:text;color:transparent}.course-preview__description{color:rgba(229,255,250,.72);line-height:1.7;white-space:pre-line}.course-preview__eyebrow{margin:0;color:#8fffee;font-size:.66rem;font-weight:900;letter-spacing:.15em;text-transform:uppercase}.course-preview__facts{display:flex;flex-wrap:wrap;gap:.8rem;margin:1.5rem 0;color:rgba(229,255,250,.62);font-size:.72rem}.course-preview__facts strong{color:#8fffee;font-size:1.1rem}.course-preview__facts span{display:inline-flex;align-items:center;gap:.3rem}.course-preview__early-note{display:flex;align-items:flex-start;gap:.45rem;max-width:34rem;margin:0 0 1rem;padding:.75rem;border:1px solid rgba(143,255,238,.25);border-radius:.55rem;color:#8fffee;background:rgba(19,188,157,.08);font-size:.72rem;line-height:1.5}.course-preview__button{color:#03110f;background:linear-gradient(135deg,#8fffee,#13bc9d);font-weight:900}.course-preview__content{display:grid;grid-template-columns:1.1fr .9fr;gap:2rem;padding-top:3rem;border-top:1px solid rgba(19,188,157,.15)}.course-preview__content h2{max-width:14ch;margin:.5rem 0 1.2rem;font-size:clamp(1.8rem,3vw,3.2rem);line-height:1}.course-preview__topics{display:grid;gap:.5rem}.course-preview__topics article{display:grid;grid-template-columns:2rem 1fr auto;gap:.6rem;align-items:center;padding:.8rem;border:1px solid rgba(19,188,157,.18);border-radius:.55rem;background:rgba(4,24,25,.65)}.course-preview__topics span,.course-preview__topics .q-icon{color:#50dcc4}.course-preview__topics strong{font-size:.78rem}.course-preview__video{padding:1rem;border:1px solid rgba(19,188,157,.22);border-radius:.7rem;background:rgba(4,24,25,.66)}.course-preview__video iframe{width:100%;aspect-ratio:16/9;margin-top:.7rem;border:0;border-radius:.4rem}.course-preview__loading{display:grid;place-items:center;min-height:100vh;color:#8fffee}@media(max-width:800px){.course-preview__hero,.course-preview__content{grid-template-columns:1fr}.course-preview__hero{padding-top:4vh}.course-preview__hero-copy h1{font-size:clamp(2.6rem,13vw,4.5rem)}}
</style>
