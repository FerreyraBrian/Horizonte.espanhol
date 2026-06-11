import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Download,
  ExternalLink,
  Filter,
  FolderPlus,
  Pencil,
  PlusCircle,
  RotateCcw,
  Save,
  Search,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { activityService, materialService } from '../../services/storageService';
import '../../styles/admin.css';

const levelOptions = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

const lessonFormDefaults = {
  title: '',
  shortSummary: '',
  level: 'A1',
  isFree: true,
};

const materialFormDefaults = {
  lessonId: '',
  name: '',
  url: '',
};

const AdminMaterialsPage = ({ onMaterialsChange }) => {
  const { user } = useAuth();
  const [lessons, setLessons] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [accessFilter, setAccessFilter] = useState('all');
  const [selectedLessonId, setSelectedLessonId] = useState('');
  const [lessonForm, setLessonForm] = useState(lessonFormDefaults);
  const [materialForm, setMaterialForm] = useState(materialFormDefaults);
  const [editForm, setEditForm] = useState(lessonFormDefaults);

  const loadLessons = () => {
    const nextLessons = materialService.getAll();
    setLessons(nextLessons);
    setMaterialForm((prev) => {
      const hasSelectedLesson = nextLessons.some((lesson) => String(lesson.id) === String(prev.lessonId));

      return {
        ...prev,
        lessonId: hasSelectedLesson ? prev.lessonId : String(nextLessons[0]?.id ?? ''),
      };
    });
    setSelectedLessonId((prev) => {
      const hasSelectedLesson = nextLessons.some((lesson) => String(lesson.id) === String(prev));
      return hasSelectedLesson ? prev : String(nextLessons[0]?.id ?? '');
    });
    onMaterialsChange?.(nextLessons);
  };

  useEffect(() => {
    loadLessons();
  }, []);

  const selectedLesson = useMemo(
    () => lessons.find((lesson) => String(lesson.id) === String(selectedLessonId)) || null,
    [lessons, selectedLessonId]
  );

  useEffect(() => {
    if (!selectedLesson) {
      return;
    }

    setEditForm({
      title: selectedLesson.title || '',
      shortSummary: selectedLesson.shortSummary || '',
      level: selectedLesson.level || 'A1',
      isFree: Boolean(selectedLesson.isFree),
    });
  }, [selectedLesson]);

  const metrics = useMemo(() => ({
    totalLessons: lessons.length,
    totalResources: lessons.reduce((count, lesson) => count + (lesson.resources?.length ?? 0), 0),
    freeLessons: lessons.filter((lesson) => lesson.isFree).length,
    premiumLessons: lessons.filter((lesson) => !lesson.isFree).length,
  }), [lessons]);

  const filteredLessons = useMemo(() => {
    const normalizedQuery = searchTerm.trim().toLowerCase();

    return lessons.filter((lesson) => {
      const haystack = [lesson.title, lesson.shortSummary, lesson.level, lesson.courseSlug]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      const matchesQuery = !normalizedQuery || haystack.includes(normalizedQuery);
      const matchesLevel = levelFilter === 'all' || lesson.level === levelFilter;
      const matchesAccess = accessFilter === 'all'
        || (accessFilter === 'free' && lesson.isFree)
        || (accessFilter === 'premium' && !lesson.isFree);

      return matchesQuery && matchesLevel && matchesAccess;
    });
  }, [accessFilter, lessons, levelFilter, searchTerm]);

  const registerAdminActivity = (message) => {
    activityService.add({
      studentId: user?.id || 'admin-materials',
      studentName: user?.name || 'Administrador',
      type: 'content_managed',
      activity: message,
    });
  };

  const handleCreateLesson = (event) => {
    event.preventDefault();

    if (!lessonForm.title.trim()) {
      return;
    }

    const createdLesson = materialService.createLesson({
      title: lessonForm.title.trim(),
      shortSummary:
        lessonForm.shortSummary.trim()
        || `Conteúdo criado pelo administrador para ${lessonForm.title.trim()}.`,
      level: lessonForm.level,
      isFree: lessonForm.isFree,
    });

    if (createdLesson) {
      registerAdminActivity(`Criou a lição “${createdLesson.title}” na biblioteca.`);
      setLessonForm(lessonFormDefaults);
      setSelectedLessonId(String(createdLesson.id));
      loadLessons();
    }
  };

  const handleAddMaterial = (event) => {
    event.preventDefault();

    if (!materialForm.lessonId || !materialForm.name.trim()) {
      return;
    }

    const updatedLesson = materialService.addResource(materialForm.lessonId, {
      name: materialForm.name.trim(),
      url: materialForm.url.trim() || '#',
    });

    if (updatedLesson) {
      registerAdminActivity(`Adicionou o material “${materialForm.name.trim()}” na lição “${updatedLesson.title}”.`);
      setMaterialForm({
        lessonId: String(updatedLesson.id),
        name: '',
        url: '',
      });
      setSelectedLessonId(String(updatedLesson.id));
      loadLessons();
    }
  };

  const handleSaveLesson = (event) => {
    event.preventDefault();

    if (!selectedLesson) {
      return;
    }

    const summary = editForm.shortSummary.trim() || `Conteúdo complementar de ${editForm.title.trim() || selectedLesson.title}.`;
    const title = editForm.title.trim() || selectedLesson.title;
    const updatedLesson = materialService.updateLesson(selectedLesson.id, {
      title,
      shortSummary: summary,
      description: summary,
      fullSummary: summary,
      level: editForm.level,
      isFree: editForm.isFree,
    });

    if (updatedLesson) {
      registerAdminActivity(`Atualizou os dados da lição “${updatedLesson.title}”.`);
      loadLessons();
    }
  };

  const handleResetEditor = () => {
    if (!selectedLesson) {
      return;
    }

    setEditForm({
      title: selectedLesson.title || '',
      shortSummary: selectedLesson.shortSummary || '',
      level: selectedLesson.level || 'A1',
      isFree: Boolean(selectedLesson.isFree),
    });
  };

  const handleDeleteLesson = (lesson) => {
    const confirmed = window.confirm(`Deseja remover a lição "${lesson.title}" da plataforma?`);

    if (!confirmed) {
      return;
    }

    materialService.deleteLesson(lesson.id);
    registerAdminActivity(`Removeu a lição “${lesson.title}” da plataforma.`);
    loadLessons();
  };

  const handleDeleteResource = (lesson, resource) => {
    materialService.removeResource(lesson.id, resource.id);
    registerAdminActivity(`Removeu o material “${resource.name}” da lição “${lesson.title}”.`);
    loadLessons();
  };

  const handleExportLibrary = () => {
    const blob = new Blob([JSON.stringify(lessons, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'central-recursos-admin.json';
    link.click();
    window.URL.revokeObjectURL(url);
    registerAdminActivity('Exportou a biblioteca completa de recursos em JSON.');
  };

  return (
    <div className="admin-container admin-resources-page">
      <section className="admin-resource-hero">
        <div className="admin-resource-hero-grid">
          <div>
            <span className="admin-resource-badge">
              <ShieldCheck className="h-4 w-4" />
              Central própria do admin
            </span>
            <h1>Central de recursos do administrador</h1>
            <p>
              Desenvolvida para o admin dominar a biblioteca da plataforma com mais organização:
              criar lições, editar informações, publicar materiais, remover conteúdo e exportar a estrutura.
            </p>
          </div>

          <div className="admin-resource-actions">
            <button type="button" className="admin-resource-action-btn admin-resource-action-btn-primary" onClick={handleExportLibrary}>
              <Download className="h-4 w-4" />
              Exportar biblioteca
            </button>
            <Link to="/resources" className="admin-resource-action-btn">
              <BookOpen className="h-4 w-4" />
              Ver biblioteca do aluno
            </Link>
            <Link to="/dashboard" className="admin-resource-action-btn">
              <ExternalLink className="h-4 w-4" />
              Abrir app completo
            </Link>
          </div>
        </div>
      </section>

      <section className="admin-resource-metric-grid">
        <article className="admin-resource-metric-card">
          <span>Lições sob controle</span>
          <strong>{metrics.totalLessons}</strong>
          <small>Todos os níveis monitorados nesta central.</small>
        </article>
        <article className="admin-resource-metric-card">
          <span>Materiais publicados</span>
          <strong>{metrics.totalResources}</strong>
          <small>PDFs, links e downloads organizados.</small>
        </article>
        <article className="admin-resource-metric-card admin-resource-metric-card-highlight">
          <span>Conteúdo gratuito</span>
          <strong>{metrics.freeLessons}</strong>
          <small>{metrics.premiumLessons} lições premium ativas.</small>
        </article>
      </section>

      <section className="admin-resource-panel-grid">
        <form onSubmit={handleCreateLesson} className="card admin-resource-panel admin-resource-form-card">
          <div className="admin-resource-panel-header">
            <div>
              <h2><FolderPlus className="h-5 w-5" /> Criar nova lição</h2>
              <p>Cadastre uma nova aula e deixe a estrutura pronta para receber materiais.</p>
            </div>
          </div>

          <div className="admin-resource-form-grid">
            <input
              type="text"
              value={lessonForm.title}
              onChange={(event) => setLessonForm((prev) => ({ ...prev, title: event.target.value }))}
              placeholder="Título da nova lição"
              className="admin-resource-input"
            />
            <textarea
              value={lessonForm.shortSummary}
              onChange={(event) => setLessonForm((prev) => ({ ...prev, shortSummary: event.target.value }))}
              placeholder="Resumo curto da lição"
              rows={3}
              className="admin-resource-input admin-resource-textarea"
            />
            <div className="admin-resource-inline-grid">
              <select
                value={lessonForm.level}
                onChange={(event) => setLessonForm((prev) => ({ ...prev, level: event.target.value }))}
                className="admin-resource-input"
              >
                {levelOptions.map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
              <label className="admin-resource-checkbox">
                <input
                  type="checkbox"
                  checked={lessonForm.isFree}
                  onChange={(event) => setLessonForm((prev) => ({ ...prev, isFree: event.target.checked }))}
                />
                Aula gratuita
              </label>
            </div>
          </div>

          <button type="submit" className="admin-resource-button admin-resource-button-primary">
            <PlusCircle className="h-4 w-4" />
            Adicionar lição
          </button>
        </form>

        <form onSubmit={handleAddMaterial} className="card admin-resource-panel admin-resource-form-card">
          <div className="admin-resource-panel-header">
            <div>
              <h2><BookOpen className="h-5 w-5" /> Adicionar material</h2>
              <p>Escolha uma lição e publique um novo link, PDF ou arquivo complementar.</p>
            </div>
          </div>

          <div className="admin-resource-form-grid">
            <select
              value={materialForm.lessonId}
              onChange={(event) => setMaterialForm((prev) => ({ ...prev, lessonId: event.target.value }))}
              className="admin-resource-input"
            >
              {lessons.map((lesson) => (
                <option key={lesson.id} value={lesson.id}>
                  {lesson.level} • {lesson.title}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={materialForm.name}
              onChange={(event) => setMaterialForm((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="Nome do material"
              className="admin-resource-input"
            />
            <input
              type="url"
              value={materialForm.url}
              onChange={(event) => setMaterialForm((prev) => ({ ...prev, url: event.target.value }))}
              placeholder="https://arquivo-ou-link.com"
              className="admin-resource-input"
            />
          </div>

          <button type="submit" className="admin-resource-button admin-resource-button-success">
            <PlusCircle className="h-4 w-4" />
            Publicar material
          </button>
        </form>
      </section>

      <section className="admin-resource-panel-grid admin-resource-panel-grid-wide">
        <form onSubmit={handleSaveLesson} className="card admin-resource-panel admin-resource-form-card">
          <div className="admin-resource-panel-header">
            <div>
              <h2><Pencil className="h-5 w-5" /> Editar lição selecionada</h2>
              <p>Atualize título, resumo, nível e acesso da lição escolhida na biblioteca.</p>
            </div>
          </div>

          {selectedLesson ? (
            <>
              <div className="admin-resource-form-grid">
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(event) => setEditForm((prev) => ({ ...prev, title: event.target.value }))}
                  placeholder="Título da lição"
                  className="admin-resource-input"
                />
                <textarea
                  value={editForm.shortSummary}
                  onChange={(event) => setEditForm((prev) => ({ ...prev, shortSummary: event.target.value }))}
                  rows={4}
                  placeholder="Resumo da lição"
                  className="admin-resource-input admin-resource-textarea"
                />
                <div className="admin-resource-inline-grid">
                  <select
                    value={editForm.level}
                    onChange={(event) => setEditForm((prev) => ({ ...prev, level: event.target.value }))}
                    className="admin-resource-input"
                  >
                    {levelOptions.map((level) => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                  <label className="admin-resource-checkbox">
                    <input
                      type="checkbox"
                      checked={editForm.isFree}
                      onChange={(event) => setEditForm((prev) => ({ ...prev, isFree: event.target.checked }))}
                    />
                    Conteúdo gratuito
                  </label>
                </div>
              </div>

              <div className="admin-resource-editor-actions">
                <button type="submit" className="admin-resource-button admin-resource-button-primary">
                  <Save className="h-4 w-4" />
                  Salvar alterações
                </button>
                <button type="button" onClick={handleResetEditor} className="admin-resource-button admin-resource-button-ghost">
                  <RotateCcw className="h-4 w-4" />
                  Restaurar
                </button>
              </div>
            </>
          ) : (
            <div className="admin-resource-empty">
              Selecione uma lição na biblioteca para editar seus dados aqui.
            </div>
          )}
        </form>

        <section className="card admin-resource-panel admin-resource-library-panel">
          <div className="admin-resource-panel-header">
            <div>
              <h2><Filter className="h-5 w-5" /> Biblioteca administrável</h2>
              <p>Filtre, revise e remova lições ou materiais com mais controle.</p>
            </div>
          </div>

          <div className="admin-resource-toolbar">
            <div className="admin-resource-search">
              <Search className="h-4 w-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Buscar lição, nível ou resumo"
              />
            </div>
            <div className="admin-resource-filters">
              <select value={levelFilter} onChange={(event) => setLevelFilter(event.target.value)} className="admin-resource-input">
                <option value="all">Todos os níveis</option>
                {levelOptions.map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
              <select value={accessFilter} onChange={(event) => setAccessFilter(event.target.value)} className="admin-resource-input">
                <option value="all">Todo acesso</option>
                <option value="free">Só gratuitas</option>
                <option value="premium">Só premium</option>
              </select>
            </div>
          </div>

          <div className="admin-resource-list">
            {filteredLessons.map((lesson) => (
              <article
                key={lesson.id}
                className={`admin-resource-item ${String(selectedLessonId) === String(lesson.id) ? 'is-active' : ''}`}
              >
                <div className="admin-resource-item-top">
                  <div>
                    <div className="admin-resource-item-tags">
                      <span className="admin-resource-tag">{lesson.level || 'A1'}</span>
                      <span className="admin-resource-tag">Aula {lesson.orderIndex || '-'}</span>
                      <span className={`admin-resource-tag ${lesson.isFree ? 'is-free' : 'is-premium'}`}>
                        {lesson.isFree ? 'Gratuita' : 'Premium'}
                      </span>
                    </div>
                    <h3>{lesson.title}</h3>
                    <p>{lesson.shortSummary || lesson.description || 'Sem resumo cadastrado.'}</p>
                  </div>

                  <div className="admin-resource-item-actions">
                    <button
                      type="button"
                      onClick={() => setSelectedLessonId(String(lesson.id))}
                      className="admin-resource-button admin-resource-button-ghost"
                    >
                      <Pencil className="h-4 w-4" />
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteLesson(lesson)}
                      className="admin-resource-button admin-resource-button-danger"
                    >
                      <Trash2 className="h-4 w-4" />
                      Excluir lição
                    </button>
                  </div>
                </div>

                <div className="admin-resource-resource-list">
                  {(lesson.resources ?? []).length === 0 ? (
                    <div className="admin-resource-empty">Nenhum material cadastrado nesta lição ainda.</div>
                  ) : (
                    (lesson.resources ?? []).map((resource) => (
                      <div key={resource.id} className="admin-resource-resource-row">
                        <div className="admin-resource-resource-meta">
                          <div className="admin-resource-resource-icon">
                            <Download className="h-4 w-4" />
                          </div>
                          <div>
                            <strong>{resource.name}</strong>
                            <a href={resource.url} target="_blank" rel="noreferrer">{resource.url}</a>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteResource(lesson, resource)}
                          className="admin-resource-button admin-resource-button-ghost"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remover
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </article>
            ))}

            {filteredLessons.length === 0 && (
              <div className="admin-resource-empty">
                Nenhuma lição encontrada para os filtros informados.
              </div>
            )}
          </div>
        </section>
      </section>
    </div>
  );
};

export default AdminMaterialsPage;
