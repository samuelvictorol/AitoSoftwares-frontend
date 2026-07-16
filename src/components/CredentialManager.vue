<template>
  <section class="credentials-module portal-module">
    <div class="portal-module__head">
      <div><span class="portal-module__eyebrow">Credenciais</span><p>{{ admin ? '' : '' }}</p></div>
      <q-btn v-if="admin" unelevated no-caps class="portal-module__primary" icon="mdi-plus" label="Nova credencial" @click="openCreate" />
    </div>

    <div v-if="admin" class="credentials-module__filters">
      <q-input v-model="search" outlined dense clearable label="Buscar titulo, descricao ou link" @keyup.enter="load" />
      <q-btn flat round icon="mdi-magnify" aria-label="Buscar credenciais" :loading="loading" @click="load"><q-tooltip>Buscar</q-tooltip></q-btn>
    </div>

    <q-table flat bordered wrap-cells row-key="_id" class="portal-module__table" :rows="credentials" :columns="columns" :loading="loading" no-data-label="Nenhuma credencial encontrada">
      <template #body-cell-targetUser="props"><q-td :props="props">{{ props.row.targetUser?.name || '-' }}</q-td></template>
      <template #body-cell-project="props"><q-td :props="props">{{ props.row.projectId?.title || '-' }}</q-td></template>
      <template #body-cell-description="props"><q-td :props="props"><span class="credentials-module__description">{{ preview(props.row.description) }}</span></q-td></template>
      <template #body-cell-link="props"><q-td :props="props"><a v-if="props.row.link" :href="props.row.link" target="_blank" rel="noopener noreferrer" class="portal-module__link"><q-icon name="mdi-open-in-new" /> Abrir</a><span v-else>-</span></q-td></template>
      <template #body-cell-updatedAt="props"><q-td :props="props">{{ formatDate(props.row.updatedAt) }}</q-td></template>
      <template #body-cell-actions="props"><q-td :props="props"><q-btn flat round dense icon="mdi-eye-outline" aria-label="Ver descricao da credencial" @click="openDetails(props.row)"><q-tooltip>Ver detalhes</q-tooltip></q-btn><q-btn v-if="admin" flat round dense icon="mdi-pencil" aria-label="Editar credencial" @click="openEdit(props.row)" /><q-btn v-if="admin" flat round dense color="negative" icon="mdi-delete-outline" aria-label="Excluir credencial" @click="remove(props.row)" /></q-td></template>
    </q-table>

    <q-dialog v-model="dialog">
      <q-card class="portal-module__dialog">
        <q-card-section class="portal-module__dialog-head"><div><span class="portal-module__eyebrow">Cliente</span><h3>{{ form._id ? 'Editar credencial' : 'Cadastrar credencial' }}</h3></div><q-btn flat round dense icon="mdi-close" aria-label="Fechar" @click="dialog = false" /></q-card-section>
        <q-card-section>
          <q-form @submit.prevent="save">
            <q-select v-model="form.targetUserId" outlined label="Cliente" :options="customerOptions" emit-value map-options :rules="[requiredRule]" />
            <q-select v-if="!projectId" v-model="form.projectId" outlined clearable label="Projeto" :options="projectOptions" emit-value map-options class="q-mt-sm" />
            <q-input v-model="form.title" outlined label="Titulo" class="q-mt-sm" :rules="[requiredRule]" />
            <q-input v-model="form.description" outlined type="textarea" autogrow label="Descricao" class="q-mt-sm" />
            <q-input v-model="form.link" outlined type="url" label="Link" class="q-mt-sm" hint="Pode ser um painel, ambiente ou documentacao." />
            <q-btn unelevated no-caps class="portal-module__primary full-width q-mt-md" type="submit" label="Salvar credencial" :loading="saving" />
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="detailDialog">
      <q-card class="portal-module__dialog">
        <q-card-section class="portal-module__dialog-head"><div><span class="portal-module__eyebrow">Detalhes da credencial</span><h3>{{ selectedDetail.title || 'Credencial' }}</h3></div><q-btn flat round dense icon="mdi-close" aria-label="Fechar" @click="detailDialog = false" /></q-card-section>
        <q-card-section class="credentials-module__detail-body"><p>{{ selectedDetail.description || 'Sem descricao cadastrada.' }}</p><a v-if="selectedDetail.link" :href="selectedDetail.link" target="_blank" rel="noopener noreferrer" class="portal-module__link">Abrir link</a></q-card-section>
      </q-card>
    </q-dialog>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'

const props = defineProps({ admin: { type: Boolean, default: false }, projectId: { type: String, default: '' }, project: { type: Object, default: null } })
const projectId = props.projectId
const $q = useQuasar()
const token = localStorage.getItem(props.admin ? 'aito_admin_token' : 'aito_user_token')
const headers = { Authorization: `Bearer ${token}` }
const credentials = ref([])
const customers = ref([])
const projects = ref([])
const loading = ref(false)
const saving = ref(false)
const dialog = ref(false)
const detailDialog = ref(false)
const search = ref('')
const form = ref(emptyForm())
const selectedDetail = ref({})
const projectClientIds = computed(() => (props.project?.clients || []).map((item) => item.id || item._id || item))
const customerOptions = computed(() => customers.value.filter((item) => !projectId || !projectClientIds.value.length || projectClientIds.value.includes(item._id)).map((item) => ({ label: `${item.name} - ${item.email}`, value: item._id })))
const projectOptions = computed(() => projects.value.filter((item) => { const clients = item.clients?.length ? item.clients : (item.client ? [item.client] : []); return !form.value.targetUserId || clients.some((client) => (client.id || client._id || client) === form.value.targetUserId) }).map((item) => ({ label: item.title, value: item._id })))
const columns = computed(() => props.admin
  ? [
      { name: 'title', label: 'Titulo', field: 'title', align: 'left', sortable: true },
      { name: 'targetUser', label: 'Cliente', field: row => row.targetUser?.name || '-', align: 'left' },
      { name: 'project', label: 'Projeto', field: row => row.projectId?.title || '-', align: 'left' },
      { name: 'description', label: 'Descricao', field: 'description', align: 'left' },
      { name: 'link', label: 'Link', field: 'link', align: 'left' },
      { name: 'updatedAt', label: 'Atualizado', field: 'updatedAt', align: 'left' },
      { name: 'actions', label: '', align: 'right' },
    ]
  : [
      { name: 'title', label: 'Titulo', field: 'title', align: 'left', sortable: true },
      { name: 'project', label: 'Projeto', field: row => row.projectId?.title || '-', align: 'left' },
      { name: 'description', label: 'Descricao', field: 'description', align: 'left' },
      { name: 'link', label: 'Link', field: 'link', align: 'left' },
      { name: 'updatedAt', label: 'Atualizado', field: 'updatedAt', align: 'left' },
      { name: 'actions', label: '', align: 'right' },
    ])

function emptyForm() { return { _id: '', targetUserId: '', projectId, title: '', description: '', link: '' } }
function requiredRule(value) { return Boolean(String(value || '').trim()) || 'Preencha este campo.' }
function formatDate(value) { return value ? new Date(value).toLocaleDateString('pt-BR') : '-' }
function preview(value) { const text = String(value || '').trim(); return text.length > 48 ? `${text.slice(0, 48)}...` : text || '-' }
function openCreate() { form.value = emptyForm(); dialog.value = true }
function openEdit(item) { form.value = { ...emptyForm(), ...item, targetUserId: item.targetUser?._id || item.targetUser?.id || '', projectId: projectId || item.projectId?._id || item.projectId?.id || '' }; dialog.value = true }
function openDetails(item) { selectedDetail.value = item; detailDialog.value = true }

async function load() {
  loading.value = true
  try {
    const response = await api.get(props.admin ? '/admin/credentials' : '/credentials', { headers, params: { ...(props.admin ? { q: search.value } : {}), projectId: projectId || undefined } })
    credentials.value = response.data.data || []
    if (props.admin) {
      const [customersResponse, projectsResponse] = await Promise.all([api.get('/admin/customers', { headers }), api.get('/admin/projects', { headers })])
      customers.value = customersResponse.data.data || []
      projects.value = projectsResponse.data.data || []
    }
  } catch (error) { notifyError(error) } finally { loading.value = false }
}

async function save() {
  saving.value = true
  try {
    const payload = { targetUserId: form.value.targetUserId, projectId: form.value.projectId || '', title: form.value.title, description: form.value.description, link: form.value.link }
    const endpoint = form.value._id ? `/admin/credentials/${form.value._id}` : '/admin/credentials'
    const response = form.value._id ? await api.put(endpoint, payload, { headers }) : await api.post(endpoint, payload, { headers })
    if (form.value._id) credentials.value = credentials.value.map((item) => item._id === form.value._id ? response.data.data : item)
    else credentials.value.unshift(response.data.data)
    dialog.value = false
    $q.notify({ type: 'positive', message: 'Credencial salva.' })
  } catch (error) { notifyError(error) } finally { saving.value = false }
}

function remove(item) {
  $q.dialog({ title: 'Excluir credencial', message: `Remover ${item.title}?`, cancel: true, persistent: true }).onOk(async () => {
    try {
      await api.delete(`/admin/credentials/${item._id}`, { headers })
      credentials.value = credentials.value.filter((credential) => credential._id !== item._id)
      $q.notify({ type: 'positive', message: 'Credencial removida.' })
    } catch (error) { notifyError(error) }
  })
}

function notifyError(error) { $q.notify({ type: 'negative', message: error.response?.data?.message || 'Nao foi possivel concluir a credencial.' }) }
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
.portal-module__link { color: #8fffee; text-decoration: none; }
.portal-module__dialog { width: min(94vw, 560px); color: #effffb; background: #061819; border: 1px solid rgba(19,188,157,.3); }
.portal-module__dialog-head { display: flex; align-items: flex-start; justify-content: space-between; gap: .8rem; }
.portal-module__dialog h3 { margin: .4rem 0 0; font-size: 1.15rem; }
.portal-module__dialog :deep(.q-field__control) { color: #effffb; background: rgba(7,40,40,.74); }
.portal-module__dialog :deep(.q-field__native), .portal-module__dialog :deep(.q-field__label) { color: rgba(239,255,251,.8); }
.credentials-module__filters { display: grid; grid-template-columns: minmax(220px, 1fr) auto; gap: .6rem; }
.credentials-module__filters :deep(.q-field__control) { color: #effffb; background: rgba(7,40,40,.74); }
.credentials-module__filters :deep(.q-field__native), .credentials-module__filters :deep(.q-field__label) { color: rgba(239,255,251,.8); }
.credentials-module__description { display: inline-block; max-width: 26rem; white-space: normal; }
.credentials-module__detail-body { display: grid; gap: .8rem; color: rgba(239,255,251,.82); }
.credentials-module__detail-body p { margin: 0; white-space: pre-wrap; line-height: 1.6; }
@media (max-width: 700px) { .portal-module__head { align-items: flex-start; flex-direction: column; } .portal-module__primary { width: 100%; } .portal-module__table { max-width: calc(100vw - 2rem); overflow: auto; } .credentials-module__filters { grid-template-columns: 1fr; } }
</style>
