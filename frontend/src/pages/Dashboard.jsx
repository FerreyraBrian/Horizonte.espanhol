import React from 'react';

const Dashboard = ({ userProgress, lessons }) => {
  const totalLessons = lessons.length;
  const completedLessons = userProgress.completedLessons.length;
  const current = userProgress.currentLesson;

  return (
    <div>
      <h1>Dashboard</h1>
      <div className='card'>
        <h2>Progreso general</h2>
        <p>Lecciones completadas: {completedLessons}/{totalLessons}</p>
        <p>Lección actual: {current}</p>
        <div style={{ background: '#e5e7eb', width: '100%', height: '10px', borderRadius: '999px' }}>
          <div style={{ width: `${userProgress.progress}%`, height: '100%', background: 'var(--primary)' }} />
        </div>
      </div>
      <section style={{ marginTop: '1rem' }}>
        <h2>Últimas lecciones</h2>
        <ul>
          {lessons.slice(0, 6).map((lesson) => (
            <li key={lesson.id}>{lesson.title} ({lesson.status})</li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default Dashboard;
