import React from 'react';
import { Settings, ShieldCheck, Globe2, Users } from 'lucide-react';

const items = [
  {
    title: 'Segurança e acesso',
    icon: ShieldCheck,
    points: ['Rotas administrativas protegidas por papel de usuário.', 'Acesso de alunos depende de aprovação de status no backend.'],
  },
  {
    title: 'Ambiente web',
    icon: Globe2,
    points: ['Frontend em React + Vite.', 'Backend em Spring Boot com autenticação JWT.'],
  },
  {
    title: 'Operação da escola',
    icon: Users,
    points: ['Painel para acompanhar estudantes e ativações.', 'Trilha infantil com espaço administrativo separado.'],
  },
];

const AdminSettingsPage = () => {
  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Configurações</h1>
        <p>Visão geral das configurações atuais da plataforma e pontos de administração.</p>
      </div>

      <div className="grid-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <div className="card"><div className="card-header"><h3>Modo</h3><Settings className="h-6 w-6 text-gray-500" /></div><div className="card-content"><div className="value">Prod-ready</div><p className="description">Base pronta para evoluções</p></div></div>
      </div>

      <div className="grid-main">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.title} className="card">
              <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Icon className="h-5 w-5 text-gray-500" />
                <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: '1.35rem', fontWeight: '600', color: '#111827', margin: 0 }}>{item.title}</h2>
              </div>
              <div style={{ padding: '1.5rem' }}>
                <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#374151', display: 'grid', gap: '0.75rem' }}>
                  {item.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminSettingsPage;
