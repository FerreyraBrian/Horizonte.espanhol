import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BellRing,
  Eye,
  EyeOff,
  ExternalLink,
  Megaphone,
  Newspaper,
  Pin,
  PlusCircle,
  Save,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { activityService, noticeBoardService } from '../../services/storageService';
import '../../styles/admin.css';

const noticeFormDefaults = {
  title: '',
  tag: 'Aviso importante',
  category: 'general',
  description: '',
  ctaLabel: '',
  ctaUrl: '/resources',
  priority: 'normal',
  pinned: false,
  published: true,
};

const categoryOptions = [
  { value: 'general', label: 'Comunicado geral' },
  { value: 'resource', label: 'Novo recurso' },
  { value: 'schedule', label: 'Agenda e datas' },
  { value: 'reminder', label: 'Lembrete' },
];

const priorityOptions = [
  { value: 'low', label: 'Baixa' },
  { value: 'normal', label: 'Normal' },
  { value: 'high', label: 'Alta' },
];

const formatDate = (value) => {
  if (!value) {
    return 'Agora mesmo';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
};

const AdminNoticeBoardPage = () => {
  const { user } = useAuth();
  const [notices, setNotices] = useState([]);
  const [selectedNoticeId, setSelectedNoticeId] = useState('');
  const [createForm, setCreateForm] = useState(noticeFormDefaults);
  const [editForm, setEditForm] = useState(noticeFormDefaults);

  const loadNotices = () => {
    const nextNotices = noticeBoardService.getAll();
    setNotices(nextNotices);
    setSelectedNoticeId((prev) => {
      const hasSelection = nextNotices.some((notice) => String(notice.id) === String(prev));
      return hasSelection ? prev : String(nextNotices[0]?.id ?? '');
    });
  };

  useEffect(() => {
    loadNotices();
  }, []);

  const selectedNotice = useMemo(
    () => notices.find((notice) => String(notice.id) === String(selectedNoticeId)) || null,
    [notices, selectedNoticeId]
  );

  useEffect(() => {
    if (!selectedNotice) {
      setEditForm(noticeFormDefaults);
      return;
    }

    setEditForm({
      title: selectedNotice.title || '',
      tag: selectedNotice.tag || 'Aviso importante',
      category: selectedNotice.category || 'general',
      description: selectedNotice.description || '',
      ctaLabel: selectedNotice.ctaLabel || '',
      ctaUrl: selectedNotice.ctaUrl || '',
      priority: selectedNotice.priority || 'normal',
      pinned: Boolean(selectedNotice.pinned),
      published: Boolean(selectedNotice.published),
    });
  }, [selectedNotice]);

  const metrics = useMemo(() => ({
    total: notices.length,
    published: notices.filter((notice) => notice.published).length,
    pinned: notices.filter((notice) => notice.pinned).length,
    resourceUpdates: notices.filter((notice) => notice.category === 'resource').length,
  }), [notices]);

  const latestNotice = useMemo(() => notices[0] || null, [notices]);

  const registerAdminActivity = (message) => {
    activityService.add({
      studentId: user?.id || 'admin-notices',
      studentName: user?.name || 'Administrador',
      type: 'notice_board',
      activity: message,
    });
  };

  const sanitizeForm = (form) => ({
    title: form.title.trim(),
    tag: form.tag.trim() || 'Aviso importante',
    category: form.category,
    description: form.description.trim(),
    ctaLabel: form.ctaLabel.trim(),
    ctaUrl: form.ctaUrl.trim(),
    priority: form.priority,
    pinned: Boolean(form.pinned),
    published: Boolean(form.published),
  });

  const handleCreateNotice = (event) => {
    event.preventDefault();

    const payload = sanitizeForm(createForm);

    if (!payload.title || !payload.description) {
      return;
    }

    const createdNotice = noticeBoardService.create(payload);

    if (createdNotice) {
      registerAdminActivity(`Publicou o aviso “${createdNotice.title}” no mural.`);
      setCreateForm(noticeFormDefaults);
      loadNotices();
      setSelectedNoticeId(String(createdNotice.id));
    }
  };

  const handleSaveNotice = (event) => {
    event.preventDefault();

    if (!selectedNotice) {
      return;
    }

    const payload = sanitizeForm(editForm);

    if (!payload.title || !payload.description) {
      return;
    }

    const updatedNotice = noticeBoardService.update(selectedNotice.id, payload);

    if (updatedNotice) {
      registerAdminActivity(`Atualizou o aviso “${updatedNotice.title}” no mural.`);
      loadNotices();
    }
  };

  const handleTogglePublished = (notice) => {
    const updatedNotice = noticeBoardService.togglePublished(notice.id);

    if (updatedNotice) {
      registerAdminActivity(
        `${updatedNotice.published ? 'Publicou' : 'Ocultou'} o aviso “${updatedNotice.title}”.`
      );
      loadNotices();
    }
  };

  const handleDeleteNotice = (notice) => {
    const confirmed = window.confirm(`Deseja remover o aviso "${notice.title}" do mural?`);

    if (!confirmed) {
      return;
    }

    noticeBoardService.remove(notice.id);
    registerAdminActivity(`Removeu o aviso “${notice.title}” do mural.`);
    loadNotices();
  };

  const handleResetEditor = () => {
    if (!selectedNotice) {
      return;
    }

    setEditForm({
      title: selectedNotice.title || '',
      tag: selectedNotice.tag || 'Aviso importante',
      category: selectedNotice.category || 'general',
      description: selectedNotice.description || '',
      ctaLabel: selectedNotice.ctaLabel || '',
      ctaUrl: selectedNotice.ctaUrl || '',
      priority: selectedNotice.priority || 'normal',
      pinned: Boolean(selectedNotice.pinned),
      published: Boolean(selectedNotice.published),
    });
  };

  return (
    <div className="admin-container admin-notice-board-page">
      <section className="admin-notice-hero rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="admin-notice-hero-grid flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <span className="admin-notice-badge inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700 dark:bg-amber-950 dark:text-amber-200">
              <ShieldCheck className="h-4 w-4" />
              Canal unilateral do administrador
            </span>
            <h1 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">Gerenciar mural de avisos</h1>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              Publique comunicados, anúncios do curso e lançamentos de novos recursos em um único canal oficial.
              Somente o admin altera o conteúdo; os alunos acessam apenas a leitura.
            </p>
          </div>

          <aside className="admin-notice-hero-preview">
            <span className="admin-notice-preview-kicker">
              <BellRing className="h-4 w-4" />
              Prévia do canal
            </span>

            {latestNotice ? (
              <>
                <h2 className="admin-notice-preview-title">{latestNotice.title}</h2>
                <p className="admin-notice-preview-text">{latestNotice.description}</p>
                <div className="admin-notice-preview-date">Atualizado em {formatDate(latestNotice.updatedAt)}</div>
              </>
            ) : (
              <p className="admin-notice-preview-text">Nenhum aviso criado ainda. Use o formulário abaixo para publicar o primeiro comunicado.</p>
            )}

            <div className="admin-notice-hero-actions flex flex-wrap gap-2">
              <Link
                to="/cartelera"
                className="admin-notice-link-btn inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <ExternalLink className="h-4 w-4" />
                Ver mural do aluno
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <section className="admin-notice-metric-grid grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="admin-notice-metric-card rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <span className="admin-notice-metric-label text-sm text-slate-500 dark:text-slate-400">Total de avisos</span>
          <div className="admin-notice-metric-value mt-2 text-3xl font-bold text-slate-900 dark:text-white">{metrics.total}</div>
        </article>
        <article className="admin-notice-metric-card admin-notice-metric-card-emerald rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm dark:border-emerald-900 dark:bg-emerald-950/30">
          <span className="admin-notice-metric-label text-sm text-emerald-700 dark:text-emerald-200">Publicados</span>
          <div className="admin-notice-metric-value mt-2 text-3xl font-bold text-emerald-800 dark:text-emerald-100">{metrics.published}</div>
        </article>
        <article className="admin-notice-metric-card admin-notice-metric-card-amber rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm dark:border-amber-900 dark:bg-amber-950/30">
          <span className="admin-notice-metric-label text-sm text-amber-700 dark:text-amber-200">Fixados</span>
          <div className="admin-notice-metric-value mt-2 text-3xl font-bold text-amber-800 dark:text-amber-100">{metrics.pinned}</div>
        </article>
        <article className="admin-notice-metric-card admin-notice-metric-card-blue rounded-2xl border border-blue-200 bg-blue-50 p-5 shadow-sm dark:border-blue-900 dark:bg-blue-950/30">
          <span className="admin-notice-metric-label text-sm text-blue-700 dark:text-blue-200">Atualizações de recursos</span>
          <div className="admin-notice-metric-value mt-2 text-3xl font-bold text-blue-800 dark:text-blue-100">{metrics.resourceUpdates}</div>
        </article>
      </section>

      <section className="admin-notice-panel-grid grid gap-6 xl:grid-cols-[1fr_1.1fr]">
        <form onSubmit={handleCreateNotice} className="admin-notice-panel rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="admin-notice-panel-header mb-5 flex items-start justify-between gap-3">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                <PlusCircle className="h-5 w-5 text-amber-500" />
                Novo aviso
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Crie um comunicado e publique no mural em segundos.</p>
            </div>
          </div>

          <div className="admin-notice-form-grid grid gap-4">
            <input
              type="text"
              value={createForm.title}
              onChange={(event) => setCreateForm((prev) => ({ ...prev, title: event.target.value }))}
              placeholder="Título do aviso"
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
            <div className="admin-notice-inline-grid grid gap-4 md:grid-cols-2">
              <input
                type="text"
                value={createForm.tag}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, tag: event.target.value }))}
                placeholder="Etiqueta curta"
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
              <select
                value={createForm.category}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, category: event.target.value }))}
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              >
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            <textarea
              value={createForm.description}
              onChange={(event) => setCreateForm((prev) => ({ ...prev, description: event.target.value }))}
              placeholder="Mensagem principal do aviso"
              rows={5}
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
            <div className="grid gap-4 md:grid-cols-2">
              <input
                type="text"
                value={createForm.ctaLabel}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, ctaLabel: event.target.value }))}
                placeholder="Texto do botão (opcional)"
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
              <input
                type="text"
                value={createForm.ctaUrl}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, ctaUrl: event.target.value }))}
                placeholder="Link interno ou externo"
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
            </div>
            <div className="admin-notice-toggle-grid grid gap-4 md:grid-cols-3">
              <select
                value={createForm.priority}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, priority: event.target.value }))}
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              >
                {priorityOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <label className="admin-notice-toggle flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-200">
                <input
                  type="checkbox"
                  checked={createForm.pinned}
                  onChange={(event) => setCreateForm((prev) => ({ ...prev, pinned: event.target.checked }))}
                />
                Fixar no topo
              </label>
              <label className="admin-notice-toggle flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-200">
                <input
                  type="checkbox"
                  checked={createForm.published}
                  onChange={(event) => setCreateForm((prev) => ({ ...prev, published: event.target.checked }))}
                />
                Publicar agora
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="admin-notice-primary-btn mt-5 inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-amber-500 dark:text-slate-950 dark:hover:bg-amber-400"
          >
            <Megaphone className="h-4 w-4" />
            Criar aviso
          </button>
        </form>

        <div className="admin-notice-panel rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="admin-notice-panel-header mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                <Newspaper className="h-5 w-5 text-blue-500" />
                Avisos existentes
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Selecione um item para editar, ocultar ou remover.</p>
            </div>
          </div>

          <div className="admin-notice-list space-y-3">
            {notices.map((notice) => (
              <article
                key={notice.id}
                className={`admin-notice-list-item rounded-2xl border p-4 transition ${String(selectedNoticeId) === String(notice.id) ? 'is-selected border-slate-900 bg-slate-50 dark:border-amber-400 dark:bg-slate-800/80' : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950/40'} ${!notice.published ? 'is-hidden' : ''}`}
              >
                <div className="admin-notice-list-row flex flex-wrap items-start justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedNoticeId(String(notice.id))}
                    className="admin-notice-item-content text-left"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="admin-notice-tag rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">{notice.tag}</span>
                      {notice.pinned && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-950 dark:text-amber-200">
                          <Pin className="h-3 w-3" /> Fixado
                        </span>
                      )}
                    </div>
                    <h3 className="mt-2 text-base font-semibold text-slate-900 dark:text-white">{notice.title}</h3>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{notice.description}</p>
                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Atualizado em {formatDate(notice.updatedAt)}</p>
                  </button>

                  <div className="admin-notice-item-actions flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleTogglePublished(notice)}
                      className="admin-notice-secondary-btn inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      {notice.published ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      {notice.published ? 'Ocultar' : 'Publicar'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteNotice(notice)}
                      className="admin-notice-danger-btn inline-flex items-center gap-1 rounded-xl border border-rose-200 px-3 py-2 text-xs font-medium text-rose-700 hover:bg-rose-50 dark:border-rose-900 dark:text-rose-200 dark:hover:bg-rose-950/40"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Excluir
                    </button>
                  </div>
                </div>
              </article>
            ))}

            {notices.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                Nenhum aviso foi criado ainda. Use o formulário ao lado para publicar o primeiro comunicado.
              </div>
            )}
          </div>
        </div>
      </section>

      {selectedNotice && (
        <form onSubmit={handleSaveNotice} className="admin-notice-panel admin-notice-editor rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="admin-notice-panel-header mb-5 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                <BellRing className="h-5 w-5 text-amber-500" />
                Editar aviso selecionado
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Ajuste o conteúdo antes de publicar ou atualizar o mural.</p>
            </div>
            <span className={`admin-notice-status-pill rounded-full px-3 py-1 text-xs font-semibold ${selectedNotice.published ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200'}`}>
              {selectedNotice.published ? 'Publicado' : 'Oculto'}
            </span>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <input
              type="text"
              value={editForm.title}
              onChange={(event) => setEditForm((prev) => ({ ...prev, title: event.target.value }))}
              placeholder="Título do aviso"
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
            <input
              type="text"
              value={editForm.tag}
              onChange={(event) => setEditForm((prev) => ({ ...prev, tag: event.target.value }))}
              placeholder="Etiqueta curta"
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
            <select
              value={editForm.category}
              onChange={(event) => setEditForm((prev) => ({ ...prev, category: event.target.value }))}
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            >
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <select
              value={editForm.priority}
              onChange={(event) => setEditForm((prev) => ({ ...prev, priority: event.target.value }))}
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            >
              {priorityOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <textarea
            value={editForm.description}
            onChange={(event) => setEditForm((prev) => ({ ...prev, description: event.target.value }))}
            placeholder="Mensagem principal"
            rows={5}
            className="mt-4 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <input
              type="text"
              value={editForm.ctaLabel}
              onChange={(event) => setEditForm((prev) => ({ ...prev, ctaLabel: event.target.value }))}
              placeholder="Texto do botão"
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
            <input
              type="text"
              value={editForm.ctaUrl}
              onChange={(event) => setEditForm((prev) => ({ ...prev, ctaUrl: event.target.value }))}
              placeholder="Link interno ou externo"
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <label className="admin-notice-toggle flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-200">
              <input
                type="checkbox"
                checked={editForm.pinned}
                onChange={(event) => setEditForm((prev) => ({ ...prev, pinned: event.target.checked }))}
              />
              Fixar no topo
            </label>
            <label className="admin-notice-toggle flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-200">
              <input
                type="checkbox"
                checked={editForm.published}
                onChange={(event) => setEditForm((prev) => ({ ...prev, published: event.target.checked }))}
              />
              Deixar publicado
            </label>
          </div>

          <div className="admin-notice-editor-actions mt-5 flex flex-wrap gap-3">
            <button
              type="submit"
              className="admin-notice-primary-btn inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-amber-500 dark:text-slate-950 dark:hover:bg-amber-400"
            >
              <Save className="h-4 w-4" />
              Salvar alterações
            </button>
            <button
              type="button"
              onClick={handleResetEditor}
              className="admin-notice-secondary-btn inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <Pin className="h-4 w-4" />
              Restaurar dados atuais
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AdminNoticeBoardPage;
