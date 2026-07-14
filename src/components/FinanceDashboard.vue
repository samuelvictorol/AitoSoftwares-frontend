<template>
  <section class="finance-dashboard">
    <div class="finance-dashboard__head">
      <div><span class="finance-dashboard__eyebrow">Financeiro</span><h2>{{ title }}</h2><p>Custos, recorrencias e valores reunidos em um painel vivo.</p></div>
      <q-btn flat round icon="mdi-refresh" aria-label="Atualizar financeiro" :loading="loading" @click="load"><q-tooltip>Atualizar</q-tooltip></q-btn>
    </div>

    <div class="finance-dashboard__stats">
      <article><span>Total</span><strong>{{ money(summary.total) }}</strong></article>
      <article><span>Lancamentos</span><strong>{{ summary.count || 0 }}</strong></article>
      <article><span>Ativos</span><strong>{{ money(statusValue('active')) }}</strong></article>
    </div>

    <div class="finance-dashboard__charts">
      <CostChart title="Custos por status" :labels="statusLabels" :values="statusValues" />
      <CostChart title="Custos por tipo" type="bar" :labels="typeLabels" :values="typeValues" />
    </div>

    <q-table flat bordered wrap-cells class="finance-dashboard__table" row-key="_id" :rows="costs" :columns="columns" :loading="loading" no-data-label="Nenhum custo encontrado">
      <template #body-cell-amount="props"><q-td :props="props">{{ money(props.row.amount) }}</q-td></template>
      <template #body-cell-date="props"><q-td :props="props">{{ date(props.row.date) }}</q-td></template>
      <template #body-cell-status="props"><q-td :props="props"><span class="finance-dashboard__tag">{{ statusLabel(props.row.status) }}</span></q-td></template>
      <template #body-cell-type="props"><q-td :props="props">{{ typeLabel(props.row.type) }}</q-td></template>
      <template #body-cell-attachment="props"><q-td :props="props"><a v-if="props.row.attachment" :href="props.row.attachment.url" target="_blank" rel="noopener noreferrer" class="finance-dashboard__link"><q-icon name="mdi-paperclip" /> Abrir</a><span v-else>-</span></q-td></template>
    </q-table>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'
import CostChart from './CostChart.vue'

const props = defineProps({
  title: { type: String, default: 'Seu financeiro' },
  admin: { type: Boolean, default: false },
})
const $q = useQuasar()
const loading = ref(false)
const costs = ref([])
const summary = ref({ total: 0, count: 0, byStatus: [], byType: [] })
const token = localStorage.getItem(props.admin ? 'aito_admin_token' : 'aito_user_token')
const headers = { headers: { Authorization: `Bearer ${token}` } }
const costsPath = props.admin ? '/admin/costs' : '/costs'
const summaryPath = props.admin ? '/admin/costs/summary' : '/costs/summary'
const typeNames = { single: 'Unico', monthly: 'Mensal', bimonthly: 'Bimestral', quarterly: 'Trimestral', semiannual: 'Semestral', annual: 'Anual' }
const statusNames = { active: 'Ativo', inactive: 'Inativo', pending: 'Pendente' }
const columns = [
  { name: 'title', label: 'Titulo', field: 'title', align: 'left' },
  { name: 'project', label: 'Projeto/curso', field: 'project', align: 'left' },
  { name: 'amount', label: 'Valor', field: 'amount', align: 'right' },
  { name: 'type', label: 'Tipo', field: 'type', align: 'left' },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  { name: 'date', label: 'Data', field: 'date', align: 'left' },
  { name: 'attachment', label: 'Anexo', field: 'attachment', align: 'left' },
]

const statusLabels = computed(() => summary.value.byStatus.map((item) => statusLabel(item.label)))
const statusValues = computed(() => summary.value.byStatus.map((item) => item.value))
const typeLabels = computed(() => summary.value.byType.map((item) => typeLabel(item.label)))
const typeValues = computed(() => summary.value.byType.map((item) => item.value))

function money(value) { return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value || 0)) }
function date(value) { return value ? new Date(value).toLocaleDateString('pt-BR') : '-' }
function typeLabel(value) { return typeNames[value] || value || '-' }
function statusLabel(value) { return statusNames[value] || value || '-' }
function statusValue(value) { return summary.value.byStatus.find((item) => item.label === value)?.value || 0 }
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
@media (max-width: 700px) { .finance-dashboard__stats, .finance-dashboard__charts { grid-template-columns: 1fr; } .finance-dashboard__table { max-width: calc(100vw - 2rem); overflow: auto; } }
</style>
