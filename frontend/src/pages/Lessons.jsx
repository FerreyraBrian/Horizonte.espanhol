import React from 'react';
import LessonCard from '../components/lessons/LessonCard';

const moduleNames = ['Fundamentos', 'Identidad y Entorno', 'Vida Diaria', 'Trabajo y Comunicación', 'Cultura y Viajes', 'Integración'];

const Lessons = ({ lessons }) => {
  const modules = moduleNames.map((name, idx) => ({ id: idx, name, items: lessons.filter((lesson) => lesson.moduleId === idx) }));

  return (
    <div>
      <h1>Lecciones</h1>
      {modules.map((mod) => (
        <section key={mod.id} style={{ marginBottom: '1rem' }}>
          <h2>{mod.name}</h2>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {mod.items.map((lesson) => <LessonCard key={lesson.id} lesson={lesson} />)}
          </div>
        </section>
      ))}
    </div>
  );
};

export default Lessons;
