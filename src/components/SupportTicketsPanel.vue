<template>
  <section class="portal-module tickets-panel">
    <div class="portal-module__head">
      <div>
        <span class="portal-module__eyebrow">{{ admin ? 'Operacao' : 'Suporte' }}</span>
        <h2>{{ admin ? 'Chamados de suporte' : 'Meus chamados' }}</h2>
        <p>{{ admin ? 'Acompanhe e direcione chamados de usuarios e clientes.' : 'Abra chamados objetivos e acompanhe cada atualizacao.' }}</p>
      </div>
      <q-btn unelevated no-caps class="portal-module__primary" icon="mdi-plus" :label="admin ? 'Novo chamado' : 'Abrir chamado'" :disable="!admin && activeCount >= 2" @click="openCreate" />
    </div>

    <div v-if="!admin" class="tickets-panel__notice">
      <q-icon name="mdi-information-outline" />
      <span>{{ activeCount }}/2 chamados ativos. Resolvidos e fechados liberam novos chamados.</span>
    </div>

    <div v-if="!admin && notifications.length" class="tickets-panel__notifications">
      <div class="tickets-panel__subhead"><strong>Notificacoes</strong><q-btn flat round dense icon="mdi-refresh" aria-label="Atualizar notificacoes" @click="loadNotifications" /></div>
      <button v-for="notification in notifications" :key="notification._id" class="tickets-panel__notification" :class="{ 'is-read': notification.read }" type="button" @click="markRead(notification)">
        <q-icon :name="notification.read ? 'mdi-email-open-outline' : 'mdi-email-outline'" />
        <span><strong>{{ notification.title }}</strong><small>{{ notification.message }}</small></span>
      </button>
    </div>

    <div v-if="admin" class="tickets-panel__filters">
      <q-input v-model="search" outlined dense clearable label="Buscar titulo ou descricao" @keyup.enter="load" />
      <q-select v-model="filterStatus" outlined dense clearable label="Status" :options="statusOptions" emit-value map-options @update:model-value="load" />
      <q-select v-model="filterType" outlined dense clearable label="Tipo" :options="typeOptions" emit-value map-options @update:model-value="load" />
      <q-btn flat round icon="mdi-magnify" aria-label="Buscar chamados" :loading="loading" @click="load"><q-tooltip>Buscar</q-tooltip></q-btn>
    </div>

    <q-table flat bordered wrap-cells row-key="_id" class="portal-module__table" :rows="tickets" :columns="columns" :loading="loading" no-data-label="Nenhum chamado encontrado">
      <template #body-cell-targetUser="props"><q-td :props="props">{{ props.row.targetUser?.name || 'Meu chamado' }}</q-td></template>
      <template #body-cell-status="props"><q-td :props="props"><span class="portal-module__tag">{{ statusLabel(props.row.status) }}</span></q-td></template>
      <template #body-cell-type="props"><q-td :props="props">{{ typeLabel(props.row.type) }}</q-td></template>
      <template #body-cell-createdAt="props"><q-td :props="props">{{ formatDate(props.row.createdAt) }}</q-td></template>
      <template #body-cell-actions="props"><q-td :props="props"><q-btn flat round dense icon="mdi-pencil" aria-label="Editar chamado" @click="openEdit(props.row)" /><q-btn v-if="admin" flat round dense color="negative" icon="mdi-delete-outline" aria-label="Excluir chamado" @click="remove(props.row)" /></q-td></template>
    </q-table>

    <q-dialog v-model="dialog">
      <q-card class="portal-module__dialog">
        <q-card-section class="portal-module__dialog-head"><div><span class="portal-module__eyebrow">{{ admin ? 'Chamado interno' : 'Atendimento' }}</span><h3>{{ form._id ? 'Editar chamado' : 'Abrir chamado' }}</h3></div><q-btn flat round dense icon="mdi-close" aria-label="Fechar" @click="dialog = false" /></q-card-section>
        <q-card-section>
          <q-form @submit.prevent="save">
            <q-select v-if="admin" v-model="form.targetUserId" outlined label="Vincular a usuario ou cliente" :options="targetOptions" emit-value map-options :rules="[requiredRule]" />
            <q-input v-model="form.title" outlined label="Titulo" class="q-mt-sm" :rules="[requiredRule]" />
            <q-select v-if="admin" v-model="form.status" outlined label="Status" class="q-mt-sm" :options="statusOptions" emit-value map-options />
            <q-select v-model="form.type" outlined label="Tipo" class="q-mt-sm" :options="typeOptions" emit-value map-options />
            <q-input v-model="form.description" outlined type="textarea" autogrow label="Descricao" class="q-mt-sm" :rules="[requiredRule]" />
            <q-btn unelevated no-caps class="portal-module__primary full-width q-mt-md" type="submit" label="Salvar chamado" :loading="saving" />
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'

const props = defineProps({ admin: { type: Boolean, default: false } })
const $q = useQuasar()
const token = localStorage.getItem(props.admin ? 'aito_admin_token' : 'aito_user_token')
const headers = { headers: { Authorization: `Bearer ${token}` } }
const tickets = ref([])
const notifications = ref([])
const targets = ref([])
const loading = ref(false)
const saving = ref(false)
const dialog = ref(false)
const form = ref(emptyForm())
const search = ref('')
const filterStatus = ref('')
const filterType = ref('')

const statusOptions = [
  { label: 'Aberto', value: 'open' },
  { label: 'Em andamento', value: 'in_progress' },
  { label: 'Resolvido', value: 'resolved' },
  { label: 'Fechado', value: 'closed' },
]
const typeOptions = [
  { label: 'Suporte', value: 'support' },
  { label: 'Bug', value: 'bug' },
  { label: 'Acesso', value: 'access' },
  { label: 'Financeiro', value: 'financial' },
  { label: 'Projeto', value: 'project' },
  { label: 'Outro', value: 'other' },
]
const targetOptions = computed(() => targets.value.map((item) => ({ label: `${item.name} - ${item.role === 'customer' ? 'cliente' : 'usuario'}`, value: item._id })))
const activeCount = computed(() => tickets.value.filter((item) => ['open', 'in_progress'].includes(item.status)).length)
const columns = computed(() => props.admin
  ? [
      { name: 'title', label: 'Titulo', field: 'title', align: 'left', sortable: true },
      { name: 'targetUser', label: 'Vinculado a', field: row => row.targetUser?.name || '-', align: 'left' },
      { name: 'type', label: 'Tipo', field: 'type', align: 'left' },
      { name: 'status', label: 'Status', field: 'status', align: 'left' },
      { name: 'createdAt', label: 'Criado', field: 'createdAt', align: 'left' },
      { name: 'actions', label: '', align: 'right' },
    ]
  : [
      { name: 'title', label: 'Titulo', field: 'title', align: 'left', sortable: true },
      { name: 'type', label: 'Tipo', field: 'type', align: 'left' },
      { name: 'status', label: 'Status', field: 'status', align: 'left' },
      { name: 'createdAt', label: 'Criado', field: 'createdAt', align: 'left' },
      { name: 'actions', label: '', align: 'right' },
    ])

function emptyForm() { return { _id: '', targetUserId: '', title: '', status: 'open', type: 'support', description: '' } }
function requiredRule(value) { return Boolean(String(value || '').trim()) || 'Preencha este campo.' }
function formatDate(value) { return value ? new Date(value).toLocaleDateString('pt-BR') : '-' }
function statusLabel(value) { return statusOptions.find((item) => item.value === value)?.label || value || '-' }
function typeLabel(value) { return typeOptions.find((item) => item.value === value)?.label || value || '-' }
function openCreate() { form.value = emptyForm(); if (!props.admin) form.value.targetUserId = undefined; dialog.value = true }
function openEdit(ticket) { form.value = { ...emptyForm(), ...ticket, targetUserId: ticket.targetUser?._id || ticket.targetUser?.id || '' }; dialog.value = true }
async function load() {
  if (!token) return
  loading.value = true
  try {
    const response = await api.get(props.admin ? '/admin/tickets' : '/tickets', { ...headers, params: props.admin ? { q: search.value, status: filterStatus.value, type: filterType.value } : undefined })
    tickets.value = response.data.data || []
    if (props.admin) {
      const [users, customers] = await Promise.all([api.get('/admin/users', headers), api.get('/admin/customers', headers)])
      targets.value = [...(users.data.data || []), ...(customers.data.data || [])]
    }
    if (!props.admin) await loadNotifications()
  } catch (error) { notifyError(error) } finally { loading.value = false }
}
async function loadNotifications() {
  try { const response = await api.get('/notifications', headers); notifications.value = response.data.data || [] } catch (error) { notifyError(error) }
}
async function markRead(notification) {
  if (!notification.read) {
    try { await api.patch(`/notifications/${notification._id}/read`, {}, headers); notification.read = true } catch (error) { notifyError(error) }
  }
}
async function save() {
  saving.value = true
  try {
    const endpoint = props.admin ? '/admin/tickets' : '/tickets'
    const response = form.value._id
      ? await api.put(`${endpoint}/${form.value._id}`, form.value, headers)
      : await api.post(endpoint, props.admin ? form.value : { title: form.value.title, type: form.value.type, description: form.value.description }, headers)
    if (form.value._id) tickets.value = tickets.value.map((item) => item._id === form.value._id ? response.data.data : item)
    else tickets.value.unshift(response.data.data)
    dialog.value = false
    $q.notify({ type: 'positive', message: 'Chamado salvo.' })
  } catch (error) { notifyError(error) } finally { saving.value = false }
}
function remove(ticket) {
  $q.dialog({ title: 'Excluir chamado', message: `Remover ${ticket.title}?`, cancel: true, persistent: true }).onOk(async () => {
    try { await api.delete(`/admin/tickets/${ticket._id}`, headers); tickets.value = tickets.value.filter((item) => item._id !== ticket._id); $q.notify({ type: 'positive', message: 'Chamado removido.' }) } catch (error) { notifyError(error) }
  })
}
function notifyError(error) { $q.notify({ type: 'negative', message: error.response?.data?.message || 'Nao foi possivel carregar os chamados.' }) }
onMounted(load)
</script>

<style scoped>
.portal-module { display: grid; gap: 1rem; color: #effffb; }
.portal-module__head { display: flex; align-items: flex-end; justify-content: space-between; gap: 1rem; }
.portal-module__eyebrow { color: #8fffee; font-size: .66rem; font-weight: 900; letter-spacing: .14em; text-transform: uppercase; }
.portal-module h2 { margin: .45rem 0 0; color: #effffb; font-size: clamp(1.5rem, 3vw, 2.5rem); }
.portal-module__head p { margin: .45rem 0 0; color: rgba(229,255,250,.62); font-size: .78rem; }
.portal-module__primary { color: #03110f; background: linear-gradient(135deg, #8fffee, #13bc9d); font-weight: 800; }
.portal-module__table { color: #effffb; border-color: rgba(19,188,157,.2); background: rgba(3,16,18,.6); }
.portal-module__table :deep(th) { color: #8fffee; font-size: .68rem; }
.portal-module__table :deep(td) { color: rgba(239,255,251,.78); font-size: .72rem; }
.portal-module__tag { padding: .25rem .45rem; border: 1px solid rgba(19,188,157,.28); border-radius: 999px; color: #8fffee; font-size: .62rem; }
.portal-module__dialog { width: min(94vw, 560px); color: #effffb; background: #061819; border: 1px solid rgba(19,188,157,.3); }
.portal-module__dialog-head { display: flex; align-items: flex-start; justify-content: space-between; gap: .8rem; }
.portal-module__dialog h3 { margin: .4rem 0 0; font-size: 1.15rem; }
.portal-module__dialog :deep(.q-field__control) { color: #effffb; background: rgba(7,40,40,.74); }
.portal-module__dialog :deep(.q-field__native), .portal-module__dialog :deep(.q-field__label) { color: rgba(239,255,251,.8); }
.tickets-panel__notice { display: flex; align-items: center; gap: .5rem; padding: .75rem .9rem; border: 1px solid rgba(19,188,157,.2); border-radius: .55rem; color: rgba(229,255,250,.68); background: rgba(19,188,157,.06); font-size: .73rem; }
.tickets-panel__notice .q-icon { color: #8fffee; }
.tickets-panel__notifications { display: grid; gap: .45rem; }
.tickets-panel__subhead { display: flex; align-items: center; justify-content: space-between; color: #8fffee; font-size: .75rem; }
.tickets-panel__subhead .q-btn { color: #8fffee; }
.tickets-panel__notification { display: flex; align-items: flex-start; gap: .55rem; padding: .7rem; border: 1px solid rgba(19,188,157,.24); border-radius: .55rem; color: #effffb; background: rgba(4,24,25,.68); text-align: left; cursor: pointer; }
.tickets-panel__notification.is-read { opacity: .58; }
.tickets-panel__notification .q-icon { color: #8fffee; }
.tickets-panel__notification span { display: grid; gap: .2rem; }
.tickets-panel__notification strong { font-size: .72rem; }
.tickets-panel__notification small { color: rgba(229,255,250,.62); font-size: .68rem; line-height: 1.4; }
.tickets-panel__filters { display: grid; grid-template-columns: minmax(220px, 1fr) 180px 180px auto; gap: .6rem; }
.tickets-panel__filters :deep(.q-field__control) { color: #effffb; background: rgba(7,40,40,.74); }
.tickets-panel__filters :deep(.q-field__native), .tickets-panel__filters :deep(.q-field__label) { color: rgba(239,255,251,.8); }
@media (max-width: 700px) { .portal-module__head { align-items: flex-start; flex-direction: column; } .portal-module__primary { width: 100%; } .portal-module__table { max-width: calc(100vw - 2rem); overflow: auto; } }
@media (max-width: 760px) { .tickets-panel__filters { grid-template-columns: 1fr; } }
</style>
