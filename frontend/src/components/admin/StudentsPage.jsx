import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Clock3,
  GraduationCap,
  MoreHorizontal,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  Users,
} from 'lucide-react';
import api, { getApiErrorMessage } from '../../services/authService';
import { activityService, studentService } from '../../services/storageService';
import '../../styles/admin.css';

const statusLabels = {
  active: 'Ativo',
  pending: 'Pendente',
  suspended: 'Suspenso',
  expired: 'Expirado',
  inactive: 'Inativo',
};

const roleLabels = {
  STUDENT: 'Adulto',
  KIDS: 'Infantil',
  TEACHER: 'Professor',
  ADMIN: 'Admin',
};

const formatDate = (value) => {
  if (!value) return 'Sem registro';

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
};

const formatRelativeWindow = (value) => {
  if (!value) return 'Sem atividade recente';

  const diffInHours = Math.max(0, Math.round((Date.now() - new Date(value).getTime()) / (1000 * 60 * 60)));

  if (diffInHours < 1) return 'Agora há pouco';
  if (diffInHours < 24) return `${diffInHours}h atrás`;

  const diffInDays = Math.round(diffInHours / 24);
  return `${diffInDays}d atrás`;
};

const normalizeStatus = (status) => String(status || 'pending').toLowerCase();

const normalizeStudent = (student, activities = []) => {
  const normalizedStatus = normalizeStatus(student.status);
  const studentActivities = activities.filter((activity) => String(activity.studentId) === String(student.id));
  const latestActivity = studentActivities[0] || null;
  const progress = Math.max(0, Math.min(100, Number(student.progress || 0)));

  return {
    ...student,
    status: normalizedStatus,
    progress,
    roleLabel: roleLabels[student.role] || student.role || 'Aluno',
    activityCount: studentActivities.length,
    latestActivity,
    lastTouchpoint: latestActivity?.timestamp || student.lastLogin || student.createdAt,
    momentum: progress >= 75 ? 'high' : progress >= 40 ? 'medium' : 'low',
  };
};

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [activities, setActivities] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [sortMode, setSortMode] = useState('progress');
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dataSource, setDataSource] = useState('api');

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError('');

      const [studentResponse, localActivities] = await Promise.all([
        api.get('/admin/students'),
        Promise.resolve(activityService.getAll()),
      ]);

      setStudents(studentResponse.data.map((student) => normalizeStudent(student, localActivities)));
      setActivities(localActivities);
      setDataSource('api');
    } catch (requestError) {
      const localActivities = activityService.getAll();
      const localStudents = studentService.getAll().map((student) => normalizeStudent(student, localActivities));

      setStudents(localStudents);
      setActivities(localActivities);
      setDataSource('local');
      setError(getApiErrorMessage(requestError, 'Mostrando a visão local de progresso dos alunos.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const filteredStudents = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    let nextStudents = students.filter((student) => {
      if (activeTab === 'active' && student.status !== 'active') return false;
      if (activeTab === 'attention' && !(student.progress < 35 || student.status === 'pending')) return false;
      if (activeTab === 'inactive' && !['inactive', 'suspended', 'expired'].includes(student.status)) return false;
      if (activeTab === 'kids' && student.role !== 'KIDS') return false;
      if (!query) return true;

      return [student.name, student.email, student.roleLabel].some((value) => String(value || '').toLowerCase().includes(query));
    });

    nextStudents = [...nextStudents].sort((left, right) => {
      if (sortMode === 'recent') {
        return new Date(right.lastTouchpoint || 0).getTime() - new Date(left.lastTouchpoint || 0).getTime();
      }

      if (sortMode === 'risk') {
        return left.progress - right.progress;
      }

      return right.progress - left.progress;
    });

    return nextStudents;
  }, [activeTab, searchTerm, sortMode, students]);

  const metrics = useMemo(() => {
    const total = students.length;
    const active = students.filter((student) => student.status === 'active').length;
    const averageProgress = total ? Math.round(students.reduce((sum, student) => sum + student.progress, 0) / total) : 0;
    const attention = students.filter((student) => student.progress < 35 || student.status === 'pending').length;
    const recentlyEngaged = students.filter((student) => {
      if (!student.lastTouchpoint) return false;
      const diff = Date.now() - new Date(student.lastTouchpoint).getTime();
      return diff <= 1000 * 60 * 60 * 24 * 3;
    }).length;

    return { total, active, averageProgress, attention, recentlyEngaged };
  }, [students]);

  const spotlightStudents = useMemo(() => (
    [...students]
      .filter((student) => student.status === 'active')
      .sort((left, right) => right.progress - left.progress)
      .slice(0, 3)
  ), [students]);

  const studentsNeedingAttention = useMemo(() => (
    [...students]
      .filter((student) => student.progress < 35 || student.status === 'pending' || !student.lastTouchpoint)
      .sort((left, right) => left.progress - right.progress)
      .slice(0, 4)
  ), [students]);

  const recentActivity = useMemo(() => activities.slice(0, 6), [activities]);

  const toggleDropdown = (studentId) => {
    setDropdownOpen(dropdownOpen === studentId ? null : studentId);
  };

  const updateStudentStatus = async (studentId, status) => {
    const normalizedStatus = normalizeStatus(status);

    try {
      setError('');

      if (dataSource === 'api') {
        await api.patch(`/admin/students/${studentId}/status?status=${status}`);
      } else if (normalizedStatus === 'active') {
        studentService.activate(studentId);
      } else {
        studentService.update(studentId, { status: normalizedStatus });
      }

      setStudents((currentStudents) => currentStudents.map((student) => (
        String(student.id) === String(studentId)
          ? normalizeStudent({ ...student, status: normalizedStatus }, activities)
          : student
      )));
      setDropdownOpen(null);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Não foi possível atualizar o status do aluno.'));
    }
  };

  return (
    <div className="admin-container students-progress-page">
      <section className="students-progress-hero">
        <div className="students-progress-hero-grid">
          <div>
            <span className="students-progress-badge">
              <Target className="h-4 w-4" />
              Missão principal da plataforma
            </span>
            <h1>Acompanhar o progresso do aluno até a meta final de aprendizagem.</h1>
            <p>
              Esta página deixa de ser apenas controle de acesso e passa a ser um painel para identificar evolução,
              engajamento e risco de abandono. O foco é enxergar quem está avançando, quem precisa de intervenção e onde o curso está gerando resultado real.
            </p>

            <div className="students-progress-pill-row">
              <span className="students-progress-pill"><ShieldCheck className="h-4 w-4" /> {metrics.active} alunos ativos</span>
              <span className="students-progress-pill"><Sparkles className="h-4 w-4" /> {metrics.averageProgress}% de progresso médio</span>
              <span className="students-progress-pill"><Clock3 className="h-4 w-4" /> {metrics.recentlyEngaged} com atividade recente</span>
            </div>
          </div>

          <aside className="students-progress-preview">
            <span className="students-progress-preview-kicker">
              <Trophy className="h-4 w-4" />
              Leitura rápida
            </span>
            <h2>O que observar todos os dias</h2>
            <ul>
              <li><span>1</span><p>Alunos com progresso baixo e pouco contato recente.</p></li>
              <li><span>2</span><p>Quem está perto de concluir e pode virar prova social do curso.</p></li>
              <li><span>3</span><p>Pendências de acesso que travam a jornada de aprendizagem.</p></li>
            </ul>
          </aside>
        </div>
      </section>

      {error && <p className="students-progress-banner">{error}</p>}

      <section className="students-progress-metric-grid">
        <article className="students-progress-metric-card">
          <span className="students-progress-metric-icon"><Users className="h-5 w-5" /></span>
          <p>Total monitorado</p>
          <strong>{metrics.total}</strong>
          <small>Todos os perfis acompanhados dentro da jornada.</small>
        </article>
        <article className="students-progress-metric-card">
          <span className="students-progress-metric-icon"><GraduationCap className="h-5 w-5" /></span>
          <p>Meta de evolução</p>
          <strong>{metrics.averageProgress}%</strong>
          <small>Média geral de progresso entre os alunos cadastrados.</small>
        </article>
        <article className="students-progress-metric-card students-progress-metric-card-alert">
          <span className="students-progress-metric-icon"><AlertTriangle className="h-5 w-5" /></span>
          <p>Precisam de atenção</p>
          <strong>{metrics.attention}</strong>
          <small>Baixo progresso, pendência ou risco de perder ritmo.</small>
        </article>
      </section>

      <section className="students-progress-content-grid">
        <div className="students-progress-panel">
          <div className="students-progress-toolbar">
            <div className="students-progress-search">
              <Search className="h-4 w-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Buscar aluno, e-mail ou segmento..."
              />
            </div>

            <div className="students-progress-selects">
              <select value={activeTab} onChange={(event) => setActiveTab(event.target.value)}>
                <option value="all">Todos</option>
                <option value="active">Ativos</option>
                <option value="attention">Precisam de atenção</option>
                <option value="kids">Infantil</option>
                <option value="inactive">Inativos</option>
              </select>
              <select value={sortMode} onChange={(event) => setSortMode(event.target.value)}>
                <option value="progress">Ordenar por progresso</option>
                <option value="recent">Ordenar por atividade recente</option>
                <option value="risk">Ordenar por risco</option>
              </select>
            </div>
          </div>

          <div className="students-progress-panel-head">
            <h2>Radar de aprendizagem</h2>
            <p>
              {loading ? 'Carregando visão de progresso...' : `${filteredStudents.length} alunos na visualização atual.`}
            </p>
          </div>

          <StudentTable
            students={filteredStudents}
            dropdownOpen={dropdownOpen}
            toggleDropdown={toggleDropdown}
            updateStudentStatus={updateStudentStatus}
            loading={loading}
          />
        </div>

        <div className="students-progress-side-stack">
          <section className="students-progress-panel students-progress-panel-accent">
            <div className="students-progress-panel-head">
              <h2>Alunos em destaque</h2>
              <p>Quem está convertendo bem o curso em avanço concreto.</p>
            </div>

            <div className="students-progress-spotlight-list">
              {spotlightStudents.map((student) => (
                <article key={student.id} className="students-progress-spotlight-item">
                  <div>
                    <strong>{student.name}</strong>
                    <p>{student.roleLabel} · {student.email}</p>
                  </div>
                  <span>{student.progress}%</span>
                </article>
              ))}
            </div>
          </section>

          <section className="students-progress-panel students-progress-panel-warning">
            <div className="students-progress-panel-head">
              <h2>Intervenção recomendada</h2>
              <p>Alunos com mais chance de travar antes da meta final.</p>
            </div>

            <div className="students-progress-alert-list">
              {studentsNeedingAttention.map((student) => (
                <article key={student.id} className="students-progress-alert-item">
                  <div>
                    <strong>{student.name}</strong>
                    <p>{student.progress}% · {statusLabels[student.status] || student.status}</p>
                  </div>
                  <small>{formatRelativeWindow(student.lastTouchpoint)}</small>
                </article>
              ))}
            </div>
          </section>

          <section className="students-progress-panel">
            <div className="students-progress-panel-head">
              <h2>Atividade recente</h2>
              <p>Últimos sinais de engajamento registrados no ambiente.</p>
            </div>

            <div className="students-progress-feed">
              {recentActivity.map((activity) => (
                <article key={activity.id} className="students-progress-feed-item">
                  <strong>{activity.studentName}</strong>
                  <p>{activity.activity}</p>
                  <small>{formatRelativeWindow(activity.timestamp)}</small>
                </article>
              ))}
            </div>
          </section>
        </div>
      </section>
    </div>
  );
};

const StudentTable = ({ students, dropdownOpen, toggleDropdown, updateStudentStatus, loading }) => {
  if (loading) {
    return <p className="students-progress-empty">Sincronizando indicadores de aprendizagem...</p>;
  }

  if (students.length === 0) {
    return <p className="students-progress-empty">Nenhum aluno encontrado para os filtros aplicados.</p>;
  }

  return (
    <div className="students-progress-table-wrap">
      <table className="students-progress-table">
        <thead>
          <tr>
            <th>Aluno</th>
            <th>Status</th>
            <th>Segmento</th>
            <th>Progresso</th>
            <th>Último sinal</th>
            <th>Engajamento</th>
            <th>
              <span className="sr-only">Ações</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>
                <div className="students-progress-person">
                  <div className="students-progress-avatar">{student.name?.charAt(0) || 'A'}</div>
                  <div>
                    <strong>{student.name}</strong>
                    <p>{student.email}</p>
                  </div>
                </div>
              </td>
              <td>
                <span className={`students-progress-status is-${student.status}`}>{statusLabels[student.status] || student.status}</span>
              </td>
              <td>{student.roleLabel}</td>
              <td>
                <div className="students-progress-bar-row">
                  <div className="students-progress-track">
                    <div className={`students-progress-fill is-${student.momentum}`} style={{ width: `${student.progress}%` }} />
                  </div>
                  <span>{student.progress}%</span>
                </div>
              </td>
              <td>{formatRelativeWindow(student.lastTouchpoint)}</td>
              <td>{student.activityCount} interações</td>
              <td>
                <div className="students-progress-dropdown">
                  <button
                    onClick={() => toggleDropdown(student.id)}
                    className="students-progress-action-btn"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                  {dropdownOpen === student.id && (
                    <div className="students-progress-dropdown-menu">
                      <button onClick={() => updateStudentStatus(student.id, 'ACTIVE')}>Ativar acesso</button>
                      <button onClick={() => updateStudentStatus(student.id, 'SUSPENDED')}>Suspender</button>
                      <button onClick={() => updateStudentStatus(student.id, 'EXPIRED')}>Expirar</button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentsPage;
