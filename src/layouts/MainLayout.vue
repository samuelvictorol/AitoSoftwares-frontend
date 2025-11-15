<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <q-page class="relative  landing-page" style="padding-top: 2rem;">
        <div class="landing-bg"></div>

        <div class="page-inner q-px-md q-py-lg">
          <!-- HEADER -->
          <div class="w100 row justify-center q-pa-lg">
            <header id="top" class="landing-header glass-card row items-center justify-between w90 q-mb-xl"
              style="position: fixed;">
              <div class="row items-center animate__animated animate__slower animate__delay-1s animate__fadeInLeft">
                <div class="logo-dot">
                  <q-img src="/favicon.png" width="40px"></q-img>
                </div>
                <div class="q-ml-sm">
                  <div class="text-subtitle1 text-white cta-btn-2 revalia q-px-sm">
                    {{ companyName }}
                  </div>
                  <div v-if="!isMobile" class="text-caption text-secondary-light text-grey-8">
                    IA no WhatsApp • Migração para nuvem • Automação
                  </div>
                </div>
              </div>

              <!-- Menu desktop -->
              <nav class="gt-sm row items-center">
                <q-btn v-for="item in navItems" :key="item.target" flat dense no-caps :label="item.label"
                  class="q-mx-xs nav-link text-dark" @click="scrollToSection(item.target)" />
                <q-btn unelevated no-caps class="q-ml-sm cta-btn" icon="mdi-whatsapp"
                  label="Agendar consultoria gratuita" @click="openWhatsapp" />
              </nav>

              <!-- Menu mobile -->
              <div class="lt-md animate__animated animate__slower animate__delay-1s animate__rotateIn">
                <q-btn flat round dense icon="menu" size="lg" class="text-accent" @click="drawerOpen = !drawerOpen" />
              </div>
            </header>
          </div>

          <!-- Nav mobile dropdown -->
          <q-slide-transition style="position: fixed;z-index: 99999;" class="w90">
            <div v-if="drawerOpen" class="lt-md glass-card q-pa-sm q-mb-lg nav-mobile">
              <q-btn v-for="item in navItems" :key="item.target" flat dense no-caps
                class="full-width text-left text-dark q-mb-xs" :label="item.label"
                @click="scrollToSection(item.target)" />
              <q-btn unelevated no-caps class="full-width q-mt-sm cta-btn" icon="mdi-whatsapp"
                label="Agendar consultoria" @click="openWhatsapp" />
            </div>
          </q-slide-transition>

          <!-- HERO -->
          <section id="inicio"
            class="section-block hero-block animate__animated animate__slower animate__slideInUp row items-center  q-mb-md">
            <!-- VÍDEO / IMAGEM -->
            <div class="col-12 col-md-6">
              <!-- <div class="text-caption text-secondary-light text-uppercase text-weight-medium q-mb-md q-pl-sm">
            📍 Distrito Federal e Entorno
          </div> -->
              <div class="hero-media cursor-pointer q-pa-sm q-mr-md">
                <q-responsive :ratio="16 / 9">
                  <!-- troque pelo seu vídeo ou imagem -->
                  <div class="video-placeholder flex flex-center column">
                    <q-icon name="play_circle_filled" size="64px" class="accent-text" />
                    <div class="text-caption text-secondary-light q-mt-sm q-px-md">
                      VSL
                    </div>
                  </div>
                </q-responsive>
              </div>
            </div>
            <!-- TEXTO -->
            <div class="col-12 col-md-6">
              <h1
                class="hero-title animate__animated animate__slower animate__slideInLeft   q-mb-md row items-center no-wrap">
                <q-img src="/favicon.png" width="85px"></q-img>
                <span class="revalia ">{{ companyName }}</span>
              </h1>
              <p class="hero-subtitle q-mb-md">
                Migramos seus sistemas para a nuvem com foco em
                <strong>redução de custos</strong>, automação de rotinas e
                <strong>IA no WhatsApp</strong> para captar leads e vender mais.
                Tudo isso sem parar a operação atual.
              </p>

              <div class="hero-badges row q-col-gutter-sm q-mb-md">
                <div class="col-auto">
                  <div class="badge-chip">
                    Migração e Hospedagem na Nuvem
                  </div>
                </div>
                <div class="col-auto">
                  <div class="badge-chip">
                    Redução de taxas e mensalidades
                  </div>
                </div>
                <div class="col-auto">
                  <div class="badge-chip">
                    IA no WhatsApp Personalizada
                  </div>
                </div>
                <div class="col-auto">
                  <div class="badge-chip">
                    Integração com Sistemas Legados e ERPs
                  </div>
                </div>
              </div>

              <div class="row items-center q-col-gutter-md q-mb-sm">
                <div class="col-12 col-sm-auto">
                  <q-btn unelevated no-caps class="cta-btn full-width" icon="mdi-whatsapp"
                    label="Quero reduzir meus custos" @click="openWhatsapp" />
                </div>
                <div class="col-12 col-sm-auto">
                  <q-btn flat no-caps class="text-dark full-width" label="Ver como funciona na prática"
                    @click="scrollToSection('como-funciona')" />
                </div>
              </div>

              <div class="text-caption text-secondary-light q-mt-md">
                ✔ Consultoria inicial 100% gratuita (online ou presencial*).<br>
                ✔ Projeto acompanhando em tempo real.<br>
                ✔ Suporte de excelência durante e após a implantação.
              </div>
            </div>
          </section>

          <!-- MARCAS + CARROSSEL -->
          <section id="marcas"
            class="section-block q-mb-md animate__animated animate__slower animate__delay-1s animate__zoomInDown">
            <div class="section-label text-grey-9 q-mb-lg">
              Marcas que já evoluíram com a gente
            </div>
            <!-- Linha de logos ao estilo Omie -->
            <div class="logos-strip ">
              <div class="logos-strip-inner">
                <div v-for="brand in brandItems" :key="brand.name + '-strip'" class="logo-text">
                  <!-- {{ brand.name }} -->
                  <q-img :src="brand.imgUrl" :alt="brand.name" fit="fill" class="brand-logo" />
                </div>
              </div>
            </div>
          </section>

          <!-- COMO FUNCIONA -->
          <section id="como-funciona"
            class="section-block q-mb-xl animate__animated animate__slower animate__delay-1s animate__fadeInRight">
            <div class="section-label text-secondary-light q-mb-xs">
              Metodologia
            </div>
            <div class="section-title q-mb-md">
              Consultoria personalizada, contrato transparente e acompanhamento em tempo real
            </div>

            <div class="row q-col-gutter-md">
              <div v-for="(step, index) in steps" :key="step.title" class="col-12 col-md-3">
                <div class="step-card glass-card q-pa-md">
                  <!-- <div class="step-index">
                {{ index + 1 }}
              </div> -->
                  <div class="text-subtitle2 text-dark q-mb-xs">
                    {{ step.title }}
                  </div>
                  <div class="text-body2 text-secondary-light">
                    {{ step.text }}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- SERVIÇOS -->
          <section id="servicos" class="section-block q-mb-xl">
            <div class="section-label text-secondary-light q-mb-xs">
              Soluções
            </div>
            <div class="section-title q-mb-md">
              Migração para nuvem, automação e IA no WhatsApp, integrados ao que você já usa
            </div>

            <div class="row q-col-gutter-md">
              <div v-for="service in services" :key="service.title" class="col-12 col-md-6">
                <article class="glass-card q-pa-md service-card">
                  <div class="row items-start q-col-gutter-sm">
                    <div class="col-auto">
                      <q-icon :name="service.icon" size="32px" class="text-accent" />
                    </div>
                    <div class="col">
                      <h3 class="text-subtitle1 text-dark q-mb-xs">
                        {{ service.title }}
                      </h3>
                      <p class="text-body2 text-secondary-light q-mb-sm">
                        {{ service.text }}
                      </p>
                      <ul class="service-list text-secondary-light">
                        <li v-for="item in service.items" :key="item">
                          {{ item }}
                        </li>
                      </ul>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </section>

          <!-- SOBRE / DESENVOLVEDORES -->
          <section id="sobre" class="section-block q-mb-xl">
            <div class="section-label text-secondary-light q-mb-xs">
              Quem somos
            </div>
            <div class="row q-col-gutter-xl">
              <div class="col-12 col-md-7">
                <div class="section-title q-mb-md">
                  Especialistas em desenvolvimento, marketing, automação e gateways de pagamentos
                </div>
                <p class="text-body2 text-secondary-light q-mb-sm">
                  Somos consultores de sistemas e desenvolvedores de alta performance experientes em
                  <strong>sistemas robustos</strong> e <strong>estruturação e otimização de processos focados em redução
                    de custos</strong>. Atuamos na criação de
                  produtos digitais, migração e construção de serviços na
                  <strong>AWS e outras clouds</strong>, sempre conectando tecnologia com resultado de negócio.
                </p>
                <ul class="text-body2 text-secondary-light q-mb-md">
                  <li>Redução de custos (taxas, mensalidades e licenças).</li>
                  <li>Automação de tarefas repetitivas e fluxos de atendimento.</li>
                  <li>Uso de dados para captar leads e aumentar conversão.</li>
                  <li>Transparência total: você acompanha o projeto em tempo real.</li>
                </ul>
                <p class="text-body2 text-secondary-light">
                  Nosso objetivo é que o software seja um
                  <strong>ativo estratégico</strong> da sua empresa, e não um custo a mais.
                </p>
              </div>

              <div class="col-12 col-md-5">
                <div class="glass-card q-pa-md about-side-card">
                  <h3 class="text-subtitle1 text-dark q-mb-sm">
                    Por que vale a pena evoluir agora?
                  </h3>
                  <ul class="text-body2 text-secondary-light q-mb-md">
                    <li>Cloud mais acessível e flexível do que nunca.</li>
                    <li>IA no WhatsApp reduz fila e aumenta faturamento.</li>
                    <li>Você para de depender de plataformas com taxas abusivas.</li>
                    <li>Fazemos tudo em paralelo ao que você já usa hoje.</li>
                  </ul>
                  <q-btn unelevated no-caps class="cta-btn full-width" icon="mdi-whatsapp"
                    label="Marcar consultoria gratuita" @click="openWhatsapp" />
                  <div class="text-caption text-secondary-light q-mt-lg">
                    O tempo de entrega é definido no plano do projeto. Você conta com
                    suporte próximo e humano durante implantação e pós-go-live.
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- CONTATO -->
          <section id="contato" class="section-block q-mb-xl">
            <div class="section-label text-secondary-light q-mb-xs">
              Próximo passo
            </div>
            <div class="section-title q-mb-md">
              Deixe seus dados e receba o contato para uma consultoria sem compromisso
            </div>

            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-7">
                <div class="glass-card q-pa-md">
                  <div class="row q-col-gutter-md q-mb-md">
                    <div class="col-12 col-sm-6">
                      <q-input v-model="phone" label="WhatsApp / Telefone" outlined dense input-class="text-body2"
                        color="accent" prefix="+55" />
                    </div>
                    <div class="col-12 col-sm-6">
                      <q-input v-model="email" label="E-mail" outlined dense input-class="text-body2" color="accent" />
                    </div>
                    <div class="col-12">
                      <q-input v-model="company" label="Empresa / Projeto" outlined dense input-class="text-body2"
                        color="accent" />
                    </div>
                  </div>

                  <div class="row q-col-gutter-md items-center">
                    <div class="col-12 col-sm-auto">
                      <q-btn unelevated no-caps class="cta-btn full-width" icon="mdi-whatsapp"
                        label="Enviar dados pelo WhatsApp" @click="sendLead" />
                    </div>
                    <div class="col-12 col-sm">
                      <div class="text-caption text-secondary-light">
                        Ao clicar, abriremos o WhatsApp já com uma mensagem pronta
                        com seus dados para agilizar a consultoria gratuita.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- CTA lateral -->
              <div class="col-12 col-md-5">
                <div class="glass-card q-pa-md contact-side-card">
                  <h3 class="text-subtitle1 text-dark q-mb-sm">
                    O que vamos analisar na consultoria:
                  </h3>
                  <ul class="text-body2 text-secondary-light q-mb-md">
                    <li>Onde é possível <strong>reduzir custos</strong> com tecnologia.</li>
                    <li>Quais processos podem ser <strong>automatizados</strong> com segurança.</li>
                    <li>Como usar <strong>IA no WhatsApp</strong> sem perder o toque humano.</li>
                    <li>Integrações possíveis com sistemas que você já utiliza.</li>
                  </ul>
                  <p class="text-caption text-secondary-light">
                    Depois desse diagnóstico, elaboramos um
                    <strong>contrato transparente</strong>, revisado por você,
                    com etapas, prazos e entregas bem definidos.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <!-- FOOTER -->
          <footer class="q-my-xl q-pt-md q-pb-xl footer text-secondary-light">
            <div class="row items-center justify-between q-col-gutter-md">
              <div class="col-12 col-md-auto">
                <div class="text-caption">
                  <q-img src="/favicon.png" width="60px"></q-img><strong>{{ companyName }}</strong> — Consultoria em Nuvem, Automação e
                  IA no WhatsApp.
                </div>
                <div class="text-caption">
                  <q-icon name="mdi-instagram" color="teal" size="md"></q-icon> Acompanhe as novidades em nosso Instagram:
                  <a href="https://www.instagram.com/aitosoftwares/" style="text-decoration: none;" class="text-bold text-teal"
                  target="_blank">@aitosoftwares</a>
                </div>
                <div class="text-caption q-pt-md">
                  <q-icon name="pin_drop" color="teal" size="md"></q-icon> Atendemos Valparaíso de Goiás, região do DF, Goiânia e projetos remotos em todo o Brasil.
                </div>
              </div>
              <div class="col-12 col-md-auto text-right">
                <div class="text-caption">
                  © {{ new Date().getFullYear() }} — Todos os direitos reservados. <br> <a
                    href="https://samuelvictorol.github.io/portfolio/" class="revalia" target="_blank"
                    style="color: teal;">59.905.708/0001-34</a>
                </div>
              </div>
            </div>
          </footer>
        </div>

        <!-- BOTÃO FIXO IA -->
        <q-btn round class="ia-fab cta-btn animate__animated animate__slower animate__delay-4s animate__fadeInUp"
          @click="openIAChat()">
          <q-img src="/ia.gif" width="80px" alt="gif robo atendimento 24h com i.a" />
        </q-btn>
      </q-page>
    </q-page-container>

  </q-layout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useMeta } from 'quasar'

const isMobile = window.innerWidth < 768
const companyName = 'AITO SOFTWARES' // ajuste o nome da empresa
const drawerOpen = ref(false)

const phone = ref('')
const email = ref('')
const company = ref('')

// número do WhatsApp no formato DDI + DDD + número (sem símbolos)
const WHATSAPP_NUMBER = '556181748795' // <-- troque para o número oficial

const defaultMessage =
  'Olá! Gostaria de agendar uma consultoria gratuita para minha Empresa.'

const buildWhatsappUrl = (extra = '') => {
  const msg =
    defaultMessage +
    (extra
      ? `\n\nDados de contato:\n${extra}`
      : '')
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`
}

const whatsappUrl = computed(() => buildWhatsappUrl())

const navItems = [
  { label: 'Início', target: 'inicio' },
  { label: 'Como funciona', target: 'como-funciona' },
  { label: 'Serviços', target: 'servicos' },
  { label: 'Sobre', target: 'sobre' },
  { label: 'Contato', target: 'contato' }
]

// carrossel de marcas (dinâmico)
const brandSlide = ref(0)
const brandItems = [
  {
    name: 'Empregos.com.br',
    project: 'Automação de fluxos de cadastro e disparos com IA em WhatsApp.',
    imgUrl: 'https://static.empregos.com.br/assets/_nuxt/logo.IAkruRZb.svg'
  },
  {
    name: 'Mercado Pago',
    project: 'Automação de fluxos de cadastro e disparos com IA em WhatsApp.',
    imgUrl: 'https://woocommerce.com/wp-content/uploads/2021/05/fb-mercado-pago-v2@2x.png'
  },
  {
    name: 'CAIXA',
    project: 'Criação de Landing Page responsiva, layouts e copys com foco em divulgação da modalidade, aulas e captação de leads.',
    imgUrl: 'https://www.publicitarioscriativos.com/wp-content/uploads/2018/09/nova-identidade-visual-da-caixa-pode-custar-ate-800-milhoes.png'
  },
  {
    name: 'Eletro Nogueira',
    project: 'Migração de sistema legado e catálogo online integrado ao estoque físico + I.A para atendimento instantâneo no WhatsApp.',
    imgUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWkoE4wphrr3rmiQjB_WamkBHm2CQ4POAbnQ&s'
  },
  {
    name: 'VerdBank',
    project: 'Automação de fluxos de cadastro e disparos com IA em WhatsApp.',
    imgUrl: 'https://static.wixstatic.com/media/8c100f_2f22249dc334447eadfc4aea1c65031a~mv2.jpg/v1/fill/w_2500,h_1454,al_c/8c100f_2f22249dc334447eadfc4aea1c65031a~mv2.jpg'
  },
  {
    name: 'GLOBO',
    project: 'Desenvolvimento e manutenção de processos e pipelines, arquiteturas de sistemas e controle de riscos e qualidade.',
    imgUrl: 'https://s3.glbimg.com/v1/AUTH_b58693ed41d04a39826739159bf600a0/photos/logo_redes.png'
  },
  {
    name: 'Banco da Amazônia',
    project: 'Automação de fluxos de cadastro e disparos com IA em WhatsApp.',
    imgUrl: 'https://play-lh.googleusercontent.com/MDcygNMjShpab7QKV4KUbd0XYZyeFklcmS9qChtA-6xCdQowETqBTG3G3fDNQCe4Qw'
  },
  {
    name: 'AGHU – SUS',
    project: 'Integrações e melhorias em ambiente hospitalar universitário.',
    imgUrl: 'https://www.gov.br/ebserh/pt-br/governanca/plataformas-e-tecnologias/aghu/aghu/@@collective.cover.banner/f3c7e40f-6713-404c-a7cb-994f2a66d332/@@images/f206f037-e2a6-4094-a742-48897bce3296.png'
  },
  {
    name: 'Coco Bambu',
    project: 'Soluções para gestão de processos e guias, com alta disponibilidade. Manutenção em sistemas críticos e legados.',
    imgUrl: 'https://mir-s3-cdn-cf.behance.net/projects/404/a87f35210460461.Y3JvcCwxMjMxLDk2MywzNjIsNDU.png'
  },
  {
    name: 'Tribunal de Justiça do Goiás',
    project: 'Soluções para gestão de processos e guias, com alta disponibilidade. Manutenção em sistemas críticos e legados.',
    imgUrl: 'https://tjgo.4biz.globalweb.com.br/4biz/logoImages/44.png'
  },
  {
    name: 'ChatCar IA',
    project: 'Automação de fluxos de cadastro e disparos com IA em WhatsApp.',
    imgUrl: 'https://chatcar.me/logo.jpeg'
  },
  {
    name: 'Cast Group',
    project: 'Migração de sistema legado e catálogo online integrado ao estoque físico + I.A para atendimento instantâneo no WhatsApp.',
    imgUrl: 'https://upbase.com.br/wp-content/uploads/2023/10/maxresdefault.jpg'
  },
  {
    name: 'Sinerji',
    project: 'Automação de fluxos de cadastro e disparos com IA em WhatsApp.',
    imgUrl: 'https://media.glassdoor.com/sqll/7882017/sinerji-brazil-squarelogo-1665494683816.png'
  },
  // você pode adicionar mais itens aqui depois
]

const steps = [
  {
    title: '1. Consultoria gratuita',
    text: 'Online ou presencial* (dependendo da distância) para entender sua realidade, custos atuais e objetivos.'
  },
  {
    title: '2. Diagnóstico e plano',
    text: 'Identificamos onde reduzir taxas, cortar mensalidades, melhorar processos e usar IA a favor das vendas.'
  },
  {
    title: '3. Implementação em etapas',
    text: 'Migramos para a nuvem, criamos automações e IA no WhatsApp integradas aos sistemas que você já utiliza.'
  },
  {
    title: '4. Contrato claro e suporte',
    text: 'Contrato revisado por você, acompanhamento em tempo real e suporte de excelência após a entrega.'
  }
]

const services = [
  {
    icon: 'cloud_sync',
    title: 'Migração de sistemas para a nuvem',
    text: 'Leve seus sistemas para a cloud com segurança, escalabilidade e foco em economia.',
    items: [
      'Diagnóstico de infraestrutura e custos recorrentes.',
      'Plano de migração por etapas, sem parar a operação.',
      'Uso de serviços gerenciados (AWS e outras clouds).',
      'Monitoramento e otimização contínua da conta.'
    ]
  },
  {
    icon: 'autorenew',
    title: 'Automação de processos e rotinas',
    text: 'Automatize tarefas repetitivas e fluxos críticos para ganhar tempo e previsibilidade.',
    items: [
      'Automação de atendimento inicial e triagem.',
      'Integração com ERPs e sistemas legados.',
      'Gatilhos automáticos baseados em eventos e dados.',
      'Dashboards com visão em tempo real.'
    ]
  },
  {
    icon: 'mdi-whatsapp',
    title: 'IA no WhatsApp focada em vendas',
    text: 'Bots inteligentes que entendem seu negócio, geram leads e não soam robóticos.',
    items: [
      'Atendimento 24/7 sem perder o toque humano.',
      'Integração com CRM e funil de vendas.',
      'Fluxos personalizados por produto ou serviço.',
      'Takeover fácil para o vendedor quando necessário.'
    ]
  },
  {
    icon: 'insights',
    title: 'Dados, marketing e conversão',
    text: 'Transforme dados em decisões e campanhas que trazem retorno de verdade.',
    items: [
      'Mapeamento de oportunidades em sua base.',
      'Funis de lead à venda com copy otimizada.',
      'Landing pages de alta conversão.',
      'Relatórios claros para tomada de decisão.'
    ]
  }
]

function scrollToSection(id) {
  drawerOpen.value = false
  if (typeof window === 'undefined') return

  const el = document.getElementById(id)
  if (!el) return

  const top = el.getBoundingClientRect().top + window.scrollY - 80
  window.scrollTo({ top, behavior: 'smooth' })
}

function openWhatsapp() {
  if (typeof window !== 'undefined') {
    window.open(whatsappUrl.value, '_blank')
  }
}

function sendLead() {
  const parts = []
  if (phone.value) parts.push(`Telefone/WhatsApp: ${phone.value}`)
  if (email.value) parts.push(`E-mail: ${email.value}`)
  if (company.value) parts.push(`Empresa/Projeto: ${company.value}`)

  const url = buildWhatsappUrl(parts.join('\n'))
  if (typeof window !== 'undefined') {
    window.open(url, '_blank')
  }
}

useMeta(() => ({
  title:
    'AITO SOFTWARES',
  meta: [
    {
      name: 'description',
      content:
        'Consultoria especializada em migração de sistemas para a nuvem, automação de processos e IA no WhatsApp. Foco em redução de custos, aumento de vendas e integração com sistemas existentes em Valparaíso de Goiás, DF e Goiânia.'
    },
    {
      name: 'keywords',
      content:
        'migração para nuvem valparaíso de goiás, automação de processos df, consultoria em nuvem goiânia, IA no WhatsApp, chatbot whatsapp vendas, redução de custos com sistemas, criar software próprio, integração sistemas legados'
    },
    {
      property: 'og:title',
      content:
        'Migração para Nuvem, Automação e IA no WhatsApp — Consultoria Especializada'
    },
    {
      property: 'og:description',
      content:
        'Reduza taxas, corte mensalidades desnecessárias e automatize seu negócio com soluções em nuvem e IA no WhatsApp.'
    }
  ]
}))
</script>

<style scoped>
.landing-page {
  position: relative;
  min-height: 100vh;
  color: #0f172a;
  overflow: hidden;
}

.landing-bg {
  position: fixed;
  inset: 0;
  background:
    radial-gradient(circle at top left, #1a758093, transparent 55%),
    radial-gradient(circle at bottom right, #468af088, transparent 55%),
    linear-gradient(135deg, #e0f7fa, #f9fafb);
  z-index: -2;
}

.page-inner {
  max-width: 1180px;
  margin: 0 auto;
}

/* HEADER */

.landing-header {
  position: sticky;
  top: 12px;
  z-index: 10;
  backdrop-filter: blur(18px);
  background: rgba(255, 255, 255, 0.92);
  border-radius: 999px;
  padding: 8px 18px;
  border: 1px solid rgba(148, 163, 184, 0.3);
  box-shadow: 0 14px 40px rgba(148, 163, 184, 0.35);
}

.logo-dot {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, #14b8a6, #14b8a6);
  box-shadow: 0 0 18px rgba(56, 189, 248, 0.5);
}

.nav-link {
  font-size: 0.85rem;
  opacity: 0.9;
}

.nav-mobile {
  border-radius: 18px;
}

/* SEÇÕES */

.section-block {
  background: #f1f8f8;
  border-radius: 32px;
  padding: 32px 24px;
  box-shadow: 0 18px 55px rgba(15, 23, 42, 0.06);
}

.hero-block {
  padding-top: 40px;
  padding-bottom: 40px;
}

/* HERO */

.hero-title {
  font-size: clamp(2rem, 3vw, 2.6rem);
  line-height: 1.12;
}

.hero-subtitle {
  font-size: 1rem;
  color: #4b5563;
}

.hero-badges .badge-chip {
  font-size: 0.78rem;
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.7);
  background: rgba(248, 250, 252, 0.9);
  color: #374151;
}

.hero-media {
  border-radius: 28px;
}

.video-placeholder {
  border-radius: 24px;
  background: linear-gradient(135deg, #e0f2fe, #f9fafb);
}

.section-label {
  font-size: 0.78rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.section-title {
  font-size: clamp(1.5rem, 2.1vw, 2rem);
}

/* GLASS */

.glass-card {
  background: rgba(255, 255, 255, 0.178);
  border-radius: 24px;
  border: 1px solid rgba(148, 163, 184, 0.25);
  backdrop-filter: blur(20px);
  filter: drop-shadow(0 8px 24px rgba(42, 42, 43, 0.37));
}

/* LOGOS STRIP */

.logos-strip {
  overflow: hidden;
}

.logos-strip-inner {
  display: inline-flex;
  gap: 32px;
  white-space: nowrap;
  animation: logos-scroll 38s linear infinite;
}

.logo-text {
  font-size: 0.9rem;
  color: #6b7280;
}

@keyframes logos-scroll {
  0% {
    transform: translateX(0);
  }

  50% {
    transform: translateX(-50%);
  }

  100% {
    transform: translateX(0);
  }
}

/* CARROSSEL */

.brands-carousel {
  border-radius: 24px;
  margin-top: 4px;
}

.brand-card {
  width: 100%;
  max-width: 520px;
}

.brand-logo {
  width: 150px;
  max-height: 120px;
  border-radius: 12px;
  background: #f3f4f6;
  padding: 6px 10px;
}

.brand-name {
  font-weight: 600;
  font-size: 0.98rem;
  color: #111827;
}

.brand-project {
  font-size: 0.88rem;
  color: #6b7280;
}

/* STEPS */

.step-card {
  position: relative;
  min-height: 180px;
}

.step-index {
  position: absolute;
  top: 10px;
  right: 14px;
  font-size: 0.9rem;
  color: #818cf8;
}

/* SERVICES */

.service-card {
  height: 100%;
}

.service-list {
  padding-left: 1.1rem;
  margin: 0;
}

.service-list li {
  margin-bottom: 4px;
}

/* SOBRE / CONTATO */

.about-side-card,
.contact-side-card {
  height: 100%;
}

/* CTA BUTTON */

.cta-btn {
  background: linear-gradient(135deg, #22c55e, #20b4be);
  color: #f9fafb;
  font-weight: 600;
  border-radius: 999px;
  transition: all 0.3s ease;
}

.cta-btn-2 {
  background: linear-gradient(135deg, #20b4be, #0bdf75);
  color: #f9fafb;
  font-weight: 600;
  border-radius: 999px;
  transition: all 0.3s ease;
}

.cta-btn:hover {
  filter: drop-shadow(0 8px 24px rgba(34, 197, 94, 0.5));
  transform: translateY(-2px);
}

.cta-btn-2:hover {
  filter: drop-shadow(0 8px 24px rgba(34, 145, 197, 0.5));
  transform: translateY(-2px);
}

/* TEXTO E CORES */

.text-secondary-light {
  color: #6b7280;
}

.accent {
  color: #16a34a;
}

.accent-text {
  color: #16a34a;
}

/* FOOTER */

.footer {
  border-top: 1px solid rgba(148, 163, 184, 0.3);
}

/* WHATSAPP FAB */

.ia-fab {
  position: fixed;
  right: 18px;
  bottom: 18px;
  z-index: 40;
}

/* RESPONSIVO */

@media (max-width: 767px) {
  .landing-header {
    border-radius: 18px;
  }

  .section-block {
    padding: 24px 18px;
  }

  .hero-title {
    font-size: 1.9rem;
  }
}

#marcas {
  background-color: #00000000;
  background: #00000000;
}
</style>
