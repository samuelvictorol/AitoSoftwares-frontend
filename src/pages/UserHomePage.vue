<template>
  <q-layout view="lHh Lpr lFf" class="user-app">
    <q-page-container>
      <q-page class="user-app__page">
        <div class="user-app__shell">
          <header class="user-app__header">
            <div class="user-app__brand"><img src="/favicon.png" alt="" /><span>AITO<span>SOFTWARES</span></span></div>
            <div class="user-app__session">
              <div>
                <strong>{{ sessionUser.name || 'Cliente Aito' }}</strong>
                <small>{{ sessionUser.email }}</small>
              </div>
              <q-btn flat no-caps icon="mdi-logout" label="Sair" @click="logout" />
            </div>
          </header>
          <main class="user-app__main">
            <span class="user-app__eyebrow">Area do cliente</span>
            <h1>Seu proximo movimento, em um so lugar.</h1>
            <p>Esse espaco vai reunir diagnosticos, etapas de projeto e os proximos sinais da sua operacao.</p>
            <div class="user-app__grid">
              <section><q-icon name="mdi-radar" size="30px" /><strong>Diagnostico</strong><span>Em preparacao</span></section>
              <section><q-icon name="mdi-progress-check" size="30px" /><strong>Projetos</strong><span>Acompanhe entregas por etapas</span></section>
              <section><q-icon name="mdi-message-outline" size="30px" /><strong>Contato</strong><span>Fale com a equipe Aito</span></section>
            </div>
          </main>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const sessionUser = ref({})

onMounted(() => {
  try {
    sessionUser.value = JSON.parse(localStorage.getItem('aito_user') || '{}')
  } catch (error) {
    sessionUser.value = {}
  }
})

function logout() {
  localStorage.removeItem('aito_user_token')
  localStorage.removeItem('aito_user')
  router.push('/')
}
</script>

<style scoped>
.user-app { color: #effffb; background: #03090b; }
.user-app__page { min-height: 100vh; background: radial-gradient(circle at 70% 18%, rgba(19, 188, 157, 0.16), transparent 25rem), #03090b; }
.user-app__shell { width: min(1100px, calc(100% - 2rem)); margin: 0 auto; }
.user-app__header { display: flex; padding: 1.1rem 0; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(19, 188, 157, 0.18); }
.user-app__session { display: flex; align-items: center; gap: 0.8rem; }
.user-app__session > div { display: grid; gap: 0.12rem; text-align: right; }
.user-app__session strong { color: #effffb; font-size: 0.72rem; }
.user-app__session small { color: rgba(230, 255, 250, 0.58); font-size: 0.62rem; }
.user-app__brand { display: flex; align-items: center; gap: 0.65rem; font-size: 0.78rem; font-weight: 800; letter-spacing: 0.12em; }
.user-app__brand img { width: 34px; height: 34px; }
.user-app__brand span span { color: #13bc9d; }
.user-app__main { padding: 12vh 0; }
.user-app__eyebrow { color: #8fffee; font-size: 0.7rem; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; }
.user-app h1 { max-width: 12ch; margin: 0.8rem 0 0; font-size: clamp(2.4rem, 6vw, 5rem); line-height: 0.98; background: linear-gradient(135deg, #f3fffd, #13bc9d, #8fffee); background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.user-app p { max-width: 32rem; color: rgba(230, 255, 250, 0.72); line-height: 1.6; }
.user-app__grid { display: grid; margin-top: 3rem; grid-template-columns: repeat(3, 1fr); gap: 0.8rem; }
.user-app__grid section { display: grid; padding: 1.2rem; gap: 0.4rem; border: 1px solid rgba(19, 188, 157, 0.25); border-radius: 0.8rem; background: rgba(4, 24, 25, 0.72); }
.user-app__grid strong { color: #effffb; }
.user-app__grid span { color: rgba(230, 255, 250, 0.58); font-size: 0.75rem; }
.user-app__grid .q-icon { color: #13bc9d; }
@media (max-width: 650px) { .user-app__grid { grid-template-columns: 1fr; } }
@media (max-width: 520px) {
  .user-app__session > div { display: none; }
}
</style>
