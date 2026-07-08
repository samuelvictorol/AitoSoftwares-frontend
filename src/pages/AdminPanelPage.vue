<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="ops-page">
        <div class="ops-shell">
      <header class="ops-header">
        <div class="row items-center q-gutter-sm">
          <q-img src="/favicon.png" width="52px" height="34px" fit="contain" />
          <div>
            <div class="text-h6 text-weight-bold">Painel de Atendimento</div>
            <div class="text-caption text-grey-7">WhatsApp unico, IA e vendedores</div>
          </div>
        </div>
        <div class="row items-center q-gutter-sm">
          <q-chip dense square :color="whatsappColor" text-color="white" :icon="whatsappIcon">
            {{ whatsappLabel }}
          </q-chip>
          <q-btn flat dense no-caps icon="mdi-logout" label="Sair" @click="logout" />
        </div>
      </header>

      <q-tabs v-model="tab" dense align="left" class="ops-tabs" active-color="primary" indicator-color="secondary">
        <q-tab name="sellers" icon="mdi-account-tie" label="Vendedores" />
        <q-tab name="whatsapp" icon="mdi-qrcode-scan" label="WhatsApp" />
        <q-tab name="logs" icon="mdi-console" label="Logs" />
        <q-tab name="config" icon="mdi-robot-outline" label="Configuracao da IA" />
      </q-tabs>

      <q-tab-panels v-model="tab" animated class="ops-panels">
        <q-tab-panel name="sellers" class="q-pa-none">
          <section class="ops-section">
            <div class="ops-section-head">
              <div>
                <div class="text-subtitle1 text-weight-bold">Vendedores</div>
                <div class="text-caption text-grey-7">Cadastro, login, status e senha dos atendentes.</div>
              </div>
              <q-btn unelevated no-caps class="ops-primary-btn" icon="mdi-account-plus" label="Novo vendedor" @click="openSellerDialog()" />
            </div>

            <div class="row q-col-gutter-sm q-mb-md">
              <div class="col-12 col-md-5">
                <q-input v-model="sellerSearch" outlined dense debounce="350" label="Buscar vendedor" clearable @update:model-value="loadSellers">
                  <template #prepend><q-icon name="mdi-magnify" /></template>
                </q-input>
              </div>
            </div>

            <q-table
              flat
              bordered
              row-key="id"
              class="ops-table"
              :rows="sellers"
              :columns="sellerColumns"
              :loading="loading.sellers"
              no-data-label="Nenhum vendedor cadastrado"
            >
              <template #body-cell-active="props">
                <q-td :props="props">
                  <q-toggle :model-value="props.row.active" color="positive" @update:model-value="toggleSeller(props.row, $event)" />
                </q-td>
              </template>

              <template #body-cell-actions="props">
                <q-td :props="props">
                  <q-btn dense flat round icon="mdi-pencil" @click="openSellerDialog(props.row)">
                    <q-tooltip>Editar</q-tooltip>
                  </q-btn>
                  <q-btn dense flat round icon="mdi-lock-reset" @click="openPasswordDialog(props.row)">
                    <q-tooltip>Alterar senha</q-tooltip>
                  </q-btn>
                  <q-btn dense flat round color="negative" icon="mdi-delete-outline" @click="deleteSeller(props.row)">
                    <q-tooltip>Excluir</q-tooltip>
                  </q-btn>
                </q-td>
              </template>
            </q-table>
          </section>
        </q-tab-panel>

        <q-tab-panel name="whatsapp" class="q-pa-none">
          <section class="ops-section">
            <div class="ops-section-head">
              <div>
                <div class="text-subtitle1 text-weight-bold">Autenticacao WhatsApp</div>
                <div class="text-caption text-grey-7">Uma unica sessao alimenta todos os vendedores logados.</div>
              </div>
              <div class="row q-gutter-sm">
                <q-btn unelevated no-caps class="ops-primary-btn" icon="mdi-qrcode-scan" label="Gerar QR" :loading="loading.whatsapp" @click="connectWhatsapp" />
                <q-btn outline no-caps icon="mdi-refresh" label="Reconectar" :loading="loading.whatsapp" @click="reconnectWhatsapp" />
                <q-btn outline no-caps color="negative" icon="mdi-power" label="Desconectar" :loading="loading.whatsapp" @click="disconnectWhatsapp" />
              </div>
            </div>

            <div class="whatsapp-grid">
              <div class="ops-card">
                <div class="text-caption text-grey-7">Status atual</div>
                <div class="row items-center q-gutter-sm q-mt-sm">
                  <q-icon :name="whatsappIcon" size="28px" :color="whatsappColor" />
                  <div>
                    <div class="text-h6 text-weight-bold">{{ whatsappLabel }}</div>
                    <div class="text-caption text-grey-7">{{ whatsappStatus.connectedPhone || 'Nenhum numero conectado' }}</div>
                  </div>
                </div>
                <q-banner v-if="whatsappStatus.lastError" class="q-mt-md bg-orange-1 text-orange-10">
                  {{ whatsappStatus.lastError }}
                </q-banner>
              </div>

              <div class="ops-card qr-card">
                <img v-if="whatsappStatus.qrCode" :src="whatsappStatus.qrCode" alt="QR Code WhatsApp" class="qr-image">
                <div v-else class="empty-qr">
                  <q-icon name="mdi-qrcode" size="54px" color="grey-5" />
                  <div class="text-caption text-grey-7 q-mt-sm">QR Code aparece aqui quando a sessao solicitar autenticacao.</div>
                </div>
              </div>
            </div>

            <div class="ops-card q-mt-md">
              <div class="row items-center justify-between q-mb-sm">
                <div>
                  <div class="text-subtitle2 text-weight-bold">Simular mensagem</div>
                  <div class="text-caption text-grey-7">Util para testar UI, IA e cooldown sem conectar o WhatsApp real.</div>
                </div>
                <q-btn dense outline no-caps icon="mdi-send" label="Enviar mock" :loading="loading.mock" @click="sendMock" />
              </div>
              <div class="row q-col-gutter-sm">
                <div class="col-12 col-md-3"><q-input v-model="mock.phone" dense outlined label="Telefone" /></div>
                <div class="col-12 col-md-3"><q-input v-model="mock.name" dense outlined label="Nome" /></div>
                <div class="col-12 col-md-6"><q-input v-model="mock.content" dense outlined label="Mensagem" /></div>
              </div>
            </div>
          </section>
        </q-tab-panel>

        <q-tab-panel name="logs" class="q-pa-none">
          <section class="ops-section">
            <div class="ops-section-head">
              <div>
                <div class="text-subtitle1 text-weight-bold">Logs administrativos</div>
                <div class="text-caption text-grey-7">Eventos de WhatsApp, IA, vendedores, cooldown e erros.</div>
              </div>
              <q-btn outline no-caps icon="mdi-refresh" label="Atualizar" @click="loadLogs" />
            </div>

            <div class="console">
              <div v-for="log in logs" :key="log._id || `${log.type}-${log.timestamp}`" class="console-line">
                <span class="console-time">{{ formatDate(log.timestamp || log.createdAt) }}</span>
                <span class="console-level" :class="`level-${log.level}`">{{ log.level || 'info' }}</span>
                <span class="console-type">{{ log.type }}</span>
                <span class="console-message">{{ log.message }}</span>
              </div>
            </div>
          </section>
        </q-tab-panel>

        <q-tab-panel name="config" class="q-pa-none">
          <q-form class="ops-section" @submit="saveConfig">
            <div class="ops-section-head">
              <div>
                <div class="text-subtitle1 text-weight-bold">Configuracao da IA</div>
                <div class="text-caption text-grey-7">Prompt, contexto, cooldown e televendas sem redeploy.</div>
              </div>
              <q-btn unelevated no-caps class="ops-primary-btn" icon="mdi-content-save" label="Salvar configuracao" type="submit" :loading="loading.config" />
            </div>

            <div class="config-grid">
              <q-input v-model="aiConfig.virtualPrefix" outlined dense label="Prefixo da IA" />
              <q-input v-model.number="aiConfig.cooldownSeconds" outlined dense type="number" label="Cooldown da IA em segundos" />
              <q-input v-model.number="aiConfig.contextMessages" outlined dense type="number" label="Mensagens de contexto" />
              <q-input v-model="aiConfig.televendasOption" outlined dense label="Opcao de televendas" />
              <q-input v-model="aiConfig.televendasNumber" outlined dense label="WhatsApp televendas" />
              <q-toggle v-model="aiConfig.televendasEnabled" color="positive" label="Televendas ativo" />
            </div>

            <q-input v-model="aiConfig.initialMessage" outlined type="textarea" autogrow label="Mensagem inicial automatica" class="q-mt-md" />
            <q-input v-model="aiConfig.televendasRedirectText" outlined type="textarea" autogrow label="Texto de redirecionamento para televendas" class="q-mt-md" />
            <q-input v-model="aiConfig.basePrompt" outlined type="textarea" autogrow label="Prompt base" class="q-mt-md" />
            <q-input v-model="aiConfig.metadata" outlined type="textarea" autogrow label="Metadata dinamica enviada para a IA" class="q-mt-md" />
            <q-input v-model="aiConfig.additionalRules" outlined type="textarea" autogrow label="Regras adicionais" class="q-mt-md" />
          </q-form>
        </q-tab-panel>
      </q-tab-panels>
    </div>

    <q-dialog v-model="sellerDialog">
      <q-card class="dialog-card">
        <q-card-section>
          <div class="text-subtitle1 text-weight-bold">{{ sellerForm.id ? 'Editar vendedor' : 'Novo vendedor' }}</div>
        </q-card-section>
        <q-form @submit="saveSeller">
          <q-card-section class="q-gutter-sm">
            <q-input v-model="sellerForm.name" outlined dense label="Nome" />
            <q-input v-model="sellerForm.email" outlined dense label="Email/login" type="email" />
            <q-input v-model="sellerForm.phone" outlined dense label="Telefone" />
            <q-input v-if="!sellerForm.id" v-model="sellerForm.password" outlined dense label="Senha inicial" type="password" />
            <q-toggle v-model="sellerForm.active" color="positive" label="Ativo" />
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat no-caps label="Cancelar" v-close-popup />
            <q-btn unelevated no-caps class="ops-primary-btn" label="Salvar" type="submit" :loading="loading.sellerSave" />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>

    <q-dialog v-model="passwordDialog">
      <q-card class="dialog-card">
        <q-card-section>
          <div class="text-subtitle1 text-weight-bold">Alterar senha</div>
          <div class="text-caption text-grey-7">{{ passwordTarget?.name }}</div>
        </q-card-section>
        <q-form @submit="savePassword">
          <q-card-section>
            <q-input v-model="newPassword" outlined dense label="Nova senha" type="password" />
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat no-caps label="Cancelar" v-close-popup />
            <q-btn unelevated no-caps class="ops-primary-btn" label="Alterar" type="submit" />
          </q-card-actions>
        </q-form>
      </q-card>
        </q-dialog>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { api, apiBaseURL } from 'boot/axios'

export default {
  name: 'AdminPanelPage',
  data () {
    return {
      tab: 'sellers',
      token: localStorage.getItem('aito_admin_token'),
      sellerSearch: '',
      sellers: [],
      sellerDialog: false,
      passwordDialog: false,
      passwordTarget: null,
      newPassword: '',
      sellerForm: this.emptySellerForm(),
      sellerColumns: [
        { name: 'name', label: 'Nome', align: 'left', field: 'name', sortable: true },
        { name: 'email', label: 'Login', align: 'left', field: 'email', sortable: true },
        { name: 'phone', label: 'Telefone', align: 'left', field: 'phone' },
        { name: 'active', label: 'Ativo', align: 'center', field: 'active' },
        { name: 'lastLoginAt', label: 'Ultimo login', align: 'left', field: row => this.formatDate(row.lastLoginAt) },
        { name: 'actions', label: '', align: 'right' }
      ],
      whatsappStatus: {},
      logs: [],
      aiConfig: {},
      mock: {
        phone: '5562999999999',
        name: 'Cliente Teste',
        content: 'Tem furadeira em promocao?'
      },
      loading: {
        sellers: false,
        sellerSave: false,
        whatsapp: false,
        config: false,
        mock: false
      },
      eventSource: null
    }
  },
  computed: {
    headers () {
      return { Authorization: `Bearer ${this.token}` }
    },
    whatsappLabel () {
      const labels = {
        online: 'Online',
        offline: 'Offline',
        waiting_qr: 'Aguardando QR',
        authenticating: 'Autenticando',
        error: 'Erro'
      }
      return labels[this.whatsappStatus.status] || 'Offline'
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
      const icons = {
        online: 'mdi-whatsapp',
        waiting_qr: 'mdi-qrcode-scan',
        authenticating: 'mdi-sync',
        error: 'mdi-alert-circle-outline'
      }
      return icons[this.whatsappStatus.status] || 'mdi-whatsapp'
    }
  },
  mounted () {
    if (!this.token) {
      this.$router.push('/admin/login')
      return
    }
    this.loadAll()
    this.connectEvents()
  },
  beforeUnmount () {
    if (this.eventSource) this.eventSource.close()
  },
  methods: {
    emptySellerForm () {
      return { id: null, name: '', email: '', phone: '', password: '', active: true }
    },
    async request (method, url, payload) {
      return api.request({ method, url, data: payload, headers: this.headers })
    },
    async loadAll () {
      await Promise.all([this.loadSellers(), this.loadWhatsapp(), this.loadLogs(), this.loadConfig()])
    },
    async loadSellers () {
      this.loading.sellers = true
      try {
        const { data } = await api.get('/admin/sellers', { params: { q: this.sellerSearch }, headers: this.headers })
        this.sellers = data.data
      } finally {
        this.loading.sellers = false
      }
    },
    async loadWhatsapp () {
      const { data } = await api.get('/admin/whatsapp/status', { headers: this.headers })
      this.whatsappStatus = data.data || {}
    },
    async loadLogs () {
      const { data } = await api.get('/admin/logs', { params: { limit: 180 }, headers: this.headers })
      this.logs = data.data || []
    },
    async loadConfig () {
      const { data } = await api.get('/admin/ai-config', { headers: this.headers })
      this.aiConfig = data.data || {}
    },
    openSellerDialog (seller = null) {
      this.sellerForm = seller ? { ...seller, id: seller.id || seller._id, password: '' } : this.emptySellerForm()
      this.sellerDialog = true
    },
    async saveSeller () {
      this.loading.sellerSave = true
      try {
        if (this.sellerForm.id) {
          await this.request('put', `/admin/sellers/${this.sellerForm.id}`, this.sellerForm)
        } else {
          await this.request('post', '/admin/sellers', this.sellerForm)
        }
        this.sellerDialog = false
        await this.loadSellers()
      } catch (error) {
        this.$q.notify({ type: 'negative', message: error.response?.data?.message || 'Nao foi possivel salvar.' })
      } finally {
        this.loading.sellerSave = false
      }
    },
    async toggleSeller (seller, active) {
      await this.request('patch', `/admin/sellers/${seller.id || seller._id}/status`, { active })
      await this.loadSellers()
    },
    openPasswordDialog (seller) {
      this.passwordTarget = seller
      this.newPassword = ''
      this.passwordDialog = true
    },
    async savePassword () {
      await this.request('patch', `/admin/sellers/${this.passwordTarget.id || this.passwordTarget._id}/password`, { password: this.newPassword })
      this.passwordDialog = false
      this.$q.notify({ type: 'positive', message: 'Senha alterada.' })
    },
    deleteSeller (seller) {
      this.$q.dialog({
        title: 'Excluir vendedor',
        message: `Remover ${seller.name}?`,
        cancel: true,
        persistent: true
      }).onOk(async () => {
        await this.request('delete', `/admin/sellers/${seller.id || seller._id}`)
        await this.loadSellers()
      })
    },
    async connectWhatsapp () {
      this.loading.whatsapp = true
      try {
        const { data } = await this.request('post', '/admin/whatsapp/connect')
        this.whatsappStatus = data.data
      } finally {
        this.loading.whatsapp = false
      }
    },
    async reconnectWhatsapp () {
      this.loading.whatsapp = true
      try {
        const { data } = await this.request('post', '/admin/whatsapp/reconnect')
        this.whatsappStatus = data.data
      } finally {
        this.loading.whatsapp = false
      }
    },
    async disconnectWhatsapp () {
      this.loading.whatsapp = true
      try {
        const { data } = await this.request('post', '/admin/whatsapp/disconnect')
        this.whatsappStatus = data.data
      } finally {
        this.loading.whatsapp = false
      }
    },
    async saveConfig () {
      this.loading.config = true
      try {
        const { data } = await this.request('put', '/admin/ai-config', this.aiConfig)
        this.aiConfig = data.data
        this.$q.notify({ type: 'positive', message: 'Configuracao salva.' })
      } finally {
        this.loading.config = false
      }
    },
    async sendMock () {
      this.loading.mock = true
      try {
        await this.request('post', '/admin/whatsapp/mock-message', this.mock)
        this.$q.notify({ type: 'positive', message: 'Mensagem mock enviada.' })
      } catch (error) {
        this.$q.notify({ type: 'negative', message: error.response?.data?.message || 'Falha no mock.' })
      } finally {
        this.loading.mock = false
      }
    },
    connectEvents () {
      const url = new URL(`${apiBaseURL.replace(/\/$/, '')}/events`, window.location.origin)
      url.searchParams.set('token', this.token)
      this.eventSource = new EventSource(url.toString())
      this.eventSource.addEventListener('admin.log', (event) => {
        const packet = JSON.parse(event.data)
        this.logs.push(packet.payload)
        this.logs = this.logs.slice(-220)
      })
      this.eventSource.addEventListener('whatsapp.status', (event) => {
        const packet = JSON.parse(event.data)
        this.whatsappStatus = packet.payload
      })
    },
    formatDate (value) {
      if (!value) return '-'
      return new Date(value).toLocaleString('pt-BR')
    },
    logout () {
      localStorage.removeItem('aito_admin_token')
      localStorage.removeItem('aito_admin_user')
      this.$router.push('/admin/login')
    }
  }
}
</script>

<style scoped>
.ops-page {
  min-height: 100vh;
  background: #f5f7fa;
  color: #0b1220;
}

.ops-shell {
  width: min(1220px, calc(100vw - 24px));
  margin: 0 auto;
  padding: 18px 0 32px;
}

.ops-header,
.ops-section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.ops-header {
  padding: 14px 0 16px;
}

.ops-tabs {
  background: white;
  border: 1px solid #dce3ea;
  border-radius: 8px 8px 0 0;
}

.ops-panels {
  border: 1px solid #dce3ea;
  border-top: 0;
  border-radius: 0 0 8px 8px;
  background: white;
}

.ops-section {
  padding: 18px;
}

.ops-section-head {
  margin-bottom: 16px;
}

.ops-primary-btn {
  background: #0b1220;
  color: white;
  border-radius: 8px;
}

.ops-table,
.ops-card,
.dialog-card {
  border-radius: 8px;
}

.ops-card {
  border: 1px solid #dce3ea;
  background: #ffffff;
  padding: 16px;
}

.whatsapp-grid {
  display: grid;
  grid-template-columns: minmax(240px, 1fr) minmax(260px, 360px);
  gap: 16px;
}

.qr-card {
  min-height: 260px;
  display: grid;
  place-items: center;
}

.qr-image {
  width: min(280px, 100%);
  border: 1px solid #dce3ea;
  border-radius: 8px;
}

.empty-qr {
  text-align: center;
  max-width: 260px;
}

.console {
  min-height: 520px;
  max-height: 65vh;
  overflow: auto;
  background: #07111f;
  color: #d8e8f4;
  border-radius: 8px;
  padding: 12px;
  font-family: Consolas, Monaco, monospace;
  font-size: 12px;
}

.console-line {
  display: grid;
  grid-template-columns: 150px 58px 160px 1fr;
  gap: 10px;
  padding: 4px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.console-level {
  text-transform: uppercase;
  color: #8cc8ff;
}

.level-error {
  color: #ff9d9d;
}

.level-warn {
  color: #ffd27a;
}

.console-type {
  color: #7ee0c5;
}

.config-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(180px, 1fr));
  gap: 12px;
}

.dialog-card {
  width: min(520px, calc(100vw - 32px));
}

@media (max-width: 820px) {
  .ops-header,
  .ops-section-head {
    align-items: flex-start;
    flex-direction: column;
  }

  .whatsapp-grid,
  .config-grid {
    grid-template-columns: 1fr;
  }

  .console-line {
    grid-template-columns: 1fr;
    gap: 2px;
  }
}
</style>
