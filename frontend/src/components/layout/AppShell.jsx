import React from 'react';
import { NavLink } from 'react-router-dom';
import { BarChart2, BookOpen, Home, User, ClipboardCheck } from 'lucide-react';

const AppShell = ({ children, userProgress }) => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--background)' }}>
      <aside style={{ width: '240px', padding: '1rem', background: 'white', borderRight: '1px solid #e5e7eb' }}>
        <h2 style={{ color: 'var(--primary)', fontWeight: 800, marginBottom: '1rem' }}>Horizonte Español</h2>
        <div className='card' style={{ marginBottom: '1rem' }}>
          <p>Progreso: {userProgress?.progress ?? 0}%</p>
          <div style={{ background: '#e5e7eb', borderRadius: '999px', overflow: 'hidden', height: '10px' }}>
            <div style={{ width: `${userProgress?.progress ?? 0}%`, height: '100%', background: 'var(--primary)' }} />
          </div>
        </div>
        <nav style={{ display: 'grid', gap: '0.5rem' }}>
          <NavLink to='/'><Home size={16} /> Inicio</NavLink>
          <NavLink to='/dashboard'><BarChart2 size={16} /> Dashboard</NavLink>
          <NavLink to='/lessons'><BookOpen size={16} /> Lecciones</NavLink>
          <NavLink to='/resources'><ClipboardCheck size={16} /> Recursos</NavLink>
          <NavLink to='/evaluations'><ClipboardCheck size={16} /> Evaluaciones</NavLink>
          <NavLink to='/profile'><User size={16} /> Perfil</NavLink>
        </nav>
      </aside>
      <main style={{ flex: 1, padding: '1.5rem' }}>{children}</main>
    </div>
  );
};

export default AppShell;
