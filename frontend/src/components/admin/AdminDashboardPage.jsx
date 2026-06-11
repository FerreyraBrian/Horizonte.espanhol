import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  TrendingUp,
  Activity,
  Clock,
  ArrowUp,
  ArrowDown,
  MessageSquare,
  BookOpen,
  Shield,
  FileText,
  Settings,
  ToyBrick,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { studentService, activityService, materialService } from '../../services/storageService';
import UserAvatar from '../ui/UserAvatar';
import '../../styles/admin.css';

const AdminDashboardPage = () => {
  const [students, setStudents] = useState([]);
  const [activities, setActivities] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [materialMetrics, setMaterialMetrics] = useState(null);

  // Load data from localStorage
  useEffect(() => {
    const loadData = () => {
      const allStudents = studentService.getAll();
      const recentActivities = activityService.getRecent(10);
      const metricsData = studentService.getMetrics();
      const resourceMetricsData = materialService.getMetrics();

      setStudents(allStudents);
      setActivities(recentActivities);
      setMetrics(metricsData);
      setMaterialMetrics(resourceMetricsData);
    };

    loadData();
  }, []);

  // Top and Bottom Students
  const featuredStudents = useMemo(() => {
    const sorted = [...students].sort((a, b) => (b.progress || 0) - (a.progress || 0));
    return {
      top: sorted.slice(0, 2),
      bottom: sorted.slice(-2).reverse(),
    };
  }, [students]);

  const summaryCards = useMemo(() => {
    if (!metrics || !materialMetrics) return [];

    const activePercentage = metrics.total
      ? `${Math.round((metrics.active / metrics.total) * 100)}%`
      : '0%';

    return [
      {
        title: 'Total de Usuários',
        value: String(metrics.total),
        icon: <Users className="h-6 w-6 text-gray-500" />,
        caption: `${metrics.pending} aguardando aprovação`,
        tone: 'warning',
      },
      {
        title: 'Acessos Ativos',
        value: String(metrics.active),
        icon: <Activity className="h-6 w-6 text-green-500" />,
        caption: `Taxa de ativação ${activePercentage}`,
        tone: 'success',
      },
      {
        title: 'Lições Gerenciadas',
        value: String(materialMetrics.totalLessons),
        icon: <BookOpen className="h-6 w-6 text-blue-500" />,
        caption: `${materialMetrics.freeLessons} gratuitas`,
        tone: 'success',
      },
      {
        title: 'Materiais Publicados',
        value: String(materialMetrics.totalResources),
        icon: <FileText className="h-6 w-6 text-amber-500" />,
        caption: `${materialMetrics.premiumLessons} aulas premium`,
        tone: 'warning',
      },
    ];
  }, [materialMetrics, metrics]);

  const controlCenterLinks = useMemo(() => ([
    {
      to: '/admin/usuarios',
      title: 'Gerenciar Usuários',
      description: 'Ativar, editar papéis e acompanhar alunos.',
      icon: <Users className="h-5 w-5" style={{ color: '#3b82f6' }} />,
      className: 'admin-quick-link-blue',
    },
    {
      to: '/admin/recursos',
      title: 'Central de Recursos',
      description: 'Dominar materiais, lições e downloads da plataforma.',
      icon: <BookOpen className="h-5 w-5" style={{ color: '#2563eb' }} />,
      className: 'admin-quick-link-blue',
    },
    {
      to: '/admin/atividades',
      title: 'Atividades',
      description: 'Monitorar interações e progresso recente.',
      icon: <Activity className="h-5 w-5" style={{ color: '#10b981' }} />,
      className: 'admin-quick-link-green',
    },
    {
      to: '/admin/ori',
      title: 'Relatório Ori',
      description: 'Ver padrões de uso e perguntas mais frequentes do assistente.',
      icon: <Sparkles className="h-5 w-5" style={{ color: '#f59e0b' }} />,
      className: 'admin-quick-link-blue',
    },
    {
      to: '/admin/permissoes',
      title: 'Permissões',
      description: 'Controlar o acesso de cada papel dentro do app.',
      icon: <Shield className="h-5 w-5" style={{ color: '#7c3aed' }} />,
      className: 'admin-quick-link-gold',
    },
    {
      to: '/admin/submissoes',
      title: 'Submissões',
      description: 'Revisar entregas e arquivos enviados.',
      icon: <FileText className="h-5 w-5" style={{ color: '#f59e0b' }} />,
      className: 'admin-quick-link-gold',
    },
    {
      to: '/admin/infantil',
      title: 'Área Infantil',
      description: 'Organizar o conteúdo infantil da plataforma.',
      icon: <ToyBrick className="h-5 w-5" style={{ color: '#ec4899' }} />,
      className: 'admin-quick-link-blue',
    },
    {
      to: '/admin/configuracoes',
      title: 'Configurações',
      description: 'Ajustar preferências gerais da área administrativa.',
      icon: <Settings className="h-5 w-5" style={{ color: '#64748b' }} />,
      className: 'admin-quick-link-green',
    },
    {
      to: '/dashboard',
      title: 'Ver app do aluno',
      description: 'Abrir a experiência do aluno sem sair da conta admin.',
      icon: <ExternalLink className="h-5 w-5" style={{ color: '#0f172a' }} />,
      className: 'admin-quick-link-blue',
    },
  ]), []);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'agora';
    if (diffMins < 60) return `há ${diffMins}m`;
    if (diffHours < 24) return `há ${diffHours}h`;
    if (diffDays < 7) return `há ${diffDays}d`;

    return date.toLocaleDateString('pt-BR');
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'lesson_completed':
        return <BookOpen className="h-4 w-4" style={{ color: '#3b82f6' }} />;
      case 'work_submitted':
        return <TrendingUp className="h-4 w-4" style={{ color: '#10b981' }} />;
      case 'forum_post':
        return <MessageSquare className="h-4 w-4" style={{ color: '#8b5cf6' }} />;
      default:
        return <Activity className="h-4 w-4" style={{ color: '#6b7280' }} />;
    }
  };

  if (!metrics || !materialMetrics) {
    return (
      <div className="admin-container">
        <div style={{ textAlign: 'center', padding: '3rem 1.5rem', color: '#9ca3af' }}>
          Carregando dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <div style={{ position: 'relative', zIndex: 1, display: 'grid', gap: '1rem' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              width: 'fit-content',
              padding: '0.35rem 0.75rem',
              borderRadius: '9999px',
              background: 'rgba(255,255,255,0.16)',
              color: '#fff',
              fontSize: '0.8rem',
              fontWeight: 700,
            }}
          >
            <Shield className="h-4 w-4" />
            Área exclusiva do administrador
          </span>
          <div>
            <h1>Dashboard mestre do administrador</h1>
            <p>Entre aqui para controlar todas as funções principais do app: usuários, recursos, permissões, área infantil, submissões e configurações.</p>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            <Link
              to="/admin/recursos"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.65rem 1rem',
                borderRadius: '0.85rem',
                background: '#fff',
                color: '#1d4ed8',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              <BookOpen className="h-4 w-4" />
              Abrir central de recursos
            </Link>
            <Link
              to="/admin/usuarios"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.65rem 1rem',
                borderRadius: '0.85rem',
                background: 'rgba(255,255,255,0.14)',
                border: '1px solid rgba(255,255,255,0.24)',
                color: '#fff',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              <Users className="h-4 w-4" />
              Gerenciar usuários
            </Link>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid-4">
        {summaryCards.map((card) => (
          <div key={card.title} className="card admin-summary-card">
            <div className="card-header">
              <h3>{card.title}</h3>
              {card.icon}
            </div>
            <div className="card-content">
              <div className="value">{card.value}</div>
              <p className="description">
                <span className={`admin-trend ${card.tone === 'success' ? 'admin-trend-up' : 'admin-trend-down'}`}>
                  {card.tone === 'success' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                  {card.caption}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="admin-section-head">
          <h2>Centro de comando</h2>
          <p>Esta página aparece apenas para o admin e reúne todas as funções principais do dashboard.</p>
        </div>
        <div className="admin-quick-grid">
          {controlCenterLinks.map((item) => (
            <Link key={item.to} to={item.to} className={`admin-quick-link ${item.className}`}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                {item.icon}
                <h4>{item.title}</h4>
              </div>
              <p>{item.description}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid-main">
        {/* Recent Activities */}
        <div>
          <div className="card">
            <div className="admin-section-head">
              <h2>Atividade Recente</h2>
              <p>Últimas ações dos alunos na plataforma.</p>
            </div>
            <div style={{ padding: '1.5rem' }}>
              {activities.length === 0 ? (
                <p style={{ color: '#9ca3af', textAlign: 'center', margin: 0 }}>
                  Nenhuma atividade registrada
                </p>
              ) : (
                <div className="admin-activity-list">
                  {activities.map((activity) => (
                    <div
                      key={activity.id}
                      className="admin-activity-item"
                    >
                      <div className="admin-activity-icon">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                          <UserAvatar name={activity.studentName} />
                          <span style={{ fontWeight: '600', color: '#111827', fontSize: '0.875rem' }}>
                            {activity.studentName}
                          </span>
                        </div>
                        <p style={{ margin: '0.25rem 0 0', color: '#6b7280', fontSize: '0.875rem' }}>
                          {activity.activity}
                        </p>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#9ca3af', whiteSpace: 'nowrap' }}>
                        {formatTime(activity.timestamp)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Featured Students */}
        <div>
          <div className="card">
            <div className="admin-section-head">
              <h2>Alunos em Destaque</h2>
              <p>Maior e menor progresso.</p>
            </div>
            <div style={{ padding: '1.5rem', display: 'grid', gap: '2rem' }}>
              {/* Top Students */}
              <div>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: '600', color: '#10b981', margin: '0 0 1rem' }}>
                  <ArrowUp className="h-4 w-4" /> Top Progresso
                </h4>
                <div className="admin-student-list">
                  {featuredStudents.top.map((student) => (
                    <div key={student.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <UserAvatar name={student.name} />
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: '0 0 0.25rem', fontWeight: '500', fontSize: '0.875rem', color: '#111827' }}>
                          {student.name}
                        </p>
                        <div className="admin-progress-track">
                          <div
                            className="admin-progress-fill--success"
                            style={{ width: `${student.progress || 0}%` }}
                          />
                        </div>
                      </div>
                      <div style={{ fontWeight: '600', color: '#111827', fontSize: '0.875rem', minWidth: '40px', textAlign: 'right' }}>
                        {student.progress || 0}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Students */}
              <div>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: '600', color: '#ef4444', margin: '0 0 1rem' }}>
                  <ArrowDown className="h-4 w-4" /> Menor Progresso
                </h4>
                <div className="admin-student-list">
                  {featuredStudents.bottom.map((student) => (
                    <div key={student.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <UserAvatar name={student.name} />
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: '0 0 0.25rem', fontWeight: '500', fontSize: '0.875rem', color: '#111827' }}>
                          {student.name}
                        </p>
                        <div className="admin-progress-track">
                          <div
                            className="admin-progress-fill--danger"
                            style={{ width: `${student.progress || 0}%` }}
                          />
                        </div>
                      </div>
                      <div style={{ fontWeight: '600', color: '#111827', fontSize: '0.875rem', minWidth: '40px', textAlign: 'right' }}>
                        {student.progress || 0}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default AdminDashboardPage;
