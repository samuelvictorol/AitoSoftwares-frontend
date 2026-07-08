<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="login-page row items-center justify-center">
        <q-form class="login-panel" @submit="login">
          <div class="login-brand">
            <q-img src="/favicon.png" width="58px" height="38px" fit="contain" />
            <div>
              <div class="text-h6 text-weight-bold">Aito Admin</div>
              <div class="text-caption text-grey-7">Atendimento WhatsApp com IA</div>
            </div>
          </div>

          <q-input v-model="form.email" outlined dense label="Email admin" type="email" autocomplete="username" />
          <q-input v-model="form.password" outlined dense label="Senha" type="password" autocomplete="current-password" class="q-mt-sm" />

          <q-btn unelevated no-caps class="full-width q-mt-md login-btn" icon="mdi-login" label="Entrar" type="submit" :loading="loading" />
        </q-form>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { api } from 'boot/axios'

export default {
  name: 'AdminLoginPage',
  data () {
    return {
      loading: false,
      form: {
        email: '',
        password: ''
      }
    }
  },
  methods: {
    async login () {
      this.loading = true
      try {
        const { data } = await api.post('/admin/auth/login', this.form)
        localStorage.setItem('aito_admin_token', data.token)
        localStorage.setItem('aito_admin_user', JSON.stringify(data.user))
        this.$router.push('/admin')
      } catch (error) {
        this.$q.notify({ type: 'negative', message: error.response?.data?.message || 'Nao foi possivel entrar.' })
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: #f6f8fb;
  color: #0b1220;
}

.login-panel {
  width: min(420px, calc(100vw - 32px));
  padding: 28px;
  background: #ffffff;
  border: 1px solid #dce3ea;
  border-radius: 8px;
  box-shadow: 0 18px 55px rgba(11, 18, 32, 0.12);
}

.login-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 22px;
}

.login-btn {
  background: #0b1220;
  color: white;
  border-radius: 8px;
}
</style>
