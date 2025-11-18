<template>
  <div class="bg-dark text-white flex flex-center relative">
    <div class="chat-container column q-pa-md">

      <!-- Cabeçalho -->
      <div class="row items-center justify-between q-mb-md">
        <div class="text-subtitle1 text-bold row items-center">
          <q-btn
            round
            class="ia-fab cta-btn animate__animated animate__slower animate__fadeInUp q-mr-sm"
          >
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
          <div
            v-for="(msg, index) in messages"
            :key="index"
            class="q-mb-sm flex"
            :class="msg.from === 'user' ? 'justify-end' : 'justify-start'"
          >
            <div
              class="chat-bubble animate__animated animate__slower"
              :class="msg.from === 'user' ? 'chat-bubble-user animate__slideInRight' : 'chat-bubble-ia animate__slideInLeft'"
            >
              <div class="text-body2">
                {{ msg.text }}
              </div>

              <!-- Botão de link (só aparece quando o backend mandar link) -->
              <div v-if="msg.link" class="q-mt-xs">
                <q-btn
                  :label="msg.link.label || 'Abrir link'"
                  :href="msg.link.url"
                  target="_blank" color="green-14"
                  rel="noopener"
                  icon="open_in_new"
                  size="sm"
                  no-caps
                />
              </div>
            </div>
          </div>

          <div v-if="loading" class="q-mt-xs text-grey-5 text-caption">
            IA está respondendo...
          </div>
        </q-scroll-area>
      </div>

      <!-- Input + botão enviar -->
      <div class="chat-input row items-center q-gutter-sm q-pt-sm">
        <q-input
          v-model="currentMessage"
          class="col"
          color="secondary"
          dense
          outlined
          bg-color="grey-4"
          placeholder="Digite sua mensagem..."
          :disable="loading"
          @keyup.enter="sendMessage"
        />

        <q-btn
          class="cta-btn"
          icon="send"
          :loading="loading"
          :disable="!canSend"
          @click="sendMessage"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { api } from 'boot/axios' // usando o boot/axios

const messages = ref([
  {
    from: 'ia',
    text: 'Olá, Sou seu Assistente 24h! 👋 Como posso te ajudar hoje?',
    link: null
  },
  {
    from: 'ia',
    text: '😊 Temos Consultoria Gratuita, Agentes de IA, Bots para WhatsApp, Criação de Sistemas, Suporte e muito mais!',
    link: null
  }
])

const currentMessage = ref('')
const loading = ref(false)

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

// desce quando montar
onMounted(async () => {
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

// Só pode enviar se tiver texto e não estiver carregando resposta da IA
const canSend = computed(() => {
  return currentMessage.value.trim().length > 0 && !loading.value
})

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// manda replies da IA uma a uma, com delay
const pushIaRepliesWithDelay = async (replies, delayMs = 900) => {
  for (const text of replies) {
    messages.value.push({
      from: 'ia',
      text
    })

    await nextTick()
    scrollToBottom()
    await sleep(delayMs)
  }
}

const sendMessage = async () => {
  if (!canSend.value) return

  const text = currentMessage.value.trim()
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

    // adiciona cada resposta da IA
    iaReplies.forEach(reply => {
      messages.value.push({
        from: 'ia',
        text: reply,
        link: null
      })
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
      text: 'Tive um problema ao processar sua mensagem. Tente novamente em instantes 🙏',
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
  background: linear-gradient(135deg, #2563eb, #38bdf8);
  color: #fff;
  border-bottom-right-radius: 4px;
}

.chat-bubble-ia {
  background: rgba(15, 23, 42, 0.85);
  background: linear-gradient(135deg, #0d8539, #11767e);
  color: #e5e7eb;
  border-bottom-left-radius: 4px;
}

.chat-input {
  border-top: 1px solid rgba(148, 163, 184, 0.3);
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
