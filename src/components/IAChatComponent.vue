<template>
  <div class="bg-dark text-white flex flex-center relative">
    <div class="chat-container column q-pa-md">

      <!-- Cabeçalho -->
      <div class="row items-center justify-between q-mb-md">
        <div class="text-subtitle1 text-bold row items-center">
          <q-btn round class="ia-fab cta-btn animate__animated animate__slower animate__fadeInUp q-mr-sm">
            <q-img src="/ia.gif" width="50px" alt="gif robo atendimento 24h com i.a" />
          </q-btn>
          <div>
            Assistente Virtual <br />
            <q-badge color="positive" text-color="white" rounded>
              online
            </q-badge>
          </div>
        </div>
      </div>

      <!-- Lista de mensagens -->
      <div class="chat-messages col">
        <q-scroll-area ref="scrollAreaRef" class="fit">
          <div v-for="(msg, index) in messages" :key="index" class="q-mb-lg flex"
            :class="msg.from === 'user' ? 'justify-end' : 'justify-start'">
            <div class="chat-bubble animate__animated animate__slower"
              :class="msg.from === 'user' ? 'chat-bubble-user animate__slideInRight' : 'chat-bubble-ia animate__slideInLeft'">
              <div class="text-body2">
                {{ msg.text }}
              </div>

              <!-- Botão de link (só aparece quando o backend mandar link) -->
              <div v-if="msg.link" class="q-mt-xs">
                <q-btn :label="msg.link.label || 'Abrir link'" :href="msg.link.url" target="_blank" color="green-14"
                  rel="noopener" icon="open_in_new" size="sm" no-caps />
              </div>
            </div>
          </div>

          <div v-if="loading" class="q-mt-xs text-grey-5 text-caption">
            IA está respondendo...
          </div>

          <div v-if="showTriage" class="triage-panel">
            <div class="triage-title">O que você quer resolver?</div>
            <div class="triage-options">
              <q-btn
                v-for="option in triageOptions"
                :key="option.label"
                outline
                no-caps
                class="triage-option"
                :icon="option.icon"
                :label="option.label"
                @click="selectTriage(option)"
              />
            </div>
          </div>
        </q-scroll-area>
      </div>

      <!-- Input + botão enviar -->
      <div class="chat-input row items-center q-gutter-sm q-pt-sm">
        <q-input v-model="currentMessage" class="col" color="secondary" dense outlined bg-color="grey-4"
          placeholder="Digite sua mensagem..." :disable="loading" @keyup.enter="sendMessage()" />

        <q-btn class="cta-btn" icon="send" :loading="loading" :disable="!canSend" @click="sendMessage()" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { api } from 'boot/axios' // usando o boot/axios

const STORAGE_KEY = 'aito_site_chat_messages_v2'

const messages = ref([
  {
    from: 'ia',
    text: 'Olá! Sou a IA da AITO. Selecione uma área para eu entender melhor seu projeto.',
    link: null
  },
])

const currentMessage = ref('')
const loading = ref(false)

const triageOptions = Object.freeze([
  {
    label: 'Sistemas sob demanda',
    icon: 'mdi-layers-outline',
    message: 'Quero falar sobre sistemas sob demanda.'
  },
  {
    label: 'Automação',
    icon: 'mdi-cog-sync-outline',
    message: 'Quero automatizar processos da minha empresa.'
  },
  {
    label: 'IA para WhatsApp',
    icon: 'mdi-whatsapp',
    message: 'Quero uma IA para atendimento no WhatsApp.'
  },
  {
    label: 'Chatbots',
    icon: 'mdi-robot-outline',
    message: 'Quero criar ou melhorar um chatbot.'
  },
  {
    label: 'Marketing e SEO',
    icon: 'mdi-chart-line',
    message: 'Quero ajuda com marketing, SEO e funil digital.'
  },
  {
    label: 'Outros',
    icon: 'mdi-dots-horizontal-circle-outline',
    message: 'Tenho outro tipo de projeto e quero explicar.'
  }
])

// ref do QScrollArea (no template: ref="scrollAreaRef")
const scrollAreaRef = ref(null)

// função pra descer o scroll até o final
const scrollToBottom = () => {
  const sa = scrollAreaRef.value
  if (!sa) return

  const target = sa.getScrollTarget?.()
  if (!target) return

  const duration = 200
  sa.setScrollPosition('vertical', target.scrollHeight, duration)
}

// carregar histórico do sessionStorage (se existir)
const loadFromSession = () => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return

    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed) && parsed.length > 0) {
      messages.value = parsed.map(m => ({
        from: m.from,
        text: m.text,
        link: m.link || null
      }))
    }
  } catch (e) {
    console.error('Erro ao carregar histórico do chat do sessionStorage:', e)
  }
}

// salvar histórico no sessionStorage sempre que mudar
const saveToSession = (val) => {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(val))
  } catch (e) {
    console.error('Erro ao salvar histórico do chat no sessionStorage:', e)
  }
}

// desce quando montar + tenta recuperar histórico
onMounted(async () => {
  loadFromSession()
  await nextTick()
  scrollToBottom()
})

// sempre que o número de mensagens mudar, desce
watch(
  () => messages.value.length,
  async () => {
    await nextTick()
    scrollToBottom()
  }
)

// sempre que qualquer coisa em messages mudar, salva no sessionStorage
watch(
  messages,
  (val) => {
    saveToSession(val)
  },
  { deep: true }
)

// Só pode enviar se tiver texto e não estiver carregando resposta da IA
const canSend = computed(() => {
  return currentMessage.value.trim().length > 0 && !loading.value
})

const showTriage = computed(() => {
  return !loading.value && !messages.value.some((message) => message.from === 'user')
})

function selectTriage(option) {
  sendMessage(option.message)
}

const sendMessage = async (presetText = '') => {
  const text = (presetText || currentMessage.value).trim()
  if (!text || loading.value) return
  currentMessage.value = ''

  // mensagem do usuário
  messages.value.push({
    from: 'user',
    text,
    link: null
  })
  loading.value = true

  try {
    const payload = {
      last_message: text,
      history: messages.value.map(m => ({
        from: m.from,
        text: m.text
      }))
    }
    const { data } = await api.post('/talk-site-ia', payload)

    const iaReplies = data.ia_replies || []
    const link = data.link || null

    // adiciona cada resposta da IA com delay em cascata
    iaReplies.forEach((reply, index) => {
      setTimeout(() => {
        messages.value.push({
          from: 'ia',
          text: reply,
          link: null
        })
      }, 1000 * (index + 1)) // 1s a mais por mensagem
    })


    // se vier link do backend, adiciona uma "mensagem especial" com botão
    if (link && link.url) {
      messages.value.push({
        from: 'ia',
        text: link.label || 'Abrir link',
        link: {
          label: link.label || 'Abrir link',
          url: link.url
        }
      })
    }
  } catch (e) {
    console.error(e)
    messages.value.push({
      from: 'ia',
      text: 'Tive um problema ao processar sua mensagem. Tente novamente em instantes.',
      link: null
    })
  } finally {
    loading.value = false
  }
}
</script>


<style scoped>
.chat-container {
  width: 100%;
  height: 80vh;
  display: flex;
  color: #edfffb;
}

.chat-messages {
  flex: 1;
  min-height: 0;
  /* pra scroll-area funcionar bem */
}

.chat-bubble {
  max-width: 80%;
  padding: 8px 12px;
  border-radius: 16px;
  font-size: 0.9rem;
  line-height: 1.4;
}

.chat-bubble-user {
  background: linear-gradient(135deg, #13bc9d, #12ad89);
  color: #03110f;
  border-bottom-right-radius: 4px;
}

.chat-bubble-ia {
  background: linear-gradient(135deg, rgba(6, 32, 34, 0.94), rgba(3, 18, 19, 0.88));
  border: 1px solid rgba(19, 188, 157, 0.22);
  color: #e5fffb;
  border-bottom-left-radius: 4px;
}

.triage-panel {
  margin: 0.35rem 0 1rem;
  padding: 0.85rem;
  border: 1px solid rgba(19, 188, 157, 0.24);
  border-radius: 14px;
  background: rgba(2, 16, 17, 0.72);
}

.triage-title {
  margin-bottom: 0.65rem;
  color: rgba(229, 255, 250, 0.78);
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.triage-options {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.5rem;
}

.triage-option {
  justify-content: flex-start;
  border-color: rgba(19, 188, 157, 0.38);
  border-radius: 10px;
  color: #edfffb;
  background: rgba(19, 188, 157, 0.08);
}

.chat-input {
  /* border-top: 1px solid rgba(148, 163, 184, 0.3); */
}

.cta-btn {
  background: linear-gradient(135deg, #22c55e, #20b4be);
  color: #f9fafb;
  font-weight: 600;
  border-radius: 999px;
  transition: all 0.3s ease;
}

.cta-btn:hover {
  filter: drop-shadow(0 8px 12px rgba(34, 197, 170, 0.5));
}
</style>
