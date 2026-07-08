<template>
  <q-layout view="lHh Lpr lFf" class="ait-root ">
    <!-- HEADER (minimal, squared) -->
    <q-header elevated class="ait-header">
      <div class="ait-wrap">
        <div class="row items-center justify-between q-py-sm">
          <!-- Brand -->
          <div class="row items-center no-wrap ">
            <q-btn flat dense  class="animate__animated animate__fadeInLeft animate__slower animate__delay-1s" @click="scrollTo('top')" aria-label="Topo">
              <q-img src="/favicon.png" width="60px" height="34px" style="border-radius: 6px" loading="lazy" @click="goToHome()"/>
            </q-btn>
            <div class="column">
              <div class="row items-center no-wrap">
                <div class="">{{ companyName }}</div>
                <!-- <q-chip class="gt-xs q-ml-sm" dense outline color="grey-8" text-color="grey-9"
                  icon="mdi-shield-check-outline"> 
                  Software Studio
                </q-chip> -->
              </div>
              <!-- <div class="text-caption text-grey-6 gt-sm">
                IA aplicada • Cloud • Automação • Produtos digitais • Integrações
              </div> -->
            </div>
          </div>

          <!-- Desktop nav -->
          <div class="gt-sm row items-center no-wrap">
            <q-btn v-for="item in navItems" :key="item.label" flat dense no-caps class="ait-nav-btn q-mt-xs"
              :icon="item.icon" :label="item.label" @click="handleNav(item)" />
            <q-separator vertical inset class="q-mx-md" />
            <q-btn unelevated no-caps class="ait-cta" icon="mdi-whatsapp" label="Diagnóstico gratuito"
              @click="openWhatsapp('Quero uma consultoria gratuita (custos, automação e IA).')" />
          </div>

          <!-- Mobile actions -->
          <div class="lt-md row items-center">
            <q-btn unelevated no-caps class="ait-cta q-mr-sm" icon="mdi-whatsapp"
              @click="openWhatsapp()" />
            <q-btn flat round dense :icon="drawerOpen ? 'mdi-close' : 'mdi-menu'" @click="drawerOpen = !drawerOpen"
              aria-label="Menu" />
          </div>
        </div>

        <!-- Mobile menu -->
        <q-slide-transition>
          <div v-if="drawerOpen" class="lt-md  q-mb-sm">
            <q-btn v-for="item in navItems" :key="item.label + '-m'" flat dense no-caps
              class="full-width text-left ait-mobile-btn q-mb-xs" :icon="item.icon" :label="item.label"
              @click="handleNav(item, true)" />
            <q-btn unelevated no-caps class="full-width ait-cta q-mt-sm" icon="mdi-whatsapp"
              label="Agendar diagnóstico gratuito"
              @click="openWhatsapp('Quero agendar uma consultoria gratuita.'); drawerOpen = false" />
          </div>
        </q-slide-transition>
      </div>
    </q-header>

    <q-page-container>
      <q-page class="ait-page">
        <div id="galaxy-bg" class="galaxy-bg">
          <q-img src="/galaxy.png" class="galaxy-img" fit="cover" />
        </div>
        <div id="top" class="ait-bg"></div>
        <div class="ait-wrap q-pb-md">
          <!-- HERO (VSL + copy strong) -->
          <section id="inicio" class="ait-hero q-pa-md rounded-borders">
            <div class="ait-hero-grid">
              <!-- VSL -->
              <div class="ait-vsl">
                <div class="ait-panel">
                  <!-- <div class="ait-panel-head">
                    <div class="row items-center no-wrap">
                      <q-icon name="mdi-play-circle-outline" size="18px" class="q-mr-sm" />
                      <div class="text-subtitle2 text-grey-9">Assista em 60 segundos</div>
                    </div>
                    <q-chip dense outline color="grey-8" text-color="grey-9" icon="mdi-timer-outline">
                      VSL
                    </q-chip>
                  </div> -->

                  <div class="q-pa-sm">
                    <q-responsive :ratio="16 / 9" class="ait-video">
                      <!-- Se quiser embed real, só preencher vslUrl -->
                      <!-- <iframe v-if="vslUrl" :src="vslUrl" title="VSL AITO" frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen class="ait-iframe" /> -->
                      <q-img @click="iaChat = true" src="/vsl.png" fit="cover" class="animate__animated animate__fadeInRight animate__slower animate__delay-2s ait-iframe cursor-pointer rounded-borders" />
                      <!-- <div  class="ait-video-placeholder">
                        <q-icon name="mdi-play" size="56px" class="text-grey-9" />
                        <div class="text-body2 text-grey-8 q-mt-sm text-center">
                          Cole sua VSL aqui (YouTube/Vimeo/embed).<br />
                          <span class="text-caption text-grey-6">Estrutura pronta pra conversão.</span>
                        </div>
                      </div> -->
                    </q-responsive>

                    <div class="row q-col-gutter-sm q-mt-sm">
                      <div class="col-12 col-sm-6">
                        <q-btn unelevated no-caps class="animate__animated animate__fadeInUp animate__slower animate__delay-2s  ait-cta full-width" icon="mdi-whatsapp"
                          label="Quero reduzir custos"
                          @click="openWhatsapp('Quero reduzir custos com tecnologia (cloud/automação/IA).')" />
                      </div>
                      <div class="col-12 col-sm-6">
                        <q-btn outline no-caps class="animate__animated animate__fadeInUp animate__slower animate__delay-3s  ait-outline full-width" icon="mdi-briefcase-outline"
                          label="Ver cases" @click="scrollTo('cases')" />
                      </div>
                    </div>

                    <div class="ait-microproof animate__animated animate__slideInLeft animate__slower animate__delay-3s   q-mt-sm">
                      <q-icon name="mdi-check-circle-outline" class="q-mr-xs" />
                      Diagnóstico gratuito • Contrato claro • Entrega por etapas • Suporte real
                    </div>
                  </div>
                </div>
              </div>

              <!-- Copy -->
              <div class="ait-copy animate__animated animate__slideInUp animate__slower animate__delay-3s">
                <!-- <div class="ait-kicker">
                  <q-icon name="mdi-lightning-bolt-outline" size="18px" class="q-mr-xs" />
                  Engenharia aplicada ao seu resultado
                </div> -->

                <h1 class="ait-title">
                  Software, IA e cloud para
                  <span class="ait-grad">vender mais, automatizar e escalar.</span>
                </h1>

                <!-- <p class="ait-subtitle">
                  Somos uma equipe de <strong>engenheiros</strong>, <strong>desenvolvedores</strong> e especialistas em
                  <strong>automação, IA e design de software</strong>. Criamos soluções sob medida que
                  <strong>reduzem custo</strong>, <strong>aumentam conversão</strong> e escalam sua empresa com segurança.
                </p> -->

                <div class="ait-bullets">
                  <div class="ait-bullet">
                    <q-icon name="mdi-robot-outline" size="18px" class="q-mr-sm" />
                    IA no WhatsApp que atende, qualifica e entrega contexto para o time comercial
                  </div>
                  <div class="ait-bullet">
                    <q-icon name="mdi-cloud-outline" size="18px" class="q-mr-sm" />
                    Migração para cloud com arquitetura enxuta, monitoramento e custo previsível
                  </div>
                  <div class="ait-bullet">
                    <q-icon name="mdi-cog-sync-outline" size="18px" class="q-mr-sm" />
                    Automação de rotinas e integrações com legado, ERP, CRM e pagamentos
                  </div>
                  <div class="ait-bullet">
                    <q-icon name="mdi-chart-line" size="18px" class="q-mr-sm" />
                    Produtos, landing pages e funis com tracking pronto para decisão de ROI
                  </div>
                </div>

                <div class="ait-stats">
                  <div class="ait-stat">
                    <div class="ait-stat-num">24/7</div>
                    <div class="ait-stat-label">Atendimento com IA</div>
                  </div>
                  <div class="ait-stat">
                    <div class="ait-stat-num">+Clareza</div>
                    <div class="ait-stat-label">Métrica no funil</div>
                  </div>
                  <div class="ait-stat">
                    <div class="ait-stat-num">-Custo</div>
                    <div class="ait-stat-label">Cloud otimizada</div>
                  </div>
                </div>

                <div class="row q-col-gutter-sm q-mt-md">
                  <div class="col-12 col-sm-7">
                    <q-btn unelevated no-caps class="ait-cta full-width" icon="mdi-whatsapp"
                      label="Quero um diagnóstico gratuito"
                      @click="openWhatsapp('Quero um diagnóstico gratuito. Vou te explicar meu cenário e metas.')" />
                  </div>
                  <div class="col-12 col-sm-5">
                    <q-btn outline no-caps class="ait-outline full-width" icon="mdi-arrow-down" label="Como funciona"
                      @click="scrollTo('metodo')" />
                  </div>
                </div>

                <!-- <div class="ait-trustline q-mt-md">
                  <span class="text-caption text-grey-6">Experiência em ambientes críticos:</span>
                  <div class="row q-col-gutter-xs q-mt-xs">
                    <div class="col-auto" v-for="t in trustTags" :key="t">
                      <q-chip dense outline color="grey-8" text-color="grey-9" icon="mdi-domain">
                        {{ t }}
                      </q-chip>
                    </div>
                  </div>
                </div> -->
              </div>
            </div>
          </section>

          <!-- CLIENTS / LOGOS (clean strip) -->
          <section id="clientes" class="ait-section">
            <div class="ait-section-head">
              <div class="ait-section-title">Marcas, produtos e operações que já passaram pelo nosso teclado</div>
            </div>

            <div class="ait-logos">
              <div class="ait-logos-track">
                <div v-for="b in brandStrip" :key="b.name + '-1'" class="ait-logo">
                  <q-img class="rounded-borders" :src="b.imgUrl" :alt="b.name" fit="contain" />
                </div>
                <div v-for="b in brandStrip" :key="b.name + '-2'" class="ait-logo">
                  <q-img class="rounded-borders" :src="b.imgUrl" :alt="b.name" fit="contain" />
                </div>
              </div>
            </div>
          </section>

          <!-- METHOD (minimal steps) -->
          <section id="metodo" class="ait-section">
            <div class="ait-section-head">
              <div class="ait-section-title">Método enxuto, técnico e rastreável</div>
            </div>

            <div class="ait-steps">
              <div class="ait-step" v-for="s in steps" :key="s.title">
                <div class="ait-step-top">
                  <q-icon :name="s.icon" size="20px" />
                  <div class="ait-step-title">{{ s.title }}</div>
                </div>
                <div class="ait-step-text">{{ s.text }}</div>
              </div>
            </div>
          </section>

          <!-- SOLUTIONS (grid minimal) -->
          <section id="solucoes" class="ait-section">
            <div class="ait-section-head">
              <div class="ait-section-title">Soluções para destravar operação, venda e escala</div>
            </div>

            <div class="ait-cards">
              <div class="ait-card" v-for="s in services" :key="s.title">
                <div class="ait-card-top">
                  <q-icon :name="s.icon" size="22px" />
                  <div class="ait-card-title">{{ s.title }}</div>
                </div>
                <div class="ait-card-text">{{ s.text }}</div>
                <ul class="ait-list">
                  <li v-for="i in s.items" :key="i">{{ i }}</li>
                </ul>

                <div class="row items-center justify-between q-mt-sm">
                  <q-chip dense outline color="grey-8" text-color="grey-9" icon="mdi-check-decagram">
                    Entrega por etapas
                  </q-chip>
                  <q-btn flat dense no-caps icon="mdi-whatsapp" label="Quero isso"
                    @click="openWhatsapp(`Quero falar sobre: ${s.title}`)" />
                </div>
              </div>
            </div>
          </section>

          <!-- CASES / PRODUCTS -->
          <section id="cases" class="ait-section">
            <div class="ait-section-head">
              <div class="ait-section-title">Produtos e cases</div>
            </div>

            <div class="ait-cases">
              <div class="ait-case" v-for="c in cases" :key="c.title">
                <div class="ait-case-head">
                  <div class="row items-center no-wrap">
                    <q-icon :name="c.icon" size="22px" class="q-mr-sm" />
                    <div>
                      <div class="ait-case-title">{{ c.title }}</div>
                      <div class="ait-case-sub">{{ c.subtitle }}</div>
                    </div>
                  </div>
                  <q-btn outline no-caps class="ait-outline" :icon="c.icon" label="Conhecer Projeto"
                    @click="showProject(c.title)" />
                </div>

                <ul class="ait-list q-mt-sm">
                  <li v-for="i in c.items" :key="i">{{ i }}</li>
                </ul>

                <div class="row q-col-gutter-xs q-mt-sm">
                  <div class="col-auto" v-for="t in c.tags" :key="t">
                    <q-chip dense outline color="grey-8" text-color="grey-9" icon="mdi-tag-outline">
                      {{ t }}
                    </q-chip>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- SATISFACTION -->
          <section id="satisfacao" class="ait-section">
            <div class="ait-section-head">
              <div class="ait-section-title">Previsibilidade, suporte e confiança</div>
            </div>

            <div class="ait-sat-grid">
              <div class="ait-sat-left">
                <div class="ait-panel">
                  <div class="ait-panel-head">
                    <div class="text-subtitle2 text-grey-9">O que muda na rotina</div>
                    <q-chip dense outline color="grey-8" text-color="grey-9" icon="mdi-handshake-outline">
                      Suporte próximo
                    </q-chip>
                  </div>
                  <q-separator />
                  <div class="q-pa-md">
                    <div class="ait-sat-row" v-for="m in satisfaction" :key="m.title">
                      <div class="row items-center no-wrap">
                        <q-icon :name="m.icon" size="18px" class="q-mr-sm" />
                        <div class="text-body2 text-grey-9 text-weight-medium">{{ m.title }}</div>
                      </div>
                      <div class="text-caption text-grey-7 q-mt-xs">{{ m.text }}</div>
                      <q-separator spaced />
                    </div>

                    <q-btn unelevated no-caps class="ait-cta full-width" icon="mdi-whatsapp" label="Quero conversar"
                      @click="openWhatsapp('Quero conversar sobre automação/IA/cloud para meu negócio.')" />
                  </div>
                </div>
              </div>

              <div class="ait-sat-right">
                <div class="ait-testimonials">
                  <div class="ait-quote" v-for="t in testimonials" :key="t.name + t.role">
                    <div class="row items-center justify-between">
                      <div class="row items-center">
                        <q-img v-if="t.img" :src="t.img" :alt="t.name" width="32px" height="32px" class="ait-avatar"
                          fit="fill" />
                        <div class="q-ml-sm">
                          <div class="text-body2 text-grey-9 text-weight-medium">{{ t.name }}</div>
                          <div class="text-caption text-grey-6">{{ t.role }}</div>
                        </div>
                      </div>
                      <q-rating readonly :model-value="t.stars" size="18px" color="amber" />
                    </div>

                    <div class="ait-quote-text q-mt-sm">
                      “{{ t.text }}”
                    </div>

                    <div class="text-caption text-grey-6 q-mt-sm">
                      <q-icon name="mdi-check-decagram" class="q-mr-xs" />
                      {{ t.context }}
                    </div>
                  </div>
                </div>

                <div class="ait-note q-mt-md">
                  <q-icon name="mdi-lock-check-outline" size="18px" class="q-mr-sm" />
                  Contrato claro, etapas definidas e acompanhamento em tempo real.
                </div>
              </div>
            </div>
          </section>

          <!-- FOUNDERS -->
          <section id="founders" class="ait-section">
            <div class="ait-section-head">
              <div class="ait-section-title">Quem constrói com você</div>
              <!-- <div class="ait-section-sub">
                Criado por Samuel Victor e Dion — especialistas em tecnologia com experiência em bancos, sistemas
                críticos e as melhores formações do país como Universidade de Brasília, Universidade Federal de Goiás.
              </div> -->
            </div>

            <div class="ait-founders">
              <div class="ait-founder" v-for="f in founders" :key="f.name">
                <div class="row items-start q-col-gutter-md">
                  <div class="col-auto">
                    <q-avatar size="100px" square class="ait-avatar">
                      <q-img v-if="f.img" :src="f.img" :alt="f.name" fit="cover" />
                      <q-icon v-else name="mdi-account-circle-outline" size="56px" class="text-grey-7" />
                    </q-avatar>
                  </div>
                  <div class="col">
                    <div class="row items-center justify-between">
                      <div>
                        <div class="text-subtitle1 text-grey-9 text-weight-bold">{{ f.name }}</div>
                        <div class="text-caption text-grey-6">{{ f.role }}</div>
                      </div>
                      <q-chip dense outline color="grey-8" text-color="grey-9" icon="mdi-briefcase-outline">
                        Founder
                      </q-chip>
                    </div>

                    <div class="text-body2 text-grey-8 q-mt-sm">
                      {{ f.summary }}
                    </div>

                    <div class="row q-col-gutter-xs q-mt-sm">
                      <div class="col-auto" v-for="h in f.highlights" :key="h">
                        <q-chip dense outline color="grey-8" text-color="grey-9" icon="mdi-check">
                          {{ h }}
                        </q-chip>
                      </div>
                    </div>

                    <!-- <div class="text-caption text-grey-6 q-mt-sm">
                      <q-icon name="mdi-domain" class="q-mr-xs" />
                      Experiência: {{ trustTags.join(' • ') }}
                    </div> -->
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- CONTACT + REFERRAL (tabs) -->
          <section id="contato" class="ait-section">
            <div class="ait-section-head">
              <div class="ait-section-title">Vamos entender seu cenário</div>
            </div>

            <div class="ait-tabs">
              <q-tabs v-model="activeTab" dense align="left" class="ait-qtabs" active-color="dark"
                indicator-color="dark">
                <q-tab name="lead" icon="mdi-email-fast-outline" label="Falar com a AITO" />
                <q-tab name="ref" icon="mdi-cash-multiple" label="Indique & Ganhe" />
              </q-tabs>

              <q-separator />

              <q-tab-panels v-model="activeTab" animated class="ait-panels">
                <!-- Lead -->
                <q-tab-panel name="lead" class="q-pa-none">
                  <div class="ait-form-grid">
                    <div class="ait-form-side">
                      <div class="ait-form-note">
                        <div class="ait-form-note-title">O que analisamos no diagnóstico</div>
                        <ul class="ait-list">
                          <li>Onde dá pra <strong>reduzir custos</strong> (cloud, retrabalho, licenças, taxa).</li>
                          <li>Quais rotinas viram <strong>automação segura</strong>.</li>
                          <li>Como usar <strong>IA no WhatsApp</strong> sem perder o toque humano.</li>
                          <li>Integrações com legado/ERP/CRM/pagamentos/catálogos.</li>
                        </ul>

                        <div class="row items-center q-mt-sm">
                          <q-icon name="mdi-post-outline" class="q-mr-sm" />
                          <!-- <q-btn flat dense no-caps label="Ir para o Blog" @click="goBlog" /> -->
                        </div>
                      </div>
                    </div>

                    <div class="ait-form-main">
                      <q-form @submit.prevent="sendLead">
                        <div class="row q-col-gutter-sm">
                          <div class="col-12 col-sm-6">
                            <q-input v-model="lead.name" dense outlined label="Seu nome" />
                          </div>
                          <div class="col-12 col-sm-6">
                            <q-input v-model="lead.phone" dense outlined label="WhatsApp" prefix="+55" />
                          </div>
                          <div class="col-12 col-sm-6">
                            <q-input v-model="lead.email" dense outlined label="E-mail" />
                          </div>
                          <div class="col-12 col-sm-6">
                            <q-input v-model="lead.company" dense outlined label="Empresa / Projeto" />
                          </div>
                          <div class="col-12">
                            <q-input v-model="lead.message" dense outlined type="textarea" autogrow
                              label="O que você quer resolver?" />
                          </div>
                        </div>

                        <div class="row q-col-gutter-sm q-mt-sm">
                          <div class="col-12 col-sm-7">
                            <q-btn unelevated no-caps class="ait-cta full-width" icon="mdi-whatsapp"
                              label="Enviar pelo WhatsApp" type="submit" />
                          </div>
                          <div class="col-12 col-sm-5">
                            <q-btn outline no-caps class="ait-outline full-width" icon="mdi-arrow-up"
                              label="Voltar ao topo" @click="scrollTo('top')" />
                          </div>
                        </div>

                        <div class="text-caption text-grey-6 q-mt-sm">
                          Ao clicar, abrimos o WhatsApp com uma mensagem pronta (rápido e direto).
                        </div>
                      </q-form>
                    </div>
                  </div>
                </q-tab-panel>

                <!-- Referral -->
                <q-tab-panel name="ref" class="q-pa-none">
                  <div class="ait-form-grid">
                    <div class="ait-form-side">
                      <div class="ait-form-note">
                        <div class="ait-form-note-title">Indique & ganhe (network)</div>
                        <div class="text-body2 text-grey-8">
                          Indicou e fechou contrato? A comissão é <strong>negociável</strong> conforme o tamanho do
                          projeto.
                          Transparente, combinado e registrado.
                        </div>

                        <div class="q-mt-sm">
                          <q-banner class="ait-banner" rounded>
                            <template #avatar>
                              <q-icon name="mdi-cash-fast" />
                            </template>
                            <div class="text-body2">
                              Comissão e formato de pagamento: <strong>negociável</strong>.
                            </div>
                          </q-banner>
                        </div>

                        <ul class="ait-list q-mt-sm">
                          <li>Você indica</li>
                          <li>Nós diagnosticamos e propomos</li>
                          <li>Fechou? Comissão combinada</li>
                          <li>Você acompanha o status</li>
                        </ul>
                      </div>
                    </div>

                    <div class="ait-form-main">
                      <q-form @submit.prevent="sendReferral">
                        <div class="row q-col-gutter-sm">
                          <div class="col-12 col-sm-6">
                            <q-input v-model="referral.name" dense outlined label="Seu nome" />
                          </div>
                          <div class="col-12 col-sm-6">
                            <q-input v-model="referral.phone" dense outlined label="Seu WhatsApp" prefix="+55" />
                          </div>
                          <div class="col-12">
                            <q-input v-model="referral.leadName" dense outlined label="Nome do indicado" />
                          </div>
                          <div class="col-12">
                            <q-input v-model="referral.company" dense outlined label="Empresa / Projeto do indicado" />
                          </div>
                          <div class="col-12">
                            <q-input v-model="referral.notes" dense outlined type="textarea" autogrow
                              label="Contexto (o que ele precisa?)" />
                          </div>
                        </div>

                        <div class="row q-col-gutter-sm q-mt-sm">
                          <div class="col-12 col-sm-7">
                            <q-btn unelevated no-caps class="ait-cta full-width" icon="mdi-whatsapp"
                              label="Enviar indicação" type="submit" />
                          </div>
                          <!-- <div class="col-12 col-sm-5">
                            <q-btn outline no-caps class="ait-outline full-width" icon="mdi-post-outline"
                              label="Ver blog" @click="goBlog" />
                          </div> -->
                        </div>
                      </q-form>
                    </div>
                  </div>
                </q-tab-panel>
              </q-tab-panels>
            </div>
          </section>

          <!-- FOOTER (minimal) -->
          <footer class="ait-footer q-mt-lg">
            <div class="row items-center justify-between q-col-gutter-md">
              <div class="col-12 col-md-auto">
                <div class="row items-center no-wrap">
                  <q-img src="/favicon.png" width="34px" height="34px" style="border-radius: 6px" />
                  <div class="q-ml-sm">
                    <div class="text-subtitle2 text-grey-9 text-weight-bold">{{ companyName }}</div>
                    <div class="text-caption text-grey-6">Cloud • Automação • IA no WhatsApp • Integrações</div>
                  </div>
                </div>
                <div class="text-caption text-grey-6 q-mt-sm">
                  <q-icon name="mdi-map-marker-outline" class="q-mr-xs" />
                  Distrito Federal e Entorno • Projetos Remotos (Brasil)
                </div>
              </div>

              <div class="col-12 col-md-auto text-right">
                <div class="text-caption text-grey-6">© {{ currentYear }} — Todos os direitos reservados.</div>
                <div class="text-caption text-grey-6">
                  Criado por <strong>Samuel Victor</strong> & <strong>Dion</strong>.
                </div>
              </div>
            </div>
          </footer>
        </div>

        <!-- IA FAB (mantém IAChatComponent) -->
        <q-btn round class="ait-ia-fab animate__animated animate__zoomIn animate__slower animate__delay-3s " @click="iaChat = !iaChat" aria-label="Abrir IA">
          <q-img src="/ia.gif" width="70px" alt="IA atendimento" />
        </q-btn>

        <q-dialog v-model="iaChat" style="backdrop-filter: blur(14px);">
          <IAChatComponent class="w100" />
        </q-dialog>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import IAChatComponent from 'src/components/IAChatComponent.vue'

const $q = useQuasar()
const router = useRouter()

const companyName = 'AITOSOFTWARES'
const currentYear = new Date().getFullYear()

const drawerOpen = ref(false)
const iaChat = ref(false)

const activeTab = ref('lead')

// VSL: se quiser embed real, cole o link embed (ex: https://www.youtube.com/embed/VIDEO_ID)
const vslUrl = ref('') // deixe vazio pra aparecer placeholder

const WHATSAPP_NUMBER = '5561981748795'

const trustTags = ['CAIXA', 'BASA', 'GLOBO', 'TJGO', 'SUS', 'COCOBAMBU', 'AWS', 'OPENAI']

const navItems = [
  { label: 'Início', icon: 'mdi-home-outline', type: 'scroll', target: 'inicio' },
  { label: 'Clientes', icon: 'mdi-domain', type: 'scroll', target: 'clientes' },
  { label: 'Método', icon: 'mdi-map-check-outline', type: 'scroll', target: 'metodo' },
  { label: 'Soluções', icon: 'mdi-layers-outline', type: 'scroll', target: 'solucoes' },
  { label: 'Cases', icon: 'mdi-briefcase-outline', type: 'scroll', target: 'cases' },
  { label: 'Satisfação', icon: 'mdi-star-outline', type: 'scroll', target: 'satisfacao' },
  { label: 'Founders', icon: 'mdi-account-group-outline', type: 'scroll', target: 'founders' },
  { label: 'Contato', icon: 'mdi-email-fast-outline', type: 'scroll', target: 'contato' },
  // { label: 'Blog', icon: 'mdi-post-outline', type: 'route', to: '/blog' }
]

const steps = [
  { icon: 'mdi-magnify', title: 'Diagnóstico', text: 'Mapeamos custo, gargalo, risco e oportunidade com base no seu cenário real.' },
  { icon: 'mdi-pencil-ruler', title: 'Plano & arquitetura', text: 'Transformamos o diagnóstico em escopo, etapas e decisões técnicas claras.' },
  { icon: 'mdi-tools', title: 'Execução por etapas', text: 'Você acompanha entregas pequenas, testáveis e úteis antes do fechamento final.' },
  { icon: 'mdi-rocket-launch-outline', title: 'Go-live & otimização', text: 'Publicamos, medimos, ajustamos e deixamos a operação pronta para evoluir.' }
]

const services = [
  {
    icon: 'mdi-robot-outline',
    title: 'IA no WhatsApp (vendas e suporte)',
    text: 'Agentes que entendem contexto, qualificam oportunidades e mantêm o humano no controle.',
    items: [
      'Atendimento 24/7 com linguagem natural',
      'Takeover humano simples',
      'Integração com catálogo/CRM/funil',
      'Relatórios e melhoria contínua'
    ]
  },
  {
    icon: 'mdi-cloud-outline',
    title: 'Cloud & migração (com custo sob controle)',
    text: 'Infra segura, escalável e otimizada para sair do improviso sem susto na fatura.',
    items: [
      'Plano por etapas (sem parar operação)',
      'Monitoramento e observabilidade',
      'Otimização recorrente de custo',
      'Boas práticas de segurança'
    ]
  },
  {
    icon: 'mdi-cog-sync-outline',
    title: 'Automação de processos',
    text: 'Tiramos tarefas repetitivas da mão da equipe e levamos o fluxo para uma rotina rastreável.',
    items: [
      'Integrações com legado/ERP/CRM',
      'Gatilhos e orquestração de rotinas',
      'Dashboards e alertas',
      'Padronização e governança'
    ]
  },
  {
    icon: 'mdi-palette-outline',
    title: 'Design de software + conversão',
    text: 'Interfaces rápidas, objetivas e preparadas para tráfego, SEO, tracking e melhoria contínua.',
    items: [
      'Landing pages de alta conversão',
      'Onboarding e ativação',
      'SEO + performance',
      'Métricas e funil'
    ]
  }
]

const cases = [
  {
    icon: 'mdi-car-outline',
    title: 'ChatCar IA',
    subtitle: 'SaaS automotivo: transforme estoque em vendedor 24h.',
    items: [
      'Qualifica e encaminha leads automaticamente',
      'Integração com WhatsApp e tráfego pago',
      'Abordagens prontas e roteiros',
      'Painel e automações do funil'
    ],
    tags: ['SaaS', 'Vendas', 'Automação', 'WhatsApp']
  },
  {
    icon: 'mdi-storefront-outline',
    title: 'EletroNogueira',
    subtitle: 'Modernização total: cloud + SEO + catálogo + IA no WhatsApp.',
    items: [
      'Migração e reestruturação do sistema',
      'Redução de custos e ganho de performance',
      'Catálogo integrado ao estoque físico',
      'Atendimento 24h com IA no WhatsApp'
    ],
    tags: ['Cloud', 'SEO', 'Catálogo', 'WhatsApp IA']
  },
  {
    icon: 'mdi-earth',
    title: 'Globo',
    subtitle: 'Arquitetura escalável, alta disponibilidade e automação de processos internos.',
    items: [
      'Reestruturação de sistemas legados',
      'Automação de rotinas administrativas',
      'Monitoramento e otimização de performance',
      'Integração com sistemas internos e externos'
    ],
    tags: ['Leads', 'Pagamentos', 'Monitoramento', 'Escala']
  }
]

const satisfaction = [
  { icon: 'mdi-headset', title: 'Suporte humano de verdade', text: 'Acompanhamento próximo, resposta clara e registro do que foi feito.' },
  { icon: 'mdi-eye-outline', title: 'Transparência total', text: 'Você vê avanço, prioridade e próximos passos sem depender de achismo.' },
  { icon: 'mdi-swap-horizontal', title: 'Integra com o que você já usa', text: 'Evoluímos o que existe antes de sugerir troca desnecessária.' },
  { icon: 'mdi-cash-check', title: 'Custo sob controle', text: 'Otimização contínua para tecnologia se pagar com eficiência operacional.' }
]

const testimonials = [
  {
    name: 'EletroNogueira',
    role: 'Empresa • Elétrica e Hidráulica',
    stars: 5,
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWkoE4wphrr3rmiQjB_WamkBHm2CQ4POAbnQ&s',
    text: 'Sistema Nuvem + IA para WhatsApp',
    context: 'Estamos realizando a migração do sistema para a nuvem, com integração de IA para atendimento via WhatsApp. O processo tem sido transparente, com suporte próximo e entregas por etapas que nos permitem acompanhar cada avanço. A equipe é proativa em sugerir melhorias e garantir que a solução se encaixe perfeitamente nas nossas operações.'
  },
  {
    name: 'IRW Motors',
    role: 'Empresa • Automotivo',
    stars: 5,
    img: 'https://static.autoconf.com.br/site-irw-motors-1886/build/facebook.jpg',
    text: 'Chatbot IA + Catálogo integrado',
    context: 'Implementamos um chatbot com IA para atendimento online via link, integrado ao nosso catálogo de veículos. O resultado tem sido excelente, com atendimento 24/7, qualificação automática de leads e encaminhamento eficiente para nossa equipe de vendas. A solução é fácil de usar e tem melhorado significativamente nossa conversão.'
  }
]

const founders = [
  {
    name: 'Samuel Victor',
    role: 'Founder • Comercial de Software • IA • Produto • UI/UX • Fullstack',
    img: '/samuel.jpg',
    summary: 'Conecta tecnologia, produto e venda para transformar ideia em software útil, bonito e mensurável.',
    highlights: ['Cloud', 'IA', 'Automação', 'SaaS', 'Sistemas críticos']
  },
  {
    name: 'Dion',
    role: 'Founder • Especialista em Tecnologia • Arquitetura • Cloud • Escala • CyberSecurity',
    img: '/dion.png',
    summary: 'Desenha arquitetura, cloud e segurança para sistemas que precisam aguentar operação real.',
    highlights: ['Arquitetura', 'Entrega', 'Escala', 'Qualidade', 'Processos']
  }
]

// Logos (mantive suas URLs)
const brandItems = [
  { name: 'Empregos.com.br', imgUrl: 'https://static.empregos.com.br/assets/_nuxt/logo.IAkruRZb.svg' },
  { name: 'Mercado Pago', imgUrl: 'https://woocommerce.com/wp-content/uploads/2021/05/fb-mercado-pago-v2@2x.png' },
  { name: 'CAIXA', imgUrl: 'https://images.seeklogo.com/logo-png/2/2/caixa-economica-federal-logo-png_seeklogo-24768.png' },
  { name: 'Eletro Nogueira', imgUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWkoE4wphrr3rmiQjB_WamkBHm2CQ4POAbnQ&s' },
  { name: 'VerdBank', imgUrl: 'https://static.wixstatic.com/media/8c100f_2f22249dc334447eadfc4aea1c65031a~mv2.jpg/v1/fill/w_2500,h_1454,al_c/8c100f_2f22249dc334447eadfc4aea1c65031a~mv2.jpg' },
  { name: 'GLOBO', imgUrl: 'https://s3.glbimg.com/v1/AUTH_b58693ed41d04a39826739159bf600a0/photos/logo_redes.png' },
  { name: 'Banco da Amazônia', imgUrl: 'https://play-lh.googleusercontent.com/MDcygNMjShpab7QKV4KUbd0XYZyeFklcmS9qChtA-6xCdQowETqBTG3G3fDNQCe4Qw' },
  { name: 'AGHU – SUS', imgUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfhEbm-egNDXdvLm6fGK30eb2dDz_cwn4DNOg4UNS_ag7Oe8-_VNzn9seC&s=10' },
  { name: 'Coco Bambu', imgUrl: 'https://mir-s3-cdn-cf.behance.net/projects/404/a87f35210460461.Y3JvcCwxMjMxLDk2MywzNjIsNDU.png' },
  { name: 'TJGO', imgUrl: 'https://tjgo.4biz.globalweb.com.br/4biz/logoImages/44.png' },
  { name: 'ChatCar IA', imgUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqyZu1rtQbx2CnvtixYgWG2ZtUUFJkpcL5bwnxn3OjDw&s' },
  { name: 'AWS', imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/fc/Amazon_Web_Services_2025.svg' },
  { name: 'Sinerji', imgUrl: 'https://media.glassdoor.com/sqll/7882017/sinerji-brazil-squarelogo-1665494683816.png' }
]

// para rolar suave, duplico no template (sem precisar duplicar aqui)
const brandStrip = computed(() => brandItems)

const lead = reactive({
  name: '',
  phone: '',
  email: '',
  company: '',
  message: ''
})

const referral = reactive({
  name: '',
  phone: '',
  leadName: '',
  company: '',
  notes: ''
})

function showProject(title) {
  switch (title) {
    case 'EletroNogueira':
      return window.open('https://www.eletronogueira.com.br', '_blank')
    case 'ChatCar IA':
      return window.open('https://chatcar.netlify.app', '_blank')
    case 'Globo':
      return window.open('https://www.globo.com', '_blank')
  }
}

function handleNav(item, mobile = false) {
  if (mobile) drawerOpen.value = false
  if (item.type === 'route') return router.push(item.to)
  if (item.type === 'scroll') return scrollTo(item.target)
}

function scrollTo(id) {
  const el = document.getElementById(id)
  if (!el) return
  const headerOffset = 86
  const top = el.getBoundingClientRect().top + window.scrollY - headerOffset
  window.scrollTo({ top, behavior: 'smooth' })
}

function buildWhatsappUrl(msg) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`
}

function openWhatsapp(extra = '') {
  const base =
    'Olá! Quero falar com a AITO.\n\nObjetivo: reduzir custos / automatizar processos / melhorar vendas com IA.\n'
  const msg = extra ? `${base}\n${extra}` : base
  window.open(buildWhatsappUrl(msg), '_blank')
}

function sendLead() {
  const parts = []
  if (lead.name) parts.push(`Nome: ${lead.name}`)
  if (lead.phone) parts.push(`WhatsApp: ${lead.phone}`)
  if (lead.email) parts.push(`E-mail: ${lead.email}`)
  if (lead.company) parts.push(`Empresa/Projeto: ${lead.company}`)
  if (lead.message) parts.push(`Mensagem: ${lead.message}`)

  const msg = `Olá! Quero um diagnóstico gratuito.\n\n${parts.join('\n')}`
  window.open(buildWhatsappUrl(msg), '_blank')
}

function sendReferral() {
  const parts = []
  if (referral.name) parts.push(`Indicador: ${referral.name}`)
  if (referral.phone) parts.push(`WhatsApp do indicador: ${referral.phone}`)
  if (referral.leadName) parts.push(`Indicado: ${referral.leadName}`)
  if (referral.company) parts.push(`Empresa/Projeto: ${referral.company}`)
  if (referral.notes) parts.push(`Contexto: ${referral.notes}`)

  const msg =
    `Olá! Quero enviar uma indicação (Indique & Ganhe).\n\n${parts.join('\n')}\n\nPodemos combinar a comissão conforme o contrato?`
  window.open(buildWhatsappUrl(msg), '_blank')
}

function goBlog() {
  router.push('/blog')
}

function goToHome() {
  router.push('/')
}

onMounted(() => {
  document.documentElement.classList.add('ait-about-scroll')
  document.body.classList.add('ait-about-scroll')
})

onBeforeUnmount(() => {
  document.documentElement.classList.remove('ait-about-scroll')
  document.body.classList.remove('ait-about-scroll')
})
</script>

<style scoped>
/* ===========================
   CSS (copiar e colar)
   Minimalista • Bordas mais quadradas • Mobile-first
   =========================== */

.ait-root {
  background: #ffffff00;
}

/* fundo suave (minimal) */
.ait-bg {
  position: fixed;
  inset: 0;
  z-index: -2;
  background:
    radial-gradient(circle at 20% 10%, rgba(32, 180, 190, 0.12), transparent 52%),
    radial-gradient(circle at 90% 85%, rgba(34, 197, 94, 0.10), transparent 55%),
    linear-gradient(180deg, #ffffff 0%, #f6f7fb 100%);
}

/* container */
.ait-wrap {
  max-width: 1120px;
  margin: 0 auto;
  padding-left: 14px;
  padding-right: 14px;
}

/* header */
.ait-header {
  background: rgba(255, 255, 255, 0.493);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(15, 23, 42, 0.08);
  color: #0b0d12;
}

.ait-brand {
  font-family: "Tomorrow", system-ui, sans-serif;
  font-weight: 900;
  letter-spacing: 0.08em;
  font-size: 0.95rem;
  color: #0b0d12;
}

/* page spacing */
.ait-page {
  padding-top: 54px;
  /* espaço do header */
}

/* nav buttons */
.ait-nav-btn {
  color: rgba(15, 23, 42, 0.86);
  border-radius: 8px;
}

.ait-nav-btn:hover {
  background: rgba(15, 23, 42, 0.05);
}

/* mobile menu */
.ait-mobile-menu {
  border: 1px solid rgba(15, 23, 42, 0.10);
  background: rgba(255, 255, 255, 0.158);
  border-radius: 10px;
  padding: 10px;
}

.ait-mobile-btn {
  border-radius: 8px;
}

/* buttons */
.ait-cta {
  background: linear-gradient(-135deg, #22c55e, #0499B2);
  color: #fff;
  border-radius: 10px;
  /* mais quadrado */
  font-weight: 800;
  letter-spacing: 0.2px;
}

.ait-outline {
  border-radius: 10px;
  border: 1px solid rgba(15, 23, 42, 0.18);
  color: rgba(15, 23, 42, 0.88);
}

/* HERO */
.ait-hero {
  margin-top: 14px;
}

.ait-hero-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
}

.ait-panel {
  /* quadrado minimal */
  overflow: hidden;
}

.ait-panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
}

/* VSL */
.ait-video {
  border-radius: 10px;
  overflow: hidden;
}

.ait-iframe {
  width: 100%;
  height: 100%;
}

.ait-video-placeholder {
  width: 100%;
  height: 100%;
  display: grid;
  place-content: center;
  padding: 18px;
  background: linear-gradient(180deg, #ffffff, #f6f7fb);
}

/* copy area */
.ait-kicker {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  color: rgba(15, 23, 42, 0.75);
  border: 1px solid rgba(15, 23, 42, 0.10);
  padding: 8px 10px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.85);
  width: fit-content;
}

.ait-title {
  margin: 12px 0 8px 0;
  font-size: clamp(1.8rem, 4.8vw, 2.6rem);
  line-height: 1.08;
  font-weight: 950;
  color: #0b0d12;
}

.ait-grad {
  background: linear-gradient(135deg, #20b4be, #22c55e);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.ait-subtitle {
  margin: 0;
  font-size: 1.02rem;
  line-height: 1.5;
  color: rgba(15, 23, 42, 0.78);
}

.ait-bullets {
  margin-top: 12px;
  border: 1px solid rgba(15, 23, 42, 0.10);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.72);
  overflow: hidden;
}

.ait-bullet {
  padding: 10px 12px;
  display: flex;
  align-items: center;
  color: rgba(15, 23, 42, 0.86);
  border-bottom: 1px solid rgba(15, 23, 42, 0.06);
}

.ait-bullet:last-child {
  border-bottom: none;
}

.ait-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-top: 12px;
}

.ait-stat {
  border: 1px solid rgba(15, 23, 42, 0.10);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.78);
  padding: 10px 12px;
}

.ait-stat-num {
  font-weight: 950;
  font-size: 1.05rem;
  color: #0b0d12;
}

.ait-stat-label {
  font-size: 0.82rem;
  color: rgba(15, 23, 42, 0.65);
}

.ait-microproof {
  font-size: 0.82rem;
  color: rgba(15, 23, 42, 0.65);
  display: flex;
  align-items: center;
}

/* sections */
.ait-section {
  margin-top: 14px;
  border: 1px solid rgba(15, 23, 42, 0.10);
  background: rgba(255, 255, 255, 0.88);
  border-radius: 12px;
  padding: 14px;
}

.ait-section-head {
  max-width: 820px;
}

.ait-section-title {
  font-size: 1.5rem;
  background: linear-gradient(135deg, #20b4be, #22c55e);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  display: inline-block;
}

.ait-section-sub {
  margin-top: 6px;
  color: rgba(15, 23, 42, 0.70);
}

/* logos strip (clean) */
.ait-logos {
  margin-top: 12px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 10px;
  overflow: hidden;
  background: rgba(246, 247, 251, 0.85);
}

.ait-logos-track {
  display: flex;
  gap: 14px;
  padding: 10px;
  width: max-content;
  animation: ait-scroll 26s linear infinite;
}

.ait-logo {
  width: 128px;
  display: grid;
  place-items: center;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(15, 23, 42, 0.10);
  border-radius: 20px;
  padding: 6px 10px;
}

@keyframes ait-scroll {
  0% {
    transform: translateX(0);
  }

  100% {
    transform: translateX(-50%);
  }
}

/* steps */
.ait-steps {
  margin-top: 12px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
}

.ait-step {
  border: 1px solid rgba(15, 23, 42, 0.10);
  border-radius: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.78);
}

.ait-step-top {
  display: flex;
  align-items: center;
  gap: 10px;
}

.ait-step-title {
  font-weight: 900;
  color: #0b0d12;
}

.ait-step-text {
  margin-top: 6px;
  color: rgba(15, 23, 42, 0.72);
}

/* cards */
.ait-cards {
  margin-top: 12px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
}

.ait-card {
  border: 1px solid rgba(15, 23, 42, 0.10);
  border-radius: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.78);
}

.ait-card-top {
  display: flex;
  align-items: center;
  gap: 10px;
}

.ait-card-title {
  font-weight: 900;
  color: #0b0d12;
}

.ait-card-text {
  margin-top: 6px;
  color: rgba(15, 23, 42, 0.72);
}

.ait-list {
  margin: 8px 0 0 0;
  padding-left: 18px;
  color: rgba(15, 23, 42, 0.78);
}

.ait-list li {
  margin-bottom: 6px;
}

/* cases */
.ait-cases {
  margin-top: 12px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
}

.ait-case {
  border: 1px solid rgba(15, 23, 42, 0.10);
  border-radius: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.78);
}

.ait-case-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
}

.ait-case-title {
  font-weight: 900;
  color: #0b0d12;
}

.ait-case-sub {
  color: rgba(15, 23, 42, 0.68);
  font-size: 0.92rem;
}

/* satisfaction grid */
.ait-sat-grid {
  margin-top: 12px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
}

.ait-sat-row:last-child .q-separator {
  display: none;
}

.ait-testimonials {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
}

.ait-quote {
  border: 1px solid rgba(15, 23, 42, 0.10);
  border-radius: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.78);
}

.ait-quote-text {
  color: rgba(15, 23, 42, 0.80);
  line-height: 1.45;
}

.ait-note {
  border: 1px solid rgba(15, 23, 42, 0.10);
  border-radius: 12px;
  padding: 10px 12px;
  background: rgba(246, 247, 251, 0.85);
  color: rgba(15, 23, 42, 0.74);
  display: flex;
  align-items: center;
}

/* founders */
.ait-founders {
  margin-top: 12px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
}

.ait-founder {
  border: 1px solid rgba(15, 23, 42, 0.10);
  border-radius: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.78);
}

.ait-avatar {
  border: 1px solid rgba(15, 23, 42, 0.10);
  border-radius: 10px;
  overflow: hidden;
}

/* tabs */
.ait-tabs {
  margin-top: 12px;
  border: 1px solid rgba(15, 23, 42, 0.10);
  border-radius: 12px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.78);
}

.ait-qtabs {
  background: rgba(246, 247, 251, 0.75);
}

.ait-panels {
  background: transparent;
}

.ait-form-grid {
  display: grid;
  grid-template-columns: 1fr;
}

.ait-form-side,
.ait-form-main {
  padding: 14px;
}

.ait-form-note {
  border: 1px solid rgba(15, 23, 42, 0.10);
  border-radius: 12px;
  padding: 12px;
  background: rgba(246, 247, 251, 0.85);
}

.ait-form-note-title {
  font-weight: 900;
  color: #0b0d12;
  margin-bottom: 6px;
}

.ait-banner {
  border: 1px solid rgba(15, 23, 42, 0.10);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.85);
}

/* footer */
.ait-footer {
  border-top: 1px solid rgba(15, 23, 42, 0.10);
  padding-top: 14px;
}

/* IA FAB */
.ait-ia-fab {
  position: fixed;
  right: 16px;
  bottom: 16px;
  z-index: 40;
  border-radius: 12px;
  /* quadrado */
  overflow: hidden;
  background: linear-gradient(135deg, #22c55e, #20b4be);
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.18);
}

/* ======================
   Responsive upgrades
   ====================== */
@media (min-width: 900px) {
  .ait-hero-grid {
    grid-template-columns: 1.05fr 0.95fr;
    /* VSL + copy */
    align-items: start;
    gap: 14px;
  }

  .ait-steps {
    grid-template-columns: repeat(4, 1fr);
  }

  .ait-cards {
    grid-template-columns: repeat(2, 1fr);
  }

  .ait-cases {
    grid-template-columns: repeat(3, 1fr);
  }

  .ait-sat-grid {
    grid-template-columns: 0.95fr 1.05fr;
  }

  .ait-testimonials {
    grid-template-columns: repeat(2, 1fr);
  }

  .ait-founders {
    grid-template-columns: repeat(2, 1fr);
  }

  .ait-form-grid {
    grid-template-columns: 0.95fr 1.05fr;
  }
}

.galaxy-bg {
  position: fixed;
  inset: 0;
  z-index: -1;
  opacity: 0.08;
  overflow: hidden;
  pointer-events: none;
}

.galaxy-img {
  width: 100%;
  height: 100%;
}

/* mobile */
@media (max-width: 900px) {
  .galaxy-img {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100vh;
    /* repara: usa vh */
    height: 100vw;
    /* repara: usa vw */
    transform: translate(-50%, -50%) rotate(-90deg);
    transform-origin: center center;
  }
}

/* Dark Frutiger Aqua refresh */
.ait-root {
  --aito-bg: #020706;
  --aito-bg-2: #061716;
  --aito-surface: rgba(5, 24, 27, 0.78);
  --aito-surface-strong: rgba(8, 38, 43, 0.88);
  --aito-border: rgba(19, 188, 157, 0.26);
  --aito-border-strong: rgba(19, 188, 157, 0.48);
  --aito-text: #edfffb;
  --aito-muted: rgba(215, 247, 241, 0.7);
  --aito-soft: rgba(215, 247, 241, 0.5);
  --aito-teal: #13BC9D;
  --aito-teal-2: #12AD89;
  --aito-shadow: rgba(0, 0, 0, 0.34);
  min-height: 100vh;
  color: var(--aito-text);
  background: var(--aito-bg);
}

.ait-bg {
  background:
    linear-gradient(180deg, #010403 0%, #04110f 42%, #020706 100%),
    repeating-linear-gradient(90deg, rgba(19, 188, 157, 0.08) 0 1px, transparent 1px 86px);
}

.ait-bg::before {
  position: absolute;
  inset: 0;
  content: "";
  opacity: 0.54;
  background:
    linear-gradient(118deg, transparent 0 18%, rgba(19, 188, 157, 0.11) 34%, transparent 52%),
    linear-gradient(32deg, transparent 0 48%, rgba(18, 173, 137, 0.1) 64%, transparent 82%);
}

.galaxy-bg {
  opacity: 0.16;
  mix-blend-mode: screen;
  filter: saturate(1.28) contrast(1.08);
}

.ait-wrap {
  max-width: 1180px;
}

.ait-header {
  color: var(--aito-text);
  background: rgba(2, 7, 6, 0.78);
  border-bottom: 1px solid rgba(19, 188, 157, 0.18);
  box-shadow: 0 18px 56px rgba(0, 0, 0, 0.32);
  backdrop-filter: blur(18px) saturate(1.35);
}

.ait-header .column {
  color: var(--aito-text);
}

.ait-page {
  min-height: 100vh;
  padding-top: 68px;
  color: var(--aito-text);
  background: transparent;
}

.ait-nav-btn {
  color: var(--aito-muted);
  border-radius: 8px;
}

.ait-nav-btn:hover,
.ait-nav-btn:focus-visible,
.ait-mobile-btn:hover,
.ait-mobile-btn:focus-visible {
  color: var(--aito-text);
  background: rgba(19, 188, 157, 0.1);
}

.ait-cta {
  color: #02110e;
  background: linear-gradient(135deg, var(--aito-teal), var(--aito-teal-2));
  border-radius: 8px;
  box-shadow: 0 14px 36px rgba(19, 188, 157, 0.24);
}

.ait-outline {
  color: var(--aito-text);
  border: 1px solid var(--aito-border);
  border-radius: 8px;
  background: rgba(19, 188, 157, 0.06);
}

.ait-cta:hover,
.ait-outline:hover {
  transform: translateY(-1px);
}

.ait-hero {
  display: grid;
  min-height: calc(100svh - 92px);
  margin-top: clamp(1rem, 3vw, 2rem);
  padding: clamp(1rem, 3vw, 2rem) !important;
  align-items: center;
  border: 0;
  border-radius: 0 !important;
  background: transparent;
}

.ait-hero-grid {
  gap: clamp(1.1rem, 3vw, 2.2rem);
  align-items: center;
}

.ait-copy {
  padding: clamp(0.4rem, 2vw, 1.5rem) 0;
}

.ait-title {
  margin: 0 0 1rem;
  color: var(--aito-text);
  font-family: "Tomorrow", "Montserrat", system-ui, sans-serif;
  font-size: clamp(2.2rem, 5.4vw, 4.75rem);
  font-weight: 700;
  letter-spacing: 0;
  line-height: 1.02;
  text-wrap: balance;
}

.ait-grad,
.ait-section-title {
  background: linear-gradient(135deg, var(--aito-teal), var(--aito-teal-2));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.ait-panel,
.ait-bullets,
.ait-stat,
.ait-step,
.ait-card,
.ait-case,
.ait-quote,
.ait-founder,
.ait-tabs,
.ait-form-note,
.ait-note,
.ait-banner {
  border: 1px solid var(--aito-border);
  border-radius: 8px;
  background:
    linear-gradient(145deg, rgba(9, 36, 40, 0.86), rgba(3, 12, 13, 0.68)),
    linear-gradient(180deg, rgba(236, 255, 251, 0.06), transparent 42%);
  box-shadow:
    0 22px 70px var(--aito-shadow),
    inset 0 1px 0 rgba(236, 255, 251, 0.08);
  backdrop-filter: blur(18px) saturate(1.22);
}

.ait-panel {
  overflow: hidden;
}

.ait-panel-head {
  color: var(--aito-text);
  border-bottom: 1px solid rgba(19, 188, 157, 0.12);
}

.ait-video {
  border: 1px solid rgba(19, 188, 157, 0.18);
  border-radius: 8px;
  background: #010403;
  box-shadow: inset 0 0 42px rgba(19, 188, 157, 0.08);
}

.ait-iframe {
  opacity: 0.96;
}

.ait-bullets {
  margin-top: 1rem;
  overflow: hidden;
}

.ait-bullet {
  color: var(--aito-muted);
  border-bottom: 1px solid rgba(19, 188, 157, 0.12);
}

.ait-bullet .q-icon,
.ait-step .q-icon,
.ait-card .q-icon,
.ait-case .q-icon,
.ait-note .q-icon {
  color: var(--aito-teal);
}

.ait-stat {
  padding: 1rem;
}

.ait-stat-num {
  color: var(--aito-text);
  font-family: "Tomorrow", system-ui, sans-serif;
  letter-spacing: 0;
}

.ait-stat-label,
.ait-microproof,
.ait-section-sub,
.ait-card-text,
.ait-step-text,
.ait-case-sub,
.ait-quote-text,
.ait-list,
.ait-note {
  color: var(--aito-muted);
}

.ait-section {
  margin-top: clamp(3.6rem, 7vw, 6rem);
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
}

.ait-section-head {
  max-width: 880px;
  margin-bottom: 1rem;
}

.ait-section-title {
  display: inline-block;
  font-family: "Tomorrow", "Montserrat", system-ui, sans-serif;
  font-size: clamp(1.85rem, 3.8vw, 3.2rem);
  font-weight: 700;
  letter-spacing: 0;
  line-height: 1.05;
  text-wrap: balance;
}

.ait-section-sub {
  max-width: 740px;
  margin-top: 0.72rem;
  font-size: 1rem;
  line-height: 1.65;
}

.ait-logos {
  margin-top: 1rem;
  border: 1px solid var(--aito-border);
  border-radius: 8px;
  background: rgba(3, 15, 17, 0.72);
}

.ait-logo {
  width: 134px;
  min-height: 68px;
  border: 1px solid rgba(19, 188, 157, 0.18);
  border-radius: 8px;
  background: rgba(245, 255, 253, 0.92);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.62);
}

.ait-steps,
.ait-cards,
.ait-cases,
.ait-sat-grid,
.ait-testimonials,
.ait-founders {
  gap: 0.86rem;
}

.ait-step,
.ait-card,
.ait-case,
.ait-quote,
.ait-founder {
  padding: clamp(1rem, 2vw, 1.3rem);
  transition: border-color 220ms ease, transform 220ms ease, box-shadow 220ms ease;
}

.ait-step:hover,
.ait-card:hover,
.ait-case:hover,
.ait-quote:hover,
.ait-founder:hover {
  border-color: var(--aito-border-strong);
  box-shadow:
    0 26px 80px rgba(0, 0, 0, 0.42),
    0 0 34px rgba(19, 188, 157, 0.08),
    inset 0 1px 0 rgba(236, 255, 251, 0.1);
  transform: translateY(-2px);
}

.ait-step-title,
.ait-card-title,
.ait-case-title,
.ait-form-note-title {
  color: var(--aito-text);
  font-family: "Tomorrow", "Montserrat", system-ui, sans-serif;
  letter-spacing: 0;
}

.ait-list li::marker {
  color: var(--aito-teal);
}

.ait-avatar {
  border-color: rgba(19, 188, 157, 0.3);
  border-radius: 8px;
}

.ait-tabs {
  overflow: hidden;
}

.ait-qtabs {
  color: var(--aito-muted);
  background: rgba(1, 9, 10, 0.72);
}

.ait-panels {
  color: var(--aito-text);
  background: transparent;
}

.ait-form-side,
.ait-form-main {
  padding: clamp(1rem, 2vw, 1.35rem);
}

.ait-footer {
  margin-bottom: 1.5rem;
  border-top: 1px solid rgba(19, 188, 157, 0.18);
  color: var(--aito-muted);
}

.ait-ia-fab {
  border-radius: 8px;
  background: linear-gradient(135deg, var(--aito-teal), var(--aito-teal-2));
  box-shadow: 0 18px 50px rgba(19, 188, 157, 0.28);
}

:deep(.text-grey-9),
:deep(.text-dark) {
  color: var(--aito-text) !important;
}

:deep(.text-grey-8),
:deep(.text-grey-7) {
  color: var(--aito-muted) !important;
}

:deep(.text-grey-6) {
  color: var(--aito-soft) !important;
}

:deep(.q-chip) {
  color: var(--aito-text) !important;
  border-color: rgba(19, 188, 157, 0.28) !important;
  background: rgba(19, 188, 157, 0.08) !important;
}

:deep(.q-separator) {
  background: rgba(19, 188, 157, 0.14);
}

:deep(.q-field--outlined .q-field__control) {
  border-radius: 8px;
  color: var(--aito-text);
  background: rgba(2, 12, 13, 0.72);
}

:deep(.q-field--outlined .q-field__control::before) {
  border-color: rgba(19, 188, 157, 0.24);
}

:deep(.q-field--outlined.q-field--focused .q-field__control::after) {
  border-color: var(--aito-teal);
}

:deep(.q-field__native),
:deep(.q-field__input),
:deep(.q-field__label),
:deep(.q-field__prefix) {
  color: var(--aito-text);
}

:deep(.q-field__label) {
  color: var(--aito-soft);
}

:deep(.q-tab) {
  color: var(--aito-muted);
}

:deep(.q-tab--active) {
  color: var(--aito-teal) !important;
}

:deep(.q-tabs__content .q-tab__indicator) {
  background: var(--aito-teal) !important;
}

@media (max-width: 900px) {
  .ait-page {
    padding-top: 62px;
  }

  .ait-hero {
    min-height: auto;
    padding-top: 1.6rem !important;
  }

  .ait-title {
    font-size: clamp(2rem, 10vw, 3.2rem);
  }

  .ait-stats {
    grid-template-columns: 1fr;
  }

  .ait-section {
    margin-top: 3.4rem;
  }

  .ait-case-head .ait-outline {
    width: 100%;
  }
}

/* First-fold balance */
.ait-page {
  padding-top: 24px;
}

.ait-hero {
  min-height: min(760px, calc(100svh - 126px));
  margin-top: 0;
}

.ait-title {
  max-width: 13ch;
  font-size: clamp(2.05rem, 3.55vw, 3.45rem);
  line-height: 1.08;
}

.ait-copy {
  justify-self: end;
  width: min(100%, 36rem);
}

.ait-root :deep(.animate__animated) {
  animation-delay: 0ms !important;
  animation-duration: 650ms !important;
}

@media (min-width: 900px) {
  .ait-hero-grid {
    grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
    align-items: center;
  }
}

@media (max-width: 900px) {
  .ait-page {
    padding-top: 18px;
  }

  .ait-hero {
    min-height: auto;
  }

  .ait-title {
    max-width: 13ch;
    font-size: clamp(2rem, 9.2vw, 3rem);
  }

  .ait-copy {
    justify-self: start;
    width: 100%;
  }

  .ait-ia-fab {
    right: 12px;
    bottom: 12px;
    width: 44px;
    height: 44px;
    min-height: 44px;
    border-radius: 8px;
  }

  .ait-ia-fab :deep(.q-img),
  .ait-ia-fab :deep(img) {
    width: 42px !important;
    height: 42px !important;
  }
}

:global(html.ait-about-scroll),
:global(body.ait-about-scroll) {
  scroll-behavior: smooth;
  scroll-snap-type: y mandatory;
  overscroll-behavior-y: contain;
}

.ait-bg {
  background:
    linear-gradient(180deg, rgba(0, 12, 11, 0.96) 0%, rgba(4, 31, 32, 0.94) 45%, rgba(1, 7, 7, 0.98) 100%),
    linear-gradient(118deg, transparent 0 18%, rgba(155, 244, 235, 0.08) 35%, transparent 54%),
    linear-gradient(30deg, transparent 0 48%, rgba(18, 173, 137, 0.12) 66%, transparent 84%),
    repeating-linear-gradient(90deg, rgba(228, 255, 251, 0.045) 0 1px, transparent 1px 92px);
}

.ait-bg::after {
  position: absolute;
  inset: 0;
  content: "";
  opacity: 0.34;
  background:
    linear-gradient(145deg, transparent 0 22%, rgba(210, 255, 249, 0.11) 33%, transparent 46%),
    linear-gradient(205deg, transparent 0 54%, rgba(19, 188, 157, 0.14) 69%, transparent 82%);
  pointer-events: none;
}

.ait-hero,
.ait-section {
  min-height: calc(100svh - 96px);
  scroll-snap-align: start;
  scroll-snap-stop: always;
}

.ait-section {
  display: flex;
  padding-block: clamp(2.5rem, 7vh, 5rem);
  flex-direction: column;
  justify-content: center;
}

.ait-title,
.ait-section-title,
.ait-step-title,
.ait-card-title,
.ait-case-title,
.ait-form-note-title {
  font-family: "Montserrat", system-ui, sans-serif;
  font-weight: 850;
  letter-spacing: 0;
}

.ait-title {
  max-width: 14ch;
  font-size: clamp(2.1rem, 4vw, 3.7rem);
  line-height: 1.04;
}

.ait-section-title {
  font-size: clamp(2rem, 4vw, 3.45rem);
  line-height: 1.02;
}

.ait-step-title,
.ait-card-title,
.ait-case-title,
.ait-form-note-title {
  display: inline-block;
  background: linear-gradient(135deg, #effffb 0%, #13bc9d 48%, #12ad89 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.ait-step-text,
.ait-card-text,
.ait-case-sub,
.ait-quote-text,
.ait-list,
.ait-note {
  font-size: 0.94rem;
  line-height: 1.55;
}

.ait-panel,
.ait-bullets,
.ait-stat,
.ait-step,
.ait-card,
.ait-case,
.ait-quote,
.ait-founder,
.ait-tabs,
.ait-form-note,
.ait-note,
.ait-banner {
  background:
    linear-gradient(145deg, rgba(8, 44, 48, 0.82), rgba(2, 17, 18, 0.72)),
    linear-gradient(180deg, rgba(241, 255, 252, 0.1), transparent 48%);
  border-color: rgba(155, 244, 235, 0.2);
}

@media (max-width: 900px) {
  :global(html.ait-about-scroll),
  :global(body.ait-about-scroll) {
    scroll-snap-type: y proximity;
  }

  .ait-hero,
  .ait-section {
    min-height: 100svh;
    scroll-snap-align: start;
  }

  .ait-section {
    padding-block: 2.5rem;
    justify-content: start;
  }

  .ait-title {
    max-width: 12ch;
    font-size: clamp(2.2rem, 10vw, 3.15rem);
    line-height: 1.05;
  }

  .ait-section-title {
    font-size: clamp(1.8rem, 9vw, 2.6rem);
  }

  .ait-step-text,
  .ait-card-text,
  .ait-case-sub,
  .ait-quote-text,
  .ait-list,
  .ait-note {
    font-size: 0.9rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  :global(html.ait-about-scroll),
  :global(body.ait-about-scroll) {
    scroll-behavior: auto;
    scroll-snap-type: none;
  }
}
</style>
