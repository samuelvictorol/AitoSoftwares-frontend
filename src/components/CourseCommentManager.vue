<template>
  <section class="course-comments">
    <div class="course-comments__head">
      <div>
        <p class="course-comments__eyebrow">AITOLEARN / MODERACAO</p>
        <h2>Comentarios das aulas</h2>
      </div>
      <q-btn flat round icon="mdi-refresh" aria-label="Atualizar comentarios" :loading="loading" @click="load" />
    </div>

    <div class="course-comments__filters">
      <q-input v-model="search" outlined dense clearable label="Buscar no comentario" @keyup.enter="load">
        <template #prepend><q-icon name="mdi-magnify" /></template>
      </q-input>
      <q-select v-model="courseId" outlined dense clearable label="Curso" :options="courseOptions" emit-value map-options @update:model-value="load" />
    </div>

    <q-table flat bordered wrap-cells row-key="_id" class="course-comments__table" :rows="comments" :columns="columns" :loading="loading" no-data-label="Nenhum comentario encontrado">
      <template #body-cell-user="props">
        <q-td :props="props">{{ props.row.user?.name || 'Usuario' }}<small>{{ props.row.user?.email }}</small></q-td>
      </template>
      <template #body-cell-body="props">
        <q-td :props="props"><span class="course-comments__body">{{ props.row.body }}</span></q-td>
      </template>
      <template #body-cell-actions="props">
        <q-td :props="props"><q-btn flat round dense color="negative" icon="mdi-delete-outline" aria-label="Excluir comentario" @click="remove(props.row)" /></q-td>
      </template>
    </q-table>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'

const $q = useQuasar()
const token = localStorage.getItem('aito_admin_token')
const headers = { headers: { Authorization: `Bearer ${token}` } }
const comments = ref([])
const courseOptions = ref([])
const search = ref('')
const courseId = ref('')
const loading = ref(false)
const columns = [
  { name: 'user', label: 'Usuario', field: 'user', align: 'left' },
  { name: 'course', label: 'Curso', field: row => row.course?.title || '-', align: 'left' },
  { name: 'topic', label: 'Aula', field: row => row.topic?.title || '-', align: 'left' },
  { name: 'body', label: 'Comentario', field: 'body', align: 'left' },
  { name: 'createdAt', label: 'Data', field: row => formatDate(row.createdAt), align: 'left' },
  { name: 'actions', label: '', align: 'right' }
]

function formatDate (value) { return value ? new Date(value).toLocaleDateString('pt-BR') : '-' }
function notifyError (error) { $q.notify({ type: 'negative', message: error.response?.data?.message || 'Nao foi possivel concluir.' }) }

async function load () {
  loading.value = true
  try {
    const [commentsResponse, coursesResponse] = await Promise.all([
      api.get('/admin/course-comments', { ...headers, params: { q: search.value, courseId: courseId.value || undefined } }),
      api.get('/admin/courses', headers)
    ])
    comments.value = commentsResponse.data.data || []
    courseOptions.value = (coursesResponse.data.data || []).map(item => ({ label: item.title, value: item._id }))
  } catch (error) {
    notifyError(error)
  } finally {
    loading.value = false
  }
}

function remove (comment) {
  $q.dialog({ title: 'Excluir comentario', message: 'Remover este comentario e respostas vinculadas?', cancel: true, persistent: true }).onOk(async () => {
    try {
      await api.delete(`/admin/course-comments/${comment._id}`, headers)
      comments.value = comments.value.filter(item => item._id !== comment._id && item.parentComment !== comment._id)
      $q.notify({ type: 'positive', message: 'Comentario removido.' })
    } catch (error) {
      notifyError(error)
    }
  })
}

onMounted(load)
</script>

<style scoped>
.course-comments { display: grid; gap: 1rem; color: #effffb; }
.course-comments__head { display: flex; align-items: flex-end; justify-content: space-between; gap: 1rem; }
.course-comments__eyebrow { margin: 0; color: #8fffee; font-size: .65rem; font-weight: 900; letter-spacing: .15em; text-transform: uppercase; }
.course-comments h2 { margin: .5rem 0 0; font-size: clamp(1.6rem, 3vw, 2.8rem); }
.course-comments__filters { display: grid; grid-template-columns: 1fr 260px; gap: .7rem; }
.course-comments__filters :deep(.q-field__control) { color: #effffb; background: rgba(7, 40, 40, .74); }
.course-comments__filters :deep(.q-field__native), .course-comments__filters :deep(.q-field__label) { color: rgba(239, 255, 251, .8); }
.course-comments__table { color: #effffb; background: rgba(3, 16, 18, .58); border-color: rgba(19, 188, 157, .2); }
.course-comments__table :deep(th) { color: #8fffee; font-size: .68rem; }
.course-comments__table :deep(td) { color: rgba(239, 255, 251, .78); font-size: .72rem; }
.course-comments__table small { display: block; color: rgba(239, 255, 251, .5); font-size: .62rem; }
.course-comments__body { display: inline-block; max-width: 28rem; white-space: normal; line-height: 1.45; }
@media (max-width: 700px) { .course-comments__filters { grid-template-columns: 1fr; } }
</style>
