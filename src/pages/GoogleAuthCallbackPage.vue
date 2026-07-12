<template>
  <q-layout view="lHh Lpr lFf" class="google-callback">
    <q-page-container>
      <q-page class="google-callback__page flex flex-center">
        <div class="google-callback__panel" role="status" aria-live="polite">
          <q-spinner-gears color="secondary" size="42px" />
          <strong>Concluindo seu acesso</strong>
          <span>{{ message }}</span>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

const $q = useQuasar()
const router = useRouter()
const message = ref('Validando a conta Google...')

function goHomeWithError(text) {
  $q.notify({ type: 'negative', message: text })
  router.replace('/')
}

onMounted(() => {
  const params = new URLSearchParams(window.location.hash.replace(/^#/, ''))
  const error = params.get('error')

  if (error) {
    goHomeWithError(error)
    return
  }

  const token = params.get('token')
  const rawUser = params.get('user')

  if (!token || !rawUser) {
    goHomeWithError('Nao foi possivel recuperar a sessao do Google.')
    return
  }

  try {
    const user = JSON.parse(rawUser)
    const role = user.role === 'admin' ? 'admin' : 'user'
    const tokenKey = role === 'admin' ? 'aito_admin_token' : 'aito_user_token'
    const userKey = role === 'admin' ? 'aito_admin_user' : 'aito_user'

    localStorage.setItem(tokenKey, token)
    localStorage.setItem(userKey, JSON.stringify(user))
    if (role === 'user') {
      localStorage.removeItem('aito_admin_token')
      localStorage.removeItem('aito_admin_user')
    }

    window.history.replaceState({}, document.title, '/auth/google/callback')
    message.value = 'Acesso confirmado. Redirecionando...'
    router.replace(role === 'admin' ? '/admin' : '/app')
  } catch (error) {
    goHomeWithError('A resposta do Google estava invalida.')
  }
})
</script>

<style scoped>
.google-callback__page {
  min-height: 100vh;
  color: #effffb;
  background: radial-gradient(circle at 50% 20%, rgba(19, 188, 157, 0.18), transparent 25rem), #03090b;
}

.google-callback__panel {
  display: grid;
  width: min(90vw, 24rem);
  padding: 2rem;
  justify-items: center;
  gap: 0.8rem;
  border: 1px solid rgba(19, 188, 157, 0.3);
  border-radius: 1rem;
  background: rgba(4, 24, 25, 0.78);
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.36);
  text-align: center;
}

.google-callback__panel strong { font-size: 1.05rem; }
.google-callback__panel span { color: rgba(230, 255, 250, 0.68); font-size: 0.8rem; }
</style>
