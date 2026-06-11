import React, { useMemo } from 'react';
import { ToyBrick, BookOpen, Trophy, ClipboardList } from 'lucide-react';
import { kidsCourses } from '../../services/mockData';

const AdminKidsPage = () => {
  const summary = useMemo(() => {
    const totalLevels = kidsCourses.length;
    const totalLessons = kidsCourses.reduce((sum, course) => sum + course.lessons.length, 0);

    return {
      totalLevels,
      totalLessons,
      totalActivities: totalLessons * 2,
    };
  }, []);

  const actions = [
    'Revisar a distribuição dos conteúdos por faixa etária.',
    'Planejar novas avaliações lúdicas por módulo.',
    'Validar materiais extras para impressão e apoio aos responsáveis.',
  ];

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Gestão do Espaço Infantil</h1>
        <p>Acompanhe a trilha infantil e organize melhorias para as próximas aventuras.</p>
      </div>

      <div className="grid-4">
        <div className="card"><div className="card-header"><h3>Níveis infantis</h3><ToyBrick className="h-6 w-6 text-gray-500" /></div><div className="card-content"><div className="value">{summary.totalLevels}</div><p className="description">Aventuras ativas</p></div></div>
        <div className="card"><div className="card-header"><h3>Aulas</h3><BookOpen className="h-6 w-6 text-gray-500" /></div><div className="card-content"><div className="value">{summary.totalLessons}</div><p className="description">Conteúdos disponíveis</p></div></div>
        <div className="card"><div className="card-header"><h3>Atividades</h3><ClipboardList className="h-6 w-6 text-gray-500" /></div><div className="card-content"><div className="value">{summary.totalActivities}</div><p className="description">Entre jogos e revisões</p></div></div>
        <div className="card"><div className="card-header"><h3>Meta atual</h3><Trophy className="h-6 w-6 text-gray-500" /></div><div className="card-content"><div className="value">100%</div><p className="description">Experiência amigável</p></div></div>
      </div>

      <div className="grid-main">
        <div className="card">
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
            <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: '1.5rem', fontWeight: '600', color: '#111827' }}>Mapa da trilha infantil</h2>
            <p style={{ color: '#6b7280', marginTop: '0.25rem' }}>Resumo das aventuras e volumes de aula.</p>
          </div>
          <div style={{ padding: '1.5rem', display: 'grid', gap: '1rem' }}>
            {kidsCourses.map((course) => (
              <div key={course.slug} style={{ border: '1px solid #e5e7eb', borderRadius: '1rem', padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ margin: 0, color: '#111827' }}>{course.title}</h3>
                    <p style={{ margin: '0.35rem 0 0', color: '#6b7280' }}>{course.lessons.length} aulas preparadas</p>
                  </div>
                  <span className="badge badge-outline">Nível {course.level}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
            <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: '1.5rem', fontWeight: '600', color: '#111827' }}>Próximas ações</h2>
          </div>
          <div style={{ padding: '1.5rem' }}>
            <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#374151', display: 'grid', gap: '0.75rem' }}>
              {actions.map((action) => (
                <li key={action}>{action}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminKidsPage;
