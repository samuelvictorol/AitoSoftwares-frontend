<template>
    <q-layout>

        <q-page-container class="q-pa-md">
            <q-page class="triage-page q-pa-xl">
                <div class="triage-bg"></div>
                <div class="triage-galaxy"></div>

                <div class="triage-shell">
                    <div class="triage-card">
                        <!-- topo -->
                        <div class="triage-top">
                            <div class="row items-center justify-between no-wrap q-col-gutter-sm">
                                <div class="row items-center no-wrap">
                                    <q-avatar size="42px" class="triage-logo">
                                        <q-img src="/favicon.png" fit="contain" />
                                    </q-avatar>

                                    <div class="q-ml-sm">
                                        <div class="triage-brand">AITOSOFTWARES</div>
                                        <div class="triage-brand-sub">Análise rápida de perfil</div>
                                    </div>
                                </div>

                                <q-chip dense outline color="grey-8" text-color="grey-9" icon="mdi-timer-sand"
                                    class="triage-chip q-pb-xs">
                                    3 min
                                </q-chip>
                            </div>

                            <!-- <div class="triage-headline q-mt-md">
                                Responda em poucos passos e receba o caminho mais estratégico para o seu caso.
                            </div> -->

                            <div class="triage-headline q-mt-md">
                                Triagem rápida para negócios, tecnologia, automação, IA e software sob medida.
                            </div>

                            <div class="q-mt-md">
                                <div class="row items-center justify-between q-mb-xs ">
                                    <div class="text-caption text-grey-7">
                                        Etapa {{ currentStep }} de {{ totalSteps }}
                                    </div>
                                    <div class="text-caption text-grey-7">
                                        {{ progressLabel }}
                                    </div>
                                </div>

                                <q-linear-progress rounded size="10px" :value="progressValue" color="positive"
                                    track-color="grey-3" class="triage-progress" />
                            </div>
                        </div>

                        <!-- conteúdo -->
                         <div class="w100 q-pt-md"></div>
                        <div class="triage-body ">
                            <transition name="fade-slide" mode="out-in">
                                <div :key="currentStep"">
                                    <!-- ETAPA 1 -->
                                    <div v-if="currentStep === 1" class="triage-step">
                                        <div class="triage-step-kicker">Etapa 1</div>
                                        <h1 class="triage-title">
                                            Qual perfil mais combina com você hoje?
                                        </h1>
                                        <p class="triage-text">
                                            Escolha a opção que melhor representa seu momento.
                                        </p>

                                        <div class="triage-options">
                                            <button v-for="option in profileOptions" :key="option.value" type="button"
                                                class="triage-option" :class="{ active: form.profile === option.value }"
                                                @click="selectProfile(option.value)">
                                                <q-icon :name="option.icon" size="22px" />
                                                <div class="triage-option-content">
                                                    <div class="triage-option-title">{{ option.label }}</div>
                                                    <div class="triage-option-desc">{{ option.desc }}</div>
                                                </div>
                                                <q-icon
                                                    :name="form.profile === option.value ? 'mdi-check-circle' : 'mdi-chevron-right'"
                                                    size="20px" class="triage-option-icon" />
                                            </button>
                                        </div>
                                    </div>

                                    <!-- ETAPA 2 -->
                                    <div v-else-if="currentStep === 2" class="triage-step">
                                        <div class="triage-step-kicker">Etapa 2</div>
                                        <h2 class="triage-title">{{ currentQuestion.title }}</h2>
                                        <p class="triage-text">{{ currentQuestion.help }}</p>

                                        <q-input v-model="currentAnswer" outlined autogrow maxlength="100" counter
                                            type="textarea" :placeholder="currentQuestion.placeholder"
                                            class="triage-input" />

                                        <div v-if="currentQuestion.suggestions?.length" class="row q-gutter-sm q-mt-md">
                                            <q-chip v-for="suggestion in currentQuestion.suggestions" :key="suggestion"
                                                clickable outline color="grey-8" text-color="grey-9"
                                                @click="applySuggestion(suggestion)">
                                                {{ suggestion }}
                                            </q-chip>
                                        </div>
                                    </div>

                                    <!-- ETAPA 3 -->
                                    <div v-else-if="currentStep === 3" class="triage-step">
                                        <div class="triage-step-kicker">Etapa 3</div>
                                        <h2 class="triage-title">{{ currentQuestion.title }}</h2>
                                        <p class="triage-text">{{ currentQuestion.help }}</p>

                                        <q-input v-model="currentAnswer" outlined autogrow maxlength="100" counter
                                            type="textarea" :placeholder="currentQuestion.placeholder"
                                            class="triage-input" />

                                        <div v-if="currentQuestion.suggestions?.length" class="row q-gutter-sm q-mt-md">
                                            <q-chip v-for="suggestion in currentQuestion.suggestions" :key="suggestion"
                                                clickable outline color="grey-8" text-color="grey-9"
                                                @click="applySuggestion(suggestion)">
                                                {{ suggestion }}
                                            </q-chip>
                                        </div>
                                    </div>

                                    <!-- ETAPA 4 -->
                                    <div v-else-if="currentStep === 4" class="triage-step">
                                        <div class="triage-step-kicker">Etapa 4</div>
                                        <h2 class="triage-title">{{ currentQuestion.title }}</h2>
                                        <p class="triage-text">{{ currentQuestion.help }}</p>

                                        <q-input v-model="currentAnswer" outlined autogrow maxlength="100" counter
                                            type="textarea" :placeholder="currentQuestion.placeholder"
                                            class="triage-input" />

                                        <div v-if="currentQuestion.suggestions?.length" class="row q-gutter-sm q-mt-md">
                                            <q-chip v-for="suggestion in currentQuestion.suggestions" :key="suggestion"
                                                clickable outline color="grey-8" text-color="grey-9"
                                                @click="applySuggestion(suggestion)">
                                                {{ suggestion }}
                                            </q-chip>
                                        </div>
                                    </div>

                                    <!-- ETAPA 5 -->
                                    <div v-else-if="currentStep === 5" class="triage-step">
                                        <div class="triage-step-kicker">Etapa 5</div>
                                        <h2 class="triage-title">{{ currentQuestion.title }}</h2>
                                        <p class="triage-text">{{ currentQuestion.help }}</p>

                                        <q-input v-model="currentAnswer" outlined autogrow maxlength="100" counter
                                            type="textarea" :placeholder="currentQuestion.placeholder"
                                            class="triage-input" />

                                        <div v-if="currentQuestion.suggestions?.length" class="row q-gutter-sm q-mt-md">
                                            <q-chip v-for="suggestion in currentQuestion.suggestions" :key="suggestion"
                                                clickable outline color="grey-8" text-color="grey-9"
                                                @click="applySuggestion(suggestion)">
                                                {{ suggestion }}
                                            </q-chip>
                                        </div>
                                    </div>

                                    <!-- RESUMO -->
                                    <div v-else class="triage-step">
                                        <div class="triage-step-kicker">Final</div>
                                        <h2 class="triage-title">Tudo certo. Agora é só enviar.</h2>
                                        <p class="triage-text">
                                            Revise rapidamente abaixo. Ao continuar, abrimos o WhatsApp com sua análise
                                            pronta.
                                        </p>

                                        <div class="triage-summary">
                                            <div class="triage-summary-item">
                                                <span>1.</span>
                                                <div>{{ profileLabel }}</div>
                                            </div>

                                            <div v-for="(item, index) in activeQuestions" :key="item.key"
                                                class="triage-summary-item">
                                                <span>{{ index + 2 }}.</span>
                                                <div>{{ form[item.key] || '—' }}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </transition>
                        </div>

                        <!-- rodapé -->
                        <div class="triage-footer">
                            <div class="row q-col-gutter-sm ">
                                <div class="col">
                                    <q-btn v-if="currentStep > 1" outline no-caps
                                        class="triage-btn-secondary full-width" icon="mdi-arrow-left" label="Voltar"
                                        @click="prevStep" />
                                </div>

                                <div class="col ">
                                    <q-btn v-if="currentStep <= totalSteps" unelevated no-caps
                                        class="triage-btn-primary full-width "
                                        :label="currentStep === 1 ? 'Continuar' : 'Próxima etapa'"
                                        :icon-right="currentStep === totalSteps ? 'mdi-check' : 'mdi-arrow-right'"
                                        :disable="!canProceed" @click="nextStep" />
                                        
                                        <q-btn v-else unelevated no-caps class="triage-btn-primary full-width"
                                        icon="mdi-whatsapp" label="Enviar análise" @click="submitToWhatsapp" />
                                    </div>
                                    <div class="w100 q-pb-md"></div>
                            </div>

                            <!-- <div class="triage-footnote q-mt-sm">
                                Suas respostas ajudam a AITO a entender seu cenário antes do contato.
                            </div> -->
                        </div>
                    </div>
                </div>
            </q-page>
        </q-page-container>
    </q-layout>

</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const WHATSAPP_NUMBER = '5561981748795'

const currentStep = ref(1)
const totalSteps = 5

const form = reactive({
    profile: '',
    niche: '',
    contact: '',
    bottleneck: '',
    goal: '',
    whitelabel: '',
    cloudInterest: '',
    aiInterest: '',
    techContact: ''
})

const profileOptions = [
    {
        value: 'business',
        label: 'Microempreendedor / Empresário',
        desc: 'Tenho um negócio e quero melhorar operação, vendas ou tecnologia.',
        icon: 'mdi-briefcase-outline'
    },
    {
        value: 'marketing',
        label: 'Marketing',
        desc: 'Atuo com aquisição, conversão, posicionamento e performance.',
        icon: 'mdi-bullhorn-outline'
    },
    {
        value: 'student',
        label: 'Estudante de tecnologia',
        desc: 'Quero evoluir na área e aprender sistemas, cloud, IA e automação.',
        icon: 'mdi-school-outline'
    },
    {
        value: 'developer',
        label: 'Desenvolvedor',
        desc: 'Já programo ou trabalho com software e quero avançar mais.',
        icon: 'mdi-code-tags'
    }
]

const businessQuestions = [
    {
        key: 'niche',
        title: 'Qual seu nicho ou especialidade hoje?',
        help: 'Fale de forma curta para entendermos seu contexto.',
        placeholder: 'Ex: loja de veículos, clínica, eventos, e-commerce...',
        suggestions: ['Loja', 'Serviços', 'E-commerce', 'Eventos']
    },
    {
        key: 'contact',
        title: 'Seu nome e melhor contato?',
        help: 'Pode ser telefone, WhatsApp ou e-mail.',
        placeholder: 'Ex: Samuel - 61 99999-9999',
        suggestions: ['Nome + WhatsApp', 'Nome + E-mail']
    },
    {
        key: 'bottleneck',
        title: 'Qual é o maior gargalo ou ineficiência hoje?',
        help: 'Pode ser atendimento, vendas, gestão, sistema ou processo.',
        placeholder: 'Ex: atendimento lento, retrabalho, sistema travando...',
        suggestions: ['Atendimento', 'Vendas', 'Processos', 'Sistema']
    },
    {
        key: 'goal',
        title: 'Qual meta você quer alcançar com seu projeto?',
        help: 'Seja direto: resultado, prazo ou transformação desejada.',
        placeholder: 'Ex: vender mais, automatizar, reduzir custo, escalar...',
        suggestions: ['Vender mais', 'Reduzir custos', 'Automatizar', 'Escalar']
    }
]

const techQuestions = [
    {
        key: 'whitelabel',
        title: 'Você já trabalhou com whitelabel?',
        help: 'Pode responder rápido, dizendo se já usou, vendeu ou customizou.',
        placeholder: 'Ex: não ainda / sim, em SaaS / já personalizei...',
        suggestions: ['Não ainda', 'Sim, pouco', 'Sim, bastante']
    },
    {
        key: 'cloudInterest',
        title: 'Tem interesse em aprender sistemas completos na nuvem?',
        help: 'Vale responder com objetivo ou nível de interesse.',
        placeholder: 'Ex: sim, quero subir apps completos em produção...',
        suggestions: ['Sim, muito', 'Tenho interesse', 'Quero aprender deploy']
    },
    {
        key: 'aiInterest',
        title: 'Tem interesse em desenvolver IA e automações?',
        help: 'Pode citar bots, agentes, integrações ou atendimento.',
        placeholder: 'Ex: sim, foco em bots, APIs, agentes e automações...',
        suggestions: ['IA no WhatsApp', 'Automações', 'Agentes', 'Integrações']
    },
    {
        key: 'techContact',
        title: 'Seu nome e melhor contato?',
        help: 'Pode ser telefone, WhatsApp ou e-mail.',
        placeholder: 'Ex: Samuel - 61 99999-9999',
        suggestions: ['Nome + WhatsApp', 'Nome + E-mail']
    }
]

const isBusinessFlow = computed(() => form.profile === 'business')
const isTechFlow = computed(() => ['marketing', 'student', 'developer'].includes(form.profile))

const activeQuestions = computed(() => {
    if (isBusinessFlow.value) return businessQuestions
    if (isTechFlow.value) return techQuestions
    return []
})

const currentQuestion = computed(() => {
    if (currentStep.value < 2 || currentStep.value > 5) return null
    return activeQuestions.value[currentStep.value - 2]
})

const currentAnswer = computed({
    get() {
        if (!currentQuestion.value) return ''
        return form[currentQuestion.value.key]
    },
    set(value) {
        if (!currentQuestion.value) return
        form[currentQuestion.value.key] = value.slice(0, 100)
    }
})

const progressValue = computed(() => currentStep.value / (totalSteps + 1))
const progressLabel = computed(() => `${Math.round(progressValue.value * 100)}%`)

const profileLabel = computed(() => {
    const found = profileOptions.find(item => item.value === form.profile)
    return found?.label || 'Perfil não informado'
})

const canProceed = computed(() => {
    if (currentStep.value === 1) return !!form.profile

    if (currentStep.value >= 2 && currentStep.value <= 5) {
        return !!currentAnswer.value?.trim()
    }

    return true
})

function selectProfile(value) {
    form.profile = value
}

function applySuggestion(value) {
    currentAnswer.value = value
}

function nextStep() {
    if (!canProceed.value) return

    if (currentStep.value < totalSteps) {
        currentStep.value += 1
        return
    }

    currentStep.value = totalSteps + 1
}

function prevStep() {
    if (currentStep.value > 1) {
        currentStep.value -= 1
    }
}

function buildWhatsappUrl(message) {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

function buildWhatsappMessage() {
    const lines = [
        'AITOSOFTWARES',
        'Análise Perfil ->',
        `1. ${profileLabel.value}`
    ]

    activeQuestions.value.forEach((question, index) => {
        lines.push(`${index + 2}. ${form[question.key] || '-'}`)
    })

    return lines.join('\n')
}

function submitToWhatsapp() {
    const message = buildWhatsappMessage()
    window.open(buildWhatsappUrl(message), '_blank')
    router.push('/')
}
</script>

<style scoped>
.triage-page {
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: stretch;
    justify-content: center;
    padding: 16px;
    background: transparent;
}

.triage-bg {
    position: fixed;
    inset: 0;
    z-index: 0;
    background:
        radial-gradient(circle at 18% 12%, rgba(32, 180, 190, 0.14), transparent 32%),
        radial-gradient(circle at 84% 86%, rgba(34, 197, 94, 0.11), transparent 34%),
        linear-gradient(180deg, #f8fafc 0%, #eef4f7 100%);
}

.triage-galaxy {
    position: fixed;
    inset: 0;
    z-index: 0;
    opacity: 0.06;
    pointer-events: none;
    background-image: url('/galaxy.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}

.triage-shell {
    position: relative;
    z-index: 1;
    width: 100%;
    min-height: calc(100vh - 32px);
    display: flex;
    align-items: center;
    justify-content: center;
}

.triage-card {
    width: 100%;
    max-width: 760px;
    min-height: min(860px, calc(100vh - 32px));
    display: grid;
    grid-template-rows: auto 1fr auto;
    border: 1px solid rgba(15, 23, 42, 0.08);
    border-radius: 24px;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.88);
    backdrop-filter: blur(18px);
    box-shadow: 0 24px 90px rgba(15, 23, 42, 0.12);
}

.triage-top {
    padding: 20px 20px 16px;
    border-bottom: 1px solid rgba(15, 23, 42, 0.07);
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(255, 255, 255, 0.82));
}

.triage-logo {
    border-radius: 12px;
    background: #fff;
    border: 1px solid rgba(15, 23, 42, 0.08);
}

.triage-brand {
    font-size: 0.95rem;
    font-weight: 900;
    color: #0b0d12;
    letter-spacing: 0.06em;
}

.triage-brand-sub {
    font-size: 0.78rem;
    color: rgba(15, 23, 42, 0.62);
}


.triage-headline {
    font-size: clamp(1.2rem, 2.5vw, 1.7rem);
    line-height: 1.15;
    font-weight: 900;
    color: #0b0d12;
    max-width: 560px;
}

.triage-subheadline {
    margin-top: 6px;
    color: rgba(15, 23, 42, 0.72);
    font-size: 0.95rem;
    max-width: 620px;
}

.triage-progress {
    border-radius: 999px;
}


.triage-step {
    width: 100%;
}

.triage-step-kicker {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border: 1px solid rgba(15, 23, 42, 0.08);
    background: rgba(246, 247, 251, 0.9);
    color: rgba(15, 23, 42, 0.72);
    border-radius: 999px;
    padding: 6px 10px;
    font-size: 0.78rem;
    margin-bottom: 12px;
}

.triage-title {
    margin: 0;
    font-size: clamp(1.45rem, 3.5vw, 2.2rem);
    line-height: 1.1;
    font-weight: 950;
    color: #0b0d12;
}

.triage-text {
    margin-top: 10px;
    margin-bottom: 0;
    color: rgba(15, 23, 42, 0.72);
    font-size: 0.98rem;
    line-height: 1.5;
    max-width: 620px;
}

.triage-options {
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
    margin-top: 18px;
}

.triage-option {
    width: 100%;
    border: 1px solid rgba(15, 23, 42, 0.1);
    background: rgba(255, 255, 255, 0.85);
    border-radius: 18px;
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 14px;
    text-align: left;
    cursor: pointer;
    transition: 0.22s ease;
}

.triage-option:hover {
    transform: translateY(-1px);
    border-color: rgba(4, 153, 178, 0.38);
    box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
}

.triage-option.active {
    border-color: rgba(4, 153, 178, 0.45);
    background: linear-gradient(135deg, rgba(32, 180, 190, 0.08), rgba(34, 197, 94, 0.08));
    box-shadow: 0 16px 40px rgba(15, 23, 42, 0.08);
}

.triage-option-content {
    flex: 1;
    min-width: 0;
}

.triage-option-title {
    font-size: 1rem;
    font-weight: 800;
    color: #0b0d12;
}

.triage-option-desc {
    margin-top: 4px;
    font-size: 0.9rem;
    color: rgba(15, 23, 42, 0.66);
    line-height: 1.4;
}

.triage-option-icon {
    color: rgba(15, 23, 42, 0.55);
}

.triage-input :deep(.q-field__control) {
    border-radius: 16px;
    min-height: 128px;
    background: rgba(255, 255, 255, 0.92);
}

.triage-input {
    margin-top: 18px;
}

.triage-summary {
    margin-top: 18px;
    display: grid;
    gap: 10px;
}

.triage-summary-item {
    display: grid;
    grid-template-columns: 28px 1fr;
    gap: 10px;
    padding: 14px;
    border-radius: 16px;
    border: 1px solid rgba(15, 23, 42, 0.08);
    background: rgba(246, 247, 251, 0.85);
    color: rgba(15, 23, 42, 0.82);
}

.triage-summary-item span {
    font-weight: 900;
    color: #0499B2;
}

.triage-footer {
    padding: 16px 20px 20px;
    border-top: 1px solid rgba(15, 23, 42, 0.07);
    background: rgba(255, 255, 255, 0.92);
}

.triage-btn-primary {
    border-radius: 14px;
    min-height: 48px;
    font-weight: 800;
    letter-spacing: 0.2px;
    color: #fff;
    background: linear-gradient(-135deg, #22c55e, #0499B2);
}

.triage-btn-secondary {
    border-radius: 14px;
    min-height: 48px;
    font-weight: 700;
    border-color: rgba(15, 23, 42, 0.14);
    color: rgba(15, 23, 42, 0.85);
}

.triage-footnote {
    text-align: center;
    color: rgba(15, 23, 42, 0.56);
    font-size: 0.8rem;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
    transition: all 0.22s ease;
}

.fade-slide-enter-from {
    opacity: 0;
    transform: translateY(10px);
}

.fade-slide-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}

@media (min-width: 900px) {
    .triage-page {
        padding: 28px;
    }

    .triage-shell {
        min-height: calc(100vh - 56px);
    }

    .triage-card {
        min-height: calc(100vh - 56px);
        max-height: calc(100vh - 56px);
    }

    .triage-top {
        padding: 26px 28px 18px;
    }

    .triage-body {
        padding: 28px;
    }

    .triage-footer {
        padding: 18px 28px 24px;
    }

    .triage-options {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 899px) {
    .triage-page {
        padding: 0;
    }

    .triage-shell {
        min-height: 100vh;
    }

    .triage-card {
        min-height: 100vh;
        border-radius: 0;
        max-width: 100%;
    }

    .triage-galaxy {
        background-position: center;
        transform: rotate(-90deg) scale(1.15);
    }

    .triage-top,
    .triage-body,
    .triage-footer {
        padding-left: 16px;
        padding-right: 16px;
    }

    .triage-title {
        font-size: 1.5rem;
    }

    .triage-option {
        padding: 14px;
    }
}
</style>