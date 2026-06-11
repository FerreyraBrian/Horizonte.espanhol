import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  BadgeCheck,
  BookOpen,
  Clock3,
  Download,
  FileAudio,
  FileText,
  Link as LinkIcon,
  Rocket,
  Sparkles,
  Target,
  Video,
  CheckCircle2,
  ShieldCheck,
  Mail,
} from 'lucide-react';

const getResourceMeta = (resource = {}) => {
  const value = `${resource.name ?? ''} ${resource.url ?? ''}`.toLowerCase();

  if (/(mp3|wav|ogg|m4a|audio|escucha|pronunci)/.test(value)) {
    return { icon: FileAudio, tone: 'is-audio', label: 'Áudio para prática' };
  }

  if (/(mp4|mov|video|youtube|vimeo)/.test(value)) {
    return { icon: Video, tone: 'is-video', label: 'Vídeo complementar' };
  }

  if (/(quizlet|drive|google|canva|link|portal|site)/.test(value)) {
    return { icon: LinkIcon, tone: 'is-link', label: 'Link de apoio' };
  }

  return { icon: FileText, tone: 'is-guide', label: 'Guia para revisão' };
};

const ResourcesPage = ({ lessons = [] }) => {
  const lessonsWithResources = lessons.filter((lesson) => (lesson.resources?.length ?? 0) > 0);
  const totalResources = lessonsWithResources.reduce((total, lesson) => total + (lesson.resources?.length ?? 0), 0);

  const quickTips = [
    'Baixe primeiro os materiais da próxima aula para chegar preparada.',
    'Use os áudios curtos para treinar pronúncia durante a semana.',
    'Revise os PDFs antes das avaliações e marque vocabulário novo.',
  ];

  const valueHighlights = [
    {
      icon: Target,
      title: 'Estudo com foco',
      text: 'Cada recurso já está ligado a uma lição, para você saber exatamente no que praticar.',
    },
    {
      icon: Clock3,
      title: 'Revisão sem perder tempo',
      text: 'Use blocos curtos de 15 minutos e mantenha constância durante a semana.',
    },
    {
      icon: Rocket,
      title: 'Evolução visível',
      text: 'Com rotina de leitura e escuta, você chega na aula com confiança para participar.',
    },
  ];

  return (
    <div className="resources-page">
      <style>{`.contact-channel-card{padding:1.25rem;} @media (min-width:901px){.contact-channel-card{padding:7.5rem;}}`}</style>
      
      {/* ============================================================ */}
      {/* HERO SECTION - TOPO DA PÁGINA (Primeira linha do "F") */}
      {/* ============================================================ */}
      <section className="resources-hero rounded-2xl shadow-sm border">
        <div className="resources-hero-grid">
          
          {/* Lado esquerdo - Informação principal */}
          <div className="resources-hero-copy">
            <span className="resources-badge inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold">
              <BookOpen className="h-3.5 w-3.5 mr-1.5" />
              Biblioteca do aluno
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-headline text-slate-900 dark:text-white">
              Materiais e downloads
            </h1>
            <p className="max-w-2xl text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              Encontre em um só lugar os PDFs, áudios, links e arquivos de apoio para reforçar cada lição com mais autonomia.
            </p>
            
            {/* Métricas rápidas - elementos de confiança */}
            <div className="resources-stat-row">
              <div className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <BookOpen className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                <span>{lessonsWithResources.length} lições com apoio</span>
              </div>
              <div className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <Download className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                <span>{totalResources} arquivos prontos</span>
              </div>
              <div className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <BadgeCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span>Estudo guiado por tema</span>
              </div>
            </div>

            {/* Botões de ação */}
            <div className="resources-hero-actions">
              <a
                href="#biblioteca-recursos"
                className="resources-hero-link resources-hero-link-primary w-full sm:w-auto"
              >
                Explorar biblioteca
                <ArrowUpRight className="h-4 w-4" />
              </a>
              <Link
                to="/lessons"
                className="resources-hero-link w-full sm:w-auto"
              >
                Ver lições
              </Link>
            </div>
          </div>

          {/* Lado direito - Card de dicas rápidas */}
          <div className="resources-hero-side bg-white dark:bg-slate-800/50 rounded-xl p-5 shadow-md border border-blue-100 dark:border-blue-900/30">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-5 w-5 text-amber-500" />
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base">
                Como aproveitar melhor
              </h3>
            </div>
            <h4 className="font-headline font-semibold text-slate-800 dark:text-slate-200 text-base sm:text-lg mb-3">
              Monte uma rotina leve de revisão
            </h4>
            <ul className="resources-hero-tip-list">
              {quickTips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm sm:text-base text-slate-600 dark:text-slate-400">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-cyan-100 dark:bg-cyan-900/50 text-cyan-700 dark:text-cyan-300 text-xs font-bold flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* VALUE STRIP - 3 PILARES (Segunda linha do "F") */}
      {/* ============================================================ */}
      <div className="resources-value-strip">
        {valueHighlights.map((item) => {
          const Icon = item.icon;
          return (
            <article key={item.title} className="resources-value-card">
              <div className="resources-value-icon">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm sm:text-base">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {item.text}
                </p>
              </div>
            </article>
          );
        })}
      </div>

      {/* ============================================================ */}
      {/* MÉTRICAS - CARDS ESTATÍSTICOS (Terceira linha do "F") */}
      {/* ============================================================ */}
      <div className="resources-metric-strip">
        <article className="resources-metric-card">
          <div className="resources-metric-icon">
            <BookOpen className="h-6 w-6" />
          </div>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">Lições com material</p>
          <strong className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-white block my-1">
            {lessonsWithResources.length}
          </strong>
          <small className="text-xs sm:text-sm text-slate-400 dark:text-slate-500">
            Conteúdo organizado por tema
          </small>
        </article>

        <article className="resources-metric-card">
          <div className="resources-metric-icon">
            <FileText className="h-6 w-6" />
          </div>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">Arquivos disponíveis</p>
          <strong className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-white block my-1">
            {totalResources}
          </strong>
          <small className="text-xs sm:text-sm text-slate-400 dark:text-slate-500">
            Leitura, escuta e reforço
          </small>
        </article>

        <article className="resources-metric-card-highlight">
          <div className="resources-metric-icon">
            <Sparkles className="h-6 w-6" />
          </div>
          <p className="text-sm sm:text-base text-amber-700 dark:text-amber-400 font-medium">Dica da semana</p>
          <strong className="text-xl sm:text-2xl font-bold text-amber-800 dark:text-amber-300 block my-1">
            Baixe antes
          </strong>
          <small className="text-xs sm:text-sm text-amber-600 dark:text-amber-500">
            Separe os arquivos da semana e revise em blocos curtos
          </small>
        </article>
      </div>

      {/* ============================================================ */}
      {/* ÁREA PRINCIPAL - ESTRUTURA EM "F" (2 colunas) */}
      {/* ============================================================ */}
      <div className="resources-content-grid">
        
        {/* ======================================================== */}
        {/* COLUNA ESQUERDA - BIBLIOTECA DE RECURSOS (Foco principal) */}
        {/* ======================================================== */}
        <div>
          <div id="biblioteca-recursos" className="resources-library-panel">
            
            {/* Título da seção */}
            <div className="resources-section-head">
              <span className="resources-section-kicker">
                Biblioteca
              </span>
              <h2>Materiais por lição</h2>
              <p>
                Abra o recurso que precisar e mantenha sua revisão sempre organizada.
              </p>
            </div>

            {lessonsWithResources.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl">
                <BookOpen className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-500 dark:text-slate-400">
                  Ainda não há materiais publicados para as lições.
                </p>
                <p className="text-sm text-slate-400 dark:text-slate-500">
                  Assim que a equipe adicionar novos arquivos, eles aparecerão aqui.
                </p>
              </div>
            ) : (
              <div className="resources-lesson-list">
                {lessonsWithResources.map((lesson) => (
                  <article key={lesson.id ?? lesson.slug ?? lesson.title} className="resources-lesson-card">
                    {/* Cabeçalho da lição */}
                    <div className="resources-lesson-top">
                      <div>
                        <span className="resources-lesson-kicker">
                          Lição
                        </span>
                        <h3 className="font-headline font-semibold text-slate-800 dark:text-white text-lg md:text-xl">
                          {lesson.title}
                        </h3>
                        <p className="text-sm md:text-base text-slate-500 dark:text-slate-400">
                          {lesson.description || 'Material complementar da lição para reforçar vocabulário, escuta e revisão.'}
                        </p>
                      </div>
                      <span className="resources-count-pill">
                        <FileText className="h-3 w-3" />
                        {lesson.resources?.length ?? 0} arquivos
                      </span>
                    </div>

                    {/* Lista de recursos */}
                    <div className="p-4">
                      <div className="resources-link-grid">
                        {(lesson.resources ?? []).map((resource, index) => {
                          const { icon: ResourceIcon, tone, label } = getResourceMeta(resource);
                          return (
                            <a
                              key={`${lesson.slug ?? lesson.id ?? lesson.title}-${index}`}
                              href={resource.url || '#'}
                              target="_blank"
                              rel="noreferrer"
                              className={`resources-link-chip ${
                                tone === 'is-audio' ? 'border-emerald-200 dark:border-emerald-800/30 bg-emerald-50/50 dark:bg-emerald-950/20 hover:bg-emerald-100/50' :
                                tone === 'is-video' ? 'border-indigo-200 dark:border-indigo-800/30 bg-indigo-50/50 dark:bg-indigo-950/20 hover:bg-indigo-100/50' :
                                tone === 'is-link' ? 'border-amber-200 dark:border-amber-800/30 bg-amber-50/50 dark:bg-amber-950/20 hover:bg-amber-100/50' :
                                'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700'
                              }`}
                            >
                              <div className="flex items-start sm:items-center gap-3 w-full min-w-0">
                                <div className={`inline-flex rounded-lg p-2 ${
                                  tone === 'is-audio' ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700' :
                                  tone === 'is-video' ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700' :
                                  tone === 'is-link' ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-700' :
                                  'bg-slate-100 dark:bg-slate-700 text-slate-600'
                                }`}>
                                  <ResourceIcon className="h-4 w-4" />
                                </div>
                                <div className="min-w-0">
                                  <strong className="text-sm sm:text-base md:text-base text-slate-700 dark:text-slate-300 block truncate">
                                    {resource.name}
                                  </strong>
                                  <span className="text-[11px] sm:text-xs md:text-sm text-slate-400 dark:text-slate-500">
                                    {label}
                                  </span>
                                </div>
                              </div>
                              <ArrowUpRight className="h-4 w-4 text-slate-400 flex-shrink-0" />
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ======================================================== */}
        {/* COLUNA DIREITA - SIDEBAR (Dicas e orientações) */}
        {/* ======================================================== */}
        <div className="resources-sidebar">
          
          {/* Card 1: Plano rápido de estudo */}
          <article className="resources-tips-panel">
            <div className="flex items-center gap-2 mb-4">
              <div className="inline-flex rounded-lg bg-emerald-100 dark:bg-emerald-900/50 p-2 text-emerald-700 dark:text-emerald-300">
                <Rocket className="h-5 w-5" />
              </div>
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                Plano rápido
              </span>
            </div>
            <h3 className="font-headline font-semibold text-slate-800 dark:text-white text-lg mb-2">
              Uma rotina que funciona
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Use a biblioteca para transformar cada lição em prática constante durante a semana.
            </p>
            <ul className="resources-tip-list">
              {[
                { step: '1', title: 'Leia primeiro', desc: 'Comece pelos PDFs e resumos para revisar vocabulário e estruturas.' },
                { step: '2', title: 'Escute depois', desc: 'Repita os áudios em momentos curtos do dia para treinar ouvido e pronúncia.' },
                { step: '3', title: 'Volte antes da aula', desc: 'Abra novamente os materiais da próxima aula para chegar com confiança.' }
              ].map((item) => (
                <li key={item.step} className="flex gap-4 items-start">
                  <span className="resources-tip-number inline-flex items-center justify-center rounded-full bg-emerald-200 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200 text-sm font-bold flex-shrink-0 mt-0.5">
                    {item.step}
                  </span>
                  <div>
                    <strong className="text-sm text-slate-700 dark:text-slate-300 block">
                      {item.title}
                    </strong>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </article>

          {/* Card 3: Canal do aluno com a administração (matching ContactPage styles) */}
          <article className="contact-channel-card bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-slate-800/50 dark:to-slate-800/30 rounded-xl border border-blue-100 dark:border-blue-900/30 transition-all hover:shadow-md">
            <div className="inline-flex rounded-xl bg-blue-100 dark:bg-blue-900/50 p-3 text-blue-700 dark:text-blue-300 mb-4">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Canal do aluno com a administração
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Este espaço foi pensado para o aluno falar diretamente com a administração da escola. Use o formulário abaixo para contato formal e claro sobre qualquer assunto acadêmico ou administrativo.
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              <div className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <Clock3 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span>Resposta em até 1 dia útil</span>
              </div>
              <div className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span>Canal oficial do estudante</span>
              </div>
              <div className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span>Atendimento personalizado</span>
              </div>
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-2">
              📋 Como funciona este canal
            </h3>
            <ul className="resources-channel-list">
              {['O aluno envia a mensagem pelo formulário abaixo', 'A administração recebe o assunto e o conteúdo', 'O retorno acontece em até 1 dia útil'].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-base font-bold flex-shrink-0 mt-0.5 mr-3">
                    {idx + 1}
                  </span>
                  <span className="flex-1">{item}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/contato"
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
            >
              Ir para o formulário
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </article>

          {/* Card 2: CTA - Pedir orientação */}
          <article className="resources-tips-panel">
            <div className="flex items-start gap-3">
              <div className="inline-flex rounded-full bg-amber-100 dark:bg-amber-900/50 p-2 text-amber-700 dark:text-amber-300">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-amber-800 dark:text-amber-300 text-sm">
                  Quer acelerar ainda mais?
                </h3>
                <p className="text-xs text-amber-700 dark:text-amber-400">
                  Se estiver com dificuldade em algum tema, envie sua dúvida para a equipe e receba orientação prática.
                </p>
                <Link
                  to="/contato"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 transition-colors"
                >
                  Pedir orientação
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
};

export default ResourcesPage;