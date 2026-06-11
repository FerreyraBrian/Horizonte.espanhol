import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  BookOpenText,
  FileText,
  MessageCircle,
  Trophy,
  Calendar,
  Clock,
  Search,
  Filter,
  TrendingUp,
} from 'lucide-react';
import { activityService } from '../../services/storageService';
import UserAvatar from '../ui/UserAvatar';
import '../../styles/admin.css';

const AdminActivityPage = () => {
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');

  // Load activities
  useEffect(() => {
    const loadActivities = () => {
      const allActivities = activityService.getRecent(100);
      setActivities(allActivities);
    };
    loadActivities();
  }, []);

  // Filter activities
  useEffect(() => {
    let filtered = activities;

    if (searchTerm) {
      filtered = filtered.filter(
        (a) =>
          a.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          a.activity.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter((a) => a.type === typeFilter);
    }

    if (timeFilter !== 'all') {
      const now = new Date();
      const cutoff = {
        today: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
        week: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        month: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      };
      const cutoffTime = cutoff[timeFilter];
      filtered = filtered.filter((a) => new Date(a.timestamp) > cutoffTime);
    }

    setFilteredActivities(filtered);
  }, [activities, searchTerm, typeFilter, timeFilter]);

  // Activity statistics
  const stats = useMemo(() => {
    const typeCount = {};
    const studentCount = new Set();

    activities.forEach((a) => {
      typeCount[a.type] = (typeCount[a.type] || 0) + 1;
      studentCount.add(a.studentId);
    });

    return {
      totalActivities: activities.length,
      activeStudents: studentCount.size,
      typeBreakdown: typeCount,
    };
  }, [activities]);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'lesson_completed':
        return <BookOpenText className="h-4 w-4" style={{ color: '#3b82f6' }} />;
      case 'work_submitted':
        return <FileText className="h-4 w-4" style={{ color: '#10b981' }} />;
      case 'quiz_started':
        return <TrendingUp className="h-4 w-4" style={{ color: '#f59e0b' }} />;
      case 'forum_post':
        return <MessageCircle className="h-4 w-4" style={{ color: '#8b5cf6' }} />;
      case 'level_completed':
        return <Trophy className="h-4 w-4" style={{ color: '#ec4899' }} />;
      default:
        return <Activity className="h-4 w-4" style={{ color: '#6b7280' }} />;
    }
  };

  const getActivityLabel = (type) => {
    switch (type) {
      case 'lesson_completed':
        return 'Lição Completada';
      case 'work_submitted':
        return 'Trabalho Enviado';
      case 'quiz_started':
        return 'Quiz Iniciado';
      case 'forum_post':
        return 'Post no Fórum';
      case 'level_completed':
        return 'Nível Completado';
      default:
        return 'Atividade';
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'agora';
    if (diffMins < 60) return `há ${diffMins} min`;
    if (diffHours < 24) return `há ${diffHours}h`;
    if (diffDays < 7) return `há ${diffDays}d`;

    return date.toLocaleDateString('pt-BR');
  };

  const formatFullTime = (dateString) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Rastreamento de Atividades</h1>
        <p>Acompanhe as interações dos alunos na plataforma.</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid-4">
        <div className="card">
          <div className="card-header">
            <h3>Total de Atividades</h3>
            <Activity className="h-6 w-6 text-gray-500" />
          </div>
          <div className="card-content">
            <div className="value">{stats.totalActivities}</div>
            <p className="description">Registradas</p>
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <h3>Alunos Ativos</h3>
            <TrendingUp className="h-6 w-6 text-green-500" />
          </div>
          <div className="card-content">
            <div className="value" style={{ color: '#10b981' }}>
              {stats.activeStudents}
            </div>
            <p className="description">Com atividades</p>
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <h3>Lições Completadas</h3>
            <BookOpenText className="h-6 w-6 text-blue-500" />
          </div>
          <div className="card-content">
            <div className="value" style={{ color: '#3b82f6' }}>
              {stats.typeBreakdown['lesson_completed'] || 0}
            </div>
            <p className="description">Até agora</p>
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <h3>Trabalhos Enviados</h3>
            <FileText className="h-6 w-6 text-green-500" />
          </div>
          <div className="card-content">
            <div className="value" style={{ color: '#10b981' }}>
              {stats.typeBreakdown['work_submitted'] || 0}
            </div>
            <p className="description">Aguardando revisão</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ padding: '1.5rem', display: 'grid', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            {/* Search */}
            <div style={{ position: 'relative' }}>
              <Search
                className="h-5 w-5"
                style={{
                  position: 'absolute',
                  left: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af',
                }}
              />
              <input
                type="text"
                placeholder="Buscar por aluno ou atividade..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem 0.5rem 2.5rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                }}
              />
            </div>

            {/* Type Filter */}
            <div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  backgroundColor: 'white',
                }}
              >
                <option value="all">Todos os Tipos</option>
                <option value="lesson_completed">Lição Completada</option>
                <option value="work_submitted">Trabalho Enviado</option>
                <option value="quiz_started">Quiz Iniciado</option>
                <option value="forum_post">Post no Fórum</option>
                <option value="level_completed">Nível Completado</option>
              </select>
            </div>

            {/* Time Filter */}
            <div>
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  backgroundColor: 'white',
                }}
              >
                <option value="all">Todos os Períodos</option>
                <option value="today">Hoje</option>
                <option value="week">Últimos 7 dias</option>
                <option value="month">Últimos 30 dias</option>
              </select>
            </div>
          </div>

          <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
            Mostrando {filteredActivities.length} de {activities.length} atividades
          </p>
        </div>
      </div>

      {/* Activities List */}
      <div className="card">
        {filteredActivities.length === 0 ? (
          <div
            style={{
              padding: '3rem 1.5rem',
              textAlign: 'center',
              color: '#9ca3af',
            }}
          >
            <Activity className="h-12 w-12" style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
            <p>Nenhuma atividade encontrada</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 0 }}>
            {filteredActivities.map((activity, idx) => (
              <div
                key={activity.id}
                style={{
                  padding: '1.5rem',
                  borderBottom: idx < filteredActivities.length - 1 ? '1px solid #e5e7eb' : 'none',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f9fafb')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  {/* Icon */}
                  <div
                    style={{
                      padding: '0.5rem',
                      backgroundColor: '#f3f4f6',
                      borderRadius: '0.375rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: '2.5rem',
                      minHeight: '2.5rem',
                    }}
                  >
                    {getActivityIcon(activity.type)}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '0.5rem',
                      }}
                    >
                      <UserAvatar name={activity.studentName} />
                      <div>
                        <h4 style={{ margin: 0, fontWeight: '600', color: '#111827' }}>
                          {activity.studentName}
                        </h4>
                      </div>
                    </div>

                    <p style={{ margin: '0.5rem 0 0', color: '#374151', fontSize: '0.875rem' }}>
                      {activity.activity}
                    </p>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        marginTop: '0.75rem',
                      }}
                    >
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          fontSize: '0.75rem',
                          color: '#6b7280',
                          backgroundColor: '#f3f4f6',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px',
                        }}
                      >
                        <span>{getActivityLabel(activity.type)}</span>
                      </span>

                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          fontSize: '0.75rem',
                          color: '#6b7280',
                        }}
                        title={formatFullTime(activity.timestamp)}
                      >
                        <Clock className="h-3 w-3" />
                        {formatTime(activity.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Activity Type Breakdown Chart */}
      <div className="grid-main">
        <div className="card">
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
            <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: '1.5rem', fontWeight: '600', margin: 0 }}>
              Atividades por Tipo
            </h2>
          </div>
          <div style={{ padding: '1.5rem', display: 'grid', gap: '1rem' }}>
            {Object.entries(stats.typeBreakdown).length === 0 ? (
              <p style={{ color: '#9ca3af', textAlign: 'center', margin: 0 }}>
                Nenhuma atividade registrada
              </p>
            ) : (
              Object.entries(stats.typeBreakdown).map(([type, count]) => (
                <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div
                    style={{
                      minWidth: '150px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                    }}
                  >
                    {getActivityIcon(type)}
                    {getActivityLabel(type)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        height: '1.5rem',
                        backgroundColor: '#e5e7eb',
                        borderRadius: '0.375rem',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          backgroundColor: '#3b82f6',
                          width: `${(count / stats.totalActivities) * 100}%`,
                          transition: 'width 0.3s ease',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                          paddingRight: '0.5rem',
                          color: 'white',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                        }}
                      >
                        {count > 0 && `${count}`}
                      </div>
                    </div>
                  </div>
                  <div style={{ minWidth: '40px', textAlign: 'right', fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>
                    {Math.round((count / stats.totalActivities) * 100)}%
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card">
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
            <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: '1.5rem', fontWeight: '600', margin: 0 }}>
              Informações Úteis
            </h2>
          </div>
          <div style={{ padding: '1.5rem', display: 'grid', gap: '1rem' }}>
            <div style={{ padding: '1rem', backgroundColor: '#f0fdf4', borderRadius: '0.5rem', borderLeft: '4px solid #10b981' }}>
              <h4 style={{ margin: '0 0 0.5rem', fontSize: '0.875rem', fontWeight: '600', color: '#10b981' }}>
                Dica: Acompannhе o Engajamento
              </h4>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#065f46' }}>
                Foque em alunos com poucas atividades nas últimas semanas. Considere enviar lembretes personalizados.
              </p>
            </div>

            <div style={{ padding: '1rem', backgroundColor: '#fef3c7', borderRadius: '0.5rem', borderLeft: '4px solid #f59e0b' }}>
              <h4 style={{ margin: '0 0 0.5rem', fontSize: '0.875rem', fontWeight: '600', color: '#f59e0b' }}>
                Tendência de Atividades
              </h4>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#78350f' }}>
                {stats.totalActivities > 0
                  ? `Total de ${stats.totalActivities} atividades registradas de ${stats.activeStudents} alunos.`
                  : 'Nenhuma atividade ainda.'}
              </p>
            </div>

            <div style={{ padding: '1rem', backgroundColor: '#eff6ff', borderRadius: '0.5rem', borderLeft: '4px solid #3b82f6' }}>
              <h4 style={{ margin: '0 0 0.5rem', fontSize: '0.875rem', fontWeight: '600', color: '#3b82f6' }}>
                Próximo Passo
              </h4>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#1e40af' }}>
                Revise a página de Gerenciamento de Usuários para ativar contas pendentes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminActivityPage;
