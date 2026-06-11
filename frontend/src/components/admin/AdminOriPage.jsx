import React, { useMemo, useState } from 'react';
import { BarChart3, Filter, Sparkles, Users } from 'lucide-react';
import '../../styles/admin.css';

const sampleOriInteractions = [
  {
    id: 'ori-001',
    studentName: 'Carlos Silva',
    status: 'active',
    topic: 'Assinatura',
    question: 'O que está incluso na assinatura?',
    answeredAt: '2026-04-14T14:20:00.000Z',
  },
  {
    id: 'ori-002',
    studentName: 'Mariana Costa',
    status: 'active',
    topic: 'Acesso',
    question: 'Como eu acesso os materiais extras?',
    answeredAt: '2026-04-15T09:12:00.000Z',
  },
  {
    id: 'ori-003',
    studentName: 'João Pereira',
    status: 'active',
    topic: 'Conversação',
    question: 'Como melhorar a conversação no espanhol?',
    answeredAt: '2026-04-16T11:40:00.000Z',
  },
  {
    id: 'ori-004',
    studentName: 'Ana Souza',
    status: 'pending',
    topic: 'Gramática',
    question: 'Tenho suporte para dúvidas de gramática?',
    answeredAt: '2026-04-09T12:05:00.000Z',
  },
  {
    id: 'ori-005',
    studentName: 'Lucas Mendes',
    status: 'active',
    topic: 'Planejamento',
    question: 'Como começo meu curso?',
    answeredAt: '2026-04-15T18:22:00.000Z',
  },
];

const timeRanges = [
  { value: 'all', label: 'Todos os períodos' },
  { value: '7', label: 'Últimos 7 dias' },
  { value: '30', label: 'Últimos 30 dias' },
];

const statusOptions = [
  { value: 'all', label: 'Todos os status' },
  { value: 'active', label: 'Ativos' },
  { value: 'pending', label: 'Pendente' },
  { value: 'inactive', label: 'Inativos' },
];

const topics = [
  'Todos os tópicos',
  'Assinatura',
  'Acesso',
  'Conversação',
  'Gramática',
  'Planejamento',
];

const AdminOriPage = () => {
  const [timeRange, setTimeRange] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [topicFilter, setTopicFilter] = useState('Todos os tópicos');

  const filteredInteractions = useMemo(() => {
    const now = new Date();

    return sampleOriInteractions.filter((interaction) => {
      const interactionDate = new Date(interaction.answeredAt);
      const matchesStatus = statusFilter === 'all' || interaction.status === statusFilter;
      const matchesTopic = topicFilter === 'Todos os tópicos' || interaction.topic === topicFilter;
      const matchesTime = timeRange === 'all'
        || (timeRange === '7' && now - interactionDate <= 1000 * 60 * 60 * 24 * 7)
        || (timeRange === '30' && now - interactionDate <= 1000 * 60 * 60 * 24 * 30);

      return matchesStatus && matchesTopic && matchesTime;
    });
  }, [statusFilter, topicFilter, timeRange]);

  const statistics = useMemo(() => {
    const totalInteractions = filteredInteractions.length;
    const activeStudents = new Set(
      filteredInteractions.filter((interaction) => interaction.status === 'active')
        .map((interaction) => interaction.studentName),
    ).size;

    const topicCounts = filteredInteractions.reduce((acc, interaction) => {
      acc[interaction.topic] = (acc[interaction.topic] || 0) + 1;
      return acc;
    }, {});

    const topTopic = Object.entries(topicCounts)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'Nenhum';

    return {
      totalInteractions,
      activeStudents,
      topTopic,
      unanswered: Math.max(0, totalInteractions - 0),
    };
  }, [filteredInteractions]);

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
              background: 'rgba(59, 130, 246, 0.16)',
              color: '#1d4ed8',
              fontSize: '0.8rem',
              fontWeight: 700,
            }}
          >
            <Sparkles className="h-4 w-4" />
            Relatório do assistente Ori
          </span>
          <div>
            <h1>Ori: padrões e métricas</h1>
            <p>
              Veja como os alunos usam a assistente Ori, quais tópicos aparecem com mais frequência e quais
              interações precisam de atenção.
            </p>
          </div>
        </div>
      </div>

      <div className="grid-4" style={{ gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="card admin-summary-card">
          <div className="card-header">
            <Users className="h-6 w-6 text-gray-500" />
            Total de interações
          </div>
          <div className="card-value">{statistics.totalInteractions}</div>
          <div className="card-footer">Interações filtradas atualmente</div>
        </div>

        <div className="card admin-summary-card">
          <div className="card-header">
            <BarChart3 className="h-6 w-6 text-gray-500" />
            Alunos ativos
          </div>
          <div className="card-value">{statistics.activeStudents}</div>
          <div className="card-footer">Alunos com status ativo</div>
        </div>

        <div className="card admin-summary-card">
          <div className="card-header">
            <Sparkles className="h-6 w-6 text-gray-500" />
            Tópico mais consultado
          </div>
          <div className="card-value">{statistics.topTopic}</div>
          <div className="card-footer">Baseado nas interações filtradas</div>
        </div>
      </div>

      <div className="card admin-resource-panel" style={{ padding: '1.4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ marginBottom: '0.4rem' }}>Filtros de interação</h2>
            <p style={{ color: '#64748b' }}>Filtre as consultas para identificar padrões de uso e comportamento.</p>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.45rem', fontWeight: 700 }}>Período</label>
              <select value={timeRange} onChange={(event) => setTimeRange(event.target.value)} className="admin-resource-input">
                {timeRanges.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.45rem', fontWeight: 700 }}>Status do aluno</label>
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="admin-resource-input">
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.45rem', fontWeight: 700 }}>Tópico</label>
              <select value={topicFilter} onChange={(event) => setTopicFilter(event.target.value)} className="admin-resource-input">
                {topics.map((topic) => (
                  <option key={topic} value={topic}>{topic}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div>
          <h3 style={{ marginBottom: '1rem' }}>Interações recentes</h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {filteredInteractions.length === 0 ? (
              <div style={{ padding: '1rem', borderRadius: '1rem', background: '#f8fafc', color: '#475569' }}>
                Nenhuma interação corresponde aos filtros selecionados.
              </div>
            ) : (
              filteredInteractions.map((interaction) => (
                <div
                  key={interaction.id}
                  className="card"
                  style={{ padding: '1rem', borderRadius: '1rem', display: 'grid', gap: '0.5rem' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                    <strong>{interaction.studentName}</strong>
                    <span style={{ color: '#64748b', fontSize: '0.9rem' }}>{new Date(interaction.answeredAt).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <p style={{ margin: 0 }}><strong>Tópico:</strong> {interaction.topic}</p>
                  <p style={{ margin: 0, color: '#475569' }}>{interaction.question}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOriPage;
