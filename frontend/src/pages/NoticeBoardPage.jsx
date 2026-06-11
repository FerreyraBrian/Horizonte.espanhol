import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BellRing, BookOpen, CalendarDays, Megaphone, Pin, ShieldCheck, Sparkles } from 'lucide-react';
import { noticeBoardService } from '../services/storageService';

const reminders = [
  'Complete as avaliações quando elas forem liberadas para medir sua evolução.',
  'Baixe os materiais da aula antes de começar a revisão da semana.',
  'Se tiver dúvidas, consulte o fórum ou a página de contato para receber apoio.',
];

const priorityStyles = {
  high: 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-200',
  normal: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-200',
  low: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200',
};

const formatDate = (value) => {
  if (!value) {
    return 'Agora mesmo';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
};

const NoticeBoardPage = () => {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const loadAnnouncements = () => {
      setAnnouncements(noticeBoardService.getPublished());
    };

    loadAnnouncements();
    window.addEventListener('storage', loadAnnouncements);

    return () => window.removeEventListener('storage', loadAnnouncements);
  }, []);

  const featuredAnnouncements = useMemo(() => announcements.slice(0, 3), [announcements]);
  const moreAnnouncements = useMemo(() => announcements.slice(3), [announcements]);
  const latestAnnouncement = useMemo(() => announcements[0] || null, [announcements]);

  return (
    <div className="notice-board-page space-y-8">
      <section className="notice-hero rounded-3xl border border-slate-200 p-8 shadow-sm dark:border-slate-800">
        <div className="notice-hero-grid flex flex-wrap items-start justify-between gap-5">
          <div className="max-w-2xl">
            <span className="notice-badge inline-flex items-center rounded-full bg-orange-50 px-3 py-1 text-sm font-semibold text-orange-700 dark:bg-orange-950 dark:text-orange-200">
              Cartelera oficial del curso
            </span>
            <h1 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">Mural de avisos</h1>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              Este é o canal oficial do curso para comunicados importantes, anúncios publicados pela administração e divulgação de novos recursos.
            </p>
            <div className="notice-stat-row mt-4 flex flex-wrap gap-3 text-sm text-slate-500 dark:text-slate-400">
              <span className="notice-stat-pill">{announcements.length} aviso(s) publicado(s)</span>
              <span className="notice-stat-pill">Somente a administração altera este espaço</span>
            </div>
          </div>

          <aside className="notice-hero-preview">
            <span className="notice-preview-kicker">
              <ShieldCheck className="h-4 w-4" />
              Último aviso do admin
            </span>
            {latestAnnouncement ? (
              <>
                <h2 className="notice-preview-title">{latestAnnouncement.title}</h2>
                <p className="notice-preview-text">{latestAnnouncement.description}</p>
                <div className="notice-preview-date">
                  <CalendarDays className="h-4 w-4" />
                  {formatDate(latestAnnouncement.updatedAt)}
                </div>
              </>
            ) : (
              <div className="notice-preview-empty">
                <BellRing className="h-4 w-4" />
                Nenhum comunicado publicado ainda.
              </div>
            )}
          </aside>
        </div>
      </section>

      <section className="space-y-4">
        <div className="notice-section-heading">
          <div>
            <span className="notice-section-kicker">Atualizações recentes</span>
            <h2>Publicações mais importantes</h2>
          </div>
          <div className="notice-section-icon">
            <Megaphone className="h-5 w-5" />
          </div>
        </div>

        <div className="notice-featured-grid grid gap-4 lg:grid-cols-3">
          {featuredAnnouncements.length > 0 ? featuredAnnouncements.map((item) => {
            const actionIsExternal = item.ctaUrl?.startsWith('http');

            return (
              <article
                key={item.id}
                className={`notice-card notice-card-featured notice-card-priority-${item.priority || 'normal'} ${item.pinned ? 'is-pinned' : ''} rounded-2xl border border-slate-200 p-6 shadow-sm dark:border-slate-800`}
              >
                <div className="notice-card-top flex flex-wrap items-center gap-2">
                  <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    {item.tag}
                  </span>
                  <span className={`notice-priority-pill inline-flex rounded-full px-3 py-1 text-xs font-semibold ${priorityStyles[item.priority] || priorityStyles.normal}`}>
                    {item.priority === 'high' ? 'Prioridade alta' : item.priority === 'low' ? 'Informativo' : 'Atualização'}
                  </span>
                  {item.pinned && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700 dark:bg-orange-950 dark:text-orange-200">
                      <Pin className="h-3 w-3" />
                      Fixado
                    </span>
                  )}
                </div>

                <div className="notice-card-body">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{item.title}</h2>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{item.description}</p>
                </div>

                <div className="notice-card-meta inline-flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                  <CalendarDays className="h-4 w-4" />
                  Atualizado em {formatDate(item.updatedAt)}
                </div>

                {item.ctaLabel && item.ctaUrl && (
                  actionIsExternal ? (
                    <a
                      href={item.ctaUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="notice-cta-link inline-flex items-center gap-2 text-sm font-semibold text-orange-700 hover:text-orange-800 dark:text-orange-300"
                    >
                      {item.ctaLabel}
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  ) : (
                    <Link
                      to={item.ctaUrl}
                      className="notice-cta-link inline-flex items-center gap-2 text-sm font-semibold text-orange-700 hover:text-orange-800 dark:text-orange-300"
                    >
                      {item.ctaLabel}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  )
                )}
              </article>
            );
          }) : (
            <article className="notice-empty-state rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-500 shadow-sm dark:border-slate-700 dark:text-slate-300 lg:col-span-3">
              O mural está vazio no momento. Quando a administração publicar um novo comunicado, ele aparecerá aqui.
            </article>
          )}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <article className="notice-feed-panel rounded-2xl border border-slate-200 p-6 shadow-sm dark:border-slate-800">
          <div className="mb-3 inline-flex rounded-xl bg-blue-50 p-3 text-blue-700 dark:bg-blue-950 dark:text-blue-200">
            <BookOpen className="h-5 w-5" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Canal direto da administração</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Todos os recados abaixo são publicados apenas pelo admin para manter a comunicação clara, organizada e oficial.
          </p>

          <div className="mt-4 space-y-3">
            {moreAnnouncements.length > 0 ? moreAnnouncements.map((item) => (
              <div key={item.id} className="notice-feed-item rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-slate-900 dark:text-white">{item.title}</h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{formatDate(item.updatedAt)}</span>
                </div>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.description}</p>
              </div>
            )) : (
              <div className="notice-empty-state rounded-2xl border border-dashed border-slate-300 p-4 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                Os principais avisos já estão destacados acima.
              </div>
            )}
          </div>
        </article>

        <div className="space-y-4">
          <article className="notice-side-card notice-side-card-blue rounded-2xl border border-slate-200 p-6 shadow-sm dark:border-slate-800">
            <div className="mb-3 inline-flex rounded-xl bg-blue-50 p-3 text-blue-700 dark:bg-blue-950 dark:text-blue-200">
              <BookOpen className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Rotina sugerida</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-600 dark:text-slate-300">
              {reminders.map((reminder) => (
                <li key={reminder}>{reminder}</li>
              ))}
            </ul>
          </article>

          <article className="notice-side-card notice-side-card-green rounded-2xl border border-emerald-200 p-6 shadow-sm dark:border-emerald-900">
            <div className="mb-3 inline-flex rounded-xl bg-white/80 p-3 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200">
              <Sparkles className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Dica rápida</h2>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
              Revise em voz alta por 10 minutos após cada aula. Esse hábito simples acelera a memorização e melhora sua confiança ao falar.
            </p>
          </article>
        </div>
      </section>
    </div>
  );
};

export default NoticeBoardPage;
