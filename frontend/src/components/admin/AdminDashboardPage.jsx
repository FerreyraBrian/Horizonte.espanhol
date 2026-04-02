import React from 'react';

const AdminDashboardPage = () => {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '0.75rem' }}>
        <article className='card'>
          <h3>Total alumnos</h3>
          <p>125</p>
        </article>
        <article className='card'>
          <h3>Inscripciones pendientes</h3>
          <p>8</p>
        </article>
        <article className='card'>
          <h3>Progreso promedio</h3>
          <p>48%</p>
        </article>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
