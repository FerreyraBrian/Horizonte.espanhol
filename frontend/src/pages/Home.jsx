import React from 'react';
import { Link } from 'react-router-dom';

// Home page - Welcome landing page
const Home = () => (
  <div>
    <section className='card'>
      <h1>Bienvenido a Horizonte Español</h1>
      <p>Curso A1 para hablantes de portugués brasileño con inmersión cultural argentina.</p>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <Link to='/register' className='btn btn-primary'>Crear cuenta</Link>
        <Link to='/login' className='btn btn-secondary'>Iniciar sesión</Link>
      </div>
    </section>
    <section className='card' style={{ marginTop: '1rem' }}>
      <h2>30 lecciones estructuradas</h2>
      <p>Módulos: Fundamentos, Identidad, Vida diaria, Trabajo, Cultura e Integración.</p>
    </section>
  </div>
);

export default Home;
