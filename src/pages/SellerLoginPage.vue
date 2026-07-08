<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="seller-login row items-center justify-center">
        <q-form class="seller-login-panel" @submit="login">
          <div class="row items-center q-gutter-sm q-mb-lg">
            <q-icon name="mdi-whatsapp" size="34px" color="positive" />
            <div>
              <div class="text-h6 text-weight-bold">Modo Vendedor</div>
              <div class="text-caption text-grey-7">Atendimento em tempo real</div>
            </div>
          </div>

          <q-input v-model="form.email" outlined dense label="Email/login" type="email" autocomplete="username" />
          <q-input v-model="form.password" outlined dense label="Senha" type="password" autocomplete="current-password" class="q-mt-sm" />

          <q-btn unelevated no-caps class="full-width q-mt-md seller-login-btn" icon="mdi-login" label="Entrar no atendimento" type="submit" :loading="loading" />
        </q-form>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { api } from 'boot/axios'

export default {
  name: 'SellerLoginPage',
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
        const { data } = await api.post('/seller/auth/login', this.form)
        localStorage.setItem('aito_seller_token', data.token)
        localStorage.setItem('aito_seller_user', JSON.stringify(data.user))
        this.$router.push('/vendedor/chat')
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
.seller-login {
  min-height: 100vh;
  background: #eef4f2;
}

.seller-login-panel {
  width: min(420px, calc(100vw - 32px));
  padding: 28px;
  background: white;
  border: 1px solid #d7e1de;
  border-radius: 8px;
  box-shadow: 0 18px 55px rgba(11, 18, 32, 0.12);
}

.seller-login-btn {
  background: #128c7e;
  color: white;
  border-radius: 8px;
}
</style>
