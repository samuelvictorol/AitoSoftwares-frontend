<template>
  <section class="project-linked-panels portal-module">
    <div class="project-linked-panels__summary">
      <article><q-icon name="mdi-account-group-outline" /><span>Clientes</span><strong>{{ clients.length }}</strong></article>
      <article><q-icon name="mdi-cash-multiple" /><span>Custos</span><strong>{{ project.counts?.costs || 0 }}</strong></article>
      <article><q-icon name="mdi-lifebuoy" /><span>Chamados</span><strong>{{ project.counts?.tickets || 0 }}</strong></article>
      <article><q-icon name="mdi-file-document-outline" /><span>Contratos</span><strong>{{ project.counts?.contracts || 0 }}</strong></article>
      <article><q-icon name="mdi-receipt-text-outline" /><span>Notas</span><strong>{{ project.counts?.invoices || 0 }}</strong></article>
    </div>

    <q-tabs v-model="activePanel" dense align="left" outside-arrows mobile-arrows class="project-linked-panels__tabs" active-color="teal-3" indicator-color="teal-4">
      <q-tab name="clients" icon="mdi-account-group-outline" label="Clientes" />
      <q-tab name="costs" icon="mdi-cash-multiple" label="Custos" />
      <q-tab name="tickets" icon="mdi-lifebuoy" label="Chamados" />
      <q-tab name="contracts" icon="mdi-file-document-outline" label="Contratos" />
      <q-tab name="credentials" icon="mdi-key-chain-variant" label="Credenciais" />
      <q-tab name="invoices" icon="mdi-receipt-text-outline" label="Notas fiscais" />
    </q-tabs>

    <q-tab-panels v-model="activePanel" animated class="project-linked-panels__content">
      <q-tab-panel name="clients"><section class="linked-resource"><div class="linked-resource__head"><div><span class="portal-module__eyebrow">Clientes do projeto</span><h3>Clientes e Acessos</h3></div><q-btn v-if="admin" unelevated no-caps class="portal-module__primary" icon="mdi-account-plus-outline" label="Adicionar cliente" @click="openClientCreate" /></div><div v-if="admin" class="linked-resource__filters"><q-input v-model="clientSearch" outlined dense clearable label="Buscar cliente" @keyup.enter="loadClients"><template #prepend><q-icon name="mdi-magnify" /></template></q-input><q-select v-model="attachClientId" outlined dense clearable label="Vincular cliente existente" :options="attachOptions" emit-value map-options /><q-btn flat round icon="mdi-link-plus" aria-label="Vincular cliente existente" :loading="saving" :disable="!attachClientId" @click="attachClient"><q-tooltip>Vincular cliente</q-tooltip></q-btn></div><q-table flat bordered wrap-cells row-key="_id" class="portal-module__table" :rows="clients" :columns="clientColumns" :loading="loadingClients" no-data-label="Nenhum cliente neste projeto"><template #body-cell-email="props"><q-td :props="props">{{ emailPreview(props.row.email) }}</q-td></template><template #body-cell-actions="props"><q-td :props="props"><q-btn v-if="admin" flat round dense icon="mdi-pencil" aria-label="Editar cliente" @click="openClientEdit(props.row)" /><q-btn v-if="admin" flat round dense color="negative" icon="mdi-link-off" aria-label="Desvincular cliente" @click="detachClient(props.row)" /></q-td></template></q-table></section></q-tab-panel>
      <q-tab-panel name="costs"><AdminCostManager v-if="admin" :project-id="projectId" :project="project" /><FinanceDashboard v-else :title="`Financeiro · ${project.title}`" :project-id="projectId" /></q-tab-panel>
      <q-tab-panel name="tickets"><SupportTicketsPanel :admin="admin" :project-id="projectId" :project="project" /></q-tab-panel>
      <q-tab-panel name="contracts"><ContractManager :admin="admin" :project-id="projectId" :project="project" /></q-tab-panel>
      <q-tab-panel name="credentials"><CredentialManager :admin="admin" :project-id="projectId" :project="project" /></q-tab-panel>
      <q-tab-panel name="invoices"><InvoiceManager :admin="admin" :project-id="projectId" :project="project" /></q-tab-panel>
    </q-tab-panels>

    <q-dialog v-model="clientDialog"><q-card class="portal-module__dialog linked-resource__dialog"><q-card-section class="portal-module__dialog-head"><div><span class="portal-module__eyebrow">Cliente</span><h3>{{ clientForm._id ? 'Editar cliente' : 'Cadastrar cliente no projeto' }}</h3></div><q-btn flat round dense icon="mdi-close" aria-label="Fechar" @click="clientDialog = false" /></q-card-section><q-card-section><q-form @submit.prevent="saveClient"><q-input v-model="clientForm.name" outlined label="Nome" :rules="[requiredRule]" /><q-input v-model="clientForm.email" outlined type="email" label="E-mail" class="q-mt-sm" :rules="[requiredRule]" /><q-input v-model="clientForm.phone" outlined label="Telefone" class="q-mt-sm" :rules="[requiredRule]" /><q-input v-if="!clientForm._id" v-model="clientForm.password" outlined type="password" label="Senha inicial" class="q-mt-sm" :rules="[requiredRule]" /><q-toggle v-model="clientForm.active" label="Acesso ativo" color="positive" class="q-mt-sm" /><q-btn unelevated no-caps class="portal-module__primary full-width q-mt-md" type="submit" label="Salvar cliente" :loading="saving" /></q-form></q-card-section></q-card></q-dialog>
  </section>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'
import AdminCostManager from 'components/AdminCostManager.vue'
import FinanceDashboard from 'components/FinanceDashboard.vue'
import SupportTicketsPanel from 'components/SupportTicketsPanel.vue'
import ContractManager from 'components/ContractManager.vue'
import CredentialManager from 'components/CredentialManager.vue'
import InvoiceManager from 'components/InvoiceManager.vue'

const props = defineProps({ project: { type: Object, required: true }, admin: { type: Boolean, default: false } })
const $q = useQuasar(); const activePanel = ref('clients'); const clients = ref([]); const allCustomers = ref([]); const loadingClients = ref(false); const saving = ref(false); const clientDialog = ref(false); const clientSearch = ref(''); const attachClientId = ref(''); const clientForm = ref(emptyClient())
const projectId = computed(() => props.project._id || props.project.id)
const clientColumns = [{ name: 'name', label: 'Nome', field: 'name', align: 'left', sortable: true }, { name: 'email', label: 'E-mail', field: 'email', align: 'left' }, { name: 'phone', label: 'Telefone', field: 'phone', align: 'left' }, { name: 'active', label: 'Ativo', field: 'active', align: 'center' }, { name: 'actions', label: '', align: 'right' }]
const attachOptions = computed(() => { const selected = new Set(clients.value.map((item) => item._id)); return allCustomers.value.filter((item) => !selected.has(item._id)).map((item) => ({ label: `${item.name} - ${emailPreview(item.email)}`, value: item._id })) })
function emptyClient () { return { _id: '', name: '', email: '', phone: '', password: '', active: true } }
function requiredRule (value) { return Boolean(String(value || '').trim()) || 'Preencha este campo.' }
function emailPreview (value) { const email = String(value || '').trim(); const [local, domain] = email.split('@'); return local && domain && local.length > 5 ? `${local.slice(0, 3)}...${local.slice(-2)}@${domain}` : email }
async function loadClients () { if (!props.admin) { const items = props.project.clients?.length ? props.project.clients : (props.project.client ? [props.project.client] : []); clients.value = items.map((item) => ({ ...item, _id: item._id || item.id })); return } loadingClients.value = true; try { const [projectResponse, customerResponse] = await Promise.all([api.get(`/admin/projects/${projectId.value}/clients`, { headers: authHeaders(), params: { q: clientSearch.value } }), api.get('/admin/customers', { headers: authHeaders() })]); clients.value = projectResponse.data.data || []; allCustomers.value = customerResponse.data.data || [] } catch (error) { notifyError(error) } finally { loadingClients.value = false } }
function authHeaders () { return { Authorization: `Bearer ${localStorage.getItem('aito_admin_token')}` } }
function openClientCreate () { clientForm.value = emptyClient(); clientDialog.value = true }
function openClientEdit (client) { clientForm.value = { ...emptyClient(), ...client, password: '' }; clientDialog.value = true }
async function saveClient () { saving.value = true; try { const id = clientForm.value._id; const payload = { ...clientForm.value, projectId: projectId.value }; const response = id ? await api.put(`/admin/customers/${id}`, payload, { headers: authHeaders() }) : await api.post('/admin/customers', payload, { headers: authHeaders() }); if (id) clients.value = clients.value.map((item) => item._id === id ? { ...response.data.data, _id: id } : item); else await loadClients(); clientDialog.value = false; $q.notify({ type: 'positive', message: 'Cliente salvo neste projeto.' }) } catch (error) { notifyError(error) } finally { saving.value = false } }
async function attachClient () { saving.value = true; try { await api.post(`/admin/projects/${projectId.value}/clients`, { clientId: attachClientId.value }, { headers: authHeaders() }); attachClientId.value = ''; await loadClients(); $q.notify({ type: 'positive', message: 'Cliente vinculado.' }) } catch (error) { notifyError(error) } finally { saving.value = false } }
function detachClient (client) { $q.dialog({ title: 'Desvincular cliente', message: `Remover ${client.name} deste projeto?`, cancel: true, persistent: true }).onOk(async () => { try { await api.delete(`/admin/projects/${projectId.value}/clients/${client._id}`, { headers: authHeaders() }); await loadClients(); $q.notify({ type: 'positive', message: 'Cliente desvinculado.' }) } catch (error) { notifyError(error) } }) }
function notifyError (error) { $q.notify({ type: 'negative', message: error.response?.data?.message || 'Nao foi possivel concluir a operacao.' }) }
watch(() => props.project, loadClients, { deep: true }); onMounted(loadClients)
</script>

<style scoped>
.portal-module { display: grid; gap: 1rem; color: #effffb; }.portal-module__eyebrow { color: #8fffee; font-size: .66rem; font-weight: 900; letter-spacing: .14em; text-transform: uppercase; }.portal-module__primary { color: #03110f; background: linear-gradient(135deg, #8fffee, #13bc9d); font-weight: 800; }.project-linked-panels__summary { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: .65rem; }.project-linked-panels__summary article { display: grid; grid-template-columns: auto 1fr; column-gap: .55rem; align-items: center; padding: .8rem; border: 1px solid rgba(19,188,157,.2); border-radius: .6rem; background: rgba(4,24,25,.64); }.project-linked-panels__summary .q-icon { grid-row: span 2; color: #50dcc4; }.project-linked-panels__summary span { color: rgba(229,255,250,.56); font-size: .65rem; }.project-linked-panels__summary strong { color: #8fffee; font-size: 1.15rem; }.project-linked-panels__tabs { border-bottom: 1px solid rgba(19,188,157,.18); }.project-linked-panels__content { background: transparent; color: #effffb; }.project-linked-panels__content :deep(.q-tab-panel) { padding: 1rem 0 0; }.linked-resource { display: grid; gap: 1rem; }.linked-resource__head { display: flex; align-items: flex-end; justify-content: space-between; gap: 1rem; }.linked-resource__head h3 { margin: .4rem 0 0; color: #effffb; font-size: 1.1rem; }.linked-resource__filters { display: grid; grid-template-columns: minmax(200px, 1fr) minmax(220px, 1fr) auto; gap: .6rem; }.linked-resource__filters :deep(.q-field__control), .linked-resource__dialog :deep(.q-field__control) { color: #effffb; background: rgba(7,40,40,.74); }.linked-resource__filters :deep(.q-field__native), .linked-resource__filters :deep(.q-field__label), .linked-resource__dialog :deep(.q-field__native), .linked-resource__dialog :deep(.q-field__label) { color: rgba(239,255,251,.82); }.portal-module__table { color: #effffb; border-color: rgba(19,188,157,.2); background: rgba(3,16,18,.6); }.portal-module__table :deep(th) { color: #8fffee; font-size: .68rem; }.portal-module__table :deep(td) { color: rgba(239,255,251,.78); font-size: .72rem; }.portal-module__dialog { width: min(94vw, 580px); color: #effffb; background: #061819; border: 1px solid rgba(19,188,157,.3); }.portal-module__dialog-head { display: flex; align-items: flex-start; justify-content: space-between; gap: .8rem; }@media (max-width: 820px) { .project-linked-panels__summary { grid-template-columns: repeat(2, minmax(0, 1fr)); }.linked-resource__head { align-items: flex-start; flex-direction: column; }.linked-resource__head .q-btn { width: 100%; }.linked-resource__filters { grid-template-columns: 1fr; }.project-linked-panels__tabs { overflow-x: auto; } }
</style>
