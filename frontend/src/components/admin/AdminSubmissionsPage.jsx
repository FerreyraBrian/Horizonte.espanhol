import React from 'react';
import { FileText, CheckCircle2, Clock3 } from 'lucide-react';

const submissions = [
  { student: 'Mariana Costa', item: 'Redação A1 - Mi rutina diaria', status: 'Recebida', type: 'Escrita' },
  { student: 'Carlos Silva', item: 'Quiz A2 - Pretérito perfeito', status: 'Em revisão', type: 'Quiz' },
  { student: 'Ana Beatriz', item: 'Projeto final A1', status: 'Concluída', type: 'Projeto' },
];

const statusColor = {
  Recebida: 'badge badge-outline',
  'Em revisão': 'badge',
  Concluída: 'badge badge-default',
};

const AdminSubmissionsPage = () => {
  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Submissões</h1>
        <p>Visualize entregas recentes, quizzes enviados e projetos aguardando acompanhamento.</p>
      </div>

      <div className="card">
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
          <div>
            <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: '1.5rem', fontWeight: '600', color: '#111827' }}>Fila de correção</h2>
            <p style={{ color: '#6b7280', marginTop: '0.25rem' }}>Painel rápido para priorizar o acompanhamento pedagógico.</p>
          </div>
          <FileText className="h-6 w-6 text-gray-500" />
        </div>
        <div style={{ padding: '1.5rem' }}>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Aluno</th>
                  <th>Atividade</th>
                  <th>Tipo</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((submission) => (
                  <tr key={`${submission.student}-${submission.item}`}>
                    <td>{submission.student}</td>
                    <td>{submission.item}</td>
                    <td>{submission.type}</td>
                    <td>
                      <span className={statusColor[submission.status]}>
                        {submission.status === 'Concluída' ? <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> : <Clock3 className="h-3.5 w-3.5 mr-1" />}
                        {submission.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSubmissionsPage;
