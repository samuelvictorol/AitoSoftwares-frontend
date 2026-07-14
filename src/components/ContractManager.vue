<template>
  <section class="contracts-module portal-module">
    <div class="portal-module__head">
      <div><span class="portal-module__eyebrow">{{ admin ? 'Operacao' : 'Documentos' }}</span><h2>{{ admin ? 'Contratos' : 'Meus contratos' }}</h2><p>{{ admin ? 'Crie e organize contratos por cliente.' : 'Visualize os documentos liberados para voce.' }}</p></div>
      <q-btn v-if="admin" unelevated no-caps class="portal-module__primary" icon="mdi-plus" label="Novo contrato" @click="openCreate" />
    </div>

    <div v-if="admin" class="contracts-module__filters"><q-input v-model="search" outlined dense clearable label="Buscar titulo, status ou descricao" @keyup.enter="load" /><q-btn flat round icon="mdi-magnify" aria-label="Buscar contratos" :loading="loading" @click="load"><q-tooltip>Buscar</q-tooltip></q-btn></div>

    <q-table flat bordered wrap-cells row-key="_id" class="portal-module__table" :rows="contracts" :columns="columns" :loading="loading" no-data-label="Nenhum contrato encontrado">
      <template #body-cell-targetUser="props"><q-td :props="props">{{ props.row.targetUser?.name || '-' }}</q-td></template>
      <template #body-cell-status="props"><q-td :props="props"><span class="portal-module__tag">{{ props.row.status }}</span></q-td></template>
      <template #body-cell-createdAt="props"><q-td :props="props">{{ formatDate(props.row.createdAt) }}</q-td></template>
      <template #body-cell-updatedAt="props"><q-td :props="props">{{ formatDate(props.row.updatedAt) }}</q-td></template>
      <template #body-cell-attachment="props"><q-td :props="props"><a v-if="props.row.attachment" :href="props.row.attachment.url" target="_blank" rel="noopener noreferrer" class="portal-module__link"><q-icon name="mdi-paperclip" /> Abrir</a><span v-else>-</span></q-td></template>
      <template #body-cell-actions="props"><q-td :props="props"><q-btn v-if="admin" flat round dense icon="mdi-pencil" aria-label="Editar contrato" @click="openEdit(props.row)" /><q-btn v-if="admin" flat round dense color="negative" icon="mdi-delete-outline" aria-label="Excluir contrato" @click="remove(props.row)" /></q-td></template>
    </q-table>

    <q-dialog v-model="dialog">
      <q-card class="portal-module__dialog">
        <q-card-section class="portal-module__dialog-head"><div><span class="portal-module__eyebrow">Documento</span><h3>{{ form._id ? 'Editar contrato' : 'Cadastrar contrato' }}</h3></div><q-btn flat round dense icon="mdi-close" aria-label="Fechar" @click="dialog = false" /></q-card-section>
        <q-card-section>
          <q-form @submit.prevent="save">
            <q-select v-model="form.targetUserId" outlined label="Cliente" :options="customerOptions" emit-value map-options :rules="[requiredRule]" />
            <q-input v-model="form.title" outlined label="Titulo" class="q-mt-sm" :rules="[requiredRule]" />
            <q-input v-model="form.status" outlined label="Status descritivo" class="q-mt-sm" :rules="[requiredRule]" />
            <q-input v-model="form.description" outlined type="textarea" autogrow label="Descricao" class="q-mt-sm" />
            <q-file v-model="form.file" outlined label="Anexo do contrato" accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.csv" class="q-mt-sm"><template #prepend><q-icon name="mdi-file-document-outline" /></template></q-file>
            <q-toggle v-if="form._id && form.attachment" v-model="form.removeAttachment" label="Remover anexo atual" color="negative" class="q-mt-sm" />
            <q-btn unelevated no-caps class="portal-module__primary full-width q-mt-md" type="submit" label="Salvar contrato" :loading="saving" />
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
const headers = { Authorization: `Bearer ${token}` }
const contracts = ref([])
const customers = ref([])
const loading = ref(false)
const saving = ref(false)
const dialog = ref(false)
const form = ref(emptyForm())
const search = ref('')
const customerOptions = computed(() => customers.value.map((item) => ({ label: `${item.name} - ${item.email}`, value: item._id })))
const columns = computed(() => props.admin
  ? [
      { name: 'title', label: 'Titulo', field: 'title', align: 'left', sortable: true },
      { name: 'targetUser', label: 'Cliente', field: row => row.targetUser?.name || '-', align: 'left' },
      { name: 'description', label: 'Descricao', field: 'description', align: 'left' },
      { name: 'status', label: 'Status', field: 'status', align: 'left' },
      { name: 'createdAt', label: 'Criado', field: 'createdAt', align: 'left' },
      { name: 'updatedAt', label: 'Editado', field: 'updatedAt', align: 'left' },
      { name: 'attachment', label: 'Anexo', field: 'attachment', align: 'left' },
      { name: 'actions', label: '', align: 'right' },
    ]
  : [
      { name: 'title', label: 'Titulo', field: 'title', align: 'left', sortable: true },
      { name: 'description', label: 'Descricao', field: 'description', align: 'left' },
      { name: 'status', label: 'Status', field: 'status', align: 'left' },
      { name: 'createdAt', label: 'Criado', field: 'createdAt', align: 'left' },
      { name: 'updatedAt', label: 'Editado', field: 'updatedAt', align: 'left' },
      { name: 'attachment', label: 'Anexo', field: 'attachment', align: 'left' },
    ])

function emptyForm() { return { _id: '', targetUserId: '', title: '', description: '', status: 'Em analise', attachment: null, file: null, removeAttachment: false } }
function requiredRule(value) { return Boolean(String(value || '').trim()) || 'Preencha este campo.' }
function formatDate(value) { return value ? new Date(value).toLocaleDateString('pt-BR') : '-' }
function selectedFile(value) { return value?.item ? value.item(0) : Array.isArray(value) ? value[0] : value }
function openCreate() { form.value = emptyForm(); dialog.value = true }
function openEdit(contract) { form.value = { ...emptyForm(), ...contract, targetUserId: contract.targetUser?._id || contract.targetUser?.id || '', file: null, removeAttachment: false }; dialog.value = true }
async function load() {
  loading.value = true
  try {
    const response = await api.get(props.admin ? '/admin/contracts' : '/contracts', { headers, params: props.admin ? { q: search.value } : undefined })
    contracts.value = response.data.data || []
    if (props.admin) { const responseCustomers = await api.get('/admin/customers', { headers }); customers.value = responseCustomers.data.data || [] }
  } catch (error) { notifyError(error) } finally { loading.value = false }
}
async function save() {
  saving.value = true
  try {
    const body = new FormData()
    body.append('targetUserId', form.value.targetUserId)
    body.append('title', form.value.title)
    body.append('status', form.value.status)
    body.append('description', form.value.description || '')
    if (form.value.removeAttachment) body.append('removeAttachment', 'true')
    const file = selectedFile(form.value.file)
    if (file) body.append('attachment', file)
    const endpoint = form.value._id ? `/admin/contracts/${form.value._id}` : '/admin/contracts'
    const response = form.value._id ? await api.put(endpoint, body, { headers }) : await api.post(endpoint, body, { headers })
    if (form.value._id) contracts.value = contracts.value.map((item) => item._id === form.value._id ? response.data.data : item)
    else contracts.value.unshift(response.data.data)
    dialog.value = false
    $q.notify({ type: 'positive', message: 'Contrato salvo.' })
  } catch (error) { notifyError(error) } finally { saving.value = false }
}
function remove(contract) {
  $q.dialog({ title: 'Excluir contrato', message: `Remover ${contract.title}?`, cancel: true, persistent: true }).onOk(async () => {
    try { await api.delete(`/admin/contracts/${contract._id}`, { headers }); contracts.value = contracts.value.filter((item) => item._id !== contract._id); $q.notify({ type: 'positive', message: 'Contrato removido.' }) } catch (error) { notifyError(error) }
  })
}
function notifyError(error) { $q.notify({ type: 'negative', message: error.response?.data?.message || 'Nao foi possivel concluir o contrato.' }) }
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
.portal-module__link { color: #8fffee; text-decoration: none; }
.portal-module__dialog { width: min(94vw, 560px); color: #effffb; background: #061819; border: 1px solid rgba(19,188,157,.3); }
.portal-module__dialog-head { display: flex; align-items: flex-start; justify-content: space-between; gap: .8rem; }
.portal-module__dialog h3 { margin: .4rem 0 0; font-size: 1.15rem; }
.portal-module__dialog :deep(.q-field__control) { color: #effffb; background: rgba(7,40,40,.74); }
.portal-module__dialog :deep(.q-field__native), .portal-module__dialog :deep(.q-field__label) { color: rgba(239,255,251,.8); }
.contracts-module__filters { display: grid; grid-template-columns: minmax(220px, 1fr) auto; gap: .6rem; }.contracts-module__filters :deep(.q-field__control) { color: #effffb; background: rgba(7,40,40,.74); }.contracts-module__filters :deep(.q-field__native), .contracts-module__filters :deep(.q-field__label) { color: rgba(239,255,251,.8); }
@media (max-width: 700px) { .portal-module__head { align-items: flex-start; flex-direction: column; } .portal-module__primary { width: 100%; } .portal-module__table { max-width: calc(100vw - 2rem); overflow: auto; } }
</style>
