<template>
  <section class="admin-costs portal-module">
    <div class="portal-module__head">
      <div><span class="portal-module__eyebrow">Financeiro</span></div>
      <q-btn unelevated no-caps class="portal-module__primary" icon="mdi-plus" label="Novo custo" @click="openCreate" />
    </div>

    <div class="admin-costs__filters">
      <q-input v-model="search" outlined dense clearable label="Buscar titulo, projeto ou descricao" @keyup.enter="load" />
      <q-select v-model="filterOwner" outlined dense clearable label="Destino" :options="ownerOptions" emit-value map-options @update:model-value="load" />
      <q-select v-model="filterStatus" outlined dense clearable label="Status" :options="statusOptions" emit-value map-options @update:model-value="load" />
      <q-btn flat round icon="mdi-refresh" aria-label="Atualizar custos" :loading="loading" @click="load"><q-tooltip>Atualizar</q-tooltip></q-btn>
    </div>

    <q-table flat bordered wrap-cells row-key="_id" class="portal-module__table" :rows="costs" :columns="columns" :loading="loading" no-data-label="Nenhum custo encontrado">
      <template #body-cell-owner="props"><q-td :props="props">{{ ownerLabel(props.row) }}</q-td></template>
      <template #body-cell-description="props"><q-td :props="props"><span class="portal-module__description">{{ preview(props.row.description) }}</span></q-td></template>
      <template #body-cell-amount="props"><q-td :props="props">{{ money(props.row.amount, props.row.currency) }}</q-td></template>
      <template #body-cell-status="props"><q-td :props="props"><span class="portal-module__tag">{{ statusLabel(props.row.status) }}</span></q-td></template>
      <template #body-cell-type="props"><q-td :props="props">{{ typeLabel(props.row.type) }}</q-td></template>
      <template #body-cell-date="props"><q-td :props="props">{{ formatDate(props.row.date) }}</q-td></template>
      <template #body-cell-attachment="props"><q-td :props="props"><a v-if="props.row.attachment" :href="props.row.attachment.url" target="_blank" rel="noopener noreferrer" class="portal-module__link"><q-icon name="mdi-paperclip" /> Abrir</a><span v-else>-</span></q-td></template>
      <template #body-cell-actions="props"><q-td :props="props"><q-btn flat round dense icon="mdi-eye-outline" aria-label="Ver descricao do custo" @click="openDetails(props.row)"><q-tooltip>Ver detalhes</q-tooltip></q-btn><q-btn flat round dense icon="mdi-pencil" aria-label="Editar custo" @click="openEdit(props.row)" /><q-btn flat round dense color="negative" icon="mdi-delete-outline" aria-label="Excluir custo" @click="remove(props.row)" /></q-td></template>
    </q-table>

    <q-dialog v-model="dialog">
      <q-card class="portal-module__dialog admin-costs__dialog">
        <q-card-section class="portal-module__dialog-head"><div><span class="portal-module__eyebrow">Lancamento financeiro</span><h3>{{ form._id ? 'Editar custo' : 'Cadastrar custo' }}</h3></div><q-btn flat round dense icon="mdi-close" aria-label="Fechar" @click="dialog = false" /></q-card-section>
        <q-card-section>
          <q-form @submit.prevent="save">
            <q-select v-model="form.ownerType" outlined label="Destino do custo" :options="ownerOptions" emit-value map-options @update:model-value="changeOwnerType" />
            <q-select v-if="form.ownerType !== 'company'" v-model="form.ownerId" outlined class="q-mt-sm" :label="form.ownerType === 'customer' ? 'Cliente' : 'Usuario'" :options="targetOptions" emit-value map-options :rules="[requiredRule]" />
            <q-input v-model="form.title" outlined label="Titulo" class="q-mt-sm" :rules="[requiredRule]" />
            <div class="admin-costs__grid">
              <q-select v-model="form.status" outlined label="Status" :options="statusOptions" emit-value map-options />
              <q-select v-model="form.type" outlined label="Tipo" :options="typeOptions" emit-value map-options />
            </div>
            <div class="admin-costs__grid admin-costs__grid--money">
              <q-input v-model.number="form.amount" outlined type="number" min="0" step="0.01" label="Valor" :rules="[requiredRule]" />
              <q-select v-model="form.currency" outlined label="Moeda" :options="currencyOptions" emit-value map-options />
              <q-input v-model="form.date" outlined type="date" label="Data" :rules="[requiredRule]" />
            </div>
            <q-input v-model="form.project" outlined label="Projeto ou curso" class="q-mt-sm" />
            <q-input v-model="form.description" outlined type="textarea" autogrow label="Descricao" class="q-mt-sm" />
            <q-file v-model="form.file" outlined label="Anexo imagem, DOC, PDF ou Excel" accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.csv" class="q-mt-sm"><template #prepend><q-icon name="mdi-paperclip" /></template></q-file>
            <q-toggle v-if="form._id && form.attachment" v-model="form.removeAttachment" label="Remover anexo atual" color="negative" class="q-mt-sm" />
            <q-btn unelevated no-caps class="portal-module__primary full-width q-mt-md" type="submit" label="Salvar custo" :loading="saving" />
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="detailDialog">
      <q-card class="portal-module__dialog admin-costs__detail-dialog">
        <q-card-section class="portal-module__dialog-head"><div><span class="portal-module__eyebrow">Detalhes do custo</span><h3>{{ selectedDetail.title || 'Custo' }}</h3></div><q-btn flat round dense icon="mdi-close" aria-label="Fechar" @click="detailDialog = false" /></q-card-section>
        <q-card-section class="admin-costs__detail-body">
          <p>{{ selectedDetail.description || 'Sem descricao cadastrada.' }}</p>
          <div><span>Destino</span><strong>{{ ownerLabel(selectedDetail) }}</strong></div>
          <div><span>Valor</span><strong>{{ money(selectedDetail.amount, selectedDetail.currency) }}</strong></div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'

const $q = useQuasar()
const token = localStorage.getItem('aito_admin_token')
const headers = { Authorization: `Bearer ${token}` }
const costs = ref([])
const users = ref([])
const customers = ref([])
const loading = ref(false)
const saving = ref(false)
const dialog = ref(false)
const detailDialog = ref(false)
const search = ref('')
const filterOwner = ref('')
const filterStatus = ref('')
const form = ref(emptyForm())
const selectedDetail = ref({})

const ownerOptions = [
  { label: 'Empresa Aito', value: 'company' },
  { label: 'Usuario', value: 'user' },
  { label: 'Cliente', value: 'customer' },
]
const statusOptions = [{ label: 'Ativo', value: 'active' }, { label: 'Inativo', value: 'inactive' }, { label: 'Pendente', value: 'pending' }]
const typeOptions = [{ label: 'Unico', value: 'single' }, { label: 'Mensal', value: 'monthly' }, { label: 'Bimestral', value: 'bimonthly' }, { label: 'Trimestral', value: 'quarterly' }, { label: 'Semestral', value: 'semiannual' }, { label: 'Anual', value: 'annual' }]
const currencyOptions = [{ label: 'Real (BRL)', value: 'BRL' }, { label: 'Dolar (USD)', value: 'USD' }]
const targetOptions = computed(() => {
  const source = form.value.ownerType === 'customer' ? customers.value : users.value
  return source.map((item) => ({ label: `${item.name} - ${emailPreview(item.email)}`, value: item._id }))
})
const columns = [
  { name: 'title', label: 'Titulo', field: 'title', align: 'left', sortable: true },
  { name: 'owner', label: 'Destino', field: row => row.owner?.name || row.ownerType, align: 'left' },
  { name: 'project', label: 'Projeto/curso', field: 'project', align: 'left' },
  { name: 'description', label: 'Descricao', field: 'description', align: 'left' },
  { name: 'amount', label: 'Valor', field: 'amount', align: 'right' },
  { name: 'type', label: 'Tipo', field: 'type', align: 'left' },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  { name: 'date', label: 'Data', field: 'date', align: 'left' },
  { name: 'attachment', label: 'Anexo', field: 'attachment', align: 'left' },
  { name: 'actions', label: '', align: 'right' },
]

function emptyForm() { return { _id: '', ownerType: 'company', ownerId: '', title: '', status: 'active', project: '', description: '', amount: 0, currency: 'BRL', date: new Date().toISOString().slice(0, 10), type: 'single', file: null, attachment: null, removeAttachment: false } }
function requiredRule(value) { return Boolean(String(value ?? '').trim()) || 'Preencha este campo.' }
function money(value, currency = 'BRL') { return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: currency || 'BRL' }).format(Number(value || 0)) }
function formatDate(value) { return value ? new Date(value).toLocaleDateString('pt-BR') : '-' }
function preview(value) { const text = String(value || '').trim(); return text.length > 48 ? `${text.slice(0, 48)}...` : text || '-' }
function emailPreview(value) { const email = String(value || '').trim(); const [local, domain] = email.split('@'); if (!local || !domain || local.length <= 5) return email; return `${local.slice(0, 3)}...${local.slice(-2)}@${domain}` }
function statusLabel(value) { return statusOptions.find((item) => item.value === value)?.label || value || '-' }
function typeLabel(value) { return typeOptions.find((item) => item.value === value)?.label || value || '-' }
function ownerLabel(row) { return row.owner?.name || (row.ownerType === 'company' ? 'Empresa Aito' : row.ownerType === 'customer' ? 'Cliente' : 'Usuario') }
function selectedFile(value) { return value?.item ? value.item(0) : Array.isArray(value) ? value[0] : value }
function openCreate() { form.value = emptyForm(); dialog.value = true }
function openEdit(row) { form.value = { ...emptyForm(), ...row, ownerId: row.owner?._id || row.owner?.id || '', date: row.date ? String(row.date).slice(0, 10) : '', file: null, removeAttachment: false }; dialog.value = true }
function openDetails(row) { selectedDetail.value = row; detailDialog.value = true }
function changeOwnerType() { form.value.ownerId = '' }
async function load() {
  loading.value = true
  try {
    const [costResponse, usersResponse, customersResponse] = await Promise.all([
      api.get('/admin/costs', { params: { q: search.value, ownerType: filterOwner.value, status: filterStatus.value }, headers }),
      api.get('/admin/users', { headers }),
      api.get('/admin/customers', { headers }),
    ])
    costs.value = costResponse.data.data || []
    users.value = usersResponse.data.data || []
    customers.value = customersResponse.data.data || []
  } catch (error) { notifyError(error) } finally { loading.value = false }
}
async function save() {
  saving.value = true
  try {
    const body = new FormData()
    Object.entries(form.value).forEach(([key, value]) => {
      if (key !== 'file' && key !== 'attachment' && key !== 'removeAttachment' && key !== 'ownerId' && key !== '_id' && value !== null && value !== undefined) body.append(key, value)
    })
    if (form.value.ownerType !== 'company' && form.value.ownerId) body.append('ownerId', form.value.ownerId)
    if (form.value.removeAttachment) body.append('removeAttachment', 'true')
    const file = selectedFile(form.value.file)
    if (file) body.append('attachment', file)
    const endpoint = form.value._id ? `/admin/costs/${form.value._id}` : '/admin/costs'
    const response = form.value._id ? await api.put(endpoint, body, { headers }) : await api.post(endpoint, body, { headers })
    if (form.value._id) costs.value = costs.value.map((item) => item._id === form.value._id ? response.data.data : item)
    else costs.value.unshift(response.data.data)
    dialog.value = false
    $q.notify({ type: 'positive', message: 'Custo salvo.' })
  } catch (error) { notifyError(error) } finally { saving.value = false }
}
function remove(row) {
  $q.dialog({ title: 'Excluir custo', message: `Remover ${row.title}?`, cancel: true, persistent: true }).onOk(async () => {
    try { await api.delete(`/admin/costs/${row._id}`, { headers }); costs.value = costs.value.filter((item) => item._id !== row._id); $q.notify({ type: 'positive', message: 'Custo removido.' }) } catch (error) { notifyError(error) }
  })
}
function notifyError(error) { $q.notify({ type: 'negative', message: error.response?.data?.message || 'Nao foi possivel concluir o custo.' }) }
onMounted(load)
</script>

<style scoped>
.portal-module { display: grid; gap: 1rem; color: #effffb; }
.portal-module__head { display: flex; align-items: flex-end; justify-content: space-between; gap: 1rem; }
.portal-module__eyebrow { color: #8fffee; font-size: .66rem; font-weight: 900; letter-spacing: .14em; text-transform: uppercase; }
.portal-module h2 { margin: .45rem 0 0; color: #effffb; font-size: clamp(1.5rem, 3vw, 2.5rem); }
.portal-module__head p { margin: .45rem 0 0; color: rgba(229,255,250,.62); font-size: .78rem; }
.portal-module__primary { color: #03110f; background: linear-gradient(135deg, #8fffee, #13bc9d); font-weight: 800; }
.admin-costs__filters { display: grid; grid-template-columns: minmax(220px, 1fr) 180px 180px auto; gap: .6rem; }
.admin-costs__filters :deep(.q-field__control), .admin-costs__dialog :deep(.q-field__control) { color: #effffb; background: rgba(7,40,40,.74); }
.admin-costs__filters :deep(.q-field__native), .admin-costs__filters :deep(.q-field__label), .admin-costs__dialog :deep(.q-field__native), .admin-costs__dialog :deep(.q-field__label) { color: rgba(239,255,251,.8); }
.portal-module__table { color: #effffb; border-color: rgba(19,188,157,.2); background: rgba(3,16,18,.6); }
.portal-module__table :deep(th) { color: #8fffee; font-size: .68rem; }
.portal-module__table :deep(td) { color: rgba(239,255,251,.78); font-size: .72rem; }
.portal-module__tag { padding: .25rem .45rem; border: 1px solid rgba(19,188,157,.28); border-radius: 999px; color: #8fffee; font-size: .62rem; }
.portal-module__link { color: #8fffee; text-decoration: none; }
.portal-module__description { display: inline-block; max-width: 18rem; white-space: normal; }
.portal-module__dialog { width: min(94vw, 600px); color: #effffb; background: #061819; border: 1px solid rgba(19,188,157,.3); }
.portal-module__dialog-head { display: flex; align-items: flex-start; justify-content: space-between; gap: .8rem; }
.portal-module__dialog h3 { margin: .4rem 0 0; font-size: 1.15rem; }
.admin-costs__grid { display: grid; grid-template-columns: 1fr 1fr; gap: .7rem; margin-top: .7rem; }
.admin-costs__grid--money { grid-template-columns: 1.2fr .8fr 1fr; }
.admin-costs__detail-body { display: grid; gap: .8rem; color: rgba(239,255,251,.82); }
.admin-costs__detail-body p { margin: 0; white-space: pre-wrap; line-height: 1.6; }
.admin-costs__detail-body div { display: flex; justify-content: space-between; gap: 1rem; padding-top: .7rem; border-top: 1px solid rgba(143,255,238,.1); }
.admin-costs__detail-body span { color: rgba(229,255,250,.58); }
@media (max-width: 760px) { .portal-module__head { align-items: flex-start; flex-direction: column; } .portal-module__primary { width: 100%; } .admin-costs__filters { grid-template-columns: 1fr; } .admin-costs__grid, .admin-costs__grid--money { grid-template-columns: 1fr; } .portal-module__table { max-width: calc(100vw - 2rem); overflow: auto; } }
</style>
