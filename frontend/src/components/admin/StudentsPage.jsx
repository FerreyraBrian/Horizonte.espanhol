import React from 'react';

const students = [
  { id: 1, name: 'Carla Silva', email: 'carla@example.com', status: 'active', progress: 40 },
  { id: 2, name: 'Rafael Souza', email: 'rafael@example.com', status: 'active', progress: 58 },
  { id: 3, name: 'Anita Costa', email: 'anita@example.com', status: 'pending', progress: 12 }
];

const StudentsPage = () => (
  <div>
    <h1>Estudiantes</h1>
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th style={{ textAlign: 'left', padding: '0.5rem' }}>Nombre</th>
          <th style={{ textAlign: 'left', padding: '0.5rem' }}>Email</th>
          <th style={{ textAlign: 'left', padding: '0.5rem' }}>Estado</th>
          <th style={{ textAlign: 'left', padding: '0.5rem' }}>Progreso</th>
        </tr>
      </thead>
      <tbody>
        {students.map((student) => (
          <tr key={student.id} style={{ borderTop: '1px solid #e5e7eb' }}>
            <td style={{ padding: '0.5rem' }}>{student.name}</td>
            <td style={{ padding: '0.5rem' }}>{student.email}</td>
            <td style={{ padding: '0.5rem' }}>{student.status}</td>
            <td style={{ padding: '0.5rem' }}>{student.progress}%</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default StudentsPage;
