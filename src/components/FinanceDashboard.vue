<template>
  <section class="finance-dashboard">
    <div class="finance-dashboard__head">
      <div><span class="finance-dashboard__eyebrow">Financeiro</span><h2>{{ title }}</h2></div>
      <q-btn flat round icon="mdi-refresh" aria-label="Atualizar financeiro" :loading="loading" @click="load"><q-tooltip>Atualizar</q-tooltip></q-btn>
    </div>

    <div class="finance-dashboard__stats">
      <article><span>Total</span><strong>{{ totalText }}</strong></article>
      <article><span>Lancamentos</span><strong>{{ summary.count || 0 }}</strong></article>
      <article><span>Ativos</span><strong>{{ activeText }}</strong></article>
    </div>

    <div class="finance-dashboard__charts">
      <CostChart title="Custos por status" :labels="statusLabels" :values="statusValues" />
      <CostChart title="Custos por tipo" type="bar" :labels="typeLabels" :values="typeValues" />
    </div>

    <q-table flat bordered wrap-cells class="finance-dashboard__table" row-key="_id" :rows="costs" :columns="columns" :loading="loading" no-data-label="Nenhum custo encontrado">
      <template #body-cell-description="props"><q-td :props="props"><span class="finance-dashboard__description">{{ preview(props.row.description) }}</span></q-td></template>
      <template #body-cell-amount="props"><q-td :props="props">{{ money(props.row.amount, props.row.currency) }}</q-td></template>
      <template #body-cell-date="props"><q-td :props="props">{{ date(props.row.date) }}</q-td></template>
      <template #body-cell-status="props"><q-td :props="props"><span class="finance-dashboard__tag">{{ statusLabel(props.row.status) }}</span></q-td></template>
      <template #body-cell-type="props"><q-td :props="props">{{ typeLabel(props.row.type) }}</q-td></template>
      <template #body-cell-attachment="props"><q-td :props="props"><a v-if="props.row.attachment" :href="props.row.attachment.url" target="_blank" rel="noopener noreferrer" class="finance-dashboard__link"><q-icon name="mdi-paperclip" /> Abrir</a><span v-else>-</span></q-td></template>
      <template #body-cell-actions="props"><q-td :props="props"><q-btn flat round dense icon="mdi-eye-outline" aria-label="Ver descricao do custo" @click="openDetails(props.row)"><q-tooltip>Ver detalhes</q-tooltip></q-btn></q-td></template>
    </q-table>

    <q-dialog v-model="detailDialog">
      <q-card class="finance-dashboard__dialog">
        <q-card-section class="finance-dashboard__dialog-head"><div><span class="finance-dashboard__eyebrow">Detalhes do custo</span><h3>{{ selectedDetail.title || 'Custo' }}</h3></div><q-btn flat round dense icon="mdi-close" aria-label="Fechar" @click="detailDialog = false" /></q-card-section>
        <q-card-section class="finance-dashboard__detail-body"><p>{{ selectedDetail.description || 'Sem descricao cadastrada.' }}</p><div><span>Valor</span><strong>{{ money(selectedDetail.amount, selectedDetail.currency) }}</strong></div></q-card-section>
      </q-card>
    </q-dialog>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'
import CostChart from './CostChart.vue'

const props = defineProps({
  title: { type: String, default: '' },
  admin: { type: Boolean, default: false },
})
const $q = useQuasar()
const loading = ref(false)
const costs = ref([])
const summary = ref({ total: 0, count: 0, byStatus: [], byType: [] })
const detailDialog = ref(false)
const selectedDetail = ref({})
const token = localStorage.getItem(props.admin ? 'aito_admin_token' : 'aito_user_token')
const headers = { headers: { Authorization: `Bearer ${token}` } }
const costsPath = props.admin ? '/admin/costs' : '/costs'
const summaryPath = props.admin ? '/admin/costs/summary' : '/costs/summary'
const typeNames = { single: 'Unico', monthly: 'Mensal', bimonthly: 'Bimestral', quarterly: 'Trimestral', semiannual: 'Semestral', annual: 'Anual' }
const statusNames = { active: 'Ativo', inactive: 'Inativo', pending: 'Pendente' }
const columns = [
  { name: 'title', label: 'Titulo', field: 'title', align: 'left' },
  { name: 'project', label: 'Projeto/curso', field: 'project', align: 'left' },
  { name: 'description', label: 'Descricao', field: 'description', align: 'left' },
  { name: 'amount', label: 'Valor', field: 'amount', align: 'right' },
  { name: 'type', label: 'Tipo', field: 'type', align: 'left' },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  { name: 'date', label: 'Data', field: 'date', align: 'left' },
  { name: 'attachment', label: 'Anexo', field: 'attachment', align: 'left' },
  { name: 'actions', label: '', align: 'right' },
]

const statusLabels = computed(() => summary.value.byStatus.map((item) => summaryLabel(item.label, statusNames)))
const statusValues = computed(() => summary.value.byStatus.map((item) => item.value))
const typeLabels = computed(() => summary.value.byType.map((item) => summaryLabel(item.label, typeNames)))
const typeValues = computed(() => summary.value.byType.map((item) => item.value))
const totalText = computed(() => formatCurrencyGroups(summary.value.byCurrency, summary.value.total))
const activeText = computed(() => {
  const totals = {}
  ;(summary.value.byStatus || []).forEach((item) => {
    const [status, currency] = String(item.label || '').split(' - ')
    if (status === 'active') totals[currency || 'BRL'] = (totals[currency || 'BRL'] || 0) + Number(item.value || 0)
  })
  return formatCurrencyGroups(Object.entries(totals).map(([label, value]) => ({ label, value })), 0)
})

function money(value, currency = 'BRL') { return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: currency || 'BRL' }).format(Number(value || 0)) }
function date(value) { return value ? new Date(value).toLocaleDateString('pt-BR') : '-' }
function typeLabel(value) { return typeNames[value] || value || '-' }
function statusLabel(value) { return statusNames[value] || value || '-' }
function summaryLabel(value, labels) { const [raw, currency] = String(value || '').split(' - '); return `${labels[raw] || raw || '-'}${currency ? ` (${currency})` : ''}` }
function preview(value) { const text = String(value || '').trim(); return text.length > 48 ? `${text.slice(0, 48)}...` : text || '-' }
function formatCurrencyGroups(groups, fallback) { const items = Array.isArray(groups) && groups.length ? groups : [{ label: 'BRL', value: fallback }]; return items.map((item) => money(item.value, item.label)).join(' / ') }
function openDetails(row) { selectedDetail.value = row; detailDialog.value = true }
async function load() {
  if (!token) return
  loading.value = true
  try {
    const [costResponse, summaryResponse] = await Promise.all([api.get(costsPath, headers), api.get(summaryPath, headers)])
    costs.value = costResponse.data.data || []
    summary.value = summaryResponse.data.data || summary.value
  } catch (error) {
    $q.notify({ type: 'negative', message: error.response?.data?.message || 'Nao foi possivel carregar o financeiro.' })
  } finally { loading.value = false }
}
onMounted(load)
</script>

<style scoped>
.finance-dashboard { display: grid; gap: 1rem; }
.finance-dashboard__head { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; }
.finance-dashboard__eyebrow { color: #8fffee; font-size: .68rem; font-weight: 900; letter-spacing: .15em; text-transform: uppercase; }
.finance-dashboard h2 { margin: .55rem 0 0; color: #effffb; font-size: clamp(1.5rem, 3vw, 2.5rem); }
.finance-dashboard__head p { margin: .5rem 0 0; color: rgba(229,255,250,.62); font-size: .78rem; }
.finance-dashboard__head .q-btn { color: #8fffee; }
.finance-dashboard__stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: .7rem; }
.finance-dashboard__stats article { display: grid; gap: .35rem; padding: 1rem; border: 1px solid rgba(19,188,157,.22); border-radius: .65rem; background: rgba(4,24,25,.65); }
.finance-dashboard__stats span { color: rgba(229,255,250,.55); font-size: .68rem; }
.finance-dashboard__stats strong { color: #8fffee; font-size: 1.35rem; }
.finance-dashboard__charts { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .8rem; }
.finance-dashboard__table { color: #effffb; border-color: rgba(19,188,157,.2); background: rgba(3,16,18,.55); }
.finance-dashboard__table :deep(th) { color: #8fffee; font-size: .68rem; }
.finance-dashboard__table :deep(td) { color: rgba(239,255,251,.78); font-size: .72rem; }
.finance-dashboard__tag { padding: .25rem .45rem; border: 1px solid rgba(19,188,157,.28); border-radius: 999px; color: #8fffee; font-size: .62rem; }
.finance-dashboard__link { color: #8fffee; text-decoration: none; }
.finance-dashboard__description { display: inline-block; max-width: 18rem; white-space: normal; }
.finance-dashboard__dialog { width: min(94vw, 520px); color: #effffb; background: #061819; border: 1px solid rgba(19,188,157,.3); }
.finance-dashboard__dialog-head { display: flex; align-items: flex-start; justify-content: space-between; gap: .8rem; }
.finance-dashboard__dialog h3 { margin: .4rem 0 0; font-size: 1.15rem; }
.finance-dashboard__detail-body { display: grid; gap: .8rem; color: rgba(239,255,251,.82); }
.finance-dashboard__detail-body p { margin: 0; white-space: pre-wrap; line-height: 1.6; }
.finance-dashboard__detail-body div { display: flex; justify-content: space-between; gap: 1rem; padding-top: .7rem; border-top: 1px solid rgba(143,255,238,.1); }
.finance-dashboard__detail-body span { color: rgba(229,255,250,.58); }
@media (max-width: 700px) { .finance-dashboard__stats, .finance-dashboard__charts { grid-template-columns: 1fr; } .finance-dashboard__table { max-width: calc(100vw - 2rem); overflow: auto; } }
</style>
