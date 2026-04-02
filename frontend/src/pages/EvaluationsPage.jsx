import React from 'react';

const evaluations = [
  { id: 1, name: 'Evaluación Módulo 1', requiredLesson: 9 },
  { id: 2, name: 'Evaluación Módulo 2', requiredLesson: 18 },
  { id: 3, name: 'Evaluación Final A1', requiredLesson: 30 }
];

const EvaluationsPage = ({ userProgress }) => (
  <div>
    <h1>Evaluaciones</h1>
    <div style={{ display: 'grid', gap: '0.75rem' }}>
      {evaluations.map((ev) => {
        const available = userProgress.completedLessons.includes(ev.requiredLesson);
        return (
          <article key={ev.id} className='card' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3>{ev.name}</h3>
              <p>Requiere lección {ev.requiredLesson}</p>
            </div>
            <button disabled={!available} className={`btn ${available ? 'btn-accent' : 'btn-secondary'}`}>
              {available ? 'Comenzar' : 'Bloqueado'}
            </button>
          </article>
        );
      })}
    </div>
  </div>
);

export default EvaluationsPage;
