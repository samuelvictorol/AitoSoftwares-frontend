<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="seller-page">
        <div class="chat-shell">
      <aside class="chat-sidebar">
        <div class="sidebar-head">
          <div class="row items-center q-gutter-sm">
            <q-avatar size="38px" color="primary" text-color="white">
              {{ initials }}
            </q-avatar>
            <div class="min-w-0">
              <div class="text-subtitle2 text-weight-bold ellipsis">{{ seller.name }}</div>
              <div class="text-caption text-grey-7">Modo vendedor</div>
            </div>
          </div>
          <div class="row items-center">
            <q-btn dense flat round icon="mdi-account-cog-outline" @click="profileDialog = true">
              <q-tooltip>Meu perfil</q-tooltip>
            </q-btn>
            <q-btn dense flat round icon="mdi-logout" @click="logout">
              <q-tooltip>Sair</q-tooltip>
            </q-btn>
          </div>
        </div>

        <div class="sidebar-status">
          <q-chip dense square :color="whatsappColor" text-color="white" :icon="whatsappIcon">
            {{ whatsappLabel }}
          </q-chip>
          <q-chip dense square color="blue-grey-1" text-color="blue-grey-9" icon="mdi-account-voice">
            Atendimento humano
          </q-chip>
        </div>

        <q-input v-model="search" dense outlined class="conversation-search" placeholder="Buscar conversas" debounce="250" @update:model-value="loadConversations">
          <template #prepend><q-icon name="mdi-magnify" /></template>
        </q-input>

        <div class="conversation-list">
          <button
            v-for="conversation in conversations"
            :key="conversation._id"
            class="conversation-row"
            :class="{ active: conversation._id === selectedId }"
            @click="selectConversation(conversation)"
          >
            <q-avatar size="42px" color="blue-grey-2" text-color="blue-grey-9">
              {{ contactInitial(conversation) }}
            </q-avatar>
            <div class="conversation-main">
              <div class="row items-center justify-between no-wrap">
                <div class="conversation-name ellipsis">{{ conversation.customerName || conversation.customerPhone }}</div>
                <div class="conversation-time">{{ shortTime(conversation.lastMessageAt) }}</div>
              </div>
              <div class="row items-center justify-between no-wrap q-mt-xs">
                <div class="conversation-preview ellipsis">{{ conversation.lastMessagePreview || 'Sem mensagens' }}</div>
                <q-chip dense square :color="aiChip(conversation).color" text-color="white" class="ai-chip">
                  {{ aiChip(conversation).label }}
                </q-chip>
              </div>
              <div v-if="conversation.assignedSellerName" class="assigned ellipsis">
                {{ conversation.assignedSellerName }}
              </div>
            </div>
          </button>
        </div>
      </aside>

      <main class="chat-main">
        <template v-if="selectedConversation">
          <header class="chat-head">
            <div>
              <div class="text-subtitle1 text-weight-bold">{{ selectedConversation.customerName || selectedConversation.customerPhone }}</div>
              <div class="text-caption text-grey-7">{{ selectedConversation.customerPhone }}</div>
            </div>
            <div class="row items-center q-gutter-sm">
              <q-chip dense square :color="aiChip(selectedConversation).color" text-color="white">
                {{ aiChip(selectedConversation).label }}
              </q-chip>
              <q-chip v-if="cooldownText(selectedConversation)" dense square color="warning" text-color="black" icon="mdi-timer-outline">
                {{ cooldownText(selectedConversation) }}
              </q-chip>
              <q-btn outline dense no-caps icon="mdi-hand-back-right-outline" label="Assumir" @click="assumeSelected" />
            </div>
          </header>

          <div ref="messagePane" class="message-pane">
            <div
              v-for="message in messages"
              :key="message._id"
              class="message-row"
              :class="message.origin"
            >
              <div class="message-bubble">
                <div class="message-meta">
                  {{ originLabel(message) }} - {{ shortTime(message.timestamp) }}
                </div>
                <div v-if="message.media?.url" class="media-preview">
                  <img v-if="message.type === 'image'" :src="mediaUrl(message.media.url)" alt="Midia recebida">
                  <audio v-else-if="message.type === 'audio'" :src="mediaUrl(message.media.url)" controls />
                  <q-icon v-else name="mdi-file-outline" size="24px" />
                </div>
                <div class="message-text">{{ message.content }}</div>
                <div v-if="message.deliveryStatus === 'failed'" class="delivery-failed">Falha no envio</div>
              </div>
            </div>
          </div>

          <footer class="composer">
            <q-file v-model="media" dense outlined clearable class="media-input" label="Midia" :display-value="media?.name || ''">
              <template #prepend><q-icon name="mdi-paperclip" /></template>
            </q-file>
            <q-input
              v-model="draft"
              dense
              outlined
              autogrow
              class="composer-input"
              placeholder="Digite uma resposta"
              @keydown.enter.exact.prevent="sendMessage"
            />
            <q-btn unelevated round color="positive" icon="mdi-send" :loading="sending" @click="sendMessage">
              <q-tooltip>Enviar</q-tooltip>
            </q-btn>
          </footer>
        </template>

        <div v-else class="empty-chat">
          <q-icon name="mdi-message-text-outline" size="70px" color="blue-grey-3" />
          <div class="text-subtitle1 text-weight-bold q-mt-md">Selecione uma conversa</div>
          <div class="text-caption text-grey-7">Todas as mensagens recebidas pelo WhatsApp unico aparecem aqui.</div>
        </div>
      </main>
    </div>

    <q-dialog v-model="profileDialog">
      <q-card class="profile-card">
        <q-card-section>
          <div class="text-subtitle1 text-weight-bold">Meu perfil</div>
        </q-card-section>
        <q-card-section class="q-gutter-sm">
          <q-input v-model="profile.name" outlined dense label="Nome" />
          <q-input v-model="profile.phone" outlined dense label="Telefone" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat no-caps label="Cancelar" v-close-popup />
          <q-btn unelevated no-caps color="primary" label="Salvar" @click="saveProfile" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="passwordDialog">
      <q-card class="profile-card">
        <q-card-section>
          <div class="text-subtitle1 text-weight-bold">Alterar senha</div>
        </q-card-section>
        <q-card-section class="q-gutter-sm">
          <q-input v-model="passwordForm.currentPassword" outlined dense label="Senha atual" type="password" />
          <q-input v-model="passwordForm.newPassword" outlined dense label="Nova senha" type="password" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat no-caps label="Cancelar" v-close-popup />
          <q-btn unelevated no-caps color="primary" label="Alterar" @click="changePassword" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn round color="primary" icon="mdi-lock-reset" @click="passwordDialog = true">
        <q-tooltip>Alterar senha</q-tooltip>
      </q-btn>
        </q-page-sticky>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { api, apiBaseURL } from 'boot/axios'

export default {
  name: 'SellerChatPage',
  data () {
    return {
      token: localStorage.getItem('aito_seller_token'),
      seller: JSON.parse(localStorage.getItem('aito_seller_user') || '{}'),
      profile: {},
      passwordForm: {
        currentPassword: '',
        newPassword: ''
      },
      profileDialog: false,
      passwordDialog: false,
      search: '',
      conversations: [],
      messages: [],
      selectedId: null,
      draft: '',
      media: null,
      sending: false,
      whatsappStatus: {},
      eventSource: null,
      now: Date.now(),
      tick: null
    }
  },
  computed: {
    headers () {
      return { Authorization: `Bearer ${this.token}` }
    },
    selectedConversation () {
      return this.conversations.find(conversation => conversation._id === this.selectedId)
    },
    initials () {
      return String(this.seller.name || 'V').split(/\s+/).slice(0, 2).map(part => part[0]).join('').toUpperCase()
    },
    whatsappLabel () {
      const labels = {
        online: 'WhatsApp online',
        offline: 'WhatsApp offline',
        waiting_qr: 'Aguardando QR',
        authenticating: 'Autenticando',
        error: 'Erro WhatsApp'
      }
      return labels[this.whatsappStatus.status] || 'WhatsApp offline'
    },
    whatsappColor () {
      const colors = {
        online: 'positive',
        waiting_qr: 'warning',
        authenticating: 'info',
        error: 'negative'
      }
      return colors[this.whatsappStatus.status] || 'grey-7'
    },
    whatsappIcon () {
      return this.whatsappStatus.status === 'online' ? 'mdi-whatsapp' : 'mdi-wifi-off'
    }
  },
  mounted () {
    if (!this.token) {
      this.$router.push('/vendedor/login')
      return
    }
    this.profile = { ...this.seller }
    this.loadInitialData()
    this.connectEvents()
    this.tick = setInterval(() => { this.now = Date.now() }, 1000)
  },
  beforeUnmount () {
    if (this.eventSource) this.eventSource.close()
    clearInterval(this.tick)
  },
  methods: {
    async loadInitialData () {
      await Promise.all([this.loadMe(), this.loadConversations(), this.loadWhatsappStatus()])
    },
    async loadMe () {
      const { data } = await api.get('/seller/me', { headers: this.headers })
      this.seller = data.data
      this.profile = { ...data.data }
      localStorage.setItem('aito_seller_user', JSON.stringify(data.data))
    },
    async loadConversations () {
      const { data } = await api.get('/seller/conversations', { headers: this.headers, params: { q: this.search } })
      this.conversations = data.data || []
      if (!this.selectedId && this.conversations.length) {
        this.selectConversation(this.conversations[0])
      }
    },
    async loadWhatsappStatus () {
      const { data } = await api.get('/seller/whatsapp/status', { headers: this.headers })
      this.whatsappStatus = data.data || {}
    },
    async selectConversation (conversation) {
      this.selectedId = conversation._id
      const { data } = await api.get(`/seller/conversations/${conversation._id}/messages`, { headers: this.headers })
      this.messages = data.data || []
      this.scrollMessages()
    },
    async assumeSelected () {
      if (!this.selectedId) return
      const { data } = await api.post(`/seller/conversations/${this.selectedId}/assume`, {}, { headers: this.headers })
      this.upsertConversation(data.data)
    },
    async sendMessage () {
      if (!this.selectedId || (!this.draft.trim() && !this.media)) return
      this.sending = true
      try {
        const form = new FormData()
        form.append('content', this.draft.trim())
        if (this.media) form.append('media', this.media)
        const { data } = await api.post(`/seller/conversations/${this.selectedId}/send`, form, { headers: this.headers })
        if (!this.messages.some(item => item._id === data.data._id)) {
          this.messages.push(data.data)
        }
        this.draft = ''
        this.media = null
        this.scrollMessages()
      } catch (error) {
        this.$q.notify({ type: 'negative', message: error.response?.data?.message || 'Falha ao enviar.' })
      } finally {
        this.sending = false
      }
    },
    connectEvents () {
      const url = new URL(`${apiBaseURL.replace(/\/$/, '')}/events`, window.location.origin)
      url.searchParams.set('token', this.token)
      this.eventSource = new EventSource(url.toString())
      this.eventSource.addEventListener('conversation.updated', (event) => {
        const packet = JSON.parse(event.data)
        this.upsertConversation(packet.payload)
      })
      this.eventSource.addEventListener('message.created', (event) => {
        const packet = JSON.parse(event.data)
        const message = packet.payload
        if (message.conversation === this.selectedId && !this.messages.some(item => item._id === message._id)) {
          this.messages.push(message)
          this.scrollMessages()
        }
      })
      this.eventSource.addEventListener('whatsapp.status', (event) => {
        const packet = JSON.parse(event.data)
        this.whatsappStatus = packet.payload
      })
    },
    upsertConversation (conversation) {
      const id = conversation._id
      const index = this.conversations.findIndex(item => item._id === id)
      if (index >= 0) {
        this.conversations.splice(index, 1, conversation)
      } else {
        this.conversations.unshift(conversation)
      }
      this.conversations.sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt))
    },
    aiChip (conversation) {
      if (!conversation) return { label: 'IA', color: 'grey-7' }
      if (conversation.aiState === 'active') return { label: 'IA ativa', color: 'positive' }
      if (conversation.aiState === 'cooldown') return { label: 'Cooldown', color: 'warning' }
      return { label: 'IA hibernada', color: 'blue-grey-7' }
    },
    cooldownText (conversation) {
      if (!conversation?.aiPausedUntil) return ''
      const remaining = Math.max(0, new Date(conversation.aiPausedUntil).getTime() - this.now)
      if (!remaining) return ''
      const minutes = Math.floor(remaining / 60000)
      const seconds = Math.floor((remaining % 60000) / 1000)
      return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    },
    contactInitial (conversation) {
      return String(conversation.customerName || conversation.customerPhone || '?').trim()[0]?.toUpperCase() || '?'
    },
    originLabel (message) {
      const labels = {
        customer: 'Cliente',
        ai: 'AssistenteVirtual',
        seller: message.sellerName || 'Vendedor',
        system: 'Sistema'
      }
      return labels[message.origin] || message.origin
    },
    mediaUrl (url) {
      if (!url) return ''
      if (url.startsWith('http')) return url
      const root = apiBaseURL.replace(/\/api\/?$/, '')
      return `${root}${url}`
    },
    shortTime (value) {
      if (!value) return ''
      return new Date(value).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    },
    scrollMessages () {
      this.$nextTick(() => {
        const pane = this.$refs.messagePane
        if (pane) pane.scrollTop = pane.scrollHeight
      })
    },
    async saveProfile () {
      const { data } = await api.put('/seller/me', this.profile, { headers: this.headers })
      this.seller = data.data
      this.profile = { ...data.data }
      localStorage.setItem('aito_seller_user', JSON.stringify(data.data))
      this.profileDialog = false
    },
    async changePassword () {
      try {
        await api.patch('/seller/me/password', this.passwordForm, { headers: this.headers })
        this.passwordDialog = false
        this.passwordForm = { currentPassword: '', newPassword: '' }
        this.$q.notify({ type: 'positive', message: 'Senha alterada.' })
      } catch (error) {
        this.$q.notify({ type: 'negative', message: error.response?.data?.message || 'Nao foi possivel alterar a senha.' })
      }
    },
    logout () {
      localStorage.removeItem('aito_seller_token')
      localStorage.removeItem('aito_seller_user')
      this.$router.push('/vendedor/login')
    }
  }
}
</script>

<style scoped>
.seller-page {
  min-height: 100vh;
  background: #d8e8e3;
}

.chat-shell {
  height: 100vh;
  display: grid;
  grid-template-columns: 370px 1fr;
  background: #f7faf9;
}

.chat-sidebar {
  min-width: 0;
  border-right: 1px solid #d6dfdc;
  background: #ffffff;
  display: flex;
  flex-direction: column;
}

.sidebar-head {
  height: 64px;
  padding: 10px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f0f4f3;
}

.sidebar-status {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 10px 12px 0;
}

.conversation-search {
  padding: 10px 12px;
}

.conversation-list {
  overflow: auto;
  flex: 1;
}

.conversation-row {
  width: 100%;
  min-height: 82px;
  border: 0;
  border-bottom: 1px solid #edf1f0;
  background: white;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  text-align: left;
  cursor: pointer;
}

.conversation-row:hover,
.conversation-row.active {
  background: #eef7f4;
}

.conversation-main {
  min-width: 0;
  flex: 1;
}

.conversation-name {
  font-weight: 700;
  color: #0b1220;
}

.conversation-time,
.conversation-preview,
.assigned {
  font-size: 12px;
  color: #697780;
}

.assigned {
  margin-top: 4px;
  color: #128c7e;
}

.ai-chip {
  flex: 0 0 auto;
  font-size: 10px;
}

.chat-main {
  min-width: 0;
  display: flex;
  flex-direction: column;
  background: #e7f0ed;
}

.chat-head {
  min-height: 64px;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  background: #f0f4f3;
  border-bottom: 1px solid #d6dfdc;
}

.message-pane {
  flex: 1;
  overflow: auto;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.message-row {
  display: flex;
}

.message-row.customer {
  justify-content: flex-start;
}

.message-row.ai,
.message-row.seller,
.message-row.system {
  justify-content: flex-end;
}

.message-bubble {
  max-width: min(680px, 78%);
  padding: 8px 10px;
  border-radius: 8px;
  background: white;
  box-shadow: 0 1px 2px rgba(11, 18, 32, 0.08);
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.message-row.seller .message-bubble {
  background: #dcf8c6;
}

.message-row.ai .message-bubble {
  background: #e2f1ff;
}

.message-meta {
  font-size: 11px;
  color: #66757f;
  margin-bottom: 4px;
}

.message-text {
  font-size: 14px;
  color: #12202f;
}

.media-preview img {
  max-width: 240px;
  border-radius: 8px;
  display: block;
  margin-bottom: 6px;
}

.media-preview audio {
  width: 260px;
  max-width: 100%;
}

.delivery-failed {
  margin-top: 4px;
  color: #b42318;
  font-size: 12px;
}

.composer {
  min-height: 72px;
  padding: 10px 14px;
  display: grid;
  grid-template-columns: minmax(120px, 220px) 1fr auto;
  gap: 10px;
  align-items: end;
  background: #f0f4f3;
  border-top: 1px solid #d6dfdc;
}

.composer-input,
.media-input {
  min-width: 0;
}

.empty-chat {
  margin: auto;
  text-align: center;
  color: #5f6f77;
}

.profile-card {
  width: min(480px, calc(100vw - 32px));
  border-radius: 8px;
}

.min-w-0 {
  min-width: 0;
}

@media (max-width: 860px) {
  .chat-shell {
    grid-template-columns: 1fr;
  }

  .chat-sidebar {
    height: 42vh;
    border-right: 0;
    border-bottom: 1px solid #d6dfdc;
  }

  .chat-main {
    height: 58vh;
  }

  .chat-head {
    align-items: flex-start;
    flex-direction: column;
  }

  .composer {
    grid-template-columns: 1fr auto;
  }

  .media-input {
    grid-column: 1 / -1;
  }
}
</style>
