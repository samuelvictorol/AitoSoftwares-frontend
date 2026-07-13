<template>
  <q-layout view="lHh Lpr lFf" class="customer-app">
    <q-page-container>
      <q-page class="customer-app__page">
        <div class="customer-app__shell">
          <header class="customer-app__header">
            <router-link class="customer-app__brand" to="/"><img src="/favicon.png" alt="" /><span>AITO<span>SOFTWARES</span></span></router-link>
            <div class="customer-app__session"><strong>{{ firstName }}</strong><q-btn flat round icon="mdi-logout" aria-label="Sair" @click="logout"><q-tooltip>Sair</q-tooltip></q-btn></div>
          </header>
          <nav class="customer-app__nav" aria-label="Area do cliente">
            <button class="is-active" type="button"><q-icon name="mdi-briefcase-outline" /> Meus projetos</button>
            <button type="button"><q-icon name="mdi-account-outline" /> Meu perfil</button>
          </nav>
          <main class="customer-app__main">
            <p class="customer-app__eyebrow">Area do cliente</p>
            <h1>Seu projeto em movimento.</h1>
            <p>Acompanhe etapas, proximas entregas e os sinais que importam para sua operacao.</p>
            <div class="customer-app__cards">
              <section><q-icon name="mdi-progress-check" size="28px" /><span>Projeto principal</span><strong>Planejamento inicial</strong><small>Esboco preparado para a proxima etapa.</small></section>
              <section><q-icon name="mdi-calendar-clock-outline" size="28px" /><span>Proximo marco</span><strong>Em breve</strong><small>As atualizacoes apareceram aqui.</small></section>
              <section><q-icon name="mdi-message-text-outline" size="28px" /><span>Contato Aito</span><strong>Fale com a equipe</strong><small>Seu canal de acompanhamento esta aberto.</small></section>
            </div>
          </main>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const sessionUser = ref({})
const firstName = computed(() => String(sessionUser.value.name || 'Cliente Aito').trim().split(/\s+/)[0])

onMounted(() => {
  try { sessionUser.value = JSON.parse(localStorage.getItem('aito_user') || '{}') } catch (error) { sessionUser.value = {} }
})

function logout() {
  localStorage.removeItem('aito_user_token')
  localStorage.removeItem('aito_user')
  router.push('/customer/login')
}
</script>

<style scoped>
.customer-app { color: #effffb; background: #03090b; }
.customer-app__page { min-height: 100vh; background: radial-gradient(circle at 70% 15%, rgba(19,188,157,.17), transparent 27rem), #03090b; }
.customer-app__shell { width: min(1120px, calc(100% - 2rem)); margin: auto; }
.customer-app__header { display:flex; align-items:center; justify-content:space-between; padding:1rem 0; border-bottom:1px solid rgba(19,188,157,.2); }
.customer-app__brand { display:inline-flex; align-items:center; gap:.6rem; color:#effffb; font-size:.76rem; font-weight:900; letter-spacing:.12em; text-decoration:none; }
.customer-app__brand img { width:34px; height:34px; object-fit:contain; }.customer-app__brand span span { color:#13bc9d; }
.customer-app__session { display:flex; align-items:center; gap:.5rem; color:#8fffee; font-size:.78rem; }
.customer-app__nav { display:flex; gap:.4rem; padding:1.2rem 0; border-bottom:1px solid rgba(19,188,157,.14); }.customer-app__nav button { display:inline-flex; align-items:center; gap:.4rem; padding:.55rem .8rem; border:1px solid rgba(19,188,157,.25); border-radius:.55rem; color:rgba(239,255,251,.7); background:rgba(3,25,26,.5); cursor:pointer; font:inherit; font-size:.74rem; }.customer-app__nav button.is-active { color:#03110f; background:linear-gradient(135deg,#8fffee,#13bc9d); }
.customer-app__main { padding:12vh 0; }.customer-app__eyebrow { color:#8fffee; font-size:.7rem; font-weight:900; letter-spacing:.15em; text-transform:uppercase; }.customer-app h1 { max-width:12ch; margin:.7rem 0 0; font-size:clamp(2.5rem,6vw,5rem); line-height:.96; background:linear-gradient(135deg,#effffb,#13bc9d,#8fffee); background-clip:text; -webkit-background-clip:text; color:transparent; }.customer-app__main > p:not(.customer-app__eyebrow) { max-width:34rem; color:rgba(229,255,250,.7); line-height:1.6; }.customer-app__cards { display:grid; grid-template-columns:repeat(3,1fr); gap:.8rem; margin-top:3rem; }.customer-app__cards section { display:grid; gap:.45rem; padding:1.2rem; border:1px solid rgba(19,188,157,.25); border-radius:.7rem; background:rgba(4,24,25,.7); }.customer-app__cards q-icon { color:#13bc9d; }.customer-app__cards span { color:#8fffee; font-size:.7rem; }.customer-app__cards strong { font-size:.95rem; }.customer-app__cards small { color:rgba(229,255,250,.58); line-height:1.5; }
@media (max-width:700px) { .customer-app__cards { grid-template-columns:1fr; } }
</style>
