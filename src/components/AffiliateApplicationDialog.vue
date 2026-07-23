<template>
  <q-dialog v-model="isOpen">
    <q-card class="affiliate-application">
      <q-card-section class="affiliate-application__head"><div><span>PARCERIA AITO</span><h3>Quero me tornar afiliado</h3></div><q-btn flat round dense icon="mdi-close" aria-label="Fechar" @click="isOpen = false" /></q-card-section>
      <q-card-section><p class="affiliate-application__intro">Conte um pouco sobre seu público. A equipe avalia a candidatura e retorna pelos contatos informados.</p><q-form @submit.prevent="submit"><q-input v-model="form.name" outlined label="Nome" :rules="[required]" /><q-input v-model="form.email" outlined type="email" label="E-mail" class="q-mt-sm" :rules="[required]" /><q-input v-model="form.phone" outlined label="Telefone / WhatsApp" class="q-mt-sm" :rules="[required]" /><q-input v-model="form.reach" outlined label="Qual seu alcance aproximado?" hint="Seguidores, inscritos ou média de visualizações" class="q-mt-sm" :rules="[required]" /><q-input v-model="form.networks" outlined label="Em quais redes você atua?" hint="Instagram, TikTok, YouTube, blog ou outras" class="q-mt-sm" :rules="[required]" /><q-input v-model="form.message" outlined type="textarea" autogrow label="Como pretende divulgar? (opcional)" class="q-mt-sm" /><q-btn unelevated no-caps class="affiliate-application__submit full-width q-mt-md" type="submit" icon="mdi-send-outline" label="Enviar candidatura" :loading="loading" /></q-form></q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'

const props = defineProps({ modelValue: { type: Boolean, default: false } })
const emit = defineEmits(['update:modelValue'])
const $q = useQuasar(); const loading = ref(false); const isOpen = computed({ get: () => props.modelValue, set: (value) => emit('update:modelValue', value) }); const form = reactive({ name: '', email: '', phone: '', reach: '', networks: '', message: '' }); const required = (value) => Boolean(String(value || '').trim()) || 'Preencha este campo.'
async function submit () { loading.value = true; try { const response = await api.post('/affiliate/applications', form); $q.notify({ type: 'positive', icon: 'mdi-check-circle-outline', message: response.data.message || 'Candidatura enviada.' }); Object.assign(form, { name: '', email: '', phone: '', reach: '', networks: '', message: '' }); isOpen.value = false } catch (error) { $q.notify({ type: 'negative', message: error.response?.data?.message || 'Nao foi possivel enviar sua candidatura.' }) } finally { loading.value = false } }
</script>

<style scoped>
.affiliate-application { width: min(92vw, 32rem); color: #effffb; border: 1px solid rgba(19,188,157,.42); background: linear-gradient(145deg, rgba(3,23,24,.99), rgba(1,10,12,.99)); }
.affiliate-application__head { display:flex; align-items:flex-start; justify-content:space-between; border-bottom:1px solid rgba(19,188,157,.16); }.affiliate-application__head span { color:#8fffee; font-size:.62rem; font-weight:800; letter-spacing:.12em; }.affiliate-application h3 { margin:.3rem 0 0; color:#f2fffc; }.affiliate-application__intro { color:rgba(230,255,250,.68); font-size:.78rem; line-height:1.55; }.affiliate-application :deep(.q-field__control) { color:#effffb; background:rgba(5,33,34,.86); }.affiliate-application :deep(.q-field__native),.affiliate-application :deep(.q-field__input),.affiliate-application :deep(.q-field__label),.affiliate-application :deep(.q-field__hint) { color:#effffb !important; }.affiliate-application__submit { color:#03120f; background:linear-gradient(135deg,#8fffee,#13bc9d); font-weight:800; }
</style>
