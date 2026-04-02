import React from 'react';
import { NavLink } from 'react-router-dom';
import { Shield, Users, BarChart2 } from 'lucide-react';

const AdminAppShell = ({ children }) => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--background)' }}>
      <aside style={{ width: '240px', padding: '1rem', background: 'white', borderRight: '1px solid #e5e7eb' }}>
        <h2 style={{ color: 'var(--primary)', fontWeight: 800, marginBottom: '1rem' }}>Admin - Horizonte</h2>
        <nav style={{ display: 'grid', gap: '0.5rem' }}>
          <NavLink to='/admin'><Shield size={16} /> Panel</NavLink>
          <NavLink to='/admin/students'><Users size={16} /> Estudiantes</NavLink>
          <NavLink to='/dashboard'><BarChart2 size={16} /> Estadísticas</NavLink>
        </nav>
      </aside>
      <main style={{ flex: 1, padding: '1.5rem' }}>{children}</main>
    </div>
  );
};

export default AdminAppShell;
