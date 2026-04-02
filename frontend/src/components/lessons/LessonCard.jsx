import React from 'react';
import { CheckCircle2, PlayCircle, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

const statusIcon = (status) => {
  if (status === 'completed') return <CheckCircle2 color='var(--success)' size={18} title='Completado' />;
  if (status === 'current') return <PlayCircle color='var(--warning)' size={18} title='Actual' />;
  if (status === 'locked') return <Lock color='var(--locked)' size={18} title='Bloqueado' />;
  return <PlayCircle color='var(--accent)' size={18} title='Disponible' />;
};

const LessonCard = ({ lesson }) => (
  <article className='card' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <div>
      <h3 style={{ marginBottom: '0.25rem' }}>{lesson.id}. {lesson.title}</h3>
      <p>{lesson.shortSummary}</p>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', alignItems: 'flex-end' }}>
      {statusIcon(lesson.status)}
      <Link className='btn btn-secondary' to={`/lessons/${lesson.slug}`} style={{ fontSize: '0.85rem' }}>
        Ver lección
      </Link>
    </div>
  </article>
);

export default LessonCard;
